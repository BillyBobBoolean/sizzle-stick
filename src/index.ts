export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // Debug endpoint to list all assets
    if (path === '/debug') {
      const possiblePaths = [
        '/index.html',
        '/structural.html', 
        '/artisanal.html',
        '/bio.html',
        '/style.css',
        '/pages/index.html',
        '/pages/structural.html',
        '/pages/artisanal.html',
        '/pages/bio.html',
        '/pages/style.css',
        '/public/index.html',
        '/public/structural.html',
        '/public/artisanal.html',
        '/public/bio.html',
        '/public/style.css',
        '/public/pages/index.html',
        '/public/pages/structural.html',
        '/public/pages/artisanal.html',
        '/public/pages/bio.html',
        '/public/pages/style.css'
      ];
      
      let results = '<h1>Asset Debug Information</h1><ul>';
      
      for (const testPath of possiblePaths) {
        try {
          const testUrl = new URL(testPath, request.url);
          const response = await fetch(testUrl.toString(), { method: 'HEAD' });
          results += `<li>${testPath}: ${response.ok ? '✅ FOUND' : '❌ Not found'}</li>`;
        } catch (e) {
          results += `<li>${testPath}: ❌ Error</li>`;
        }
      }
      
      results += '</ul><p>Your Worker is running at: ' + request.url + '</p>';
      results += '<p>Try these URLs directly:</p><ul>';
      results += '<li><a href="/">/</a></li>';
      results += '<li><a href="/index.html">/index.html</a></li>';
      results += '<li><a href="/structural.html">/structural.html</a></li>';
      results += '<li><a href="/pages/index.html">/pages/index.html</a></li>';
      results += '</ul>';
      
      return new Response(results, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Try common paths in order
    const pathsToTry = [
      path,
      path + '.html',
      '/index.html',
      '/structural.html',
      '/artisanal.html',
      '/bio.html',
      '/style.css',
      '/pages' + path,
      '/pages' + path + '.html',
      '/public' + path,
      '/public' + path + '.html',
      '/public/pages' + path,
      '/public/pages' + path + '.html'
    ];
    
    for (const tryPath of pathsToTry) {
      try {
        const testUrl = new URL(tryPath, request.url);
        const response = await fetch(testUrl.toString(), { method: 'HEAD' });
        if (response.ok) {
          const asset = await fetch(testUrl.toString());
          const contentType = tryPath.endsWith('.html') ? 'text/html' : 
                             tryPath.endsWith('.css') ? 'text/css' : 
                             'text/plain';
          
          return new Response(asset.body, {
            headers: { 'Content-Type': contentType }
          });
        }
      } catch (e) {
        // Continue trying
      }
    }
    
    return new Response(`404: Not Found - ${path}<br><br>Visit /debug to see what files are available`, {
      status: 404,
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
