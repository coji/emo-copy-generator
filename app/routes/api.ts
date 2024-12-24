import { google } from '@ai-sdk/google'
import { streamObject } from 'ai'
import { z } from 'zod'
import type { Route } from './+types/api'

export const inputSchema = z.object({
  productName: z.string({ required_error: '必須' }),
  productCategory: z.string({ required_error: '必須' }),
  brandImages: z.array(z.string()).min(1, '必須').max(3, '3つまで'),
  targetUserImage: z.string({ required_error: '必須' }),
})

export const outputSchema = z.object({
  novel: z.string(),
  title: z.string(),
  theProtagonistsLastWords: z.string(),
  shortPoemsInspiredByTheStory: z.string(),
})

export const loader = () => {
  return Response.json('hoge')
}

export const action = async ({ request }: Route.ActionArgs) => {
  const json = await request.json()
  const submission = inputSchema.parse(json)

  const result = await streamObject({
    model: google('gemini-2.0-flash-exp'),
    prompt: `あなたは気鋭の作家です。
    
${submission.productCategory}が登場しつつ、
${submission.brandImages.join(', ')}というイメージで、短編小説を執筆してください。
主人公は${submission.targetUserImage}です。

ストーリーを生成したあと、タイトル、主人公の最後の言葉、ストーリーにインスパイアされた短詩を生成してください。
`,
    schema: outputSchema,
    temperature: 0.5,
  })

  return result.toTextStreamResponse()
}
