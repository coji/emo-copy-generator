import { parseWithZod } from '@conform-to/zod/v4'
import { createId } from '@paralleldrive/cuid2'
import { useState } from 'react'
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
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Stack } from '~/components/ui/stack'
import { Textarea } from '~/components/ui/textarea'
import { db } from '~/services/db.server'
import type { LPMetadata } from '~/services/lp-metadata-generator'
import type { Route } from './+types/route'

const generateSchema = z.object({
  generationLogId: z.string(),
  templateId: z.string(),
  selectedCopies: z.array(z.string()).min(1),
  metadata: z.object({
    mainCopy: z.string(),
    subCopy: z.string(),
    ctaText: z.string(),
    ctaUrl: z.string(),
    subDescription: z.string(),
    ogDescription: z.string(),
    formattedStory: z.string(),
    brandMessage: z.string(),
  }),
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

  const { generationLogId, templateId, selectedCopies, metadata, config } =
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

  // LPデータを保存（HTMLは生成しない）
  await db
    .insertInto('landingPages')
    .values({
      id: landingPageId,
      generationLogId,
      templateId,
      title: `${generationLog.productName} - エモコピーLP`,
      selectedCopies: JSON.stringify(selectedCopies),
      config: JSON.stringify(config || JSON.parse(template.defaultConfig)),
      metadata: JSON.stringify(metadata),
      htmlContent: null, // HTMLは保存しない
      isPublic: 1,
      shareUrl,
      viewCount: 0,
    })
    .execute()

  return redirect(`/lp/${landingPageId}`)
}

export default function LPGenerate({
  loaderData,
  params,
}: Route.ComponentProps) {
  const { templates, candidates, generationLog } = loaderData
  const generationLogId = params.id

  const [selectedCopies, setSelectedCopies] = useState<string[]>([])
  const [metadata, setMetadata] = useState<LPMetadata>({
    mainCopy: '',
    subCopy: '',
    ctaText: '詳しく見る',
    ctaUrl: '#',
    subDescription: '',
    ogDescription: '',
    formattedStory: generationLog.story || '',
    brandMessage: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)

  // メタデータを生成
  const handleGenerateMetadata = async () => {
    if (selectedCopies.length === 0) {
      alert('コピーを選択してください')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generationLogId,
          selectedCopies,
          provider: 'google',
        }),
      })

      if (response.ok) {
        const generated = await response.json()
        setMetadata(generated)
      } else {
        alert('メタデータの生成に失敗しました')
      }
    } catch (error) {
      console.error('Failed to generate metadata:', error)
      alert('メタデータの生成に失敗しました')
    } finally {
      setIsGenerating(false)
    }
  }

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
                    <label
                      key={template.id}
                      className="flex cursor-pointer items-center gap-2"
                    >
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
                  LPに使用するコピーを選んでください（複数選択可）
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
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCopies([...selectedCopies, copy])
                          } else {
                            setSelectedCopies(
                              selectedCopies.filter((c) => c !== copy),
                            )
                          }
                        }}
                      />
                      <span>{copy}</span>
                    </label>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </div>

          {/* メタデータ編集 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>LPメタデータ</CardTitle>
                  <CardDescription>
                    LPで使用するテキストを編集できます
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateMetadata}
                  disabled={isGenerating || selectedCopies.length === 0}
                >
                  {isGenerating ? 'AIで生成中...' : 'AIで生成'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Stack>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="mainCopy">メインコピー</Label>
                    <Input
                      id="mainCopy"
                      name="metadata.mainCopy"
                      value={metadata.mainCopy}
                      onChange={(e) =>
                        setMetadata({ ...metadata, mainCopy: e.target.value })
                      }
                      placeholder="例：夜の交差点とビールの泡"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subCopy">サブコピー</Label>
                    <Input
                      id="subCopy"
                      name="metadata.subCopy"
                      value={metadata.subCopy}
                      onChange={(e) =>
                        setMetadata({ ...metadata, subCopy: e.target.value })
                      }
                      placeholder="例：都心で輝く、あなたのための一杯"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="ctaText">CTAボタンテキスト</Label>
                    <Input
                      id="ctaText"
                      name="metadata.ctaText"
                      value={metadata.ctaText}
                      onChange={(e) =>
                        setMetadata({ ...metadata, ctaText: e.target.value })
                      }
                      placeholder="例：詳しく見る"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="brandMessage">ブランドメッセージ</Label>
                    <Input
                      id="brandMessage"
                      name="metadata.brandMessage"
                      value={metadata.brandMessage}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          brandMessage: e.target.value,
                        })
                      }
                      placeholder="例：毎日に、新しい体験を"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subDescription">商品説明</Label>
                  <Textarea
                    id="subDescription"
                    name="metadata.subDescription"
                    value={metadata.subDescription}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        subDescription: e.target.value,
                      })
                    }
                    placeholder="例：20代都心で働く女性のためのクラフトビール"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="ogDescription">
                    OGP説明文（SNSシェア用）
                  </Label>
                  <Textarea
                    id="ogDescription"
                    name="metadata.ogDescription"
                    value={metadata.ogDescription}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        ogDescription: e.target.value,
                      })
                    }
                    placeholder="例：都会の夜に寄り添う特別なビール。仕事終わりの一杯を、より豊かな時間に。"
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="formattedStory">
                    ユーザーストーリー（改行で余韻を表現）
                  </Label>
                  <Textarea
                    id="formattedStory"
                    name="metadata.formattedStory"
                    value={metadata.formattedStory}
                    onChange={(e) =>
                      setMetadata({
                        ...metadata,
                        formattedStory: e.target.value,
                      })
                    }
                    rows={8}
                    required
                    className="font-mono"
                  />
                </div>

                {/* Hidden inputs for metadata */}
                <input
                  type="hidden"
                  name="metadata.ctaUrl"
                  value={metadata.ctaUrl}
                />
              </Stack>
            </CardContent>
          </Card>

          <Button type="submit" size="lg">
            LPを作成
          </Button>
        </Stack>
      </Form>
    </div>
  )
}
