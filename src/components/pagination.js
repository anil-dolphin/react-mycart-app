import React, { useState } from "react";

function Pagination({
  activePage,
  totalItemsCount,
  itemsCountPerPage,
  pageRangeDisplayed,
  handleClick,
  component = "products",
}) {
  const [currenPage, setCurrentPage] = useState(activePage);

  const goToNextPage = () => {
    let number = currenPage + 1;
    setCurrentPage(currenPage + 1);
    handleClick(number);
  };

  const goToPrevData = () => {
    let number = currenPage - 1;
    setCurrentPage(currenPage - 1);
    handleClick(number);
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
    handleClick(1);
  };
  const goToLastPage = () => {
    setCurrentPage(totalItemsCount);
    handleClick(totalItemsCount);
  };
  const filterPages = (visiblePages, totalItemsCount) => {
    return visiblePages.filter((page) => page <= totalItemsCount);
  };

  const renderPage = (page, total) => {
    if (total < pageRangeDisplayed + 1) {
      return filterPages([1, 2, 3, 4, 5]);
    } else {
      if (page % pageRangeDisplayed >= 0 && page > 3 && page + 2 < total) {
        return [page - 2, page - 1, page, page + 1, page + 2];
      } else if (
        page % pageRangeDisplayed >= 0 &&
        page > 3 &&
        page + 2 >= total
      ) {
        return [total - 4, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5];
      }
    }
  };

  const paginationPage = renderPage(currenPage, totalItemsCount) || [];
  return (
    <div>
      {component === "products" && (
        <button
          type="button"
          className={`prev ${currenPage === 1 ? "disabled" : ""}`}
          onClick={() => goToFirstPage()}
        >
          {`<<<`}
        </button>
      )}
      <button
        type="button"
        className={`prev ${currenPage === 1 ? "disabled" : ""}`}
        onClick={() => goToPrevData()}
      >
        {`<`}
      </button>
      {component === "products" &&
        paginationPage.map((number) => {
          return (
            <button
              type="button"
              key={number}
              className={`paginationItem ${
                currenPage === number ? "active" : null
              }`}
              onClick={() => handleClick(number)}
            >
              {number}
            </button>
          );
        })}

      <button
        type="button"
        disabled={
          currenPage * itemsCountPerPage >= totalItemsCount ? true : false
        }
        onClick={() => goToNextPage()}
        className={`next ${
          currenPage * itemsCountPerPage >= totalItemsCount ? "disabled" : ""
        }`}
      >
        {`>`}
      </button>
      {component === "products" && (
        <button
          type="button"
          className={`prev ${currenPage === totalItemsCount ? "disabled" : ""}`}
          onClick={() => goToLastPage()}
        >
          {`>>>`}
        </button>
      )}
    </div>
  );
}
export default Pagination;
