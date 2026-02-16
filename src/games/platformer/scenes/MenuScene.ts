import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  private spaceKeyListener?: () => void

  constructor() {
    super({ key: 'MenuScene' })
  }

  create(): void {
    // Remove old listener if exists
    if (this.spaceKeyListener) {
      this.input.keyboard!.off('keydown-SPACE', this.spaceKeyListener)
    }

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
    topLine.fillRect(150, 100, 500, 2)

    // Main title - Japanese
    const title = this.add.text(400, 148, '横スクロールアクションゲーム', {
      fontSize: '36px',
      color: '#f1f5f9',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)

    // English subtitle
    const subtitle = this.add.text(400, 190, 'SIDE-SCROLL ACTION', {
      fontSize: '13px',
      color: '#6366f1',
      fontFamily: 'Inter, Arial, sans-serif',
    })
    subtitle.setOrigin(0.5)

    // Line under subtitle
    const subLine = this.add.graphics()
    subLine.fillGradientStyle(0xf43f5e, 0xf43f5e, 0x6366f1, 0x6366f1, 0.4, 0.4, 0.4, 0.4)
    subLine.fillRect(300, 213, 200, 1)

    // Controls section
    this.add.text(400, 252, 'CONTROLS', {
      fontSize: '11px',
      color: '#475569',
      fontFamily: 'Inter, Arial, sans-serif',
    }).setOrigin(0.5)

    // Key badges
    const controls = [
      { key: '← →', label: '左右移動' },
      { key: 'SPACE', label: 'ジャンプ' },
    ]

    controls.forEach((ctrl, i) => {
      const x = 330 + i * 140
      const y = 290

      const badge = this.add.graphics()
      badge.fillStyle(0xffffff, 0.05)
      badge.fillRoundedRect(x - 42, y - 14, 84, 28, 6)
      badge.lineStyle(1, 0xffffff, 0.08)
      badge.strokeRoundedRect(x - 42, y - 14, 84, 28, 6)

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

    // Mission text
    this.add.text(400, 370, '全5レベルをクリアしよう！', {
      fontSize: '16px',
      color: '#94a3b8',
      fontFamily: 'Inter, Arial, sans-serif',
    }).setOrigin(0.5)

    // Stage dots
    const stageDots = this.add.graphics()
    for (let i = 0; i < 5; i++) {
      const dx = 370 + i * 16
      stageDots.fillStyle(0x6366f1, 0.6)
      stageDots.fillCircle(dx, 400, 4)
    }

    this.add.text(400, 400, '5 STAGES', {
      fontSize: '11px',
      color: '#64748b',
      fontFamily: 'Inter, Arial, sans-serif',
    }).setOrigin(0.5)

    // Start prompt
    const startText = this.add.text(400, 500, 'PRESS SPACE TO START', {
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

    // Start game on space key
    this.spaceKeyListener = () => {
      this.cameras.main.fadeOut(300, 10, 10, 15)
      this.time.delayedCall(300, () => {
        this.scene.start('GameScene')
      })
    }
    this.input.keyboard!.on('keydown-SPACE', this.spaceKeyListener)
  }
}
