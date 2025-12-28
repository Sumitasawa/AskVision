import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const Login = () => {
  const { loginUser, registerUser } = useAppContext();

  const [state, setState] = useState("login");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    let result;

    if (state === "login") {
      result = await loginUser(formData.email, formData.password);
    } else {
      result = await registerUser(
        formData.name,
        formData.email,
        formData.password
      );
    }

    setLoading(false);

    if (!result.success) {
      toast.error(result.message || "Something went wrong");
    } else {
      toast.success(state === "login" ? "Logged in successfully" : "Account created");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="sm:w-[360px] w-full text-center border border-gray-300/60 rounded-2xl px-8 py-10 bg-white shadow-md"
      >
        {/* Title */}
        <h1 className="text-gray-900 text-3xl font-medium">
          {state === "login" ? "Login" : "Sign Up"}
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          {state === "login"
            ? "Please sign in to continue"
            : "Create an account to get started"}
        </p>

        {/* Name (Register only) */}
        {state !== "login" && (
          <div className="flex items-center mt-6 w-full border h-12 rounded-full pl-6 gap-2">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full outline-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center w-full mt-4 border h-12 rounded-full pl-6 gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full border h-12 rounded-full pl-6 gap-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition disabled:opacity-50"
        >
          {loading
            ? "Please wait..."
            : state === "login"
            ? "Login"
            : "Sign Up"}
        </button>

        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-600 text-sm mt-4 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <span className="text-indigo-500 hover:underline">Click here</span>
        </p>
      </form>
    </div>
  );
};

export default Login;
