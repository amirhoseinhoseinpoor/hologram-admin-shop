// Pagination.jsx
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import styled from "styled-components";

// Styled Components

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px 0 8px;
`;

const ButtonStyle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  margin: 0 6px;
  color: var(--c-muted);
  background-color: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-sm);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  svg {
    font-size: 15px;
  }

  &:hover:not(:disabled) {
    color: var(--c-primary);
    background-color: var(--c-primary-50);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

const PageNumber = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  margin: 0 3px;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => (props.$isCurrent ? "#fff" : "var(--c-text)")};
  background-color: ${(props) =>
    props.$isCurrent ? "var(--c-primary)" : "var(--c-surface)"};
  border: 1px solid
    ${(props) => (props.$isCurrent ? "var(--c-primary)" : "var(--c-border)")};
  border-radius: var(--r-sm);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$isCurrent ? "var(--c-primary-600)" : "var(--c-primary-50)"};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Pagination Component

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Function to generate the range of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum number of visible page numbers
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    // Adjust the start and end if near the beginning or end
    if (currentPage <= 3) {
      start = 1;
      end = Math.min(totalPages, maxVisible);
    } else if (currentPage + 2 >= totalPages) {
      start = Math.max(1, totalPages - (maxVisible - 1));
      end = totalPages;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <PaginationContainer>
      <ButtonStyle
        type="button"
        data-plain
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next Page"
      >
        <ArrowForwardIosIcon />
      </ButtonStyle>

      {/* Page Numbers */}
      <div style={{ direction: "ltr" }}>
        {pageNumbers.map((page) => (
          <PageNumber
            type="button"
            data-plain
            key={page}
            $isCurrent={page === currentPage}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
          >
            {page}
          </PageNumber>
        ))}
      </div>

      <ButtonStyle
        type="button"
        data-plain
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous Page"
      >
        <ArrowBackIosIcon />
      </ButtonStyle>
    </PaginationContainer>
  );
};

export default Pagination;
