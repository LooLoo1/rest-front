import type { Movie, MovieDTO } from "../services/api/types";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: (MovieDTO | Movie)[];
}

const MovieGrid = ({ movies }: MovieGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
      {movies?.map((movie) => (
        <MovieCard key={movie.title} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
