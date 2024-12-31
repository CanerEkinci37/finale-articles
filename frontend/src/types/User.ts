export interface User {
  id: string;
  username: string;
  email: string;
  hashed_password: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  password?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserSignUp {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}



