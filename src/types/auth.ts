
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
  avatarUrl: string,
  createdAt: Date,
  updatedAt: Date,
  status: number,
}