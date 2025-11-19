import { describe, it, expect } from 'vitest'
import { generateLandingPageHtml } from './lp-generator'
import { newspaperTemplate } from './lp-templates'

describe('lp-generator', () => {
  it('should generate HTML matching the snapshot for newspaper template', () => {
    const options = {
      template: {
        baseHtml: newspaperTemplate.base_html,
        defaultConfig: JSON.stringify(newspaperTemplate.default_config),
      },
      generationLog: {
        productName: 'Test Product',
        productCategory: 'Test Category',
        brandImages: JSON.stringify(['Sub Copy 1']),
        targetUserImage: 'Target User',
        story: 'This is a test story.',
      },
      selectedCopies: ['Main Copy', 'Copy 2', 'Copy 3'],
      config: {
        primaryColor: '#123456',
        fontFamily: 'Noto Sans JP',
      },
    }

    const html = generateLandingPageHtml(options)

    expect(html).toMatchSnapshot()
  })
})
