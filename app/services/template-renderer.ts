export interface RenderContext {
  productName: string
  productCategory: string
  mainCopy: string
  subCopy: string
  story: string
  ctaText: string
  ctaUrl: string
  copyButtons: string
  targetUserImage: string
  subDescription: string
  ogDescription: string
  primaryColor: string
  fontFamily: string
}

export class TemplateRenderer {
  templateHtml: string

  constructor(templateHtml: string) {
    this.templateHtml = templateHtml
  }

  render(context: RenderContext): string {
    let html = this.templateHtml

    // Basic Info
    html = html.replace(/\{\{product_name\}\}/g, escapeHtml(context.productName))
    html = html.replace(/\{\{product_category\}\}/g, escapeHtml(context.productCategory))
    html = html.replace(/\{\{main_copy\}\}/g, escapeHtml(context.mainCopy))
    html = html.replace(/\{\{sub_copy\}\}/g, escapeHtml(context.subCopy))
    html = html.replace(/\{\{story\}\}/g, escapeHtml(context.story))
    html = html.replace(/\{\{cta_text\}\}/g, escapeHtml(context.ctaText))
    html = html.replace(/\{\{copy_buttons\}\}/g, context.copyButtons) // Already HTML

    // Target User Info
    html = html.replace(/\{\{target_user\}\}/g, escapeHtml(context.targetUserImage))
    html = html.replace(/\{\{sub_description\}\}/g, escapeHtml(context.subDescription))
    html = html.replace(/\{\{og_description\}\}/g, escapeHtml(context.ogDescription))

    // Styles
    html = html.replace(/\{\{primary_color\}\}/g, escapeHtml(context.primaryColor))
    html = html.replace(/\{\{font_family\}\}/g, escapeHtml(context.fontFamily))

    // CTA URL
    html = html.replace(/\{\{cta_url\}\}/g, escapeHtml(context.ctaUrl))

    return html
  }

}

export function escapeHtml(text: string): string {
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
