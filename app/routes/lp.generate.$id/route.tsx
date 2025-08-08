import { parseWithZod } from '@conform-to/zod/v4'
import { createId } from '@paralleldrive/cuid2'
import { Form, redirect } from 'react-router'
import { z } from 'zod'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { db } from '~/services/db.local'
import { generateLandingPageHtml } from '~/services/lp-generator'
import type { Route } from './+types/route'

const generateSchema = z.object({
  generationLogId: z.string(),
  templateId: z.string(),
  selectedCopies: z.array(z.string()).min(1),
  config: z
    .object({
      primaryColor: z.string().optional(),
      fontFamily: z.string().optional(),
      layout: z.enum(['default', 'minimal', 'story']).optional(),
    })
    .optional(),
})

export const loader = async ({ params }: Route.LoaderArgs) => {
  const generationLogId = params.id

  if (!generationLogId) {
    throw new Response('Generation ID is required', { status: 400 })
  }

  // 生成ログを取得
  const generationLog = await db
    .selectFrom('generationLogs')
    .selectAll()
    .where('id', '=', generationLogId)
    .executeTakeFirst()

  if (!generationLog) {
    throw new Response('Generation not found', { status: 404 })
  }

  // 利用可能なテンプレートを取得
  const templates = await db
    .selectFrom('lpTemplates')
    .selectAll()
    .where('isActive', '=', 1)
    .execute()

  return {
    generationLog,
    templates,
    candidates: JSON.parse(generationLog.candidates || '[]'),
  }
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData()
  const submission = parseWithZod(formData, { schema: generateSchema })

  if (submission.status !== 'success') {
    return { lastResult: submission.reply() }
  }

  const { generationLogId, templateId, selectedCopies, config } =
    submission.value

  // LP作成
  const landingPageId = createId()
  const shareUrl = createId()

  // 生成ログから必要な情報を取得
  const generationLog = await db
    .selectFrom('generationLogs')
    .selectAll()
    .where('id', '=', generationLogId)
    .executeTakeFirst()

  if (!generationLog) {
    throw new Response('Generation not found', { status: 404 })
  }

  // テンプレートを取得
  const template = await db
    .selectFrom('lpTemplates')
    .selectAll()
    .where('id', '=', templateId)
    .executeTakeFirst()

  if (!template) {
    throw new Response('Template not found', { status: 404 })
  }

  // HTMLコンテンツを生成
  const htmlContent = generateLandingPageHtml({
    template,
    generationLog,
    selectedCopies,
    config: config || JSON.parse(template.defaultConfig),
  })

  // LPを保存
  await db
    .insertInto('landingPages')
    .values({
      id: landingPageId,
      generationLogId,
      templateId,
      title: `${generationLog.productName} - エモコピーLP`,
      selectedCopies: JSON.stringify(selectedCopies),
      config: JSON.stringify(config || JSON.parse(template.defaultConfig)),
      htmlContent,
      isPublic: 1,
      shareUrl,
      viewCount: 0,
    })
    .execute()

  return redirect(`/lp/${landingPageId}`)
}

export default function LPGenerate({ loaderData, params }: Route.ComponentProps) {
  const { templates, candidates } = loaderData
  const generationLogId = params.id

  return (
    <div className="container mx-auto py-8">
      <Form method="post">
        <input type="hidden" name="generationLogId" value={generationLogId} />
        <Stack gap="xl">
          <div>
            <h1 className="text-3xl font-bold">LP作成</h1>
            <p className="text-muted-foreground mt-2">
              生成したコピーを使ってランディングページを作成します
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* テンプレート選択 */}
            <Card>
              <CardHeader>
                <CardTitle>テンプレート選択</CardTitle>
                <CardDescription>
                  使用するLPテンプレートを選んでください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Stack>
                  {templates.map((template, index) => (
                    <label key={template.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="templateId"
                        value={template.id || ''}
                        defaultChecked={index === 0}
                        required
                      />
                      <span>{template.name}</span>
                    </label>
                  ))}
                </Stack>
              </CardContent>
            </Card>

          {/* コピー選択 */}
            <Card>
              <CardHeader>
                <CardTitle>コピー選択</CardTitle>
                <CardDescription>
                  LPに使用するコピーを選んでください
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Stack>
                  {candidates.map((copy: string) => (
                    <label key={copy} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="selectedCopies"
                        value={copy}
                        className="rounded"
                      />
                      <span>{copy}</span>
                    </label>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </div>

          <Button type="submit" size="lg">
            LPを生成
          </Button>
        </Stack>
      </Form>
    </div>
  )
}
