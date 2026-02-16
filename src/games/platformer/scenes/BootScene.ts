import Phaser from 'phaser'

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload(): void {
    this.cameras.main.setBackgroundColor(0x0a0a0f)

    const cx = 400
    const cy = 280

    // Spinner ring
    const ring = this.add.graphics()
    ring.lineStyle(3, 0x6366f1, 1)
    ring.beginPath()
    ring.arc(0, 0, 18, 0, Math.PI * 1.4)
    ring.strokePath()
    ring.setPosition(cx, cy)

    this.tweens.add({
      targets: ring,
      angle: 360,
      duration: 800,
      repeat: -1,
      ease: 'Linear',
    })

    this.add.text(cx, cy + 44, 'LOADING', {
      fontSize: '14px',
      color: '#64748b',
      fontFamily: 'Inter, Arial, sans-serif',
    }).setOrigin(0.5)
  }

  create(): void {
    this.scene.start('MenuScene')
  }
}
