"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FraudReport } from '@/types/fraud-types'

export default function AdminDashboard() {
  const router = useRouter()
  const [reports, setReports] = useState<FraudReport[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports')
      const data = await res.json()

      if (!res.ok) {
        if (res.status === 401) {
          router.push('/admin/login')
          return
        }
        throw new Error(data.error)
      }

      setReports(data.data)
    } catch {
      setError('Failed to fetch reports')
    }
  }

  const handleVerification = async (id: string, verified: boolean) => {
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ verified }),
        headers: { 'Content-Type': 'application/json' }
      })

      if (!res.ok) {
        throw new Error('Failed to update report')
      }

      fetchReports()
    } catch {
      setError('Failed to update report')
    }
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{report.type}: {report.identifier}</CardTitle>
                <Badge variant={report.verified ? "default" : "secondary"}>
                  {report.verified ? 'Verified' : 'Pending'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{report.description}</p>
              {report.city && (
                <p className="text-sm text-gray-500">
                  Location: {report.city}, {report.street}
                </p>
              )}
              <div className="mt-4 space-x-2">
                <Button
                  variant={report.verified ? "outline" : "default"}
                  onClick={() => handleVerification(report.id, true)}
                  disabled={report.verified}
                >
                  Verify
                </Button>
                <Button
                  variant={!report.verified ? "outline" : "default"}
                  onClick={() => handleVerification(report.id, false)}
                  disabled={!report.verified}
                >
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}