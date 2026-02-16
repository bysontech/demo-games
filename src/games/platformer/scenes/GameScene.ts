import Phaser from 'phaser'
import { Player } from '../entities/player/Player'
import { Enemy } from '../entities/enemies/Enemy'
import { HUD } from '../core/HUD'
import { LevelData } from '../levels/level1'
import { level1 } from '../levels/level1'
import { level2 } from '../levels/level2'
import { level3 } from '../levels/level3'
import { level4 } from '../levels/level4'
import { level5 } from '../levels/level5'

// Level accent colors (indigo -> teal -> rose -> purple -> crimson)
const LEVEL_ACCENTS: number[] = [
  0x6366f1, 0x10b981, 0xf43f5e, 0xa855f7, 0xef4444,
]

// Shared button style constants
const BTN_FONT = 'Inter, Arial, sans-serif'
const BTN_NORMAL = '#1e1e2e'
const BTN_HOVER = '#2a2a3e'

export class GameScene extends Phaser.Scene {
  private player!: Player
  private enemies!: Phaser.Physics.Arcade.Group
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private goal!: Phaser.Physics.Arcade.Sprite
  private goalGlow!: Phaser.GameObjects.Graphics
  private hud!: HUD
  private currentLevel: number = 1
  private levelData!: LevelData
  private isLevelTransitioning: boolean = false
  private isGameOver: boolean = false
  private isVictory: boolean = false
  private isPaused: boolean = false
  private bgElements: Phaser.GameObjects.Graphics | null = null
  private pauseMenuObjects: Phaser.GameObjects.GameObject[] = []
  private gameOverMenuObjects: Phaser.GameObjects.GameObject[] = []
  private victoryMenuObjects: Phaser.GameObjects.GameObject[] = []

  private levels: LevelData[] = [level1, level2, level3, level4, level5]

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    this.isGameOver = false
    this.isVictory = false
    this.isPaused = false

    this.loadLevel(1)
  }

  private loadLevel(levelNumber: number): void {
    // Clean up previous level
    if (this.player) this.player.destroy()
    if (this.enemies) this.enemies.clear(true, true)
    if (this.platforms) this.platforms.clear(true, true)
    if (this.goal) this.goal.destroy()
    if (this.goalGlow) this.goalGlow.destroy()
    if (this.bgElements) this.bgElements.destroy()

    this.isLevelTransitioning = false
    this.currentLevel = levelNumber
    this.levelData = this.levels[levelNumber - 1]
    const accent = LEVEL_ACCENTS[levelNumber - 1]

    // Set background
    this.cameras.main.setBackgroundColor(this.levelData.backgroundColor)

    // Background ambient elements
    this.bgElements = this.add.graphics()
    this.bgElements.setDepth(-1)

    // Subtle ambient glow based on level accent
    this.bgElements.fillStyle(accent, 0.04)
    this.bgElements.fillCircle(200, 300, 300)
    this.bgElements.fillCircle(600, 200, 250)

    // Dot grid
    this.bgElements.fillStyle(0xffffff, 0.015)
    for (let x = 20; x < 800; x += 40) {
      for (let y = 20; y < 600; y += 40) {
        this.bgElements.fillCircle(x, y, 0.8)
      }
    }

    // Create platforms with modern style
    this.platforms = this.physics.add.staticGroup()
    this.levelData.platforms.forEach((platform) => {
      const cx = platform.x + platform.width / 2
      const cy = platform.y + platform.height / 2

      const rect = this.add.rectangle(
        cx, cy,
        platform.width,
        platform.height,
        0x1e293b
      )
      rect.setStrokeStyle(1, accent, 0.2)
      this.physics.add.existing(rect, true)
      this.platforms.add(rect)

      // Top accent edge
      const edge = this.add.rectangle(
        cx, platform.y + 1,
        platform.width, 2,
        accent, 0.5
      )
      edge.setDepth(1)
    })

    // Create player
    this.player = new Player(
      this,
      this.levelData.playerStartX,
      this.levelData.playerStartY
    )

    // Create enemies
    this.enemies = this.physics.add.group()
    this.levelData.enemies.forEach((enemyData) => {
      const bounds = this.getEnemyBounds(enemyData.x, enemyData.y)
      const enemy = new Enemy(
        this,
        enemyData.x,
        enemyData.y,
        enemyData.type,
        bounds
      )
      this.enemies.add(enemy)
    })

    // Create goal
    this.createGoal(accent)

    // Setup collisions
    this.physics.add.collider(this.player, this.platforms)
    this.physics.add.collider(this.enemies, this.platforms)
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.handlePlayerEnemyCollision,
      undefined,
      this
    )
    this.physics.add.overlap(
      this.player,
      this.goal,
      this.handleGoalReached,
      undefined,
      this
    )

    // Create HUD
    if (!this.hud) {
      this.hud = new HUD(this)
      this.hud.setPauseCallback(() => this.togglePause())
    }
    this.hud.updateLevel(this.levelData.name)
    this.hud.updateLives(this.player.getLives())

    // Setup camera
    this.physics.world.setBounds(0, 0, 800, 900)
    this.cameras.main.setBounds(0, 0, 800, 600)
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)

    // Fade in
    this.cameras.main.fadeIn(400, 10, 10, 15)
  }

  private createGoal(accent: number): void {
    this.goalGlow = this.add.graphics()
    this.goalGlow.fillStyle(accent, 0.15)
    this.goalGlow.fillCircle(this.levelData.goalX, this.levelData.goalY, 24)
    this.goalGlow.setDepth(0)

    this.tweens.add({
      targets: this.goalGlow,
      alpha: { from: 0.4, to: 1 },
      scaleX: { from: 0.9, to: 1.2 },
      scaleY: { from: 0.9, to: 1.2 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })

    const graphics = this.make.graphics({ x: 0, y: 0 }, false)
    graphics.fillStyle(accent, 0.3)
    graphics.fillCircle(16, 16, 14)
    graphics.fillStyle(0xffffff, 0.9)
    graphics.fillCircle(16, 16, 6)
    graphics.lineStyle(2, accent, 0.8)
    graphics.strokeCircle(16, 16, 10)
    graphics.generateTexture('goal', 32, 32)
    graphics.destroy()

    this.goal = this.physics.add.sprite(
      this.levelData.goalX,
      this.levelData.goalY,
      'goal'
    )
    this.goal.setImmovable(true)

    this.tweens.add({
      targets: this.goal,
      angle: 360,
      duration: 3000,
      repeat: -1,
    })
  }

  private getEnemyBounds(
    enemyX: number,
    enemyY: number
  ): { left: number; right: number } | undefined {
    const enemyHalfWidth = 16
    const enemyHeight = 32
    const targetY = enemyY + enemyHeight
    const tolerance = 18

    const platform = this.levelData.platforms.find((candidate) => {
      const withinX =
        enemyX >= candidate.x && enemyX <= candidate.x + candidate.width
      const withinY = Math.abs(candidate.y - targetY) <= tolerance
      return withinX && withinY
    })

    if (!platform) {
      return undefined
    }

    return {
      left: platform.x + enemyHalfWidth,
      right: platform.x + platform.width - enemyHalfWidth,
    }
  }

  private handlePlayerEnemyCollision(
    player:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile,
    enemy:
      | Phaser.Types.Physics.Arcade.GameObjectWithBody
      | Phaser.Physics.Arcade.Body
      | Phaser.Physics.Arcade.StaticBody
      | Phaser.Tilemaps.Tile
  ): void {
    void enemy
    const playerSprite = player as Player
    const isDead = playerSprite.takeDamage()

    this.hud.updateLives(playerSprite.getLives())

    if (isDead) {
      this.gameOver()
    } else {
      playerSprite.setPosition(
        this.levelData.playerStartX,
        this.levelData.playerStartY
      )
      playerSprite.setVelocity(0, 0)
    }
  }

  private handleGoalReached(): void {
    if (this.isLevelTransitioning) {
      return
    }

    this.isLevelTransitioning = true
    this.goal.disableBody(true, true)
    this.player.setActive(false)

    if (this.currentLevel < this.levels.length) {
      this.cameras.main.fadeOut(400, 10, 10, 15)
      this.time.delayedCall(500, () => {
        this.player.resetLives()
        this.loadLevel(this.currentLevel + 1)
      })
    } else {
      this.showVictory()
    }
  }

  // ── Styled button helper ──────────────────────────────────

  private createStyledButton(
    x: number, y: number, label: string, color: string, onClick: () => void
  ): Phaser.GameObjects.Text {
    const btn = this.add.text(x, y, label, {
      fontSize: '18px',
      color,
      fontFamily: BTN_FONT,
      fontStyle: 'bold',
      backgroundColor: BTN_NORMAL,
      padding: { x: 24, y: 10 },
    })
    btn.setOrigin(0.5)
    btn.setScrollFactor(0)
    btn.setDepth(2000)
    btn.setInteractive({ useHandCursor: true })
    btn.on('pointerup', onClick)
    btn.on('pointerover', () => btn.setBackgroundColor(BTN_HOVER))
    btn.on('pointerout', () => btn.setBackgroundColor(BTN_NORMAL))
    return btn
  }

  private createOverlayBg(): Phaser.GameObjects.Rectangle {
    const bg = this.add.rectangle(400, 300, 800, 600, 0x0a0a0f, 0.88)
    bg.setScrollFactor(0)
    bg.setDepth(1999)
    return bg
  }

  private createOverlayTitle(
    y: number, text: string, color: string, size = '48px'
  ): Phaser.GameObjects.Text {
    const t = this.add.text(400, y, text, {
      fontSize: size,
      color,
      fontFamily: BTN_FONT,
      fontStyle: 'bold',
      align: 'center',
    })
    t.setOrigin(0.5)
    t.setScrollFactor(0)
    t.setDepth(2000)
    return t
  }

  // ── Game Over ─────────────────────────────────────────────

  private gameOver(): void {
    this.isGameOver = true
    this.showGameOverMenu()
  }

  private showGameOverMenu(): void {
    this.gameOverMenuObjects.forEach(obj => obj.destroy())
    this.gameOverMenuObjects = []

    const bg = this.createOverlayBg()
    const title = this.createOverlayTitle(220, 'GAME OVER', '#f43f5e')

    const sub = this.add.text(400, 275, 'ライフがなくなりました', {
      fontSize: '14px',
      color: '#64748b',
      fontFamily: BTN_FONT,
    })
    sub.setOrigin(0.5)
    sub.setScrollFactor(0)
    sub.setDepth(2000)

    const restartBtn = this.createStyledButton(
      400, 340, 'リスタート', '#6366f1', () => this.restartGame()
    )
    const titleBtn = this.createStyledButton(
      400, 400, 'タイトルに戻る', '#94a3b8', () => this.goToTitle()
    )

    this.gameOverMenuObjects = [bg, title, sub, restartBtn, titleBtn]
  }

  // ── Victory ───────────────────────────────────────────────

  private showVictory(): void {
    this.isVictory = true
    this.showVictoryMenu()
  }

  private showVictoryMenu(): void {
    this.victoryMenuObjects.forEach(obj => obj.destroy())
    this.victoryMenuObjects = []

    const bg = this.createOverlayBg()
    const title = this.createOverlayTitle(200, 'COMPLETE', '#f1f5f9', '56px')

    const sub = this.add.text(400, 260, '全レベルクリア！', {
      fontSize: '18px',
      color: '#6366f1',
      fontFamily: BTN_FONT,
    })
    sub.setOrigin(0.5)
    sub.setScrollFactor(0)
    sub.setDepth(2000)

    // Stage dots
    const dots = this.add.graphics()
    dots.setScrollFactor(0)
    dots.setDepth(2000)
    for (let i = 0; i < 5; i++) {
      dots.fillStyle(0x6366f1, 0.8)
      dots.fillCircle(370 + i * 16, 295, 4)
    }

    const restartBtn = this.createStyledButton(
      400, 350, 'もう一度プレイ', '#6366f1', () => this.restartGame()
    )
    const titleBtn = this.createStyledButton(
      400, 410, 'タイトルに戻る', '#94a3b8', () => this.goToTitle()
    )

    this.victoryMenuObjects = [bg, title, sub, dots, restartBtn, titleBtn]
  }

  // ── Pause ─────────────────────────────────────────────────

  private togglePause(): void {
    if (this.isGameOver || this.isVictory) {
      return
    }

    if (this.isPaused) {
      this.resumeGame()
    } else {
      this.pauseGame()
    }
  }

  private pauseGame(): void {
    this.isPaused = true
    this.showPauseMenu()
  }

  private resumeGame(): void {
    this.isPaused = false
    this.pauseMenuObjects.forEach(obj => obj.destroy())
    this.pauseMenuObjects = []
  }

  private showPauseMenu(): void {
    this.pauseMenuObjects.forEach(obj => obj.destroy())
    this.pauseMenuObjects = []

    const bg = this.createOverlayBg()
    const title = this.createOverlayTitle(210, 'PAUSED', '#f1f5f9')

    const resumeBtn = this.createStyledButton(
      400, 300, 'ゲームを再開', '#6366f1', () => this.resumeGame()
    )
    const restartBtn = this.createStyledButton(
      400, 360, 'リスタート', '#94a3b8', () => this.restartGame()
    )
    const titleBtn = this.createStyledButton(
      400, 420, 'タイトルに戻る', '#94a3b8', () => this.goToTitle()
    )

    this.pauseMenuObjects = [bg, title, resumeBtn, restartBtn, titleBtn]
  }

  // ── Navigation ────────────────────────────────────────────

  private restartGame(): void {
    this.scene.restart()
  }

  private goToTitle(): void {
    this.scene.start('MenuScene')
  }

  // ── Update ────────────────────────────────────────────────

  update(): void {
    if (this.isPaused || this.isGameOver || this.isVictory) {
      return
    }

    if (this.player && this.player.active) {
      this.player.update()
    }

    this.enemies?.children.entries.forEach((enemy) => {
      if (enemy.active) {
        ;(enemy as Enemy).update()
      }
    })

    // Check for falling
    if (this.player && this.player.y > 650) {
      const isDead = this.player.takeDamage()
      this.hud.updateLives(this.player.getLives())

      if (isDead) {
        this.gameOver()
      } else {
        this.player.setPosition(
          this.levelData.playerStartX,
          this.levelData.playerStartY
        )
        this.player.setVelocity(0, 0)
      }
    }
  }
}
