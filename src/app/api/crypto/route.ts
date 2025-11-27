import { NextRequest, NextResponse } from 'next/server'

interface CryptoItem {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: string
  marketCap: string
  icon?: string
}

interface CoinMarketCapResponse {
  status: {
    timestamp: string
    error_code: number
    error_message: string
    elapsed: number
    credit_count: number
  }
  data: Array<{
    id: number
    name: string
    symbol: string
    slug: string
    num_market_pairs: number
    date_added: string
    tags: string[]
    max_supply: number
    circulating_supply: number
    total_supply: number
    is_active: number
    platform: any
    cmc_rank: number
    is_fiat: number
    self_reported_circulating_supply: number
    self_reported_market_cap: number
    last_updated: string
    quote: {
      USD: {
        price: number
        volume_24h: number
        volume_change_24h: number
        percent_change_1h: number
        percent_change_24h: number
        percent_change_7d: number
        percent_change_30d: number
        percent_change_60d: number
        percent_change_90d: number
        market_cap: number
        market_cap_dominance: number
        fully_diluted_market_cap: number
        tvl: any
        last_updated: string
      }
    }
  }>
}

const CRYPTO_ICONS: Record<string, string> = {
  'BTC': 'text-orange-500',
  'ETH': 'text-blue-500',
  'BNB': 'text-yellow-500',
  'SOL': 'text-purple-500',
  'XRP': 'text-gray-600',
  'ADA': 'text-blue-600',
  'DOGE': 'text-amber-500',
  'DOT': 'text-pink-500',
  'MATIC': 'text-purple-600',
  'AVAX': 'text-red-500'
}

function formatLargeNumber(num: number): string {
  if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T'
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B'
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
  return num.toFixed(2)
}

async function fetchCryptoData(): Promise<CryptoItem[]> {
  const apiKey = process.env.COINMARKETCAP_API_KEY
  
  if (!apiKey || apiKey === 'your_coinmarketcap_api_key_here') {
    console.warn('CoinMarketCap API key not configured, using fallback data')
    return getFallbackData()
  }

  try {
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: CoinMarketCapResponse = await response.json()
    
    if (data.status.error_code !== 0) {
      throw new Error(`CoinMarketCap API error: ${data.status.error_message}`)
    }

    return data.data.slice(0, 10).map(coin => ({
      symbol: coin.symbol,
      name: coin.name,
      price: coin.quote.USD.price,
      change: coin.quote.USD.price * (coin.quote.USD.percent_change_24h / 100),
      changePercent: coin.quote.USD.percent_change_24h,
      volume: formatLargeNumber(coin.quote.USD.volume_24h),
      marketCap: formatLargeNumber(coin.quote.USD.market_cap),
      icon: CRYPTO_ICONS[coin.symbol] || 'text-gray-500'
    }))
  } catch (error) {
    console.error('Error fetching crypto data:', error)
    return getFallbackData()
  }
}

function getFallbackData(): CryptoItem[] {
  return [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 67234.50,
      change: 1250.30,
      changePercent: 1.89,
      volume: '28.5B',
      marketCap: '1.31T',
      icon: 'text-orange-500'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 3456.78,
      change: -45.20,
      changePercent: -1.29,
      volume: '15.2B',
      marketCap: '415.2B',
      icon: 'text-blue-500'
    },
    {
      symbol: 'BNB',
      name: 'Binance Coin',
      price: 567.89,
      change: 12.45,
      changePercent: 2.24,
      volume: '1.8B',
      marketCap: '87.3B',
      icon: 'text-yellow-500'
    },
    {
      symbol: 'SOL',
      name: 'Solana',
      price: 145.67,
      change: 8.92,
      changePercent: 6.52,
      volume: '2.3B',
      marketCap: '65.8B',
      icon: 'text-purple-500'
    }
  ]
}

export async function GET(request: NextRequest) {
  try {
    const cryptoData = await fetchCryptoData()
    
    return NextResponse.json({
      success: true,
      data: cryptoData,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Crypto API error:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch crypto data',
      data: getFallbackData()
    }, { status: 500 })
  }
}