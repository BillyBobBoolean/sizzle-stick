interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Try to serve from your public folder assets
    try {
      // First, try serving the exact path
      let assetResponse = await env.ASSETS.fetch(request);
      
      // If file found, return it
      if (assetResponse.status === 200) {
        return assetResponse;
      }
      
      // If path doesn't have .html extension, try adding it
      if (!path.includes('.')) {
        // Handle root path
        let htmlPath = path === '/' ? '/index.html' : `${path}.html`;
        let htmlRequest = new Request(`${url.origin}${htmlPath}`, request);
        assetResponse = await env.ASSETS.fetch(htmlRequest);
        
        if (assetResponse.status === 200) {
          return assetResponse;
        }
      }
    } catch (e) {
      // Asset not found - continue to 404
    }
    
    // Serve a clean 404 page
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - SizzleStick Welding</title>
        <style>
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #0a0a0a;
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            text-align: center;
          }
          .container { padding: 2rem; }
          h1 { color: #e35f21; font-size: 4rem; margin-bottom: 1rem; }
          a { color: #e35f21; text-decoration: none; }
          a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>Page not found: ${path}</p>
          <p><a href="/">← Return to Homepage</a></p>
          <hr>
          <p><small>SizzleStick Welding | Cloudflare Worker</small></p>
        </div>
      </body>
      </html>`,
      { 
        status: 404, 
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
};
