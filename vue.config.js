module.exports = {
  pluginOptions: {
    electronBuilder: {
      // vue-cli-plugin-electron-builder 2.x では既定で無効。
      // レンダラーで electron(ipcRenderer / remote) と native モジュール(font-manager)を
      // require するため、electron-renderer ターゲット + native モジュールの external 化を有効にする
      nodeIntegration: true,
    },
  },
}
