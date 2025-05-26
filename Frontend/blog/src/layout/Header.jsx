import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
  Check,
  Plus,
  Home,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DarkModeToggle from "../components/DarkModeToggle";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [notifications, setNotifications] = useState(3);
  const [currentDate, setCurrentDate] = useState("");

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isLoggedIn = localStorage.getItem("token") !== null;

  useEffect(() => {
    const date = new Date();
    const options = { weekday: "long", month: "long", day: "numeric" };
    setCurrentDate(date.toLocaleDateString("en-US", options));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNewTaskClick = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("❌ Please login first to create a new blog!");
      navigate("/auth");
      return;
    }
    navigate("/create");
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md ">
      <div className="container mx-auto px-4 py-4 md:py-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Logo */}
          <div className="flex items-center space-x-2">
            <Check className="h-7 w-7 text-blue-600" />
            <NavLink
              className="text-3xl font-extrabold text-gray-800 dark:text-white"
              to="/"
            >
              BlogHUB
            </NavLink>
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Center: Date */}
          <div className="text-gray-600 dark:text-gray-300 text-sm md:text-base font-medium text-center md:text-left">
            {currentDate}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition rounded-full px-3 py-1">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-300" />
              <input
                type="text"
                placeholder="Search blogs..."
                className="bg-transparent border-none focus:outline-none text-sm pl-2 w-36 lg:w-48 text-gray-800 dark:text-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* Home Button */}
            <NavLink
              to="/"
              className="hidden md:flex items-center gap-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:border-blue-600 transition px-4 py-2 rounded-full text-sm font-medium"
            >
              <Home className="h-4 w-4" />
              Home
            </NavLink>

            {/* Add Blog */}
            <button
              onClick={handleNewTaskClick}
              className="hidden md:flex items-center gap-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:text-blue-600 hover:border-blue-600 transition px-4 py-2 rounded-full text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Blog
            </button>

            {/* My Blogs */}
            <NavLink
              to="/myBlog"
              className="hidden md:flex items-center gap-1 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              My Blogs
            </NavLink>

            {/* Notifications */}
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 hover:text-blue-600 cursor-pointer transition" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                  {notifications}
                </span>
              )}
            </div>

            {/* Dark Mode */}
            <DarkModeToggle />

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                <UserCircle className="h-7 w-7 text-gray-600 dark:text-gray-300 hover:text-blue-600 transition" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-10">
                  {!isLoggedIn ? (
                    <>
                      <NavLink
                        to="/auth"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/auth"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  ) : (
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                      onClick={() => {
                        localStorage.removeItem("token");
                        setDropdownOpen(false);
                        navigate("/auth");
                      }}
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
