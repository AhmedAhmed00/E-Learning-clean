// components/shared/pagination/Pagination.jsx
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ITEMS_PER_PAGE } from "@/lib/constant/constant-utils";
import { cn } from "@/lib/utils";
import useURLParams from "@/hooks/useURLParams";

interface PaginationProps {
  totalItems: number;
  className?: string;
}

const Pagination = ({ totalItems, className = "" }: PaginationProps) => {
  const { params, setParam } = useURLParams<{ page: string }>({
    page: "",
  });
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const currentPage = parseInt(params.page) || 1;
  const hasNext = currentPage < totalPages;
  const hasPrevious = currentPage > 1;

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setParam("page", page.toString());
    }
  };

  // Handle next page
  const handleNext = () => {
    if (hasNext) {
      handlePageChange(currentPage + 1);
    }
  };

  // Handle previous page
  const handlePrevious = () => {
    if (hasPrevious) {
      handlePageChange(currentPage - 1);
    }
  };

  // Auto-adjust page if current page exceeds total pages or if no next page available
  useEffect(() => {
    if (totalPages === 0) return;

    // If current page exceeds total pages, go to last page
    if (currentPage > totalPages) {
      setParam("page", totalPages.toString());
    }
    // If we're on page 2+ but there are no items that would require this page, go to page 1
    else if (currentPage > 1 && totalItems <= ITEMS_PER_PAGE) {
      setParam("page", "1");
    }
  }, [currentPage, totalPages, totalItems, ITEMS_PER_PAGE, setParam]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        startPage = 2;
        endPage = 4;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
        endPage = totalPages - 1;
      }

      // Add ellipsis if there's a gap
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis if there's a gap
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (totalPages < 1) return null;

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 bg-white sm:px-6",
        className
      )}
    >
      {/* Mobile view */}
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={!hasNext}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between ">
        <div>
          <nav
            className="isolate inline-flex -space-x-px  flex-row-reverse"
            aria-label="Pagination"
          >
            {/* Previous button */}
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="relative inline-flex items-center  p-2 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {/* Page numbers */}
            {pageNumbers.map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                disabled={page === "..."}
                className={` text-gray relative rounded-md inline-flex items-center justify-center text-center w-[32px] h-[32px] text-sm ${
                  page === currentPage
                    ? "z-10 border border-primary text-primary"
                    : " focus:z-20 focus:outline-offset-0 border-0"
                }`}
              >
                {page}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="relative inline-flex items-center  p-2 text-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
