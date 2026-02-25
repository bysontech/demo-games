import Phaser from 'phaser'
import type { GameModule, GameLaunchOptions } from '../../types'
import { BootScene } from './scenes/BootScene'
import { MenuScene } from './scenes/MenuScene'
import { GameScene } from './scenes/GameScene'
import { GameConfig } from './config'

let game: Phaser.Game | null = null
let touchControlsEl: HTMLElement | null = null

const platformerGame: GameModule = {
  launch(container: HTMLElement, options?: GameLaunchOptions) {
    // Wrap canvas in a sub-container so we can place controls outside it
    const canvasWrap = document.createElement('div')
    canvasWrap.className = 'game-canvas-wrap'
    container.appendChild(canvasWrap)

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: GameConfig.width,
      height: GameConfig.height,
      parent: canvasWrap,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      input: {
        activePointers: 3,
      },
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

    // Create HTML touch controls for touch devices
    const isTouch =
      'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) {
      touchControlsEl = createTouchControls(game)
      container.appendChild(touchControlsEl)
    }
  },

  destroy() {
    if (touchControlsEl) {
      touchControlsEl.remove()
      touchControlsEl = null
    }
    if (game) {
      game.destroy(true)
      game = null
    }
  },
}

export default platformerGame

// ── HTML Touch Controls ─────────────────────────────────

function createTouchControls(game: Phaser.Game): HTMLElement {
  const el = document.createElement('div')
  el.className = 'game-touch-controls'

  // D-pad (left / right)
  const dpad = document.createElement('div')
  dpad.className = 'touch-dpad'

  const leftBtn = document.createElement('button')
  leftBtn.className = 'touch-btn'
  leftBtn.type = 'button'
  leftBtn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  const rightBtn = document.createElement('button')
  rightBtn.className = 'touch-btn'
  rightBtn.type = 'button'
  rightBtn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  dpad.appendChild(leftBtn)
  dpad.appendChild(rightBtn)

  // Jump button
  const jumpBtn = document.createElement('button')
  jumpBtn.className = 'touch-btn touch-btn--jump'
  jumpBtn.type = 'button'
  jumpBtn.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32"><path d="M6 15l6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  el.appendChild(dpad)
  el.appendChild(jumpBtn)

  // ── Wire up touch events → game.registry ────────────

  const bind = (
    btn: HTMLElement,
    key: 'touchLeft' | 'touchRight' | 'touchJump',
  ) => {
    const down = (e: Event) => {
      e.preventDefault()
      btn.classList.add('active')
      game.registry.set(key, true)
    }
    const up = (e: Event) => {
      e.preventDefault()
      btn.classList.remove('active')
      if (key !== 'touchJump') {
        game.registry.set(key, false)
      }
      // touchJump is consumed per-frame by GameScene
    }
    btn.addEventListener('touchstart', down, { passive: false })
    btn.addEventListener('touchend', up, { passive: false })
    btn.addEventListener('touchcancel', up, { passive: false })
    // Mouse fallback (dev tools)
    btn.addEventListener('mousedown', down)
    btn.addEventListener('mouseup', up)
    btn.addEventListener('mouseleave', up)
  }

  bind(leftBtn, 'touchLeft')
  bind(rightBtn, 'touchRight')
  bind(jumpBtn, 'touchJump')

  return el
}
