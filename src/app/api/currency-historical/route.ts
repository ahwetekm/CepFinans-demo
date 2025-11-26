import { NextRequest, NextResponse } from 'next/server'

// Türkiye resmi tatil günleri (2025 yılı için)
const TURKISH_HOLIDAYS_2025 = [
  { date: '2025-01-01', name: 'Yilbaşı' },
  { date: '2025-04-23', name: 'Ramazan Bayrami 1. Gunu' },
  { date: '2025-04-24', name: 'Ramazan Bayrami 2. Gunu' },
  { date: '2025-04-25', name: 'Ramazan Bayrami 3. Gunu' },
  { date: '2025-05-01', name: 'Emek ve Dayanisma Gunu' },
  { date: '2025-05-19', name: 'Genclik ve Spor Bayrami' },
  { date: '2025-07-15', name: 'Demokrasi ve Milli Birlik Gunu' },
  { date: '2025-08-30', name: 'Zafer Bayrami' },
  { date: '2025-10-29', name: 'Cumhuriyet Bayrami' },
  { date: '2025-11-10', name: 'Ataturku Anma Gunu' }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') // Format: YYYY-MM-DD
    
    if (!date) {
      return NextResponse.json({
        success: false,
        error: 'Date parameter is required'
      }, { status: 400 })
    }

    // Check if the requested date is a holiday
    const isHoliday = TURKISH_HOLIDAYS_2025.some(holiday => holiday.date === date)
    
    if (isHoliday) {
      return NextResponse.json({
        success: false,
        error: 'Seçilen tarih resmi tatil günüdür. TCMB bu gün için veri yayınlamaz.',
        holiday: TURKISH_HOLIDAYS_2025.find(h => h.date === date),
        date: date,
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }

    // Convert date to TCMB format (DD.MM.YYYY)
    const [year, month, day] = date.split('-')
    const tcmbDate = `${day}.${month}.${year}`
    
    // TCMB API endpoint for historical data
    const url = `https://www.tcmb.gov.tr/kurlar/${year}${month}/${day}${month}${year}.xml`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error('TCMB historical API request failed')
    }
    
    const xmlText = await response.text()
    
    // XML parsing - simpler approach
    const currencies = [
      { code: 'USD', name: 'ABD DOLARI', symbol: 'USD/TRY' },
      { code: 'EUR', name: 'EURO', symbol: 'EUR/TRY' },
      { code: 'GBP', name: 'İNGİLİZ STERLİNİ', symbol: 'GBP/TRY' },
      { code: 'CHF', name: 'İSVİÇRE FRANGI', symbol: 'CHF/TRY' },
      { code: 'SEK', name: 'İSVEÇ KRONU', symbol: 'SEK/TRY' },
      { code: 'DKK', name: 'DANİMARKA KRONU', symbol: 'DKK/TRY' },
      { code: 'NOK', name: 'NORVEÇ KRONU', symbol: 'NOK/TRY' },
      { code: 'CAD', name: 'KANADA DOLARI', symbol: 'CAD/TRY' },
      { code: 'AUD', name: 'AVUSTRALYA DOLARI', symbol: 'AUD/TRY' },
      { code: 'JPY', name: 'JAPON YENİ', symbol: 'JPY/TRY' },
      { code: 'KWD', name: 'KUVEYT DİNARI', symbol: 'KWD/TRY' },
      { code: 'SAR', name: 'SUUDİ ARABİSTAN RİYALİ', symbol: 'SAR/TRY' },
      { code: 'BGN', name: 'BULGAR LEVASI', symbol: 'BGN/TRY' },
      { code: 'RON', name: 'RUMEN LEYİ', symbol: 'RON/TRY' },
      { code: 'RUB', name: 'RUS RUBLESİ', symbol: 'RUB/TRY' },
      { code: 'IRR', name: 'İRAN RİYALİ', symbol: 'IRR/TRY' },
      { code: 'CNY', name: 'ÇİN YUANI', symbol: 'CNY/TRY' },
      { code: 'PKR', name: 'PAKİSTAN RUPİSİ', symbol: 'PKR/TRY' },
      { code: 'QAR', name: 'KATAR RİYALİ', symbol: 'QAR/TRY' },
      { code: 'AZN', name: 'AZERBAYCAN MANATI', symbol: 'AZN/TRY' }
    ]
    
    const result = currencies.map(currency => {
      // Simpler regex patterns
      const forexBuyingPattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<ForexBuying>([^<]*)</ForexBuying>`, 'is')
      const forexSellingPattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<ForexSelling>([^<]*)</ForexSelling>`, 'is')
      const changePattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<Change>([^<]*)</Change>`, 'is')
      
      const forexBuyingMatch = xmlText.match(forexBuyingPattern)
      const forexSellingMatch = xmlText.match(forexSellingPattern)
      const changeMatch = xmlText.match(changePattern)
      
      if (forexBuyingMatch && forexSellingMatch) {
        const forexBuying = parseFloat(forexBuyingMatch[1]?.replace(',', '.') || '0')
        const forexSelling = parseFloat(forexSellingMatch[1]?.replace(',', '.') || '0')
        const change = parseFloat(changeMatch?.[1]?.replace(',', '.') || '0')
        
        // Calculate average price
        const price = (forexBuying + forexSelling) / 2
        
        // Calculate percentage change
        const changePercent = price > 0 ? (change / price) * 100 : 0
        
        return {
          symbol: currency.symbol,
          name: currency.name,
          price: price || 0,
          change: change || 0,
          changePercent: changePercent || 0,
          forexBuying: forexBuying || 0,
          forexSelling: forexSelling || 0
        }
      }
      
      // Fallback data if parsing fails
      return {
        symbol: currency.symbol,
        name: currency.name,
        price: 0,
        change: 0,
        changePercent: 0,
        forexBuying: 0,
        forexSelling: 0
      }
    }).filter(currency => currency.price > 0) // Filter out currencies with no data
    
    return NextResponse.json({
      success: true,
      data: result,
      date: tcmbDate,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('TCMB Historical API Error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch historical TCMB data',
      data: [],
      timestamp: new Date().toISOString()
    })
  }
}