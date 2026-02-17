import Phaser from 'phaser'

export class HUD {
  private bg: Phaser.GameObjects.Graphics
  private livesText: Phaser.GameObjects.Text
  private levelText: Phaser.GameObjects.Text
  private pauseButton: Phaser.GameObjects.Text
  private onPauseClick: () => void

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

    // Create pause button (Hub/Launcher style - glass card)
    const pauseBtnBg = scene.add.graphics()
    pauseBtnBg.fillStyle(0xffffff, 0.06)
    pauseBtnBg.fillRoundedRect(700, 10, 90, 36, 10)
    pauseBtnBg.lineStyle(1, 0xffffff, 0.1)
    pauseBtnBg.strokeRoundedRect(700, 10, 90, 36, 10)
    pauseBtnBg.setScrollFactor(0)
    pauseBtnBg.setDepth(1000)
    
    this.pauseButton = scene.add.text(745, 28, 'ポーズ', {
      fontSize: '14px',
      color: '#f1f5f9',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    this.pauseButton.setOrigin(0.5)
    this.pauseButton.setScrollFactor(0)
    this.pauseButton.setDepth(1001)
    
    const pauseHitArea = scene.add.zone(745, 28, 90, 36)
    pauseHitArea.setInteractive({ useHandCursor: true })
    pauseHitArea.setScrollFactor(0)
    pauseHitArea.setDepth(1001)
    pauseHitArea.on('pointerup', () => {
      if (this.onPauseClick) {
        this.onPauseClick()
      }
    })
    pauseHitArea.on('pointerover', () => {
      pauseBtnBg.clear()
      pauseBtnBg.fillStyle(0xffffff, 0.1)
      pauseBtnBg.fillRoundedRect(700, 10, 90, 36, 10)
      pauseBtnBg.lineStyle(1, 0xffffff, 0.15)
      pauseBtnBg.strokeRoundedRect(700, 10, 90, 36, 10)
      this.pauseButton.setScale(1.05)
    })
    pauseHitArea.on('pointerout', () => {
      pauseBtnBg.clear()
      pauseBtnBg.fillStyle(0xffffff, 0.06)
      pauseBtnBg.fillRoundedRect(700, 10, 90, 36, 10)
      pauseBtnBg.lineStyle(1, 0xffffff, 0.1)
      pauseBtnBg.strokeRoundedRect(700, 10, 90, 36, 10)
      this.pauseButton.setScale(1)
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
