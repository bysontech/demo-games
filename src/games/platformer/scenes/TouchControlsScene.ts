import Phaser from 'phaser'

/**
 * Touch controls overlay scene.
 * Runs in parallel with GameScene on touch devices.
 * Provides a virtual D-pad (left/right) and a jump button.
 * Rebuilds layout on orientation / resize changes.
 */
export class TouchControlsScene extends Phaser.Scene {
  // Exposed state for GameScene / Player to read
  public leftDown = false
  public rightDown = false
  public jumpJustPressed = false

  private controlObjects: Phaser.GameObjects.GameObject[] = []

  constructor() {
    super({ key: 'TouchControlsScene' })
  }

  create(): void {
    this.buildControls()

    // Rebuild when the viewport is resized (orientation change, etc.)
    this.scale.on('resize', this.rebuildControls, this)
  }

  shutdown(): void {
    this.scale.off('resize', this.rebuildControls, this)
  }

  /** Consume the jump flag (call once per frame from GameScene) */
  consumeJump(): boolean {
    if (this.jumpJustPressed) {
      this.jumpJustPressed = false
      return true
    }
    return false
  }

  // ── Layout ──────────────────────────────────────────────

  private rebuildControls(): void {
    // Reset input state so stale presses don't carry over
    this.leftDown = false
    this.rightDown = false
    this.jumpJustPressed = false

    // Destroy old objects
    for (const obj of this.controlObjects) {
      obj.destroy()
    }
    this.controlObjects = []

    this.buildControls()
  }

  private buildControls(): void {
    const logicW = Number(this.game.config.width)   // 800
    const logicH = Number(this.game.config.height)  // 600

    // Detect portrait: compare actual display pixels
    const displayW = this.scale.displaySize.width || window.innerWidth
    const displayH = this.scale.displaySize.height || window.innerHeight
    const isPortrait = displayH > displayW

    // In portrait the canvas is rendered smaller on screen,
    // so we use bigger logical sizes to keep physical tap targets comfortable.
    const btnSize = isPortrait ? 80 : 52
    const jumpSize = isPortrait ? 96 : 64
    const pad = isPortrait ? 16 : 20
    const gap = isPortrait ? 16 : 12
    const yBase = logicH - pad - btnSize

    // ── Left button (bottom-left) ─────────────────────
    const leftG = this.add.graphics()
    this.drawButton(leftG, pad, yBase, btnSize, 'left')
    const leftZ = this.addZone(
      pad, yBase, btnSize,
      () => { this.leftDown = true },
      () => { this.leftDown = false },
    )
    this.controlObjects.push(leftG, leftZ)

    // ── Right button ──────────────────────────────────
    const rightG = this.add.graphics()
    this.drawButton(rightG, pad + btnSize + gap, yBase, btnSize, 'right')
    const rightZ = this.addZone(
      pad + btnSize + gap, yBase, btnSize,
      () => { this.rightDown = true },
      () => { this.rightDown = false },
    )
    this.controlObjects.push(rightG, rightZ)

    // ── Jump button (bottom-right) ────────────────────
    const jumpG = this.add.graphics()
    const jumpX = logicW - pad - jumpSize
    const jumpY = logicH - pad - jumpSize
    this.drawButton(jumpG, jumpX, jumpY, jumpSize, 'up')
    const jumpZ = this.addZone(
      jumpX, jumpY, jumpSize,
      () => { this.jumpJustPressed = true },
      () => { /* consumed per-frame */ },
    )
    this.controlObjects.push(jumpG, jumpZ)
  }

  // ── Drawing helpers ──────────────────────────────────

  private drawButton(
    g: Phaser.GameObjects.Graphics,
    x: number, y: number, size: number,
    dir: 'left' | 'right' | 'up',
  ): void {
    // Glass-pill background
    g.fillStyle(0x0a0a0f, 0.55)
    g.fillRoundedRect(x, y, size, size, 12)
    g.lineStyle(1, 0x6366f1, 0.25)
    g.strokeRoundedRect(x, y, size, size, 12)

    // Arrow triangle
    const cx = x + size / 2
    const cy = y + size / 2
    const s = size * 0.22

    g.fillStyle(0x94a3b8, 0.9)
    if (dir === 'left') {
      g.fillTriangle(cx - s, cy, cx + s * 0.6, cy - s, cx + s * 0.6, cy + s)
    } else if (dir === 'right') {
      g.fillTriangle(cx + s, cy, cx - s * 0.6, cy - s, cx - s * 0.6, cy + s)
    } else {
      g.fillTriangle(cx, cy - s, cx - s, cy + s * 0.6, cx + s, cy + s * 0.6)
    }

    g.setDepth(3000)
  }

  private addZone(
    x: number, y: number, size: number,
    onDown: () => void, onUp: () => void,
  ): Phaser.GameObjects.Zone {
    const zone = this.add.zone(x + size / 2, y + size / 2, size, size)
      .setInteractive()
      .setDepth(3000)

    zone.on('pointerdown', onDown)
    zone.on('pointerup', onUp)
    zone.on('pointerout', onUp)
    return zone
  }
}
