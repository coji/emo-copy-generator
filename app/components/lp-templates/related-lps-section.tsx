import { Link } from 'react-router'

interface RelatedLP {
  id: string | null
  shareUrl: string | null
  selectedCopies: string
  productName: string | null
  productCategory: string | null
}

interface RelatedLPsSectionProps {
  relatedLPs: RelatedLP[]
  currentGenerationLog: {
    productName: string
    productCategory: string
    targetUserImage: string
    brandImages: string
  }
}

export function RelatedLPsSection({
  relatedLPs,
  currentGenerationLog,
}: RelatedLPsSectionProps) {
  if (relatedLPs.length === 0) {
    return null
  }

  const brandImages = JSON.parse(currentGenerationLog.brandImages || '[]')
  const createSimilarUrl = `/?${new URLSearchParams({
    productName: currentGenerationLog.productName,
    productCategory: currentGenerationLog.productCategory,
    targetUserImage: currentGenerationLog.targetUserImage,
    ...(brandImages.length > 0 && { brandImages: brandImages.join(',') }),
  }).toString()}`

  return (
    <div className="border-t border-black/5 bg-gradient-to-b from-white to-gray-50/50 px-6 py-16 md:px-12">
      <div className="mx-auto max-w-6xl">
        {/* Create Similar CTA */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            このテーマでコピーを作る
          </h2>
          <p className="mb-6 text-sm text-gray-600">
            同じ設定で、あなただけのストーリーを生成できます
          </p>
          <Link
            to={createSimilarUrl}
            className="inline-block rounded-lg bg-gradient-to-r from-[#667eea] to-[#764ba2] px-8 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            コピーを作成する
          </Link>
        </div>

        {/* Related LPs */}
        <div className="mt-16">
          <h3 className="mb-6 text-center text-sm font-bold tracking-wider text-gray-500 uppercase">
            Similar Stories
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {relatedLPs.map((lp) => {
              const mainCopy = JSON.parse(lp.selectedCopies)[0] || ''
              return (
                <Link
                  key={lp.id}
                  to={`/lp/share/${lp.shareUrl}`}
                  className="group block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-2 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                    {lp.productCategory}
                  </div>
                  <h4 className="mb-3 line-clamp-1 font-bold text-gray-900">
                    {lp.productName}
                  </h4>
                  <p className="line-clamp-3 text-sm leading-relaxed text-gray-600">
                    {mainCopy}
                  </p>
                  <div className="mt-4 text-xs font-semibold text-[#667eea] group-hover:underline">
                    詳しく見る →
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
