import { experimental_useObject as useObject } from '@ai-sdk/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { z } from 'zod'
import { Footer } from '~/components/layout/footer'
import { Main } from '~/components/layout/main'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Stack } from '~/components/ui/stack'
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table'
import { cn } from '~/lib/utils'
import { inputSchema, outputSchema } from '../api'
import type { Route } from './+types/route'
import { AppHeader } from './components/app-header'
import { GenerationForm } from './components/generation-form'

export const action = async ({ request }: Route.ActionArgs) => {
  const submission = parseWithZod(await request.formData(), {
    schema: inputSchema,
  })
  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }
  return { lastResult: submission.reply() }
}

export default function Home() {
  const [isGenerated, setIsGenerated] = useState(false)
  const [defaultValue, setDefaultValue] = useState<
    Partial<z.infer<typeof inputSchema>>
  >({
    brandImages: [''],
  })
  const { submit, stop, isLoading, object, error } = useObject({
    api: '/api',
    schema: outputSchema,
  })

  // コピー案をまとめる
  const copyCandidates = [
    ...(object?.shortPoemsInspiredByTheStory?.split(/。/) ?? []),
    object?.title,
    object?.theProtagonistsLastWords,
  ]
    .filter((s) => s !== undefined && s !== '')
    .map((s) => (s?.endsWith('。') ? s : `${s}。`)) // 最後が。で終わらない場合は。を追加

  return (
    <div className="mx-auto grid min-h-dvh grid-rows-[auto_1fr_auto] md:container">
      <AppHeader onSelectExample={setDefaultValue} />

      <Main fixed>
        <div
          className={cn(
            'grid grid-cols-1 gap-0',
            isGenerated && 'gap-4 md:grid-cols-3 md:gap-8',
          )}
        >
          <Stack>
            <h2 className="mx-auto w-full max-w-md">初期設定</h2>
            <GenerationForm
              defaultValue={defaultValue}
              isLoading={isLoading}
              onStop={stop}
              onSubmit={(values) => {
                submit(values)
                setIsGenerated(true)
              }}
            />
          </Stack>

          {isGenerated && (
            <Stack>
              <h2>ユーザーストーリー</h2>
              {object && (
                <Stack
                  gap="lg"
                  className="[&>p]:animate-fadeIn rounded-xl border p-8 text-sm leading-relaxed"
                >
                  <div>
                    <ReactMarkdown>{object.novel}</ReactMarkdown>
                  </div>
                </Stack>
              )}
            </Stack>
          )}

          {isGenerated && (
            <Stack>
              <h2>コピー案</h2>
              <Table>
                <TableBody>
                  {copyCandidates.map((copy, index) => (
                    <TableRow key={copy}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell className="animate-fadeIn text-2xl">
                        {copy}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          )}

          {error && (
            <Alert variant="destructive" className="col-span-1 md:col-span-3">
              <AlertTitle>エラーが発生しました</AlertTitle>
              <AlertDescription>
                {error.message || '不明なエラーが発生しました。'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Main>

      <Footer />
    </div>
  )
}
