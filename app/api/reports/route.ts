import { NextResponse } from 'next/server'
import { fraudReportSchema } from '@/lib/validation'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const body = fraudReportSchema.parse(json)
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    const report = await prisma.fraudReport.create({
      data: {
        ...body,
        ipAddress: ip,
      },
    })

    return NextResponse.json({ success: true, data: report })

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Error creating report:', error)
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const reports = await prisma.fraudReport.findMany({
      where: { verified: true },
      include: { votes: true },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ success: true, data: reports })
  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    )
  }
}