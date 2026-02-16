import { LevelData } from './level1'

export const level5: LevelData = {
  name: 'Level 5: Final Challenge',
  levelNumber: 5,
  playerStartX: 100,
  playerStartY: 400,
  backgroundColor: 0x1f0c0c,
  platforms: [
    // Complex layout
    { x: 0, y: 550, width: 150, height: 50 },
    { x: 250, y: 550, width: 100, height: 50 },
    { x: 450, y: 550, width: 100, height: 50 },
    { x: 650, y: 550, width: 150, height: 50 },
    // Upper platforms
    { x: 100, y: 450, width: 80, height: 20 },
    { x: 300, y: 380, width: 80, height: 20 },
    { x: 500, y: 310, width: 80, height: 20 },
    { x: 300, y: 240, width: 80, height: 20 },
    { x: 600, y: 200, width: 120, height: 20 },
  ],
  enemies: [
    { x: 280, y: 530, type: 'walker' },
    { x: 480, y: 530, type: 'walker' },
    { x: 120, y: 430, type: 'walker' },
    { x: 320, y: 360, type: 'walker' },
    { x: 520, y: 290, type: 'walker' },
    { x: 320, y: 220, type: 'walker' },
    { x: 640, y: 180, type: 'walker' },
  ],
  goalX: 650,
  goalY: 150,
}
