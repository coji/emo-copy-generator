import { useState } from 'react'

interface SimplifiedGenerationLog {
  productName: string
  productCategory: string
  brandImages: string
  targetUserImage: string
  story: string | null
}

interface NewspaperTemplateProps {
  generationLog: SimplifiedGenerationLog
  selectedCopies: string[]
  config: {
    primaryColor?: string
    accentColor?: string
    fontFamily?: string
    layout?: string
  }
}

export function NewspaperTemplate({
  generationLog,
  selectedCopies,
  config = {},
}: NewspaperTemplateProps) {
  const [activeCopy, _setActiveCopy] = useState(
    selectedCopies[0] || generationLog.productName,
  )

  let brandImages: string[] = []
  try {
    brandImages = JSON.parse(generationLog.brandImages || '[]') as string[]
  } catch {
    console.warn('Failed to parse brandImages, using empty array')
  }
  const primaryColor = config.primaryColor || '#1a1a1a'
  const accentColor = config.accentColor || config.primaryColor || '#8b7355'

  return (
    <div className="min-h-screen bg-linear-to-b from-[#2a2a2a] to-[#1a1a1a] px-4 py-[5vh]">
      <div className="relative mx-auto max-w-225 bg-[#fdfbf7] shadow-2xl">
        {/* Paper texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.01) 2px, rgba(0,0,0,0.01) 4px)',
          }}
        />

        {/* Vertical title */}
        <div
          className="absolute top-20 right-5 text-sm font-light tracking-[0.3em] text-[#a39382] opacity-60"
          style={{ writingMode: 'vertical-rl' }}
        >
          {generationLog.productCategory}
        </div>

        {/* Content */}
        <div className="relative px-15 py-20">
          {/* Main copy */}
          <h1
            className="relative mb-10 pl-5 text-[clamp(32px,5vw,56px)] leading-[1.4] font-black tracking-tight"
            style={{
              fontFamily: "'Noto Serif JP', serif",
              color: primaryColor,
            }}
          >
            <div
              className="absolute top-0 bottom-0 left-0 w-1"
              style={{ background: accentColor }}
            />
            {activeCopy}
          </h1>

          {/* Story section */}
          <div className="my-15 border-t border-b border-black/10 py-10">
            <div
              className="columns-1 gap-10 text-justify text-base leading-[2.2] tracking-[0.08em] md:columns-2"
              style={{
                fontFamily: "'Noto Serif JP', serif",
                color: primaryColor,
              }}
            >
              {generationLog.story?.split('\n\n').map((paragraph, idx) => (
                <p
                  key={`para-${idx}-${paragraph.substring(0, 20)}`}
                  className="mb-6 first:indent-0"
                  style={{ textIndent: idx === 0 ? 0 : '1em' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Product introduction */}
          <div className="-mx-15 my-15 border-y border-black/5 bg-linear-to-r from-[#fafafa] to-[#f5f5f5] px-15 py-12">
            <div className="mx-auto max-w-175">
              <div className="mb-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#8b7355]/30" />
                <div className="text-[10px] font-bold tracking-[0.3em] text-[#8b7355] uppercase">
                  About
                </div>
                <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#8b7355]/30" />
              </div>

              <div className="text-center">
                <h2
                  className="mb-4 text-3xl font-bold tracking-wide"
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    color: primaryColor,
                  }}
                >
                  {generationLog.productName}
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-[#666]">
                  {generationLog.productCategory} /{' '}
                  {generationLog.targetUserImage}のために
                </p>
                {brandImages.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {brandImages.map((image, idx) => (
                      <span
                        key={`brand-${idx}-${image}`}
                        className="rounded-full border border-[#8b7355]/20 bg-white px-4 py-1.5 text-xs text-[#8b7355] shadow-sm"
                      >
                        {image}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
