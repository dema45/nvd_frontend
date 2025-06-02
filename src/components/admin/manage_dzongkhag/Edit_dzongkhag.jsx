import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { useParams, useNavigate } from "react-router-dom";

const Edit_dzongkhag = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const { id } = useParams(); // Get dzongkhag ID from URL
  const navigate = useNavigate();

  // State for form inputs
  const [dzongkhagName, setDzongkhagName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // State for validation errors
  const [errors, setErrors] = useState({
    dzongkhagName: "",
  });

  // Fetch existing dzongkhag data
  useEffect(() => {
    const fetchDzongkhagData = async () => {
      try {
        const response = await fetch(`http://localhost:4005/api/dzongkhags/${id}`);
        if (!response.ok) throw new Error("Failed to fetch dzongkhag data");
        const data = await response.json();
        setDzongkhagName(data.dzongkhag_name);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDzongkhagData();
  }, [id]);

  // Validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = { dzongkhagName: "" };

    if (!dzongkhagName.trim()) {
      newErrors.dzongkhagName = "Dzongkhag Name is required";
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
      const response = await fetch(`http://localhost:4005/api/dzongkhags/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dzongkhag_name: dzongkhagName })
      });

      if (!response.ok) throw new Error("Failed to update dzongkhag");
      
      setIsUpdating(false);
      setShowSuccessModal(true);
      
      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate("/view_dzongkhag"); // Redirect to view dzongkhags
      }, 2000);
      
    } catch (error) {
      setIsUpdating(false);
      setError("Error updating dzongkhag: " + error.message);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-gray-700">Loading dzongkhag data...</p>
    </div>
  );
  
  if (error && !isUpdating) return <p className="text-center text-red-500 mt-4">{error}</p>;

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
          {/* Header outside the form */}
          <div className="w-full max-w-4xl text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Edit Dzongkhag</h1>
          </div>

          {/* Form Container */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-2xl w-full max-w-3xl md:max-w-2xl">
            <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
              {/* Dzongkhag Name */}
              <div className="flex flex-col items-center">
                <label className="block text-gray-700 text-lg font-medium mb-2 text-left w-full max-w-md">
                  Dzongkhag Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Dzongkhag Name"
                  value={dzongkhagName}
                  onChange={(e) => setDzongkhagName(e.target.value)}
                  className={`w-full p-3 border ${
                    errors.dzongkhagName ? "border-red-500" : "border-[#7083F5]"
                  } rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5] max-w-md mx-auto`}
                />
                {errors.dzongkhagName && (
                  <p className="text-red-500 text-sm mt-1 w-full max-w-md text-left">
                    {errors.dzongkhagName}
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
                  <span className="font-medium">Update Dzongkhag</span>
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
                  Confirm Updating
                </h3>
                <p className="text-gray-500 mt-2">
                  Are you sure you want to Update this dzongkhag?
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
                Updating Dzongkhag...
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
                  Dzongkhag Updated Successfully.
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

export default Edit_dzongkhag;