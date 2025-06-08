import { useState, useEffect, useCallback } from 'react';
import { searchEmployees } from '@/services/employees.service';
import { EmployeeSearchResult } from '@/types/types';

interface UseEmployeeSearchReturn {
    searchResults: EmployeeSearchResult[];
    isSearching: boolean;
    searchError: string | null;
    handleSearch: (query: string) => void;
    clearSearch: () => void;
}

export const useEmployeeSearch = (debounceMs: number = 300): UseEmployeeSearchReturn => {
    const [searchResults, setSearchResults] = useState<EmployeeSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const performSearch = useCallback(async (query: string) => {
        setIsSearching(true);
        setSearchError(null);

        try {
            const result = await searchEmployees(query);

            if (result.ok) {
                setSearchResults(result.data || []);
            } else {
                setSearchError(result.message || 'Không thể tìm kiếm nhân viên');
                setSearchResults([]);
            }
        } catch (error) {
            setSearchError('Lỗi khi tìm kiếm nhân viên');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            performSearch(searchTerm);
        }, debounceMs);

        return () => clearTimeout(debounceTimer);
    }, [searchTerm, debounceMs, performSearch]);

    const handleSearch = useCallback((query: string) => {
        setSearchTerm(query);
    }, []);

    const clearSearch = useCallback(() => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
        setSearchError(null);
    }, []);

    return {
        searchResults,
        isSearching,
        searchError,
        handleSearch,
        clearSearch,
    };
};
