import Phaser from 'phaser'

export class HUD {
  private livesText: Phaser.GameObjects.Text
  private levelText: Phaser.GameObjects.Text
  private pauseButton: Phaser.GameObjects.Text
  private onPauseClick: () => void

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

    // Create pause button
    this.pauseButton = scene.add.text(750, 16, 'ポーズ', {
      fontSize: '20px',
      color: '#ffffff',
      backgroundColor: '#333333',
      padding: { x: 10, y: 5 },
      stroke: '#000000',
      strokeThickness: 2,
    })
    this.pauseButton.setScrollFactor(0)
    this.pauseButton.setDepth(1000)
    this.pauseButton.setInteractive({ useHandCursor: true })
    this.pauseButton.on('pointerup', () => {
      if (this.onPauseClick) {
        this.onPauseClick()
      }
    })
    this.onPauseClick = () => {}
  }

  setPauseCallback(callback: () => void): void {
    this.onPauseClick = callback
  }

  updateLives(lives: number): void {
    this.livesText.setText(`Lives: ${lives}`)
  }

  updateLevel(levelName: string): void {
    this.levelText.setText(levelName)
  }
}
