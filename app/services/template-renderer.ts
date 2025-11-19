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
    const replacements: Record<string, string> = {
      '{{product_name}}': escapeHtml(context.productName),
      '{{product_category}}': escapeHtml(context.productCategory),
      '{{main_copy}}': escapeHtml(context.mainCopy),
      '{{sub_copy}}': escapeHtml(context.subCopy),
      '{{story}}': escapeHtml(context.story),
      '{{cta_text}}': escapeHtml(context.ctaText),
      '{{copy_buttons}}': context.copyButtons, // Already HTML
      '{{target_user}}': escapeHtml(context.targetUserImage),
      '{{sub_description}}': escapeHtml(context.subDescription),
      '{{og_description}}': escapeHtml(context.ogDescription),
      '{{primary_color}}': escapeHtml(context.primaryColor),
      '{{font_family}}': escapeHtml(context.fontFamily),
      '{{cta_url}}': escapeHtml(context.ctaUrl),
    }

    return this.templateHtml.replace(/\{\{[a-z_]+\}\}/g, (match) => {
      return replacements[match] ?? match
    })
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
