import { useState } from "react";
import { apiService } from "../services/api/service";
import { useNavigate } from "react-router-dom";
import type { RegisterRequest } from "../services/api/types";
import { useLoading } from "../hooks/useLoading";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState("");

  const [form, setForm] = useState<RegisterRequest>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const { isLoading, withLoading } = useLoading();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name: string, value: string) => {
    if (!value) return "This field is required";
    if (name === "email" && !validateEmail(value)) {
      return "Please enter a valid email address";
    }
    if (value.length < 8) {
      return "Field must be at least 8 characters long";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const newErrors = {
      email: validateField("email", form.email || ""),
      firstName: validateField("firstName", form.firstName || ""),
      lastName: validateField("lastName", form.lastName || ""),
      password: validateField("password", form.password || ""),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    await withLoading(async () => {
      try {
        await apiService.register(form);
        navigate("/");
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("403")) {
            setRegistrationError("Email is already registered");
          } else if (err.message.includes("500")) {
            setRegistrationError(
              "Registration failed due to server error. Please try again later"
            );
          } else {
            setRegistrationError(
              "Registration failed. Please check your information and try again"
            );
          }
        } else {
          setRegistrationError("Registration failed. Please try again.");
        }
      }
    });
  };

  const getInputClassName = (fieldName: keyof typeof errors) => `
    bg-[#3a3a3a] 
    text-white 
    text-xl 
    p-4 
    rounded-xl 
    placeholder-white/50 
    focus:outline-none 
    focus:ring-2 
    transition-all
    w-full
    ${
      isSubmitted && errors[fieldName]
        ? "border-2 border-red-500 focus:ring-red-500"
        : "focus:ring-[#DCB73C]"
    }
  `;

  const errorClassName = "text-red-500 text-sm mt-1";

  return (
    <div className="h-screen w-full bg-[url(/login-bg.png)] bg-cover bg-center flex items-center justify-center relative before:absolute before:inset-0 before:bg-black/70 before:-z-1">
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-md bg-black/60 rounded-3xl shadow-2xl p-16 w-full max-w-xl flex flex-col gap-6 border border-white/10"
      >
        <h2 className="text-center text-5xl font-bold text-white tracking-wide mb-4">
          Create Your <span className="text-[#DCB73C]">MovieCritic</span>{" "}
          Account
        </h2>
        <div>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className={getInputClassName("email")}
          />
          {isSubmitted && errors.email && (
            <p className={errorClassName}>{errors.email}</p>
          )}
        </div>
        <div>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className={getInputClassName("firstName")}
          />
          {isSubmitted && errors.firstName && (
            <p className={errorClassName}>{errors.firstName}</p>
          )}
        </div>
        <div>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className={getInputClassName("lastName")}
          />
          {isSubmitted && errors.lastName && (
            <p className={errorClassName}>{errors.lastName}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className={getInputClassName("password")}
          />
          {isSubmitted && errors.password && (
            <p className={errorClassName}>{errors.password}</p>
          )}
        </div>
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
        {registrationError && (
          <div className="text-red-500 text-center p-2 bg-red-100/10 rounded-lg">
            {registrationError}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterPage;
