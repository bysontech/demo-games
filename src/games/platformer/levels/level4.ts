import { LevelData } from './level1'

export const level4: LevelData = {
  name: 'Level 4: Precision Jump',
  levelNumber: 4,
  playerStartX: 100,
  playerStartY: 400,
  backgroundColor: 0xDDA0DD,
  platforms: [
    // Starting platform
    { x: 0, y: 550, width: 200, height: 50 },
    // Small platforms with big gaps
    { x: 300, y: 480, width: 80, height: 20 },
    { x: 450, y: 400, width: 80, height: 20 },
    { x: 300, y: 320, width: 80, height: 20 },
    { x: 500, y: 250, width: 80, height: 20 },
    { x: 700, y: 200, width: 100, height: 20 },
  ],
  enemies: [
    { x: 320, y: 460, type: 'walker' },
    { x: 470, y: 380, type: 'walker' },
    { x: 320, y: 300, type: 'walker' },
    { x: 520, y: 230, type: 'walker' },
  ],
  goalX: 740,
  goalY: 150,
}
