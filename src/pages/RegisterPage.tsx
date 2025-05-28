import { useState } from "react";
import { apiService } from "../services/api/service";
import { useNavigate } from "react-router-dom";
import type { RegisterRequest } from "../services/api/types";
import { useLoading } from "../hooks/useLoading";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const { isLoading, withLoading } = useLoading();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await withLoading(async () => {
      try {
        await apiService.register(form);
        navigate("/");
      } catch (err) {
        alert(`Registration failed: ${err instanceof Error ? err.message : "Please try again."}`);
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
          Create Your <span className="text-[#DCB73C]">MovieCritic</span> Account
        </h2>

        <input
          required
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="bg-[#3a3a3a] text-white text-xl p-4 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DCB73C] transition-all"
        />

        <input
          required
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="bg-[#3a3a3a] text-white text-xl p-4 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DCB73C] transition-all"
        />

        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="bg-[#3a3a3a] text-white text-xl p-4 rounded-xl placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#DCB73C] transition-all"
        />

        <input
          required
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
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
          {isLoading ? <Loader /> : "Register"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
