import * as Phaser from 'phaser'

import { SceneKeys } from '../consts/SceneKeys'
import { TextureKeys } from '../consts/TextureKeys'
import { AnimationKeys } from '../consts/AnimationKeys'

export class Preloader extends Phaser.Scene {
  constructor(){
    super(SceneKeys.Preloader)
  }

  preload(){
    this.load.image(
      TextureKeys.Background,
      '../assets/backgrounds/background.jpg'
    )

    this.load.atlas(
      TextureKeys.Daredevil,
      '../assets/characters/daredevil.png',
      '../assets/characters/daredevil.json'
    )

    this.load.html(
      TextureKeys.FullscreenButton,
      '../assets/html/fullscreenButton.html'
    )

    this.load.html(
      TextureKeys.TouchGamepad,
      '../assets/html/touchKeyboard.html'
    )
  }

  create(){
    this.createDaredevilAnims()

    this.scene.start(SceneKeys.Game)
  }

  createDaredevilAnims(){
    this.anims.create({
      key: AnimationKeys.DaredevilIntro,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 6,
        prefix: 'intro_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 20000,
      frameRate: 10,
      repeat: 0
    })

    this.anims.create({
      key: AnimationKeys.DaredevilStandLeft,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 1,
        prefix: 'left_stand_',
        zeroPad: 2,
        suffix: '.png'
      }),
      delay: 0,
      duration: 2000,
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.DaredevilStandRight,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 1,
        prefix: 'right_stand_',
        zeroPad: 2,
        suffix: '.png'
      }),
      delay: 0,
      duration: 2000,
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.DaredevilRunLeft,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 1,
        end: 2,
        prefix: 'run_left_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 2000,
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.DaredevilRunRight,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 1,
        end: 2,
        prefix: 'run_right_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 2000,
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_jump.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_jump.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilFallLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_fall.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilFallRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_fall.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilCrouchLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_crouch.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilCrouchRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_crouch.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilRadarSense,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 6,
        prefix: 'sense_radar_',
        zeroPad: 2,
        suffix: '.png'
      }),
      frameRate: 10,
      repeat: -1
    })
  }
}