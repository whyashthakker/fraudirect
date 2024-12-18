// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from './lib/auth'

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Middleware checking path:', request.nextUrl.pathname)

    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next()
    }

    const token = request.cookies.get('admin_token')?.value
    console.log('Token found:', !!token)

    if (!token) {
      console.log('No token found, redirecting to login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const verified = await verifyAuth(token)
      if (!verified) {
        console.log('Invalid token, redirecting to login')
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (error) {
      console.log('Token verification failed:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*'
}