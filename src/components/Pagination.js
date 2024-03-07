function Pagination({ totalPages, paginate, currentPage }) {
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const goToNextPage = () => {
    if (hasNextPage) {
      paginate(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (hasPreviousPage) {
      paginate(currentPage - 1);
    }
  };

  return (
    <nav>
      <ul className="pagination justify-content-center">
        <li className={`page-item ${hasPreviousPage ? "" : "disabled"}`}>
          <button className="page-link" onClick={goToPreviousPage}>
            &laquo; Previous
          </button>
        </li>
        <li className={`page-item ${hasNextPage ? "" : "disabled"}`}>
          <button className="page-link" onClick={goToNextPage}>
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
