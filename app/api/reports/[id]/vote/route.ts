import { prisma } from '@/lib/prisma'
import { NextResponse, NextRequest } from 'next/server'

export async function POST(
  req: NextRequest,
  props: {
    params: Promise<{ id: string }>
  }
) {
  try {
    const json = await req.json()
    const { type } = json
    const ip = req.headers.get('x-forwarded-for') || 'unknown'
    const { id } = await props.params

    const vote = await prisma.vote.upsert({
      where: {
        fraudReportId_ipAddress: {
          fraudReportId: id,
          ipAddress: ip,
        },
      },
      update: { type },
      create: {
        fraudReportId: id,
        ipAddress: ip,
        type,
      },
    })

    return NextResponse.json(vote)
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}