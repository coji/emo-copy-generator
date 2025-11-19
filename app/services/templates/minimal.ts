export const minimalHtml = `<!doctype html>
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
</html>`
