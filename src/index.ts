interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Clean URL routing (optional - removes .html requirement)
    // /structural → serves /structural.html
    const routeMap: Record<string, string> = {
      '/': '/index.html',
      '/structural': '/structural.html',
      '/artisanal': '/artisanal.html',
      '/bio': '/bio.html',
    };
    
    // Check if this is a clean URL that needs mapping
    if (routeMap[path]) {
      path = routeMap[path];
    }
    
    // If path doesn't have an extension, try adding .html
    if (!path.includes('.') && path !== '/') {
      const tryPath = `${path}.html`;
      const response = await tryServeAsset(tryPath, request, env);
      if (response) return response;
    }
    
    // Try to serve the asset
    const response = await tryServeAsset(path, request, env);
    if (response) return response;
    
    // If still not found and path doesn't have extension, try index.html
    if (!path.includes('.') && path !== '/') {
      const indexResponse = await tryServeAsset('/index.html', request, env);
      if (indexResponse) return indexResponse;
    }
    
    // Return 404 page
    return new Response(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - SizzleStick Welding</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #e0e0e0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            text-align: center;
          }
          .container { padding: 2rem; max-width: 600px; }
          h1 { color: #e35f21; font-size: 6rem; margin-bottom: 1rem; }
          p { margin-bottom: 1.5rem; color: #b0b0b0; }
          a { color: #e35f21; text-decoration: none; font-weight: 600; }
          a:hover { text-decoration: underline; }
          hr { margin: 2rem 0; border-color: #2a2a2a; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>404</h1>
          <p>Page not found: <code>${url.pathname}</code></p>
          <p><a href="/">← Return to Homepage</a></p>
          <hr>
          <p><small>SizzleStick Welding | Industrial & Artisanal Metalwork</small></p>
        </div>
      </body>
      </html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  }
};

async function tryServeAsset(path: string, request: Request, env: Env): Promise<Response | null> {
  try {
    const url = new URL(request.url);
    const newUrl = new URL(path, url.origin);
    const newRequest = new Request(newUrl.toString(), request);
    const response = await env.ASSETS.fetch(newRequest);
    
    if (response.status === 200) {
      // Add proper content types and caching headers
      const headers = new Headers(response.headers);
      
      if (path.endsWith('.css')) {
        headers.set('Content-Type', 'text/css');
        headers.set('Cache-Control', 'public, max-age=86400'); // Cache CSS for 24 hours
      } else if (path.endsWith('.html')) {
        headers.set('Content-Type', 'text/html');
        headers.set('Cache-Control', 'public, max-age=3600'); // Cache HTML for 1 hour
      } else if (path.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        headers.set('Cache-Control', 'public, max-age=604800'); // Cache images for 1 week
      }
      
      // Add security headers
      headers.set('X-Content-Type-Options', 'nosniff');
      headers.set('X-Frame-Options', 'DENY');
      headers.set('X-XSS-Protection', '1; mode=block');
      
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
