// app/api/admin/login/route.ts
import { NextResponse } from 'next/server'
import { generateToken } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    console.log('Login attempt:', { email }) // Debug log

    if (
      email.trim().toLowerCase() === process.env.ADMIN_EMAIL?.trim().toLowerCase() &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = generateToken(email)
      
      // Create a new response with the dashboard URL
      const response = NextResponse.json({
        success: true,
        redirectUrl: '/admin/dashboard'
      })

      // Set cookie in the response
      response.cookies.set({
        name: 'admin_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax'
        maxAge: 60 * 60 * 24 // 24 hours
      })

      console.log('Login successful, token generated') // Debug log
      return response
    }

    console.log('Invalid credentials') // Debug log
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}