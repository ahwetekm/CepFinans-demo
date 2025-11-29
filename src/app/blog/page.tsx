import BlogPage from '@/components/blog/BlogPage'
import { db } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings } from 'lucide-react'

async function getBlogPosts() {
  try {
    const posts = await db.post.findMany({
      where: {
        status: 'PUBLISHED'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        _count: {
          select: {
            comments: {
              where: {
                status: 'APPROVED'
              }
            }
          }
        }
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 12
    })

    return posts.map(post => ({
      ...post,
      tags: post.tags.map(postTag => postTag.tag)
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: {
            posts: {
              where: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function Blog() {
  const [posts, categories] = await Promise.all([
    getBlogPosts(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Button */}
      <div className="fixed top-6 right-6 z-50">
        <Link href="/admin/blog">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Admin
          </Button>
        </Link>
      </div>

      <BlogPage initialPosts={posts} categories={categories} />
    </div>
  )
}