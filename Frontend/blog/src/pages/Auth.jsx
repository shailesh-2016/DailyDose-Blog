import { useState, useEffect } from "react";
import { Eye, EyeOff, Mail, Lock, User, LogOut } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setName] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmailError("");
    setPasswordError("");
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!isValid) return;

    try {
      if (isLogin) {
        const res = await axios.post("http://localhost:8000/api/user/login", {
          email,
          password,
        });

        if (res.data.success) {
          toast.success("✅ Login successful!");
          localStorage.setItem("token", res.data.token);
          setIsAuthenticated(true);
        } else {
          toast.error("❌ Login failed");
        }
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/user/register",
          {
            username,
            email,
            password,
          }
        );

        if (res.data.success) {
          toast.success("✅ Registered successfully!");
          setIsLogin(true);
        } else {
          toast.error("❌ Registration failed");
        }
      }

      // Clear form
      setEmail("");
      setPassword("");
      setName("");
    } catch (err) {
      console.error(err);
      toast.error("⚠️ Something went wrong");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // setIsAuthenticated(false);
    toast.success("🚪 Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {isLogin ? "Login" : "Register"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User
                  className="absolute top-2.5 left-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your Name"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail
                className="absolute top-2.5 left-3 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="example@email.com"
              />
            </div>
            {emailError && (
              <p className="text-sm text-red-500 mt-1">{emailError}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock
                className="absolute top-2.5 left-3 text-gray-400"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-indigo-500 focus:border-indigo-500`}
                placeholder="Your Password"
              />
              <div
                className="absolute top-2.5 right-3 text-gray-400 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>
            {passwordError && (
              <p className="text-sm text-red-500 mt-1">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-indigo-600 cursor-pointer hover:underline"
            onClick={toggleForm}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}
