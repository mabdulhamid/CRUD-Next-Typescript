// redux/store.ts

import { configureStore, createSlice, PayloadAction, createAsyncThunk, ThunkAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Action } from 'redux';

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  firstName: string;
  lastName: string;
  company: {
    name: string;
  };
  address: {
    address: string;
  };
}

interface UsersState {
  loading: boolean;
  users: User[];
  total: number;
  error: string | null;
}

interface UserState {
  selectedUser: User | null;
}

const initialState: UsersState = {
  loading: false,
  users: [],
  total: 0,
  error: null,
};

const initialUserState: UserState = {
  selectedUser: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    getUsersStart(state) {
      state.loading = true;
      state.error = null;
    },
    getUsersSuccess(state, action: PayloadAction<{ users: User[]; total: number }>) {
      state.loading = false;
      state.users = action.payload.users;
      state.total = action.payload.total;
    },
    getUsersFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    selectUser(state, action: PayloadAction<User>) {
      state.selectedUser = action.payload;
    },
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
  },
});

export const { getUsersStart, getUsersSuccess, getUsersFailure } = usersSlice.actions;
export const { selectUser, clearSelectedUser } = userSlice.actions;

export const fetchUsers = createAsyncThunk<void, { skip: number; limit: number }, { dispatch: AppDispatch, state: RootState }>(
  'users/fetchUsers',
  async ({ skip, limit }, { dispatch }) => {
    try {
      dispatch(getUsersStart());

      const response = await axios.get(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`);

      dispatch(getUsersSuccess({ users: response?.data.users, total: response?.data.total }));
    } catch (error: any) {
      dispatch(getUsersFailure(error.message));
    }
  }
);

export const deleteUserData = createAsyncThunk<void, number>(
  'users/deleteUserData',
  async (id) => {
    await axios.delete(`https://dummyjson.com/users/${id}`);
  }
);

export const updateUserData = createAsyncThunk<void, Partial<User>, { state: RootState }>(
  'users/updateUserData',
  async (updatedData, { getState }) => {
    const { selectedUser } = getState().user;
    if (!selectedUser) {
      throw new Error('No selected user found.');
    }

    const updatedUser = { ...selectedUser, ...updatedData };

    await axios.put(`https://dummyjson.com/users/${updatedUser.id}`, updatedUser);
  }
);

export const addUser = createAsyncThunk<void, User>(
  'users/addUser',
  async (user) => {
    await axios.post('https://dummyjson.com/users/add', user);
  }
);

const store = configureStore({
  reducer: {
    users: usersSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
