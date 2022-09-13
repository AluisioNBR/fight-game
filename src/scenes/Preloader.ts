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

    this.load.image(
      TextureKeys.FullscreenButton,
      '/assets/buttons/fullscreen-icon.svg'
    )

    this.load.image(
      TextureKeys.Q_Button,
      '/assets/buttons/q-icon.svg'
    )

    this.load.image(
      TextureKeys.E_Button,
      '/assets/buttons/e-icon.svg'
    )

    this.load.image(
      TextureKeys.W_Button,
      '/assets/buttons/w-icon.svg'
    )

    this.load.image(
      TextureKeys.A_Button,
      '/assets/buttons/a-icon.svg'
    )

    this.load.image(
      TextureKeys.S_Button,
      '/assets/buttons/s-icon.svg'
    )

    this.load.image(
      TextureKeys.D_Button,
      '/assets/buttons/d-icon.svg'
    )

    this.load.image(
      TextureKeys.J_Button,
      '/assets/buttons/j-icon.svg'
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
      frameRate: 5,
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
      frameRate: 5,
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
      key: AnimationKeys.DaredevilGuardLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_guard.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilGuardRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_guard.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilGuardActiveLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_guard_active.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilGuardActiveRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_guard_active.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpGuardLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_jump_guard.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpGuardRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_jump_guard.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpGuardActiveLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_jump_guard_active.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpGuardActiveRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_jump_guard_active.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilXHitLeft,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 2,
        prefix: 'left_xhit_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 200,
      frameRate: 20
    })

    this.anims.create({
      key: AnimationKeys.DaredevilXHitRight,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 2,
        prefix: 'right_xhit_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 200,
      frameRate: 20
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpXHitLeft,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 1,
        prefix: 'left_jump_xhit_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 200,
      frameRate: 20
    })

    this.anims.create({
      key: AnimationKeys.DaredevilJumpXHitRight,
      frames: this.anims.generateFrameNames(TextureKeys.Daredevil, {
        start: 0,
        end: 1,
        prefix: 'right_jump_xhit_',
        zeroPad: 2,
        suffix: '.png'
      }),
      duration: 200,
      frameRate: 20
    })

    this.anims.create({
      key: AnimationKeys.DaredevilRadarmodeOnLeft,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'left_radarmode.png'
			}]
    })

    this.anims.create({
      key: AnimationKeys.DaredevilRadarmodeOnRight,
      frames: [{
				key: TextureKeys.Daredevil,
				frame: 'right_radarmode.png'
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