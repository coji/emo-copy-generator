import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { db } from '~/services/db.server'
import type { Route } from './+types/route'

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { id } = params

  const landingPage = await db
    .selectFrom('landingPages')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!landingPage) {
    throw new Response('Landing page not found', { status: 404 })
  }

  // ビューカウントを増やす
  await db
    .updateTable('landingPages')
    .set({ viewCount: (landingPage.viewCount || 0) + 1 })
    .where('id', '=', id)
    .execute()

  return { landingPage }
}

export default function LandingPageDetail({
  loaderData,
}: Route.ComponentProps) {
  const { landingPage } = loaderData

  return (
    <div className="container mx-auto py-8">
      <Stack gap="xl">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{landingPage.title}</h1>
            <p className="text-muted-foreground mt-2">
              作成日:{' '}
              {new Date(landingPage.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
          <Button variant="outline" asChild>
            <a href={`/lp/share/${landingPage.shareUrl}`} target="_blank">
              公開ページを見る
            </a>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>プレビュー</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <iframe
                  src={`/lp/share/${landingPage.shareUrl}`}
                  className="h-[600px] w-full"
                  title="LP Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>統計情報</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack>
                <div>
                  <p className="text-muted-foreground text-sm">ビュー数</p>
                  <p className="text-2xl font-bold">{landingPage.viewCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">公開URL</p>
                  <code className="bg-muted block rounded p-2 text-xs break-all">
                    {`${typeof window !== 'undefined' ? window.location.origin : ''}/lp/share/${landingPage.shareUrl}`}
                  </code>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">ステータス</p>
                  <p>{landingPage.isPublic ? '公開中' : '非公開'}</p>
                </div>
              </Stack>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>使用コピー</CardTitle>
          </CardHeader>
          <CardContent>
            <Stack>
              {JSON.parse(landingPage.selectedCopies).map((copy: string) => (
                <div key={copy} className="bg-muted rounded p-3">
                  {copy}
                </div>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </div>
  )
}
