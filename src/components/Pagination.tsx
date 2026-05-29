type Props = {
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  simulateLoading: (callback: () => void) => void;
};

export default function Pagination({
  page,
  totalPages,
  setPage,
  simulateLoading
}: Props) {
  return (
    <div className="pagination">
      <button
        onClick={() =>
          simulateLoading(() => setPage(page - 1))
        }
        disabled={page === 1}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={page === i + 1 ? "active-page" : ""}
          onClick={() =>
            simulateLoading(() => setPage(i + 1))
          }
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() =>
          simulateLoading(() => setPage(page + 1))
        }
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}