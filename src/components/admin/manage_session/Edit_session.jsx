import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";

const Edit_session = (props) => {
  // Get sessionId from props or from URL params
  const urlParams = useParams();
  const sessionId = props.sessionId || urlParams.id;
  const navigate = useNavigate();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null); // For debugging

  // State for form inputs
  const [sessionName, setSessionName] = useState("");

  // State for validation errors
  const [errors, setErrors] = useState({
    sessionName: "",
  });

  // Fetch existing session data from the API
  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionId) {
        console.error("No sessionId provided");
        setError("No session ID provided");
        setIsLoading(false);
        return;
      }

      try {
        console.log(`Fetching session with ID: ${sessionId}`);
        setIsLoading(true);
        
        const response = await axios.get(`http://localhost:4005/api/sessions/${sessionId}`);
        console.log("API Response:", response.data);
        setApiResponse(response.data);
        
        if (response.data && response.data.session_name) {
          // Pre-fill the form with existing data
          setSessionName(response.data.session_name);
          setError(null);
        } else {
          setError("Invalid session data format");
          console.error("Invalid data format:", response.data);
        }
      } catch (err) {
        console.error("Error fetching session data:", err);
        setError(`Failed to load session data: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId]);

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { sessionName: "" };

    if (!sessionName.trim()) {
      newErrors.sessionName = "Session Name is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  // Handle confirmation and API update
  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    setIsUpdating(true);
    
    try {
      console.log(`Updating session ${sessionId} with name: ${sessionName}`);
      // Call the API to update the session
      const response = await axios.put(`http://localhost:4005/api/sessions/${sessionId}`, {
        session_name: sessionName
      });
      
      console.log("Update response:", response.data);
      setIsUpdating(false);
      setShowSuccessModal(true);
      
      // Auto-close after 2 seconds and redirect to view_session
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/view_session`); // Redirect to view session page
      }, 2000);
    } catch (err) {
      setIsUpdating(false);
      console.error("Error updating session:", err);
      setError(`Failed to update session: ${err.message}`);
    }
  };

  // Show debugging info if there's an issue
  if (error) {
    console.log("Error state:", error);
    console.log("Session ID:", sessionId);
    console.log("Loading state:", isLoading);
    console.log("API Response:", apiResponse);
  }

  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-100"
      style={{ fontFamily: "Poppins" }}
    >
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {isSidebarOpen && (
          <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userId={userId}
        />

        <main className="p-6 flex-grow flex flex-col items-center">
          {/* Header outside the form */}
          <div className="w-full max-w-4xl text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Edit Session</h1>
            {sessionId && <p className="text-gray-600">Session ID: {sessionId}</p>}
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV !== 'production' && error && (
            <div className="mb-4 w-full max-w-3xl bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <h3 className="font-bold">Debug Info:</h3>
              <p>Error: {error}</p>
              <p>Session ID: {sessionId || "Not provided"}</p>
              <p>Loading: {isLoading ? "Yes" : "No"}</p>
              <p>API Response: {apiResponse ? JSON.stringify(apiResponse) : "None"}</p>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 w-full max-w-3xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-3xl md:max-w-2xl">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7083F5]"></div>
                <p className="ml-4 text-gray-600">Loading session data...</p>
              </div>
            ) : (
              <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                {/* Session Name */}
                <div className="flex flex-col items-center">
                  <label className="block text-gray-700 text-lg font-medium mb-2 text-left w-full max-w-md">
                    Session Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Session Name"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className={`w-full p-3 border ${
                      errors.sessionName ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5] max-w-md mx-auto`}
                  />
                  {errors.sessionName && (
                    <p className="text-red-500 text-sm mt-1 w-full max-w-md text-left">
                      {errors.sessionName}
                    </p>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Submit Button */}
                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="font-medium">Update Session</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 pb-44 pl-96">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[85vw] mx-4 flex flex-col justify-center shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-50 mb-4">
                  <svg
                    className="h-8 w-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Confirm Updating
                </h3>
                <p className="text-gray-500 mt-2">
                  Are you sure you want to update this session?
                </p>
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-200 w-28"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 w-28"
                  onClick={handleConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-44 pl-96">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Updating Session...
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-44 pl-96">
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
                  Success!
                </h3>
                <p className="text-gray-500 mt-2">
                  Session updated successfully.
                </p>
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

export default Edit_session;