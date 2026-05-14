interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Debug endpoint - shows what's available
    if (path === '/debug') {
      const possiblePaths = [
        '/index.html',
        '/pages/index.html',
        '/public/pages/index.html',
        '/assets/index.html',
        '/structural.html',
        '/pages/structural.html',
        '/styles.css',
        '/pages/styles.css'
      ];
      
      let results = '<h1>🔍 Asset Debug - Testing All Possible Paths</h1><ul>';
      
      for (const testPath of possiblePaths) {
        const found = await this.checkAsset(testPath, request, env);
        results += `<li>${testPath}: ${found ? '✅ Found' : '❌ Not found'}</li>`;
      }
      
      results += '</ul><p><a href="/">Back to Home</a></p>';
      return new Response(results, { headers: { 'Content-Type': 'text/html' } });
    }
    
    // Try multiple possible paths in order
    const possiblePaths = [
      path,                                    // Original path
      `/pages${path}`,                         // Add /pages prefix
      `/public/pages${path}`,                  // Add /public/pages prefix
      path === '/' ? '/pages/index.html' : null,
      path === '/' ? '/index.html' : null,
    ].filter(p => p !== null);
    
    // If no extension, try with .html
    if (!path.includes('.') && path !== '/') {
      possiblePaths.push(`${path}.html`);
      possiblePaths.push(`/pages/${path}.html`);
    }
    
    // Try each path
    for (const tryPath of possiblePaths) {
      const response = await this.serveAsset(tryPath as string, request, env);
      if (response) return response;
    }
    
    // 404 page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>404 - SizzleStick Welding</title>
        <style>
          body { font-family: system-ui; background: #0a0a0a; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; margin: 0; }
          .container { padding: 2rem; }
          h1 { color: #e35f21; font-size: 4rem; }
          a { color: #e35f21; text-decoration: none; }
          code { background: #1a1a1a; padding: 0.2rem 0.5rem; border-radius: 6px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>File not found: <code>${path}</code></p>
          <p><a href="/debug">🔍 Run Full Debug</a> | <a href="/">Home</a></p>
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
        return response;
      }
    } catch (e) {
      // Asset not found
    }
    return null;
  },

  async checkAsset(path: string, request: Request, env: Env): Promise<boolean> {
    try {
      const url = new URL(request.url);
      const assetUrl = new URL(path, url.origin);
      const assetRequest = new Request(assetUrl.toString(), { method: 'HEAD' });
      const response = await env.ASSETS.fetch(assetRequest);
      return response.status === 200;
    } catch (e) {
      return false;
    }
  }
};
