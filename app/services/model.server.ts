import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import type { LanguageModelV3StreamPart } from '@ai-sdk/provider'
import { wrapLanguageModel } from 'ai'
import { getUsage } from 'tokenlens'
import { match } from 'ts-pattern'

export const createModel = ({
  provider,
  api,
}: {
  provider: 'google' | 'openai'
  api: 'emo-copy-generator'
}) => {
  const baseModel = match(provider)
    .with('google', () => google('gemini-3-flash-preview'))
    .with('openai', () => openai('gpt-5-nano'))
    .exhaustive()
  return wrapLanguageModel({
    model: baseModel,
    middleware: {
      specificationVersion: 'v3',
      wrapStream: async ({ doStream }) => {
        const { stream, ...rest } = await doStream()
        const transformStream = new TransformStream<
          LanguageModelV3StreamPart,
          LanguageModelV3StreamPart
        >({
          transform(chunk, controller) {
            if (chunk.type === 'finish') {
              // Convert LanguageModelV3Usage to UsageLike format for tokenlens
              const usageLike = {
                input_tokens: chunk.usage.inputTokens.total,
                output_tokens: chunk.usage.outputTokens.total,
              }
              const usage = getUsage({
                modelId: baseModel.modelId,
                usage: usageLike,
              })
              console.log({
                modelId: baseModel.modelId,
                api,
                provider,
                usage,
              })
            }
            controller.enqueue(chunk)
          },
        })

        return { stream: stream.pipeThrough(transformStream), ...rest }
      },
    },
  })
}
