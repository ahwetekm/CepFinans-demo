import { db } from '@/lib/prisma'

async function addPostsDirectly() {
  try {
    console.log('Adding posts directly...')
    
    // Get existing data
    const author = await db.user.findFirst()
    const categories = await db.category.findMany()
    const tags = await db.tag.findMany()
    
    const kisiselFinans = categories.find(c => c.slug === 'kişisel-finans')
    const yatirimStratejileri = categories.find(c => c.slug === 'yatirim-stratejileri')
    const butce = tags.find(t => t.slug === 'butc')
    const birikim = tags.find(t => t.slug === 'birikim')
    const yatirim = tags.find(t => t.slug === 'yatirim')
    
    console.log('Author ID:', author?.id)
    console.log('Category IDs:', kisiselFinans?.id, yatirimStratejileri?.id)
    console.log('Tag IDs:', butce?.id, birikim?.id, yatirim?.id)
    
    if (!author || !kisiselFinans || !yatirimStratejileri || !butce || !birikim || !yatirim) {
      console.error('Missing required data')
      return
    }
    
    // Use raw SQL to insert posts
    await db.$executeRaw`
      INSERT INTO posts (
        id, title, slug, excerpt, content, featured, readTime, status, 
        publishedAt, createdAt, updatedAt, authorId, categoryId
      ) VALUES (
        'post-1', 
        '2024 Yılında Kişisel Finans Yönetimi İçin 10 Altın Kural',
        '2024-yilinda-kisisel-finans-yonetimi-icin-10-altin-kural',
        'Yeni yılda finansal hedeflerinize ulaşmak için uygulayabileceğiniz etkili kişisel finans yönetimi stratejileri.',
        '# 2024 Yılında Kişisel Finans Yönetimi İçin 10 Altın Kural\n\nFinansal sağlığınızı iyileştirmek ve para biriktirmek için 2024 yılında uygulayabileceğiniz 10 etkili kural.',
        1, 3, 'PUBLISHED', datetime('now'), datetime('now'), datetime('now'),
        ${author.id}, ${kisiselFinans.id}
      )
    `
    
    await db.$executeRaw`
      INSERT INTO posts (
        id, title, slug, excerpt, content, featured, readTime, status, 
        publishedAt, createdAt, updatedAt, authorId, categoryId
      ) VALUES (
        'post-2', 
        'Yeni Başlayanlar için Yatırım Rehberi',
        'yeni-baslayanlar-icin-yatirim-rehberi',
        'Yatırıma nereden başlayacağınızı bilmeyenler için kapsamlı bir rehber.',
        '# Yeni Başlayanlar için Yatırım Rehberi\n\nYatırım dünyasına adım atmak göz korkutucu olabilir.',
        0, 2, 'PUBLISHED', datetime('now'), datetime('now'), datetime('now'),
        ${author.id}, ${yatirimStratejileri.id}
      )
    `
    
    // Connect tags
    await db.$executeRaw`INSERT INTO post_tags (postId, tagId) VALUES ('post-1', ${butce.id})`
    await db.$executeRaw`INSERT INTO post_tags (postId, tagId) VALUES ('post-1', ${birikim.id})`
    await db.$executeRaw`INSERT INTO post_tags (postId, tagId) VALUES ('post-2', ${yatirim.id})`
    
    console.log('Posts added successfully!')
    
  } catch (error) {
    console.error('Error adding posts:', error)
  } finally {
    await db.$disconnect()
  }
}

addPostsDirectly()