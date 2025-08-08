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

  // テンプレート変数を置換
  let html = template.baseHtml

  // 基本情報
  html = html.replace(
    /\{\{product_name\}\}/g,
    escapeHtml(generationLog.productName),
  )
  html = html.replace(
    /\{\{product_category\}\}/g,
    escapeHtml(generationLog.productCategory),
  )
  html = html.replace(/\{\{main_copy\}\}/g, escapeHtml(mainCopy))
  html = html.replace(/\{\{sub_copy\}\}/g, escapeHtml(subCopy))
  html = html.replace(/\{\{story\}\}/g, escapeHtml(generationLog.story || ''))
  html = html.replace(/\{\{cta_text\}\}/g, escapeHtml(ctaText))
  html = html.replace(/\{\{copy_buttons\}\}/g, copyButtons)

  // ターゲットユーザー情報
  html = html.replace(
    /\{\{target_user\}\}/g,
    escapeHtml(generationLog.targetUserImage),
  )

  // サブ説明文を生成
  const subDescription = `${generationLog.targetUserImage}のための${generationLog.productCategory}`
  html = html.replace(/\{\{sub_description\}\}/g, escapeHtml(subDescription))

  // OG説明文
  const ogDescription = `${mainCopy} ${generationLog.productName}の特別なランディングページ。`
  html = html.replace(/\{\{og_description\}\}/g, escapeHtml(ogDescription))

  // スタイル設定 (validated and escaped)
  const primaryColor = validateColor(
    String(finalConfig.primaryColor || '#000000'),
  )
  const fontFamily = validateFontFamily(
    String(finalConfig.fontFamily || 'Noto Sans JP'),
  )

  html = html.replace(/\{\{primary_color\}\}/g, escapeHtml(primaryColor))
  html = html.replace(/\{\{font_family\}\}/g, escapeHtml(fontFamily))

  // Add CTA URL (with safe default)
  const ctaUrl = '#' // Default to # for now, can be made configurable later
  html = html.replace(/\{\{cta_url\}\}/g, escapeHtml(ctaUrl))

  return html
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, (s) => map[s])
}
