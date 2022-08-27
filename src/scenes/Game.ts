import * as Phaser from "phaser";

import { SceneKeys } from "../consts/SceneKeys";

import { Daredevil } from "../characters/Daredevil";
import { TextureKeys } from "../consts/TextureKeys";

import { Gamepad } from "../gamepads";

export class GameScene extends Phaser.Scene {
  private daredevil!: Daredevil
  private touchGamepad!: Phaser.GameObjects.DOMElement
  private Gamepad1 = new Gamepad()

  constructor(){
    super(SceneKeys.Game)
  }

  create(){
    const width = this.scale.width
    const height = this.scale.height

    this.add.image(
      0, 0,
      TextureKeys.Background,
    )
    .setOrigin(0, 0)
    .setScrollFactor(0, 0)

    window.addEventListener("gamepadconnected", this.Gamepad1.connect)
    window.addEventListener("gamepaddisconnected", this.Gamepad1.disconnect)

    this.touchGamepad = this.add.dom(400, 225)
    .createFromCache(TextureKeys.TouchGamepad)
    
    this.daredevil = new Daredevil(
      this,
      width * 0.1,
      height -30,
      this.touchGamepad,
      this.Gamepad1
    )
    const body = this.daredevil.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    
    this.add.existing(this.daredevil)
  }

  update(){
    this.Gamepad1.update()
  }
}