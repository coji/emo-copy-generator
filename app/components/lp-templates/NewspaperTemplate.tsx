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
    fontFamily?: string
    layout?: string
  }
}

export function NewspaperTemplate({
  generationLog,
  selectedCopies,
  config = {},
}: NewspaperTemplateProps) {
  const [activeCopy, setActiveCopy] = useState(selectedCopies[0] || '')

  const brandImages = JSON.parse(generationLog.brandImages || '[]') as string[]
  const primaryColor = config.primaryColor || '#1a1a1a'
  const accentColor = config.primaryColor || '#8b7355'

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] px-4 py-[5vh]">
      <div className="relative mx-auto max-w-[900px] bg-[#fdfbf7] shadow-2xl">
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
        <div className="relative px-[60px] py-20">
          {/* Product name */}
          <div className="mb-[60px] text-[13px] font-bold tracking-[0.2em] text-[#8b7355] uppercase opacity-80">
            {generationLog.productName}
          </div>

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
          <div className="my-[60px] border-t border-b border-black/10 py-10">
            <div
              className="columns-1 gap-10 text-justify text-base leading-[2.2] tracking-[0.08em] md:columns-2"
              style={{
                fontFamily: "'Noto Serif JP', serif",
                color: primaryColor,
              }}
            >
              {generationLog.story?.split('\n\n').map((paragraph, index) => (
                <p
                  key={index}
                  className="mb-6 first:indent-0"
                  style={{ textIndent: index === 0 ? 0 : '1em' }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Copy buttons */}
          <div className="mt-[60px]">
            <div className="mb-5 text-[11px] font-bold tracking-[0.2em] text-[#a39382] uppercase">
              Other Copies
            </div>
            <div className="flex flex-col gap-4">
              {selectedCopies.map((copy) => (
                <button
                  key={copy}
                  type="button"
                  onClick={() => setActiveCopy(copy)}
                  className={`border px-6 py-4 text-left text-[15px] leading-relaxed tracking-wide transition-all duration-300 ${
                    activeCopy === copy
                      ? 'border-[#8b7355] bg-[#8b7355] text-[#fdfbf7]'
                      : 'border-black/15 bg-transparent hover:translate-x-2 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-[#fdfbf7]'
                  }`}
                  style={{
                    fontFamily: "'Noto Serif JP', serif",
                    color: activeCopy === copy ? '#fdfbf7' : primaryColor,
                  }}
                >
                  {copy}
                </button>
              ))}
            </div>
          </div>

          {/* Meta info */}
          <div className="mt-[60px] border-t border-black/10 pt-10 text-xs tracking-wide text-[#a39382]">
            {generationLog.targetUserImage}のための
            {generationLog.productCategory}
          </div>
        </div>
      </div>
    </div>
  )
}
