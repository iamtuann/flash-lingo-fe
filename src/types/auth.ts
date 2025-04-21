
export interface AuthResponse {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  avatarUrl: string,
  token: string,
}

export interface User {
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  avatarUrl?: string,
  username: string,
  dob: string,
  bio: string,
  createdAt: Date,
  updatedAt: Date,
  status: number,
  provider: 'System' | 'Google',
  topicsNumber: number
}

export interface UserRequest {
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  dob?: string,
  bio?: string,
}