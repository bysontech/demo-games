export interface Platform {
  x: number
  y: number
  width: number
  height: number
}

export interface Enemy {
  x: number
  y: number
  type: 'walker' | 'flyer'
}

export interface LevelData {
  name: string
  levelNumber: number
  playerStartX: number
  playerStartY: number
  platforms: Platform[]
  enemies: Enemy[]
  goalX: number
  goalY: number
  backgroundColor: number
}

export const level1: LevelData = {
  name: 'Level 1: First Steps',
  levelNumber: 1,
  playerStartX: 100,
  playerStartY: 400,
  backgroundColor: 0x0c1929,
  platforms: [
    // Ground
    { x: 0, y: 550, width: 800, height: 50 },
    // Platforms
    { x: 300, y: 450, width: 150, height: 20 },
    { x: 500, y: 350, width: 150, height: 20 },
    { x: 700, y: 250, width: 100, height: 20 },
  ],
  enemies: [
    { x: 400, y: 430, type: 'walker' },
    { x: 600, y: 330, type: 'walker' },
  ],
  goalX: 750,
  goalY: 200,
}
