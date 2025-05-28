import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../services/api/service";
import Loader from "../components/Loader";
import type { Movie } from "../services/api/types";

const STATUS_TABS = ["planned", "watching", "completed", "dropped", "favourite"] as const;

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMovieAndUser = async () => {
      if (!id) return;
      try {
        const [movieRes, userRes] = await Promise.all([
          apiService.getMovieById(id),
          apiService.getMe()
        ]);
        setMovie(movieRes);
        setUserId(userRes.id || 0);
      } catch (error) {
        console.error("Failed to fetch movie or user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieAndUser();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!userId || !movie?.imdbId) return;

    const isSelected = selectedStatuses.has(status);
    const updatedStatuses = new Set(selectedStatuses);

    if (isSelected) {
      updatedStatuses.delete(status);
    } else {
      updatedStatuses.clear(); // allow only one active
      updatedStatuses.add(status);
    }

    setSelectedStatuses(updatedStatuses);

    try {
      const status = ([...updatedStatuses][0] as typeof STATUS_TABS[number]) || "planned";
      await apiService.setMovieStatus({
        userId,
        movieId: movie.imdbId,
        status,
      });
    } catch (error) {
      console.error("Failed to update movie status:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[url(/login-bg.png)]">
        <Loader />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="h-screen flex justify-center items-center text-white text-2xl">
        Movie not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url(/login-bg.png)] text-white flex justify-center pt-26 px-4 md:px-20">
      <div className="bg-[#1f1f1f] rounded-[40px] p-8 md:p-12 flex flex-col md:flex-row gap-10 max-w-6xl w-full shadow-2xl items-center">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full md:w-80 rounded-3xl shadow-lg object-cover"
        />

        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>

          <div className="text-white/70 text-sm md:text-base space-y-1">
            <p><span className="text-white/50">Year:</span> {movie.year}</p>
            <p><span className="text-white/50">Released:</span> {movie.released}</p>
            <p><span className="text-white/50">Runtime:</span> {movie.runtime}</p>
            <p><span className="text-white/50">Country:</span> {movie.country}</p>
            <p><span className="text-white/50">Director:</span> {movie.director}</p>
            <p><span className="text-white/50">Genre:</span> {movie.genre}</p>
          </div>

          <div className="pt-4">
            <h2 className="text-xl font-semibold mb-1">Plot</h2>
            <p className="text-white/90 leading-relaxed">{movie.plot}</p>
          </div>

          <div className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Ratings</h2>
            <div className="flex gap-4 text-sm text-white/80">
              <span>🎬 IMDb: <strong>{movie.ratingImdb}</strong></span>
              <span>🍅 Rotten Tomatoes: <strong>{movie.ratingRotTom}</strong></span>
              <span>📊 Metascore: <strong>{movie.ratingMetascore}</strong></span>
            </div>
          </div>

          <div className="pt-6">
            <h2 className="text-xl font-semibold mb-2">Watchlist Status</h2>
            <div className="flex flex-wrap gap-2">
              {STATUS_TABS.map((status) => (
                <label key={status} className="flex items-center gap-2 text-sm bg-white/5 px-3 py-1 rounded-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has(status)}
                    onChange={() => handleStatusChange(status)}
                    className="accent-yellow-500"
                  />
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoviePage;
