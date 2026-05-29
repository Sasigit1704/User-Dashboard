type Props = {
  deleteUserId: number | null;
  setDeleteUserId: (id: number | null) => void;
  simulateLoading: (callback: () => void) => void;
  dispatch: React.Dispatch<any>;
};

export default function DeleteModal({
  deleteUserId,
  setDeleteUserId,
  simulateLoading,
  dispatch
}: Props) {
  if (deleteUserId === null) return null;

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>Delete User</h3>

        <p>
          Are you sure you want to delete this user?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button className="delete-btn"
            onClick={() => {
              simulateLoading(() => {
                dispatch({
                  type: "DELETE",
                  payload: deleteUserId
                });

                setDeleteUserId(null);
              });
            }}
          >
            Delete
          </button>

          <button onClick={() => setDeleteUserId(null)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}