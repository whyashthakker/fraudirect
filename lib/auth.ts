// lib/auth.ts
import jwt from 'jsonwebtoken'
import * as jose from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

// For API routes (Node.js environment)
export function generateToken(email: string): string {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' })
}

export function verifyJWT(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

// For Edge runtime (middleware)
export async function verifyAuth(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}