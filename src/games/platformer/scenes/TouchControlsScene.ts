import Phaser from 'phaser'

/**
 * Touch controls overlay scene.
 * Runs in parallel with GameScene on touch devices.
 * Provides a virtual D-pad (left/right) and a jump button.
 */
export class TouchControlsScene extends Phaser.Scene {
  // Exposed state for GameScene / Player to read
  public leftDown = false
  public rightDown = false
  public jumpJustPressed = false

  private leftBtn!: Phaser.GameObjects.Graphics
  private rightBtn!: Phaser.GameObjects.Graphics
  private jumpBtn!: Phaser.GameObjects.Graphics

  constructor() {
    super({ key: 'TouchControlsScene' })
  }

  create(): void {
    const w = Number(this.game.config.width)
    const h = Number(this.game.config.height)

    // ── Left button (bottom-left) ─────────────────────
    const btnSize = 52
    const pad = 20
    const yBase = h - pad - btnSize

    this.leftBtn = this.add.graphics()
    this.drawButton(this.leftBtn, pad, yBase, btnSize, '◀')
    this.addZone(pad, yBase, btnSize, () => { this.leftDown = true }, () => { this.leftDown = false })

    // ── Right button ──────────────────────────────────
    this.rightBtn = this.add.graphics()
    this.drawButton(this.rightBtn, pad + btnSize + 12, yBase, btnSize, '▶')
    this.addZone(pad + btnSize + 12, yBase, btnSize, () => { this.rightDown = true }, () => { this.rightDown = false })

    // ── Jump button (bottom-right) ────────────────────
    const jumpSize = 64
    this.jumpBtn = this.add.graphics()
    this.drawButton(this.jumpBtn, w - pad - jumpSize, yBase - 6, jumpSize, '▲')
    this.addZone(w - pad - jumpSize, yBase - 6, jumpSize, () => { this.jumpJustPressed = true }, () => { /* release handled per-frame */ })
  }

  /** Consume the jump flag (call once per frame from Player) */
  consumeJump(): boolean {
    if (this.jumpJustPressed) {
      this.jumpJustPressed = false
      return true
    }
    return false
  }

  // ── Internal helpers ──────────────────────────────────

  private drawButton(g: Phaser.GameObjects.Graphics, x: number, y: number, size: number, _label: string): void {
    // Glass-pill style matching hub aesthetic
    g.fillStyle(0x0a0a0f, 0.55)
    g.fillRoundedRect(x, y, size, size, 12)
    g.lineStyle(1, 0x6366f1, 0.25)
    g.strokeRoundedRect(x, y, size, size, 12)

    // Draw arrow icon via small triangles
    const cx = x + size / 2
    const cy = y + size / 2
    const s = size * 0.22

    g.fillStyle(0x94a3b8, 0.9)
    if (_label === '◀') {
      g.fillTriangle(cx - s, cy, cx + s * 0.6, cy - s, cx + s * 0.6, cy + s)
    } else if (_label === '▶') {
      g.fillTriangle(cx + s, cy, cx - s * 0.6, cy - s, cx - s * 0.6, cy + s)
    } else if (_label === '▲') {
      g.fillTriangle(cx, cy - s, cx - s, cy + s * 0.6, cx + s, cy + s * 0.6)
    }
  }

  private addZone(
    x: number, y: number, size: number,
    onDown: () => void, onUp: () => void
  ): void {
    const zone = this.add.zone(x + size / 2, y + size / 2, size, size)
      .setInteractive()
      .setDepth(3000)

    zone.on('pointerdown', onDown)
    zone.on('pointerup', onUp)
    zone.on('pointerout', onUp)
  }
}
