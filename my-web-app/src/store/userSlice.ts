import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  username: string;
  password: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  username: '',
  password: '',
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    // Add any other reducers you have in the user slice
  },
});

export const { setUsername, setPassword } = userSlice.actions;

export default userSlice.reducer;
