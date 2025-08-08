import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { createId } from '@paralleldrive/cuid2'
import { streamObject } from 'ai'
import { sql } from 'kysely'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { db } from '~/services/db.server'
import type { Route } from './+types/api'

export const inputSchema = z.object({
  provider: z.enum(['google', 'openai']),
  productName: z.string({ error: '必須' }),
  productCategory: z.string({ error: '必須' }),
  brandImages: z
    .array(z.string({ error: '必須' }))
    .min(1, '必須')
    .max(3, '3つまで'),
  targetUserImage: z.string({ error: '必須' }),
})

export const outputSchema = z.object({
  novel: z.string(),
  title: z.string(),
  theProtagonistsLastWords: z.string(),
  shortPoemsInspiredByTheStory: z
    .string()
    .meta({ description: '日本語の句点「。」で区切られた3行短詩' }),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const json = await request.json()
  const submission = inputSchema.parse(json)

  const model = match(submission.provider)
    .with('google', () => google('gemini-2.5-flash-lite'))
    .with('openai', () => openai('gpt-5-nano'))
    .exhaustive()

  const prompt = `あなたは気鋭の作家です。

${submission.brandImages.join(', ')}というイメージで、
${submission.productCategory}が登場する、
まるで人間交差点のような、エモーショナルな短編小説を執筆してください。

主人公は${submission.targetUserImage}です。

ストーリーを生成したあと、以下を生成してください。

1. タイトル
2. 主人公の最後の言葉
3. ストーリーにインスパイアされた、句点で区切られた3行短詩

短編小説は本文のみで Markdown 形式で段落ごとに分けて記述してください。
ストーリーの長さは500文字程度で、以下の制約を守ってください。
- 物語の舞台は日本であること
- 主人公は日本人であること
- ストーリーの中に日本語の句点「。」が含まれていること
- ストーリーの中に日本語のカギカッコ「」が含まれていること
- 日本語で書くこと
`
  const modelName = model.modelId
  const temperature: number = 0.5

  const result = await streamObject({
    model,
    prompt,
    schema: outputSchema,
    temperature: 0.5,
    abortSignal: request.signal,
    onFinish: async (event) => {
      await db
        .insertInto('generationLogs')
        .values({
          id: createId(),
          provider: submission.provider,
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
          usagePromptTokens: event.usage.inputTokens ?? 0,
          usageCompletionTokens: event.usage.outputTokens ?? 0,
          usageTotalTokens: event.usage.totalTokens ?? 0,
          createdAt: sql`CURRENT_TIMESTAMP`,
        })
        .execute()
    },
  })

  return result.toTextStreamResponse()
}
