import { useState, useEffect, useCallback, useRef } from 'react';
import { UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { AsyncSelectOption } from './AsyncSelectInput';

interface UseAsyncSelectProps {
  fieldName: string;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  fetchData: (params: any) => Promise<any>;
  mapToOption: (item: any) => AsyncSelectOption;
  additionalFields?: { fieldName: string; getValue: (option: AsyncSelectOption) => any }[];
  fallbackFields?: { fieldName: string; labelKey: string }[];
  filterAnd?: string;
  perPage?: number;
}

export const useAsyncSelect = ({
  fieldName,
  setValue,
  getValues,
  fetchData,
  mapToOption,
  additionalFields = [],
  fallbackFields = [],
  filterAnd = '',
  perPage = 10,
}: UseAsyncSelectProps) => {
  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const searchTimeout = useRef<any>(null);
  const isInitialMount = useRef(true);

  const loadInitialData = useCallback(async (searchQuery = '') => {
    setIsLoading(true);
    try {
      const response = await fetchData({
        page: 1,
        per_page: perPage,
        search: searchQuery,
        filter_and: filterAnd,
      });
      setItems(response.data || []);
      setTotalCount(response.total || 0);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error loading select data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchData, perPage, filterAnd]);

  useEffect(() => {
    if (isInitialMount.current) {
      loadInitialData();
      isInitialMount.current = false;
    }
  }, [loadInitialData]);

  const loadMore = async () => {
    if (isLoadingMore || items.length >= totalCount) return;
    
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await fetchData({
        page: nextPage,
        per_page: perPage,
        filter_and: filterAnd,
      });
      setItems(prev => [...prev, ...(response.data || [])]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Error loading more select data:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadOptions = (inputValue: string, callback: (options: AsyncSelectOption[]) => void) => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    searchTimeout.current = setTimeout(async () => {
      await loadInitialData(inputValue);
      callback(items.map(mapToOption));
    }, 1000);
  };

  const handleChange = (option: AsyncSelectOption | null) => {
    if (option) {
      additionalFields.forEach(field => {
        setValue(field.fieldName, field.getValue(option));
      });
    } else {
      additionalFields.forEach(field => {
        setValue(field.fieldName, '');
      });
    }
  };

  const options = items.map(mapToOption);

  // Handle fallback for edit mode
  useEffect(() => {
    const currentValue = getValues(fieldName);
    if (currentValue && items.length > 0) {
      const exists = items.some(item => String(item.id) === String(currentValue));
      if (!exists && fallbackFields.length > 0) {
        // Here you would typically fetch the specific item by ID, 
        // but for now we'll assume the fallback labels are already in the form state
      }
    }
  }, [fieldName, getValues, items, fallbackFields]);

  return {
    options,
    isLoading,
    isLoadingMore,
    loadMore,
    loadOptions,
    handleChange,
    loadInitialData,
  };
};
