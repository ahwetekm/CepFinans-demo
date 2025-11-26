import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    // Fetch current currency data
    const currencyResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/currency`)
    const currencyResult = await currencyResponse.json()

    if (!currencyResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch current currency data'
      }, { status: 500 })
    }

    // Get user's investments
    const { data: investments, error: fetchError } = await supabaseAdmin
      .from('investments')
      .select('*')
      .eq('user_id', userId)

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch investments',
        details: fetchError.message
      }, { status: 500 })
    }

    if (!investments || investments.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No investments found to update',
        updatedCount: 0,
        timestamp: new Date().toISOString()
      })
    }

    // Update each investment with current values
    const updatePromises = investments.map(async (investment) => {
      const currencyData = currencyResult.data.find((c: any) => c.symbol === investment.currency)
      
      if (currencyData) {
        const currentValue = currencyData.price
        const totalCurrentValue = investment.amount * currentValue
        const totalBuyValue = investment.amount * investment.buy_price
        const profit = totalCurrentValue - totalBuyValue
        const profitPercent = totalBuyValue > 0 ? (profit / totalBuyValue) * 100 : 0

        return await supabaseAdmin
          .from('investments')
          .update({
            current_value: currentValue,
            profit: profit,
            profit_percent: profitPercent,
            updated_at: new Date().toISOString()
          })
          .eq('id', investment.id)
          .eq('user_id', userId)
      }
      return null
    })

    const results = await Promise.all(updatePromises)
    const successfulUpdates = results.filter(r => r !== null)

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${successfulUpdates.length} investments`,
      updatedCount: successfulUpdates.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Update investments error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}