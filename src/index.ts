export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    
    // If this shows up, the Worker is working correctly
    if (path === '/test') {
      return new Response(`
        <html>
          <body>
            <h1>✅ Worker is working!</h1>
            <p>If you see this, the Worker is running correctly.</p>
            <p>The issue is that your HTML files are not being bundled.</p>
            <hr>
            <h2>Next steps:</h2>
            <ol>
              <li>Check that HTML files exist in your repository</li>
              <li>Verify wrangler.toml has correct assets directory</li>
              <li>Redeploy with proper configuration</li>
            </ol>
          </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    // Serve a full homepage from the Worker itself (temporary)
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SizzleStick Welding</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #0a0a0a;
            color: #e0e0e0;
            line-height: 1.5;
          }
          .container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; }
          header {
            background: #050505;
            border-bottom: 3px solid #e35f21;
            position: sticky;
            top: 0;
            z-index: 100;
          }
          .navbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            padding: 1.2rem 0;
          }
          .logo { font-size: 1.7rem; font-weight: 700; }
          .logo span { color: #e35f21; }
          .nav-links {
            display: flex;
            gap: 2rem;
            list-style: none;
            flex-wrap: wrap;
          }
          .nav-links a {
            text-decoration: none;
            font-weight: 500;
            color: #ccc;
            transition: 0.2s;
          }
          .nav-links a:hover { color: #e35f21; }
          .hero {
            padding: 4rem 0;
            background: linear-gradient(135deg, #0f0f0f 0%, #141414 100%);
          }
          .hero .container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
          }
          .hero-content h1 {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
          }
          .accent { color: #e35f21; }
          .hero-content p {
            font-size: 1.2rem;
            color: #b0b0b0;
            margin: 1.5rem 0;
          }
          .btn-primary {
            background-color: #e35f21;
            color: #0a0a0a;
            padding: 0.8rem 1.8rem;
            border-radius: 40px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
          }
          .btn-outline {
            border: 2px solid #e35f21;
            color: #e35f21;
            padding: 0.75rem 1.7rem;
            border-radius: 40px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            background: transparent;
          }
          .cap-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 2rem;
            margin: 3rem 0;
          }
          .cap-card {
            background: #111;
            border-radius: 24px;
            padding: 2rem;
            flex: 1;
            min-width: 240px;
            text-align: center;
            border: 1px solid #2a2a2a;
          }
          .cap-card i {
            font-size: 2.5rem;
            color: #e35f21;
            margin-bottom: 1rem;
          }
          footer {
            background-color: #030303;
            margin-top: 4rem;
            padding: 2rem 0;
            text-align: center;
          }
          @media (max-width: 768px) {
            .hero-content h1 { font-size: 2.5rem; }
            .navbar { flex-direction: column; gap: 1rem; }
          }
        </style>
      </head>
      <body>
        <header>
          <div class="container">
            <nav class="navbar">
              <div class="logo"><span>SizzleStick</span> Welding</div>
              <ul class="nav-links">
                <li><a href="/">Home</a></li>
                <li><a href="/structural">Structural Projects</a></li>
                <li><a href="/artisanal">Artisanal & Architecture</a></li>
                <li><a href="/bio">Bio</a></li>
              </ul>
            </nav>
          </div>
        </header>

        <main>
          <section class="hero">
            <div class="container">
              <div class="hero-content">
                <h1>Forged in Fire,<br><span class="accent">Built to Last</span></h1>
                <p>Industrial-grade welding, structural steel fabrication, and custom metal art. From skyscrapers to sculptures — SizzleStick delivers precision and strength.</p>
                <div>
                  <a href="/structural" class="btn-primary">Structural Work →</a>
                  <a href="/artisanal" class="btn-outline" style="margin-left: 1rem;">Artisanal Metalwork</a>
                </div>
              </div>
              <div class="hero-visual" style="font-size: 5rem; text-align: center;">
                <span style="color: #e35f21;">⚡</span> <span style="color: #e35f21;">🔥</span>
              </div>
            </div>
          </section>

          <div class="container">
            <div class="cap-grid">
              <div class="cap-card">
                <i>🏗️</i>
                <h3>Structural Engineering</h3>
                <p>Heavy fabrication for commercial buildings, bridges, and industrial frameworks.</p>
              </div>
              <div class="cap-card">
                <i>🎨</i>
                <h3>Artisanal Metal</h3>
                <p>Custom gates, railings, furniture, and architectural accents.</p>
              </div>
              <div class="cap-card">
                <i>🛠️</i>
                <h3>On-Site Welding</h3>
                <p>Mobile welding services for repairs, installations, and custom builds.</p>
              </div>
            </div>
          </div>
        </main>

        <footer>
          <div class="container">
            <p>© 2025 SizzleStick Welding | Forged with integrity</p>
          </div>
        </footer>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
};
