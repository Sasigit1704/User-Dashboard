import { configureStore } from "@reduxjs/toolkit"
import userReducer, { USERS_STORAGE_KEY } from "../features/user/userSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})

/**
 * Persist the user list whenever it changes. Centralising this here
 * (instead of inside a component effect) keeps persistence a store
 * concern and guarantees it runs for every mutation, from anywhere.
 */
let lastUsers = store.getState().user.users
store.subscribe(() => {
  const { users } = store.getState().user
  if (users !== lastUsers) {
    lastUsers = users
    try {
      window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch {
      // Ignore write failures (e.g. private mode / quota exceeded).
    }
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
