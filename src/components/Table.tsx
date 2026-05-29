import React, { useReducer, useState, useMemo, useEffect } from "react";
import Pagination from "./Pagination";
import DeleteModal from "./DeleteModal";
import "./Table.css";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

type State = {
  users: User[];
};

type Action =
  | { type: "ADD"; payload: User }
  | { type: "DELETE"; payload: number }
  | { type: "UPDATE"; payload: User };

const initialUsers: User[] = [
  {
    id: 1,
    firstName: "Sasi",
    lastName: "Kaladhar",
    email: "sasi1704@gmail.com",
    phone: "9550980853",
    password: "sasi123"
  },
  {
    id: 2,
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahulsharma01@gmail.com",
    phone: "8678987653",
    password: "rahul123"
  },
  {
    id: 3,
    firstName: "Ananya",
    lastName: "Reddy",
    email: "ananyardy12@gmail.com",
    phone: "9834746463",
    password: "ananya123"
  },
  {
    id: 4,
    firstName: "Kiran",
    lastName: "Verma",
    email: "kiran2005@gmail.com",
    phone: "9908792625",
    password: "kiran123"
  },
  {
    id: 5,
    firstName: "Priya",
    lastName: "Singh",
    email: "priyasingh03@gmail.com",
    phone: "9177736845",
    password: "priya123"
  }
];

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD":
      return { users: [...state.users, action.payload] };

    case "DELETE":
      return { users: state.users.filter((u) => u.id !== action.payload) };

    case "UPDATE":
      return {
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        )
      };

    default:
      return state;
  }
}

export default function Table() {
  const [loading, setLoading] = useState(false);

  const simulateLoading = (callback: () => void) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, 800);
  };

  const [state, dispatch] = useReducer(
    reducer,
    { users: [] },
    () => {
      const saved = localStorage.getItem("users");
      return saved
        ? { users: JSON.parse(saved) }
        : { users: initialUsers };
    }
  );

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<keyof User>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuId(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(state.users));
  }, [state.users]);

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim();

    return state.users.filter((u) => {

      return (
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
      );
    });
  }, [search, state.users]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];

    data.sort((a, b) => {
      let valA: any;
      let valB: any;

      valA = a[sortKey];
      valB = b[sortKey];

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;

      return 0;
    });

    return data;
  }, [filteredData, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = sortedData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const toggleSort = (key: any) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedData.map((u) => u.id);
    const allSelected = pageIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !pageIds.includes(id))
      );
    } else {
      setSelectedIds((prev) => {
        const combined = [...prev, ...pageIds];
        return combined.filter(
          (id, index) => combined.indexOf(id) === index
        );
      });
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="container">
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <h2>User Dashboard</h2>

      <p className="desc">
        This dashboard provides a centralized view of all users, allowing efficient management of records through search, sorting, pagination, and CRUD operations. Users can be added, updated, and deleted through responsive modal forms with proper validation.
      </p>

      <div className="top-bar">
        <input
          className="search"
          placeholder="Search by name or email..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add New User
        </button>
      </div>
      <div className = "table-container">
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={paginatedData.every(u => selectedIds.includes(u.id))}
                onChange={toggleSelectAll}
              />
            </th>
            <th>S.No</th>
            <th className={sortKey === "id" ? "active-sort" : ""} onClick={() => toggleSort("id")}> ID {sortKey === "id" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th onClick={() => toggleSort("firstName")}>First Name {sortKey === "firstName" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th onClick={() => toggleSort("lastName")}>Last Name {sortKey === "lastName" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th onClick={() => toggleSort("email")}>Email {sortKey === "email" && (sortOrder === "asc" ? "↑" : "↓")}</th>
            <th>Phone</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
            {paginatedData.length === 0 ? (
            <tr>
            <td colSpan={8} className="empty-state">
                No Users found
            </td>
            </tr>
            )
            : (
            paginatedData.map((u) => (
            <tr key={u.id}>
                <td>
                <input
                    type="checkbox"
                    checked={selectedIds.includes(u.id)}
                    onChange={() => toggleSelect(u.id)}
                />
                </td>
                <td>{(page - 1) * rowsPerPage + paginatedData.indexOf(u) + 1}</td>
                <td>{u.id}</td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{"•".repeat(u.password?.length || 0)}</td>
                <td>
                <div className="menu-wrapper">
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(prev => prev === u.id ? null : u.id);
                }}
                >
                ⋮
                </button>

                {openMenuId === u.id && (
                <div className="menu">
                    <div onClick={() => {
                      setEditingUser(u);
                      setOpenMenuId(null);
                    }}>Edit</div>

                    <div
                    className="delete-option"
                    onClick={() => {
                      setDeleteUserId(u.id);
                      setOpenMenuId(null);
                  }}
                >
                Delete
                </div>
                </div>
                )}
                </div>
              </td>
            </tr>
            ))
            )}
        </tbody>
      </table>
      </div>

      <Pagination
       page={page}
       totalPages={totalPages}
       setPage={setPage}
       simulateLoading={simulateLoading}/>
       <DeleteModal
        deleteUserId={deleteUserId}
        setDeleteUserId={setDeleteUserId}
        simulateLoading={simulateLoading}
        dispatch={dispatch}/>

      {showModal && (
        <div className="modal">
          <div className="modal-box">
            <h3>Add User</h3>

            <label>First Name:</label>
            <input
              placeholder="First Name"
              onChange={(e) =>
                setNewUser({ ...newUser, firstName: e.target.value })
              }
            />

            <label>Last Name:</label>
            <input
              placeholder="Last Name"
              onChange={(e) =>
                setNewUser({ ...newUser, lastName: e.target.value })
              }
            />

            <label>Email:</label>
            <input
              placeholder="Email"
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
            />

            <label>Phone Number:</label>
            <input
              placeholder="Phone Number"
              onChange={(e) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Password"
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
            />

            <div className="modal-actions">
              <button
                onClick={() => {
                  if (!newUser.firstName.trim() || !newUser.lastName.trim()) {
                    alert("First Name and Last Name are required");
                    return;
                  }

                  if (!/^[A-Za-z\s]+$/.test(newUser.firstName)) {
                    alert("First Name should contain only letters");
                    return;
                  }

                  if (!/^[A-Za-z\s]+$/.test(newUser.lastName)) {
                    alert("Last Name should contain only letters");
                    return;
                  }

                  if (!newUser.email.trim()) {
                    alert("Email is required");
                    return;
                  }

                  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUser.email)) {
                    alert("Enter valid email");
                    return;
                  }

                  if (!/^[0-9]{10}$/.test(newUser.phone)) {
                    alert("Phone number must contain 10 digits");
                    return;
                  }

                  if (!newUser.password.trim()) {
                    alert("Password is required");
                    return;
                  }

                  simulateLoading(() => {
                    
                    dispatch({
                      type: "ADD",
                      payload: {
                      id: state.users.length ? Math.max(...state.users.map(u => u.id)) + 1 : 1,
                      firstName: newUser.firstName,
                      lastName: newUser.lastName,
                      email: newUser.email,
                      phone: newUser.phone,
                      password: newUser.password
                      }
                    });
                    setNewUser({
                     firstName: "",
                     lastName: "",
                     email: "",
                     phone: "",
                     password: ""
                    });
                    setShowModal(false);
                  });
                  }}>Save
              </button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="modal">
        <div className="modal-box">
        <h3>Edit User</h3>

        <label>First Name:</label>
        <input
            value={editingUser.firstName}
            onChange={(e) =>
            setEditingUser({ ...editingUser, firstName: e.target.value })
            }
        />

        <label>Last Name:</label>
        <input
          value={editingUser.lastName}
          onChange={(e) =>
          setEditingUser({ ...editingUser, lastName: e.target.value })
        }
        />

        <label>Email:</label>
        <input
          value={editingUser.email}
          onChange={(e) =>
            setEditingUser({ ...editingUser, email: e.target.value })
          }
        />

        <label>Phone:</label>
        <input
          value={editingUser.phone}
          onChange={(e) =>
            setEditingUser({ ...editingUser, phone: e.target.value })
          }
        />

        <label>Password:</label>
        <input
          type="password"
          value={editingUser.password}
          onChange={(e) =>
            setEditingUser({ ...editingUser, password: e.target.value })
          }
        />

       <div className="modal-actions">
        <button
          onClick={() => {
            if (!editingUser.firstName.trim() || !editingUser.lastName.trim()) {
              alert("First Name and Last Name are required");
              return;
            }

            if (!/^[A-Za-z\s]+$/.test(editingUser.firstName)) {
              alert("First Name should contain only letters");
              return;
            }

            if (!/^[A-Za-z\s]+$/.test(editingUser.lastName)) {
              alert("Last Name should contain only letters");
              return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editingUser.email)) {
              alert("Enter valid email");
              return;
            }

            if (!/^[0-9]{10}$/.test(editingUser.phone)) {
              alert("Phone number must contain 10 digits");
              return;
            }
              simulateLoading(() => {dispatch({type: "UPDATE",payload: editingUser});
              setEditingUser(null);
             });
           }}
        >
        Save
        </button>

        <button onClick={() => setEditingUser(null)}>Cancel</button>
       </div>
     </div>
   </div>
  )}
 </div>
 );
}