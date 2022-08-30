import * as Phaser from "phaser"

import { TextureKeys } from '../consts/TextureKeys'
import { AnimationKeys } from '../consts/AnimationKeys'

import { Gamepad } from "../gamepads"

import type { DaredevilInputListeners } from './Daredevil.types'
import {
  CharacterState,
  CharacterDirection,
} from './CharacterGeneral'

export class Daredevil extends Phaser.GameObjects.Container {
  private daredevil: Phaser.GameObjects.Sprite
  private daredevilDirection!: CharacterDirection
	private radarSense: Phaser.GameObjects.Sprite
  private daredevilState!: CharacterState

  private Keyboard!: Phaser.Input.Keyboard.KeyboardPlugin
  private touchGamepad!: Phaser.GameObjects.DOMElement
  private Gamepad!: Gamepad

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    touchGamepad: Phaser.GameObjects.DOMElement,
    gamepad: Gamepad
  ){
		super(scene, x, y)
    
    this.radarSense = scene.add.sprite(
      0, -25,
      TextureKeys.Daredevil
    )
    .setScale(1.8, 1.7)
    .play(AnimationKeys.DaredevilRadarSense)

    this.daredevil = scene.add.sprite(
      0, 0,
      TextureKeys.Daredevil
    )
    .setScale(1.8, 1.7)
    .play(AnimationKeys.DaredevilIntro)
    this.daredevilState = CharacterState.Intro
    
    this.add(this.radarSense)
    this.add(this.daredevil)

    this.Keyboard = scene.input.keyboard
    this.touchGamepad = touchGamepad
    this.Gamepad = gamepad

    scene.physics.add.existing(this)
	}

	preUpdate(){
    if(this.scene.scale.isFullscreen){
      this.daredevil.setScale(2.8, 2.7)
      this.radarSense.setScale(2.8, 2.7)
    }
    else {
      this.daredevil.setScale(1.8, 1.7)
      this.radarSense.setScale(1.8, 1.7)
    }

    switch (this.daredevilState) {
      case CharacterState.Intro:
        this.daredevilIntro()
        break;

      case CharacterState.Stand:
        this.daredevilStand()
        break;
      
      case CharacterState.Jump:
        this.checkIfHaveReachedHaximumHeight()
        break;
      
      case CharacterState.Fall:
        this.daredevilFall()
        break;

      case CharacterState.Crouch:
        this.daredevilCrouch()
        break;
    
      default:
        break;
    }
  }

  private daredevilIntro() {
    const body = this.body as Phaser.Physics.Arcade.Body
    body.setVelocityX(-200)

    const introIsEnding = this.daredevil.anims.getProgress() == 1
    if(introIsEnding){
      this.setRadarSenseEnableTo(false)
      body.setVelocityX(50)
      this.jump(this.getCrouchDirection())
    }
  }

  private daredevilStand() {
    if(this.Gamepad.connected)
      this.activeGamepadInputs()
      
    else {
      this.activeKeyboardInputs()
      this.activeTouchInputs()
    }
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
    const {
      daredevilJump,
      daredevilToLeft,
      daredevilToRight,
      daredevilStopMove
    } = this.getActionsCallbacks()
    
    this.Keyboard.on('keydown-W', daredevilJump)
    this.Keyboard.on('keydown-A', daredevilToLeft)
    this.Keyboard.on('keydown-D', daredevilToRight)

    this.Keyboard.on('keyup-A', daredevilStopMove)
    this.Keyboard.on('keyup-D', daredevilStopMove)
  }

  private activeTouchInputs() {
    const {
      daredevilJump,
      daredevilToLeft,
      daredevilToRight,
      daredevilStopMove
    } = this.getActionsCallbacks()
    
    this.touchGamepad.getChildByID('top')
    .addEventListener('mousedown', daredevilJump)
    this.touchGamepad.getChildByID('left')
    .addEventListener('click', daredevilToLeft)
    this.touchGamepad.getChildByID('right')
    .addEventListener('click', daredevilToRight)
    
    this.touchGamepad.getChildByID('left')
    .addEventListener('mouseup', daredevilStopMove)
    this.touchGamepad.getChildByID('right')
    .addEventListener('mouseup', daredevilStopMove)
  }

  private activeGamepadInputs(){
    const {
      daredevilJump,
      daredevilToLeft,
      daredevilToRight,
      daredevilStopMove
    } = this.getActionsCallbacks()

    this.Gamepad.addListener('press', 'dup', daredevilJump)
    this.Gamepad.addListener('change', 'leftstick_y', () => {
      if(this.Gamepad.getKey('leftstick_y') <= -0.25)
        daredevilJump()
    })

    this.Gamepad.addListener('press', 'dleft', daredevilToLeft)
    this.Gamepad.addListener('press', 'dright', daredevilToRight)
    this.Gamepad.addListener('change', 'leftstick_x', () => {
      if(this.Gamepad.getKey('leftstick_x') <= -0.25)
        daredevilToLeft()

      else if(this.Gamepad.getKey('leftstick_x') >= 0.25)
        daredevilToRight()
    })
    
    if(this.isNotMove())
      daredevilStopMove()
  }

  private daredevilCrouch() {
    setTimeout(() => {
      this.daredevil.play(this.getStandDirection(), true)
      this.daredevilState = CharacterState.Stand
    }, 250)
  }

  private getActionsCallbacks() {
    const body = this.body as Phaser.Physics.Arcade.Body

    const daredevilJump = () => this.jump(this.getCrouchDirection())
    const daredevilToLeft = () => {
      this.move(
        -400,
        CharacterDirection.Left,
        AnimationKeys.DaredevilRunLeft
      )
    }
    const daredevilToRight = () => {
      this.move(
        400,
        CharacterDirection.Right,
        AnimationKeys.DaredevilRunRight
      )
    }
    const daredevilStopMove = () => this.stopMove(body)
    
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

  private stopMove(body: Phaser.Physics.Arcade.Body){
    body.setVelocityX(0)

    if(body.blocked.down)
      this.daredevil.play(this.getStandDirection(), true)
  }

  private isNotMove(){
    return (
      this.Gamepad.getKey('dleft') == 0 &&
      this.Gamepad.getKey('dright') == 0 &&
      this.Gamepad.getKey('leftstick_x') > -0.25 &&
      this.Gamepad.getKey('leftstick_x') < 0.25
    )
  }
  
  private crouch(){
    const crouch = this.getCrouchDirection()

    this.daredevil.play(crouch, true)
    this.daredevilState = CharacterState.Crouch
  }

  private jump(crouch: AnimationKeys.DaredevilCrouchLeft | AnimationKeys.DaredevilCrouchRight){
    this.daredevil.play(crouch, true)

    const body = this.body as Phaser.Physics.Arcade.Body

    const jump = this.getJumpDirection()
    this.daredevilState = CharacterState.Jump

    body.setAccelerationY(-400)
    this.daredevil.play(jump, true)

    setTimeout(() => body.setAccelerationY(0), 1000)
  }
  
  private getJumpDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilJumpLeft: AnimationKeys.DaredevilJumpRight
  }

  private getStandDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilStandLeft: AnimationKeys.DaredevilStandRight
  }
  
  private getCrouchDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilCrouchLeft: AnimationKeys.DaredevilCrouchRight
  }

  private getFallDirection(){
    return this.daredevilDirection == CharacterDirection.Left ?
    AnimationKeys.DaredevilFallLeft: AnimationKeys.DaredevilFallRight
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

	public setRadarSenseEnableTo(enable: boolean){
    this.radarSense.setVisible(enable)
  }
}
