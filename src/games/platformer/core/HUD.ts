import Phaser from 'phaser'

export class HUD {
  private livesText: Phaser.GameObjects.Text
  private levelText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene) {
    // Create HUD elements
    this.levelText = scene.add.text(16, 16, '', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    })
    this.levelText.setScrollFactor(0)
    this.levelText.setDepth(1000)

    this.livesText = scene.add.text(16, 50, '', {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
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
