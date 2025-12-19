import { experimental_useObject as useObject } from '@ai-sdk/react'
import { parseWithZod } from '@conform-to/zod/v4'
import { createId } from '@paralleldrive/cuid2'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  LoaderCircleIcon,
} from 'lucide-react'
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
import { Stack } from '~/components/ui/stack'
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

export const loader = ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  const productName = url.searchParams.get('productName') ?? undefined
  const productCategory = url.searchParams.get('productCategory') ?? undefined
  const targetUserImage = url.searchParams.get('targetUserImage') ?? undefined
  const brandImagesParam = url.searchParams.get('brandImages')
  const brandImages = brandImagesParam ? brandImagesParam.split(',') : ['']

  return {
    defaultValue: {
      productName,
      productCategory,
      targetUserImage,
      brandImages,
    },
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [isGenerated, setIsGenerated] = useState(false)
  const [generationLogId, setGenerationLogId] = useState<string | null>(null)
  const [defaultValue, setDefaultValue] = useState<
    Partial<z.infer<typeof inputSchema>>
  >(loaderData.defaultValue)
  const [formKey, setFormKey] = useState(0)
  const [isFormOpen, setIsFormOpen] = useState(true)
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
            isGenerated &&
              'items-start gap-4 md:grid-cols-[auto_1fr_1fr] md:gap-6',
          )}
        >
          {/* 左カラム: 入力フォーム（横折りたたみ） */}
          <div
            className={cn(
              'w-full transition-all duration-300 ease-in-out md:overflow-hidden',
              !isGenerated
                ? 'mx-auto max-w-md'
                : isFormOpen
                  ? 'md:w-80'
                  : 'md:w-10',
            )}
          >
            {/* フォームヘッダー */}
            <div
              className={cn(
                'flex items-center gap-2',
                isFormOpen ? 'h-9 justify-between' : 'justify-center',
              )}
            >
              {isGenerated && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                  className={cn('gap-1', !isFormOpen && 'h-auto px-1 py-2')}
                >
                  {isFormOpen ? (
                    <>
                      <h2 className="mb-0 text-sm">初期設定</h2>
                      <ChevronLeftIcon className="h-4 w-4" />
                    </>
                  ) : (
                    <span className="text-foreground/70 text-sm font-medium md:flex md:flex-col md:items-center md:text-xs md:leading-snug">
                      <span className="md:hidden">初期設定</span>
                      <span className="hidden md:inline">初</span>
                      <span className="hidden md:inline">期</span>
                      <span className="hidden md:inline">設</span>
                      <span className="hidden md:inline">定</span>
                    </span>
                  )}
                </Button>
              )}
              {!isGenerated && <h2 className="mb-0">初期設定</h2>}
              {isFormOpen && (
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
                            setFormKey((prev) => prev + 1)
                            setIsFormOpen(true)
                          }}
                          className="text-xs"
                        >
                          {ex.productName} - {ex.productCategory}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {/* フォーム本体 */}
            <div
              className={cn(
                'transition-all duration-300 ease-in-out',
                isFormOpen
                  ? 'opacity-100'
                  : 'pointer-events-none h-0 opacity-0',
              )}
            >
              <Stack className="gap-4 pt-4">
                <GenerationForm
                  key={formKey}
                  defaultValue={defaultValue}
                  isLoading={isLoading}
                  isThinking={isLoading && !object}
                  onStop={stop}
                  onSubmit={(values) => {
                    const newGenerationLogId = createId()
                    setGenerationLogId(newGenerationLogId)
                    submit({ ...values, generationLogId: newGenerationLogId })
                    setIsGenerated(true)
                    setIsFormOpen(false)
                  }}
                />
              </Stack>
            </div>
          </div>

          {/* 中央カラム: ユーザーストーリー */}
          {isGenerated && (
            <Stack className="gap-4">
              <h2 className="mb-0 flex h-9 items-center text-sm">
                ユーザーストーリー
              </h2>
              <Stack
                gap="lg"
                className="rounded-xl border px-4 py-4 text-sm leading-relaxed"
              >
                {isLoading && !object && (
                  <div className="text-muted-foreground flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />
                    <span>ストーリーを考えています...</span>
                  </div>
                )}
                {object?.novel && (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="animate-fadeIn mb-2 last:mb-0">
                          {children}
                        </p>
                      ),
                    }}
                  >
                    {object.novel}
                  </ReactMarkdown>
                )}
              </Stack>
            </Stack>
          )}

          {/* 右カラム: コピー案 */}
          {isGenerated && (
            <Stack className="gap-4">
              <div className="flex h-9 items-center justify-between">
                <h2 className="mb-0 text-sm">コピー案</h2>
                {object && generationLogId && (
                  <Button asChild size="sm">
                    <Link to={`/lp/generate/${generationLogId}`}>LP作成</Link>
                  </Button>
                )}
              </div>
              <Stack className="gap-2">
                {copyCandidates.map((copy, index) => (
                  <div
                    key={copy}
                    className="animate-fadeIn flex items-baseline gap-2 rounded-lg border px-3 py-2"
                  >
                    <span className="text-muted-foreground shrink-0 text-xs">
                      {index + 1}.
                    </span>
                    <span className="text-base leading-relaxed">{copy}</span>
                  </div>
                ))}
              </Stack>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>エラーが発生しました</AlertTitle>
                  <AlertDescription>
                    {error.message || '不明なエラーが発生しました。'}
                  </AlertDescription>
                </Alert>
              )}
            </Stack>
          )}
        </div>
      </Main>

      <Footer />
    </div>
  )
}
