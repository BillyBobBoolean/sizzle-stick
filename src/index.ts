interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Handle root path
    if (path === '/') {
      path = '/index.html';
    }
    
    // If no file extension, try adding .html (for /structural, /artisanal, /bio)
    if (!path.includes('.')) {
      // Try the path with .html
      const tryPath = `${path}.html`;
      const response = await this.serveAsset(tryPath, request, env);
      if (response) return response;
    }
    
    // Try to serve the exact file path
    const response = await this.serveAsset(path, request, env);
    if (response) return response;
    
    // 404 - File not found
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
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
          p { margin-bottom: 1rem; }
          a { color: #e35f21; text-decoration: none; }
          a:hover { text-decoration: underline; }
          code { background: #1a1a1a; padding: 0.2rem 0.5rem; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>The page <code>${path}</code> was not found.</p>
          <p><a href="/">← Return to Homepage</a></p>
          <hr style="margin: 2rem 0; border-color: #2a2a2a;">
          <p><small>SizzleStick Welding | Cloudflare Worker</small></p>
        </div>
      </body>
      </html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  },

  async serveAsset(path: string, request: Request, env: Env): Promise<Response | null> {
    try {
      const url = new URL(request.url);
      const assetUrl = new URL(path, url.origin);
      const assetRequest = new Request(assetUrl.toString(), request);
      const response = await env.ASSETS.fetch(assetRequest);
      
      if (response.status === 200) {
        // Add caching headers for better performance
        const headers = new Headers(response.headers);
        if (path.endsWith('.css')) {
          headers.set('Content-Type', 'text/css');
          headers.set('Cache-Control', 'public, max-age=86400');
        } else if (path.endsWith('.html')) {
          headers.set('Content-Type', 'text/html');
          headers.set('Cache-Control', 'public, max-age=3600');
        }
        
        return new Response(response.body, {
          status: 200,
          headers: headers
        });
      }
    } catch (e) {
      // Asset not found - return null
    }
    return null;
  }
};
