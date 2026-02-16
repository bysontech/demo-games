import Phaser from 'phaser'

export class HUD {
  private livesText: Phaser.GameObjects.Text
  private levelText: Phaser.GameObjects.Text
  private bg: Phaser.GameObjects.Graphics

  constructor(scene: Phaser.Scene) {
    // Semi-transparent pill background
    this.bg = scene.add.graphics()
    this.bg.fillStyle(0x0a0a0f, 0.6)
    this.bg.fillRoundedRect(10, 10, 220, 54, 10)
    this.bg.lineStyle(1, 0xffffff, 0.06)
    this.bg.strokeRoundedRect(10, 10, 220, 54, 10)
    this.bg.setScrollFactor(0)
    this.bg.setDepth(1000)

    this.levelText = scene.add.text(22, 18, '', {
      fontSize: '16px',
      color: '#e2e8f0',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    this.levelText.setScrollFactor(0)
    this.levelText.setDepth(1000)

    this.livesText = scene.add.text(22, 40, '', {
      fontSize: '13px',
      color: '#94a3b8',
      fontFamily: 'Inter, Arial, sans-serif',
    })
    this.livesText.setScrollFactor(0)
    this.livesText.setDepth(1000)
  }

  updateLives(lives: number): void {
    this.livesText.setText(`Lives: ${lives}`)
  }

  updateLevel(levelName: string): void {
    this.levelText.setText(levelName)
  }
}
