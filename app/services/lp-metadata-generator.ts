import { generateObject } from 'ai'
import { z } from 'zod'

// LP用メタデータのスキーマ
export const lpMetadataSchema = z.object({
  mainCopy: z.string().describe('メインキャッチコピー（選択されたコピーから）'),
  subCopy: z
    .string()
    .describe('サブキャッチコピー（ブランドや価値を短く表現）'),
  ctaText: z.string().describe('CTAボタンのテキスト（行動を促す短い文言）'),
  ctaUrl: z.string().describe('CTAボタンのリンク先URL'),
  subDescription: z
    .string()
    .describe('商品の簡潔な説明（ターゲットと価値を含む）'),
  ogDescription: z.string().describe('OGP用の説明文（SNSシェア時の説明）'),
  formattedStory: z
    .string()
    .describe('整形されたユーザーストーリー（改行と余韻を含む）'),
  brandMessage: z.string().describe('ブランドメッセージ（短い印象的な一言）'),
})

export type LPMetadata = z.infer<typeof lpMetadataSchema>

interface GenerateMetadataOptions {
  productName: string
  productCategory: string
  targetUserImage: string
  brandImages: string[]
  selectedCopies: string[]
  story: string
  // biome-ignore lint/suspicious/noExplicitAny: AI SDK model type
  model: any
}

export async function generateLPMetadata({
  productName,
  productCategory,
  targetUserImage,
  brandImages,
  selectedCopies,
  story,
  model,
}: GenerateMetadataOptions): Promise<LPMetadata> {
  const prompt = `
あなたはランディングページのコピーライターです。
以下の情報を元に、魅力的なLP用のメタデータを生成してください。

商品情報:
- 商品名: ${productName}
- カテゴリ: ${productCategory}
- ターゲット: ${targetUserImage}
- ブランドイメージ: ${brandImages.join(', ')}

選択されたコピー候補:
${selectedCopies.map((copy, i) => `${i + 1}. ${copy}`).join('\n')}

元のストーリー:
${story}

生成ガイドライン:
1. mainCopy: 選択されたコピーの中から最も印象的なものを選択
2. subCopy: ターゲットとブランドイメージを反映した短い副題（例：「都心で輝く、あなたのための一杯」）
3. ctaText: 行動を促す短い文言（例：「今すぐ体験」「詳しく見る」「無料で試す」）
4. subDescription: ターゲットと価値を含む簡潔な説明（例：「${targetUserImage}のための${productCategory}」をベースに拡張）
5. ogDescription: SNSでシェアされた時に表示される魅力的な説明文
6. formattedStory: 元のストーリーに適切な改行を入れて、読みやすく余韻のある形に整形。詩的な表現を活かす
7. brandMessage: ブランドの本質を表す短く印象的な一言

ターゲットユーザーの心に響く、感情的で魅力的な表現を心がけてください。
`

  const { object } = await generateObject({
    model,
    schema: lpMetadataSchema,
    prompt,
  })

  return object
}

// 手動でメタデータを作成するヘルパー関数
export function createDefaultMetadata(
  productName: string,
  productCategory: string,
  targetUserImage: string,
  selectedCopies: string[],
  story: string,
): LPMetadata {
  const mainCopy = selectedCopies[0] || 'キャッチコピー'

  // ストーリーに改行を追加（句読点で区切る）
  const formattedStory = story
    .replace(/。/g, '。\n\n')
    .replace(/、/g, '、\n')
    .trim()

  return {
    mainCopy,
    subCopy: `${targetUserImage}の日常に寄り添う`,
    ctaText: '詳しく見る',
    ctaUrl: '#',
    subDescription: `${targetUserImage}のための${productCategory}`,
    ogDescription: `${mainCopy} - ${productName}の特別なページ`,
    formattedStory,
    brandMessage: '毎日に、新しい体験を',
  }
}
