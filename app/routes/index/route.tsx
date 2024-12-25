import { experimental_useObject as useObject } from '@ai-sdk/react'
import { parseWithZod } from '@conform-to/zod'
import { ChevronDownIcon } from 'lucide-react'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import type { z } from 'zod'
import { Footer } from '~/components/layout/footer'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { HStack, Stack } from '~/components/ui/stack'
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table'
import examples from '~/data/example.json'
import { cn } from '~/lib/utils'
import { inputSchema, outputSchema } from '../api'
import type { Route } from './+types/route'
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
  const [defaultValue, setDefaultValue] = useState<
    Partial<z.infer<typeof inputSchema>>
  >({
    brandImages: [''],
  })
  const { submit, stop, error, isLoading, object } = useObject({
    api: '/api',
    schema: outputSchema,
  })

  // コピー案をまとめる
  const copyCandidates = [
    object?.title,
    ...(object?.shortPoemsInspiredByTheStory?.split('。') ?? []),
    object?.theProtagonistsLastWords,
  ]
    .filter((s) => s !== undefined && s !== '')
    .map((s) => (s?.endsWith('。') ? s : `${s}。`)) // 最後が。で終わらない場合は。を追加

  return (
    <div className="container grid min-h-dvh grid-rows-[auto,1fr,auto]">
      <Header>
        <HStack>
          <h1 className="flex-1 text-2xl font-bold">Emo Copy Generator</h1>
          <div className="ml-auto flex items-center gap-4">
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

            <ThemeSwitch />
          </div>
        </HStack>
        <p className="text-muted-foreground">
          Generate emotional copy for your next project.
        </p>
      </Header>

      <Main fixed>
        <Stack
          className={cn(
            'grid grid-cols-1 gap-0',
            object && 'gap-4 md:grid-cols-[1fr,2fr,1fr]',
          )}
        >
          <Stack>
            {object && <h2>初期設定</h2>}
            <GenerationForm
              defaultValue={defaultValue}
              isLoading={isLoading}
              onStop={stop}
              onSubmit={(values) => submit(values)}
            />
          </Stack>

          {object?.novel && (
            <Stack>
              <h2>ユーザーストーリー</h2>
              <Stack
                gap="lg"
                className="rounded-md border p-2 text-sm leading-relaxed"
              >
                <ReactMarkdown>{object.novel}</ReactMarkdown>
              </Stack>
            </Stack>
          )}

          {copyCandidates.length > 0 && (
            <Stack>
              <h2>コピー案</h2>
              <Table>
                <TableBody>
                  {copyCandidates.map((copy, index) => (
                    <TableRow key={copy}>
                      <TableCell className="whitespace-nowrap">
                        {index + 1}.
                      </TableCell>
                      <TableCell>{copy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          )}
        </Stack>
      </Main>

      <Footer />
    </div>
  )
}
