"use client";

import { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ValidationError {
  path: (string | number)[];
  message: string;
}

export function ReportForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)
  const [type, setType] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetForm = () => {
    if (formRef.current) {
      formRef.current.reset()
      setType('')
    }
  }

  const formatValidationErrors = (validationErrors: ValidationError[]) => {
    const formattedErrors: Record<string, string> = {}
    validationErrors.forEach((error) => {
      const field = error.path[0] as string
      formattedErrors[field] = error.message
    })
    return formattedErrors
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
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
        if (data.validationErrors) {
          setErrors(formatValidationErrors(data.validationErrors))
        } else {
          setErrors({ form: data.error || 'Failed to submit report' })
        }
        return
      }

      setSuccess(true)
      resetForm()
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearMessages = () => {
    setErrors({})
    setSuccess(false)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Select 
          value={type} 
          onValueChange={(value) => {
            setType(value)
            clearMessages()
          }} 
          required
        >
          <SelectTrigger className={errors.type ? "border-red-500" : ""}>
            <SelectValue placeholder="Select type of report" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="person">Person</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <p className="text-sm text-red-500">{errors.type}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input 
          name="identifier" 
          placeholder="Email/Phone/Name" 
          required 
          onChange={clearMessages}
          className={errors.identifier ? "border-red-500" : ""}
        />
        {errors.identifier && (
          <p className="text-sm text-red-500">{errors.identifier}</p>
        )}
      </div>

      <div className="space-y-2">
        <Textarea 
          name="description" 
          placeholder="Description of fraudulent activity" 
          required 
          onChange={clearMessages}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input 
          name="city" 
          placeholder="City (optional)" 
          onChange={clearMessages}
          className={errors.city ? "border-red-500" : ""}
        />
        {errors.city && (
          <p className="text-sm text-red-500">{errors.city}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input 
          name="street" 
          placeholder="Street (optional)" 
          onChange={clearMessages}
          className={errors.street ? "border-red-500" : ""}
        />
        {errors.street && (
          <p className="text-sm text-red-500">{errors.street}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input 
          name="evidence" 
          placeholder="Evidence links (optional)" 
          onChange={clearMessages}
          className={errors.evidence ? "border-red-500" : ""}
        />
        {errors.evidence && (
          <p className="text-sm text-red-500">{errors.evidence}</p>
        )}
      </div>

      <Button 
        type="submit" 
        disabled={!type || isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </Button>

      {errors.form && (
        <Alert variant="destructive">
          <AlertDescription>{errors.form}</AlertDescription>
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