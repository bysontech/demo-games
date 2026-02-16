import { LevelData } from './level1'

export const level2: LevelData = {
  name: 'Level 2: Jump Challenge',
  levelNumber: 2,
  playerStartX: 100,
  playerStartY: 400,
  backgroundColor: 0x0c1f14,
  platforms: [
    // Ground with gaps
    { x: 0, y: 550, width: 250, height: 50 },
    { x: 350, y: 550, width: 200, height: 50 },
    { x: 650, y: 550, width: 150, height: 50 },
    // Mid platforms
    { x: 200, y: 450, width: 100, height: 20 },
    { x: 400, y: 350, width: 120, height: 20 },
    { x: 600, y: 250, width: 100, height: 20 },
  ],
  enemies: [
    { x: 300, y: 530, type: 'walker' },
    { x: 450, y: 330, type: 'walker' },
    { x: 650, y: 230, type: 'walker' },
  ],
  goalX: 650,
  goalY: 200,
}
