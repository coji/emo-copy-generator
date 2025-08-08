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

export function generateLandingPageHtml(options: GenerateOptions): string {
  const { template, generationLog, selectedCopies, config } = options
  
  // デフォルト設定とマージ
  const defaultConfig = JSON.parse(template.defaultConfig)
  const finalConfig = {
    ...defaultConfig,
    ...config,
  }

  // ブランドイメージをパース
  const brandImages = JSON.parse(generationLog.brandImages) as string[]
  
  // メインコピーを選択（最初のコピー）
  const mainCopy = selectedCopies[0] || 'キャッチコピー'
  
  // サブコピーを生成
  const subCopy = brandImages[0] || 'ブランドメッセージ'
  
  // CTAテキストを生成
  const ctaText = '詳しく見る'
  
  // コピーボタンを生成
  const copyButtons = selectedCopies
    .map((copy, index) => `
      <button
        class="tag"
        aria-pressed="${index === 0 ? 'true' : 'false'}"
        data-copy="${escapeHtml(copy)}"
      >
        ${escapeHtml(copy)}
      </button>
    `)
    .join('')

  // テンプレート変数を置換
  let html = template.baseHtml
  
  // 基本情報
  html = html.replace(/\{\{product_name\}\}/g, escapeHtml(generationLog.productName))
  html = html.replace(/\{\{product_category\}\}/g, escapeHtml(generationLog.productCategory))
  html = html.replace(/\{\{main_copy\}\}/g, escapeHtml(mainCopy))
  html = html.replace(/\{\{sub_copy\}\}/g, escapeHtml(subCopy))
  html = html.replace(/\{\{story\}\}/g, escapeHtml(generationLog.story || ''))
  html = html.replace(/\{\{cta_text\}\}/g, escapeHtml(ctaText))
  html = html.replace(/\{\{copy_buttons\}\}/g, copyButtons)
  
  // ターゲットユーザー情報
  html = html.replace(/\{\{target_user\}\}/g, escapeHtml(generationLog.targetUserImage))
  
  // サブ説明文を生成
  const subDescription = `${generationLog.targetUserImage}のための${generationLog.productCategory}`
  html = html.replace(/\{\{sub_description\}\}/g, escapeHtml(subDescription))
  
  // OG説明文
  const ogDescription = `${mainCopy} ${generationLog.productName}の特別なランディングページ。`
  html = html.replace(/\{\{og_description\}\}/g, escapeHtml(ogDescription))
  
  // スタイル設定
  html = html.replace(/\{\{primary_color\}\}/g, finalConfig.primaryColor)
  html = html.replace(/\{\{font_family\}\}/g, finalConfig.fontFamily)
  
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