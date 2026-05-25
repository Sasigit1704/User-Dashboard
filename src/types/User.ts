export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  age: number;
  updatedOn: string;
  status: "Pending" | "Accepted" | "Rejected";
};