import { NextResponse } from 'next/server'

export function GET() {
  const robots = `# ButcApp.com Robots.txt
# Tüm arama motorları için yönlendirmeler

User-agent: *
Allow: /

# Önemli sayfalar
Allow: /app
Allow: /app/investments
Allow: /app/settings
Allow: /admin

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
Disallow: /*.json$`

  return new NextResponse(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}