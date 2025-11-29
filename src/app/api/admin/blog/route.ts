import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || 'all'
    const category = searchParams.get('category')

    // Build where clause
    const where: any = {}

    if (status !== 'all') {
      where.status = status
    }

    if (category && category !== 'all') {
      where.category = {
        slug: category
      }
    }

    const skip = (page - 1) * limit

    // Get posts
    const posts = await db.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
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
            comments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip
    })

    // Get total count
    const total = await db.post.count({ where })

    return NextResponse.json({
      posts: posts.map(post => ({
        ...post,
        tags: post.tags.map(postTag => postTag.tag)
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching admin posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      featured = false,
      status = 'DRAFT',
      categoryId,
      tagIds = [],
      authorId,
      seoTitle,
      seoDescription,
      keywords,
      readTime
    } = body

    // Calculate reading time if not provided
    const calculatedReadTime = readTime || Math.ceil(content.split(/\s+/).length / 200)

    const post = await db.post.create({
      data: {
        title,
        slug: slug || title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        excerpt,
        content,
        coverImage,
        featured,
        status,
        readTime: calculatedReadTime,
        seoTitle,
        seoDescription,
        keywords,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
        author: {
          connect: { id: authorId }
        },
        category: categoryId && categoryId !== 'none' ? {
          connect: { id: categoryId }
        } : undefined,
        tags: {
          connect: tagIds.map((id: string) => ({ id }))
        }
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
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
        }
      }
    })

    return NextResponse.json({
      ...post,
      tags: post.tags.map(postTag => postTag.tag)
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, categoryId, ...updateData } = body

    // Calculate reading time if content is updated
    if (updateData.content) {
      updateData.readTime = Math.ceil(updateData.content.split(/\s+/).length / 200)
    }

    // Handle publishedAt when status changes to PUBLISHED
    if (updateData.status === 'PUBLISHED' && !updateData.publishedAt) {
      updateData.publishedAt = new Date()
    }

    // Handle category connection/disconnection
    if (categoryId !== undefined) {
      updateData.category = categoryId && categoryId !== 'none' ? {
        connect: { id: categoryId }
      } : {
        disconnect: true
      }
    }

    const post = await db.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
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
        }
      }
    })

    return NextResponse.json({
      ...post,
      tags: post.tags.map(postTag => postTag.tag)
    })

  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    await db.post.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}