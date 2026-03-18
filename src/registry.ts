import type { GameMeta } from './types'
import { t } from './i18n'

export const games: GameMeta[] = [
  {
    id: 'platformer',
    title: 'Platformer',
    get description() { return t('game.platformer.desc') },
    color: '#e74c3c',
    icon: '🎮',
    load: () => import('./games/platformer/index'),
  },
]
