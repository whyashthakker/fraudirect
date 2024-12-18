"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)
      
        const formData = new FormData(e.currentTarget)
        
        try {
          const res = await fetch('/api/admin/login', {
            method: 'POST',
            body: JSON.stringify({
              email: formData.get('email'),
              password: formData.get('password')
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
      
          const data = await res.json()
          console.log('Login response:', data) // Debug log
      
          if (!res.ok) {
            throw new Error(data.error || 'Login failed')
          }
      
          if (data.success) {
            // Add a small delay to ensure cookie is set
            setTimeout(() => {
              router.push('/admin/dashboard')
            }, 100)
          }
        } catch (err) {
          console.error('Login error:', err)
          setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
          setIsLoading(false)
        }
      }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}