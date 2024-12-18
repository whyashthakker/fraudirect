"use client";

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ReportForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [type, setType] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset()
      setType('')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const formObject = Object.fromEntries(formData)
      
      const payload = {
        ...formObject,
        type
      }

      const res = await fetch('/api/reports', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit report')
      }

      setSuccess(true)
      resetForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearMessages = () => {
    setError('')
    setSuccess(false)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <Select 
        value={type} 
        onValueChange={(value) => {
          setType(value)
          clearMessages()
        }} 
        required
      >
        <SelectTrigger>
          <SelectValue placeholder="Select type of report" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="person">Person</SelectItem>
        </SelectContent>
      </Select>

      <Input 
        name="identifier" 
        placeholder="Email/Phone/Name" 
        required 
        onChange={clearMessages}
      />
      <Textarea 
        name="description" 
        placeholder="Description of fraudulent activity" 
        required 
        onChange={clearMessages}
      />
      <Input 
        name="city" 
        placeholder="City (optional)" 
        onChange={clearMessages}
      />
      <Input 
        name="street" 
        placeholder="Street (optional)" 
        onChange={clearMessages}
      />
      <Input 
        name="evidence" 
        placeholder="Evidence links (optional)" 
        onChange={clearMessages}
      />

      <Button 
        type="submit" 
        disabled={!type || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>Report submitted successfully!</AlertDescription>
        </Alert>
      )}
    </form>
  )
}