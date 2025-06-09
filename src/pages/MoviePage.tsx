import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiService } from "../services/api/service";
import Loader from "../components/Loader";
import type { Movie, UserProfileDTO, MovieDTO } from "../services/api/types";

const STATUS_TABS = ["planned", "watching", "completed", "dropped", "favourite"] as const;

const MoviePage = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set());
  const [loadingStatus, setLoadingStatus] = useState<string | null>(null);

  useEffect(() => {
    setSelectedStatuses(new Set());
  }, [id]);

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
        setProfile(userRes);
        
        const movieStatus = userRes.list?.find(m => (m as MovieDTO).id === id)?.status;
        if (movieStatus) {
          setSelectedStatuses(new Set([movieStatus]));
        }
      } catch (error) {
        console.error("Failed to fetch movie or user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieAndUser();
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!userId || !id) return;

    const isSelected = selectedStatuses.has(status);
    const updatedStatuses = new Set(selectedStatuses);
    setLoadingStatus(status);

    try {
      if (isSelected) {
        await apiService.removeMovieStatus(userId, id);
        updatedStatuses.delete(status);
        if (profile) {
          const updatedList = profile.list?.filter(m => (m as MovieDTO).id !== id) || [];
          setProfile({ ...profile, list: updatedList });
        }
      } else {
        updatedStatuses.clear(); // allow only one active
        updatedStatuses.add(status);
        const newStatus = status as typeof STATUS_TABS[number];
        await apiService.setMovieStatus({
          userId,
          movieId: id,
          status: newStatus,
        });
        
        if (profile) {
          const updatedList = profile.list?.filter(m => (m as MovieDTO).id !== id) || [];
          updatedList.push({ id, status: newStatus } as MovieDTO);
          setProfile({ ...profile, list: updatedList });
        }
      }
      setSelectedStatuses(updatedStatuses);
    } catch (error) {
      console.error("Failed to update movie status:", error);
      // Revert to previous state on error
      const currentStatus = profile?.list?.find(m => (m as MovieDTO).id === id)?.status;
      setSelectedStatuses(new Set(currentStatus ? [currentStatus] : []));
    } finally {
      setLoadingStatus(null);
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
                <label 
                  key={status} 
                  className={`flex items-center gap-2 text-sm bg-white/5 px-3 py-1 rounded-full cursor-pointer hover:bg-white/10 transition-colors ${
                    loadingStatus === status ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedStatuses.has(status)}
                    onChange={() => handleStatusChange(status)}
                    className="accent-[#DCB73C]"
                    disabled={loadingStatus === status}
                  />
                  {loadingStatus === status ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    status.charAt(0).toUpperCase() + status.slice(1)
                  )}
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
