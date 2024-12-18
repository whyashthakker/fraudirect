"use client";

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { FraudReport, Vote } from '@/types/fraud-types'

export function ReportList() {
  const [reports, setReports] = useState<FraudReport[]>([])
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports')
        const response = await res.json()
        
        if (!res.ok) {
          throw new Error(response.error || 'Failed to fetch reports')
        }
        
        setReports(response.data || [])
      } catch (err) {
        console.error('Failed to fetch reports:', err)
        setError('Failed to load reports')
      }
    }
    
    fetchReports()
  }, [])

  const handleVote = async (id: string, type: Vote['type']) => {
    try {
      await fetch(`/api/reports/${id}/vote`, {
        method: 'POST',
        body: JSON.stringify({ type }),
        headers: { 'Content-Type': 'application/json' },
      })
      // Refresh reports after voting
      const res = await fetch('/api/reports')
      const response = await res.json()
      
      if (!res.ok) {
        throw new Error(response.error || 'Failed to fetch reports')
      }
      
      setReports(response.data || [])
    } catch (err) {
      console.error('Failed to vote:', err)
    }
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    )
  }

  if (!reports.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No reports found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <Card key={report.id}>
          <CardHeader>
            <CardTitle>{report.type}: {report.identifier}</CardTitle>
            <CardDescription>{new Date(report.createdAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{report.description}</p>
            {report.city && <p>Location: {report.city}, {report.street}</p>}
          </CardContent>
          <CardFooter className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => handleVote(report.id, 'UPVOTE')}
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {report.votes.filter((v: Vote) => v.type === 'UPVOTE').length}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleVote(report.id, 'DOWNVOTE')}
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              {report.votes.filter((v: Vote) => v.type === 'DOWNVOTE').length}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}