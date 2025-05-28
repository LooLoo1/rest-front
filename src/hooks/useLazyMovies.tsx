import { useEffect, useState } from "react";
import { apiService } from "../services/api/service";
import type { MovieDTO } from "../services/api/types";

const MOVIE_STEP = 40;

export const useLazyMovies = (search: string) => {
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [limit, setLimit] = useState(MOVIE_STEP);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const fetchMovies = async (currentLimit = MOVIE_STEP) => {
    setIsLoading(true);
    try {
      const newMovies = await apiService.getMovies(currentLimit);
      setMovies(newMovies);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSearchedMovies = async (keyword: string) => {
    setIsLoading(true);
    try {
      const searched = await apiService.searchMovies(keyword);
      setMovies(searched);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (isLoading || isSearchMode) return;
    const newLimit = limit + MOVIE_STEP;
    setLimit(newLimit);
    await fetchMovies(newLimit);
  };

useEffect(() => {
    const fetchData = async () => {
        const trimmedSearch = search.trim();
        if (trimmedSearch.length > 0) {
            setIsSearchMode(true);
            await fetchSearchedMovies(trimmedSearch);
        } else {
            setIsSearchMode(false);
            await fetchMovies(limit);
        }
    };
    
    fetchData();
}, [search, limit]);

  return {
    movies,
    loadMore,
    isLoading,
    hasMore: !isSearchMode, 
  };
};
