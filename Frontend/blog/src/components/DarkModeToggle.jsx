import React, { useEffect, useState } from "react";

const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <label htmlFor="darkSwitch" className="relative inline-block w-11 h-6 cursor-pointer">
      <input
        type="checkbox"
        id="darkSwitch"
        checked={isDark}
        onChange={toggleDarkMode}
        className="peer sr-only"
      />
      <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 peer-checked:bg-blue-600" />
      <span className="absolute top-1/2 left-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-sm transition-transform duration-200 peer-checked:translate-x-full" />
    </label>
  );
};

export default DarkModeToggle;
