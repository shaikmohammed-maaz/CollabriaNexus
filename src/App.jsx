import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import NavBar from './NavBar';
import Footer from './Footer';
import Dashboard from "./DashBoard";
import BlogPage from "./Blog";
import AboutUs from "./Aboutus";
import ContactUs from "./ContactUs";
import Friends from "./Friends";
import Profile from "./Profile";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router basename="/CollabriaNexus">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <Login onLogin={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <SignUp onSignUp={() => setIsAuthenticated(true)} />
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated
              ? <Dashboard />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
