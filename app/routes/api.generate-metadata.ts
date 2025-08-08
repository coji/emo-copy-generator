import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import type { ActionFunctionArgs } from 'react-router'
import { z } from 'zod'
import { db } from '~/services/db.server'
import { lpMetadataSchema } from '~/services/lp-metadata-generator'

const inputSchema = z.object({
  generationLogId: z.string(),
  selectedCopies: z.array(z.string()),
  provider: z.enum(['google', 'openai']).optional(),
})

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = await request.json()
  const {
    generationLogId,
    selectedCopies,
    provider = 'google',
  } = inputSchema.parse(data)

  // 生成ログから情報を取得
  const generationLog = await db
    .selectFrom('generationLogs')
    .selectAll()
    .where('id', '=', generationLogId)
    .executeTakeFirst()

  if (!generationLog) {
    return Response.json({ error: 'Generation log not found' }, { status: 404 })
  }

  const brandImages = JSON.parse(generationLog.brandImages || '[]')

  // モデルを選択
  const model =
    provider === 'openai' ? openai('gpt-4o-mini') : google('gemini-1.5-flash')

  const prompt = `
あなたはランディングページのコピーライターです。
以下の情報を元に、魅力的なLP用のメタデータを生成してください。

商品情報:
- 商品名: ${generationLog.productName}
- カテゴリ: ${generationLog.productCategory}
- ターゲット: ${generationLog.targetUserImage}
- ブランドイメージ: ${brandImages.join(', ')}

選択されたコピー候補:
${selectedCopies.map((copy, i) => `${i + 1}. ${copy}`).join('\n')}

元のストーリー:
${generationLog.story}

生成ガイドライン:
1. mainCopy: 選択されたコピーの中から最も印象的なものを選択
2. subCopy: ターゲットとブランドイメージを反映した短い副題（例：「都心で輝く、あなたのための一杯」）
3. ctaText: 行動を促す短い文言（例：「今すぐ体験」「詳しく見る」「無料で試す」）
4. ctaUrl: '#' を設定
5. subDescription: ターゲットと価値を含む簡潔な説明
6. ogDescription: SNSでシェアされた時に表示される魅力的な説明文
7. formattedStory: 元のストーリーに適切な改行を入れて、読みやすく余韻のある形に整形。詩的な表現を活かす。
   - 「。」の後には2つの改行を入れる
   - 感情的な部分や間を持たせたい部分にも改行を追加
   - 3〜4文ごとに段落を作る
8. brandMessage: ブランドの本質を表す短く印象的な一言

ターゲットユーザーの心に響く、感情的で魅力的な表現を心がけてください。
`

  try {
    const { object } = await generateObject({
      model,
      schema: lpMetadataSchema,
      prompt,
    })

    return Response.json(object)
  } catch (error) {
    console.error('Failed to generate metadata:', error)
    return Response.json(
      { error: 'Failed to generate metadata' },
      { status: 500 },
    )
  }
}
