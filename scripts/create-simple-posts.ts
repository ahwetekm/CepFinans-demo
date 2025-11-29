import { db } from '@/lib/prisma'

async function createSimplePosts() {
  try {
    console.log('Creating simple blog posts...')
    
    // Get author
    const author = await db.user.findFirst()
    if (!author) {
      console.error('No author found')
      return
    }
    
    // Get categories
    const categories = await db.category.findMany()
    const kisiselFinans = categories.find(c => c.slug === 'kişisel-finans')
    const yatirimStratejileri = categories.find(c => c.slug === 'yatirim-stratejileri')
    
    // Get tags
    const tags = await db.tag.findMany()
    const butce = tags.find(t => t.slug === 'butc')
    const birikim = tags.find(t => t.slug === 'birikim')
    const yatirim = tags.find(t => t.slug === 'yatirim')
    
    if (!kisiselFinans || !yatirimStratejileri || !butce || !birikim || !yatirim) {
      console.error('Missing required data')
      return
    }
    
    console.log('Found all required data')
    console.log('Author:', author.name)
    console.log('Categories:', kisiselFinans.name, yatirimStratejileri.name)
    console.log('Tags:', butce.name, birikim.name, yatirim.name)
    
    // Create posts
    const posts = [
      {
        title: '2024 Yılında Kişisel Finans Yönetimi İçin 10 Altın Kural',
        slug: '2024-yilinda-kisisel-finans-yonetimi-icin-10-altin-kural',
        excerpt: 'Yeni yılda finansal hedeflerinize ulaşmak için uygulayabileceğiniz etkili kişisel finans yönetimi stratejileri.',
        content: '# 2024 Yılında Kişisel Finans Yönetimi İçin 10 Altın Kural\n\nFinansal sağlığınızı iyileştirmek ve para biriktirmek için 2024 yılında uygulayabileceğiniz 10 etkili kural:\n\n## 1. Detaylı Bütçe Oluşturun\nGelir ve giderlerinizi detaylı bir şekilde takip edin.\n\n## 2. Acil Durum Fonu Oluşturun\nEn az 3-6 aylık yaşam masrafınızı karşılayacak bir acil durum fonu oluşturun.\n\n## 3. Borçlarınızı Önceliklendirin\nYüksek faizli borçlarınızı öncelikli olarak ödeyin.\n\nBu kuralları düzenli olarak uygulayarak 2024 yılında finansal hedeflerinize ulaşabilirsiniz.',
        featured: true,
        readTime: 3,
        categoryId: kisiselFinans.id,
        tagIds: [butce.id, birikim.id]
      },
      {
        title: 'Yeni Başlayanlar için Yatırım Rehberi',
        slug: 'yeni-baslayanlar-icin-yatirim-rehberi',
        excerpt: 'Yatırıma nereden başlayacağınızı bilmeyenler için kapsamlı bir rehber.',
        content: '# Yeni Başlayanlar için Yatırım Rehberi\n\nYatırım dünyasına adım atmak göz korkutucu olabilir, ancak doğru bilgi ve strateji ile başarılı olabilirsiniz.\n\n## Temel Yatırım Araçları\n\n### 1. Hisse Senetleri\nŞirketlerin ortaklık senetleridir.\n\n### 2. Tahviller\nDevlet veya şirketlerin borçlanma senetleridir.\n\nUnutmayın, yatırım bir maraton, sprint değil.',
        featured: false,
        readTime: 2,
        categoryId: yatirimStratejileri.id,
        tagIds: [yatirim.id]
      }
    ]
    
    for (const postData of posts) {
      const { tagIds, ...postFields } = postData
      
      await db.post.create({
        data: {
          ...postFields,
          status: 'PUBLISHED',
          publishedAt: new Date(),
          authorId: author.id,
          tags: {
            connect: tagIds.map((id: string) => ({ id }))
          }
        }
      })
    }
    
    console.log('Posts created successfully!')
    
  } catch (error) {
    console.error('Error creating posts:', error)
  } finally {
    await db.$disconnect()
  }
}

createSimplePosts()