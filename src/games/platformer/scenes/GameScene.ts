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

export class GameScene extends Phaser.Scene {
  private player!: Player
  private enemies!: Phaser.Physics.Arcade.Group
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private goal!: Phaser.Physics.Arcade.Sprite
  private goalGlow!: Phaser.GameObjects.Graphics
  private hud!: HUD
  private currentLevel: number = 1
  private levelData!: LevelData
  private restartKey!: Phaser.Input.Keyboard.Key
  private isLevelTransitioning: boolean = false
  private bgElements: Phaser.GameObjects.Graphics | null = null

  private levels: LevelData[] = [level1, level2, level3, level4, level5]

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    this.restartKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R)
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

      // Platform body (dark with subtle accent)
      const rect = this.add.rectangle(
        cx, cy,
        platform.width,
        platform.height,
        0x1e293b
      )
      rect.setStrokeStyle(1, accent, 0.2)
      this.physics.add.existing(rect, true)
      this.platforms.add(rect)

      // Top accent edge (glowing line on top of platform)
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
    // Goal glow effect (background circle)
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

    // Goal sprite (diamond shape)
    const graphics = this.make.graphics({ x: 0, y: 0 }, false)

    // Outer glow
    graphics.fillStyle(accent, 0.3)
    graphics.fillCircle(16, 16, 14)

    // Inner bright core
    graphics.fillStyle(0xffffff, 0.9)
    graphics.fillCircle(16, 16, 6)

    // Middle ring
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

  private gameOver(): void {
    this.scene.pause()

    // Dark overlay
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x0a0a0f, 0.85)
    overlay.setScrollFactor(0)
    overlay.setDepth(1999)

    // Game over title
    const title = this.add.text(400, 260, 'GAME OVER', {
      fontSize: '52px',
      color: '#f43f5e',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)
    title.setScrollFactor(0)
    title.setDepth(2000)

    // Restart hint
    const hint = this.add.text(400, 330, 'Press R to Restart', {
      fontSize: '16px',
      color: '#64748b',
      fontFamily: 'Inter, Arial, sans-serif',
    })
    hint.setOrigin(0.5)
    hint.setScrollFactor(0)
    hint.setDepth(2000)

    this.tweens.add({
      targets: hint,
      alpha: { from: 0.4, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  private showVictory(): void {
    this.scene.pause()

    // Dark overlay
    const overlay = this.add.rectangle(400, 300, 800, 600, 0x0a0a0f, 0.85)
    overlay.setScrollFactor(0)
    overlay.setDepth(1999)

    // Victory title
    const title = this.add.text(400, 240, 'COMPLETE', {
      fontSize: '56px',
      color: '#f1f5f9',
      fontFamily: 'Inter, Arial, sans-serif',
      fontStyle: 'bold',
    })
    title.setOrigin(0.5)
    title.setScrollFactor(0)
    title.setDepth(2000)

    // Subtitle
    const sub = this.add.text(400, 300, 'All stages cleared', {
      fontSize: '18px',
      color: '#6366f1',
      fontFamily: 'Inter, Arial, sans-serif',
    })
    sub.setOrigin(0.5)
    sub.setScrollFactor(0)
    sub.setDepth(2000)

    // Restart hint
    const hint = this.add.text(400, 360, 'Press R to Play Again', {
      fontSize: '14px',
      color: '#64748b',
      fontFamily: 'Inter, Arial, sans-serif',
    })
    hint.setOrigin(0.5)
    hint.setScrollFactor(0)
    hint.setDepth(2000)

    this.tweens.add({
      targets: hint,
      alpha: { from: 0.4, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    })
  }

  update(): void {
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

    // Restart
    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart()
      this.player.resetLives()
      this.loadLevel(1)
    }
  }
}
