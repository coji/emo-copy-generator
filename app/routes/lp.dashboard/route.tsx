import { Link } from 'react-router'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Stack } from '~/components/ui/stack'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { db } from '~/services/db.local'
import type { Route } from './+types/route'

export const loader = async () => {
  const landingPages = await db
    .selectFrom('landingPages')
    .leftJoin('generationLogs', 'landingPages.generationLogId', 'generationLogs.id')
    .select([
      'landingPages.id',
      'landingPages.title',
      'landingPages.shareUrl',
      'landingPages.viewCount',
      'landingPages.isPublic',
      'landingPages.createdAt',
      'generationLogs.productName',
    ])
    .orderBy('landingPages.createdAt', 'desc')
    .execute()

  const totalViews = await db
    .selectFrom('lpViews')
    .select(db.fn.count('id').as('count'))
    .executeTakeFirst()

  return {
    landingPages,
    totalViews: Number(totalViews?.count || 0),
  }
}

export default function LPDashboard({ loaderData }: Route.ComponentProps) {
  const { landingPages, totalViews } = loaderData

  return (
    <div className="container mx-auto py-8">
      <Stack gap="xl">
        <div>
          <h1 className="text-3xl font-bold">LP管理ダッシュボード</h1>
          <p className="text-muted-foreground mt-2">
            作成したランディングページの管理
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>総LP数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{landingPages.length}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>総ビュー数</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalViews}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>公開中のLP</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {landingPages.filter((lp: { isPublic: number | null }) => lp.isPublic === 1).length}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>LP一覧</CardTitle>
            <CardDescription>
              作成したランディングページの一覧
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>タイトル</TableHead>
                  <TableHead>商品名</TableHead>
                  <TableHead>ビュー数</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>作成日</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {landingPages.map((lp: {
                  id: string | null
                  title: string
                  shareUrl: string | null
                  viewCount: number | null
                  isPublic: number | null
                  createdAt: string
                  productName: string | null
                }) => (
                  <TableRow key={lp.id}>
                    <TableCell>{lp.title}</TableCell>
                    <TableCell>{lp.productName}</TableCell>
                    <TableCell>{lp.viewCount}</TableCell>
                    <TableCell>
                      {lp.isPublic === 1 ? '公開中' : '非公開'}
                    </TableCell>
                    <TableCell>
                      {new Date(lp.createdAt).toLocaleDateString('ja-JP')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/lp/${lp.id}`}>詳細</Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a 
                            href={`/lp/share/${lp.shareUrl}`} 
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            公開ページ
                          </a>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </Stack>
    </div>
  )
}