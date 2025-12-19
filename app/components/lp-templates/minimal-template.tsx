import { useState } from 'react'

interface SimplifiedGenerationLog {
  productName: string
  productCategory: string
  brandImages: string
  targetUserImage: string
  story: string | null
}

interface MinimalTemplateProps {
  generationLog: SimplifiedGenerationLog
  selectedCopies: string[]
  config: {
    primaryColor?: string
    fontFamily?: string
    layout?: string
  }
}

export function MinimalTemplate({
  generationLog,
  selectedCopies,
  config: _config = {},
}: MinimalTemplateProps) {
  const [activeCopy, setActiveCopy] = useState(selectedCopies[0] || '')

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#f5f7fa] to-[#e8eaf0] p-10">
      <div className="relative flex min-h-[80vh] w-full max-w-250 flex-col overflow-hidden bg-white shadow-lg">
        {/* Accent bar */}
        <div className="absolute top-0 right-0 left-0 h-0.75 bg-linear-to-r from-[#667eea] to-[#764ba2]" />

        {/* Header section */}
        <div className="border-b border-black/6 px-15 pt-20 pb-10">
          <div className="mb-5 text-[11px] font-bold tracking-[0.3em] text-[#999] uppercase">
            {generationLog.productCategory}
          </div>
          <div className="mb-10 text-base font-light tracking-wide text-[#666]">
            {generationLog.productName}
          </div>
          <h1
            className="max-w-200 text-[clamp(36px,6vw,72px)] leading-[1.2] font-black tracking-tight text-[#1a1a1a]"
            style={{
              animation:
                'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.1s backwards',
            }}
          >
            {activeCopy}
          </h1>
        </div>

        {/* Story section */}
        <div className="flex flex-1 items-center px-15 py-15">
          <div
            className="mx-auto max-w-175 text-[17px] leading-loose tracking-wide text-[#444]"
            style={{
              animation:
                'fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s backwards',
            }}
          >
            {generationLog.story?.split('\n\n').map((paragraph, idx) => (
              <p
                key={`para-${idx}-${paragraph.substring(0, 20)}`}
                className="mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Copies section */}
        <div className="border-t border-black/6 bg-[#fafafa] px-15 py-15">
          <div className="mb-7.5 text-[11px] font-bold tracking-[0.2em] text-[#999] uppercase">
            Other Perspectives
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {selectedCopies.map((copy, index) => (
              <button
                key={copy}
                type="button"
                onClick={() => setActiveCopy(copy)}
                className={`relative overflow-hidden border px-6 py-5 text-left text-sm leading-relaxed tracking-wide transition-all duration-400 ${
                  activeCopy === copy
                    ? 'border-transparent bg-linear-to-br from-[#667eea] to-[#764ba2] text-white'
                    : 'border-black/[0.08] bg-white hover:-translate-y-0.5 hover:border-black/[0.12] hover:bg-[#fafafa] hover:shadow-lg'
                }`}
                style={{
                  animation: `fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${0.3 + index * 0.1}s backwards`,
                }}
              >
                {activeCopy !== copy && (
                  <div
                    className="absolute top-0 left-0 h-full w-[3px] origin-bottom scale-y-0 transform bg-linear-to-b from-[#667eea] to-[#764ba2] transition-transform duration-400"
                    style={{
                      transform:
                        activeCopy === copy ? 'scaleY(1)' : 'scaleY(0)',
                    }}
                  />
                )}
                {copy}
              </button>
            ))}
          </div>
        </div>

        {/* Meta info */}
        <div className="px-15 py-10 text-center text-xs font-light tracking-wide text-[#999]">
          {generationLog.targetUserImage}のための
          {generationLog.productCategory}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
