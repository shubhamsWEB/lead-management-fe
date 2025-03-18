import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getPaginationRange } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  className,
}: PaginationProps) {
  // Get the range of page numbers to display
  const pageRange = getPaginationRange(currentPage, totalPages);

  return (
    <div className={cn("grid grid-cols-3 xs:grid-cols-1", className)}>
      {/* Items per page selector */}
      {itemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center text-sm text-gray-700">
          <span className="mr-2">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="rounded border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      )}

      {/* Page navigation */}
      <div className="flex">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300",
            currentPage === 1 
              ? "cursor-not-allowed" 
              : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          )}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Page buttons */}
        {pageRange.map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === 'number' ? (
              <button
                onClick={() => onPageChange(page)}
                className={cn(
                  "inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300",
                  page === currentPage
                    ? "z-10 bg-purple-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
                    : "text-gray-900 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                )}
              >
                {page}
              </button>
            ) : (
              // Ellipsis
              <span className="inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300">
                {page}
              </span>
            )}
          </React.Fragment>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={cn(
            "inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300",
            currentPage === totalPages || totalPages === 0
              ? "cursor-not-allowed"
              : "hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
          )}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}