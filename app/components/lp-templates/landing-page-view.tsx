import { MinimalTemplate } from './minimal-template'
import { NewspaperTemplate } from './newspaper-template'
import { RelatedLPsSection } from './related-lps-section'

interface SimplifiedGenerationLog {
  id: string | null
  productName: string
  productCategory: string
  brandImages: string
  targetUserImage: string
  story: string | null
}

interface LandingPageViewProps {
  templateId: string
  generationLog: SimplifiedGenerationLog
  selectedCopies: string[]
  config: Record<string, unknown>
  relatedLPs?: Array<{
    id: string | null
    shareUrl: string | null
    selectedCopies: string
    productName: string | null
    productCategory: string | null
  }>
}

export function LandingPageView({
  templateId,
  generationLog,
  selectedCopies,
  config,
  relatedLPs = [],
}: LandingPageViewProps) {
  // Parse config if it's a string
  const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config

  // Parse selectedCopies if it's a string
  const parsedCopies =
    typeof selectedCopies === 'string'
      ? JSON.parse(selectedCopies)
      : selectedCopies

  let templateContent: React.JSX.Element
  switch (templateId) {
    case 'newspaper':
      templateContent = (
        <NewspaperTemplate
          generationLog={generationLog}
          selectedCopies={parsedCopies}
          config={parsedConfig}
        />
      )
      break
    case 'minimal':
      templateContent = (
        <MinimalTemplate
          generationLog={generationLog}
          selectedCopies={parsedCopies}
          config={parsedConfig}
        />
      )
      break
    default:
      templateContent = (
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold">
              テンプレートが見つかりません
            </h1>
            <p className="text-gray-600">テンプレートID: {templateId}</p>
          </div>
        </div>
      )
  }

  return (
    <>
      {templateContent}
      {relatedLPs.length > 0 && (
        <RelatedLPsSection
          relatedLPs={relatedLPs}
          currentGenerationLog={generationLog}
        />
      )}
    </>
  )
}
