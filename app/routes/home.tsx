import { experimental_useObject as useObject } from '@ai-sdk/react'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { LoaderCircleIcon, XIcon } from 'lucide-react'
import { Form } from 'react-router'
import { Header } from '~/components/layout/header'
import { Main } from '~/components/layout/main'
import { ThemeSwitch } from '~/components/theme-switch'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { HStack, Stack } from '~/components/ui/stack'
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table'
import type { Route } from './+types/api'
import { inputSchema, outputSchema } from './api'

const brandImagePlaceholders = ['高級感', '若者向け', '女性向け']

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
      console.log(submission)
      submit(submission.value)
    },
  })
  const brandImageList = fields.brandImages.getFieldList()

  return (
    <div>
      {/* ===== Top Heading ===== */}
      <Header>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Emo Copy Generator
          </h1>
          <p className="text-muted-foreground">
            Generate emotional copy for your next project.
          </p>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => {
              form.update({
                name: form.name,
                value: {
                  productName: '神生ビール',
                  productCategory: '缶ビール',
                  brandImages: ['高級感', '若者向け', '女性向け'],
                  targetUserImage: '20代都心で働く女性',
                },
              })
            }}
          >
            サンプル入力
          </Button>
          <ThemeSwitch />
        </div>
      </Header>

      {/* ===== Content ===== */}
      <Main fixed>
        <div className="grid grid-cols-2 gap-4">
          <Form method="POST" {...getFormProps(form)} key={form.key}>
            <Stack>
              <div>
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
              </div>

              <div>
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
              </div>

              <div>
                <Label htmlFor={fields.brandImages.id}>
                  ブランドイメージ (3つまで)
                </Label>
                <Stack>
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
                          {...form.remove.getButtonProps({
                            name: fields.brandImages.name,
                            index,
                          })}
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
                    {...form.insert.getButtonProps({
                      name: fields.brandImages.name,
                    })}
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
              </div>

              <div>
                <Label htmlFor={fields.targetUserImage.id}>
                  ターゲットユーザーのイメージ
                </Label>
                <Input
                  {...getInputProps(fields.targetUserImage, { type: 'text' })}
                  key={fields.targetUserImage.key}
                  placeholder={'例: 20代サラリーマン男性'}
                />
                <div
                  id={fields.targetUserImage.errorId}
                  className="text-sm text-destructive empty:hidden"
                >
                  {fields.targetUserImage.errors}
                </div>
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <LoaderCircleIcon className="animate-spin" />}
                生成する
              </Button>
            </Stack>
          </Form>

          <Stack>
            {object?.novel && (
              <div className="text-xs text-muted-foreground/50">
                {object.novel}
              </div>
            )}

            <div className="overflow-hidden">
              <Table>
                <TableBody>
                  {object?.title && (
                    <TableRow>
                      <TableCell className="whitespace-nowrap">案1</TableCell>
                      <TableCell>{object.title}</TableCell>
                    </TableRow>
                  )}
                  {object?.shortPoemsInspiredByTheStory && (
                    <TableRow>
                      <TableCell className="whitespace-nowrap">案2</TableCell>
                      <TableCell>
                        {object.shortPoemsInspiredByTheStory}
                      </TableCell>
                    </TableRow>
                  )}
                  {object?.theProtagonistsLastWords && (
                    <TableRow>
                      <TableCell className="whitespace-nowrap">案3</TableCell>
                      <TableCell>{object.theProtagonistsLastWords}</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Stack>
        </div>
      </Main>
    </div>
  )
}
