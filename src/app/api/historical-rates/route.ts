import { NextResponse } from 'next/server'

interface HistoricalRate {
  date: string
  code: string
  name: string
  buyRate: number
  sellRate: number
  flag: string
}

interface TCMBHistoricalResponse {
  Tarih_Date?: {
    Currency?: Array<{
      '@attributes': {
        Kod: string
        CurrencyCode: string
      }
      Unit: string
      Isim: string
      CurrencyName: string
      ForexBuying: string
      ForexSelling: string
      BanknoteBuying: string
      BanknoteSelling: string
      CrossRateUSD: string
      CrossRateOther: string
    }>
  }
}

// İş günü hesapla (Pazartesi-Cuma)
const isBusinessDay = (date: Date): boolean => {
  const day = date.getDay()
  // 0 = Pazar, 6 = Cumartesi
  return day >= 1 && day <= 5
}

// Önceki iş gününü bul
const getPreviousBusinessDay = (date: Date): Date => {
  const prevDay = new Date(date)
  prevDay.setDate(prevDay.getDate() - 1)
  
  // Hafta sonu ise haftaiçi geri git
  while (!isBusinessDay(prevDay)) {
    prevDay.setDate(prevDay.getDate() - 1)
  }
  
  return prevDay
}

// Tarihi formatla (DDMMYYYY)
const formatDateForTCMB = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${day}${month}${year}` // DDMMYYYY formatı
}

// Yıl ve ay formatla (YYYYMM)
const formatYearMonthForTCMB = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}${month}` // YYYYMM formatı
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const targetDate = searchParams.get('date')
    const currencyCode = searchParams.get('currency')
    
    if (!targetDate) {
      return NextResponse.json({
        success: false,
        error: 'Tarih parametresi gereklidir (format: YYYY-MM-DD)'
      }, { status: 400 })
    }

    const targetDateObj = new Date(targetDate)
    
    // Geçersiz tarih kontrolü
    if (isNaN(targetDateObj.getTime())) {
      return NextResponse.json({
        success: false,
        error: 'Geçersiz tarih formatı'
      }, { status: 400 })
    }

    let currentDate = new Date(targetDateObj)
    let attempts = 0
    const maxAttempts = 7 // En fazla 7 iş günü geri git (isteğe göre)
    
    let historicalData: HistoricalRate[] = []
    let usedDate = ''
    let isPreviousDay = false

    while (attempts < maxAttempts) {
      const tcmbDate = formatDateForTCMB(currentDate) // DDMMYYYY
      const yearMonth = formatYearMonthForTCMB(currentDate) // YYYYMM
      
      // TCMB URL formatı: https://www.tcmb.gov.tr/kurlar/YYYYMM/DDMMYYYY.xml
      const tcmbUrl = `https://www.tcmb.gov.tr/kurlar/${yearMonth}/${tcmbDate}.xml`
      
      try {
        console.log(`TCMB deneme ${attempts + 1}: ${tcmbUrl}`)
        
        const response = await fetch(tcmbUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        
        if (response.ok) {
          const xmlText = await response.text()
          
          // Boş XML kontrolü
          if (!xmlText || xmlText.trim().length < 50) {
            console.log(`Boş XML: ${tcmbUrl}`)
          } else {
            try {
              // Node.js'te XML parsing için cheerio veya jsdom kullanabiliriz
              // Şimdilik basit bir regex ile parse edelim
              console.log(`📄 XML metni alındı, boyut: ${xmlText.length} karakter`)
              
              // Currency bloklarını regex ile bul
              const currencyRegex = /<Currency[^>]*Kod="([^"]+)"[^>]*>[\s\S]*?<\/Currency>/g
              const currencyMatches = [...xmlText.matchAll(currencyRegex)]
              
              console.log(`🔍 ${currencyMatches.length} döviz bloğu bulundu`)
              
              const rates: HistoricalRate[] = []
              
              for (const match of currencyMatches) {
                const currencyXml = match[0]
                const code = match[1]
                
                console.log(`🔍 Döviz analiz ediliyor: ${code}`)
                
                if (code && (!currencyCode || code === currencyCode)) {
                  // Isim bul
                  const nameMatch = currencyXml.match(/<Isim>([^<]+)<\/Isim>/)
                  const name = nameMatch ? nameMatch[1] : ''
                  
                  // ForexSelling bul
                  const sellingMatch = currencyXml.match(/<ForexSelling>([^<]*)<\/ForexSelling>/)
                  const selling = parseFloat(sellingMatch ? sellingMatch[1] : '0')
                  
                  // ForexBuying bul
                  const buyingMatch = currencyXml.match(/<ForexBuying>([^<]*)<\/ForexBuying>/)
                  const buying = parseFloat(buyingMatch ? buyingMatch[1] : '0')
                  
                  console.log(`💰 ${code} - Alış: ${buying}, Satış: ${selling}`)
                  
                  // Sadece geçerli kurları ekle
                  if (buying > 0 && selling > 0) {
                    rates.push({
                      date: currentDate.toISOString().split('T')[0],
                      code,
                      name: name.charAt(0) + name.slice(1).toLowerCase(), // İlk harf büyük, diğerleri küçük
                      buyRate: buying,
                      sellRate: selling,
                      flag: getCurrencyFlag(code)
                    })
                    console.log(`✅ ${code} eklendi: ${selling} (satış)`)
                  } else {
                    console.log(`❌ ${code} geçersiz kur: Alış=${buying}, Satış=${selling}`)
                  }
                }
              }
              
              if (rates.length > 0) {
                historicalData = rates
                usedDate = currentDate.toISOString().split('T')[0]
                isPreviousDay = attempts > 0
                console.log(`🎉 Kur bulundu: ${tcmbUrl} (${attempts + 1}. deneme) - ${rates.length} döviz`)
              } else {
                console.log(`⚠️ Geçerli kur bulunamadı: ${tcmbUrl}`)
              }
            } catch (parseError) {
              console.log(`💥 XML parsing hatası: ${tcmbUrl} - ${parseError}`)
            }
          }
        } else {
          console.log(`🌐 HTTP Hata: ${response.status} - ${tcmbUrl}`)
        }
      } catch (error) {
        console.log(`TCMB API hatası: ${tcmbUrl} - ${error}`)
      }
      
      // Kur bulunduysa döngüden çık
      if (historicalData.length > 0) {
        break
      }
      
      // Bir önceki iş gününe git
      currentDate = getPreviousBusinessDay(currentDate)
      attempts++
    }

    if (historicalData.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Belirtilen tarihte veya önceki iş günlerinde kur bulunamadı',
        requestedDate: targetDate,
        searchedDates: Array.from({ length: attempts }, (_, i) => {
          const d = new Date(targetDateObj)
          for (let j = 0; j <= i; j++) {
            d.setDate(d.getDate() - 1)
            while (!isBusinessDay(d)) {
              d.setDate(d.getDate() - 1)
            }
          }
          return d.toISOString().split('T')[0]
        })
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: historicalData,
      requestedDate: targetDate,
      actualDate: usedDate,
      isPreviousDay,
      message: isPreviousDay 
        ? `Seçilen tarihte kur yok, ${usedDate} tarihinin kuru kullanıldı.`
        : null
    })

  } catch (error) {
    console.error('Geçmiş döviz kuru hatası:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Döviz kuru alınamadı',
      message: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}

// Para birimi bayrakları
const getCurrencyFlag = (code: string): string => {
  const flags: { [key: string]: string } = {
    'USD': '🇺🇸',
    'EUR': '🇪🇺',
    'GBP': '🇬🇧',
    'CHF': '🇨🇭',
    'JPY': '🇯🇵',
    'SAR': '🇸🇦',
    'CAD': '🇨🇦',
    'AUD': '🇦🇺',
    'NOK': '🇳🇴',
    'SEK': '🇸🇪',
    'DKK': '🇩🇰',
    'CNY': '🇨🇳',
    'RUB': '🇷🇺',
    'BGN': '🇧🇬',
    'RON': '🇷🇴',
    'IRR': '🇮🇷',
    'KWD': '🇰🇼',
    'AZN': '🇦🇿',
    'AED': '🇦🇪',
    'QAR': '🇶🇦',
    'BHD': '🇧🇭',
    'OMR': '🇴🇲',
    'JOD': '🇯🇴',
    'LBP': '🇱🇧',
    'EGP': '🇪🇬',
    'IQD': '🇮🇶',
    'LYD': '🇱🇾',
    'SYP': '🇸🇾',
    'YER': '🇾🇪'
  }
  return flags[code] || '🏳️'
}