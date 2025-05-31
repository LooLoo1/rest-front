import { useEffect, useState } from "react";
import { apiService } from "../services/api/service";
import type { MovieDTO } from "../services/api/types";
import MovieCard from "./MovieCard";
import Loader from "./Loader";

const RecentMovies = () => {
  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRecentMovies = async () => {
      try {
        const recentMovies = await apiService.getFiveMovies();
        setMovies(recentMovies);
      } catch (error) {
        console.error("Failed to fetch featured movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getRecentMovies();
  }, []);

    return (
    <div className="gap-16 flex flex-col items-center max-w-5xl w-full px-6 py-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-lg">
    <h2 className="text-5xl md:text-7xl font-bold text-white uppercase text-center">
      Recently added Movies
    </h2>
    {isLoading && (
      <div className="flex justify-center py-8">
        <Loader />
      </div>
    )}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full">
      {movies.map((movie) => (
        <MovieCard key={movie.title} movie={movie} />
      ))}
    </div>
  </div>
);
};

export default RecentMovies;