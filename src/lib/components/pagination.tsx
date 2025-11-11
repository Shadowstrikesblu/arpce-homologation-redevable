import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange, 
  maxVisiblePages = 5 
}: PaginationProps) => {
  // Normalisation et validation
  const safeCurrentPage = Math.max(1, currentPage);
  const safeTotalPages = Math.max(1, totalPages);
  const current = Math.min(safeCurrentPage, safeTotalPages);
  
  if (safeTotalPages <= 1) return null;

  const handlePrev = () => current > 1 && onPageChange(current - 1);
  const handleNext = () => current < safeTotalPages && onPageChange(current + 1);

  const getPageNumbers = () => {
    if (safeTotalPages <= maxVisiblePages) {
      return Array.from({ length: safeTotalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];
    
    // Calcul des bornes
    const left = Math.max(2, current - 1);
    const right = Math.min(safeTotalPages - 1, current + 1);
    
    // Ajouter le premier "..."
    if (left > 2) pages.push('...');
    
    // Ajouter les pages centrales
    for (let i = left; i <= right; i++) {
      if (i > 1 && i < safeTotalPages) {
        pages.push(i);
      }
    }
    
    // Ajouter le deuxième "..."
    if (right < safeTotalPages - 1) pages.push('...');
    
    // Ajouter la dernière page
    if (safeTotalPages > 1) pages.push(safeTotalPages);
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-1 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrev}
        disabled={current === 1}
        className="rounded-full"
      >
        <ChevronLeftIcon/>
      </Button>

      {pageNumbers.map((page, index) => 
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500 text-sm">
            ...
          </span>
        ) : (
          <Button
            key={`page-${page}`}
            variant={current === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page as number)}
            className="rounded-full"
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={current === safeTotalPages}
        className="rounded-full"

      >
        <ChevronRightIcon/>
      </Button>
    </div>
  );
};