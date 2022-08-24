import Phaser from "phaser";

import { SceneKeys } from "../consts/SceneKeys";

import { Daredevil } from "../characters/Daredevil";
import { TextureKeys } from "../consts/TextureKeys";

export class GameScene extends Phaser.Scene {
  private daredevil!: Daredevil
  private touchGamepad!: Phaser.GameObjects.DOMElement
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

    this.touchGamepad = this.add.dom(400, 225)
    .createFromCache(TextureKeys.TouchGamepad)
    
    this.daredevil = new Daredevil(
      this,
      width * 0.1,
      height -30,
      this.touchGamepad
    )
    const body = this.daredevil.body as Phaser.Physics.Arcade.Body
    body.setCollideWorldBounds(true)
    
    this.add.existing(this.daredevil)
  }
}