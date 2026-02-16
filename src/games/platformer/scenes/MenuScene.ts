import Phaser from 'phaser'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x2c3e50)

    // Title
    const title = this.add.text(400, 200, '横スクロールアクションゲーム', {
      fontSize: '48px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
    })
    title.setOrigin(0.5)

    // Instructions
    const instructions = this.add.text(
      400,
      320,
      '操作方法:\n\n← → : 左右移動\nスペース : ジャンプ\nR : リスタート\n\n全5レベルをクリアしよう！',
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
    startButton.setOrigin(0.5)

    // Blink effect
    this.tweens.add({
      targets: startButton,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    })

    // Start game on space key
    this.input.keyboard!.once('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
  }
}
