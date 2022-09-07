import * as Phaser from "phaser"

import { TextureKeys } from '../consts/TextureKeys'
import { AnimationKeys } from '../consts/AnimationKeys'

import { Gamepad } from "../gamepads"

import {
  CharacterState,
  CharacterDirection,
} from './CharacterGeneral'

export class Daredevil extends Phaser.GameObjects.Container {
  private daredevil: Phaser.GameObjects.Sprite
	private radarSense: Phaser.GameObjects.Sprite
  private daredevilState!: CharacterState
  private daredevilDirection!: CharacterDirection

  private touchAndKeyboardIsActive = false
  private Keyboard!: Phaser.Input.Keyboard.KeyboardPlugin
  private Gamepad!: Gamepad

  private ScreenButtons!: Phaser.GameObjects.Image[]
  private qButton!: Phaser.GameObjects.Image
  private eButton!: Phaser.GameObjects.Image
  private wButton!: Phaser.GameObjects.Image
  private aButton!: Phaser.GameObjects.Image
  private sButton!: Phaser.GameObjects.Image
  private dButton!: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, x: number, y: number, gamepad: Gamepad){
		super(scene, x, y)
    
    this.radarSense = scene.add.sprite(0, -25, TextureKeys.Daredevil)
    .setScale(1.8, 1.7)
    .play(AnimationKeys.DaredevilRadarSense)

    this.daredevil = scene.add.sprite(0, 0, TextureKeys.Daredevil)
    .setScale(1.8, 1.7)
    .play(AnimationKeys.DaredevilIntro)

    this.daredevilState = CharacterState.Intro
    
    this.add(this.radarSense)
    this.add(this.daredevil)

    this.Keyboard = scene.input.keyboard
    this.Gamepad = gamepad
    
    scene.physics.add.existing(this)
	}

  public createScreenButtons(scene: Phaser.Scene, touchButtonsVisible: boolean) {
    this.qButton = scene.add.image(310, 160, TextureKeys.Q_Button)
    this.eButton = scene.add.image(470, 160, TextureKeys.E_Button)
    this.wButton = scene.add.image(90, 240, TextureKeys.W_Button)
    this.aButton = scene.add.image(10, 320, TextureKeys.A_Button)
    this.sButton = scene.add.image(90, 320, TextureKeys.S_Button)
    this.dButton = scene.add.image(170, 320, TextureKeys.D_Button)

    this.ScreenButtons = [
      this.qButton,
      this.eButton,
      this.wButton,
      this.aButton,
      this.sButton,
      this.dButton
    ]

    for (const button of this.ScreenButtons) {
      button
      .setOrigin(0, 0)
      .setScale(0.5)
      .setInteractive()
      .setVisible(touchButtonsVisible)
    }
  }

	preUpdate(){
    this.resizeDaredevil()
    this.resizeScreenButtons()

    switch (this.daredevilState) {
      case CharacterState.Intro: this.daredevilIntro()
        break;

      case CharacterState.Stand: this.daredevilStand()
        break;
      
      case CharacterState.Jump: this.checkIfHaveReachedHaximumHeight()
        break;
      
      case CharacterState.Fall: this.daredevilFall()
        break;

      case CharacterState.Crouch: this.daredevilCrouch()
        break;
    
      default: break;
    }
  }
  
  private resizeDaredevil() {
    const action = this.scene.scale.isFullscreen ?
      () => {
        this.daredevil.setScale(2.8, 2.7)
        this.radarSense.setScale(2.8, 2.7)
      }:
      () => {
        this.daredevil.setScale(1.8, 1.7)
        this.radarSense.setScale(1.8, 1.7)
      }
    
    action()
  }

  private resizeScreenButtons() {
    if(this.isBigScreenSize()){
      this.qButton.setPosition(720, 240)
      this.eButton.setPosition(800, 320)
      
      this.wButton.setPosition(90, 240)
      this.aButton.setPosition(10, 320)
      this.sButton.setPosition(90, 320)
      this.dButton.setPosition(170, 320)

      for (const button of this.ScreenButtons)
        button.setScale(0.5)
    }
    else {
      this.qButton.setPosition(320, 180)
      this.eButton.setPosition(360, 220)

      this.wButton.setPosition(50, 180)
      this.aButton.setPosition(10, 220)
      this.sButton.setPosition(50, 220)
      this.dButton.setPosition(90, 220)

      for (const button of this.ScreenButtons)
        button.setScale(0.25)
    }
  }

  private isBigScreenSize() {
    return (
      this.isNotADesktopDeviceOnFullscreen() ||
      this.isADesktopDeviceOrAMobileDeviceInLandscapeOrientation()
    )
  }

  private isADesktopDeviceOrAMobileDeviceInLandscapeOrientation() {
    let scaleOrientation: unknown = this.scene.scale.orientation
    let orientation = scaleOrientation as string

    return this.scene.game.device.os.desktop || orientation == 'landscape-primary'
  }

  private isNotADesktopDeviceOnFullscreen() {
    return this.scene.scale.isFullscreen && this.isNotADesktopDevice()
  }

  private isNotADesktopDevice() {
    return !this.scene.game.device.os.desktop
  }

  private daredevilIntro() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(-200)

    if(this.introIsEnding){
      this.setRadarSenseEnableTo(false)
      body.setVelocityX(50)
      this.jump(this.getCrouchDirection())
    }
  }

  private introIsEnding() {
    return this.daredevil.anims.getProgress() == 1
  }

  private daredevilStand() {
    if(this.Gamepad.connected){
      this.activeGamepadInputs()
      this.touchAndKeyboardIsActive = false
    }
      
    else if(this.touchAndKeyboardIsNotActiveAndGamepadIsDisconnected()){
      this.activeKeyboardInputs()
      this.activeTouchInputs()
      this.touchAndKeyboardIsActive = true
    }
  }

  private touchAndKeyboardIsNotActiveAndGamepadIsDisconnected() {
    return this.touchAndKeyboardIsActive != true && this.Gamepad.connected == false
  }

  private daredevilFall() {
    const body = this.body as Phaser.Physics.Arcade.Body

    if(body.blocked.down){
      this.crouch()
      body.setVelocityX(0)
    }
    else
      this.daredevil.play(this.getFallDirection(), true)
  }

  private activeKeyboardInputs() {
    const callbacks = this.getActionsCallbacks()
    
    this.Keyboard.on('keydown-W', callbacks.daredevilJump)
    this.Keyboard.on('keydown-A', callbacks.daredevilToLeft)
    this.Keyboard.on('keydown-D', callbacks.daredevilToRight)
    this.Keyboard.on('keydown-Q', () => this.guard())
    this.Keyboard.on('keydown-E', () => this.radarModeOn())

    this.Keyboard.on('keyup-A', callbacks.daredevilStopMove)
    this.Keyboard.on('keyup-D', callbacks.daredevilStopMove)
    this.Keyboard.on('keyup-Q', callbacks.daredevilStopMove)
    this.Keyboard.on('keyup-E', () => this.radarModeOff())
  }

  private activeTouchInputs() {
    const callbacks = this.getActionsCallbacks()

    this.wButton.addListener('pointerdown', callbacks.daredevilJump)
    this.aButton.addListener('pointerdown', callbacks.daredevilToLeft)
    this.dButton.addListener('pointerdown', callbacks.daredevilToRight)
    
    this.aButton.addListener('pointerup', callbacks.daredevilStopMove)
    this.dButton.addListener('pointerup', callbacks.daredevilStopMove)
    
    this.qButton.addListener('pointerdown', () => this.guard())
    this.eButton.addListener('pointerdown', () => this.radarModeOn())
    
    this.qButton.addListener('pointerup', callbacks.daredevilStopMove)
    this.eButton.addListener('pointerup', () => this.radarModeOff())
  }

  private activeGamepadInputs(){
    const callbacks = this.getActionsCallbacks()

    this.Gamepad.addListener('press', 'dup', callbacks.daredevilJump)
    this.Gamepad.addListener('change', 'leftstick_y', () => {
      if(this.Gamepad.getKey('leftstick_y') <= -0.25)
        callbacks.daredevilJump()
    })

    this.Gamepad.addListener('press', 'dleft', callbacks.daredevilToLeft)
    this.Gamepad.addListener('press', 'dright', callbacks.daredevilToRight)
    this.Gamepad.addListener('change', 'leftstick_x', () => {
      if(this.Gamepad.getKey('leftstick_x') <= -0.25)
        callbacks.daredevilToLeft()

      else if(this.Gamepad.getKey('leftstick_x') >= 0.25)
        callbacks.daredevilToRight()
    })

    this.Gamepad.addListener('press', 'l1', () => this.guard())
    this.Gamepad.addListener('press', 'r1', () => this.radarModeOn())

    if(this.isMovementStop())
      callbacks.daredevilStopMove()
    
    if(this.chargeIsNotActive)
      this.radarModeOff()
  }

  private isMovementStop(){
    const dpadsIsNotPressed = this.Gamepad.getKey('dleft') == 0 && this.Gamepad.getKey('dright') == 0
    const leftsticksXIsNotChanged = this.Gamepad.getKey('leftstick_x') < 0.25 && this.Gamepad.getKey('leftstick_x') > -0.25
    const guardIsNotActive = this.Gamepad.getKey('l1') == 0

    return dpadsIsNotPressed && leftsticksXIsNotChanged && guardIsNotActive
  }

  private chargeIsNotActive(){
    return this.Gamepad.getKey('r1') == 0
  }

  private daredevilCrouch() {
    const body = this.body as Phaser.Physics.Arcade.Body
    setTimeout(() => {
      body.setVelocityY(0)
      this.daredevil.play(this.getStandDirection(), true)
      this.daredevilState = CharacterState.Stand
    }, 250)
  }

  private getActionsCallbacks() {
    const daredevilJump = () => this.jump(this.getCrouchDirection())
    const daredevilToLeft = () => {
      this.move(
        -500,
        CharacterDirection.Left,
        AnimationKeys.DaredevilRunLeft
      )
    }
    const daredevilToRight = () => {
      this.move(
        500,
        CharacterDirection.Right,
        AnimationKeys.DaredevilRunRight
      )
    }
    const daredevilStopMove = () => this.stopMove()
    
    return {
      daredevilJump,
      daredevilToLeft,
      daredevilToRight,
      daredevilStopMove
    }
  }

  private move(
    velocity: number,
    direction: CharacterDirection,
    animation: AnimationKeys
  ){
    this.daredevilDirection = direction

    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(velocity)

    if(body.blocked.down)
      this.daredevil.play(animation, true)
  }

  private stopMove(){
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)

    if(body.blocked.down)
      this.daredevil.play(this.getStandDirection(), true)
  }
  
  private crouch(){
    const crouch = this.getCrouchDirection()

    this.daredevil.play(crouch, true)
    this.daredevilState = CharacterState.Crouch
  }

  private jump(crouch: AnimationKeys.DaredevilCrouchLeft | AnimationKeys.DaredevilCrouchRight){
    const body = this.body as Phaser.Physics.Arcade.Body

    if(body.blocked.down){
      this.daredevil.play(crouch, true)

      const jump = this.getJumpDirection()
      this.daredevilState = CharacterState.Jump

      body.setVelocityY(-450)
      this.daredevil.play(jump, true)

      setTimeout(() => {
        body.setVelocityY(300)
      }, 600)
    }
  }

  private guard() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(0)

    if(!body.blocked.down)
      this.daredevil.play(this.getJumpGuardDirection(), true)
    else
      this.daredevil.play(this.getGuardDirection(), true)
  }

  private radarModeOn() {
    const body = this.body as Phaser.Physics.Arcade.Body

    if(body.blocked.down) {
      body.setVelocityX(0)
      
      this.daredevil.play(this.getRadarmodeDirection(), true)
      this.setRadarSenseEnableTo(true)
    }
  }

  private radarModeOff() {
    this.daredevil.play(this.getStandDirection(), true)
    this.setRadarSenseEnableTo(false)
  }

  private getStandDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilStandLeft: AnimationKeys.DaredevilStandRight
  }
  
  private getJumpDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilJumpLeft: AnimationKeys.DaredevilJumpRight
  }
  
  private getCrouchDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilCrouchLeft: AnimationKeys.DaredevilCrouchRight
  }

  private getFallDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilFallLeft: AnimationKeys.DaredevilFallRight
  }

  private getGuardDirection() {
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilGuardLeft: AnimationKeys.DaredevilGuardRight
  }
  
  private getJumpGuardDirection() {
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilJumpGuardLeft: AnimationKeys.DaredevilJumpGuardRight
  }

  private getRadarmodeDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilRadarmodeOnLeft: AnimationKeys.DaredevilRadarmodeOnRight
  }

  private checkIfHaveReachedHaximumHeight(){
    const body = this.body as Phaser.Physics.Arcade.Body

    if(body.velocity.y > 0){
      this.daredevil.play(this.getFallDirection(), true)
      this.daredevilState = CharacterState.Fall
    }
    else
      this.daredevil.play(this.getJumpDirection(), true)
  }

	private setRadarSenseEnableTo(enable: boolean){
    this.radarSense.setVisible(enable)
  }
}
