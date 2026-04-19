import React from "react";

interface TableSkeletonProps {
  columnCount: number;
  rowCount?: number;
  showIndex?: boolean;
}

const SkeletonCell = ({ width = "w-3/4" }: { width?: string }) => (
  <div className={`h-3 ${width} bg-gray-100 dark:bg-gray-900 rounded animate-pulse`} />
);

const TableSkeleton = ({ columnCount, rowCount = 5, showIndex = false }: TableSkeletonProps) => {
  const totalCols = columnCount + (showIndex ? 1 : 0);
  const cellWidths = ["w-2/4", "w-3/4", "w-2/3", "w-1/2", "w-3/5"];

  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-gray-50 dark:border-gray-950">
          {Array.from({ length: totalCols }).map((_, colIndex) => {
            const isActionColumn = colIndex === totalCols - 1;
            const shouldShowInMobile = colIndex < 2 || isActionColumn;
            const mobileHiddenClass = shouldShowInMobile ? "" : "hidden sm:table-cell";
            const stickyClass = isActionColumn
              ? "sticky right-0 bg-white dark:bg-black sm:static"
              : "";
            return (
              <td key={colIndex} className={`${mobileHiddenClass} ${stickyClass} px-4 sm:px-6 py-5`}>
                <SkeletonCell width={cellWidths[(colIndex + rowIndex) % cellWidths.length]} />
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
