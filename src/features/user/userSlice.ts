import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { NewUser, SortableKey, SortOrder, User } from "../../types/User"
import { initialUsers } from "../../data/initialUsers"

const STORAGE_KEY = "users"

/**
 * Rehydrate the user list from localStorage. Falls back to the seed
 * data on the very first run or if the stored value is corrupt.
 */
function loadUsers(): User[] {
  if (typeof window === "undefined") return initialUsers
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return initialUsers
    const parsed = JSON.parse(raw) as User[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialUsers
  } catch {
    return initialUsers
  }
}

type UserState = {
  users: User[]
  search: string
  page: number
  sortKey: SortableKey
  sortOrder: SortOrder
}

const initialState: UserState = {
  users: loadUsers(),
  search: "",
  page: 1,
  sortKey: "id",
  sortOrder: "asc",
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },

    addUser: (state, action: PayloadAction<NewUser>) => {
      const nextId = state.users.length
        ? Math.max(...state.users.map((u) => u.id)) + 1
        : 1
      state.users.push({ id: nextId, ...action.payload })
    },

    deleteUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.map((user) =>
        user.id === action.payload.id ? action.payload : user
      )
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
      // Any new search must start from the first page.
      state.page = 1
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.page = Math.max(1, action.payload)
    },

    toggleSort: (state, action: PayloadAction<SortableKey>) => {
      if (state.sortKey === action.payload) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc"
      } else {
        state.sortKey = action.payload
        state.sortOrder = "asc"
      }
    },
  },
})

export const {
  setUsers,
  addUser,
  deleteUser,
  updateUser,
  setSearch,
  setPage,
  toggleSort,
} = userSlice.actions

export const USERS_STORAGE_KEY = STORAGE_KEY
export default userSlice.reducer
