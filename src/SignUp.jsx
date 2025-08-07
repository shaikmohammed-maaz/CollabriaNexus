import React, { useState } from "react";
import { Eye, EyeOff, Users, BookOpen, Award, Globe } from "lucide-react";
import LoginImg from './assets/LoginImg.png';

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  const [accepted, setAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    else if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!accepted) newErrors.terms = 'You must accept the terms and privacy policy';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Sign up data:', formData);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8 md:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl floating" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accentLight/10 rounded-full blur-3xl" style={{animationDelay: '2s'}} />
      </div>
      <div className="w-full max-w-6xl bg-card rounded-2xl shadow-2xl flex overflow-hidden relative z-10 border border-border">
        {/* Left Side - Form */}
        <div className="flex-1 p-10 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <span className="font-bold text-3xl text-accent">.KnowledgeHub</span>
            <p className="text-textMuted mt-2 text-sm">Empowering minds, building futures</p>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-accentLight">Join Our Community</h2>
          <p className="mb-8 text-textMuted text-lg">Start your journey of knowledge sharing and collaboration</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Inputs */}
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Username"
              className={`w-full px-4 py-3 rounded-lg border ${errors.username ? 'border-error' : 'border-border'} bg-background/70 text-text placeholder-textMuted focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300`}
            />
            
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-border'} bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300`}
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password ? 'border-red-500' : 'border-border'} bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-accent p-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>
            
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-border'} bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/50 hover:text-accent p-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            
            <div>
              <input
                type="text"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                placeholder="Referral Code (Optional)"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-300"
              />
            </div>
            
            <div className="flex items-start text-sm mt-6">
              <input
                id="accept"
                type="checkbox"
                checked={accepted}
                onChange={e => setAccepted(e.target.checked)}
                className="accent-accent w-4 h-4 mr-3 mt-1 flex-shrink-0"
              />
              <label htmlFor="accept" className="text-textMuted select-none leading-relaxed">
                I agree to the <a href="#" className="text-accent hover:text-accentLight underline">Terms of Service</a> and <a href="#" className="text-accent hover:text-accentLight underline">Privacy Policy</a>.
              </label>
            </div>
            {/* Button */}
            <button
              type="submit"
              disabled={!accepted || isLoading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-accent to-accentLight text-white font-semibold hover:shadow-lg hover:shadow-accent/25 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
          <div className="mt-8 text-center text-sm text-textMuted">
            Already part of our community? <a href="#" className="text-accent hover:text-accentLight hover:underline font-medium">Sign in here</a>
          </div>
        </div>
        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-background/80 to-card/50 p-12 relative">
          <div className="w-full h-full flex flex-col items-center justify-center text-center">
            <img
              src={LoginImg}
              alt="Knowledge Community Illustration"
              className="max-h-80 object-contain drop-shadow-2xl rounded-2xl mb-8 floating"
            />
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-accentLight">Join the Knowledge Revolution</h3>
              <p className="text-textMuted text-lg leading-relaxed max-w-md">
                Connect with experts, share insights, and collaborate on projects that matter.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="flex flex-col items-center p-4 glass rounded-xl bg-background/60 border border-border">
                  <Users className="w-8 h-8 text-accent mb-2" />
                  <span className="text-sm text-textMuted">Expert Network</span>
                </div>
                <div className="flex flex-col items-center p-4 glass rounded-xl">
                  <BookOpen className="w-8 h-8 text-accent mb-2" />
                  <span className="text-sm text-text/70">Knowledge Base</span>
                </div>
                <div className="flex flex-col items-center p-4 glass rounded-xl">
                  <Award className="w-8 h-8 text-accent mb-2" />
                  <span className="text-sm text-text/70">Verified Insights</span>
                </div>
                <div className="flex flex-col items-center p-4 glass rounded-xl">
                  <Globe className="w-8 h-8 text-accent mb-2" />
                  <span className="text-sm text-text/70">Global Impact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}