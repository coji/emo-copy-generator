import { experimental_useObject as useObject } from '@ai-sdk/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { ChevronDownIcon, LoaderCircleIcon, XIcon } from 'lucide-react'
import React from 'react'
import { Form } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ThemeSwitch } from '~/components/theme-switch'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { HStack, Stack } from '~/components/ui/stack'
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table'
import examples from '~/data/example.json'
import { cn } from '~/lib/utils'
import type { Route } from './+types/api'
import { inputSchema, outputSchema } from './api'

const brandImagePlaceholders = ['例: 高級感', '例: 若者向け', '例: 女性向け']

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
  const { submit, stop, error, isLoading, object } = useObject({
    api: '/api',
    schema: outputSchema,
  })
  const [form, fields] = useForm({
    defaultValue: {
      brandImages: [''],
    },
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: inputSchema }),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return
      submit(submission.value)
    },
  })
  const brandImageList = fields.brandImages.getFieldList()
  const [isResetAlertOpen, setIsResetAlertOpen] = React.useState(false)

  // コピー案をまとめる
  const copyCandidates = [
    object?.title,
    ...(object?.shortPoemsInspiredByTheStory?.split('。') ?? []),
    object?.theProtagonistsLastWords,
  ]
    .filter((s) => s !== undefined && s !== '')
    .map((s) => (s?.endsWith('。') ? s : `${s}。`)) // 最後が。で終わらない場合は。を追加

  return (
    <div className="grid min-h-dvh grid-rows-[auto,1fr,auto]">
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
                        form.update({
                          name: form.name,
                          value: ex,
                        })
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

      {/* ===== Content ===== */}
      <Main fixed>
        <div
          className={cn(
            'grid grid-cols-1 gap-4 transition-transform duration-200',
            object && 'sm:grid-cols-2',
          )}
        >
          <Form
            method="POST"
            {...getFormProps(form)}
            key={form.key}
            className="mx-auto w-full max-w-md"
          >
            <Stack>
              <Stack gap="sm">
                <Label htmlFor={fields.productName.id}>商品名</Label>
                <Input
                  {...getInputProps(fields.productName, { type: 'text' })}
                  key={fields.productName.key}
                  placeholder="例: 神生ビール"
                />
                <div
                  id={fields.productName.errorId}
                  className="text-sm text-destructive empty:hidden"
                >
                  {fields.productName.errors}
                </div>
              </Stack>

              <Stack gap="sm">
                <Label htmlFor={fields.productCategory.id}>商品カテゴリ</Label>
                <Input
                  {...getInputProps(fields.productCategory, { type: 'text' })}
                  key={fields.productCategory.key}
                  placeholder="例: 缶ビール"
                />
                <div
                  id={fields.productCategory.errorId}
                  className="text-sm text-destructive empty:hidden"
                >
                  {fields.productCategory.errors}
                </div>
              </Stack>

              <Stack gap="sm">
                <Label htmlFor={fields.brandImages.id}>
                  ブランドイメージ (3つまで)
                </Label>
                <Stack gap="sm">
                  {brandImageList.map((field, index) => (
                    <div key={field.key}>
                      <HStack>
                        <Input
                          {...getInputProps(field, { type: 'text' })}
                          key={field.key}
                          placeholder={brandImagePlaceholders[index]}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                          type="button"
                          onClick={() => {
                            form.remove({
                              name: fields.brandImages.name,
                              index,
                            })
                          }}
                        >
                          <XIcon />
                        </Button>
                      </HStack>
                      <div
                        id={field.errorId}
                        className="text-sm text-destructive empty:hidden"
                      >
                        {field.errors}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    onClick={() => {
                      form.insert({
                        name: fields.brandImages.name,
                      })
                    }}
                    variant="outline"
                    size="sm"
                    disabled={brandImageList.length >= 3}
                  >
                    ブランドイメージを追加
                  </Button>
                </Stack>
                <div
                  id={fields.brandImages.errorId}
                  className="text-sm text-destructive empty:hidden"
                >
                  {fields.brandImages.errors}
                </div>
              </Stack>

              <Stack gap="sm">
                <Label htmlFor={fields.targetUserImage.id}>
                  ターゲットユーザーのイメージ
                </Label>
                <Input
                  {...getInputProps(fields.targetUserImage, { type: 'text' })}
                  key={fields.targetUserImage.key}
                  placeholder={'例: 20代都心で働く女性'}
                />
                <div
                  id={fields.targetUserImage.errorId}
                  className="text-sm text-destructive empty:hidden"
                >
                  {fields.targetUserImage.errors}
                </div>
              </Stack>

              <HStack>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading && <LoaderCircleIcon className="animate-spin" />}
                  生成する
                </Button>

                <Button
                  variant="link"
                  type="button"
                  onClick={() => setIsResetAlertOpen(true)}
                >
                  クリア
                </Button>
              </HStack>

              <AlertDialog
                open={isResetAlertOpen}
                onOpenChange={setIsResetAlertOpen}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      入力内容をクリアしますか？
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      この操作は取り消せません。
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault()
                        form.reset()
                        setIsResetAlertOpen(false)
                      }}
                    >
                      クリア
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </Stack>
          </Form>

          <Stack className="mx-auto w-full max-w-md">
            <div className="overflow-hidden">
              <Table>
                <TableBody>
                  {copyCandidates.map((copy, index) => (
                    <TableRow key={copy}>
                      <TableCell className="whitespace-nowrap">
                        案{index + 1}
                      </TableCell>
                      <TableCell>{copy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {object?.novel && (
              <div className="rounded-md border p-2 text-xs">
                <div className="my-1">ユーザーストーリー</div>
                <div className="leading-relaxed">{object.novel}</div>
              </div>
            )}
          </Stack>
        </div>
      </Main>

      <footer className="py-2 text-center text-sm text-muted-foreground">
        <div>
          © {new Date().getFullYear()}{' '}
          <a
            href="https://x.com/techtalkjp"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            coji
          </a>
        </div>
        <HStack className="justify-center">
          <div>
            <a
              href="https://github.com/coji/emo-copy-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              View on GitHub
            </a>
          </div>
        </HStack>
      </footer>
    </div>
  )
}
