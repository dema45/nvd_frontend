import React, { useState, useRef, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useNavigate } from 'react-router-dom';
import { Upload } from "lucide-react";
import axios from "axios";

const Create_party = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Refs for file inputs
  const logoRef = useRef(null);
  const manifestoRef = useRef(null);
  const pledgeRef = useRef(null);
  const acceptanceRef = useRef(null); 

  // State for form inputs
  const [session, setSession] = useState("");
  const [partyName, setPartyName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [manifestoFile, setManifestoFile] = useState(null);
  const [pledgeFile, setPledgeFile] = useState(null);
  const [acceptanceFile, setAcceptanceFile] = useState(null);

  // State for validation errors
  const [errors, setErrors] = useState({
    session: "",
    partyName: "",
    leaderName: "",
    logoFile: "",
    manifestoFile: "",
    pledgeFile: "",
    acceptanceFile: "",
  });

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  // Function to fetch available sessions with better error handling
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:4005/api/sessions');
      
      // Handle different response formats - direct array or {status, data} object
      if (Array.isArray(response.data)) {
        // If response.data is directly an array of sessions
        setSessions(response.data);
      } else if (response.data && response.data.status === 'success' && Array.isArray(response.data.data)) {
        // If response follows {status: 'success', data: [...]} format
        setSessions(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
        setErrorMessage("Received unexpected data format from server");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      
      // More specific error message based on the error type
      if (error.code === 'ECONNREFUSED') {
        setErrorMessage("Cannot connect to server. Please make sure the server is running.");
      } else if (error.response) {
        setErrorMessage(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        setErrorMessage("No response from server. Please check your connection.");
      } else {
        setErrorMessage("Failed to fetch sessions. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to upload a file with better error handling
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post('http://localhost:4005/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Handle different response formats
      if (response.data && response.data.filePath) {
        return response.data.filePath;
      } else if (response.data && typeof response.data === 'string') {
        // Some APIs might return the file path directly as a string
        return response.data;
      } else {
        console.error("Unexpected upload response:", response.data);
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error(error.response?.data?.message || "File upload failed");
    }
  };

  // Function to trigger file input
  const handleFileUpload = (ref, setFile) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // Function to handle file change
  const handleFileChange = (e, setFile) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      session: "",
      partyName: "",
      leaderName: "",
      logoFile: "",
      manifestoFile: "",
      pledgeFile: "",
      acceptanceFile: "",
    };

    // Validate Session
    if (!session) {
      newErrors.session = "Session is required";
      isValid = false;
    }

    // Validate Party Name
    if (!partyName.trim()) {
      newErrors.partyName = "Party Name is required";
      isValid = false;
    }

    // Validate Leader Name
    if (!leaderName.trim()) {
      newErrors.leaderName = "Leader Name is required";
      isValid = false;
    }

    // Validate Logo File
    if (!logoFile) {
      newErrors.logoFile = "Logo is required";
      isValid = false;
    }

    // Validate Manifesto File
    if (!manifestoFile) {
      newErrors.manifestoFile = "Manifesto is required";
      isValid = false;
    }

    // Validate Pledge File
    if (!pledgeFile) {
      newErrors.pledgeFile = "Pledge is required";
      isValid = false;
    }

    // Validate Acceptance Letter File
    if (!acceptanceFile) {
      newErrors.acceptanceFile = "Acceptance Letter is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Reset form fields
  const resetForm = () => {
    setSession("");
    setPartyName("");
    setLeaderName("");
    setLogoFile(null);
    setManifestoFile(null);
    setPledgeFile(null);
    setAcceptanceFile(null);

    // Reset file input refs
    if (logoRef.current) logoRef.current.value = "";
    if (manifestoRef.current) manifestoRef.current.value = "";
    if (pledgeRef.current) pledgeRef.current.value = "";
    if (acceptanceRef.current) acceptanceRef.current.value = "";

    // Clear errors
    setErrors({
      session: "",
      partyName: "",
      leaderName: "",
      logoFile: "",
      manifestoFile: "",
      pledgeFile: "",
      acceptanceFile: "",
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  // Handle retry for sessions fetch
  const handleRetryFetch = () => {
    setErrorMessage("");
    fetchSessions();
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    setIsCreating(true);
    setErrorMessage("");
    
    try {
      // Upload files first
      const logoPath = await uploadFile(logoFile);
      const pledgePath = await uploadFile(pledgeFile);
      const manifestoPath = await uploadFile(manifestoFile);
      const acceptancePath = await uploadFile(acceptanceFile);
      
      // Create party with file paths
      const partyData = {
        session_id: session,
        party_name: partyName,
        leader_name: leaderName,
        logo_path: logoPath,
        Pledge_path: pledgePath,
        manifesto_path: manifestoPath,
        acceptance_letter_path: acceptancePath
      };

      console.log("Submitting party data:", partyData);
      
      const response = await axios.post('http://localhost:4005/api/parties', partyData);
      
      // Handle different response formats
      if (response.data && response.data.status === 'success') {
        setShowSuccessModal(true);
        resetForm();
        
        // Auto-close after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/view_party");
        }, 2000);
      } else if (response.status >= 200 && response.status < 300) {
        // Some APIs might just return a 200-299 status without a specific format
        setShowSuccessModal(true);
        resetForm();
        
        setTimeout(() => {
          setShowSuccessModal(false);
          // navigate("/view_party");
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Failed to create party");
      }
    } catch (error) {
      console.error("Error creating party:", error);
      setErrorMessage(error.response?.data?.message || error.message || "Failed to create party. Please try again.");
    } finally {
      setIsCreating(false);
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
        {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Container */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-4xl mx-auto my-4">
            {/* Header inside the container */}
            <div className="text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Create Party</h1>
            </div>

            {errorMessage && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
                <p>{errorMessage}</p>
                {errorMessage.includes("sessions") && (
                  <button 
                    onClick={handleRetryFetch}
                    className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded text-sm ml-2"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7083F5]"></div>
                <span className="ml-3 text-gray-700">Loading sessions...</span>
              </div>
            ) : (
              <form 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" 
                onSubmit={handleSubmit}
              >
                {/* Session */}
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                    Session
                  </label>
                  <div className="relative">
                    <select
                      value={session}
                      onChange={(e) => {
                        setSession(e.target.value);
                        setErrors((prev) => ({ ...prev, session: "" }));
                      }}
                      className={`w-full p-2 sm:p-3 border ${
                        errors.session ? "border-red-500" : "border-[#7083F5]"
                      } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                    >
                      <option value="">Select Election Session</option>
                      {sessions.map((session, index) => (
                        <option key={session.session_id || index} value={session.session_id}>
                          {session.session_name || session.session_id}
                        </option>
                      ))}
                    </select>
                    {/* Dropdown Arrow SVG */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {errors.session && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.session}</p>
                  )}
                </div>

                {/* Party Name */}
                <div>
                  <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                    Party Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Party Name"
                    value={partyName}
                    onChange={(e) => {
                      setPartyName(e.target.value);
                      setErrors((prev) => ({ ...prev, partyName: "" }));
                    }}
                    className={`w-full p-2 sm:p-3 border ${
                      errors.partyName ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                  />
                  {errors.partyName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.partyName}</p>
                  )}
                </div>

                {/* Leader Name */}
                <div>
                  <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                    Leader Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Leader Name"
                    value={leaderName}
                    onChange={(e) => {
                      setLeaderName(e.target.value);
                      setErrors((prev) => ({ ...prev, leaderName: "" }));
                    }}
                    className={`w-full p-2 sm:p-3 border ${
                      errors.leaderName ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                  />
                  {errors.leaderName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.leaderName}</p>
                  )}
                </div>

                {/* File Upload Fields */}
                {[
                  { label: "Upload Logo", ref: logoRef, file: logoFile, error: errors.logoFile, setFile: setLogoFile, name: "logoFile" },
                  { label: "Upload Pledge", ref: pledgeRef, file: pledgeFile, error: errors.pledgeFile, setFile: setPledgeFile, name: "pledgeFile" },
                  { label: "Upload Manifesto", ref: manifestoRef, file: manifestoFile, error: errors.manifestoFile, setFile: setManifestoFile, name: "manifestoFile" },
                  { label: "Upload Acceptance Letter", ref: acceptanceRef, file: acceptanceFile, error: errors.acceptanceFile, setFile: setAcceptanceFile, name: "acceptanceFile" },
                ].map(({ label, ref, file, error, setFile, name }) => (
                  <div key={label}>
                    <label className="block text-gray-700 text-sm sm:text-lg font-medium">
                      {label}
                    </label>
                    <div
                      className={`w-full p-2 sm:p-3 border ${
                        error ? "border-red-500" : "border-[#7083F5]"
                      } rounded-lg bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                      onClick={() => handleFileUpload(ref, setFile)}
                    >
                      <span className="text-xs sm:text-sm text-gray-500 truncate">
                        {file ? file.name : label}
                      </span>
                      <Upload className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <input
                      type="file"
                      ref={ref}
                      name={name}
                      onChange={(e) => handleFileChange(e, setFile)}
                      className="hidden"
                      accept={name === "logoFile" ? "image/*" : ".pdf,.doc,.docx"}
                    />
                    {error && (
                      <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
                    )}
                  </div>
                ))}

                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-2 flex justify-center pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="font-medium">Create Party</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 pb-32 pl-96">
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
                  Confirm Creation
                </h3>
                <p className="text-gray-500 mt-2">
                  Are you sure you want to create this party?
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
      {isCreating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-32 pl-96">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Creating Party...
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-32 pl-96">
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
                  Party created successfully.
                </p>
              </div>
              <div className="mt-8 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
                  style={{
                    animation: "progress 2s linear forwards",
                  }}
                ></div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes progress {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in-up {
              animation: fade-in-up 0.3s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Create_party;