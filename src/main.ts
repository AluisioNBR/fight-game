import * as Phaser from 'phaser'

import { Preloader } from './scenes/Preloader'
import { GameScene } from './scenes/Game'

const gameContainer = document.getElementById('game-container') as HTMLElement

const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Fight Game',
  type: Phaser.AUTO,
  parent: gameContainer,
  width: '100%',
  height: '100%',
  scale: {
    expandParent: true,
    mode: Phaser.Scale.RESIZE,
    autoRound: true,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 },
      debug: false
    }
  },
  scene: [Preloader, GameScene]
}

export const game = new Phaser.Game(gameConfig)
