import DOMPurify from 'isomorphic-dompurify'
import { db } from '~/services/db.server'
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

  // Sanitize HTML content server-side
  const sanitizedHtmlContent = landingPage.htmlContent
    ? DOMPurify.sanitize(landingPage.htmlContent, {
        ALLOWED_TAGS: [
          'html', 'head', 'title', 'meta', 'link', 'style', 'body',
          'div', 'section', 'article', 'header', 'footer', 'main', 'aside',
          'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a', 'button',
          'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
          'img', 'svg', 'path', 'g', 'circle', 'rect', 'line', 'polygon',
          'form', 'input', 'textarea', 'select', 'option', 'label',
          'strong', 'em', 'b', 'i', 'u', 'br', 'hr', 'small', 'sub', 'sup'
        ],
        ALLOWED_ATTR: [
          'class', 'id', 'style', 'href', 'src', 'alt', 'title', 'width', 'height',
          'target', 'rel', 'type', 'name', 'value', 'placeholder', 'required',
          'disabled', 'readonly', 'checked', 'selected', 'for', 'lang', 'dir',
          'role', 'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-pressed',
          'data-copy', 'charset', 'viewport', 'content', 'property', 'crossorigin',
          'd', 'viewBox', 'fill', 'stroke', 'stroke-width', 'xmlns'
        ],
        ALLOW_DATA_ATTR: true,
        ALLOW_ARIA_ATTR: true,
        KEEP_CONTENT: true,
        ADD_TAGS: ['meta', 'link'],
        ADD_ATTR: ['http-equiv', 'content-type']
      })
    : null

  return { 
    landingPage: {
      ...landingPage,
      htmlContent: sanitizedHtmlContent
    }
  }
}

export default function SharedLandingPage({
  loaderData,
}: Route.ComponentProps) {
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
          <p key={copy} className="my-4 text-lg">
            {copy}
          </p>
        ))}
      </div>
    </div>
  )
}
