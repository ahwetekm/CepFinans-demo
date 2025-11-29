import { NextRequest, NextResponse } from 'next/server'

// Mock users data
const mockUsers = [
  {
    id: '1',
    email: 'user1@example.com',
    fullName: 'Ahmet Yılmaz',
    role: 'user',
    status: 'active',
    createdAt: '2024-01-15',
    lastLogin: '2024-11-28',
    totalInvestments: 12,
    totalValue: '$45,230'
  },
  {
    id: '2',
    email: 'user2@example.com',
    fullName: 'Ayşe Demir',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-20',
    lastLogin: '2024-11-29',
    totalInvestments: 8,
    totalValue: '$23,100'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      users: mockUsers
    })

  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const body = await request.json()
    
    // Mock create user
    const newUser = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: null,
      totalInvestments: 0,
      totalValue: '$0'
    }

    return NextResponse.json({
      success: true,
      user: newUser
    })

  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    // Mock update user
    return NextResponse.json({
      success: true,
      user: { id, ...updateData }
    })

  } catch (error) {
    console.error('User update error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Kullanıcı ID gerekli' },
        { status: 400 }
      )
    }

    // Mock delete user
    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    })

  } catch (error) {
    console.error('User deletion error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}