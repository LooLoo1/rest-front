// import { Link } from "react-router-dom";
import type { Movie, MovieDTO } from "../services/api/types";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: (MovieDTO | Movie)[];
}

// const MovieGrid = ({ movies }: MovieGridProps) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
//       {movies?.map((movie) => {
//         const poster = (movie as MovieDTO).posterURL || (movie as Movie).poster;

//         return (
//           <Link
//             key={movie.title}
//             to={`/movies/${(movie as Movie).imdbId || (movie as MovieDTO).id}`}
//             className="group transform transition-transform duration-300 hover:scale-105"
//           >
//             <div className="bg-[#1F1F1F] rounded-3xl overflow-hidden shadow-xl relative h-full flex flex-col">
//               <div className="relative w-full aspect-[2/3] overflow-hidden">
//                 <img
//                   src={poster}
//                   alt={movie.title}
//                   className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
//                 />
//               </div>
//               <div className="p-4 flex flex-col flex-grow justify-between">
//                 <h2 className="text-white text-xl font-semibold mb-1 line-clamp-2 leading-tight">
//                   {movie.title}
//                 </h2>
//                 <p className="text-white/50 text-sm">{movie.year}</p>
//               </div>
//               <div className="absolute inset-0 rounded-3xl border border-[#DCB73C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//             </div>
//           </Link>
//         );
//       })}
//     </div>
//   );
// };

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
