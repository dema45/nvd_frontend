import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormInput from "./formInput"; 

const AdminLogin = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 

  const inputs = [
    { id: 1, name: "email", type: "email", placeholder: "Enter your email", label: "Email", required: true },
    { id: 2, name: "password", type: "password", placeholder: "Enter Password", label: "Password", required: true },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post("http://localhost:4005/api/admin/login", values);
      
      if (response.status === 200) {
        localStorage.setItem("jwtToken", response.data.token);
        setIsLoading(false);
        setShowSuccessModal(true);
        
        // Navigate after showing success modal
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.message || "Invalid email or password");
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-semibold text-center text-[#7083F5]">Admin Sign In</h1>

        {inputs.map((input) => (
          <FormInput key={input.id} {...input} value={values[input.name]} onChange={onChange} />
        ))}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <p className="text-right text-sm text-gray-500 cursor-pointer hover:underline">Forgot password?</p>

        <button 
          type="submit" 
          className="w-full bg-[#7083F5] text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition duration-300 flex justify-center items-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-gray-600 mt-3">
          Don't have an account? <Link to="/insert-admin" className="text-[#7083F5] hover:underline">Sign Up</Link>
        </p>
      </form>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Signing In...
              </h3>
              <p className="text-gray-500 mt-2">Please wait a moment</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-6">
                <div className="bg-blue-500 h-1.5 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col justify-center shadow-xl border border-gray-100">
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
                <p className="text-gray-500 mt-2">Redirecting to dashboard...</p>
              </div>
              <div className="mt-8 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
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

export default AdminLogin;