import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/auth';
import { UserState, UserLogin, UserCreate } from '../types/User';

const initialState: UserState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (userLogin: UserLogin) => {
    const response = await authApi.login(userLogin);
    return response;
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userCreate: UserCreate) => {
    const response = await authApi.signup(userCreate);
    return response;
  }
);


// export const getCurrentUser = createAsyncThunk(
//   'auth/getCurrentUser',
//   async () => {
//     const response = await authApi.getCurrentUser();
//     return response.user;
//   }
// );

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.access_token;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 