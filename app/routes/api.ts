import { google } from '@ai-sdk/google'
import { streamObject } from 'ai'
import { z } from 'zod'
import type { Route } from './+types/api'

export const inputSchema = z.object({
  productName: z.string({ required_error: '必須' }),
  productCategory: z.string({ required_error: '必須' }),
  brandImages: z
    .array(z.string({ required_error: '必須' }))
    .min(1, '必須')
    .max(3, '3つまで'),
  targetUserImage: z.string({ required_error: '必須' }),
})

export const outputSchema = z.object({
  novel: z.string(),
  title: z.string(),
  theProtagonistsLastWords: z.string(),
  shortPoemsInspiredByTheStory: z.string(),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const json = await request.json()
  const submission = inputSchema.parse(json)

  const result = await streamObject({
    model: google('gemini-2.0-flash-exp'),
    prompt: `あなたは気鋭の作家です。
    
${submission.productCategory}が登場しつつ、
${submission.brandImages.join(', ')}というイメージで、短編小説を執筆してください。

主人公は${submission.targetUserImage}です。

ストーリーを生成したあと、以下を生成してください。
1. タイトル
2. 主人公の最後の言葉
3. ストーリーにインスパイアされた、句点で区切られた3行短詩

短編小説は本文のみで Markdown 形式で段落ごとに分けて記述してください。
`,
    schema: outputSchema,
    temperature: 0.5,
  })

  return result.toTextStreamResponse()
}
