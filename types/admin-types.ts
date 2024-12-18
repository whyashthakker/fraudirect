export interface AdminCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    error?: string;
  }