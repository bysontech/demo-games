# Demo Games Hub

複数の試作ゲームを集めたゲームポータルサイトです。

スタイリッシュなハブ画面からゲームを選んでプレイできます。ゲームは Dynamic Import で遅延読み込みされるため、必要なときだけロードされます。

## セットアップ

```bash
npm install
npm run dev       # 開発サーバー起動
npm run build     # プロダクションビルド
npm run preview   # ビルド結果をプレビュー
```

## ディレクトリ構成

```
demo-games/
├── src/
│   ├── main.ts              # エントリーポイント
│   ├── types.ts             # GameModule / GameMeta 型定義
│   ├── registry.ts          # ゲーム登録リスト
│   ├── hub/
│   │   └── Hub.ts           # ゲーム選択画面（カード型 UI）
│   ├── launcher/
│   │   └── Launcher.ts      # ゲーム起動・終了管理
│   └── games/
│       └── platformer/      # 横スクロールアクションゲーム
│           ├── index.ts     # GameModule 実装
│           ├── config.ts
│           ├── scenes/
│           ├── core/
│           ├── entities/
│           └── levels/
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 設計

### GameModule インターフェース

すべてのゲームは以下のインターフェースを実装します。

```typescript
interface GameModule {
  launch(container: HTMLElement): void
  destroy(): void
}
```

### ゲームの追加方法

1. `src/games/<game-name>/index.ts` で `GameModule` を default export する
2. `src/registry.ts` にエントリを追加する

```typescript
// src/registry.ts
{
  id: 'puzzle',
  title: 'Puzzle',
  description: 'パズルゲームの説明',
  color: '#3b82f6',
  icon: '🧩',
  load: () => import('./games/puzzle/index'),
}
```

これだけでハブ画面にカードが表示され、選択するとゲームが起動します。

## 収録ゲーム

### Platformer

Phaser 3 製の横スクロールアクションゲーム。全5ステージ。

**操作方法:**
- **← →** : 左右移動
- **スペース** : ジャンプ
- **R** : リスタート

**レベル構成:**
1. First Steps - チュートリアル
2. Jump Challenge - ギャップジャンプ
3. Enemy Swarm - 大量の敵
4. Precision Jump - 小さな足場
5. Final Challenge - 最終ステージ

## 技術スタック

- **言語**: TypeScript
- **ビルド**: Vite
- **ゲームエンジン**: Phaser 3（Platformer で使用）
- **UI**: Vanilla DOM/CSS（ハブ画面）
