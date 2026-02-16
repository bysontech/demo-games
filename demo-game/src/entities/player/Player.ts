import Phaser from 'phaser'
import { GameConfig } from '../../config'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys
  private jumpKey: Phaser.Input.Keyboard.Key
  private isJumping: boolean = false
  private lives: number = GameConfig.lives

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player')

    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Setup physics
    this.setCollideWorldBounds(true, 0, 0, true, true, true, false)
    this.setBounce(0)
    this.setGravityY(GameConfig.gravity)

    // Create visual
    this.createVisual()

    // Setup controls
    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.jumpKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  private createVisual(): void {
    // Create simple square player
    const graphics = this.scene.make.graphics({ x: 0, y: 0 }, false)
    graphics.fillStyle(0xFF0000, 1)
    graphics.fillRect(0, 0, 32, 32)

    // Add eyes
    graphics.fillStyle(0xFFFFFF, 1)
    graphics.fillCircle(10, 10, 4)
    graphics.fillCircle(22, 10, 4)
    graphics.fillStyle(0x000000, 1)
    graphics.fillCircle(10, 10, 2)
    graphics.fillCircle(22, 10, 2)

    graphics.generateTexture('player', 32, 32)
    graphics.destroy()

    this.setTexture('player')
  }

  update(): void {
    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-GameConfig.playerSpeed)
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(GameConfig.playerSpeed)
    } else {
      this.setVelocityX(0)
    }

    // Jump
    const onGround = this.body!.touching.down

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey) && onGround) {
      this.setVelocityY(GameConfig.playerJumpVelocity)
      this.isJumping = true
    }

    if (onGround && this.isJumping) {
      this.isJumping = false
    }
  }

  takeDamage(): boolean {
    this.lives--
    return this.lives <= 0
  }

  getLives(): number {
    return this.lives
  }

  resetLives(): void {
    this.lives = GameConfig.lives
  }
}
