import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../voter/Header";
import background from "../../Assets/background.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetErrorMessage, setResetErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4005/api/forget/forgot-password",
        { email }
      );
      setSuccessMessage(response.data.message || "A reset link has been sent.");
      setErrorMessage("");
      setResetPassword(true);
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || "Error sending reset link. Try again."
      );
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp) {
      setResetErrorMessage("Please enter the OTP sent to your email.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetErrorMessage("Passwords do not match!");
      return;
    }

    if (!validatePassword(newPassword)) {
      setResetErrorMessage(
        "Password must be at least 8 characters, contain a number & special character."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4005/api/forget/reset-password",
        {
          OTP: otp,
          password: newPassword,
          confirmPassword: confirmPassword
        }
      );
    
      alert("Password reset successful!");
      setResetErrorMessage("");  
      setTimeout(() => navigate("/login"), 2000);  
    } catch (error) {
      
      const errorMessage = error?.response?.data?.message || error?.message || "Error resetting password. Try again.";
      setResetErrorMessage(errorMessage);
    }
  };


  return (
    <div className="relative min-h-screen w-screen overflow-hidden" style={{ fontFamily: "Poppins" }}>
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          transform: "scale(1.02)",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/20" />

      <div className="relative z-0">
        <Header />
        <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="w-full max-w-md space-y-8">
            <form
              onSubmit={resetPassword ? handleResetPassword : handleSubmitEmail}
              className="bg-white backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white border-opacity-20"
            >
              <h2 className="text-3xl font-bold text-center text-[#7083F5] mb-8">
                {resetPassword ? "Reset Password" : "Forgot Password"}
              </h2>

              {!resetPassword ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 mb-4"
                  />
                  {errorMessage && (
                    <p className="text-sm text-red-600 mb-4">{errorMessage}</p>
                  )}
                  {successMessage && (
                    <p className="text-sm text-green-600 mb-4">{successMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                      loading ? "bg-indigo-400" : "bg-[#7083F5] hover:bg-[#5A6BD7]"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                  />

                  {/* New Password */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                  />

                  {/* Confirm Password */}
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4"
                  />

                  {resetErrorMessage && (
                    <p className="text-sm text-red-600 mb-4">{resetErrorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white ${
                      loading ? "bg-indigo-400" : "bg-[#7083F5] hover:bg-[#5A6BD7]"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200`}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
