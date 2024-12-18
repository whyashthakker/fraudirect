// app/api/reports/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { cookies } from 'next/headers'
import { Prisma } from '@prisma/client'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token || !verifyJWT(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Get search parameters from URL
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const type = searchParams.get('type') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause for search with proper types
    const whereClause: Prisma.FraudReportWhereInput = {
      OR: [
        {
          identifier: {
            contains: query,
            mode: 'insensitive' as Prisma.QueryMode
          }
        },
        {
          description: {
            contains: query,
            mode: 'insensitive' as Prisma.QueryMode
          }
        },
        {
          city: {
            contains: query,
            mode: 'insensitive' as Prisma.QueryMode
          }
        },
        {
          street: {
            contains: query,
            mode: 'insensitive' as Prisma.QueryMode
          }
        }
      ],
      ...(type ? { type } : {})
    }

    // Get total count for pagination
    const total = await prisma.fraudReport.count({
      where: whereClause
    })

    // Get paginated results
    const reports = await prisma.fraudReport.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { votes: true },
      skip,
      take: limit
    })

    return NextResponse.json({
      success: true,
      data: reports,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search reports' },
      { status: 500 }
    )
  }
}