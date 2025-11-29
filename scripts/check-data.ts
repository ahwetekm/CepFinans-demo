import { db } from '@/lib/prisma'

async function checkData() {
  try {
    console.log('Checking database data...')
    
    // Check users
    const users = await db.user.findMany()
    console.log('Users:', users.length)
    
    // Check categories
    const categories = await db.category.findMany()
    console.log('Categories:', categories.length)
    console.log('Category names:', categories.map(c => c.name))
    
    // Check tags
    const tags = await db.tag.findMany()
    console.log('Tags:', tags.length)
    console.log('Tag names:', tags.map(t => t.name))
    
    // Check posts
    const posts = await db.post.findMany({
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
    console.log('Posts:', posts.length)
    console.log('Post titles:', posts.map(p => p.title))
    
    // Check published posts specifically
    const publishedPosts = await db.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true
          }
        }
      }
    })
    console.log('Published posts:', publishedPosts.length)
    
  } catch (error) {
    console.error('Error checking data:', error)
  } finally {
    await db.$disconnect()
  }
}

checkData()