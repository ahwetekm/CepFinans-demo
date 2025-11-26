import { NextRequest, NextResponse } from 'next/server'

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

    // Check if requested date is a holiday or weekend
    const holidays = [
      '2025-01-01', // Yılbaşı
      '2025-04-23', // Ramazan Bayramı 1. Günü
      '2025-04-24', // Ramazan Bayramı 2. Günü
      '2025-04-25', // Ramazan Bayramı 3. Günü
      '2025-05-01', // Emek ve Dayanışma Günü
      '2025-05-19', // Gençlik ve Spor Bayramı
      '2025-07-15', // Demokrasi ve Milli Birlik Günü
      '2025-08-30', // Zafer Bayramı
      '2025-10-29', // Cumhuriyet Bayramı
      '2025-11-10'  // Atatürk'ü Anma Günü
    ]
    
    // Check if it's a weekend
    const [year, month, day] = date.split('-').map(Number)
    const checkDate = new Date(year, month - 1, day)
    const dayOfWeek = checkDate.getDay() // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const isHoliday = holidays.includes(date)
    
    // Function to find previous working day
    const findPreviousWorkingDay = (targetDate: string) => {
      const [year, month, day] = targetDate.split('-').map(Number)
      let checkDate = new Date(year, month - 1, day) // Start from the requested date
      
      // Go back one day first
      checkDate.setDate(checkDate.getDate() - 1)
      
      // Keep going back until we find a working day (not weekend and not holiday)
      while (true) {
        const dayOfWeek = checkDate.getDay()
        const checkDateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
        
        // Check if it's a working day (not Sunday=0 and not Saturday=6) and not a holiday
        if (dayOfWeek !== 0 && dayOfWeek !== 6 && !holidays.includes(checkDateStr)) {
          return checkDateStr
        }
        
        // Go back one more day
        checkDate.setDate(checkDate.getDate() - 1)
        
        // Safety check: don't go back more than 30 days
        const daysDiff = Math.floor((new Date(year, month - 1, day).getTime() - checkDate.getTime()) / (1000 * 60 * 60 * 24))
        if (daysDiff > 30) {
          return new Date().toISOString().split('T')[0] // Return today as fallback
        }
      }
    }
    
    // If it's a weekend or holiday, automatically find previous working day and update date
    let actualDate = date
    let wasWeekend = false
    let wasHoliday = false
    
    if (isWeekend || isHoliday) {
      actualDate = findPreviousWorkingDay(date)
      wasWeekend = isWeekend
      wasHoliday = isHoliday
    }

    // Convert date to TCMB format (DD.MM.YYYY)
    const [apiYear, apiMonth, apiDay] = actualDate.split('-')
    const tcmbDate = `${apiDay}.${apiMonth}.${apiYear}`
    
    // Try to get data for requested date first
    const url = `https://www.tcmb.gov.tr/kurlar/${apiYear}${apiMonth}/${apiDay}${apiMonth}${apiYear}.xml`
    
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
    
    // If no data found for requested date, try previous working day
    if (result.length === 0) {
      const previousWorkingDay = findPreviousWorkingDay(date)
      const [prevYear, prevMonth, prevDay] = previousWorkingDay.split('-')
      const prevTcmbDate = `${prevDay}.${prevMonth}.${prevYear}`
      const prevUrl = `https://www.tcmb.gov.tr/kurlar/${prevYear}${prevMonth}/${prevDay}${prevMonth}${prevYear}.xml`
      
      try {
        const prevResponse = await fetch(prevUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })
        
        if (prevResponse.ok) {
          const prevXmlText = await prevResponse.text()
          const prevResult = currencies.map(currency => {
            const prevForexBuyingPattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<ForexBuying>([^<]*)</ForexBuying>`, 'is')
            const prevForexSellingPattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<ForexSelling>([^<]*)</ForexSelling>`, 'is')
            const prevChangePattern = new RegExp(`<Currency[^>]*Kod="${currency.code}"[^>]*>.*?<Change>([^<]*)</Change>`, 'is')
            
            const prevForexBuyingMatch = prevXmlText.match(prevForexBuyingPattern)
            const prevForexSellingMatch = prevXmlText.match(prevForexSellingPattern)
            const prevChangeMatch = prevXmlText.match(prevChangePattern)
            
            if (prevForexBuyingMatch && prevForexSellingMatch) {
              const prevForexBuying = parseFloat(prevForexBuyingMatch[1]?.replace(',', '.') || '0')
              const prevForexSelling = parseFloat(prevForexSellingMatch[1]?.replace(',', '.') || '0')
              const prevChange = parseFloat(prevChangeMatch?.[1]?.replace(',', '.') || '0')
              
              const prevPrice = (prevForexBuying + prevForexSelling) / 2
              const prevChangePercent = prevPrice > 0 ? (prevChange / prevPrice) * 100 : 0
              
              return {
                symbol: currency.symbol,
                name: currency.name,
                price: prevPrice || 0,
                change: prevChange || 0,
                changePercent: prevChangePercent || 0,
                forexBuying: prevForexBuying || 0,
                forexSelling: prevForexSelling || 0
              }
            }
          })
          
          if (prevResult.length > 0) {
            return NextResponse.json({
              success: true,
              data: prevResult,
              date: prevTcmbDate,
              fallbackDate: true,
              originalDate: date,
              message: `Seçilen tarih (${date}) için veri bulunamadı. Önceki çalışma günü (${previousWorkingDay}) verileri kullanılıyor.`,
              timestamp: new Date().toISOString()
            })
          }
        }
      } catch (error) {
        console.error('Previous day API Error:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      data: result,
      date: tcmbDate,
      originalDate: (wasWeekend || wasHoliday) ? date : undefined,
      fallbackDate: wasWeekend || wasHoliday,
      message: (wasWeekend || wasHoliday) ? 
        `Seçilen tarih (${date}) ${wasHoliday ? 'resmi tatil' : 'hafta sonu'} olduğu için önceki çalışma günü (${actualDate}) verileri kullanılıyor.` : 
        undefined,
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