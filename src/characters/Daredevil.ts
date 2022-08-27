import * as Phaser from "phaser"

import { TextureKeys } from '../consts/TextureKeys'
import { AnimationKeys } from '../consts/AnimationKeys'

import { Gamepad } from "../gamepads"

enum DaredevilState {
  Intro,
  IntroJump,
  Stand,
  Jump,
  Fall,
  Crouch
}

enum Direction {
  Left,
  Right
}

export class Daredevil extends Phaser.GameObjects.Container {
  private daredevil: Phaser.GameObjects.Sprite
  private daredevilDirection!: Direction
	private radarSense: Phaser.GameObjects.Sprite
  private daredevilState!: DaredevilState

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
    .play(AnimationKeys.DaredevilRadarSense)

    this.daredevil = scene.add.sprite(
      0, 0,
      TextureKeys.Daredevil
    )
    .play(AnimationKeys.DaredevilIntro)
    this.daredevilState = DaredevilState.Intro
    
    this.add(this.radarSense)
    this.add(this.daredevil)

    this.Keyboard = scene.input.keyboard
    this.touchGamepad = touchGamepad
    this.Gamepad = gamepad

    scene.physics.add.existing(this)
	}

	preUpdate(){
    const body = this.body as Phaser.Physics.Arcade.Body

    switch (this.daredevilState) {
      case DaredevilState.Intro:
        body.setVelocityX(-100)

        const introIsEnding = this.daredevil.anims.getProgress() == 1
        if(introIsEnding){
          this.setRadarSenseEnableTo(false)
          body.setVelocityX(50)
          this.jump(this.getCrouchDirection())
        }
        break;

      case DaredevilState.IntroJump:
        this.checkIfHaveReachedHaximumHeight()
        break;

      case DaredevilState.Stand:
        const daredevilJump = () => this.jump(this.getCrouchDirection())
        const daredevilToLeft = () => {
          this.move(
            -300,
            Direction.Left,
            AnimationKeys.DaredevilRunLeft
          )
        }
        const daredevilToRight = () => {
          this.move(
            300,
            Direction.Right,
            AnimationKeys.DaredevilRunRight
          )
        }
        const daredevilStopMove = () => this.stopMove(body)

        this.Keyboard.on('keydown-W', daredevilJump)
        this.touchGamepad.getChildByID('top')
        .addEventListener('mousedown', daredevilJump)

        this.Keyboard.on('keydown-A', daredevilToLeft)
        this.touchGamepad.getChildByID('left')
        .addEventListener('click', daredevilToLeft)

        this.Keyboard.on('keydown-D', daredevilToRight)
        this.touchGamepad.getChildByID('right')
        .addEventListener('click', daredevilToRight)
        
        this.Keyboard.on('keyup-A', daredevilStopMove)
        this.touchGamepad.getChildByID('left')
        .addEventListener('mouseup', daredevilStopMove)

        this.Keyboard.on('keyup-D', daredevilStopMove)
        this.touchGamepad.getChildByID('right')
        .addEventListener('mouseup', daredevilStopMove)

        if(this.Gamepad.connected)
          this.gamepadInputs({
            daredevilJump,
            daredevilToLeft,
            daredevilToRight,
            daredevilStopMove
          })
        break;
      
      case DaredevilState.Jump:
        this.checkIfHaveReachedHaximumHeight()
        break;
      
      case DaredevilState.Fall:
        if(body.blocked.down){
          this.crouch()
          body.setVelocityX(0)
        }
        else
          this.daredevil.play(this.getFallDirection(), true)
        break;

      case DaredevilState.Crouch:
        setTimeout(() => {
          this.daredevil.play(this.getStandDirection(), true)
          this.daredevilState = DaredevilState.Stand
        }, 250)
        break;
    
      default:
        break;
    }
  }

  private gamepadInputs(
    listeners: {
      daredevilJump: () => void,
      daredevilToLeft: () => void,
      daredevilToRight: () => void,
      daredevilStopMove: () => void
    }){
    const isJump = this.Gamepad.getKey('dup') == 1 || this.Gamepad.getKey('leftstick_y') <= -0.5
    const isMoveLeft = this.Gamepad.getKey('dleft') == 1 || this.Gamepad.getKey('leftstick_x') <= -0.5
    const isMoveRight = this.Gamepad.getKey('dright') == 1 || this.Gamepad.getKey('leftstick_x') >= 0.5
    const isNotMove = (
      this.Gamepad.getKey('dleft') == 0 &&
      this.Gamepad.getKey('dright') == 0 &&
      this.Gamepad.getKey('leftstick_x') > -0.5 &&
      this.Gamepad.getKey('leftstick_x') < 0.5
    )
    
    if(isJump)
      listeners.daredevilJump()

    if(isMoveLeft)
      listeners.daredevilToLeft()

    if(isMoveRight)
      listeners.daredevilToRight()

    if(isNotMove)
      listeners.daredevilStopMove()
  }

  private move(
    velocity: number,
    direction: Direction,
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
  
  private crouch(){
    const crouch = this.getCrouchDirection()

    this.daredevil.play(crouch, true)
    this.daredevilState = DaredevilState.Crouch
  }

  private jump(crouch: AnimationKeys.DaredevilCrouchLeft | AnimationKeys.DaredevilCrouchRight){
    this.daredevil.play(crouch, true)

    const body = this.body as Phaser.Physics.Arcade.Body
    
    this.daredevilState = this.getJumpState()
    
    const jump = this.getJumpDirection()

    body.setAccelerationY(-400)
    this.daredevil.play(jump, true)

    setTimeout(() => body.setAccelerationY(0), 1000)
  }
  
  private getJumpState(){
    return this.daredevilState == DaredevilState.IntroJump ?
    DaredevilState.IntroJump: DaredevilState.Jump
  }
  
  private getJumpDirection(){
    if(this.daredevilState == DaredevilState.IntroJump)
      return this.daredevilDirection == Direction.Left ?
    AnimationKeys.DaredevilIntroJump: AnimationKeys.DaredevilIntroJump
    
    else
      return this.daredevilDirection == Direction.Left ?
    AnimationKeys.DaredevilJumpLeft: AnimationKeys.DaredevilJumpRight
  }

  private getStandDirection(){
    return this.daredevilDirection == Direction.Left ?
    AnimationKeys.DaredevilStandLeft: AnimationKeys.DaredevilStandRight
  }
  
  private getCrouchDirection(){
    return this.daredevilDirection == Direction.Left ?
    AnimationKeys.DaredevilCrouchLeft: AnimationKeys.DaredevilCrouchRight
  }

  private getFallDirection(){
    return this.daredevilDirection == Direction.Left ?
    AnimationKeys.DaredevilFallLeft: AnimationKeys.DaredevilFallRight
  }

  private checkIfHaveReachedHaximumHeight(){
    const body = this.body as Phaser.Physics.Arcade.Body

    if(body.velocity.y > 0){
      this.daredevil.play(this.getFallDirection(), true)
      this.daredevilState = DaredevilState.Fall
    }
    else
      this.daredevil.play(this.getJumpDirection(), true)
  }

	public setRadarSenseEnableTo(enable: boolean){
    this.radarSense.setVisible(enable)
  }
}
