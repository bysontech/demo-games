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

export class GameScene extends Phaser.Scene {
  private player!: Player
  private enemies!: Phaser.Physics.Arcade.Group
  private platforms!: Phaser.Physics.Arcade.StaticGroup
  private goal!: Phaser.Physics.Arcade.Sprite
  private hud!: HUD
  private currentLevel: number = 1
  private levelData!: LevelData
  private restartKey!: Phaser.Input.Keyboard.Key
  private isLevelTransitioning: boolean = false

  private levels: LevelData[] = [level1, level2, level3, level4, level5]

  constructor() {
    super({ key: 'GameScene' })
  }

  create(): void {
    this.restartKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R)

    // Load first level
    this.loadLevel(1)
  }

  private loadLevel(levelNumber: number): void {
    // Clean up previous level
    if (this.player) this.player.destroy()
    if (this.enemies) this.enemies.clear(true, true)
    if (this.platforms) this.platforms.clear(true, true)
    if (this.goal) this.goal.destroy()

    this.isLevelTransitioning = false
    this.currentLevel = levelNumber
    this.levelData = this.levels[levelNumber - 1]

    // Set background color
    this.cameras.main.setBackgroundColor(this.levelData.backgroundColor)

    // Create platforms
    this.platforms = this.physics.add.staticGroup()
    this.levelData.platforms.forEach((platform) => {
      const rect = this.add.rectangle(
        platform.x + platform.width / 2,
        platform.y + platform.height / 2,
        platform.width,
        platform.height,
        0x8B4513
      )
      this.physics.add.existing(rect, true)
      this.platforms.add(rect)
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
    this.createGoal()

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
  }

  private createGoal(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 }, false)
    graphics.fillStyle(0xFFD700, 1)
    graphics.fillCircle(16, 16, 12)
    graphics.generateTexture('goal', 32, 32)
    graphics.destroy()

    this.goal = this.physics.add.sprite(
      this.levelData.goalX,
      this.levelData.goalY,
      'goal'
    )
    this.goal.setImmovable(true)

    // Add tween for visual effect
    this.tweens.add({
      targets: this.goal,
      angle: 360,
      duration: 2000,
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
      // Respawn player at start position
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

    // Disable player control
    this.player.setActive(false)

    if (this.currentLevel < this.levels.length) {
      // Load next level
      this.time.delayedCall(500, () => {
        this.player.resetLives()
        this.loadLevel(this.currentLevel + 1)
      })
    } else {
      // Game completed
      this.showVictory()
    }
  }

  private gameOver(): void {
    this.scene.pause()
    const text = this.add.text(400, 300, 'GAME OVER\nPress R to Restart', {
      fontSize: '48px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 6,
    })
    text.setOrigin(0.5)
    text.setScrollFactor(0)
    text.setDepth(2000)
  }

  private showVictory(): void {
    this.scene.pause()
    const text = this.add.text(
      400,
      300,
      'CONGRATULATIONS!\nYou completed all levels!\nPress R to Play Again',
      {
        fontSize: '36px',
        color: '#FFD700',
        align: 'center',
        stroke: '#000000',
        strokeThickness: 6,
      }
    )
    text.setOrigin(0.5)
    text.setScrollFactor(0)
    text.setDepth(2000)
  }

  update(): void {
    if (this.player && this.player.active) {
      this.player.update()
    }

    // Update enemies
    this.enemies?.children.entries.forEach((enemy) => {
      if (enemy.active) {
        ;(enemy as Enemy).update()
      }
    })

    // Check for falling off the world
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
