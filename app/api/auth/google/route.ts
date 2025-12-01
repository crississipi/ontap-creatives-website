import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'

    let clientId = process.env.GOOGLE_CLIENT_ID

    if (!clientId) {
      // attempt to read client secrets from repository file if env not set
      try {
        const secretsPath = path.join(process.cwd(), 'client_secret_82522263410-1r4543pkh309ubperae8nt1vto3h9v5n.apps.googleusercontent.com.json')
        const raw = fs.readFileSync(secretsPath, 'utf8')
        const parsed = JSON.parse(raw)
        clientId = parsed?.web?.client_id
      } catch (e) {
        // ignore
      }
    }

    if (!clientId) {
      return NextResponse.json({ error: 'Google client_id not configured' }, { status: 500 })
    }

    const redirectUri = `${base}/api/auth/google/callback`

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent'
    })

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    return NextResponse.redirect(authUrl)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to start Google OAuth' }, { status: 500 })
  }
}
