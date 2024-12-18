import { verifyJWT } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// app/api/reports/types/route.ts
export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
  
    if (!token || !verifyJWT(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  
    try {
      // Get unique report types
      const types = await prisma.fraudReport.findMany({
        select: {
          type: true
        },
        distinct: ['type']
      })
  
      return NextResponse.json({
        success: true,
        data: types.map(t => t.type)
      })
    } catch (error) {
      console.error('Failed to fetch report types:', error)
      return NextResponse.json(
        { error: 'Failed to fetch report types' },
        { status: 500 }
      )
    }
  }