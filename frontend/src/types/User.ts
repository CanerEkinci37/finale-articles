export interface User {
    id: string;
    username: string;
    email: string;
  }

export interface UserCreate {
  username: string;
  email: string;
  password: string;
}

export interface UserRead {
  id: string;
  username: string;
  email: string;
}

export interface UserUpdate {
  username: string;
  email: string;
  password: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserSignup {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserState {
  user: UserRead | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}