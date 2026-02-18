export type ControlScheme = 1 | 2

export interface GameLaunchOptions {
  onTitleRequest?: () => void
  controlScheme?: ControlScheme
}

export interface GameModule {
  launch(container: HTMLElement, options?: GameLaunchOptions): void
  destroy(): void
}

export interface GameMeta {
  id: string
  title: string
  description: string
  color: string
  icon: string
  load: () => Promise<{ default: GameModule }>
}
