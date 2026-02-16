import Phaser from 'phaser'

// Hub風カラー
const BG = 0x0a0a0f
const CARD_BG = 0xffffff
const CARD_BG_ALPHA = 0.06
const ACCENT = 0x6366f1
const TEXT_MAIN = '#f1f5f9'
const TEXT_SUB = '#94a3b8'

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' })
  }

  create(): void {
    this.cameras.main.setBackgroundColor(BG)

    // 背景のドットグリッド風（薄い点）
    const dots = this.add.graphics()
    for (let x = 20; x < 800; x += 40) {
      for (let y = 20; y < 600; y += 40) {
        dots.fillStyle(0xffffff, 0.04)
        dots.fillCircle(x, y, 1)
      }
    }
    dots.setScrollFactor(0)

    // 中央カード風パネル（角丸四角）
    const cardW = 420
    const cardH = 380
    const cardX = 400 - cardW / 2
    const cardY = 180
    const card = this.add.graphics()
    card.fillStyle(CARD_BG, CARD_BG_ALPHA)
    card.fillRoundedRect(cardX, cardY, cardW, cardH, 16)
    card.lineStyle(1, 0xffffff, 0.08)
    card.strokeRoundedRect(cardX, cardY, cardW, cardH, 16)
    card.setScrollFactor(0)

    // タイトル（カード内・Hub風）
    const title = this.add.text(400, cardY + 52, '横スクロールアクションゲーム', {
      fontSize: '28px',
      color: TEXT_MAIN,
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5, 0)
    title.setScrollFactor(0)

    // 操作方法
    const instructions = this.add.text(
      400,
      cardY + 100,
      '操作方法:\n\n← → : 左右移動\nスペース : ジャンプ',
      {
        fontSize: '20px',
        color: TEXT_MAIN,
        align: 'center',
        lineSpacing: 8,
        fontFamily: 'Inter, Arial, sans-serif',
      }
    )
    instructions.setOrigin(0.5, 0)
    instructions.setScrollFactor(0)

    // 5 STAGES
    const stagesText = this.add.text(400, cardY + 240, '5 STAGES', {
      fontSize: '12px',
      color: TEXT_SUB,
      fontFamily: 'Inter, Arial, sans-serif',
    })
    stagesText.setOrigin(0.5, 0)
    stagesText.setScrollFactor(0)

    // ステージドット
    const stageDots = this.add.graphics()
    for (let i = 0; i < 5; i++) {
      const dx = 370 + i * 16
      stageDots.fillStyle(ACCENT, 0.6)
      stageDots.fillCircle(dx, cardY + 268, 4)
    }
    stageDots.setScrollFactor(0)

    // スタートボタン（Hubのボタン風）
    const btnW = 200
    const btnH = 48
    const btnX = 400 - btnW / 2
    const btnY = cardY + 300

    const btnBg = this.add.graphics()
    btnBg.fillStyle(ACCENT, 0.9)
    btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 12)
    btnBg.setScrollFactor(0)

    const startBtn = this.add.text(400, btnY + btnH / 2, 'スタート', {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    startBtn.setOrigin(0.5)
    startBtn.setScrollFactor(0)

    // ボタン全体をクリック可能に
    const hitArea = this.add.zone(400, btnY + btnH / 2, btnW, btnH)
    hitArea.setInteractive({ useHandCursor: true })
    hitArea.setScrollFactor(0)

    hitArea.on('pointerup', () => {
      this.scene.start('GameScene')
    })
    hitArea.on('pointerover', () => {
      btnBg.clear()
      btnBg.fillStyle(ACCENT, 1)
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 12)
      startBtn.setScale(1.02)
    })
    hitArea.on('pointerout', () => {
      btnBg.clear()
      btnBg.fillStyle(ACCENT, 0.9)
      btnBg.fillRoundedRect(btnX, btnY, btnW, btnH, 12)
      startBtn.setScale(1)
    })

    // スペースキーでもスタート可能（併用）
    this.input.keyboard!.on('keydown-SPACE', () => {
      this.scene.start('GameScene')
    })
  }
}
