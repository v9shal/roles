import { createSlice,  } from '@reduxjs/toolkit';

interface AuthState {
  username: string | null;
  role: string | null;
  token:String|null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: null,
  role: null,
  token:null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      state.token=action.payload.token;
    },
    clearCredentials: (state) => {
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
      state.token=null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
