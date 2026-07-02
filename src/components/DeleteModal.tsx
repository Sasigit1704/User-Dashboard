import type { AppDispatch } from "../app/store"
import { deleteUser } from "../features/user/userSlice"

type Props = {
  deleteUserId: number | null
  setDeleteUserId: (id: number | null) => void
  simulateLoading: (callback: () => void) => void
  dispatch: AppDispatch
}

export default function DeleteModal({
  deleteUserId,
  setDeleteUserId,
  simulateLoading,
  dispatch,
}: Props) {
  if (deleteUserId === null) return null

  const handleClose = () => setDeleteUserId(null)

  const handleConfirm = () => {
    simulateLoading(() => {
      dispatch(deleteUser(deleteUserId))
      setDeleteUserId(null)
    })
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={handleClose}
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3 id="delete-modal-title">Delete User</h3>

        <p>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </p>

        <div className="modal-actions">
          <button type="button" className="delete-btn" onClick={handleConfirm}>
            Delete
          </button>
          <button type="button" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
