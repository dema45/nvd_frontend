import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed

const Create_election = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sessions, setSessions] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    selectedSession: "",
    electionRound: "",
    startDateTime: "",
    endDateTime: ""
  });

  // Error states
  const [errors, setErrors] = useState({
    selectedSession: "",
    electionRound: "",
    startDateTime: "",
    endDateTime: "",
    dateRange: "",
    apiError: ""
  });

  // Fetch available sessions when component mounts
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:4005/api/sessions');
        setSessions(response.data || []);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
        dateRange: field.includes("DateTime") ? "" : prev.dateRange
      }));
    }
  };

  // Format for display
  const formatDisplayDateTime = (datetime) => {
    if (!datetime) return "";
    const [date, time] = datetime.split("T");
    const [year, month, day] = date.split("-");
    let [hours, minutes] = time.split(":");

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
  };

  // Format date for API
  const formatDateForAPI = (datetime) => {
    if (!datetime) return "";
    // Just return the date portion for the API
    return datetime.split("T")[0];
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      selectedSession: "",
      electionRound: "",
      startDateTime: "",
      endDateTime: "",
      dateRange: ""
    };

    // Session validation
    if (!formData.selectedSession) {
      newErrors.selectedSession = "Please select an election session";
      isValid = false;
    }

    // Round validation
    if (!formData.electionRound) {
      newErrors.electionRound = "Please select an election round";
      isValid = false;
    }

    // Start date validation
    if (!formData.startDateTime) {
      newErrors.startDateTime = "Please select a start date and time";
      isValid = false;
    } else {
      const startDate = new Date(formData.startDateTime);
      const now = new Date();
      
      // Minimum 30 minutes in the future
      const minStartTime = new Date(now.getTime() + 30 * 60 * 1000);
      
      if (startDate < minStartTime) {
        newErrors.startDateTime = "Start time must be at least 30 minutes from now";
        isValid = false;
      }
    }

    // End date validation
    if (!formData.endDateTime) {
      newErrors.endDateTime = "Please select an end date and time";
      isValid = false;
    }

    // Date range validation
    if (formData.startDateTime && formData.endDateTime) {
      const startDate = new Date(formData.startDateTime);
      const endDate = new Date(formData.endDateTime);

      if (endDate <= startDate) {
        newErrors.dateRange = "End date must be after start date";
        isValid = false;
      }

      // Minimum duration validation (e.g., at least 1 hour)
      const minDuration = 60 * 60 * 1000; // 1 hour in milliseconds
      if (endDate - startDate < minDuration) {
        newErrors.dateRange = "Election must last at least 1 hour";
        isValid = false;
      }

      // Maximum duration validation (e.g., no more than 30 days)
      const maxDuration = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
      if (endDate - startDate > maxDuration) {
        newErrors.dateRange = "Election cannot last more than 30 days";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    setIsCreating(true);

    try {
      // Map form data to API request structure
      const electionData = {
        election_type: formData.electionRound === "Primary Round" ? "primary" : "general",
        start_date: formatDateForAPI(formData.startDateTime),
        end_date: formatDateForAPI(formData.endDateTime),
        session_id: parseInt(formData.selectedSession)
      };

      // Call the API to create the election
      const response = await axios.post(
        'http://localhost:4005/api/elections',
        electionData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Election created response:", response.data);
      
      setIsCreating(false);
      setShowSuccessModal(true);

      // Reset form and navigate after success
      setTimeout(() => {
        setShowSuccessModal(false);
        setFormData({
          selectedSession: "",
          electionRound: "",
          startDateTime: "",
          endDateTime: ""
        });
        navigate("/view_election");
      }, 2000);
    } catch (error) {
      setIsCreating(false);
      console.error("Error creating election:", error);
      
      // Handle error
      setErrors(prev => ({
        ...prev,
        apiError: error.response?.data?.message || "Failed to create election. Please try again."
      }));
      
      // Show error to user
      // alert(`Error: ${errors.apiError}`);
    }
  };

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
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userId={userId}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Container */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-4xl mx-auto my-4">
            {/* Header inside the container */}
            <div className="text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Create Election</h1>
            </div>

            {/* API Error Display */}
            {errors.apiError && (
              <div className="mb-4 bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-red-600">{errors.apiError}</p>
              </div>
            )}

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
              onSubmit={handleSubmit}
            >
              {/* Session Selection */}
              <div className="col-span-1">
                <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                  Session
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.selectedSession}
                    onChange={(e) => handleInputChange("selectedSession", e.target.value)}
                    className={`w-full p-2 sm:p-3 border ${
                      errors.selectedSession ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                  >
                    <option value="" disabled hidden>
                      Select Election session
                    </option>
                    {sessions.length > 0 ? (
                      sessions.map(session => (
                        <option key={session.session_id} value={session.session_id}>
                          {session.session_name || `Session ${session.session_id}`}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">Election 2008</option>
                        <option value="2">Election 2014</option>
                        <option value="3">Election 2018</option>
                        <option value="4">Election 2024</option>
                      </>
                    )}
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.selectedSession && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.selectedSession}
                  </p>
                )}
              </div>

              {/* Election Round Dropdown */}
              <div className="col-span-1">
                <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                  Election Round
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.electionRound}
                    onChange={(e) => handleInputChange("electionRound", e.target.value)}
                    className={`w-full p-2 sm:p-3 border ${
                      errors.electionRound ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                  >
                    <option value="" disabled hidden>
                      Select Election Round
                    </option>
                    <option value="Primary Round">Primary Round</option>
                    <option value="General Round">General Round</option>
                  </select>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.electionRound && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.electionRound}
                  </p>
                )}
              </div>

              {/* Date and Time Selection */}
              <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                    Start Date and Time
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.startDateTime}
                      onChange={(e) => handleInputChange("startDateTime", e.target.value)}
                      className={`w-full p-2 sm:p-3 border ${
                        errors.startDateTime ? "border-red-500" : "border-[#7083F5]"
                      } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {errors.startDateTime && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.startDateTime}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                    End Date and Time
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={formData.endDateTime}
                      onChange={(e) => handleInputChange("endDateTime", e.target.value)}
                      className={`w-full p-2 sm:p-3 border ${
                        errors.endDateTime || errors.dateRange ? "border-red-500" : "border-[#7083F5]"
                      } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                      min={
                        formData.startDateTime || 
                        new Date(new Date().getTime() + 30 * 60 * 1000).toISOString().slice(0, 16)
                      }
                    />
                    <svg
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  {errors.endDateTime && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.endDateTime}
                    </p>
                  )}
                  {errors.dateRange && !errors.endDateTime && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">
                      {errors.dateRange}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="col-span-1 sm:col-span-2 flex justify-center pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
                >
                  <span className="font-medium">Create Election</span>
                </button>
              </div>
            </form>
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
                  Confirm Election Creation
                </h3>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg text-left">
                  <p className="text-gray-600 font-medium">Election Details:</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Session ID:</span> {formData.selectedSession || "Not selected"}</p>
                    <p><span className="font-medium">Election Type:</span> {formData.electionRound || "Not selected"}</p>
                    <p><span className="font-medium">Start:</span> {formData.startDateTime ? formatDisplayDateTime(formData.startDateTime) : "Not set"}</p>
                    <p><span className="font-medium">End:</span> {formData.endDateTime ? formatDisplayDateTime(formData.endDateTime) : "Not set"}</p>
                  </div>
                </div>
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
      {isCreating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-44 pl-96">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Creating Election...
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
                  Election created successfully....
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

export default Create_election;