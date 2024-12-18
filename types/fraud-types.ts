export interface FraudReport {
    id: string
    createdAt: string
    type: 'email' | 'phone' | 'person'
    identifier: string
    description: string
    city?: string
    street?: string
    evidence?: string
    votes: Vote[]
    ipAddress: string
    verified: boolean
  }
  
  export interface Vote {
    id: string
    fraudReportId: string
    ipAddress: string
    createdAt: string
    type: 'UPVOTE' | 'DOWNVOTE'
  }
  