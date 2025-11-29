import { db } from '@/lib/prisma'

async function checkSlugs() {
  const categories = await db.category.findMany()
  console.log('Category slugs:', categories.map(c => ({ name: c.name, slug: c.slug })))
  
  const tags = await db.tag.findMany()
  console.log('Tag slugs:', tags.map(t => ({ name: t.name, slug: t.slug })))
  
  await db.$disconnect()
}

checkSlugs()