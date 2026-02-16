import Phaser from 'phaser'
import { GameConfig } from '../../config'

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private leftBound: number
  private rightBound: number
  private direction: -1 | 1 = -1
  private movementRange: number = 150

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    type: 'walker' | 'flyer',
    bounds?: { left: number; right: number }
  ) {
    super(scene, x, y, `enemy-${type}`)

    if (bounds) {
      this.leftBound = bounds.left
      this.rightBound = bounds.right
    } else {
      this.leftBound = x - this.movementRange
      this.rightBound = x + this.movementRange
    }

    scene.add.existing(this)
    scene.physics.add.existing(this)

    this.setCollideWorldBounds(true)
    this.setBounce(0)

    if (type === 'walker') {
      this.setGravityY(GameConfig.gravity)
    }

    this.createVisual(type)
  }

  private createVisual(type: 'walker' | 'flyer'): void {
    const size = 32
    const graphics = this.scene.make.graphics({ x: 0, y: 0 }, false)

    if (type === 'walker') {
      // Rose/crimson body
      graphics.fillStyle(0xbe123c, 1)
      graphics.fillRoundedRect(2, 2, size - 4, size - 4, 4)

      graphics.fillStyle(0x9f1239, 1)
      graphics.fillRoundedRect(4, 12, size - 8, size - 16, 3)
    } else {
      // Magenta/purple body
      graphics.fillStyle(0xc026d3, 1)
      graphics.fillRoundedRect(2, 2, size - 4, size - 4, 4)

      graphics.fillStyle(0xa21caf, 1)
      graphics.fillRoundedRect(4, 12, size - 8, size - 16, 3)
    }

    // Eyes - glowing amber
    graphics.fillStyle(0xfb923c, 1)
    graphics.fillCircle(10, 10, 3)
    graphics.fillCircle(22, 10, 3)

    // Eye centers - bright yellow
    graphics.fillStyle(0xfef08a, 1)
    graphics.fillCircle(10, 9, 1.5)
    graphics.fillCircle(22, 9, 1.5)

    // Bottom accent
    graphics.fillStyle(0xf43f5e, 0.5)
    graphics.fillRect(6, size - 6, size - 12, 2)

    graphics.generateTexture(`enemy-${type}`, size, size)
    graphics.destroy()

    this.setTexture(`enemy-${type}`)
  }

  update(): void {
    if (this.x <= this.leftBound) {
      this.direction = 1
    } else if (this.x >= this.rightBound) {
      this.direction = -1
    }

    this.setVelocityX(this.direction * GameConfig.enemySpeed)
  }
}
