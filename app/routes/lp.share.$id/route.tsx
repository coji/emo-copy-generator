import { LandingPageView } from '~/components/lp-templates/landing-page-view'
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

  // 関連LPを取得（同じカテゴリの他のLP）
  const relatedLPs = await db
    .selectFrom('landingPages')
    .leftJoin(
      'generationLogs',
      'landingPages.generationLogId',
      'generationLogs.id',
    )
    .select([
      'landingPages.id',
      'landingPages.shareUrl',
      'landingPages.selectedCopies',
      'generationLogs.productName',
      'generationLogs.productCategory',
    ])
    .where(
      'generationLogs.productCategory',
      '=',
      landingPage.productCategory || '',
    )
    .where('landingPages.id', '!=', landingPage.id)
    .where('landingPages.isPublic', '=', 1)
    .orderBy('landingPages.createdAt', 'desc')
    .limit(4)
    .execute()

  return { landingPage, relatedLPs }
}

export const meta = ({ data }: Route.MetaArgs) => {
  if (!data?.landingPage) {
    return [{ title: 'ページが見つかりません' }]
  }

  const { landingPage } = data
  const selectedCopies = JSON.parse(landingPage.selectedCopies)
  const mainCopy = selectedCopies[0] || ''
  const storyExcerpt = landingPage.story
    ? `${landingPage.story.substring(0, 150)}...`
    : ''

  const title = `${mainCopy} | ${landingPage.productName}`
  const description =
    storyExcerpt ||
    `${landingPage.targetUserImage}のための${landingPage.productCategory}`

  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'エモーショナルコピージェネレーター' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]
}

export default function SharedLandingPage({
  loaderData,
}: Route.ComponentProps) {
  const { landingPage, relatedLPs } = loaderData

  const generationLog = {
    id: landingPage.id,
    productName: landingPage.productName || '',
    productCategory: landingPage.productCategory || '',
    brandImages: landingPage.brandImages || '[]',
    targetUserImage: landingPage.targetUserImage || '',
    story: landingPage.story,
  }

  // Reactコンポーネントでレンダリング
  return (
    <LandingPageView
      templateId={landingPage.templateId}
      generationLog={generationLog}
      selectedCopies={JSON.parse(landingPage.selectedCopies)}
      config={JSON.parse(landingPage.config)}
      relatedLPs={relatedLPs}
    />
  )
}
