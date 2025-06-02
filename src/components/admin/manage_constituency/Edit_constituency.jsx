import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";

const Edit_constituency = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const { id } = useParams(); // Get constituency ID from URL
  const navigate = useNavigate();

  // State for form inputs
  const [formData, setFormData] = useState({
    dzongkhagId: "",
    constituencyName: "",
  });
  const [dzongkhags, setDzongkhags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // State for validation errors
  const [errors, setErrors] = useState({
    dzongkhagId: "",
    constituencyName: "",
  });

  // Fetch dzongkhags and constituency data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch dzongkhags
        const dzongkhagResponse = await fetch("http://localhost:4005/api/dzongkhags");
        if (!dzongkhagResponse.ok) {
          throw new Error(`Failed to fetch dzongkhags. Status: ${dzongkhagResponse.status}`);
        }
        const dzongkhagData = await dzongkhagResponse.json();
        setDzongkhags(dzongkhagData);
        
        // Fetch constituency data
        if (id) {
          const constituencyResponse = await fetch(`http://localhost:4005/api/constituencies/${id}`);
          if (!constituencyResponse.ok) {
            throw new Error(`Failed to fetch constituency. Status: ${constituencyResponse.status}`);
          }
          const constituencyData = await constituencyResponse.json();
          
          // Set form data
          setFormData({
            dzongkhagId: constituencyData.dzongkhag_id,
            constituencyName: constituencyData.constituency_name,
          });
        } else {
          setError("Constituency ID is missing");
          setTimeout(() => navigate("/view_constituency"), 3000);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      dzongkhagId: "",
      constituencyName: "",
    };

    // Validate Dzongkhag selection
    if (!formData.dzongkhagId) {
      newErrors.dzongkhagId = "Please select a Dzongkhag";
      isValid = false;
    }

    // Validate Constituency Name
    if (!formData.constituencyName.trim()) {
      newErrors.constituencyName = "Constituency Name is required";
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

  // Handle confirmation
  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    setIsUpdating(true);
    
    try {
      // Make API call to update the constituency
      const response = await fetch(`http://localhost:4005/api/constituencies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dzongkhag_id: formData.dzongkhagId,
          constituency_name: formData.constituencyName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update constituency. Status: ${response.status}`);
      }

      setIsUpdating(false);
      setShowSuccessModal(true);
      
      // Auto-close after 2 seconds and redirect
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/view_constituency");
      }, 2000);
    } catch (error) {
      console.error("Error updating constituency:", error);
      setError(error.message || "Failed to update constituency");
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100" style={{fontFamily:"Poppins"}}>
      {/* Sidebar */}
      <div
        className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

        <main className="p-6 flex-grow flex flex-col items-center">
          {/* Header */}
          <div className="w-full max-w-4xl text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Edit Constituency</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="w-full max-w-3xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              <p>{error}</p>
            </div>
          )}

          {/* Form Container */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-3xl md:max-w-2xl">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              {/* Dzongkhag Selection */}
              <div className="flex flex-col items-center">
                <label className="block text-gray-700 text-lg font-medium mb-2 text-left w-full max-w-md">
                  Dzongkhag
                </label>
                <select
                  name="dzongkhagId"
                  value={formData.dzongkhagId}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.dzongkhagId ? "border-red-500" : "border-[#7083F5]"
                  } rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5] max-w-md mx-auto`}
                >
                  <option value="">Select Dzongkhag</option>
                  {dzongkhags.map((dzongkhag) => (
                    <option key={dzongkhag.dzongkhag_id} value={dzongkhag.dzongkhag_id}>
                      {dzongkhag.dzongkhag_name}
                    </option>
                  ))}
                </select>
                {errors.dzongkhagId && (
                  <p className="text-red-500 text-sm mt-1 w-full max-w-md text-left">
                    {errors.dzongkhagId}
                  </p>
                )}
              </div>

              {/* Constituency Name */}
              <div className="flex flex-col items-center">
                <label className="block text-gray-700 text-lg font-medium mb-2 text-left w-full max-w-md">
                  Constituency Name
                </label>
                <input
                  type="text"
                  name="constituencyName"
                  placeholder="Enter Constituency Name"
                  value={formData.constituencyName}
                  onChange={handleChange}
                  className={`w-full p-3 border ${
                    errors.constituencyName ? "border-red-500" : "border-[#7083F5]"
                  } rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5] max-w-md mx-auto`}
                />
                {errors.constituencyName && (
                  <p className="text-red-500 text-sm mt-1 w-full max-w-md text-left">
                    {errors.constituencyName}
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
                  <span className="font-medium">Update Constituency</span>
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 pb-28 pl-96">
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
                  Are you sure you want to update this constituency?
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-28 pl-96">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-800">
                Updating Constituency...
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-28 pl-96">
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
                  Constituency Updated Successfully.
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

export default Edit_constituency;