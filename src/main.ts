import { Hub } from './hub/Hub'
import { Launcher } from './launcher/Launcher'
import type { GameMeta } from './types'

const app = document.getElementById('app')!

let hub: Hub | null = null
let launcher: Launcher | null = null

function showHub(): void {
  hub = new Hub(app, onSelectGame)
}

function onSelectGame(meta: GameMeta): void {
  if (hub) {
    hub.destroy()
    hub = null
  }
  launcher = new Launcher(app, showHub)
  launcher.launch(meta)
}

showHub()
