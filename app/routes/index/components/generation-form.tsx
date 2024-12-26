import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { LoaderCircleIcon, PlusIcon, XIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { Form } from 'react-router'
import type { z } from 'zod'
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
import { Card, CardContent, CardFooter } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { HStack, Stack } from '~/components/ui/stack'
import { inputSchema } from '~/routes/api'

const brandImagePlaceholders = ['例: 高級感', '例: 若者向け', '例: 女性向け']

export const GenerationForm = ({
  defaultValue,
  isLoading,
  onStop,
  onSubmit,
}: {
  defaultValue?: Partial<z.infer<typeof inputSchema>>
  isLoading: boolean
  onStop: () => void
  onSubmit: (values: z.infer<typeof inputSchema>) => void
}) => {
  const [isResetAlertOpen, setIsResetAlertOpen] = React.useState(false)
  const [form, fields] = useForm({
    defaultValue,
    onValidate: ({ formData }) =>
      parseWithZod(formData, { schema: inputSchema }),
    onSubmit: (event, { submission }) => {
      event.preventDefault()
      if (submission?.status !== 'success') return
      onSubmit(submission.value)
    },
  })
  const brandImageList = fields.brandImages.getFieldList()

  useEffect(() => {
    if (defaultValue) {
      form.update({
        name: form.name,
        value: defaultValue,
      })
    }
  }, [form.update, form.name, defaultValue])

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardContent className="pt-8">
        <Form method="POST" {...getFormProps(form)} key={form.key}>
          <Stack gap="lg">
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
                  variant="link"
                  size="sm"
                  disabled={brandImageList.length >= 3}
                >
                  <PlusIcon />
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
          </Stack>
        </Form>
      </CardContent>

      <CardFooter>
        <HStack className="w-full">
          <Button
            type="submit"
            form={form.id}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading && <LoaderCircleIcon className="animate-spin" />}
            生成する
          </Button>

          {isLoading && (
            <Button variant="ghost" type="button" onClick={() => onStop()}>
              停止
            </Button>
          )}

          <Button
            variant="link"
            type="button"
            onClick={() => setIsResetAlertOpen(true)}
          >
            クリア
          </Button>
        </HStack>

        <AlertDialog open={isResetAlertOpen} onOpenChange={setIsResetAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>入力内容をクリアしますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は取り消せません。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault()
                  form.update({
                    name: form.name,
                    value: {
                      brandImages: [''],
                    },
                    validated: false,
                  })
                  setIsResetAlertOpen(false)
                }}
              >
                クリア
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
