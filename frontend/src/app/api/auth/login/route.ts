import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://127.0.0.1:8082'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const contentType = request.headers.get('content-type') || 'application/json'
    const backendRes = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
      },
      body: body || undefined,
    })
    const data = await backendRes.json().catch(() => ({ error: 'Invalid response from server' }))
    return NextResponse.json(data, { status: backendRes.status })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[auth/login] Backend request failed:', message)
    return NextResponse.json(
      { error: 'Cannot reach backend. Is it running on port 8082?' },
      { status: 503 }
    )
  }
}
