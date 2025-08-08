import { experimental_useObject as useObject } from '@ai-sdk/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { createId } from '@paralleldrive/cuid2'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router'
import type { z } from 'zod'
import { Footer } from '~/components/layout/footer'
import { Main } from '~/components/layout/main'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Skeleton } from '~/components/ui/skeleton'
import { Stack } from '~/components/ui/stack'
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table'
import examples from '~/data/example.json'
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
  const [generationLogId, setGenerationLogId] = useState<string | null>(null)
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
      <AppHeader />

      <Main fixed>
        <div
          className={cn(
            'grid grid-cols-1 gap-0',
            isGenerated && 'gap-4 md:grid-cols-3 md:gap-8',
          )}
        >
          <Stack>
            <div className="mx-auto w-full max-w-md">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="mb-0">初期設定</h2>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm">
                      サンプル入力
                      <ChevronDownIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {examples.map((ex) => {
                      return (
                        <DropdownMenuItem
                          key={`${ex.productName}_${ex.productCategory}`}
                          onClick={() => {
                            setDefaultValue({ ...ex })
                          }}
                          className="text-xs"
                        >
                          {ex.productName} - {ex.productCategory}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <GenerationForm
                defaultValue={defaultValue}
                isLoading={isLoading}
                onStop={stop}
                onSubmit={(values) => {
                  const newGenerationLogId = createId()
                  setGenerationLogId(newGenerationLogId)
                  submit({ ...values, generationLogId: newGenerationLogId })
                  setIsGenerated(true)
                }}
              />
            </div>
          </Stack>

          {isGenerated && (
            <Stack>
              <h2>ユーザーストーリー</h2>
              {isLoading && !object ? (
                <div className="rounded-xl border p-8">
                  <Stack gap="md">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </Stack>
                </div>
              ) : (
                object && (
                  <Stack
                    gap="lg"
                    className="[&>p]:animate-fadeIn rounded-xl border p-8 text-sm leading-relaxed"
                  >
                    <div>
                      <ReactMarkdown>{object.novel}</ReactMarkdown>
                    </div>
                  </Stack>
                )
              )}
            </Stack>
          )}

          {isGenerated && (
            <Stack>
              <div className="flex items-center justify-between">
                <h2>コピー案</h2>
                {object && generationLogId && (
                  <Button asChild>
                    <Link to={`/lp/generate/${generationLogId}`}>LPを作成</Link>
                  </Button>
                )}
              </div>
              {isLoading && !object ? (
                <Table>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell>{i}.</TableCell>
                        <TableCell>
                          <Skeleton className="h-8 w-full max-w-2xl" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
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
              )}
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
