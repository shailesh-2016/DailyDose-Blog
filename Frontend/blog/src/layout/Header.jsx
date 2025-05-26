import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  UserCircle,
  Check,
  Plus,
  LogIn,
  UserPlus,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
      toast.error("❌ Please login first to create a new task!");
      navigate("/auth");
      return;
    }

    navigate("/create");
  };

  return (
    <header className="w-full bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:flex items-center">
              <Check className="h-6 w-6 text-blue-600" />
              <NavLink className="ml-2 text-2xl font-bold text-gray-800" to="/">
                BlogHUB
              </NavLink>
            </div>
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-blue-600 hover:bg-gray-100 transition"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="text-gray-600 text-sm md:text-base font-medium">
            {currentDate}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-3">
            {/* Search Box */}
            <div className="hidden md:flex items-center bg-gray-100 hover:bg-gray-200 transition rounded-full px-3 py-1">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-transparent border-none focus:outline-none text-sm pl-2 w-36 lg:w-48"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            {/* New Task & View Task Buttons */}
            {/* New Task button changed to button element with onClick */}
            <button
              onClick={handleNewTaskClick}
              className="hidden md:flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1.5 rounded-full text-sm font-medium"
            >
              <Plus className="h-4 w-4" />
              Add Blog
            </button>

            <NavLink
              className="hidden md:flex items-center gap-1 bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-1.5 rounded-full text-sm font-medium"
              to="/myBlog"
            >
              My Blogs
            </NavLink>

            {/* Notifications */}
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer transition" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center shadow-md">
                  {notifications}
                </span>
              )}
            </div>

            {/* User Icon + Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                <UserCircle className="h-7 w-7 text-gray-600 hover:text-blue-600 transition" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md z-10">
                  {!isLoggedIn ? (
                    <>
                      <NavLink
                        to="/auth"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Login
                      </NavLink>
                      <NavLink
                        to="/auth"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  ) : (
                    <button
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 space-y-4">
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
            <Search className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="bg-transparent border-none focus:outline-none text-sm pl-2 w-full"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <button
            onClick={handleNewTaskClick} // Same check for mobile too
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-md text-sm font-medium flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Task
          </button>

          {/* Mobile Links */}
          <div className="space-y-2 text-gray-700 text-sm font-medium">
            <a
              href="#"
              className="block px-2 py-2 hover:bg-gray-100 rounded-md"
            >
              My Tasks
            </a>
            <a
              href="#"
              className="block px-2 py-2 hover:bg-gray-100 rounded-md"
            >
              Categories
            </a>
            <a
              href="#"
              className="block px-2 py-2 hover:bg-gray-100 rounded-md"
            >
              Settings
            </a>
          </div>

          {/* Auth Buttons - Mobile */}
          {!isLoggedIn && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <button
                onClick={() => navigate("/auth")}
                className="w-full flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-md transition"
              >
                <LogIn className="h-4 w-4" />
                Login
              </button>
              <button
                onClick={() => navigate("/auth")}
                className="w-full flex items-center justify-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
              >
                <UserPlus className="h-4 w-4" />
                Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
