import type { GameMeta, GameModule } from '../types'
import { t } from '../i18n'

export class Launcher {
  private container: HTMLElement
  private wrapper: HTMLElement | null = null
  private currentGame: GameModule | null = null
  private currentMeta: GameMeta | null = null
  private onBack: () => void
  private boundStartKeydown: (e: KeyboardEvent) => void

  constructor(container: HTMLElement, onBack: () => void) {
    this.container = container
    this.onBack = onBack
    this.boundStartKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (this.wrapper?.querySelector('.launcher-start')) {
          this.startGame()
        }
      }
    }
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
    this.currentMeta = meta

    // Show start screen (Hub-style) with Start button
    this.showStartScreen(meta)
  }

  private showStartScreen(meta: GameMeta): void {
    if (!this.wrapper) return

    this.wrapper.innerHTML = ''
    this.wrapper.className = 'launcher launcher--active'

    const style = document.createElement('style')
    style.textContent = launcherStyles
    this.wrapper.appendChild(style)

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

    // Start screen content (match Hub design)
    const content = document.createElement('div')
    content.className = 'launcher-start'
    content.style.setProperty('--card-color', meta.color)
    content.innerHTML = `
      <div class="launcher-start-bg"></div>
      <div class="launcher-start-content">
        <div class="launcher-start-card">
          <div class="launcher-start-glow"></div>
          <div class="launcher-start-inner">
            <div class="launcher-start-icon">${meta.icon}</div>
            <div class="launcher-start-info">
              <h2 class="launcher-start-title">${meta.title}</h2>
              <p class="launcher-start-desc">${meta.description}</p>
            </div>
            <div class="launcher-start-howto">
              <p class="launcher-start-howto-title">${t('launcher.controls.title')}</p>
              <p class="launcher-start-howto-line">${t('launcher.controls.move')}</p>
              <p class="launcher-start-howto-line">${t('launcher.controls.jump')}</p>
            </div>
            <div class="launcher-start-stages">
              <span class="launcher-start-stages-text">5 STAGES</span>
              <div class="launcher-start-stages-dots">
                <span class="launcher-dot launcher-dot--active"></span>
                <span class="launcher-dot"></span>
                <span class="launcher-dot"></span>
                <span class="launcher-dot"></span>
                <span class="launcher-dot"></span>
              </div>
            </div>
            <button type="button" class="launcher-start-btn" id="launcher-start-btn">
              <span>${t('launcher.start')}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `
    this.wrapper.appendChild(content)

    const startBtn = this.wrapper.querySelector('#launcher-start-btn')!
    startBtn.addEventListener('click', () => this.startGame())
    document.addEventListener('keydown', this.boundStartKeydown)
  }

  private removeStartKeydown(): void {
    document.removeEventListener('keydown', this.boundStartKeydown)
  }

  private startGame(): void {
    if (!this.wrapper || !this.currentGame) return
    this.removeStartKeydown()

    // Replace start screen with game container
    const startEl = this.wrapper.querySelector('.launcher-start')
    if (startEl) startEl.remove()

    const gameContainer = document.createElement('div')
    gameContainer.className = 'launcher-game'
    this.wrapper.appendChild(gameContainer)

    this.currentGame.launch(gameContainer, {
      onTitleRequest: () => this.returnToStartScreen(),
    })
  }

  private returnToStartScreen(): void {
    if (!this.wrapper || !this.currentMeta) return
    if (this.currentGame) {
      this.currentGame.destroy()
      // Keep this.currentGame so スタート can call launch() again
    }
    const gameEl = this.wrapper.querySelector('.launcher-game')
    if (gameEl) gameEl.remove()
    this.showStartScreen(this.currentMeta)
  }

  close(): void {
    this.removeStartKeydown()
    if (this.currentGame) {
      this.currentGame.destroy()
      this.currentGame = null
    }
    this.currentMeta = null
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
    position: relative;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(244, 63, 94, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.06) 0%, transparent 50%),
      #0a0a0f;
  }

  .launcher--active::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
    background-size: 40px 40px;
    pointer-events: none;
  }

  .launcher-start-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .launcher-start {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 0;
    position: relative;
    z-index: 0;
  }

  .launcher-start-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 480px;
    padding: 2rem;
    margin: auto;
  }

  .launcher-start-card {
    position: relative;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    overflow: hidden;
    animation: launcherCardIn 0.5s ease-out;
  }

  .launcher-start-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    padding: 1px;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.02)
    );
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .launcher-start-glow {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--card-color) 12%, transparent),
      transparent 60%
    );
    pointer-events: none;
  }

  .launcher-start-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
  }

  .launcher-start-icon {
    width: 72px;
    height: 72px;
    border-radius: 18px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--card-color) 25%, #1e1e2e),
      color-mix(in srgb, var(--card-color) 10%, #1e1e2e)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.25rem;
    box-shadow: 0 8px 24px color-mix(in srgb, var(--card-color) 25%, transparent);
  }

  .launcher-start-info {
    text-align: center;
  }

  .launcher-start-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
    color: #f1f5f9;
  }

  .launcher-start-desc {
    font-size: 0.9rem;
    color: #94a3b8;
    margin: 0.5rem 0 0;
    line-height: 1.4;
  }

  .launcher-start-howto {
    text-align: center;
    padding: 0.75rem 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    margin-top: 0.5rem;
  }

  .launcher-start-howto-title {
    font-size: 0.85rem;
    color: #e2e8f0;
    margin: 0 0 0.35rem;
    font-weight: 600;
  }

  .launcher-start-howto-line {
    font-size: 0.8rem;
    color: #94a3b8;
    margin: 0.15rem 0;
  }

  .launcher-start-stages {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.75rem;
  }

  .launcher-start-stages-text {
    font-size: 0.7rem;
    color: #64748b;
    letter-spacing: 0.05em;
  }

  .launcher-start-stages-dots {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .launcher-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
  }

  .launcher-dot--active {
    background: color-mix(in srgb, var(--card-color) 70%, #6366f1);
  }

  .launcher-start-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border: none;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--card-color) 90%, #1e1e2e),
      color-mix(in srgb, var(--card-color) 70%, #1e1e2e)
    );
    color: #fff;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 4px 16px color-mix(in srgb, var(--card-color) 40%, transparent);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .launcher-start-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px color-mix(in srgb, var(--card-color) 50%, transparent);
  }

  .launcher-start-btn:active {
    transform: translateY(0);
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
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    z-index: 0;
    overflow: hidden;
  }

  /* Canvas wrapper: grows to fill, centers the canvas */
  .game-canvas-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    min-width: 0;
    width: 100%;
    overflow: hidden;
  }

  .launcher-game canvas {
    display: block;
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
                0 0 0 1px rgba(255, 255, 255, 0.06);
  }

  /* Mobile landscape: avoid horizontal shift by removing padding */
  @media (max-width: 1024px) and (orientation: landscape) {
    .launcher-game {
      padding: 0;
    }
  }

  /* ── HTML Touch Controls (outside canvas) ────────────── */
  .game-touch-controls {
    flex-shrink: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    box-sizing: border-box;
    -webkit-user-select: none;
    user-select: none;
  }

  .touch-dpad {
    display: flex;
    gap: 10px;
  }

  .touch-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border: none;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.06);
    color: #94a3b8;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    transition: background 0.1s, transform 0.1s;
  }

  .touch-btn:active, .touch-btn.active {
    background: rgba(99, 102, 241, 0.25);
    color: #e2e8f0;
    transform: scale(0.93);
  }

  .touch-btn--jump {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

  /* Portrait: larger buttons for easier tapping */
  @media (orientation: portrait) {
    .game-touch-controls {
      padding: 12px 16px 16px;
    }
    .touch-btn {
      width: 64px;
      height: 64px;
      border-radius: 16px;
    }
    .touch-btn--jump {
      width: 72px;
      height: 72px;
      border-radius: 50%;
    }
    .touch-dpad {
      gap: 12px;
    }
    .launcher-back {
      top: 8px;
      left: 8px;
      padding: 6px 10px;
      font-size: 0.75rem;
    }
    .launcher-start-content {
      padding: 1rem;
    }
    .launcher-start-inner {
      gap: 1rem;
      padding: 1.25rem;
    }
    .launcher-start-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      font-size: 1.75rem;
    }
    .launcher-start-title {
      font-size: 1.2rem;
    }
  }

  /* Mobile landscape: compact start screen so it fits / scrolls */
  @media (orientation: landscape) and (max-height: 500px) {
    .launcher--active {
      align-items: flex-start;
    }
    .launcher-start {
      align-items: flex-start;
      overflow-y: auto;
    }
    .launcher-start-content {
      padding: 0.75rem 1rem;
      margin: 0 auto;
    }
    .launcher-start-inner {
      gap: 0.75rem;
      padding: 1rem;
    }
    .launcher-start-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      font-size: 1.5rem;
    }
    .launcher-start-title {
      font-size: 1.1rem;
    }
    .launcher-start-desc {
      font-size: 0.8rem;
    }
    .launcher-start-howto {
      padding-top: 0.5rem;
      margin-top: 0.25rem;
    }
    .launcher-start-howto-title {
      font-size: 0.75rem;
      margin-bottom: 0.2rem;
    }
    .launcher-start-howto-line {
      font-size: 0.7rem;
    }
    .launcher-start-stages {
      margin-top: 0.25rem;
    }
    .launcher-start-btn {
      padding: 10px 22px;
      font-size: 0.9rem;
    }
    .launcher-back {
      top: 6px;
      left: 6px;
      padding: 5px 10px;
      font-size: 0.75rem;
    }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes launcherFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes launcherCardIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`
