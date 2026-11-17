# エディ太郎

チャットとか用の下書き専用テキストエディタ  
https://editaro.com

![editaro](https://editaro.com/dist/images/editaro-screenshot.png?)

## develop || build || install

see `package.json`

### macOS ビルド（Apple Silicon / arm64）

macOS は **arm64（Apple Silicon）ネイティブのみ**をビルドします。Intel Mac 向けと Universal は作りません。

#### 必要なもの

- Node.js 22.1.0 / yarn 1.22.22（`package.json` の `volta` で固定。`engines` は `^22.1.0`）。**Node 12 は使いません**
- Xcode 12.2 以上（ネイティブモジュール `font-manager` のビルドに使います）

#### 手順

```bash
# webpack 4 が Node 17 以降で必要
export NODE_OPTIONS=--openssl-legacy-provider
# node-gyp 10 と Electron 11 のヘッダの組み合わせで必要
export npm_config_openssl_fips=
# 署名用の証明書を探さない（署名しない場合）
export CSC_IDENTITY_AUTO_DISCOVERY=false

# --ignore-scripts: font-manager をホストの Node 向けにビルドさせない（失敗するため）
# --ignore-engines: 依存パッケージ（node-ipc）が Node 17 までを宣言しているため
yarn install --ignore-engines --ignore-scripts
# font-manager のパッチを適用する
./node_modules/.bin/patch-package
# Electron 本体を取得する（スクリプトを省いたため。install し直すたびに必要）
npm_config_arch=arm64 node node_modules/electron/install.js

yarn electron:build:mac
```

成果物は `dist_electron/mac-arm64/Editaro.app` です。

`electron:build:mac` はビルド前に `font-manager` を arm64 向けに再ビルドします。Node が x64 の環境（Rosetta 上の Node など）でも、成果物は arm64 になります。

> 開発起動（`yarn electron:serve`）は、Electron 11 への更新後は未検証です。

#### 補足

- **dmg / zip は作りません**。electron-builder 22 の dmg-builder が `/usr/bin/python` を呼びますが、macOS 12.3 以降には存在せず失敗するためです。ターゲットは `dir`（`.app` のみ）を明示しています（`electron-builder.json`）
- **署名・公証はしていません**
- **自動更新は無効化しています**。有効に戻すには、`src/background.ts` の `import './updator'` のコメントを外します
- `font-manager` は Electron 11 の V8 でそのままビルドできないため、`patches/font-manager+0.3.1.patch` で1行を修正しています（[patch-package](https://github.com/ds300/patch-package)）。上の手順では `patch-package` を明示して適用します（`postinstall` を省くため）
- `src/background.ts` の `app.allowRendererProcessReuse = false` は必須です。`font-manager` が context-aware でなく、Electron 9 以降の既定値ではレンダラーで読み込めず、アプリが起動しません。この設定は Electron 14 で削除される予定のため、Electron を更新するときは `font-manager` の見直しが必要です
- ビルドが依存する Electron 11 はサポートが終了しています

#### トラブルシューティング

- VS Code など Electron 製のアプリのターミナルでは、環境変数 `ELECTRON_RUN_AS_NODE` が設定されていることがあります。この状態でアプリを起動すると、GUI ではなく Node として動きます。`env -u ELECTRON_RUN_AS_NODE` を付けて起動してください
- 検証目的でアプリを起動すると、保存データ（`~/Library/Application Support/Editaro`）を読み書きします。実データに触れたくない場合は、`--user-data-dir=<任意のフォルダ>` を付けてください
