export const GameConfig = {
  width: 800,
  height: 600,
  gravity: 800,
  playerSpeed: 200,
  playerJumpVelocity: -400,
  enemySpeed: 100,
  lives: 3,
} as const

export type GameConfigType = typeof GameConfig
