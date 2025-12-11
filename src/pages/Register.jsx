import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields");
      return false;
    }

    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="bg-[#212121] p-10 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Create Account</h1>
          <p className="text-gray-400 text-sm">
            Sign up to get started with YouTube Clone
          </p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-5 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-sm text-white font-medium"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="px-3 py-3 bg-dark-primary border border-[#3f3f3f] rounded-lg text-white text-sm outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-white font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="px-3 py-3 bg-dark-primary border border-[#3f3f3f] rounded-lg text-white text-sm outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm text-white font-medium"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="px-3 py-3 bg-dark-primary border border-[#3f3f3f] rounded-lg text-white text-sm outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text- text-white font-medium"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="px-3 py-3 bg-dark-primary border border-[#3f3f3f] rounded-lg text-white text-sm outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-base font-medium transition-colors"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-500 no-underline font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
