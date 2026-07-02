import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import type { NewUser, SortableKey, User } from "../types/User"
import {
  addUser,
  setPage,
  setSearch,
  toggleSort,
  updateUser,
} from "../features/user/userSlice"
import Pagination from "./Pagination"
import DeleteModal from "./DeleteModal"
import UserFormModal from "./UserFormModal"
import "./Table.css"

const ROWS_PER_PAGE = 5
const MASKED_PASSWORD = "••••••••"

type SortColumn = { key: SortableKey; label: string }

const SORT_COLUMNS: SortColumn[] = [
  { key: "id", label: "ID" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
]

export default function Table() {
  const dispatch = useDispatch<AppDispatch>()

  const users = useSelector((state: RootState) => state.user.users)
  const search = useSelector((state: RootState) => state.user.search)
  const page = useSelector((state: RootState) => state.user.page)
  const sortKey = useSelector((state: RootState) => state.user.sortKey)
  const sortOrder = useSelector((state: RootState) => state.user.sortOrder)

  const [loading, setLoading] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const simulateLoading = (callback: () => void) => {
    setLoading(true)
    setTimeout(() => {
      callback()
      setLoading(false)
    }, 800)
  }

  // Close any open row menu when clicking elsewhere.
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const filteredData = useMemo(() => {
    const query = search.toLowerCase().trim()
    if (!query) return users
    return users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    )
  }, [search, users])

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey]
      const valB = b[sortKey]
      if (valA < valB) return sortOrder === "asc" ? -1 : 1
      if (valA > valB) return sortOrder === "asc" ? 1 : -1
      return 0
    })
  }, [filteredData, sortKey, sortOrder])

  const totalPages = Math.max(1, Math.ceil(sortedData.length / ROWS_PER_PAGE))

  // Keep the current page in range after deletes / filtering.
  useEffect(() => {
    if (page > totalPages) {
      dispatch(setPage(totalPages))
    }
  }, [page, totalPages, dispatch])

  const paginatedData = sortedData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  )

  const allOnPageSelected =
    paginatedData.length > 0 &&
    paginatedData.every((u) => selectedIds.includes(u.id))

  const toggleSelectAll = () => {
    const pageIds = paginatedData.map((u) => u.id)
    if (allOnPageSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleAdd = (values: NewUser) => {
    simulateLoading(() => {
      dispatch(addUser(values))
      setShowAddModal(false)
    })
  }

  const handleEdit = (values: NewUser) => {
    if (!editingUser) return
    simulateLoading(() => {
      dispatch(updateUser({ ...editingUser, ...values }))
      setEditingUser(null)
    })
  }

  return (
    <div className="container">
      {loading && (
        <div className="loader-overlay">
          <div className="spinner" />
        </div>
      )}

      <h2>User Dashboard</h2>

      <p className="desc">
        This dashboard provides a centralized view of all users, allowing
        efficient management of records through search, sorting, pagination, and
        CRUD operations. Users can be added, updated, and deleted through
        responsive modal forms with proper validation.
      </p>

      <div className="top-bar">
        <input
          className="search"
          type="search"
          aria-label="Search users by name or email"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />

        <button
          type="button"
          className="add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add New User
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  aria-label="Select all users on this page"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>S.No</th>

              {SORT_COLUMNS.map(({ key, label }) => {
                const isActive = sortKey === key
                return (
                  <th key={key} className={isActive ? "active-sort" : ""}
                  aria-sort={
                        isActive
                          ? sortOrder === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }>
                    <button
                      type="button"
                      className="sort-header"
                      
                      onClick={() => dispatch(toggleSort(key))}
                    >
                      {label}
                      {isActive && (sortOrder === "asc" ? " ↑" : " ↓")}
                    </button>
                  </th>
                )
              })}

              <th>Phone</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  No Users found
                </td>
              </tr>
            ) : (
              paginatedData.map((u, index) => (
                <tr key={u.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`Select ${u.firstName} ${u.lastName}`}
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleSelect(u.id)}
                    />
                  </td>
                  <td>{(page - 1) * ROWS_PER_PAGE + index + 1}</td>
                  <td>{u.id}</td>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  {/* Fixed-length mask so the real password length isn't leaked. */}
                  <td>{MASKED_PASSWORD}</td>
                  <td>
                    <div className="menu-wrapper">
                      <button
                        type="button"
                        aria-label={`Actions for ${u.firstName} ${u.lastName}`}
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === u.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          setOpenMenuId((prev) => (prev === u.id ? null : u.id))
                        }}
                      >
                        ⋮
                      </button>

                      {openMenuId === u.id && (
                        <div className="menu" role="menu">
                          <button
                            type="button"
                            role="menuitem"
                            className="menu-item"
                            onClick={() => {
                              setEditingUser(u)
                              setOpenMenuId(null)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            className="menu-item delete-option"
                            onClick={() => {
                              setDeleteUserId(u.id)
                              setOpenMenuId(null)
                            }}
                          >
                            Delete
                          </button>
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
        setPage={(value) => dispatch(setPage(value))}
        simulateLoading={simulateLoading}
      />

      <DeleteModal
        deleteUserId={deleteUserId}
        setDeleteUserId={setDeleteUserId}
        simulateLoading={simulateLoading}
        dispatch={dispatch}
      />

      {showAddModal && (
        <UserFormModal
          title="Add User"
          users={users}
          onCancel={() => setShowAddModal(false)}
          onSubmit={handleAdd}
        />
      )}

      {editingUser && (
        <UserFormModal
          title="Edit User"
          users={users}
          initialUser={editingUser}
          onCancel={() => setEditingUser(null)}
          onSubmit={handleEdit}
        />
      )}
    </div>
  )
}
