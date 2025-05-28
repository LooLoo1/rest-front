import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Loader from "../components/Loader";
import MovieGrid from "../components/MovieGrid";
import { useLazyMovies } from "../hooks/useLazyMovies";

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get("query") || "";
  const [search, setSearch] = useState(queryParam);
  const { movies, loadMore, isLoading, hasMore } = useLazyMovies(search);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchParams(search ? { query: search } : {});
    }, 300);
    return () => clearTimeout(debounce);
  }, [search, setSearchParams]);

  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.5, rootMargin: "200px" }
    );

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [isLoading, loadMore, hasMore]);

  return (
    <div className="z-0 bg-[url(/login-bg.png)] bg-fixed bg-center pt-26 flex items-start justify-start relative before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-black/50 before:-z-1 min-h-screen">
      <div className="bg-[#262626] rounded-4xl flex flex-wrap justify-start items-start p-11 gap-8 mx-auto w-full max-w-6xl">
        <div className="w-full relative mb-8">
          <input
            type="text"
            className="w-full p-4 pr-12 bg-[#DCB73C] rounded-4xl outline-none border-none text-black placeholder:text-black/75"
            placeholder="Search movies..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <SearchIcon className="absolute right-6 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
        </div>

        <MovieGrid movies={movies} />

        {isLoading && (
          <div className="w-full flex justify-center py-4">
            <Loader />
          </div>
        )}

        {hasMore && !isLoading && (
          <div ref={loaderRef} className="w-full h-10" />
        )}
      </div>
    </div>
  );
};

export default MoviesPage;
