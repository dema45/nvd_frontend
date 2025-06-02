import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { RefreshCw } from "lucide-react";

const Edit_party = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [partyName, setPartyName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [errors, setErrors] = useState({});
  const [partyId, setPartyId] = useState("");
  const [sessionId, setSessionId] = useState("");
  const userId = localStorage.getItem("userId");

  // State for uploaded files and their names
  const [files, setFiles] = useState({
    logo: "",
    manifesto: "",
    pledge: "",
    acceptance: "",
  });

  const [fileNames, setFileNames] = useState({
    logo: "No file uploaded",
    manifesto: "No file uploaded",
    pledge: "No file uploaded",
    acceptance: "No file uploaded",
  });

  // State for file paths after upload
  const [filePaths, setFilePaths] = useState({
    logo: "",
    manifesto: "",
    pledge: "",
    acceptance: "",
  });

  // Refs for file inputs
  const logoRef = useRef(null);
  const manifestoRef = useRef(null);
  const pledgeRef = useRef(null);
  const acceptanceRef = useRef(null);

  // Ref object for dynamic access
  const refs = {
    logo: logoRef,
    manifesto: manifestoRef,
    pledge: pledgeRef,
    acceptance: acceptanceRef,
  };

  // Function to get file name from path
  // Function to get file name from path
  const getFileNameFromPath = (path) => {
    if (!path) return "No file uploaded";
  
    try {
      // Get just the filename part from the path
      const pathParts = path.split(/[/\\]/);
      const filename = pathParts[pathParts.length - 1];
      
      // Extract the original filename (everything after the first underscore)
      const underscoreIndex = filename.indexOf('_');
      if (underscoreIndex !== -1) {
        return filename.substring(underscoreIndex + 1);
      }
      
      return filename;
    } catch (error) {
      console.error("Error parsing file name from path:", error);
      return "Unknown file";
    }
  };
  // Fetch party data on component mount
  useEffect(() => {
    const fetchPartyData = async () => {
      setIsLoading(true);
      try {
        // Extract party ID from URL path
        const pathParts = window.location.pathname.split("/");
        const idFromPath = pathParts[pathParts.length - 1];

        // Check localStorage for party ID if not in path
        const idFromStorage = localStorage.getItem("partyId");

        // Use path ID first, then fallback to localStorage
        const id = idFromPath || idFromStorage;

        console.log("ID from path:", idFromPath);
        console.log("ID from localStorage:", idFromStorage);
        console.log("Using party ID:", id);

        if (id) {
          setPartyId(id);
          const response = await axios.get(
            `http://localhost:4005/api/parties/${id}`
          );

          console.log("Raw API response:", response.data);
          console.log("Response status:", response.status);

          if (
            response.data &&
            response.data.status === "success" &&
            response.data.data
          ) {
            const partyData = response.data.data;
            console.log("Full party data object:", partyData);

            // Set form data
            setPartyName(partyData.party_name || "");
            setLeaderName(partyData.leader_name || "");
            setSessionId(partyData.session_id || "");

            const formatPath = (path) => {
              if (!path) return "";
              return path.startsWith("/") ? path : `/${path}`;
            };

            // Set file paths from the database - handle both cases for property names
            const updatedFilePaths = {
              logo: formatPath(partyData.logo_path || ""),
              pledge: formatPath(
                partyData.pledge_path || partyData.Pledge_path || ""
              ),
              manifesto: formatPath(partyData.manifesto_path || ""),
              acceptance: formatPath(partyData.acceptance_letter_path || ""),
            };

            console.log("File paths set:", updatedFilePaths);
            setFilePaths(updatedFilePaths);

            // Update fileNames based on paths
            const updatedFileNames = {
              logo: getFileNameFromPath(updatedFilePaths.logo),
              pledge: getFileNameFromPath(updatedFilePaths.pledge),
              manifesto: getFileNameFromPath(updatedFilePaths.manifesto),
              acceptance: getFileNameFromPath(updatedFilePaths.acceptance),
            };

            console.log("File names set:", updatedFileNames);
            setFileNames(updatedFileNames);

            // For logo, if it exists, create a URL for preview
            if (updatedFilePaths.logo) {
              setFiles((prev) => ({
                ...prev,
                logo: `http://localhost:4005${updatedFilePaths.logo}`,
              }));
            }

            console.log("Party data fetched successfully:", partyData);
          } else {
            console.error("Invalid response format:", response.data);
            setErrors((prev) => ({
              ...prev,
              fetch: "Failed to load party data: Invalid response format",
            }));
          }
        } else {
          console.error("No party ID found in URL path or localStorage");
          setErrors((prev) => ({
            ...prev,
            fetch:
              "No party ID found. Please navigate from the party list page.",
          }));
        }
      } catch (error) {
        console.error("Error fetching party data:", error);
        setErrors((prev) => ({
          ...prev,
          fetch: `Failed to load party data: ${error.message}`,
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPartyData();
  }, []);

  // Upload file to server and get file path
  // Upload file to server and get file path
  // Update the uploadFileToServer function in Edit_party.jsx
const uploadFileToServer = async (file, type) => {
  try {
    console.log(`Uploading ${type} file:`, file.name);
    const formData = new FormData();
    formData.append("file", file);
    
    // Send the original filename as a separate field
    formData.append("originalFilename", file.name);

    const response = await axios.post(
      "http://localhost:4005/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(`Upload response for ${type}:`, response.data);

    if (response.data.status === "success") {
      // Get the path returned from server
      const serverPath = response.data.filePath;
      const originalFilename = response.data.originalFilename;
      
      // Update file names state
      setFileNames((prev) => ({
        ...prev,
        [type]: originalFilename
      }));
      
      // Update file paths state
      setFilePaths((prev) => ({
        ...prev,
        [type]: serverPath
      }));

      return serverPath;
    }
  } catch (error) {
    console.error(`Error uploading ${type} file:`, error);
    setErrors((prev) => ({
      ...prev,
      [type]: `Failed to upload ${type} file: ${error.message}`,
    }));
    return null;
  }
};
  // Handle file upload, preview locally and prepare for server upload
  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`Handling file upload for ${type}:`, file.name);

      // Show preview locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setFiles((prevFiles) => {
          const updated = { ...prevFiles, [type]: reader.result };
          console.log(
            `Updated files preview for ${type}:`,
            updated[type].substring(0, 50) + "..."
          );
          return updated;
        });

        setFileNames((prevFileNames) => {
          const updated = { ...prevFileNames, [type]: file.name };
          console.log(`Updated file names for ${type}:`, updated[type]);
          return updated;
        });

        setErrors((prevErrors) => ({ ...prevErrors, [type]: "" }));
      };
      reader.readAsDataURL(file);

      // Upload file to server and get path
      await uploadFileToServer(file, type);
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};

    if (!partyName.trim()) {
      newErrors.partyName = "Party name is required.";
    }

    if (!leaderName.trim()) {
      newErrors.leaderName = "Leader name is required.";
    }

    // Only validate files if they're not already set in the database
    if (!filePaths.logo && !files.logo) {
      newErrors.logo = "Party logo is required.";
    }

    if (!filePaths.manifesto && !files.manifesto) {
      newErrors.manifesto = "Manifesto is required.";
    }

    if (!filePaths.pledge && !files.pledge) {
      newErrors.pledge = "Pledge is required.";
    }

    if (!filePaths.acceptance && !files.acceptance) {
      newErrors.acceptance = "Acceptance letter is required.";
    }

    console.log("Form validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted. Validating...");

    if (validateForm()) {
      console.log("Form validation successful. Showing confirmation modal.");
      setShowConfirmationModal(true);
    } else {
      console.log("Form validation failed. Please check the errors.");
    }
  };

  // Handle confirmation and make API call
  const handleConfirm = async () => {
    setShowConfirmationModal(false);
    setIsUpdating(true);
  
    try {
      // Prepare data for API
      const updateData = {
        session_id: sessionId,
        party_name: partyName,
        leader_name: leaderName,
      };
  
      // Only include file paths that have values - these are stored with prefixed unique IDs
      if (filePaths.logo) updateData.logo_path = filePaths.logo;
      if (filePaths.pledge) updateData.Pledge_path = filePaths.pledge;
      if (filePaths.manifesto) updateData.manifesto_path = filePaths.manifesto;
      if (filePaths.acceptance) updateData.acceptance_letter_path = filePaths.acceptance;
  
      // Make API call to update party
      const response = await axios.put(
        `http://localhost:4005/api/parties/${partyId}`,
        updateData
      );
      console.log("Update response:", response.data);
  
      if (response.data.status === "success") {
        setIsUpdating(false);
        setShowSuccessModal(true);
  
        // Auto-close success modal after 2 seconds
        setTimeout(() => {
          setShowSuccessModal(false);
          // Optionally redirect after successful update
          window.location.href = "/view_party";
        }, 2000);
      } else {
        throw new Error(response.data.message || "Failed to update party");
      }
    } catch (error) {
      setIsUpdating(false);
      console.error("Error updating party:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Failed to update party",
      }));
    }
  };

  // Function to render file display for document files
  const renderFileDisplay = (type) => {
    // For newly uploaded files
    if (files[type] && type === "logo") {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-blue-600 text-sm truncate max-w-xs">
            {fileNames[type]}
          </span>
        </div>
      );
    }
    // For newly uploaded document files
    else if (files[type] && type !== "logo") {
      return (
        <div className="flex items-center space-x-4">
          <span className="text-blue-600 text-sm truncate max-w-xs">
            {fileNames[type]}
          </span>
        </div>
      );
    }
    // For existing files in the database
    else if (filePaths[type]) {
      const filename = filePaths[type].split('/').pop();
      const fileUrl = `http://localhost:4005/api/download/${filename}`;
      

      return (
        <a
          href={fileUrl}
          className="text-blue-600 text-sm truncate max-w-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          {fileNames[type]}
        </a>
      );
    }
    // No file uploaded
    else {
      return <span className="text-gray-500 text-sm">No file uploaded</span>;
    }
  };

  // Debug current state values
  useEffect(() => {
    console.log("Current state:", {
      partyName,
      leaderName,
      sessionId,
      files,
      fileNames,
      filePaths,
      errors,
      isLoading,
    });
  }, [
    partyName,
    leaderName,
    sessionId,
    files,
    fileNames,
    filePaths,
    errors,
    isLoading,
  ]);

  // Function to navigate back to party list
  const navigateToPartyList = () => {
    window.location.href = "/party-list";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
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
          {/* Container for Header and Form */}
          <div className="bg-white shadow-xl p-6 sm:p-8 lg:p-12 rounded-lg w-full max-w-4xl mx-auto">
            {/* Header inside the container */}
            <div className="text-left mb-6">
              <h1 className="text-3xl font-bold">Edit Political Party</h1>
              {errors.fetch && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  <p>{errors.fetch}</p>
                  <button
                    className="mt-2 bg-[#7083F5] text-white py-2 px-4 rounded-lg text-sm"
                    onClick={navigateToPartyList}
                  >
                    Return to Party List
                  </button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7083F5]"></div>
                <span className="ml-4 text-gray-600">
                  Loading party data...
                </span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col lg:flex-row gap-10"
              >
                {/* Logo Section */}
                <div className="flex flex-col items-center">
                  <label className="block text-gray-700 text-lg font-medium mb-4">
                    Party Logo Change
                  </label>
                  <div className="w-64 h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4 relative overflow-hidden">
                    {/* Logo display logic */}
                    {files.logo ? (
                      <>
                        <img
                          src={files.logo}
                          alt="Party Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error("Error loading logo image:", e);
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlOWVjZWYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzZjNzU3ZCI+TG9nbyBFcnJvcjwvdGV4dD48L3N2Zz4=";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white p-2 text-xs truncate">
                          {fileNames.logo}
                        </div>
                      </>
                    ) : filePaths.logo ? (
                      <>
                        <img
                          src={`http://localhost:4005${filePaths.logo.split('?')[0]}`}
                          alt="Party Logo"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            console.error("Error loading existing logo:", e);
                            e.target.onerror = null;
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlOWVjZWYiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZmlsbD0iIzZjNzU3ZCI+TG9nbyBFcnJvcjwvdGV4dD48L3N2Zz4=";
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white p-2 text-xs truncate">
                          {fileNames.logo}
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500 text-sm text-center">
                        Upload Party Logo
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="bg-[#7083F5] text-white py-2 px-4 rounded-lg text-sm"
                    onClick={() => refs.logo.current.click()}
                  >
                    Change Logo
                  </button>
                  <input
                    type="file"
                    ref={refs.logo}
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, "logo")}
                    accept="image/*"
                  />
                  {errors.logo && (
                    <p className="text-red-500 text-sm mt-2">{errors.logo}</p>
                  )}
                </div>

                {/* Form Fields */}
                <div className="flex-1 grid grid-cols-1 gap-6">
                  {/* Party Name */}
                  <div>
                    <label className="block text-gray-700 text-lg font-medium">
                      Party Name
                    </label>
                    <input
                      type="text"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                      placeholder="Enter party name"
                    />
                    {errors.partyName && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.partyName}
                      </p>
                    )}
                  </div>

                  {/* Leader Name */}
                  <div>
                    <label className="block text-gray-700 text-lg font-medium">
                      Leader Name
                    </label>
                    <input
                      type="text"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="w-full p-3 border border-[#7083F5] rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                      placeholder="Enter leader name"
                    />
                    {errors.leaderName && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.leaderName}
                      </p>
                    )}
                  </div>

                  {/* Manifesto Section */}
                  <div>
                    <label className="block text-gray-700 text-lg font-medium">
                      Manifesto
                    </label>
                    <div className="w-full p-3 border border-[#7083F5] rounded-lg bg-white flex items-center justify-between">
                      {renderFileDisplay("manifesto")}
                      <button
                        type="button"
                        onClick={() => refs.manifesto.current.click()}
                        className="text-gray-500 hover:text-[#7083F5]"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={refs.manifesto}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "manifesto")}
                    />
                    {errors.manifesto && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.manifesto}
                      </p>
                    )}
                  </div>

                  {/* Pledge Section */}
                  <div>
                    <label className="block text-gray-700 text-lg font-medium">
                      Pledge
                    </label>
                    <div className="w-full p-3 border border-[#7083F5] rounded-lg bg-white flex items-center justify-between">
                      {renderFileDisplay("pledge")}
                      <button
                        type="button"
                        onClick={() => refs.pledge.current.click()}
                        className="text-gray-500 hover:text-[#7083F5]"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={refs.pledge}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "pledge")}
                    />
                    {errors.pledge && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.pledge}
                      </p>
                    )}
                  </div>

                  {/* Acceptance Letter Section */}
                  <div>
                    <label className="block text-gray-700 text-lg font-medium">
                      Acceptance Letter
                    </label>
                    <div className="w-full p-3 border border-[#7083F5] rounded-lg bg-white flex items-center justify-between">
                      {renderFileDisplay("acceptance")}
                      <button
                        type="button"
                        onClick={() => refs.acceptance.current.click()}
                        className="text-gray-500 hover:text-[#7083F5]"
                      >
                        <RefreshCw className="w-5 h-5" />
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={refs.acceptance}
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "acceptance")}
                    />
                    {errors.acceptance && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.acceptance}
                      </p>
                    )}
                  </div>

                  {/* Submit Button and Error Message */}
                  <div className="flex flex-col items-start mt-4">
                    {errors.submit && (
                      <div className="w-full p-3 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        <p>{errors.submit}</p>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="bg-[#7083F5] text-white py-3 px-10 rounded-lg text-xl font-semibold hover:bg-[#5a6bbf] transition duration-300"
                    >
                      Update Party
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="mt-[-200px] ml-[200px]">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] h-[220px] mx-4 flex flex-col justify-between">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-blue-500"
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
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  Confirm Update
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to update this party?
                </p>
              </div>
              <div className="w-full flex justify-center space-x-4">
                <button
                  type="button"
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 w-28"
                  onClick={() => setShowConfirmationModal(false)}
                >
                  No
                </button>
                <button
                  type="button"
                  className="px-6 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-[#7083F5] hover:bg-[#5269F2] focus:outline-none focus:ring-2 focus:ring-[#7083F5] focus:ring-offset-2 w-28"
                  onClick={handleConfirm}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Indicator */}
      {isUpdating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="mt-[-200px] ml-[200px]">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] h-[220px] mx-4 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#7083F5] mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">
                Updating Party...
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="mt-[-200px] ml-[200px]">
            <div className="bg-white rounded-lg p-6 w-[500px] max-w-[90vw] h-[220px] mx-4 flex flex-col justify-between">
              <div className="text-center">
                <svg
                  className="h-12 w-12 text-green-500 mx-auto"
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
                <h3 className="text-lg font-medium text-gray-900 mt-2">
                  Success!
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Party updated successfully.
                </p>
              </div>
              <div className="w-full">
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{
                      animation: "progress 2s linear forwards",
                      width: "100%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add this CSS for the progress animation */}
      <style jsx>{`
        @keyframes progress {
          0% {
            width: 0%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Edit_party;
