import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyJWT } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function PATCH(
  request: NextRequest,
  props: {
    params: Promise<{ id: string }>
  }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  const { id } = await props.params

  if (!token || !verifyJWT(token)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { verified } = await request.json()
    const report = await prisma.fraudReport.update({
      where: { id },
      data: { verified }
    })
    return NextResponse.json({ success: true, data: report })
  } catch {
    return NextResponse.json(
      { error: 'Failed to update report' },
      { status: 500 }
    )
  }
}