import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // TCMB API endpoint
    const url = `https://www.tcmb.gov.tr/kurlar/today.xml`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error('TCMB API request failed')
    }
    
    const xmlText = await response.text()
    
    // XML parsing - simpler approach
    const currencies = [
      { code: 'USD', name: 'ABD DOLARI', symbol: 'USD/TRY' },
      { code: 'EUR', name: 'EURO', symbol: 'EUR/TRY' },
      { code: 'GBP', name: 'İNGİLİZ STERLİNİ', symbol: 'GBP/TRY' },
      { code: 'CHF', name: 'İSVİÇRE FRANGI', symbol: 'CHF/TRY' }
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
    })
    
    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('TCMB API Error:', error)
    
    // Return fallback data on error
    const fallbackData = [
      {
        symbol: 'USD/TRY',
        name: 'ABD DOLARI',
        price: 32.45,
        change: 0.15,
        changePercent: 0.46,
        forexBuying: 32.40,
        forexSelling: 32.50
      },
      {
        symbol: 'EUR/TRY',
        name: 'EURO',
        price: 35.12,
        change: -0.08,
        changePercent: -0.23,
        forexBuying: 35.08,
        forexSelling: 35.16
      },
      {
        symbol: 'GBP/TRY',
        name: 'İNGİLİZ STERLİNİ',
        price: 40.78,
        change: 0.22,
        changePercent: 0.54,
        forexBuying: 40.70,
        forexSelling: 40.86
      },
      {
        symbol: 'CHF/TRY',
        name: 'İSVİÇRE FRANGI',
        price: 36.91,
        change: -0.12,
        changePercent: -0.32,
        forexBuying: 36.85,
        forexSelling: 36.97
      }
    ]
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch TCMB data',
      data: fallbackData,
      timestamp: new Date().toISOString()
    })
  }
}