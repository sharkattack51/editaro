import { getFonts2, IFontInfo } from 'font-list'

// システムにインストールされているフォントをファミリー単位で非同期に取得する。
// 取得に失敗しても Preferences が開けなくならないよう、空配列で返す
export default function getFontFamilies(): Promise<IFontInfo[]> {
  return getFonts2().catch(() => [])
}
