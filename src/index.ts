export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Map routes to files in public/pages/
    const fileMap: Record<string, string> = {
      '/': '/pages/index.html',
      '/index.html': '/pages/index.html',
      '/structural.html': '/pages/structural.html',
      '/artisanal.html': '/pages/artisanal.html',
      '/bio.html': '/pages/bio.html',
      '/style.css': '/pages/style.css',
      '/structural': '/pages/structural.html',
      '/artisanal': '/pages/artisanal.html',
      '/bio': '/pages/bio.html',
    };
    
    const assetPath = fileMap[path];
    
    if (!assetPath) {
      return new Response(`404: Not Found - ${path}`, { status: 404 });
    }
    
    try {
      // For Workers with assets binding
      const asset = await fetch(`https://sizzle-stick.daviscallumvt.workers.dev${assetPath}`);
      
      if (!asset.ok) {
        return new Response(`404: Asset not found - ${assetPath}`, { status: 404 });
      }
      
      const contentType = assetPath.endsWith('.html') ? 'text/html' : 
                         assetPath.endsWith('.css') ? 'text/css' : 
                         'text/plain';
      
      return new Response(asset.body, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } catch (error) {
      return new Response(`500: Internal Error - ${error}`, { status: 500 });
    }
  }
};
