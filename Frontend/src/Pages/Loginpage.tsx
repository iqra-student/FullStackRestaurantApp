import { useState } from "react";
import { ChefHat, Eye, EyeOff, User, Lock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API } from "../api"

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors and success messages
    setEmailError("");
    setPasswordError("");
    setLoginError("");
    setSuccessMessage("");

    // Validate inputs
    let hasError = false;

    if (!email.trim()) {
      setEmailError("Email is required");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userName", data.name || data.userName || data.fullName || email); // Try different name fields
        localStorage.setItem("roles", JSON.stringify(data.roles || []));
        
        setSuccessMessage("Login successful! Redirecting...");
        console.log("Token:", data.token);
        
        // Redirect after 1.5 seconds
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        setLoginError(data.message || "Login failed! Please check your credentials and try again.");
      }
    } catch (err) {
      console.error(err);
      setLoginError("Something went wrong! Please try again later.");
    }
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  const navigateToForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://t4.ftcdn.net/jpg/02/92/20/37/360_F_292203735_CSsyqyS6A4Z9Czd4Msf7qZEhoxjpzZl1.jpg)`,
          zIndex: -1
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="w-full z-20">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-900/80 backdrop-blur-sm rounded-lg border border-white/20">
                <ChefHat className="h-6 w-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white drop-shadow-lg">Foodify</span>
            </div>
            <button
              onClick={navigateToHome}
              className="flex items-center space-x-2 text-white/90 hover:text-white transition-colors duration-200 font-medium bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20 hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        {/* Login Form - Centered */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 shadow-black/20">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">Welcome Back!</h2>
                <p className="text-white/80 drop-shadow">Please login to your account in Foodify.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-yellow-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      required
                      className={`w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 placeholder-white/50 text-white ${
                        emailError ? 'border-red-500' : 'border-white/30'
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="text-red-400 text-sm mt-1 drop-shadow">{emailError}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2 drop-shadow">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      required
                      className={`w-full pl-10 pr-12 py-3 bg-white/10 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 placeholder-white/50 text-white ${
                        passwordError ? 'border-red-500' : 'border-white/30'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-yellow-400 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-red-400 text-sm mt-1 drop-shadow">{passwordError}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-yellow-400 focus:ring-yellow-400 border-white/30 rounded bg-white/10"
                    />
                    <span className="ml-2 text-sm text-white/80 drop-shadow">Remember Me</span>
                  </label>
                  <button
                    type="button"
                    onClick={navigateToForgotPassword}
                    className="text-sm text-yellow-400 hover:text-yellow-300 font-medium drop-shadow"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-900 py-3 px-4 rounded-xl font-semibold hover:from-yellow-400 hover:to-yellow-300 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  SIGN IN
                </button>

                {/* Error message */}
                {loginError && (
                  <div className="mt-3 p-3 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm text-center drop-shadow">{loginError}</p>
                  </div>
                )}

                {/* Success message */}
                {successMessage && (
                  <div className="mt-3 p-3 bg-green-500/10 backdrop-blur-sm border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm text-center drop-shadow">{successMessage}</p>
                  </div>
                )}

                {/* Social Login */}
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/30"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-transparent text-white/70 drop-shadow">Or Sign In With</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-white/30 rounded-xl shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white/80 hover:bg-white/20 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 text-white mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </button>
                    <button
                      type="button"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-white/30 rounded-xl shadow-sm bg-white/10 backdrop-blur-sm text-sm font-medium text-white/80 hover:bg-white/20 transition-all duration-200"
                    >
                      <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>
                </div>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-white/80 drop-shadow">
                  Don't have an account?{" "}
                  <button
                    onClick={navigateToRegister}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold drop-shadow"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;