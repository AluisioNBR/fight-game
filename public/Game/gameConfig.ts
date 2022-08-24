import Phaser, { Game } from 'phaser'

import { Preloader } from './scenes/Preloader'
import { GameScene } from './scenes/Game'

const gameContainer = document.getElementById('game-container') as HTMLElement

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: gameContainer,
  width: 800,
  height: 450,
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

const game = new Game(gameConfig)