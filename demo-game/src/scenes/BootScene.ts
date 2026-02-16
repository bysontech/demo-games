import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    // Create loading text
    const loadingText = this.add.text(400, 300, 'Loading...', {
      fontSize: '32px',
      color: '#ffffff',
    })
    loadingText.setOrigin(0.5)
  }

  create(): void {
    // Start the main game scene
    this.scene.start('MenuScene')
  }
}
