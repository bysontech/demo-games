export interface GameModule {
  launch(container: HTMLElement): void
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
