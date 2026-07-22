import { NextRequest, NextResponse } from 'next/server'
import { getKlines, KlineInterval } from '@/lib/unified-market-api'

/**
 * 统一 K 线数据 API
 * 
 * GET /api/market/unified-klines?symbol=BTCUSDT&interval=1h&limit=100
 * 
 * Query Parameters:
 * - symbol: 交易对 (如 BTCUSDT, ETH-USDT, BTC)
 * - interval: 时间间隔 (1m, 5m, 15m, 1h, 4h, 1d, 1w)
 * - limit: 返回数量 (默认 100，最大 1000)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'BTCUSDT'
    const interval = (searchParams.get('interval') || '1h') as KlineInterval
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)

    // 验证 interval
    const validIntervals: KlineInterval[] = [
      '1m', '3m', '5m', '15m', '30m',
      '1h', '2h', '4h', '6h', '12h',
      '1d', '3d', '1w', '1M'
    ]
    
    if (!validIntervals.includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid interval', validIntervals },
        { status: 400 }
      )
    }

    // 获取 K 线数据
    const klines = await getKlines(symbol, interval, limit)

    return NextResponse.json({
      success: true,
      symbol,
      interval,
      count: klines.length,
      data: klines,
    })
  } catch (error) {
    console.error('Unified klines API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch klines' 
      },
      { status: 500 }
    )
  }
}
