import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function readClientSecrets() {
  // Prefer environment variables, fallback to local JSON file included in repo
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (clientId && clientSecret) return { clientId, clientSecret }

  try {
    const secretsPath = path.join(process.cwd(), 'client_secret_82522263410-1r4543pkh309ubperae8nt1vto3h9v5n.apps.googleusercontent.com.json')
    const raw = fs.readFileSync(secretsPath, 'utf8')
    const parsed = JSON.parse(raw)
    return {
      clientId: parsed?.web?.client_id,
      clientSecret: parsed?.web?.client_secret
    }
  } catch (e) {
    return { clientId: undefined, clientSecret: undefined }
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    if (!code) return NextResponse.json({ error: 'Missing code' }, { status: 400 })

    const { clientId, clientSecret } = await readClientSecrets()
    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Google client credentials not configured' }, { status: 500 })
    }

    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.BASE_URL || 'http://localhost:3000'
    const redirectUri = `${base}/api/auth/google/callback`

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })

    if (!tokenRes.ok) {
      const text = await tokenRes.text()
      return NextResponse.json({ error: 'Failed to exchange code', details: text }, { status: 500 })
    }

    const tokenData = await tokenRes.json()
    const { access_token, id_token } = tokenData
    if (!id_token && !access_token) {
      return NextResponse.json({ error: 'No tokens returned from Google' }, { status: 500 })
    }

    // Get user info from id_token (JWT) or userinfo endpoint
    let profile: any = null
    try {
      // Try userinfo endpoint
      if (access_token) {
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${access_token}` }
        })
        if (userRes.ok) profile = await userRes.json()
      }
    } catch (e) {
      // ignore
    }

    // Fallback: decode id_token
    if (!profile && id_token) {
      try {
        const decoded: any = jwt.decode(id_token)
        profile = {
          email: decoded?.email,
          name: decoded?.name,
          picture: decoded?.picture
        }
      } catch (e) {
        // ignore
      }
    }

    if (!profile || !profile.email) {
      return NextResponse.json({ error: 'Failed to obtain Google profile' }, { status: 500 })
    }

    // Upsert user in DB
    let user = await prisma.client.findUnique({ where: { email: profile.email } })
    if (!user) {
      // create a random password for the account (hashed)
      const randomPwd = Math.random().toString(36).slice(2)
      const hashed = await bcrypt.hash(randomPwd, 10)
      
      // Determine client name: prefer Google profile name, fall back to email prefix
      let clientName = profile.name
      if (!clientName || clientName.trim() === '') {
        clientName = profile.email.split('@')[0]
      }
      
      user = await prisma.client.create({
        data: {
          clientName,
          email: profile.email,
          password: hashed,
          adsAgree: false,
          emailVerified: true
        }
      })
    }

    // Issue same JWT as login
    const token = jwt.sign({ userId: user.clientID }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })

    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (err) {
    return NextResponse.json({ error: 'Google callback failed', details: String(err) }, { status: 500 })
  }
}
