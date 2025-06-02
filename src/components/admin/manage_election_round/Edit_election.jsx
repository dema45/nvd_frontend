import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is installed

const Edit_election = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [selectedSession, setSelectedSession] = useState("");
  const [electionRound, setElectionRound] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [sessions, setSessions] = useState([]);
  const navigate = useNavigate();

  // Error states
  const [errors, setErrors] = useState({
    session: "",
    round: "",
    startDateTime: "",
    endDateTime: "",
    dateRange: "",
  });

  // Fetch sessions for dropdown
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        // Assuming you have an endpoint to fetch sessions
        const response = await axios.get("http://localhost:4005/api/sessions");
        console.log("Sessions data:", response.data); // Debug: log the response
        if (response.data) {
          setSessions(response.data || []);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      }
    };

    fetchSessions();
  }, []);

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString) => {
    try {
      console.log("Original dateString:", dateString);
      
      // Check if dateString includes a valid time component
      const hasTimeComponent = dateString.includes('T') || 
                              dateString.includes(' ') || 
                              dateString.includes(':');
      
      let date;
      
      if (dateString && !hasTimeComponent) {
        // If it's just a date (YYYY-MM-DD), create date object from it
        // We'll use the current time to make it more likely to pick up user's local timezone
        const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
        date = new Date();
        date.setFullYear(year);
        date.setMonth(month - 1); // Month is 0-indexed in JS
        date.setDate(day);
        
        // We don't set hours/minutes so it keeps the current time
        // This creates a local timezone date
      } else {
        // This is a full datetime string, parse normally
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error("Invalid date:", dateString);
        return "";
      }
      
      // Format in YYYY-MM-DDThh:mm format for datetime-local input
      // This method handles properly converting to local timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
      console.log("Formatted date for input:", formattedDate);
      
      return formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Fetch election data when component mounts
  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await axios.get(`http://localhost:4005/api/elections/${id}`);
        console.log("Election data from API:", response.data); // Debug: log the response
        
        if (response.data && response.data.status === "success") {
          const electionData = response.data.data;
          
          // Determine election round type
          const roundType = electionData.election_type === "primary" ? "Primary Round" : "General Round";
          
          console.log("Start date from API:", electionData.start_date);
          console.log("End date from API:", electionData.end_date);
          
          // Check if dates include time information
          const hasStartTime = (electionData.start_date && 
                              (electionData.start_date.includes('T') || 
                               electionData.start_date.includes(' ') || 
                               electionData.start_date.includes(':')));
                               
          const hasEndTime = (electionData.end_date && 
                            (electionData.end_date.includes('T') || 
                             electionData.end_date.includes(' ') || 
                             electionData.end_date.includes(':')));
          
          console.log("Has start time?", hasStartTime);
          console.log("Has end time?", hasEndTime);
          
          // Format dates for datetime-local input
          const formattedStartDate = formatDateForInput(electionData.start_date);
          const formattedEndDate = formatDateForInput(electionData.end_date);
          
          console.log("Formatted start date for input:", formattedStartDate);
          console.log("Formatted end date for input:", formattedEndDate);
          
          // Set form values
          setSelectedSession(electionData.session_id.toString());
          setElectionRound(roundType);
          setStartDateTime(formattedStartDate);
          setEndDateTime(formattedEndDate);
          
          // Extra validation for date fields
          if (!formattedStartDate || !formattedEndDate) {
            setErrorMessage("Warning: Could not parse election dates properly. Please check and update the dates.");
          }
        }
      } catch (error) {
        console.error("Error fetching election data:", error);
        setErrorMessage("Failed to load election data. Please try again.");
      }
    };

    if (id) {
      fetchElectionData();
    }
  }, [id]);

  // Format for display
  const formatDisplayDateTime = (datetime) => {
    if (!datetime) return "";
    
    try {
      console.log("Formatting for display:", datetime);
      const date = new Date(datetime);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      let hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const period = hours >= 12 ? "PM" : "AM";
      
      hours = hours % 12 || 12;
      hours = String(hours).padStart(2, '0');
      
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes} ${period}`;
      console.log("Formatted for display:", formattedDateTime);
      return formattedDateTime;
    } catch (error) {
      console.error("Error formatting display date:", error);
      return "Date format error";
    }
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      session: "",
      round: "",
      startDateTime: "",
      endDateTime: "",
      dateRange: "",
    };

    // Session validation
    if (!selectedSession) {
      newErrors.session = "Please select an election session";
      isValid = false;
    }

    // Round validation
    if (!electionRound) {
      newErrors.round = "Please select an election round";
      isValid = false;
    }

    // Start date validation
    if (!startDateTime) {
      newErrors.startDateTime = "Please select a start date and time";
      isValid = false;
    }

    // End date validation
    if (!endDateTime) {
      newErrors.endDateTime = "Please select an end date and time";
      isValid = false;
    }

    // Date range validation
    if (startDateTime && endDateTime) {
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);

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
    setIsUpdating(true);
    setErrorMessage("");

    try {
      // Map the election round to the backend's expected format
      const election_type = electionRound === "Primary Round" ? "primary" : "general";
      
      // Create date objects from the form inputs to ensure correct time
      const startDate = new Date(startDateTime);
      const endDate = new Date(endDateTime);
      
      // Log the date values for debugging
      console.log("Start DateTime from form:", startDateTime);
      console.log("End DateTime from form:", endDateTime);
      console.log("Parsed Start Date:", startDate);
      console.log("Parsed End Date:", endDate);
      
      // Format dates in ISO format for API
      const start_date = startDate.toISOString();
      const end_date = endDate.toISOString();
      
      console.log("Sending to API - Start date:", start_date);
      console.log("Sending to API - End date:", end_date);
      
      const dataToSend = {
        election_type,
        start_date,
        end_date,
        session_id: parseInt(selectedSession)
      };
      
      console.log("Full request payload:", dataToSend);
      
      const response = await axios.put(
        `http://localhost:4005/api/elections/${id}`, 
        dataToSend
      );

      if (response.data && response.data.status === "success") {
        console.log("API Response:", response.data);
        setIsUpdating(false);
        setShowSuccessModal(true);

        // Reset form after success
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate(`/view_election`); // Navigate to view page
        }, 2000);
      } else {
        console.warn("API returned non-success status:", response.data);
        throw new Error(response.data.message || "Failed to update election");
      }
    } catch (error) {
      console.error("Update Election Error:", error);
      setIsUpdating(false);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to update election");
    }
  };

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden"
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
      <div className="flex-1 flex flex-col min-h-0">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userId={userId}
        />

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-white px-6 py-5">
                <h1 className="text-3xl font-bold text-black">
                  Edit Election Round
                </h1>
              </div>

              {errorMessage && (
                <div className="mx-6 mt-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="p-6 md:p-8">
                <div className="space-y-8">
                  {/* Session Selection */}
                  <div className="w-full md:w-2/3 lg:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSession}
                        onChange={(e) => {
                          setSelectedSession(e.target.value);
                          setErrors({ ...errors, session: "" });
                        }}
                        className={`mt-1 p-3 border ${
                          errors.session ? "border-red-500" : "border-[#8EA5FE]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700 bg-white shadow-sm appearance-none`}
                        required
                      >
                        <option value="">Select a session</option>
                        {sessions.map((session) => (
                          <option key={session.session_id} value={session.session_id}>
                            {session.session_name}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.session && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.session}
                      </p>
                    )}
                  </div>

                  {/* Election Round Dropdown */}
                  <div className="w-full md:w-2/3 lg:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Election Round
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={electionRound}
                        onChange={(e) => {
                          setElectionRound(e.target.value);
                          setErrors({ ...errors, round: "" });
                        }}
                        className={`mt-1 p-3 border ${
                          errors.round ? "border-red-500" : "border-[#8EA5FE]"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700 bg-white shadow-sm appearance-none`}
                        required
                      >
                        <option value="">Select election round</option>
                        <option value="Primary Round">Primary Round</option>
                        <option value="General Round">General Round</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    {errors.round && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.round}
                      </p>
                    )}
                  </div>

                  {/* Date and Time Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date and Time
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={startDateTime}
                          onChange={(e) => {
                            setStartDateTime(e.target.value);
                            setErrors({
                              ...errors,
                              startDateTime: "",
                              dateRange: "",
                            });
                          }}
                          className={`mt-1 p-3 border ${
                            errors.startDateTime
                              ? "border-red-500"
                              : "border-[#8EA5FE]"
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700 bg-white`}
                          required
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
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
                      </div>
                      {errors.startDateTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.startDateTime}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date and Time
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="datetime-local"
                          value={endDateTime}
                          onChange={(e) => {
                            setEndDateTime(e.target.value);
                            setErrors({
                              ...errors,
                              endDateTime: "",
                              dateRange: "",
                            });
                          }}
                          className={`mt-1 p-3 border ${
                            errors.endDateTime || errors.dateRange
                              ? "border-red-500"
                              : "border-[#8EA5FE]"
                          } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700 bg-white`}
                          required
                          min={startDateTime || ""}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-gray-400"
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
                      </div>
                      {errors.endDateTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.endDateTime}
                        </p>
                      )}
                      {errors.dateRange && !errors.endDateTime && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.dateRange}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Submit Button */}
                  <div className="col-span-1 sm:col-span-2 flex justify-center pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="font-medium">Update Election</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[85vw] mx-4 flex flex-col justify-center shadow-2xl border border-gray-100">
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
                  Confirm Election Update
                </h3>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg text-left">
                  <p className="text-gray-600 font-medium">Election Details:</p>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Session ID:</span>{" "}
                      {selectedSession || "Not selected"}
                    </p>
                    <p>
                      <span className="font-medium">Round:</span>{" "}
                      {electionRound || "Not selected"}
                    </p>
                    <p>
                      <span className="font-medium">Start:</span>{" "}
                      {startDateTime
                        ? formatDisplayDateTime(startDateTime)
                        : "Not set"}
                    </p>
                    <p>
                      <span className="font-medium">End:</span>{" "}
                      {endDateTime
                        ? formatDisplayDateTime(endDateTime)
                        : "Not set"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-200 w-28 shadow-sm"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-200 w-28"
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-2xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Updating Election...
              </h3>
              <p className="text-gray-500 mt-2">
                Please wait while we process your request
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-6">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col justify-center shadow-2xl border border-gray-100">
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
                  Election Updated Successfully!
                </h3>
                <p className="text-gray-500 mt-2">
                  The election has been successfully updated.
                </p>
              </div>
              <div className="mt-8 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full"
                  style={{
                    animation: "progress 2s linear forwards",
                    width: "100%"
                  }}
                ></div>
                <style>{`
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

export default Edit_election;