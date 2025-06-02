import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import background from '../Assets/background.png';

const Login = () => {
  const [values, setValues] = useState({
    cid: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    cid: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    let valid = true;
    const newErrors = { cid: "", password: "" };

    // CID validation (assuming Bhutanese CID format: 11 digits)
    if (!values.cid.trim()) {
      newErrors.cid = "CID is required";
      valid = false;
    } else if (!/^\d{11}$/.test(values.cid)) {
      newErrors.cid = "CID must be 11 digits";
      valid = false;
    }

    // Password validation
    if (!values.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
    // Clear form error when user types
    if (formError) {
      setFormError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    setIsSubmitting(true);
    setFormError("");
  
    try {
      const response = await fetch("http://localhost:4005/api/voters/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }
  
      // ✅ Save token in localStorage
      localStorage.setItem("token", data.token);
  
      setShowSuccessModal(true);
  
      setTimeout(() => {
        navigate("/homepage");
      }, 2000);
  
    } catch (error) {
      setFormError(error.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="relative min-h-screen w-screen overflow-hidden" style={{fontFamily:"Poppins"}}>
      {/* Blurred Background Only */}
      <div 
        className="fixed inset-0 -z-10"
        style={{ 
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          transform: "scale(1.02)"
        }}
      />
      
      {/* Semi-transparent overlay (optional) */}
      <div className="fixed inset-0 -z-10 bg-black/20" />
      
      {/* Crisp Header and Form */}
      <div className="relative z-0">
        <Header />
        
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="w-full max-w-md space-y-8">
            {/* Form error message */}
            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white border-opacity-20">
              <h2 className="text-3xl font-bold text-center text-[#7083F5] mb-8">
                Sign In
              </h2>
              
              {/* CID Field */}
              <div className="mb-6">
                <label htmlFor="cid" className="block text-sm font-medium text-gray-700 mb-1">
                  Citizenship ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cid"
                    placeholder="Enter your 11-digit CID"
                    value={values.cid}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.cid ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    aria-invalid={!!errors.cid}
                    aria-describedby="cid-error"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.cid && (
                  <p id="cid-error" className="mt-1 text-sm text-red-600">
                    <svg className="inline h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    {errors.cid}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1 text-sm text-red-600">
                    <svg className="inline h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                    </svg>
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-end mb-6">
                <div className="text-sm">
                  <Link 
                    to="/forgot-password" 
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${isSubmitting ? 'bg-indigo-400' : 'bg-[#7083F5] hover:bg-[#5A6BD7]'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing  in...  
                  </>
                ) : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white bg-opacity-90 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>
              </div>

              {/* Redirect Links */}
              <div className="mt-6 text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                  >
                    Register now
                  </Link>
                </p>
                <p className="text-sm text-gray-600">
                  Are you an admin?{" "}
                  <Link 
                    to="/adminlogin" 
                    className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[400px] max-w-[70vw] mx-4 flex flex-col justify-center shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Login Successful!
                </h3>
                
              </div>
              <div className="mt-8 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full animate-progress"
                  style={{
                    animation: "progress 2s linear forwards",
                  }}
                ></div>
                <style jsx>{`
                  @keyframes progress {
                    from {
                      width: 100%;
                    }
                    to {
                      width: 0%;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;