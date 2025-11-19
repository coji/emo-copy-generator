import { MinimalTemplate } from './minimal-template'
import { NewspaperTemplate } from './newspaper-template'

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
}

export function LandingPageView({
  templateId,
  generationLog,
  selectedCopies,
  config,
}: LandingPageViewProps) {
  // Parse config if it's a string
  const parsedConfig = typeof config === 'string' ? JSON.parse(config) : config

  // Parse selectedCopies if it's a string
  const parsedCopies =
    typeof selectedCopies === 'string'
      ? JSON.parse(selectedCopies)
      : selectedCopies

  switch (templateId) {
    case 'newspaper':
      return (
        <NewspaperTemplate
          generationLog={generationLog}
          selectedCopies={parsedCopies}
          config={parsedConfig}
        />
      )
    case 'minimal':
      return (
        <MinimalTemplate
          generationLog={generationLog}
          selectedCopies={parsedCopies}
          config={parsedConfig}
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
