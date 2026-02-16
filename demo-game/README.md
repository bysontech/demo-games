# 横スクロールアクションゲーム

スーパーマリオ風の横スクロールアクションゲームです。

Vite + TypeScript + Phaser 3 で実装された全5レベルのプラットフォームアクションゲーム。

## 🎮 遊び方

### セットアップ

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# ビルド結果をプレビュー
npm run preview
```

### 操作方法

- **← →** : 左右移動
- **スペースキー** : ジャンプ
- **R キー** : リスタート

### ゲームオーバー条件

- 敵にぶつかる（ライフ減少）
- 画面下に落ちる（ライフ減少）
- ライフが0になるとゲームオーバー

### レベル遷移

- Level 1 → Level 2 → Level 3 → Level 4 → Level 5
- 各レベルで金色のゴール（星）に到達すると次のレベルへ
- 全5レベルをクリアするとエンディング

## 🏗️ アーキテクチャ

### ディレクトリ構造

```
demo-game/
├── src/
│   ├── main.ts                 # エントリーポイント
│   ├── config.ts               # ゲーム設定
│   ├── scenes/                 # Scene管理
│   │   ├── BootScene.ts       # 起動シーン
│   │   ├── MenuScene.ts       # メニューシーン
│   │   └── GameScene.ts       # メインゲームシーン
│   ├── core/                   # コアロジック
│   │   └── HUD.ts             # ヘッドアップディスプレイ
│   ├── entities/               # ゲームエンティティ
│   │   ├── player/
│   │   │   └── Player.ts      # プレイヤークラス
│   │   └── enemies/
│   │       └── Enemy.ts       # 敵クラス
│   └── levels/                 # レベルデータ（データ駆動）
│       ├── level1.ts
│       ├── level2.ts
│       ├── level3.ts
│       ├── level4.ts
│       └── level5.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

### 設計思想

- **データ駆動**: レベルはコードではなくデータで定義（`levels/*.ts`）
- **責任分離**: Scene/Core/Entities で明確に役割を分担
- **拡張性**: 新しいレベルは `levels/` にデータを追加するだけで実装可能

## 🎯 実装内容

### ゲーム機能

- ✅ プレイヤー操作（矢印キー、スペースでジャンプ）
- ✅ 敵キャラクター（左右往復移動）
- ✅ プラットフォーム/障害物
- ✅ 物理演算（重力、ジャンプ、衝突判定）
- ✅ ライフシステム（初期3ライフ）
- ✅ レベル遷移（Level 1-5）
- ✅ ゲームオーバー処理
- ✅ リスタート機能
- ✅ HUD表示（レベル名、ライフ）

### レベル構成

1. **Level 1: First Steps** - チュートリアル的な簡単なレベル
2. **Level 2: Jump Challenge** - ギャップのあるプラットフォーム
3. **Level 3: Enemy Swarm** - 敵が多い高難易度
4. **Level 4: Precision Jump** - 精密なジャンプが必要
5. **Level 5: Final Challenge** - 最終ステージ、複雑なレイアウト

## 🛠️ 技術スタック

- **言語**: TypeScript
- **フレームワーク**: Phaser 3 (v3.80.1)
- **ビルドツール**: Vite (v5.0.11)
- **ランタイム**: Node.js (ES Modules)

## 📝 制約の遵守

- ✅ AGENTS.md に従った実装
- ✅ 秘密情報は追加していない
- ✅ `src/`, `test/`, `package.json`, `.github/` には変更なし
- ✅ `demo-game/` ディレクトリ内で完結

## 🧪 テスト

プロジェクトルートの既存テストは影響を受けません。

```bash
# プロジェクトルートで
npm test  # 既存のtest/sample.test.jsが実行される
```

## 📄 旧ファイル

- `game.js` - Vanilla JSの旧実装（参考用に保持）

## 🎨 カスタマイズ

新しいレベルを追加する場合:

1. `src/levels/level6.ts` を作成
2. `LevelData` インターフェースに従ってデータを定義
3. `GameScene.ts` の `levels` 配列に追加

```typescript
import { level6 } from '../levels/level6'
// ...
private levels: LevelData[] = [level1, level2, level3, level4, level5, level6]
```
