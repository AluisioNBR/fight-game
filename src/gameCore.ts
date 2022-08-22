import Phaser from 'phaser'

import { Preloader } from './scenes/Preloader'
import { Game } from './scenes/Game'

export function generateGameConfig(gameParent: HTMLElement): Phaser.Types.Core.GameConfig{
  return {
    type: Phaser.AUTO,
    parent: gameParent,
    width: 800,
    height: 450,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 200 },
        debug: false
      }
    },
    scene: [Preloader, Game]
  }
}