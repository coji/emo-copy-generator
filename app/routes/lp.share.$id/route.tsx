import { LandingPageView } from '~/components/lp-templates/LandingPageView'
import { db } from '~/services/db.server'
import type { Route } from './+types/route'

export const loader = async ({ params, request }: Route.LoaderArgs) => {
  const { id } = params

  const landingPage = await db
    .selectFrom('landingPages')
    .leftJoin(
      'generationLogs',
      'landingPages.generationLogId',
      'generationLogs.id',
    )
    .select([
      'landingPages.id',
      'landingPages.title',
      'landingPages.templateId',
      'landingPages.selectedCopies',
      'landingPages.config',
      'landingPages.metadata',
      'landingPages.viewCount',
      'generationLogs.productName',
      'generationLogs.productCategory',
      'generationLogs.brandImages',
      'generationLogs.targetUserImage',
      'generationLogs.story',
    ])
    .where('landingPages.shareUrl', '=', id)
    .where('landingPages.isPublic', '=', 1)
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

export default function SharedLandingPage({
  loaderData,
}: Route.ComponentProps) {
  const { landingPage } = loaderData

  // Reactコンポーネントでレンダリング
  return (
    <LandingPageView
      templateId={landingPage.templateId}
      generationLog={{
        id: landingPage.id,
        productName: landingPage.productName || '',
        productCategory: landingPage.productCategory || '',
        brandImages: landingPage.brandImages || '[]',
        targetUserImage: landingPage.targetUserImage || '',
        story: landingPage.story,
      }}
      selectedCopies={JSON.parse(landingPage.selectedCopies)}
      config={JSON.parse(landingPage.config)}
      metadata={
        landingPage.metadata ? JSON.parse(landingPage.metadata) : undefined
      }
    />
  )
}
