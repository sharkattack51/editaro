# エディ太郎

チャットとか用の下書き専用テキストエディタ  
https://editaro.com

![editaro](https://editaro.com/dist/images/editaro-screenshot.png?)

## develop || build || install

see `package.json`

---

### macOS ビルド（Apple Silicon / arm64）

macOS は **arm64（Apple Silicon）ネイティブのみ**をビルドします。Intel Mac 向けと Universal は作りません。

#### 必要なもの

- Node.js 22.1.0 / yarn 1.22.22（`engines` は `^22.1.0`）
- ネイティブモジュールは使っていないため、Xcode などのビルド環境は不要です（フォント一覧の取得は純 JS の `font-list` で行います）

#### 手順

```bash
# webpack 4 が Node 17 以降で必要
export NODE_OPTIONS=--openssl-legacy-provider
# 署名用の証明書を探さない（署名しない場合）
export CSC_IDENTITY_AUTO_DISCOVERY=false

# --ignore-scripts: Electron 本体の取得を yarn に任せない（次の install.js で arm64 版を明示的に取得する）
# --ignore-engines: 依存パッケージ（@achrinza/node-ipc）が Node 17 までを宣言しているため
yarn install --ignore-engines --ignore-scripts
# Electron 本体を取得する（スクリプトを省いたため。install し直すたびに必要）
npm_config_arch=arm64 node node_modules/electron/install.js

yarn electron:build:mac
```

成果物は `dist_electron/mac-arm64/Editaro.app` です。

ネイティブモジュールが無いため、Node が x64 の環境（Rosetta 上の Node など）でも、成果物は arm64 になります。

> 開発起動（`yarn electron:serve`）は、Electron 11 への更新後は未検証です。

#### 補足

- **dmg / zip は作りません**。electron-builder 22 の dmg-builder が `/usr/bin/python` を呼びますが、macOS 12.3 以降には存在せず失敗するためです。ターゲットは `dir`（`.app` のみ）を明示しています（`electron-builder.json`）
- **署名・公証はしていません**
- **自動更新は無効化しています**。有効に戻すには、`src/background.ts` の `import './updator'` のコメントを外します
- フォント一覧は [font-list](https://github.com/oldj/node-font-list) で取得します。macOS では同梱の `fontlist`（arm64 + x86_64 の Universal バイナリ）を実行します。次の2つの設定が必要です
  - `vue.config.js` の `externals: ['font-list']`: 指定しないと webpack の bundle に取り込まれ、`fontlist` バイナリの場所を見失います
  - `electron-builder.json` の `asarUnpack`: `fontlist` を asar の外（`app.asar.unpacked`）に出します

#### トラブルシューティング

- VS Code など Electron 製のアプリのターミナルでは、環境変数 `ELECTRON_RUN_AS_NODE` が設定されていることがあります。この状態でアプリを起動すると、GUI ではなく Node として動きます。`env -u ELECTRON_RUN_AS_NODE` を付けて起動してください
- 検証目的でアプリを起動すると、保存データ（`~/Library/Application Support/Editaro`）を読み書きします。実データに触れたくない場合は、`--user-data-dir=<任意のフォルダ>` を付けてください
