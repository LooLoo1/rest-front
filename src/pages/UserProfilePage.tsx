import { useEffect, useState } from "react";
import { apiService } from "../services/api/service";
import type { Movie, MovieDTO, UserProfileDTO } from "../services/api/types";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const STATUS_TABS = [
  "all",
  "planned",
  "watching",
  "completed",
  "dropped",
  "favourite",
] as const;

const UserProfilePage = () => {
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [activeTab, setActiveTab] =
    useState<(typeof STATUS_TABS)[number]>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await apiService.getMe();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader />
      </div>
    );
  }

  if (!profile) {
    return <div className="text-white p-6">Error loading profile</div>;
  }

  const filteredList: (MovieDTO | Movie)[] =
    activeTab === "all"
      ? profile.list || []
      : (profile.list || []).filter((m) => m.status === activeTab);

  return (
    <div className="min-h-screen bg-black text-white space-y-10 pt-26 p-10">
      {/* User Info */}
      <section className="bg-[#1e1e1e] rounded-[40px] p-6 max-w-6xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold">{profile.username}</h1>
        <p className="text-lg text-white/60">{profile.email}</p>
        <div className="pt-4 space-y-1 text-white/80 font-semibold text-sm">
          <p>Total Viewed: {profile.totalViewed ?? 0}</p>
          <p>Avg Score: {profile.averageScore?.toFixed(1) ?? "-"}</p>
          <p>Time Spent: {profile.timeSpend ?? "-"}</p>
        </div>
      </section>

      {/* Watchlist */}
      <section className="bg-[#1e1e1e] rounded-[40px] p-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Watchlist</h2>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1 rounded-full font-semibold text-sm transition-all ${
                activeTab === tab
                  ? "bg-[#DCB73C] text-black"
                  : "bg-gray-700 text-white/70 hover:bg-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Movie list */}
        {filteredList.length === 0 ? (
          <p className="text-white/60 italic">No movies in this category.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full">
            {filteredList.map((movie) => {
              const poster =
                (movie as MovieDTO).posterURL || (movie as Movie).poster;
              return (
                <Link
                  key={movie.title}
                  to={`/movies/${
                    (movie as Movie).imdbId || (movie as MovieDTO).id
                  }`}
                  className="group transform transition-transform duration-300 hover:scale-105"
                >
                  <div className="bg-[#1F1F1F] rounded-3xl overflow-hidden shadow-xl relative h-full flex flex-col">
                    <div className="relative w-full aspect-[2/3] overflow-hidden">
                      <img
                        src={poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow justify-between">
                      <h2 className="text-white text-xl font-semibold mb-1 line-clamp-2 leading-tight">
                        {movie.title}
                      </h2>
                      <p className="text-white/50 text-sm">{movie.year}</p>
                    </div>
                    <div className="absolute inset-0 rounded-3xl border border-[#DCB73C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfilePage;
