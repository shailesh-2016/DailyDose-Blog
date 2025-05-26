import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import AuthPage from "./pages/Auth";
import BlogForm from "./components/Create";
import BlogCard from "./components/ViewData";
import Update from "./components/Update";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";
import MyBlog from "./components/MyBlog";
import DarkModeToggle from "./components/DarkModeToggle";
const App = () => {
  return (
    <>
        <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">

      <Toaster position="top-center" />

      <Router>
        <Header />
        <Routes>
          <Route path="/auth" element={<AuthPage />}></Route>
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <BlogForm />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<BlogCard />}></Route>
          <Route path="/myBlog" element={<MyBlog />}></Route>
          <Route path="/update/:id" element={<Update />}></Route>
          
        </Routes>
      </Router>
      </div>
    </>
  );
};

export default App;
