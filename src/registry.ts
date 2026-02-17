import type { GameMeta } from './types'

export const games: GameMeta[] = [
  {
    id: 'platformer',
    title: 'Platformer',
    description: '固定画面アクション。全5ステージを攻略せよ！',
    color: '#e74c3c',
    icon: '🎮',
    load: () => import('./games/platformer/index'),
  },
]
