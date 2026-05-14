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
    
    // If no file extension, try adding .html (for clean URLs like /structural)
    if (!path.includes('.')) {
      const htmlPath = `${path}.html`;
      const response = await this.serveAsset(htmlPath, request, env);
      if (response) return response;
    }
    
    // Try to serve the exact file
    const response = await this.serveAsset(path, request, env);
    if (response) return response;
    
    // 404 - File not found
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>404 - SizzleStick Welding</title>
        <style>
          body { font-family: system-ui; background: #0a0a0a; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; margin: 0; }
          h1 { color: #e35f21; font-size: 4rem; }
          a { color: #e35f21; text-decoration: none; }
        </style>
      </head>
      <body>
        <div>
          <h1>404</h1>
          <p>File not found: ${path}</p>
          <p><a href="/">← Back to Home</a></p>
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
  }
};
