import type { User } from "../types/User"

/**
 * Seed data used the first time the app runs (i.e. when nothing has
 * been persisted to localStorage yet). Kept out of the component so
 * the UI layer stays free of hard-coded records.
 */
export const initialUsers: User[] = [
  {
    id: 1,
    firstName: "Sasi",
    lastName: "Kaladhar",
    email: "sasi1704@gmail.com",
    phone: "9550980853",
    password: "sasi123",
  },
  {
    id: 2,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahulsharma01@gmail.com",
    phone: "8678987653",
    password: "rahul123",
  },
  {
    id: 3,
    firstName: "Ananya",
    lastName: "Reddy",
    email: "ananyardy12@gmail.com",
    phone: "9834746463",
    password: "ananya123",
  },
  {
    id: 4,
    firstName: "Kiran",
    lastName: "Verma",
    email: "kiran2005@gmail.com",
    phone: "9908792625",
    password: "kiran123",
  },
  {
    id: 5,
    firstName: "Priya",
    lastName: "Singh",
    email: "priyasingh03@gmail.com",
    phone: "9177736845",
    password: "priya123",
  },
]
