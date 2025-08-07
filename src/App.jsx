import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from 'react';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import NavBar from './NavBar';
import Footer from './Footer';
import Dashboard from "./DashBoard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/CollabriaNexus/" element={<Home />} />
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
        {/* Add more protected routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
