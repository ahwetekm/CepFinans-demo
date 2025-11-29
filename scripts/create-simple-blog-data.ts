import { db } from '../src/lib/prisma'

async function createSimpleBlogData() {
  try {
    console.log('Creating simple blog data...')

    // Create sample user
    const user = await db.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'ADMIN'
      }
    })
    console.log('Created user:', user.name)

    // Create sample categories
    const categories = await Promise.all([
      db.category.upsert({
        where: { slug: 'teknoloji' },
        update: {},
        create: {
          name: 'Teknoloji',
          slug: 'teknoloji',
          description: 'Teknoloji ve inovasyon yazıları'
        }
      }),
      db.category.upsert({
        where: { slug: 'yazilim' },
        update: {},
        create: {
          name: 'Yazılım',
          slug: 'yazilim',
          description: 'Yazılım geliştirme ve programlama'
        }
      }),
      db.category.upsert({
        where: { slug: 'web-gelistirme' },
        update: {},
        create: {
          name: 'Web Geliştirme',
          slug: 'web-gelistirme',
          description: 'Web teknolojileri ve frameworkler'
        }
      })
    ])
    console.log('Created categories:', categories.map(c => c.name))

    // Create sample posts
    const posts = await Promise.all([
      db.post.create({
        data: {
          title: 'Next.js 15 ile Yeni Bir Başlangıç',
          slug: 'nextjs-15-yeni-bir-baslangic',
          excerpt: 'Next.js 15 yenilikleri ve nasıl kullanılacağı hakkında detaylı rehber.',
          content: '<h1>Next.js 15 ile Yeni Bir Başlangıç</h1><p>Next.js 15, Vercel tarafından duyurulan en son sürüm olarak karşımıza çıkıyor. Bu yeni sürüm, birçok yenilik ve iyileştirme içeriyor.</p><h2>Yenilikler Neler?</h2><p>Next.js 15 ile birlikte gelen önemli yenilikler:</p><ul><li><strong>Turbopack:</strong> Hızlandırılmış geliştirme deneyimi</li><li><strong>App Router İyileştirmeleri:</strong> Daha iyi performans ve kullanım kolaylığı</li><li><strong>Font Optimization:</strong> Otomatik font optimizasyonu</li><li><strong>Image Optimization:</strong> Geliştirilmiş resim optimizasyonu</li></ul><h2>Nasıl Kullanılır?</h2><p>Next.js 15 kullanmaya başlamak için:</p><pre><code>npx create-next-app@latest my-app --typescript --tailwind --eslint</code></pre><p>Bu komut ile yeni bir Next.js 15 projesi oluşturabilirsiniz.</p><blockquote><p>Next.js 15, modern web geliştirmenin geleceğidir.</p></blockquote>',
          status: 'PUBLISHED',
          featured: true,
          viewCount: 150,
          readTime: 5,
          seoTitle: 'Next.js 15 Yenilikleri ve Özellikleri',
          seoDescription: 'Next.js 15 ile gelen yeni özellikler, Turbopack, App Router iyileştirmeleri ve nasıl kullanılacağı.',
          keywords: 'nextjs, react, web development, javascript, typescript',
          publishedAt: new Date(),
          author: {
            connect: { id: user.id }
          },
          category: {
            connect: { id: categories[0].id }
          }
        }
      }),
      db.post.create({
        data: {
          title: 'TypeScript Best Practices',
          slug: 'typescript-best-practices',
          excerpt: 'TypeScript kullanırken dikkat edilmesi gereken en iyi pratikler ve ipuçları.',
          content: '<h1>TypeScript Best Practices</h1><p>TypeScript, JavaScript\'e statik tipleme özelliği katan güçlü bir dildir. Bu yazıda TypeScript kullanırken dikkat edilmesi gereken en iyi pratikleri ele alacağız.</p><h2>Tip Tanımlamaları</h2><p>TypeScript\'te tip tanımlamaları çok önemlidir:</p><pre><code>interface User {\n  id: string;\n  name: string;\n  email: string;\n  role: \'admin\' | \'user\';\n}</code></pre><h2>Generics Kullanımı</h2><p>Generics, yeniden kullanılabilir kod yazmamızı sağlar:</p><pre><code>function createApiResponse&lt;T&gt;(data: T, success: boolean) {\n  return {\n    data,\n    success,\n    timestamp: new Date()\n  };\n}</code></pre>',
          status: 'PUBLISHED',
          featured: false,
          viewCount: 89,
          readTime: 7,
          seoTitle: 'TypeScript Best Practices ve İpuçları',
          seoDescription: 'TypeScript kullanırken dikkat edilmesi gereken en iyi pratikler, tip tanımlamaları ve generics kullanımı.',
          keywords: 'typescript, types, programming, javascript, best practices',
          publishedAt: new Date(),
          author: {
            connect: { id: user.id }
          },
          category: {
            connect: { id: categories[1].id }
          }
        }
      }),
      db.post.create({
        data: {
          title: 'Prisma ile Modern Veritabanı Yönetimi',
          slug: 'prisma-modern-veritabani-yonetimi',
          excerpt: 'Prisma ORM kullanarak modern ve verimli veritabanı yönetimi nasıl yapılır?',
          content: '<h1>Prisma ile Modern Veritabanı Yönetimi</h1><p>Prisma, modern veritabanı yönetimi için geliştirilmiş bir ORM aracıdır. Bu yazıda Prisma\'nın temel özelliklerini ve kullanımını ele alacağız.</p><h2>Prisma Nedir?</h2><p>Prisma, veritabanı erişimi için modern bir araçtır:</p><ul><li>Type-safe veritabanı erişimi</li><li>Otomatik sınıf oluşturma</li><li>Veritabanı migrasyonu</li><li>Query optimizasyonu</li></ul><h2>Kurulum</h2><p>Prisma kurulumu oldukça basittir:</p><pre><code>npm install prisma --save-dev\nnpx prisma init</code></pre><h2>Schema Tanımlama</h2><p>Prisma schema dosyasında veritabanı modelinizi tanımlayabilirsiniz:</p><pre><code>model User {\n  id    String  @id @default(cuid())\n  email String  @unique\n  name  String?\n  posts Post[]\n}</code></pre>',
          status: 'DRAFT',
          featured: false,
          viewCount: 45,
          readTime: 6,
          seoTitle: 'Prisma ORM ile Veritabanı Yönetimi',
          seoDescription: 'Prisma ORM kullanarak modern veritabanı yönetimi, kurulum, schema tanımlama ve best practices.',
          keywords: 'prisma, orm, database, typescript, nodejs',
          author: {
            connect: { id: user.id }
          },
          category: {
            connect: { id: categories[2].id }
          }
        }
      })
    ])
    console.log('Created posts:', posts.map(p => p.title))

    console.log('Simple blog data created successfully!')
    
  } catch (error) {
    console.error('Error creating sample data:', error)
  } finally {
    await db.$disconnect()
  }
}

createSimpleBlogData()