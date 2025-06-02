import React, { useState, useRef, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Create_candidate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();

  // Refs for file inputs
  const imageRef = useRef(null);

  // State for form inputs
  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [candidateCID, setCandidateCID] = useState("");
  const [dzongkhag, setDzongkhag] = useState("");
  const [dzongkhagId, setDzongkhagId] = useState("");
  const [constituency, setConstituency] = useState("");
  const [constituencyId, setConstituencyId] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [partyId, setPartyId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [electionId, setElectionId] = useState(null);

  // State for API data
  const [dzongkhags, setDzongkhags] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [topParties, setTopParties] = useState([]);

  // State for validation errors
  const [errors, setErrors] = useState({
    session: "",
    candidateName: "",
    candidateCID: "",
    dzongkhag: "",
    constituency: "",
    selectedParty: "",
    imageFile: "",
  });

  // Fetch Dzongkhags on component mount
  useEffect(() => {
    const fetchDzongkhags = async () => {
      try {
        const response = await axios.get('http://localhost:4005/api/dzongkhags/');
        if (response.data && response.data.data) {
          setDzongkhags(response.data.data);
        } else if (response.data && Array.isArray(response.data)) {
          setDzongkhags(response.data);
        } else {
          console.error("Unexpected dzongkhags data format:", response.data);
          setDzongkhags([]);
        }
      } catch (error) {
        console.error("Error fetching dzongkhags:", error);
        setDzongkhags([]);
      }
    };

    // Fetch sessions
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:4005/api/sessions/');
        if (response.data && Array.isArray(response.data)) {
          const mappedSessions = response.data.map(session => ({
            session_id: session.session_id,
            session_year: session.session_name
          }));
          setSessions(mappedSessions);
        } else if (response.data && response.data.data) {
          const mappedSessions = response.data.data.map(session => ({
            session_id: session.session_id,
            session_year: session.session_name
          }));
          setSessions(mappedSessions);
        } else {
          setSessions([
            { session_id: 23, session_year: "2023" },
            { session_id: 24, session_year: "2024" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        setSessions([
          { session_id: 23, session_year: "2023" },
          { session_id: 24, session_year: "2024" }
        ]);
      }
    };

    // Fetch latest primary election ID
    
// Replace the fetchLatestElectionId function in your useEffect with this:

// Replace the fetchLatestElectionId function in your useEffect with this:
const fetchLatestElectionId = async () => {
  try {
    const response = await axios.get('http://localhost:4005/api/elections/latest-session/primary');
    
    // Handle the nested structure: response.data.data.election.election_id
    if (response.data && response.data.data && response.data.data.election && response.data.data.election.election_id) {
      setElectionId(response.data.data.election.election_id);
    } else {
      console.error("Unexpected election data format:", response.data);
    }
  } catch (error) {
    console.error("Error fetching latest election ID:", error);
  }
};

    fetchDzongkhags();
    fetchSessions();
    fetchLatestElectionId();
  }, []);

  // Fetch constituencies when dzongkhag changes
  useEffect(() => {
    if (dzongkhagId) {
      const fetchConstituencies = async () => {
        try {
          const response = await axios.get(`http://localhost:4005/api/dzongkhags/${dzongkhagId}/constituencies/`);
          
          if (response.data && response.data.constituencies) {
            setConstituencies(response.data.constituencies);
          } else if (response.data && Array.isArray(response.data)) {
            setConstituencies(response.data);
          } else if (response.data && response.data.data) {
            setConstituencies(response.data.data);
          } else {
            console.error("Unexpected constituencies data format:", response.data);
            setConstituencies([]);
          }
        } catch (error) {
          console.error("Error fetching constituencies:", error);
          setConstituencies([]);
        }
      };

      fetchConstituencies();
    } else {
      setConstituencies([]);
    }
  }, [dzongkhagId]);

  // Fetch top two parties when session changes
  useEffect(() => {
    if (session && electionId) {
      const fetchTopParties = async () => {
        try {
          const response = await axios.get(`http://localhost:4005/api/getTopTwoPrimaryParties?session_id=${session}&election_id=${electionId}`);
          if (response.data && Array.isArray(response.data)) {
            setTopParties(response.data);
          } else {
            console.error("Unexpected top parties data format:", response.data);
            setTopParties([]);
          }
        } catch (error) {
          console.error("Error fetching top parties:", error);
          setTopParties([]);
        }
      };

      fetchTopParties();
    } else {
      setTopParties([]);
    }
  }, [session, electionId]);

  // Function to trigger file input
  const handleFileUpload = (ref) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  // Function to handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setErrors((prev) => ({ ...prev, imageFile: "" }));
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      session: "",
      candidateName: "",
      candidateCID: "",
      dzongkhag: "",
      constituency: "",
      selectedParty: "",
      imageFile: "",
    };

    // Validate Session
    if (!session) {
      newErrors.session = "Session is required";
      isValid = false;
    }

    // Validate Candidate Name
    if (!candidateName.trim()) {
      newErrors.candidateName = "Candidate Name is required";
      isValid = false;
    }

    // Validate Candidate CID
    if (!candidateCID.trim()) {
      newErrors.candidateCID = "Candidate CID is required";
      isValid = false;
    }

    // Validate Dzongkhag
    if (!dzongkhagId) {
      newErrors.dzongkhag = "Dzongkhag is required";
      isValid = false;
    }

    // Validate Constituency
    if (!constituencyId) {
      newErrors.constituency = "Constituency is required";
      isValid = false;
    }

    // Validate Selected Party
    if (!partyId) {
      newErrors.selectedParty = "Party is required";
      isValid = false;
    }

    // Validate Image File
    if (!imageFile) {
      newErrors.imageFile = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Reset form fields
  const resetForm = () => {
    setSession("");
    setCandidateName("");
    setCandidateCID("");
    setDzongkhag("");
    setDzongkhagId("");
    setConstituency("");
    setConstituencyId("");
    setSelectedParty("");
    setPartyId("");
    setImageFile(null);
    setImagePreview("");

    // Reset file input refs
    if (imageRef.current) imageRef.current.value = "";

    // Clear errors
    setErrors({
      session: "",
      candidateName: "",
      candidateCID: "",
      dzongkhag: "",
      constituency: "",
      selectedParty: "",
      imageFile: "",
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  // Handle confirmation and API call
  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    setIsCreating(true);

    try {
      // First upload the image
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const uploadResponse = await axios.post('http://localhost:4005/api/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const imagePath = uploadResponse.data.filePath || 'uploads/' + imageFile.name;
      
      // Now create the candidate with the image path
      const candidateData = {
        candidateid: candidateCID,
        candidate_name: candidateName,
        session_id: parseInt(session),
        dzongkhag_id: parseInt(dzongkhagId),
        constituency_id: parseInt(constituencyId),
        party_id: parseInt(partyId),
        candidate_image: imagePath
      };
      
      await axios.post('http://localhost:4005/api/candidate/', candidateData);
      
      // Show success message
      setIsCreating(false);
      setShowSuccessModal(true);
      
      // Reset form after showing success
      resetForm();
      
      // Redirect to view_candidates after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/view_candidate");
      }, 2000);
      
    } catch (error) {
      setIsCreating(false);
      console.error("Error creating candidate:", error);
      alert("An error occurred while creating the candidate. Please try again.");
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
      <div className="flex-1 flex flex-col">
        <Navbar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          userId={userId}
        />

        <main className="p-6 flex-grow flex flex-col items-center">
          {/* Container */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-4xl">
            {/* Header inside the container */}
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold">Create Candidate</h1>
            </div>

            <form
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              onSubmit={handleSubmit}
            >
              {/* Session */}
              <div className="col-span-1 sm:col-span-2">
                <label className="block text-gray-700 text-lg font-medium">
                  Session
                </label>
                <div className="relative">
                  <select
                    value={session}
                    onChange={(e) => {
                      setSession(e.target.value);
                      setErrors((prev) => ({ ...prev, session: "" }));
                    }}
                    className={`w-full p-3 border ${
                      errors.session ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                  >
                    <option value="">Select Election Session</option>
                    {sessions.map((sess) => (
                      <option key={sess.session_id} value={sess.session_id}>
                        {sess.session_year}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.session && (
                  <p className="text-red-500 text-sm mt-1">{errors.session}</p>
                )}
              </div>

              {/* Candidate Name */}
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Candidate Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Candidate Name"
                  value={candidateName}
                  onChange={(e) => {
                    setCandidateName(e.target.value);
                    setErrors((prev) => ({ ...prev, candidateName: "" }));
                  }}
                  className={`w-full p-3 border ${
                    errors.candidateName ? "border-red-500" : "border-[#7083F5]"
                  } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                />
                {errors.candidateName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.candidateName}
                  </p>
                )}
              </div>

              {/* Candidate CID */}
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Candidate CID
                </label>
                <input
                  type="text"
                  placeholder="Enter Candidate CID"
                  value={candidateCID}
                  onChange={(e) => {
                    setCandidateCID(e.target.value);
                    setErrors((prev) => ({ ...prev, candidateCID: "" }));
                  }}
                  className={`w-full p-3 border ${
                    errors.candidateCID ? "border-red-500" : "border-[#7083F5]"
                  } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                />
                {errors.candidateCID && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.candidateCID}
                  </p>
                )}
              </div>

              {/* Dzongkhag Dropdown */}
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Dzongkhag
                </label>
                <div className="relative">
                  <select
                    value={dzongkhagId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setDzongkhagId(id);
                      setDzongkhag(dzongkhags.find(d => d.dzongkhag_id.toString() === id)?.dzongkhag_name || '');
                      setConstituency('');
                      setConstituencyId('');
                      setErrors((prev) => ({
                        ...prev,
                        dzongkhag: "",
                        constituency: "",
                      }));
                    }}
                    className={`w-full p-3 border ${
                      errors.dzongkhag ? "border-red-500" : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                  >
                    <option value="">Select Dzongkhag</option>
                    {dzongkhags.map((dz) => (
                      <option key={dz.dzongkhag_id} value={dz.dzongkhag_id}>
                        {dz.dzongkhag_name}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.dzongkhag && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.dzongkhag}
                  </p>
                )}
              </div>

              {/* Constituency Dropdown */}
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Constituency
                </label>
                <div className="relative">
                  <select
                    value={constituencyId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setConstituencyId(id);
                      setConstituency(constituencies.find(c => c.constituency_id.toString() === id)?.constituency_name || '');
                      setErrors((prev) => ({ ...prev, constituency: "" }));
                    }}
                    className={`w-full p-3 border ${
                      errors.constituency
                        ? "border-red-500"
                        : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                    disabled={!dzongkhagId}
                  >
                    <option value="">Select Constituency</option>
                    {constituencies.map((cons) => (
                      <option key={cons.constituency_id} value={cons.constituency_id}>
                        {cons.constituency_name}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.constituency && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.constituency}
                  </p>
                )}
              </div>

              {/* Select Party - Now showing only top two parties */}
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Select Party
                </label>
                <div className="relative">
                  <select
                    value={partyId}
                    onChange={(e) => {
                      const id = e.target.value;
                      setPartyId(id);
                      setSelectedParty(topParties.find(p => p.party_id.toString() === id)?.party_name || '');
                      setErrors((prev) => ({ ...prev, selectedParty: "" }));
                    }}
                    className={`w-full p-3 border ${
                      errors.selectedParty
                        ? "border-red-500"
                        : "border-[#7083F5]"
                    } rounded-lg bg-white text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7083F5] appearance-none`}
                    disabled={!session} // Disable if no session is selected
                  >
                    <option value="">Select Party</option>
                    {topParties.map((party) => (
                      <option key={party.party_id} value={party.party_id}>
                        {party.party_name}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
                {errors.selectedParty && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.selectedParty}
                  </p>
                )}
              </div>

              {/* Upload Image */}
              <div>
                <label className="block text-gray-700 text-lg font-medium">
                  Upload Image
                </label>
                <div
                  className={`w-full p-3 border ${
                    errors.imageFile ? "border-red-500" : "border-[#7083F5]"
                  } rounded-lg bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7083F5]`}
                  onClick={() => handleFileUpload(imageRef)}
                >
                  <span className="text-sm text-gray-500">
                    {imageFile ? imageFile.name : "Upload Image"}
                  </span>
                  <Upload className="text-gray-500 w-5 h-5" />
                </div>
                <input
                  type="file"
                  ref={imageRef}
                  name="imageFile"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {errors.imageFile && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.imageFile}
                  </p>
                )}
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-20 w-20 object-cover rounded-md" 
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="col-span-1 sm:col-span-2 flex justify-center pt-4">
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <span className="font-medium">Create Candidate</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
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
                  Are you sure you want to create this candidate?
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Creating Candidate...
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
                  Success!
                </h3>
                <p className="text-gray-500 mt-2">
                  Candidate created successfully....
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

export default Create_candidate;