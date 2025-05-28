import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { apiService } from "../services/api/service";
import { useLoading } from "../hooks/useLoading";
import Loader from "../components/Loader";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, withLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await withLoading(async () => {
      try {
        const res = await apiService.login({ email, password });
        login(res.token);
        navigate("/");
      } catch (err) {
        alert(
          `Login failed: ${
            err instanceof Error ? err.message : "Please try again."
          }`
        );
      }
    });
  };

  return (
    <div className="h-screen w-full bg-[url(/login-bg.png)] bg-cover bg-center flex items-center justify-center relative before:absolute before:inset-0 before:bg-black/70 before:-z-1">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-md bg-black/60 rounded-3xl shadow-2xl p-16 w-full max-w-xl flex flex-col gap-10 border border-white/10"
      >
        <h2 className="text-center text-5xl font-bold text-white tracking-wide mb-4">
          Sign In to <span className="text-[#DCB73C]">MovieCritic</span>
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[#3a3a3a] text-white text-xl p-4 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DCB73C] transition-all"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-[#3a3a3a] text-white text-xl p-4 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DCB73C] transition-all"
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full text-2xl font-bold py-4 rounded-xl transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-[#DCB73C] text-black hover:scale-105 hover:shadow-lg"
          }`}
        >
          {isLoading ? <Loader /> : "Sign In"}
        </button>

        <Link
          to="/register"
          className="text-center text-white/60 hover:text-white mt-2 uppercase text-sm tracking-wide transition-all"
        >
          Don’t have an account? <span className="underline">Register</span>
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
