import { google } from '@ai-sdk/google'
import { createId } from '@paralleldrive/cuid2'
import { streamObject } from 'ai'
import { sql } from 'kysely'
import { z } from 'zod'
import { db } from '~/services/db.server'
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
  shortPoemsInspiredByTheStory: z.string({
    description: '日本語の句点「。」で区切られた3行短詩',
  }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const json = await request.json()
  const submission = inputSchema.parse(json)
  const prompt = `あなたは気鋭の作家です。

${submission.brandImages.join(', ')}というイメージで、
${submission.productCategory}が登場する、
短編小説を執筆してください。

主人公は${submission.targetUserImage}です。

ストーリーを生成したあと、以下を生成してください。

1. タイトル
2. 主人公の最後の言葉
3. ストーリーにインスパイアされた、句点で区切られた3行短詩

短編小説は本文のみで Markdown 形式で段落ごとに分けて記述してください。
`
  const modelName: Parameters<typeof google>[0] = 'gemini-2.0-pro-exp-02-05'
  const temperature: number = 0.5

  const result = await streamObject({
    model: google(modelName, {
      structuredOutputs: false,
    }),
    prompt,
    schema: outputSchema,
    temperature,
    abortSignal: request.signal,
    onFinish: async (event) => {
      console.log(event)
      await db
        .insertInto('generationLogs')
        .values({
          id: createId(),
          provider: 'google',
          modelName: modelName,
          temperature,
          prompt,
          brandImages: JSON.stringify(submission.brandImages),
          productName: submission.productName,
          productCategory: submission.productCategory,
          targetUserImage: submission.targetUserImage,
          story: event.object?.novel ?? null,
          candidates: JSON.stringify([
            event.object?.title,
            event.object?.theProtagonistsLastWords,
            ...(event.object?.shortPoemsInspiredByTheStory?.split('。') ?? []),
          ]),
          usagePromptTokens: event.usage.promptTokens,
          usageCompletionTokens: event.usage.completionTokens,
          usageTotalTokens: event.usage.totalTokens,
          createdAt: sql`CURRENT_TIMESTAMP`,
        })
        .execute()
    },
  })

  return result.toTextStreamResponse()
}
