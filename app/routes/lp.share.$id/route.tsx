import { db } from '~/services/db.local'
import type { Route } from './+types/route'

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { id } = params

  const landingPage = await db
    .selectFrom('landingPages')
    .selectAll()
    .where('shareUrl', '=', id)
    .where('isPublic', '=', 1)
    .executeTakeFirst()

  if (!landingPage) {
    throw new Response('Page not found', { status: 404 })
  }

  // アクセスログを記録
  const ip = request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const referrer = request.headers.get('referer') || null

  await db
    .insertInto('lpViews')
    .values({
      id: crypto.randomUUID(),
      landingPageId: landingPage.id || '',
      ipAddress: ip,
      userAgent,
      referrer,
    })
    .execute()

  // ビューカウントを増やす
  await db
    .updateTable('landingPages')
    .set({ viewCount: (landingPage.viewCount || 0) + 1 })
    .where('id', '=', landingPage.id)
    .execute()

  return { landingPage }
}

export default function SharedLandingPage({ loaderData }: Route.ComponentProps) {
  const { landingPage } = loaderData

  // HTMLコンテンツを直接レンダリング
  if (landingPage.htmlContent) {
    return (
      // biome-ignore lint/security/noDangerouslySetInnerHtml: LP content is generated server-side
      <div dangerouslySetInnerHTML={{ __html: landingPage.htmlContent }} />
    )
  }

  // フォールバック
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">{landingPage.title}</h1>
      <div className="mt-8">
        {JSON.parse(landingPage.selectedCopies).map((copy: string) => (
          <p key={copy} className="text-lg my-4">
            {copy}
          </p>
        ))}
      </div>
    </div>
  )
}