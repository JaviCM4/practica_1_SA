export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}