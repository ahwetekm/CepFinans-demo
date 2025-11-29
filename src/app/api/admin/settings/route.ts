import { NextRequest, NextResponse } from 'next/server'

// Mock settings data
const mockSettings = {
  siteName: 'ButcApp',
  siteDescription: 'Finansal yatırım yönetim platformu',
  siteUrl: 'https://butcapp.com',
  supportEmail: 'support@butcapp.com',
  maintenanceMode: false,
  allowRegistration: true,
  emailNotifications: true,
  maxFileSize: 10,
  sessionTimeout: 24,
  theme: 'system',
  language: 'tr'
}

export async function GET(request: NextRequest) {
  try {
    // Auth check
    const token = request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      settings: mockSettings
    })

  } catch (error) {
    console.error('Settings fetch error:', error)
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

    const settings = await request.json()
    
    // Mock save settings
    console.log('Settings saved:', settings)

    return NextResponse.json({
      success: true,
      message: 'Ayarlar başarıyla kaydedildi',
      settings
    })

  } catch (error) {
    console.error('Settings save error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}