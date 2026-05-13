// src/index.ts
interface Env {
  // Add any environment variables here if needed
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Serve static assets from the public folder
    if (path === '/' || path === '/index.html') {
      return serveAsset('index.html');
    }
    
    if (path === '/structural.html' || path === '/structural') {
      return serveAsset('structural.html');
    }
    
    if (path === '/artisanal.html' || path === '/artisanal') {
      return serveAsset('artisanal.html');
    }
    
    if (path === '/bio.html' || path === '/bio') {
      return serveAsset('bio.html');
    }
    
    if (path === '/style.css') {
      return serveAsset('style.css', 'text/css');
    }
    
    // 404 handler
    return new Response('Page not found', { status: 404 });
  }
};

// Helper function to serve assets from the public folder
async function serveAsset(filename: string, contentType?: string): Promise<Response> {
  // In production, assets are bundled with the Worker
  // For local development, you'd read from the filesystem
  const asset = await fetch(`https://raw.githubusercontent.com/YOUR_USERNAME/sizzle-stick/main/public/${filename}`);
  
  const headers = new Headers();
  if (contentType) {
    headers.set('Content-Type', contentType);
  } else if (filename.endsWith('.html')) {
    headers.set('Content-Type', 'text/html');
  } else if (filename.endsWith('.css')) {
    headers.set('Content-Type', 'text/css');
  }
  
  return new Response(asset.body, { headers });
}
