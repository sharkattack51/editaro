module.exports = {
  pluginOptions: {
    electronBuilder: {
      // vue-cli-plugin-electron-builder 2.x では既定で無効。
      // レンダラーで electron(ipcRenderer / remote) と font-list を require するため、
      // electron-renderer ターゲット + 依存の external 化を有効にする
      nodeIntegration: true,
      // font-list は同梱バイナリ(libs/darwin/fontlist)を __dirname から探して実行する。
      // webpack の bundle に取り込まれると __dirname がずれて見つからなくなるため、
      // 実行時に node_modules から require させる
      externals: ['font-list'],
    },
  },
}
