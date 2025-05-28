import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CottageIcon from "@mui/icons-material/Cottage";
import CasinoIcon from "@mui/icons-material/Casino";
import { useAuth } from "../auth/AuthContext";
import { apiService } from "../services/api/service";
import Loader from "./Loader";

const Header = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loadingRandom, setLoadingRandom] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleRandomMovie = async () => {
    setLoadingRandom(true);
    try {
      const movie = await apiService.getRandomMovie();
      if (movie?.imdbId) {
        navigate(`/movies/${movie.imdbId}`);
      }
    } catch (err) {
      console.error("Failed to fetch random movie:", err);
    } finally {
      setTimeout(() => setLoadingRandom(false), 800);
    }
  };

  return (
    <header className="fixed z-50 top-0 left-0 right-0 px-10 py-4 flex justify-between items-center bg-gradient-to-r from-[#DCB73C] via-yellow-300 to-[#DCB73C] shadow-xl backdrop-blur-md border-b-2 border-white/20 rounded-b-[2rem]">
      <h1
        className="text-4xl font-extrabold uppercase tracking-wider cursor-pointer text-black hover:text-white transition-all duration-300 drop-shadow-lg"
        onClick={() => navigate("/")}
      >
        <span className="text-white">Movie</span>
        <span className="text-[#000]">Critic</span>
      </h1>

      <div className="flex items-center gap-6">
        {isAuthenticated ? (
          <>
            <div className="relative w-10 h-10">
              {loadingRandom ? (
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-inner">
                  <Loader className="scale-50" />
                </div>
              ) : (
                <CasinoIcon
                  onClick={handleRandomMovie}
                  fontSize="large"
                  titleAccess="Random Movie"
                  className="cursor-pointer text-black hover:text-white hover:scale-110 transition-all"
                />
              )}
            </div>
            <CottageIcon
              onClick={() => navigate("/")}
              fontSize="large"
              titleAccess="Home"
              className="cursor-pointer text-black hover:text-white hover:scale-110 transition-all"
            />
            <AccountCircleOutlinedIcon
              onClick={() => navigate("/profile")}
              fontSize="large"
              titleAccess="Profile"
              className="cursor-pointer text-black hover:text-white hover:scale-110 transition-all"
            />
            <button
              onClick={handleLogout}
              className="text-black hover:text-white hover:scale-110 transition-all font-semibold"
              title="Logout"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="text-black hover:text-white hover:scale-110 transition-all font-semibold"
            title="Login"
          >
            Login
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
