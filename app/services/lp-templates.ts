// Note: Static HTML templates are no longer used.
// The actual rendering is done by React components in app/components/lp-templates/
const placeholderHtml =
  '<!DOCTYPE html><html><body>Rendered by React component</body></html>'

export interface LPTemplate {
  id: string
  name: string
  description: string
  thumbnail_url?: string
  base_html: string
  default_config: {
    primaryColor: string
    fontFamily: string
    layout: 'default' | 'minimal' | 'story'
  }
  category: string
}

export const newspaperTemplate: LPTemplate = {
  id: 'newspaper',
  name: '新聞広告風',
  description: 'クラシックな新聞広告風のデザイン',
  category: 'classic',
  default_config: {
    primaryColor: '#0b0b0b',
    fontFamily: 'Shippori Mincho',
    layout: 'default',
  },
  base_html: placeholderHtml,
}

export const minimalTemplate: LPTemplate = {
  id: 'minimal',
  name: 'ミニマルモダン',
  description: 'シンプルで洗練されたデザイン',
  category: 'modern',
  default_config: {
    primaryColor: '#000000',
    fontFamily: 'Noto Sans JP',
    layout: 'minimal',
  },
  base_html: placeholderHtml,
}

export const templates: LPTemplate[] = [newspaperTemplate, minimalTemplate]
