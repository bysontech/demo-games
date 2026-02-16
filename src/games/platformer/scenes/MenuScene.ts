import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x0a0a0f)

    // Background ambient glow
    const bgGlow = this.add.graphics()
    bgGlow.fillStyle(0x6366f1, 0.08)
    bgGlow.fillCircle(200, 250, 250)
    bgGlow.fillStyle(0xf43f5e, 0.05)
    bgGlow.fillCircle(600, 150, 200)
    bgGlow.fillStyle(0x10b981, 0.04)
    bgGlow.fillCircle(400, 500, 220)

    // Dot grid pattern
    const dots = this.add.graphics()
    dots.fillStyle(0xffffff, 0.025)
    for (let x = 20; x < 800; x += 40) {
      for (let y = 20; y < 600; y += 40) {
        dots.fillCircle(x, y, 1)
      }
    }

    // Decorative gradient line
    const topLine = this.add.graphics()
    topLine.fillGradientStyle(0x6366f1, 0x6366f1, 0xf43f5e, 0xf43f5e, 0.6, 0.6, 0.6, 0.6)
    topLine.fillRect(200, 120, 400, 2)

    // Title
    const title = this.add.text(400, 172, 'PLATFORMER', {
      fontSize: '56px',
      color: '#f1f5f9',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // Subtitle accent
    const subtitle = this.add.text(400, 222, 'SIDE-SCROLL ACTION', {
      fontSize: '14px',
      color: '#6366f1',
      fontFamily: 'Inter, Arial, sans-serif',
    })
    subtitle.setOrigin(0.5)

    // Line under subtitle
    const subLine = this.add.graphics()
    subLine.fillGradientStyle(0xf43f5e, 0xf43f5e, 0x6366f1, 0x6366f1, 0.4, 0.4, 0.4, 0.4)
    subLine.fillRect(300, 247, 200, 1)

    // Controls label
    this.add.text(400, 282, 'CONTROLS', {
      fontSize: '11px',
      color: '#475569',
      fontFamily: 'Inter, Arial, sans-serif',
    }).setOrigin(0.5)

    // Key badges
    const controls = [
      { key: '< >', label: 'Move' },
      { key: 'SPACE', label: 'Jump' },
      { key: 'R', label: 'Restart' },
    ]

    controls.forEach((ctrl, i) => {
      const x = 260 + i * 140
      const y = 320

      // Badge background
      const badge = this.add.graphics()
      badge.fillStyle(0xffffff, 0.05)
      badge.fillRoundedRect(x - 36, y - 14, 72, 28, 6)
      badge.lineStyle(1, 0xffffff, 0.08)
      badge.strokeRoundedRect(x - 36, y - 14, 72, 28, 6)

      this.add.text(x, y, ctrl.key, {
        fontSize: '13px',
        color: '#cbd5e1',
        fontFamily: 'monospace',
        fontStyle: 'bold',
      }).setOrigin(0.5)

      this.add.text(x, y + 26, ctrl.label, {
        fontSize: '11px',
        color: '#64748b',
        fontFamily: 'Inter, Arial, sans-serif',
      }).setOrigin(0.5)
    })

    // Stage info
    this.add.text(400, 410, '5 STAGES', {
      fontSize: '13px',
      color: '#94a3b8',
      fontFamily: 'Inter, Arial, sans-serif',
    }).setOrigin(0.5)

    // Stage dots
    const stageDots = this.add.graphics()
    for (let i = 0; i < 5; i++) {
      const dx = 370 + i * 16
      stageDots.fillStyle(0x6366f1, 0.6)
      stageDots.fillCircle(dx, 434, 4)
    }

    // Start prompt
    const startText = this.add.text(400, 510, 'PRESS SPACE TO START', {
      fontSize: '16px',
      color: '#6366f1',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    startText.setOrigin(0.5)

    this.tweens.add({
      targets: startText,
      alpha: 0.3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    // Bottom decorative line
    const bottomBar = this.add.graphics()
    bottomBar.fillGradientStyle(0x6366f1, 0x6366f1, 0xf43f5e, 0xf43f5e, 0.3, 0.3, 0.3, 0.3)
    bottomBar.fillRect(250, 555, 300, 1)

    // Start game on space key with fade
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.cameras.main.fadeOut(300, 10, 10, 15)
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene')
      })
    })
  }
}
