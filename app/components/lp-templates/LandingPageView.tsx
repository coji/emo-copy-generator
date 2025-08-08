import { MinimalTemplate } from './MinimalTemplate'
import { NewspaperTemplate } from './NewspaperTemplate'

interface SimplifiedGenerationLog {
  id: string | null
  productName: string
  productCategory: string
  brandImages: string
  targetUserImage: string
  story: string | null
}

interface LPMetadata {
  mainCopy?: string
  subCopy?: string
  ctaText?: string
  ctaUrl?: string
  subDescription?: string
  ogDescription?: string
  formattedStory?: string
  brandMessage?: string
}

interface LandingPageViewProps {
  templateId: string
  generationLog: SimplifiedGenerationLog
  selectedCopies: string[]
  config: Record<string, unknown>
  metadata?: LPMetadata
}

export function LandingPageView({
  templateId,
  generationLog,
  selectedCopies,
  config,
  metadata = {},
}: LandingPageViewProps) {
  // Parse config if it's a string
  const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config

  // Parse selectedCopies if it's a string
  const parsedCopies =
    typeof selectedCopies === 'string'
      ? JSON.parse(selectedCopies)
      : selectedCopies

  // Parse metadata if it's a string
  const parsedMetadata =
    typeof metadata === 'string' ? JSON.parse(metadata) : metadata

  switch (templateId) {
    case 'newspaper':
      return (
        <NewspaperTemplate
          generationLog={generationLog}
          selectedCopies={parsedCopies}
          config={parsedConfig}
          metadata={parsedMetadata}
        />
      )
    case 'minimal':
      return (
        <MinimalTemplate
          generationLog={generationLog}
          selectedCopies={parsedCopies}
          config={parsedConfig}
          metadata={parsedMetadata}
        />
      )
    default:
      return (
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
}
