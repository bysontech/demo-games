import { games } from '../registry'
import type { GameMeta } from '../types'

export class Hub {
  private container: HTMLElement
  private onSelectGame: (meta: GameMeta) => void

  constructor(container: HTMLElement, onSelectGame: (meta: GameMeta) => void) {
    this.container = container
    this.onSelectGame = onSelectGame
    this.render()
  }

  private render(): void {
    this.container.innerHTML = ''

    const wrapper = document.createElement('div')
    wrapper.className = 'hub'
    wrapper.innerHTML = `
      <div class="hub-bg"></div>
      <div class="hub-content">
        <header class="hub-header">
          <h1 class="hub-title">
            <span class="hub-title-accent">DEMO</span> GAMES
          </h1>
          <p class="hub-subtitle">Select a game to play</p>
        </header>
        <div class="hub-grid" id="hub-grid"></div>
        <footer class="hub-footer">
          <p>Press a card to start playing</p>
        </footer>
      </div>
    `

    const style = document.createElement('style')
    style.textContent = hubStyles
    wrapper.appendChild(style)
    this.container.appendChild(wrapper)

    const grid = wrapper.querySelector('#hub-grid')!
    games.forEach((meta, index) => {
      const card = this.createCard(meta, index)
      grid.appendChild(card)
    })
  }

  private createCard(meta: GameMeta, index: number): HTMLElement {
    const card = document.createElement('button')
    card.className = 'game-card'
    card.style.setProperty('--card-color', meta.color)
    card.style.setProperty('--card-delay', `${index * 0.1}s`)

    card.innerHTML = `
      <div class="game-card-glow"></div>
      <div class="game-card-inner">
        <div class="game-card-icon">${meta.icon}</div>
        <div class="game-card-info">
          <h2 class="game-card-title">${meta.title}</h2>
          <p class="game-card-desc">${meta.description}</p>
        </div>
        <div class="game-card-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    `

    card.addEventListener('click', () => {
      card.classList.add('game-card--launching')
      setTimeout(() => this.onSelectGame(meta), 400)
    })

    return card
  }

  destroy(): void {
    this.container.innerHTML = ''
  }
}

const hubStyles = `
  .hub {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .hub-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 80% 20%, rgba(244, 63, 94, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
      #0a0a0f;
  }

  .hub-bg::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0);
    background-size: 40px 40px;
  }

  .hub-content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 720px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2.5rem;
  }

  .hub-header {
    text-align: center;
    animation: hubFadeIn 0.6s ease-out;
  }

  .hub-title {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: -0.02em;
    line-height: 1;
    color: #f1f5f9;
  }

  .hub-title-accent {
    background: linear-gradient(135deg, #6366f1, #f43f5e);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hub-subtitle {
    margin-top: 0.75rem;
    font-size: 1rem;
    color: #64748b;
    font-weight: 400;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  .hub-grid {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .game-card {
    position: relative;
    display: block;
    width: 100%;
    border: none;
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    cursor: pointer;
    text-align: left;
    color: #f1f5f9;
    font-family: inherit;
    outline: none;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: cardSlideIn 0.5s ease-out both;
    animation-delay: var(--card-delay);
    overflow: hidden;
  }

  .game-card::before {
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

  .game-card:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow:
      0 0 30px -5px color-mix(in srgb, var(--card-color) 30%, transparent),
      0 20px 40px -10px rgba(0, 0, 0, 0.4);
  }

  .game-card:hover .game-card-glow {
    opacity: 1;
  }

  .game-card:hover .game-card-arrow {
    opacity: 1;
    transform: translateX(0);
  }

  .game-card:active {
    transform: translateY(0) scale(0.99);
  }

  .game-card--launching {
    animation: cardLaunch 0.4s ease-in forwards !important;
  }

  .game-card-glow {
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--card-color) 8%, transparent),
      transparent 60%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .game-card-inner {
    position: relative;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 1.5rem;
  }

  .game-card-icon {
    flex-shrink: 0;
    width: 56px;
    height: 56px;
    border-radius: 14px;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--card-color) 25%, #1e1e2e),
      color-mix(in srgb, var(--card-color) 10%, #1e1e2e)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    box-shadow: 0 4px 12px color-mix(in srgb, var(--card-color) 20%, transparent);
  }

  .game-card-info {
    flex: 1;
    min-width: 0;
  }

  .game-card-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin: 0;
    line-height: 1.3;
  }

  .game-card-desc {
    font-size: 0.875rem;
    color: #94a3b8;
    margin: 0.25rem 0 0;
    line-height: 1.4;
  }

  .game-card-arrow {
    flex-shrink: 0;
    opacity: 0;
    transform: translateX(-8px);
    transition: opacity 0.25s ease, transform 0.25s ease;
    color: var(--card-color);
  }

  .hub-footer {
    animation: hubFadeIn 0.6s ease-out 0.4s both;
  }

  .hub-footer p {
    font-size: 0.8rem;
    color: #475569;
    letter-spacing: 0.03em;
  }

  @keyframes hubFadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardLaunch {
    0% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(0.95); }
  }
`
