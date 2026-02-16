import { LevelData } from './level1'

export const level3: LevelData = {
  name: 'Level 3: Enemy Swarm',
  levelNumber: 3,
  playerStartX: 100,
  playerStartY: 400,
  backgroundColor: 0x1f0c18,
  platforms: [
    // Ground
    { x: 0, y: 550, width: 800, height: 50 },
    // Platforms in zigzag
    { x: 150, y: 450, width: 100, height: 20 },
    { x: 350, y: 380, width: 100, height: 20 },
    { x: 550, y: 310, width: 100, height: 20 },
    { x: 700, y: 240, width: 100, height: 20 },
  ],
  enemies: [
    { x: 300, y: 530, type: 'walker' },
    { x: 400, y: 530, type: 'walker' },
    { x: 200, y: 430, type: 'walker' },
    { x: 400, y: 360, type: 'walker' },
    { x: 600, y: 290, type: 'walker' },
  ],
  goalX: 750,
  goalY: 190,
}
