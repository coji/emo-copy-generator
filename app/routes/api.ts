import { createId } from '@paralleldrive/cuid2'
import { streamObject } from 'ai'
import { sql } from 'kysely'
import { z } from 'zod'
import { db } from '~/services/db.server'
import { createModel } from '~/services/model.server'
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
  generationLogId: z.string().optional(),
})

export const outputSchema = z.object({
  novel: z
    .string()
    .meta({ description: '段落間は2つの改行文字(\\n\\n)で区切ること' }),
  title: z.string(),
  theProtagonistsLastWords: z.string(),
  shortPoemsInspiredByTheStory: z
    .string()
    .meta({ description: '日本語の句点「。」で区切られた3行短詩' }),
  generationLogId: z.string().default(''),
})

export const action = async ({ request }: Route.ActionArgs) => {
  const json = await request.json()
  const submission = inputSchema.parse(json)

  const model = createModel({
    provider: submission.provider,
    api: 'emo-copy-generator',
  })
  const prompt = `<role>新聞広告のエモーショナルコピーを生み出す天才コピーライター兼短編作家。読者の心の琴線に触れ、涙を誘う物語とコピーを紡ぐ。</role>

<task>
商品と顧客像から、心に残るエモーショナルな短編小説を執筆し、新聞広告に使えるキャッチコピーを生成する。
</task>

<input>
- 商品名: ${submission.productName}
- 商品カテゴリ: ${submission.productCategory}
- ブランドイメージ: ${submission.brandImages.join(', ')}
- ターゲット顧客像: ${submission.targetUserImage}
</input>

<story_guidelines>
- 読者が自分自身や大切な人を重ねられる普遍的な物語
- 日常の何気ない瞬間に宿る、忘れていた大切なものに気づく瞬間
- 親子、夫婦、友人など人と人との絆を描く
- 商品は物語の中で自然に登場し、人生の転機や気づきのきっかけとなる
- 最後に静かな余韻と希望を残す
- 「人間交差点」「深夜食堂」のような情緒
</story_guidelines>

<copy_guidelines>
- 短く、印象的で、声に出して読みたくなる言葉
- 商品名を直接使わず、感情や情景で商品を想起させる
- 読んだ人が立ち止まって考えたくなるような問いかけや気づき
- 新聞の見開き広告に大きく載せても映える言葉
</copy_guidelines>

<format>
- 日本語で執筆
- 舞台は日本、主人公は日本人
- 400〜600文字
- 3〜4段落に分け、段落間は空行で区切る
- 会話文（カギカッコ「」）を効果的に使う
</format>

<output>
1. novel: 短編小説本文（読者の涙を誘う物語）
2. title: 物語のタイトル（短く印象的に）
3. theProtagonistsLastWords: 主人公の心の声または最後のセリフ（物語の核心となる一言）
4. shortPoemsInspiredByTheStory: 広告コピー向け3行短詩（句点「。」で区切る。それぞれ独立したキャッチコピーとして使える）
</output>`
  const modelName = model.modelId
  const temperature: number = 1.0
  const generationLogId = submission.generationLogId || createId()

  const result = await streamObject({
    model,
    providerOptions: {
      openai: { reasoningEffort: 'low' },
      google: {
        thinkingConfig: {
          thinkingLevel: 'high',
          includeThoughts: false,
        },
      },
    },
    prompt,
    schema: outputSchema,
    temperature,
    abortSignal: request.signal,
    onFinish: async (event) => {
      await db
        .insertInto('generationLogs')
        .values({
          id: generationLogId,
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
