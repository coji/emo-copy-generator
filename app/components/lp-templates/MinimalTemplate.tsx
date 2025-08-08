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
  config = {},
}: MinimalTemplateProps) {
  const [activeCopy, setActiveCopy] = useState(selectedCopies[0] || '')
  const fontFamily = config.fontFamily || 'Noto Sans JP'

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
      <div className="w-full max-w-[800px] rounded-[20px] bg-white p-[60px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <h1
          className="mb-5 bg-gradient-to-br from-[#667eea] to-[#764ba2] bg-clip-text text-[clamp(2rem,5vw,4rem)] font-black text-transparent"
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
        >
          {activeCopy}
        </h1>

        <div
          className="my-10 leading-[1.8] text-gray-800"
          style={{ fontFamily: `'${fontFamily}', sans-serif` }}
        >
          {generationLog.story}
        </div>

        <div className="mt-10 flex flex-wrap gap-2.5">
          {selectedCopies.map((copy) => (
            <button
              type="button"
              key={copy}
              onClick={() => setActiveCopy(copy)}
              className={`cursor-pointer rounded-[25px] border-2 border-[#667eea] px-5 py-2.5 transition-all ${
                activeCopy === copy
                  ? 'bg-[#667eea] text-white'
                  : 'bg-white hover:bg-[#667eea] hover:text-white'
              }`}
            >
              {copy}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
