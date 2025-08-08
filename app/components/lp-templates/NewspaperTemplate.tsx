import { useState } from 'react'

interface SimplifiedGenerationLog {
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

interface NewspaperTemplateProps {
  generationLog: SimplifiedGenerationLog
  selectedCopies: string[]
  config: {
    primaryColor?: string
    fontFamily?: string
    layout?: string
  }
  metadata?: LPMetadata
}

export function NewspaperTemplate({
  generationLog,
  selectedCopies,
  config = {},
  metadata = {},
}: NewspaperTemplateProps) {
  const [activeCopy, setActiveCopy] = useState(
    metadata.mainCopy || selectedCopies[0] || '',
  )

  const brandImages = JSON.parse(generationLog.brandImages || '[]') as string[]
  const primaryColor = config.primaryColor || '#0b0b0b'
  const fontFamily = config.fontFamily || 'Shippori Mincho'

  // メタデータから値を取得（フォールバック付き）
  const subCopy =
    metadata.subCopy ||
    metadata.brandMessage ||
    brandImages[0] ||
    'ブランドメッセージ'
  const ctaText = metadata.ctaText || '詳しく見る'
  const subDescription =
    metadata.subDescription ||
    `${generationLog.targetUserImage}のための${generationLog.productCategory}`
  const displayStory = metadata.formattedStory || generationLog.story

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#141415] via-[#0e0e0f] to-[#0a0a0b] p-[4vh]">
      <div
        className="relative min-h-[92vh] w-full max-w-[1040px] overflow-hidden rounded-lg bg-[#f9f7f2] shadow-2xl"
        style={{
          boxShadow:
            '0 35px 80px rgba(0, 0, 0, 0.35), 0 2px 0 rgba(0, 0, 0, 0.3) inset',
        }}
      >
        {/* Paper grain effect */}
        <div className="pointer-events-none absolute inset-0 opacity-15 mix-blend-multiply">
          <div className="animate-grain bg-noise absolute inset-[-20%]" />
        </div>

        {/* Header */}
        <header className="flex items-start justify-between px-9 pt-7">
          <div>
            <div
              className="text-[28px] font-extrabold tracking-[0.12em]"
              style={{
                fontFamily: `'${fontFamily}', serif`,
                color: primaryColor,
              }}
            >
              {generationLog.productName}
            </div>
            <div className="mt-1.5 text-xs font-bold tracking-[0.35em] text-[#b08d57]">
              {generationLog.productCategory}
            </div>
          </div>
          <div
            className="border-l-[3px] border-[#2e3a8c] pl-2.5 text-xs tracking-[0.25em]"
            style={{ fontFamily: `'${fontFamily}', serif` }}
          >
            {subCopy}
          </div>
        </header>

        {/* Main grid */}
        <main className="grid grid-cols-1 gap-8 px-9 py-2.5 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Hero section */}
          <section className="min-h-[62vh] border-black/5 pr-0 lg:border-r lg:pr-6">
            <h1
              className="my-[4vh] text-[clamp(28px,5vw,68px)] leading-tight font-bold tracking-[0.06em] text-balance"
              style={{
                fontFamily: `'${fontFamily}', serif`,
                color: primaryColor,
              }}
            >
              {activeCopy}
            </h1>
            <p
              className="mt-3.5 text-sm opacity-75"
              style={{ color: primaryColor }}
            >
              {subDescription}
            </p>
            <button
              type="button"
              className="mt-7 inline-block cursor-pointer border border-current px-5 py-3.5 font-bold tracking-[0.1em] no-underline transition-all hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                color: primaryColor,
                borderColor: primaryColor,
                background: 'linear-gradient(#fff0, #00000008)',
              }}
            >
              {ctaText}
            </button>
          </section>

          {/* Story section */}
          <section className="relative">
            <div className="absolute -top-2.5 right-0 text-xs tracking-[0.3em] opacity-60">
              ユーザーストーリー
            </div>
            <article
              className="writing-mode-vertical-rl text-orientation-upright max-h-[72vh] overflow-auto border-l border-black/5 p-2 pl-3"
              style={{
                fontFamily: `'${fontFamily}', serif`,
                fontSize: '16.5px',
                lineHeight: '2.2',
                background:
                  'repeating-linear-gradient(transparent 0 36px, rgba(0, 0, 0, 0.035) 36px 37px)',
              }}
            >
              {displayStory?.split('\n').map((line, index) => (
                <span key={`line-${line.substring(0, 10)}-${index}`}>
                  {line}
                  {index < (displayStory?.split('\n').length || 0) - 1 && (
                    <br />
                  )}
                </span>
              ))}
            </article>
          </section>
        </main>

        {/* Copy selector */}
        <div className="flex flex-wrap items-center gap-3.5 border-t border-dashed border-black/20 px-9 py-4.5">
          <span className="text-xs tracking-[0.2em] opacity-60">COPY</span>
          {selectedCopies.map((copy) => (
            <button
              type="button"
              key={copy}
              onClick={() => setActiveCopy(copy)}
              className={`cursor-pointer border border-black/35 px-3 py-2 text-[13px] transition-all ${
                activeCopy === copy
                  ? 'bg-black text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
              style={
                activeCopy === copy ? { backgroundColor: primaryColor } : {}
              }
            >
              {copy}
            </button>
          ))}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between px-9 py-4.5 text-xs text-black/60">
          <div>© {generationLog.productName}</div>
          <div>
            広告表現：
            <span style={{ fontFamily: `'${fontFamily}', serif` }}>
              エモーション・コピー
            </span>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes grain {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-6%, 3%); }
          50% { transform: translate(4%, -8%); }
          75% { transform: translate(-2%, 5%); }
          100% { transform: translate(0, 0); }
        }
        .animate-grain {
          animation: grain 7s steps(6) infinite;
        }
        .bg-noise {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .03 .06 .08 .12 .15"/></feComponentTransfer></filter><rect width="120" height="120" filter="url(%23n)"/></svg>');
        }
        .writing-mode-vertical-rl {
          writing-mode: vertical-rl;
        }
        .text-orientation-upright {
          text-orientation: upright;
        }
      `}</style>
    </div>
  )
}
