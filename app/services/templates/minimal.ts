export const minimalHtml = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{product_name}} - {{main_copy}}</title>
    <meta name="description" content="{{og_description}}" />
    <meta property="og:title" content="{{product_name}} - {{main_copy}}" />
    <meta property="og:description" content="{{og_description}}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100;300;400;700;900&display=swap" rel="stylesheet" />
    <style>
      * { 
        margin: 0; 
        padding: 0; 
        box-sizing: border-box; 
      }
      
      html, body {
        height: 100%;
        overflow-x: hidden;
      }
      
      body {
        font-family: 'Noto Sans JP', sans-serif;
        background: linear-gradient(135deg, #f5f7fa 0%, #e8eaf0 100%);
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
      }
      
      .container {
        background: white;
        max-width: 1000px;
        width: 100%;
        min-height: 80vh;
        display: flex;
        flex-direction: column;
        box-shadow: 
          0 0 0 1px rgba(0,0,0,0.03),
          0 20px 60px rgba(0,0,0,0.08);
        position: relative;
        overflow: hidden;
      }
      
      /* Accent bar */
      .accent-bar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
      }
      
      /* Header section */
      .header {
        padding: 80px 60px 40px;
        border-bottom: 1px solid rgba(0,0,0,0.06);
      }
      
      .product-category {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #999;
        margin-bottom: 20px;
      }
      
      .product-name {
        font-size: 16px;
        font-weight: 300;
        letter-spacing: 0.1em;
        color: #666;
        margin-bottom: 40px;
      }
      
      /* Main copy - ultra dramatic */
      .main-copy {
        font-size: clamp(36px, 6vw, 72px);
        font-weight: 900;
        line-height: 1.2;
        letter-spacing: -0.02em;
        color: #1a1a1a;
        margin-bottom: 0;
        max-width: 800px;
      }
      
      /* Story section */
      .story-section {
        padding: 60px;
        flex: 1;
        display: flex;
        align-items: center;
      }
      
      .story {
        font-size: 17px;
        line-height: 2;
        letter-spacing: 0.05em;
        color: #444;
        max-width: 700px;
        margin: 0 auto;
      }
      
      .story p {
        margin-bottom: 1.5em;
      }
      
      /* Copies section */
      .copies-section {
        padding: 60px;
        background: #fafafa;
        border-top: 1px solid rgba(0,0,0,0.06);
      }
      
      .copies-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #999;
        margin-bottom: 30px;
      }
      
      .copies {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 16px;
      }
      
      .tag {
        font-family: 'Noto Sans JP', sans-serif;
        font-size: 14px;
        font-weight: 400;
        padding: 20px 24px;
        background: white;
        border: 1px solid rgba(0,0,0,0.08);
        color: #333;
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        letter-spacing: 0.03em;
        line-height: 1.6;
        text-align: left;
        position: relative;
        overflow: hidden;
      }
      
      .tag::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        transform: scaleY(0);
        transform-origin: bottom;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .tag:hover {
        background: #fafafa;
        border-color: rgba(0,0,0,0.12);
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.08);
      }
      
      .tag:hover::before {
        transform: scaleY(1);
      }
      
      .tag[aria-pressed="true"] {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-color: transparent;
      }
      
      .tag[aria-pressed="true"]::before {
        display: none;
      }
      
      /* Meta info */
      .meta {
        padding: 40px 60px;
        text-align: center;
        font-size: 12px;
        font-weight: 300;
        letter-spacing: 0.1em;
        color: #999;
      }
      
      /* Responsive */
      @media (max-width: 768px) {
        .header,
        .story-section,
        .copies-section,
        .meta {
          padding: 40px 30px;
        }
        
        .main-copy {
          font-size: 32px;
        }
        
        .story {
          font-size: 15px;
        }
        
        .copies {
          grid-template-columns: 1fr;
        }
      }
      
      /* Subtle animation */
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
      
      .main-copy,
      .story,
      .tag {
        animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) backwards;
      }
      
      .main-copy {
        animation-delay: 0.1s;
      }
      
      .story {
        animation-delay: 0.2s;
      }
      
      .tag:nth-child(1) { animation-delay: 0.3s; }
      .tag:nth-child(2) { animation-delay: 0.4s; }
      .tag:nth-child(3) { animation-delay: 0.5s; }
      .tag:nth-child(4) { animation-delay: 0.6s; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="accent-bar"></div>
      
      <div class="header">
        <div class="product-category">{{product_category}}</div>
        <div class="product-name">{{product_name}}</div>
        <h1 class="main-copy">{{main_copy}}</h1>
      </div>
      
      <div class="story-section">
        <div class="story">{{story}}</div>
      </div>
      
      <div class="copies-section">
        <div class="copies-label">Other Perspectives</div>
        <div class="copies">
          {{copy_buttons}}
        </div>
      </div>
      
      <div class="meta">{{sub_description}}</div>
    </div>
  </body>
</html>`
