import React, { useState, useEffect, useImperativeHandle, forwardRef, useRef, useCallback } from "react";
import { 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  Filter, 
  Plus,
  Search
} from "lucide-react";
import type { Params, Pagination } from "../types";
import FilterModal from "../modals/FilterModal";
import TableSkeleton from "./TableSkeleton";

interface MTableProps<T> {
  columns: {
    field: string;
    header: string;
    render?: (rowData: T) => React.ReactNode;
    renderHeader?: () => React.ReactNode;
    filterable?: boolean;
    sortable?: boolean;
    filterType?: 'text' | 'number' | 'date';
  }[];
  getData: (params: Params) => Promise<any>;
  onAddData?: () => void;
  showIndex?: boolean;
  enableFilter?: boolean;
  buttonText?: string;
  placeholderSearch?: string;
  enableSearch?: boolean;
  enableButton?: boolean;
  title: string;
  selectRow?: boolean;
  onRowClick?: (row: T) => void;
  onSort?: (col: T) => void;
  selectedRow?: T;
  filterDefault?: string;
  isModal?: boolean;
  excludedFields?: string[];
}

const MTable = forwardRef<any, MTableProps<any>>(
  (
    {
      columns,
      getData,
      onAddData,
      showIndex = false,
      enableFilter = true,
      buttonText = "",
      placeholderSearch = "",
      enableSearch = true,
      enableButton = false,
      title,
      selectRow = false,
      selectedRow,
      onRowClick,
      filterDefault = "",
      isModal = false,
      excludedFields,
    }: MTableProps<any>,
    ref
  ) => {
    interface FilterItem {
      field: string;
      operator: string;
      value: string;
    }
    const [data, setData] = useState<Pagination>();
    const filterButtonRef = useRef<HTMLButtonElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const [params, setParams] = useState<Params>({
      page: 1,
      per_page: 10,
      search: "",
      order: [],
      direction: [],
      between: "",
      filter: "",
      filterAnd: "",
      filterExact: "",
      filterAndNegative: "",
    });
    const [search, setSearch] = useState<string>("");
    const [page, setPage] = useState<number>(1);

    const currentPage = data?.data?.length ? data.current_page ?? 0 : 0;
    const showFrom = data?.data?.length ? data.from : 0;

    const fetchData = useCallback(async () => {
      setIsLoading(true);
      const order = Array.isArray(params.order) ? params.order.join(',') : params.order;
      const direction = Array.isArray(params.direction) ? params.direction.join(',') : params.direction;
      setData(undefined);
      try {
        const result = await getData({ ...params, order, direction });
        setData(result || null);
      } catch (error) {
        console.error("Failed to fetch MTable data", error);
      } finally {
        setIsLoading(false);
      }
    }, [params, getData]);

    const incrementPage = (p: number | null) => {
      if (p === null || p > (data?.total_pages ?? Infinity)) return;
      setPage(p);
      setParams({ ...params, page: p });
    };

    const decrementPage = (p: number) => {
      if (p < 1) return;
      setPage(p);
      setParams({ ...params, page: p });
    };

    const onSort = (field: string) => {
      let orderArr = Array.isArray(params.order) ? [...params.order] : params.order ? (params.order as string).split(',') : [];
      let dirArr = Array.isArray(params.direction) ? [...params.direction] : params.direction ? (params.direction as string).split(',') : [];
      const idx = orderArr.indexOf(field);
      if (idx === -1) {
        orderArr.push(field);
        dirArr.push('asc');
      } else {
        if (dirArr[idx] === 'asc') {
          dirArr[idx] = 'desc';
        } else {
          orderArr.splice(idx, 1);
          dirArr.splice(idx, 1);
        }
      }
      setParams({ ...params, order: orderArr, direction: dirArr, page: 1 });
    };

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearch(val);
      // Simple debounce
      const timeoutId = setTimeout(() => {
        setParams(prev => ({ ...prev, search: val, page: 1 }));
      }, 1000);
      return () => clearTimeout(timeoutId);
    };

    useImperativeHandle(ref, () => ({
      reloadData: fetchData,
    }));

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    useEffect(() => {
      setParams((prevParams) => ({
        ...prevParams,
        filter: filterDefault,
      }));
    }, [filterDefault]);

    return (
      <>
        <FilterModal
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters: FilterItem[]) => {
            const equalsFilters = filters.filter(f => f.operator === 'equals');
            const notEqualsFilters = filters.filter(f => f.operator === 'not_equals');
            const containsFilters = filters.filter(f => f.operator === 'contains');
            const filterStr = containsFilters.map(f => `${f.field}:${f.value}`).join(",");
            const filterAndNegativeStr = notEqualsFilters.map(f => `${f.field}:${f.value}`).join(",");
            const filterAndStr = equalsFilters.map(f => `${f.field}:${f.value}`).join(",");
            setParams({ ...params, filter: filterStr, filterAndNegative: filterAndNegativeStr, filterExact: filterAndStr, page: 1 });
          }}
          fields={columns
            .filter((col) => col.filterable !== false)
            .filter((col) => !excludedFields || !excludedFields.length || !excludedFields.includes(col.field))
            .map((col) => ({ label: col.header, value: col.field, type: col.filterType }))}
          filterButtonRef={filterButtonRef}
        />

        <div className={`h-full ${!isModal && "sm:p-6 p-4"}`}>
          {title && <h4 className="text-lg sm:text-2xl font-bold text-black dark:text-white mb-6 sm:mb-8 tracking-tight uppercase tracking-[0.2em]">{title}</h4>}
          <div>
            <div className="flex flex-col">
              {/* Search & Filter Controls */}
              <div className="mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex flex-col flex-1">
                  {enableSearch && (
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
                      <input
                        type="text"
                        id="search"
                        value={search}
                        onChange={onChangeSearch}
                        placeholder={placeholderSearch || "Cari..."}
                        className="w-full pl-11 pr-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white transition-all shadow-sm font-bold uppercase tracking-widest outline-none"
                      />
                    </div>
                  )}
                </div>
                {enableFilter && (
                  <button
                    ref={filterButtonRef}
                    onClick={() => setIsFilterOpen(true)}
                    className="w-full sm:w-auto gap-2 px-4 sm:px-5 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center cursor-pointer bg-white dark:bg-gray-900 text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </button>
                )}
                {enableButton && (
                  <button
                    onClick={onAddData}
                    type="button"
                    className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:opacity-80 font-black text-[10px] uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{buttonText}</span>
                  </button>
                )}
              </div>

              {/* Table Container */}
              <div className="bg-white dark:bg-black rounded-xl shadow-lg border border-gray-100 dark:border-gray-900 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900">
                      <tr className="text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em]">
                        {showIndex && <th className="px-4 sm:px-6 py-4 whitespace-nowrap">No</th>}
                        {columns.map((col, index) => {
                          const isActionColumn = index === columns.length - 1;
                          const shouldShowInMobile = index < 2 || isActionColumn;
                          const mobileHiddenClass = shouldShowInMobile ? '' : 'hidden sm:table-cell';
                          const stickyClass = isActionColumn ? 'sticky right-0 bg-gray-50 dark:bg-gray-950 sm:static' : '';

                          if (col.sortable) {
                            let orderArr = Array.isArray(params.order) ? params.order : params.order ? (params.order as string).split(',') : [];
                            let dirArr = Array.isArray(params.direction) ? params.direction : params.direction ? (params.direction as string).split(',') : [];
                            const sortIdx = orderArr.indexOf(col.field);
                            const isSorted = sortIdx !== -1;
                            return (
                              <th key={index} className={`${mobileHiddenClass} ${stickyClass} px-4 sm:px-6 py-4 whitespace-nowrap`}>
                                <div
                                  className={`flex items-center ${col.sortable ? 'cursor-pointer hover:text-black dark:hover:text-white' : ''} transition-colors`}
                                  onClick={() => col.sortable && onSort(col.field)}
                                >
                                  <span className="block">{col.renderHeader ? col.renderHeader() : col.header}</span>
                                  {col.sortable && isSorted && (
                                    <span className="flex items-center ml-2 text-black dark:text-white">
                                      {dirArr[sortIdx] === 'asc' ? (
                                        <ChevronDown className="w-4 h-4" strokeWidth={2.5} />
                                      ) : (
                                        <ChevronUp className="w-4 h-4" strokeWidth={2.5} />
                                      )}
                                      <span className="ml-1 text-[8px] font-black bg-black dark:bg-white text-white dark:text-black rounded-full w-4 h-4 flex items-center justify-center">{sortIdx + 1}</span>
                                    </span>
                                  )}
                                </div>
                              </th>
                            );
                          } else {
                            return (
                              <th key={index} className={`${mobileHiddenClass} ${stickyClass} px-4 sm:px-6 py-4 whitespace-nowrap`}>
                                {col.renderHeader ? col.renderHeader() : col.header}
                              </th>
                            );
                          }
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading && (
                        <TableSkeleton
                          columnCount={columns.length}
                          rowCount={params.per_page || 10}
                          showIndex={showIndex}
                        />
                      )}
                      {!isLoading && data?.data?.map((row: any, rowIndex: number) => {
                        const globalIndex = (data?.from ?? 0) + rowIndex;
                        const uniqueKey = `row-${globalIndex}`;
                        return (
                          <tr
                            key={uniqueKey}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`border-b border-gray-50 dark:border-gray-950 transition-colors ${
                              selectRow ? 'cursor-pointer' : ''
                            }${
                              (selectedRow?.id ?? selectedRow?._id) === (row.id ?? row._id)
                                ? ' bg-gray-50 dark:bg-gray-900'
                                : ' hover:bg-gray-50/50 dark:hover:bg-gray-900/50'
                            }`}
                          >
                            {showIndex && <td className="px-4 sm:px-6 py-4 text-xs whitespace-nowrap text-gray-500 font-mono font-bold">{(data?.from ?? 0) + rowIndex}</td>}
                            {columns.map((col, colIndex) => {
                              const isActionColumn = colIndex === columns.length - 1;
                              const shouldShowInMobile = colIndex < 2 || isActionColumn;
                              const mobileHiddenClass = shouldShowInMobile ? '' : 'hidden sm:table-cell';
                              const stickyClass = isActionColumn ? 'sticky right-0 bg-white dark:bg-black sm:static' : '';
                              const value = (row as any)[col.field ?? ""];
                              return (
                                <td key={colIndex} className={`${mobileHiddenClass} ${stickyClass} px-4 sm:px-6 py-4 text-black dark:text-gray-200 text-xs whitespace-nowrap font-medium`}>
                                  {col.render ? col.render(row) : value ? value : <span className="text-gray-300 dark:text-gray-700">-</span>}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                      {!isLoading && (!data?.data || data?.data.length === 0) && (
                        <tr>
                          <td colSpan={columns.length + (showIndex ? 1 : 0)}>
                            <div className="flex justify-center items-center py-20" style={{ minHeight: "300px" }}>
                              <div className="text-center">
                                <Filter className="w-12 h-12 mx-auto mb-4 text-gray-200 dark:text-gray-800" strokeWidth={1} />
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Data tidak ditemukan</h3>
                                <p className="text-[9px] text-gray-300 dark:text-gray-700 italic uppercase">Data belum tersedia atau tidak sesuai dengan filter</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-4 sm:px-6 py-4 border-t border-gray-100 dark:border-gray-900 bg-gray-50 dark:bg-gray-950">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Menampilkan <span className="font-black text-black dark:text-white">{showFrom}</span> - <span className="font-black text-black dark:text-white">{data?.to}</span> dari <span className="font-black text-black dark:text-white">{data?.total}</span> data
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
                      <div className="flex items-center gap-2">
                        <label htmlFor="per_page" className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest whitespace-nowrap">Per Halaman</label>
                        <select
                          id="per_page"
                          value={params.per_page}
                          onChange={(e) => setParams({ ...params, per_page: +e.target.value, page: 1 })}
                          className="border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-black text-black dark:text-white px-2 py-1 text-[10px] font-black focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white outline-none"
                        >
                          <option value="5">5</option>
                          <option value="10">10</option>
                          <option value="25">25</option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                        <button onClick={() => decrementPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-100 dark:border-gray-900 text-gray-400 dark:text-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 transition-all">
                          <ChevronsLeft className="w-4 h-4" />
                        </button>
                        <button onClick={() => decrementPage(currentPage - 1)} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-gray-100 dark:border-gray-900 text-gray-400 dark:text-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 transition-all">
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <div className="hidden sm:flex items-center px-3 py-1 text-[10px] font-black text-black dark:text-white border border-gray-100 dark:border-gray-900 bg-white dark:bg-black tabular-nums">
                          {currentPage} / {data?.total_pages || 1}
                        </div>
                        <button onClick={() => incrementPage(page + 1)} disabled={currentPage >= (data?.total_pages || 1)} className="p-1.5 rounded-lg border border-gray-100 dark:border-gray-900 text-gray-400 dark:text-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        <button onClick={() => incrementPage(data?.total_pages || null)} disabled={currentPage >= (data?.total_pages || 1)} className="p-1.5 rounded-lg border border-gray-100 dark:border-gray-900 text-gray-400 dark:text-gray-600 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black disabled:opacity-30 transition-all">
                          <ChevronsRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
);

export { MTable };
