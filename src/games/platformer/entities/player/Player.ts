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

    this.setCollideWorldBounds(true, 0, 0)
    this.setBounce(0)
    this.setGravityY(GameConfig.gravity)

    this.createVisual()

    this.cursors = scene.input.keyboard!.createCursorKeys()
    this.jumpKey = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  private createVisual(): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 }, false)
    const size = 32

    // Body - indigo base
    graphics.fillStyle(0x4f46e5, 1)
    graphics.fillRoundedRect(2, 2, size - 4, size - 4, 4)

    // Inner highlight
    graphics.fillStyle(0x6366f1, 1)
    graphics.fillRoundedRect(4, 4, size - 8, size - 12, 3)

    // Eyes - bright cyan
    graphics.fillStyle(0x22d3ee, 1)
    graphics.fillCircle(11, 12, 3)
    graphics.fillCircle(21, 12, 3)

    // Eye cores
    graphics.fillStyle(0xffffff, 1)
    graphics.fillCircle(11, 11, 1.5)
    graphics.fillCircle(21, 11, 1.5)

    // Bottom accent line
    graphics.fillStyle(0x818cf8, 0.6)
    graphics.fillRect(6, size - 6, size - 12, 2)

    graphics.generateTexture('player', size, size)
    graphics.destroy()

    this.setTexture('player')
  }

  update(): void {
    if (this.cursors.left.isDown) {
      this.setVelocityX(-GameConfig.playerSpeed)
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(GameConfig.playerSpeed)
    } else {
      this.setVelocityX(0)
    }

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
