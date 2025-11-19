import { TemplateRenderer, escapeHtml } from './template-renderer'

interface GenerateOptions {
  template: {
    baseHtml: string
    defaultConfig: string
  }
  generationLog: {
    productName: string
    productCategory: string
    brandImages: string
    targetUserImage: string
    story: string | null
  }
  selectedCopies: string[]
  config?: {
    primaryColor?: string
    fontFamily?: string
    layout?: string
  }
}

// Validation helpers
const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
const ALLOWED_FONTS = [
  'Noto Sans JP',
  'Shippori Mincho',
  'system-ui',
  'sans-serif',
  'serif',
  'monospace',
]

function validateColor(color: string): string {
  if (HEX_COLOR_REGEX.test(color)) {
    return color
  }
  return '#000000' // Default to black if invalid
}



function validateFontFamily(font: string): string {
  if (ALLOWED_FONTS.includes(font)) {
    return font
  }
  return 'Noto Sans JP' // Default font if invalid
}

export function generateLandingPageHtml(options: GenerateOptions): string {
  const { template, generationLog, selectedCopies, config } = options

  // デフォルト設定とマージ
  let defaultConfig: Record<string, unknown> = {}
  try {
    defaultConfig = JSON.parse(template.defaultConfig)
  } catch {
    defaultConfig = {
      primaryColor: '#000000',
      fontFamily: 'Noto Sans JP',
      layout: 'default',
    }
  }

  const finalConfig = {
    ...defaultConfig,
    ...config,
  }

  // ブランドイメージをパース (with error handling)
  let brandImages: string[] = []
  try {
    brandImages = JSON.parse(generationLog.brandImages) as string[]
  } catch {
    brandImages = []
  }

  // メインコピーを選択（最初のコピー）
  const mainCopy = selectedCopies[0] || 'キャッチコピー'

  // サブコピーを生成
  const subCopy = brandImages[0] || 'ブランドメッセージ'

  // CTAテキストを生成
  const ctaText = '詳しく見る'

  // コピーボタンを生成
  const copyButtons = selectedCopies
    .map(
      (copy, index) => `
      <button
        class="tag"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
        data-copy="${escapeHtml(copy)}"
      >
        ${escapeHtml(copy)}
      </button>
    `,
    )
    .join('')

  // スタイル設定 (validated and escaped)
  const primaryColor = validateColor(
    String(finalConfig.primaryColor || '#000000'),
  )
  const fontFamily = validateFontFamily(
    String(finalConfig.fontFamily || 'Noto Sans JP'),
  )

  // Add CTA URL (with safe default)
  const ctaUrl = '#' // Default to # for now, can be made configurable later

  // ターゲットユーザー情報
  const subDescription = `${generationLog.targetUserImage}のための${generationLog.productCategory}`
  const ogDescription = `${mainCopy} ${generationLog.productName}の特別なランディングページ。`

  const renderer = new TemplateRenderer(template.baseHtml)
  return renderer.render({
    productName: generationLog.productName,
    productCategory: generationLog.productCategory,
    mainCopy,
    subCopy,
    story: generationLog.story || '',
    ctaText,
    ctaUrl,
    copyButtons,
    targetUserImage: generationLog.targetUserImage,
    subDescription,
    ogDescription,
    primaryColor,
    fontFamily,
  })
}


