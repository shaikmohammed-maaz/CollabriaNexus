import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import LoginImg from './assets/LoginImg.png';

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      navigate("/");
    }, 2000);
  };

  const handleGoogleLogin = () => {
    console.log('Google login initiated');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 md:py-16 pt-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl floating" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-accentLight/10 rounded-full blur-3xl" style={{animationDelay: '3s'}} />
      </div>
      <div className="w-full max-w-6xl bg-card rounded-2xl shadow-2xl flex overflow-hidden relative z-10 border border-border">
        {/* Left Side - Form */}
        <div className="flex-1 p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="font-bold text-3xl text-accent">Collabria Nexus</span>
            <p className="text-textMuted mt-2 text-sm">Welcome back to your learning & earning journey</p>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-accentLight">Welcome Back!</h2>
          <p className="mb-8 text-textMuted text-lg">Continue your journey of knowledge and collaboration</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full pl-12 pr-4 py-3 rounded-lg border ${errors.email ? 'border-error' : 'border-border'} bg-background/70 text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300`}
              />
              {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full pl-12 pr-12 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-border'} bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-accent p-1 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-accent w-4 h-4 mr-2"
                />
                <span className="text-text/70">Remember me</span>
              </label>
              <a href="#" className="text-accent hover:text-accentLight transition-colors">
                Forgot password?
              </a>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-accent to-accentLight text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center group"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-textMuted">
            New to our community? <a href="/SignUp" className="text-accent hover:text-accentLight hover:underline font-medium">Create your account</a>
          </div>
          
          {/* Quick stats */}
          <div className="mt-8 pt-6 border-t border-border/50">
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-xl font-bold text-accent">10K+</div>
                <div className="text-xs text-text/60">Active Members</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent">500+</div>
                <div className="text-xs text-text/60">Expert Mentors</div>
              </div>
              <div>
                <div className="text-xl font-bold text-accent">1M+</div>
                <div className="text-xs text-text/60">Knowledge Shares</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-background/80 to-card/50 p-12 relative">
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <img
              src={LoginImg}
              alt="Knowledge Access Illustration"
              className="max-h-80 object-contain drop-shadow-2xl rounded-2xl mb-8 floating"
            />
            
            <div className="space-y-6">
              <h3 className="text-2xl font-bold gradient-text">Your Knowledge Universe Awaits</h3>
              <p className="text-text/70 text-lg leading-relaxed max-w-md">
                Access your personalized dashboard, connect with mentors, and continue building your professional network in the knowledge economy.
              </p>
              
              <div className="bg-gradient-to-r from-accent/10 to-accent-light/10 p-6 rounded-xl border border-accent/20">
                <div className="text-sm text-text/60 mb-2">💡 Today's Insight</div>
                <div className="text-text/80 italic">
                  "The best way to learn is to teach others. Join discussions, share your expertise, and grow together."
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}