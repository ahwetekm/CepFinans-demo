import { NextRequest, NextResponse } from 'next/server'

// Mock logs data
const mockLogs = [
  {
    id: '1',
    timestamp: '2024-11-29T10:30:15Z',
    level: 'success',
    category: 'auth',
    message: 'Admin kullanıcı giriş yaptı',
    userId: 'admin123',
    userEmail: 'admin@butcapp.com',
    ip: '192.168.1.100'
  },
  {
    id: '2',
    timestamp: '2024-11-29T10:25:30Z',
    level: 'warning',
    category: 'security',
    message: 'Başarısız giriş denemesi',
    userId: null,
    userEmail: 'unknown@hack.com',
    ip: '192.168.1.200'
  }
]

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    let filteredLogs = mockLogs

    if (level && level !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }

    if (category && category !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.category === category)
    }

    if (search) {
      filteredLogs = filteredLogs.filter(log => 
        log.message.toLowerCase().includes(search.toLowerCase()) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(search.toLowerCase()))
      )
    }

    return NextResponse.json({
      success: true,
      logs: filteredLogs
    })

  } catch (error) {
    console.error('Logs fetch error:', error)
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

    if (id) {
      // Delete specific log
      return NextResponse.json({
        success: true,
        message: 'Log başarıyla silindi'
      })
    } else {
      // Clear all logs
      return NextResponse.json({
        success: true,
        message: 'Tüm loglar başarıyla temizlendi'
      })
    }

  } catch (error) {
    console.error('Logs deletion error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}