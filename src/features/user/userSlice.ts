import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { users as initialUsers } from "../../data/mockData";

const initialState = {
  users: initialUsers,
  search: "",
  page: 1,
  sortKey: "id",
  sortOrder: "asc",
  deleteUserId: null as number | null,
};

const userSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    addUser: (state, action: PayloadAction<any>) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action: PayloadAction<any>) => {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter(
        (user) => user.id !== action.payload
      );
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    setSortKey: (state, action: PayloadAction<string>) => {
      state.sortKey = action.payload;
    },

    setSortOrder: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortOrder = action.payload;
    },

    setDeleteUserId: (
      state,
      action: PayloadAction<number | null>
    ) => {
      state.deleteUserId = action.payload;
    },
  },
});

export const {
  addUser,
  updateUser,
  deleteUser,
  setSearch,
  setPage,
  setSortKey,
  setSortOrder,
  setDeleteUserId,
} = userSlice.actions;

export default userSlice.reducer;