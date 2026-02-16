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
    this.cameras.main.setBackgroundColor(0x2c3e50)

    // Title
    const title = this.add.text(400, 150, '横スクロールアクションゲーム', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    })
    title.setOrigin(0.5)

    // Instructions
    const instructions = this.add.text(
      400,
      350,
      '操作方法:\n\n← → : 左右移動\nスペース : ジャンプ\n\n全5レベルをクリアしよう！',
      {
        fontSize: '24px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
      }
    )
    instructions.setOrigin(0.5)

    // Start button
    const startButton = this.add.text(400, 520, 'スペースキーでスタート', {
      fontSize: '28px',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
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

    // Start game on space key
    // Use on instead of once to allow multiple starts
    this.spaceKeyListener = () => {
      this.scene.start('GameScene')
    }
    this.input.keyboard!.on('keydown-SPACE', this.spaceKeyListener)
  }
}
