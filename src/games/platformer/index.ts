import Phaser from 'phaser'
import type { GameModule, GameLaunchOptions } from '../../types'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { GameScene } from './scenes/GameScene'
import { GameConfig } from './config'

let game: Phaser.Game | null = null

const platformerGame: GameModule = {
  launch(container: HTMLElement, options?: GameLaunchOptions) {
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GameConfig.width,
      height: GameConfig.height,
      parent: container,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
        },
      },
      scene: [BootScene, MenuScene, GameScene],
    }

    game = new Phaser.Game(config)
    game.registry.set('onTitleRequest', options?.onTitleRequest)
    game.registry.set('controlScheme', options?.controlScheme ?? 1)
  },

  destroy() {
    if (game) {
      game.destroy(true)
      game = null
    }
  },
}

export default platformerGame
