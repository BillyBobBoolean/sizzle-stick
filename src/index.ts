interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    let path = url.pathname;
    
    // Clean up the path for better routing
    if (path === '/') {
      path = '/index.html';
    }
    
    // If path doesn't have an extension, try adding .html
    if (!path.includes('.')) {
      // Try the path as-is first, then with .html
      const tryPath = path;
      const tryHtmlPath = `${path}.html`;
      
      // First try with .html
      let response = await tryServeAsset(tryHtmlPath, request, env);
      if (response) return response;
      
      // Then try without extension
      response = await tryServeAsset(tryPath, request, env);
      if (response) return response;
      
      // Finally try index.html for root-like paths
      if (path !== '/index.html') {
        response = await tryServeAsset('/index.html', request, env);
        if (response) return response;
      }
    } else {
      // Path has extension, serve directly
      const response = await tryServeAsset(path, request, env);
      if (response) return response;
    }
    
    // 404 page
    return new Response(
      `<!DOCTYPE html>
      <html>
      <head>
        <title>404 - SizzleStick Welding</title>
        <style>
          body { font-family: system-ui; background: #0a0a0a; color: #e0e0e0; display: flex; justify-content: center; align-items: center; height: 100vh; text-align: center; }
          h1 { color: #e35f21; }
          a { color: #e35f21; text-decoration: none; }
        </style>
      </head>
      <body>
        <div>
          <h1>404 - Page Not Found</h1>
          <p>The page "${path}" doesn't exist.</p>
          <p><a href="/">← Return to Home</a></p>
        </div>
      </body>
      </html>`,
      { status: 404, headers: { 'Content-Type': 'text/html' } }
    );
  }
};

async function tryServeAsset(path: string, request: Request, env: Env): Promise<Response | null> {
  try {
    // Create a new request with the modified path
    const url = new URL(request.url);
    const newUrl = new URL(path, url.origin);
    const newRequest = new Request(newUrl.toString(), request);
    
    const response = await env.ASSETS.fetch(newRequest);
    if (response.status === 200) {
      return response;
    }
  } catch (e) {
    // Asset not found
  }
  return null;
}
