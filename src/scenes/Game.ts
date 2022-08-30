import * as Phaser from "phaser";

import { SceneKeys } from "../consts/SceneKeys";

import { Daredevil } from "../characters/Daredevil";
import { TextureKeys } from "../consts/TextureKeys";

import { Gamepad } from "../gamepads";

enum Fullscreen {
  Disabled,
  Active
}

export class GameScene extends Phaser.Scene {
  private deviceWidth = window.screen.width
  private FullscreenState = Fullscreen.Disabled
  private fullscreenButton!: Phaser.GameObjects.DOMElement
  private Background!: Phaser.GameObjects.Image
  private daredevil!: Daredevil
  private touchGamepad!: Phaser.GameObjects.DOMElement
  private Gamepad1 = new Gamepad()

  constructor(){
    super(SceneKeys.Game)
  }

  create(){
    const width = this.scale.width
    const height = this.scale.height

    this.Background = this.add.image(
      0, 0,
      TextureKeys.Background,
    )
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)

    document.addEventListener('resize', () => this.resizeGame())

    window.addEventListener("gamepadconnected", (event) => {
      this.Gamepad1.connect(event)
      this.showGamepadMessage(
        `Gamepad ${event.gamepad.index + 1} conectado: ${event.gamepad.id}. ${event.gamepad.buttons.length} buttons, ${event.gamepad.axes.length} axes.`
      )
    })
    window.addEventListener("gamepaddisconnected", (event) => {
      this.Gamepad1.disconnect(event)

      this.showGamepadMessage(
        `Gamepad ${event.gamepad.index + 1} desconectado: ${event.gamepad.id}`
      )
    })

    this.Gamepad1.addListener('press', 'select', () => this.toggleFullscreen())

    this.fullscreenButton = this.add.dom(this.Background.width - 10, 10)
    this.fullscreenButton
    .createFromCache(TextureKeys.FullscreenButton)
    .getChildByID('fullscreen-button')
    .addEventListener('click', () => this.toggleFullscreen())

    this.touchGamepad = this.add.dom(10, 10)
    .setOrigin(0, 0)
    .createFromCache(TextureKeys.TouchGamepad)

    if(this.deviceWidth > 800)
      this.touchGamepad.setVisible(false)
    
    this.daredevil = new Daredevil(
      this,
      width * 0.1,
      height - 50,
      this.touchGamepad,
      this.Gamepad1
    )
    const body = this.daredevil.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    
    this.add.existing(this.daredevil)
  }

  showGamepadMessage(message: string){
    const gamepadMessageStyles: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#fdfdfd',
      backgroundColor: '#0008',
      padding: { top: 8, bottom: 8, left: 8, right: 8 },
      wordWrap: { width: 600 },
      align: 'center',
      fontSize: '1.2rem'
    }

    const messageX = this.scale.isFullscreen ?
    this.Background.getTopCenter().x / 2: this.Background.width / 8

    const gamepadMessage = this.add.text(
      messageX,
      this.Background.getTopCenter().y,
      message,
      gamepadMessageStyles
    )

    setTimeout(() => {
      gamepadMessage.destroy()
    }, 10000)
  }

  update(){
    this.Gamepad1.update()

    this.resizeGame()
  }

  toggleFullscreen(){
    if(this.FullscreenState == Fullscreen.Disabled){
      document.getElementById('game-container').requestFullscreen()
      this.FullscreenState = Fullscreen.Active
    }

    else if(this.FullscreenState == Fullscreen.Active){
      document.exitFullscreen()
      this.FullscreenState = Fullscreen.Disabled
    }
  }

  private resizeGame() {
    let orientation: unknown = this.scale.orientation
    orientation = orientation as string
    
    if(this.scale.isFullscreen && this.deviceWidth >= 800){
      this.Background.setScale(1.8, 1.7)
      this.game.scale.resize(1.8, 1.7)
    }

    else if(this.deviceWidth >= 800 || orientation == 'landscape-primary'){
      this.Background.setScale(1.2, 1)
      this.game.scale.resize(1.2, 1)
    }

    else if(this.scale.isFullscreen && this.deviceWidth < 800){
      this.Background.setScale(1.2, 1)
      this.game.scale.resize(1.2, 1)
    }

    else if(this.deviceWidth < 800){
      this.Background.setScale(0.6, 0.6)
      this.game.scale.resize(0.6, 0.6)
    }

    else {
      this.Background.setScale(1, 1)
      this.game.scale.resize(1, 1)
    }

    this.physics.world.setBounds(
      this.Background.scaleX,
      this.Background.scaleY,
      this.game.scale.width,
      this.game.scale.height
    )
  }
}
