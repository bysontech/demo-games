import type { GameMeta, GameModule } from '../types'

export class Launcher {
  private container: HTMLElement
  private wrapper: HTMLElement | null = null
  private currentGame: GameModule | null = null
  private onBack: () => void

  constructor(container: HTMLElement, onBack: () => void) {
    this.container = container
    this.onBack = onBack
  }

  async launch(meta: GameMeta): Promise<void> {
    this.container.innerHTML = ''

    // Create wrapper with loading state
    this.wrapper = document.createElement('div')
    this.wrapper.className = 'launcher'
    this.wrapper.innerHTML = `
      <div class="launcher-loading">
        <div class="launcher-spinner"></div>
        <p>Loading ${meta.title}...</p>
      </div>
    `

    const style = document.createElement('style')
    style.textContent = launcherStyles
    this.wrapper.appendChild(style)
    this.container.appendChild(this.wrapper)

    // Load the game module
    const mod = await meta.load()
    this.currentGame = mod.default

    // Replace loading with game container
    this.wrapper.innerHTML = ''
    this.wrapper.className = 'launcher launcher--active'

    // Back button
    const backBtn = document.createElement('button')
    backBtn.className = 'launcher-back'
    backBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Back</span>
    `
    backBtn.addEventListener('click', () => this.close())
    this.wrapper.appendChild(backBtn)

    // Game container
    const gameContainer = document.createElement('div')
    gameContainer.className = 'launcher-game'
    this.wrapper.appendChild(gameContainer)

    const reStyle = document.createElement('style')
    reStyle.textContent = launcherStyles
    this.wrapper.appendChild(reStyle)

    // Launch the game
    this.currentGame.launch(gameContainer)
  }

  close(): void {
    if (this.currentGame) {
      this.currentGame.destroy()
      this.currentGame = null
    }
    if (this.wrapper) {
      this.wrapper.innerHTML = ''
      this.wrapper = null
    }
    this.onBack()
  }
}

const launcherStyles = `
  .launcher {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0f;
    position: relative;
  }

  .launcher-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    color: #94a3b8;
    font-size: 0.95rem;
    animation: launcherFadeIn 0.3s ease;
  }

  .launcher-spinner {
    width: 36px;
    height: 36px;
    border: 3px solid rgba(99, 102, 241, 0.15);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .launcher--active {
    flex-direction: column;
    gap: 0;
    animation: launcherFadeIn 0.3s ease;
  }

  .launcher-back {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    background: rgba(15, 15, 25, 0.85);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    color: #cbd5e1;
    font-family: inherit;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, transform 0.15s;
  }

  .launcher-back:hover {
    background: rgba(99, 102, 241, 0.15);
    color: #f1f5f9;
    transform: translateX(-2px);
  }

  .launcher-back:active {
    transform: translateX(0) scale(0.97);
  }

  .launcher-game {
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes launcherFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`
