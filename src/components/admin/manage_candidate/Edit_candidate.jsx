import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";

const Edit_candidate = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get candidate ID from URL params
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [candidateName, setCandidateName] = useState("");
  const [candidateCID, setCandidateCID] = useState("");
  const [dzongkhagId, setDzongkhagId] = useState("");
  const [constituencyId, setConstituencyId] = useState("");
  const [partyId, setPartyId] = useState("");
  const [sessionId, setSessionId] = useState("");
  
  // Initialize with empty arrays to prevent map errors
  const [dzongkhags, setDzongkhags] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [parties, setParties] = useState([]);
  
  const [errors, setErrors] = useState({});
  const userId = localStorage.getItem("userId");

  // State for modals
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for candidate image
  const [candidateImage, setCandidateImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const imageRef = useRef(null);

  // Update the useEffect section where data fetching occurs
  useEffect(() => {
    const fetchCandidateData = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching candidate with ID:", id);
        
        // Fetch candidate data
        const candidateResponse = await axios.get(`http://localhost:4005/api/candidate/${id}`);
        console.log("Candidate response:", candidateResponse);
        
        let candidateDzongkhagId = "";
        
        if (candidateResponse.data && candidateResponse.data.data) {
          const candidateData = candidateResponse.data.data;
          
          // Set form data from fetched candidate
          setCandidateName(candidateData.candidate_name || "");
          setCandidateCID(candidateData.candidateid || "");
          setDzongkhagId(candidateData.dzongkhag_id || "");
          setConstituencyId(candidateData.constituency_id || "");
          setPartyId(candidateData.party_id || "");
          setSessionId(candidateData.session_id || "");
          
          // Store dzongkhag ID for constituencies fetch
          candidateDzongkhagId = candidateData.dzongkhag_id;
          
          // Set image preview if available
          if (candidateData.candidate_image) {
            // Ensure image path always has proper URL format
            const imageUrl = candidateData.candidate_image.startsWith('http') 
              ? candidateData.candidate_image 
              : `http://localhost:4005/${candidateData.candidate_image.replace(/^\/+/, '')}`;
            
            setImagePreview(imageUrl);
            setCandidateImage(candidateData.candidate_image);
          }
        } else {
          setError("Invalid candidate data format received from server");
          console.error("Invalid candidate data format:", candidateResponse);
        }
        
        try {
          // Fetch dzongkhags
          const dzongkhagRes = await axios.get('http://localhost:4005/api/dzongkhags');
          console.log("Dzongkhag response:", dzongkhagRes);
          
          if (dzongkhagRes.data && Array.isArray(dzongkhagRes.data)) {
            setDzongkhags(dzongkhagRes.data);
          } else {
            console.error("Invalid dzongkhag data format:", dzongkhagRes);
            setDzongkhags([]); // Set empty array to prevent mapping errors
            setError(prev => prev || "Failed to load dzongkhag data correctly");
          }
        } catch (err) {
          console.error("Error fetching dzongkhags:", err);
          setDzongkhags([]);
          setError(prev => prev || "Failed to load dzongkhag data");
        }
        
        try {
          // Use the correct API endpoint for constituencies based on dzongkhag
          // If candidateDzongkhagId is available, fetch constituencies for that dzongkhag
          // Otherwise fetch all constituencies (fallback)
          const constituencyUrl = candidateDzongkhagId 
            ? `http://localhost:4005/api/dzongkhags/${candidateDzongkhagId}/constituencies/`
            : 'http://localhost:4005/api/constituencies';
            
          const constituencyRes = await axios.get(constituencyUrl);
          console.log("Constituency response:", constituencyRes);
          
          // Handle the response properly based on its structure
          if (constituencyRes.data) {
            // Check if data is directly an array or nested in a data property
            if (Array.isArray(constituencyRes.data)) {
              setConstituencies(constituencyRes.data);
            } 
            // Check if it has a data property that's an array
            else if (constituencyRes.data.data && Array.isArray(constituencyRes.data.data)) {
              setConstituencies(constituencyRes.data.data);
            }
            // Check if it has constituencies property that's an array (another possible structure)
            else if (constituencyRes.data.constituencies && Array.isArray(constituencyRes.data.constituencies)) {
              setConstituencies(constituencyRes.data.constituencies);
            }
            else {
              console.error("Invalid constituency data structure:", constituencyRes.data);
              setConstituencies([]);
              setError(prev => prev || "Failed to parse constituency data");
            }
          } else {
            console.error("Invalid constituency data format:", constituencyRes);
            setConstituencies([]);
            setError(prev => prev || "Failed to load constituency data correctly");
          }
        } catch (err) {
          console.error("Error fetching constituencies:", err);
          setConstituencies([]);
          setError(prev => prev || "Failed to load constituency data");
        }
        
        // Updated party data handling section
try {
  // Fetch parties
  const partyRes = await axios.get('http://localhost:4005/api/parties');
  console.log("Party response:", partyRes);
  
  // Check if data is available
  if (partyRes.data) {
    // Check if the data is directly in response.data
    if (Array.isArray(partyRes.data)) {
      setParties(partyRes.data);
    } 
    // Check if the data is in response.data.data (which is the case based on the error)
    else if (partyRes.data.data && Array.isArray(partyRes.data.data)) {
      setParties(partyRes.data.data);
    }
    // Handle other potential structures
    else {
      console.error("Invalid party data structure:", partyRes.data);
      setParties([]);
      setError(prev => prev || "Failed to parse party data");
    }
  } else {
    console.error("Invalid party data format:", partyRes);
    setParties([]);
    setError(prev => prev || "Failed to load parties data correctly");
  }
} catch (err) {
  console.error("Error fetching parties:", err);
  setParties([]);
  setError(prev => prev || "Failed to load parties data");
}
        
      } catch (err) {
        console.error("Error fetching candidate data:", err);
        setError("Failed to load candidate data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
  
    if (id) {
      fetchCandidateData();
    } else {
      setError("No candidate ID provided");
      setIsLoading(false);
    }
  }, [id]);

  // Handle file upload for candidate image
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setCandidateImage(file);
        setErrors((prevErrors) => ({ ...prevErrors, image: "" }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!candidateName.trim())
      newErrors.candidateName = "Candidate name is required.";
    if (!candidateCID.trim())
      newErrors.candidateCID = "Candidate CID is required.";
    if (!dzongkhagId)
      newErrors.dzongkhagId = "Dzongkhag is required.";
    if (!constituencyId)
      newErrors.constituencyId = "Constituency is required.";
    if (!partyId)
      newErrors.partyId = "Party is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  const handleConfirmUpdate = async () => {
    setShowConfirmationModal(false);
    setIsUpdating(true);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append("candidateid", candidateCID);
      formData.append("candidate_name", candidateName);
      formData.append("session_id", sessionId);
      formData.append("dzongkhag_id", dzongkhagId);
      formData.append("constituency_id", constituencyId);
      formData.append("party_id", partyId);
      
      // Only append file if a new image was selected (File object)
      // Only append file if a new image was selected (File object)
if (candidateImage instanceof File) {
  formData.append("candidate_image", candidateImage);
} else if (typeof candidateImage === 'string' && candidateImage) {
  // If it's a string path, pass it directly
  formData.append("existing_image_path", candidateImage);
}

      console.log("Updating candidate with ID:", id);
      console.log("Form data:", Object.fromEntries(formData.entries()));

      // Update candidate
      const response = await axios.put(`http://localhost:4005/api/candidate/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Update response:", response);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/view_candidate"); // Redirect to view candidate page
      }, 2000);
      
    } catch (err) {
      console.error("Error updating candidate:", err);
      setErrors({ 
        submit: err.response?.data?.message || "Failed to update candidate. Please try again." 
      });
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-700">Loading candidate data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          <div className="text-red-500 text-center mb-4">Error</div>
          <p className="text-gray-700 text-center">{error}</p>
          <div className="flex justify-center mt-6">
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => navigate("/view_candidate")}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-gray-100"
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

        <main className="p-6 flex-grow overflow-y-auto">
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-4xl mx-auto">
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold">Edit Candidate</h1>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col lg:flex-row gap-10"
            >
              {/* Candidate Image Section */}
              <div className="flex flex-col items-center">
                <label className="block text-gray-700 text-lg font-medium mb-4">
                  Candidate Image
                </label>
                <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Candidate"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm text-center">
                      CANDIDATE
                      <br />
                      IMAGE
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="bg-[#7083F5] text-white py-2 px-4 rounded-lg text-sm"
                  onClick={() => imageRef.current.click()}
                >
                  Change Image
                </button>
                <input
                  type="file"
                  ref={imageRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2">{errors.image}</p>
                )}
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 gap-6">
                {/* Candidate Name */}
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                  />
                  {errors.candidateName && (
                    <p className="text-red-500 text-sm mt-2">
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
                    value={candidateCID}
                    onChange={(e) => setCandidateCID(e.target.value)}
                    className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                  />
                  {errors.candidateCID && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.candidateCID}
                    </p>
                  )}
                </div>

                {/* Dzongkhag Dropdown */}
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Dzongkhag
                  </label>
                  <select
                    value={dzongkhagId}
                    onChange={(e) => setDzongkhagId(e.target.value)}
                    className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                  >
                    <option value="" disabled hidden>
                      Select Dzongkhag
                    </option>
                    {dzongkhags && dzongkhags.length > 0 ? (
                      dzongkhags.map(dzongkhag => (
                        <option key={dzongkhag.dzongkhag_id} value={dzongkhag.dzongkhag_id}>
                          {dzongkhag.dzongkhag_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No dzongkhags available</option>
                    )}
                  </select>
                  {errors.dzongkhagId && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.dzongkhagId}
                    </p>
                  )}
                </div>

                {/* Constituency Dropdown */}
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Constituency
                  </label>
                  <select
                    value={constituencyId}
                    onChange={(e) => setConstituencyId(e.target.value)}
                    className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                  >
                    <option value="" disabled hidden>
                      Select Constituency
                    </option>
                    {constituencies && constituencies.length > 0 ? (
                      constituencies.map(constituency => (
                        <option key={constituency.constituency_id} value={constituency.constituency_id}>
                          {constituency.constituency_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No constituencies available</option>
                    )}
                  </select>
                  {errors.constituencyId && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.constituencyId}
                    </p>
                  )}
                </div>

                {/* Select Party */}
                <div>
                  <label className="block text-gray-700 text-lg font-medium">
                    Select Party
                  </label>
                  <select
                    value={partyId}
                    onChange={(e) => setPartyId(e.target.value)}
                    className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                  >
                    <option value="" disabled hidden>
                      Select Party
                    </option>
                    {parties && parties.length > 0 ? (
                      parties.map(party => (
                        <option key={party.party_id} value={party.party_id}>
                          {party.party_name}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No parties available</option>
                    )}
                  </select>
                  {errors.partyId && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.partyId}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-start mt-4">
                  <div className="col-span-1 sm:col-span-2 flex justify-center pt-4">
                    <button
                      type="submit"
                      className="px-8 py-3 bg-[#8EA5FE] text-white rounded-lg hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="font-medium">Update Candidate</span>
                    </button>
                  </div>
                </div>
                
                {errors.submit && (
                  <div className="mt-4 p-3 bg-red-50 text-red-500 rounded-lg text-center">
                    {errors.submit}
                  </div>
                )}
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
                  Confirm Updating
                </h3>
                <p className="text-gray-500 mt-2">
                  Are you sure you want to update this candidate?
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
                  onClick={handleConfirmUpdate}
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
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Updating Candidate...
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
                  Candidate updated successfully.
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

export default Edit_candidate;