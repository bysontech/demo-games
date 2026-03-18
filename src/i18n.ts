type Lang = 'ja' | 'en'

const translations = {
  // ── Hub / Registry ────────────────────────────
  'game.platformer.desc': {
    ja: '固定画面アクション。全5ステージを攻略せよ！',
    en: 'Fixed-screen action. Clear all 5 stages!',
  },
  'hub.subtitle': {
    ja: 'ゲームを選んでプレイ',
    en: 'Select a game to play',
  },
  'hub.footer': {
    ja: 'カードを押してプレイ開始',
    en: 'Press a card to start playing',
  },

  // ── Launcher start screen ─────────────────────
  'launcher.controls.title': {
    ja: '操作方法:',
    en: 'Controls:',
  },
  'launcher.controls.move': {
    ja: '← → / A D : 左右移動',
    en: '← → / A D : Move',
  },
  'launcher.controls.jump': {
    ja: 'スペース / ↑ / W : ジャンプ',
    en: 'Space / ↑ / W : Jump',
  },
  'launcher.start': {
    ja: 'スタート',
    en: 'Start',
  },

  // ── In-game MenuScene ─────────────────────────
  'menu.title': {
    ja: '横スクロールアクションゲーム',
    en: 'Side-Scroll Action Game',
  },
  'menu.controls': {
    ja: '操作方法:\n\n← → : 左右移動\nスペース : ジャンプ',
    en: 'Controls:\n\n← → : Move\nSpace : Jump',
  },
  'menu.start': {
    ja: 'スタート',
    en: 'Start',
  },

  // ── HUD ───────────────────────────────────────
  'hud.pause': {
    ja: 'ポーズ',
    en: 'Pause',
  },

  // ── GameScene overlays ────────────────────────
  'game.restart': {
    ja: 'リスタート',
    en: 'Restart',
  },
  'game.backToTitle': {
    ja: 'タイトルに戻る',
    en: 'Back to Title',
  },
  'game.resume': {
    ja: 'ゲームを再開',
    en: 'Resume',
  },
  'game.allClear': {
    ja: '全レベルクリア！',
    en: 'All Levels Cleared!',
  },
  'game.playAgain': {
    ja: 'もう一度プレイ',
    en: 'Play Again',
  },
  'game.paused': {
    ja: 'ポーズ',
    en: 'Paused',
  },

  // ── Game-over hints per level ─────────────────
  'hint.1': {
    ja: 'がんばれ！',
    en: 'You can do it!',
  },
  'hint.2': {
    ja: '敵の動きをよく見て、タイミングを合わせよう！',
    en: 'Watch the enemies closely and time your moves!',
  },
  'hint.3': {
    ja: '時間をかければチャンスあり！？',
    en: 'Take your time — patience is key!',
  },
  'hint.4': {
    ja: '見えないところに近道あり！？',
    en: 'There may be a shortcut where you least expect it!',
  },
  'hint.5': {
    ja: '敵と同じ動きをしてみよう！！',
    en: 'Try moving in sync with the enemies!',
  },
} as const

type Key = keyof typeof translations

let currentLang: Lang = detectLang()

function detectLang(): Lang {
  const nav = navigator.language || ''
  return nav.startsWith('ja') ? 'ja' : 'en'
}

/** Get translated string */
export function t(key: Key): string {
  const entry = translations[key]
  return entry[currentLang] ?? entry['en']
}

/** Get current language */
export function getLang(): Lang {
  return currentLang
}

/** Override language (for testing / user toggle) */
export function setLang(lang: Lang): void {
  currentLang = lang
}
