export interface LPTemplate {
  id: string
  name: string
  description: string
  thumbnail_url?: string
  base_html: string
  default_config: {
    primaryColor: string
    fontFamily: string
    layout: 'default' | 'minimal' | 'story'
  }
  category: string
}

export const newspaperTemplate: LPTemplate = {
  id: 'newspaper',
  name: '新聞広告風',
  description: 'クラシックな新聞広告風のデザイン',
  category: 'classic',
  default_config: {
    primaryColor: '#0b0b0b',
    fontFamily: 'Shippori Mincho',
    layout: 'default',
  },
  base_html: `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{product_name}}｜{{main_copy}}</title>
    <meta name="description" content="{{main_copy}} {{product_name}}の新聞広告風ランディングページ。" />
    <meta property="og:title" content="{{product_name}}｜{{main_copy}}" />
    <meta property="og:description" content="{{og_description}}" />
    <meta property="og:type" content="website" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700&family=Shippori+Mincho:wght@400;600;800&display=swap" rel="stylesheet" />
    <style>
      :root {
        --ink: {{primary_color}};
        --paper: #f9f7f2;
        --accent: #2e3a8c;
        --gold: #b08d57;
      }
      * { box-sizing: border-box; }
      html, body { height: 100%; }
      body {
        margin: 0;
        background: radial-gradient(1200px 600px at 70% 20%, #141415 0, #0e0e0f 40%, #0a0a0b 100%);
        color: var(--ink);
        font-family: 'Noto Sans JP', system-ui, sans-serif;
        letter-spacing: 0.02em;
      }
      .sheet {
        width: min(1040px, 92vw);
        min-height: 92vh;
        margin: 4vh auto;
        background: var(--paper);
        box-shadow: 0 35px 80px rgba(0, 0, 0, 0.35), 0 2px 0 rgba(0, 0, 0, 0.3) inset;
        border-radius: 10px;
        position: relative;
        overflow: hidden;
      }
      .grain:before {
        content: '';
        position: absolute;
        inset: -20%;
        background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .03 .06 .08 .12 .15"/></feComponentTransfer></filter><rect width="120" height="120" filter="url(%23n)"/></svg>');
        opacity: 0.15;
        mix-blend-mode: multiply;
        animation: grain 7s steps(6) infinite;
      }
      @keyframes grain {
        0% { transform: translate(0, 0); }
        25% { transform: translate(-6%, 3%); }
        50% { transform: translate(4%, -8%); }
        75% { transform: translate(-2%, 5%); }
        100% { transform: translate(0, 0); }
      }
      header {
        padding: 28px 36px 0 36px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .brand {
        font-family: '{{font_family}}', serif;
        font-weight: 800;
        font-size: 28px;
        letter-spacing: 0.12em;
      }
      .seal {
        color: var(--gold);
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.35em;
        margin-top: 6px;
      }
      .grid {
        display: grid;
        grid-template-columns: 1.1fr 0.9fr;
        gap: 32px;
        padding: 10px 36px 36px 36px;
      }
      .hero {
        position: relative;
        min-height: 62vh;
        border-right: 1px solid rgba(0, 0, 0, 0.08);
        padding-right: 24px;
      }
      .copy {
        font-family: '{{font_family}}', serif;
        font-size: clamp(28px, 5vw, 68px);
        line-height: 1.3;
        font-weight: 700;
        letter-spacing: 0.06em;
        margin: 4vh 0 2vh;
        text-wrap: balance;
      }
      .sub {
        margin-top: 14px;
        font-size: 14px;
        opacity: 0.75;
      }
      .cta {
        display: inline-block;
        margin-top: 28px;
        padding: 14px 20px;
        border: 1px solid var(--ink);
        text-decoration: none;
        color: var(--ink);
        transition: 0.2s ease;
        font-weight: 700;
        letter-spacing: 0.1em;
        background: linear-gradient(#fff0, #00000008);
      }
      .cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
      }
      .story-wrap { position: relative; }
      .story-label {
        position: absolute;
        top: -10px;
        right: 0;
        font-size: 12px;
        letter-spacing: 0.3em;
        opacity: 0.6;
      }
      .story {
        writing-mode: vertical-rl;
        text-orientation: upright;
        font-family: '{{font_family}}', serif;
        font-size: 16.5px;
        line-height: 2.2;
        padding: 8px 0 8px 12px;
        border-left: 1px solid rgba(0, 0, 0, 0.08);
        max-height: 72vh;
        overflow: auto;
        overscroll-behavior: contain;
        background: repeating-linear-gradient(transparent 0 36px, rgba(0, 0, 0, 0.035) 36px 37px);
      }
      .selector {
        border-top: 1px dashed rgba(0, 0, 0, 0.2);
        padding: 18px 36px 28px;
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        align-items: center;
      }
      .tag {
        border: 1px solid rgba(0, 0, 0, 0.35);
        padding: 8px 12px;
        font-size: 13px;
        cursor: pointer;
        background: #fff;
        transition: 0.2s;
      }
      .tag[aria-pressed='true'] {
        background: var(--ink);
        color: #fff;
      }
      footer {
        padding: 18px 36px 28px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: rgba(0, 0, 0, 0.6);
        font-size: 12px;
      }
      .badge {
        font-family: '{{font_family}}', serif;
        letter-spacing: 0.25em;
        border-left: 3px solid var(--accent);
        padding-left: 10px;
      }
      @media (max-width: 860px) {
        .grid { grid-template-columns: 1fr; }
        .hero { border-right: none; padding-right: 0; }
        .story { max-height: 52vh; }
      }
    </style>
  </head>
  <body>
    <div class="sheet grain" role="document" aria-label="新聞広告風LP">
      <header>
        <div>
          <div class="brand">{{product_name}}</div>
          <div class="seal">{{product_category}}</div>
        </div>
        <div class="badge">{{sub_copy}}</div>
      </header>
      <main class="grid">
        <section class="hero" aria-labelledby="hero-copy">
          <h1 id="hero-copy" class="copy">{{main_copy}}</h1>
          <p class="sub">{{sub_description}}</p>
          <a class="cta" href="{{cta_url}}" target="_blank" rel="noopener noreferrer">{{cta_text}}</a>
        </section>
        <section class="story-wrap" aria-labelledby="story-title">
          <div id="story-title" class="story-label">ユーザーストーリー</div>
          <article class="story">{{story}}</article>
        </section>
      </main>
      <div class="selector" aria-label="コピーの切り替え">
        <span style="opacity: 0.6; font-size: 12px; letter-spacing: 0.2em">COPY</span>
        {{copy_buttons}}
      </div>
      <footer>
        <div>© {{product_name}}</div>
        <div>広告表現：<span style="font-family: '{{font_family}}', serif">エモーション・コピー</span></div>
      </footer>
    </div>
    <script>
      const buttons = document.querySelectorAll('.tag')
      const copyEl = document.getElementById('hero-copy')
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => b.setAttribute('aria-pressed', 'false'))
          btn.setAttribute('aria-pressed', 'true')
          copyEl.textContent = btn.dataset.copy
        })
      })
    </script>
  </body>
</html>`,
}

export const minimalTemplate: LPTemplate = {
  id: 'minimal',
  name: 'ミニマルモダン',
  description: 'シンプルで洗練されたデザイン',
  category: 'modern',
  default_config: {
    primaryColor: '#000000',
    fontFamily: 'Noto Sans JP',
    layout: 'minimal',
  },
  base_html: `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{product_name}} - {{main_copy}}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;400;900&display=swap" rel="stylesheet" />
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: 'Noto Sans JP', sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }
      .container {
        background: white;
        border-radius: 20px;
        padding: 60px;
        max-width: 800px;
        width: 100%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      h1 {
        font-size: clamp(2rem, 5vw, 4rem);
        font-weight: 900;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .story {
        margin: 40px 0;
        line-height: 1.8;
        color: #333;
      }
      .copies {
        margin-top: 40px;
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .copy-tag {
        padding: 10px 20px;
        border: 2px solid #667eea;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.3s;
      }
      .copy-tag:hover {
        background: #667eea;
        color: white;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>{{main_copy}}</h1>
      <div class="story">{{story}}</div>
      <div class="copies">{{copy_buttons}}</div>
    </div>
  </body>
</html>`,
}

export const templates: LPTemplate[] = [newspaperTemplate, minimalTemplate]
