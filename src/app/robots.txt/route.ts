import { NextResponse } from 'next/server'

export function GET() {
  const robots = `# ButcApp.com Robots.txt
# Generated: ${new Date().toISOString()}

User-agent: *
Allow: /

# Sitemap konumu
Sitemap: https://butcapp.com/sitemap.xml

# Crawl delay (sunucuyu yormamak için)
Crawl-delay: 1

# Özel kurallar
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Sadece API'leri engelle (güvenlik için)
User-agent: *
Disallow: /api/
Disallow: /_next/
Disallow: /admin/login
Disallow: /*.json$

# Cache control
# Allow caching of static assets
Allow: /_next/static/
Allow: /favicon.ico
Allow: /og-image.png`

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}