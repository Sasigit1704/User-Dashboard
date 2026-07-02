type Props = {
  page: number
  totalPages: number
  setPage: (page: number) => void
  simulateLoading: (callback: () => void) => void
}

export default function Pagination({
  page,
  totalPages,
  setPage,
  simulateLoading,
}: Props) {
  // Nothing to paginate.
  if (totalPages <= 1) return null

  const goTo = (target: number) => simulateLoading(() => setPage(target))

  return (
    <nav className="pagination" aria-label="Table pagination">
      <button
        type="button"
        onClick={() => goTo(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const pageNumber = i + 1
        const isCurrent = page === pageNumber
        return (
          <button
            key={pageNumber}
            type="button"
            className={isCurrent ? "active-page" : ""}
            aria-current={isCurrent ? "page" : undefined}
            onClick={() => goTo(pageNumber)}
          >
            {pageNumber}
          </button>
        )
      })}

      <button
        type="button"
        onClick={() => goTo(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </nav>
  )
}
