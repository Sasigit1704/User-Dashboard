import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/User";

type UserState = {
  users: User[];
  search: string;
  page: number;
  sortKey: string;
  sortOrder: "asc" | "desc";
  deleteUserId: number | null;
};

const initialState: UserState = {
  users: [],
  search: "",
  page: 1,
  sortKey: "id",
  sortOrder: "asc",
  deleteUserId: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },

    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(
        (user: User) => user.id !== action.payload
      );
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.map((user: User) =>
        user.id === action.payload.id ? action.payload : user
      );
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setSort: (
      state,
      action: PayloadAction<{
        sortKey: string;
        sortOrder: "asc" | "desc";
      }>
    ) => {
      state.sortKey = action.payload.sortKey;
      state.sortOrder = action.payload.sortOrder;
    },

    setDeleteUserId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.deleteUserId = action.payload;
    },

    setSortKey: (state, action: PayloadAction<string>) => {
      state.sortKey = action.payload;
    },

    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },
  },
});

export const {
  setUsers,
  addUser,
  deleteUser,
  updateUser,
  setSearch,
  setPage,
  setSortKey,
  setSortOrder,
  setDeleteUserId,
} = userSlice.actions;

export default userSlice.reducer;