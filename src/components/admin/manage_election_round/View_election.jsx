import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const View_election = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // Elections data
  const [elections, setElections] = useState([]);

  // Fetch sessions and elections on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch sessions first
        const sessionsResponse = await axios.get(
          "http://localhost:4005/api/sessions/"
        );
        const sessionsData =
          sessionsResponse.data?.data || sessionsResponse.data || [];
        setSessions(sessionsData);

        // Then fetch elections
        const electionsResponse = await axios.get(
          "http://localhost:4005/api/elections"
        );

        // Transform the data to match your frontend structure
        const transformedElections = electionsResponse.data.data.map(
          (election) => ({
            id: election.election_id,
            name: election.election_type,
            session_id: election.session_id,
            startDate: election.start_date,
            endDate: election.end_date,
          })
        );

        setElections(transformedElections);
        setTotalItems(transformedElections.length);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate total items whenever elections change
  useEffect(() => {
    setTotalItems(getFilteredElections().length);
  }, [elections, selectedSession, searchTerm]);

  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
    setCurrentPage(1); // Reset to first page when session changes
  };

  // Filter elections based on search term and session
  const getFilteredElections = () => {
    let filtered = [...elections];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((election) =>
        election.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply session filter
    if (selectedSession) {
      filtered = filtered.filter(
        (election) => election.session_id === parseInt(selectedSession)
      );
    }

    // Sort by newest first (based on start date)
    filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    return filtered;
  };

  // Get current elections for pagination
  const getCurrentElections = () => {
    const filteredElections = getFilteredElections();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredElections.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next page
  const nextPage = () => {
    const filteredElections = getFilteredElections();
    if (currentPage < Math.ceil(filteredElections.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDeleteClick = (electionId, electionName) => {
    setElectionToDelete({ id: electionId, name: electionName });
    setShowDeleteModal(true);
  };

const handleConfirmDelete = async () => {
  setIsDeleting(true);

  try {
    // Make API call to delete election
    await axios.delete(
      `http://localhost:4005/api/elections/${electionToDelete.id}`
    );

    // Remove the election from the list
    const updatedElections = elections.filter(
      (election) => election.id !== electionToDelete.id
    );
    setElections(updatedElections);

    // Get filtered elections count AFTER removing the deleted election
    const filteredElectionsAfterDelete = updatedElections.filter(election => {
      let matches = true;
      
      // Apply search filter
      if (searchTerm) {
        matches = matches && election.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      // Apply session filter  
      if (selectedSession) {
        matches = matches && election.session_id === parseInt(selectedSession);
      }
      
      return matches;
    });

    // Adjust current page if needed (if last item on page was deleted)
    const totalPages = Math.ceil(filteredElectionsAfterDelete.length / itemsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }

    setIsDeleting(false);
    setShowDeleteModal(false);
    setShowSuccessModal(true);
    setElectionToDelete(null);

    // Hide success message after 2 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  } catch (error) {
    console.error("Error deleting election:", error);
    setIsDeleting(false);
    setShowDeleteModal(false);
    
    // Optional: Add error handling UI
    setError("Failed to delete election. Please try again.");
    setTimeout(() => {
      setError(null);
    }, 3000);
  }
};

  const handleEditClick = (electionId) => {
    // Navigate to edit page with election ID
    navigate(`/edit_election/${electionId}`);
  };

  // Get session name by ID
  const getSessionName = (sessionId) => {
    const session = sessions.find((s) => s.session_id === sessionId);
    return session ? session.session_name : "Unknown Session";
  };

  // Calculate total pages
  const filteredElections = getFilteredElections();
  const totalPages = Math.ceil(filteredElections.length / itemsPerPage);
  const currentElections = getCurrentElections();
  const startItem =
    filteredElections.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(
    currentPage * itemsPerPage,
    filteredElections.length
  );

  return (
    <div
      className="flex h-screen overflow-hidden bg-gray-50"
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

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="w-1/3 mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Session
              </label>
              <select
                value={selectedSession}
                onChange={handleSessionChange}
                className="mt-1 p-2 border border-[#8EA5FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700"
              >
                <option value="">All Sessions</option>
                {sessions.map((session) => (
                  <option key={session.session_id} value={session.session_id}>
                    {session.session_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    View All Elections
                  </h1>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <form
                  onSubmit={handleSearch}
                  className="relative flex-grow max-w-2xl"
                >
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search elections..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>

                <div className="mt-4 md:mt-0">
                  <Link
                    to="/create_election"
                    className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#7083F5] hover:bg-[#536aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Create New Election
                  </Link>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#7083F5] border-r-transparent"></div>
                <p className="mt-2 text-gray-500">Loading elections...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center text-red-600">
                {error}
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          S/N
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Election Name
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Session
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Start Date
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          End Date
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentElections.length > 0 ? (
                        currentElections.map((election, index) => (
                          <tr
                            key={election.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {startItem + index}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {election.name}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {getSessionName(election.session_id)}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {new Date(
                                election.startDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {new Date(election.endDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-3">
                                <button
                                  onClick={() => handleEditClick(election.id)}
                                  className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteClick(
                                      election.id,
                                      election.name
                                    )
                                  }
                                  className="text-red-600 hover:text-red-900 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="6"
                            className="px-4 py-4 text-sm text-gray-500 text-center"
                          >
                            No elections found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredElections.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{startItem}</span> to{" "}
                  <span className="font-medium">{endItem}</span> of{" "}
                  <span className="font-medium">
                    {filteredElections.length}
                  </span>{" "}
                  results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                      currentPage === 1
                        ? "border-gray-300 text-gray-400 bg-white cursor-not-allowed"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (number) => (
                      <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                          currentPage === number
                            ? "border-indigo-500 text-white bg-indigo-600"
                            : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                        }`}
                      >
                        {number}
                      </button>
                    )
                  )}

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                      currentPage === totalPages || totalPages === 0
                        ? "border-gray-300 text-gray-400 bg-white cursor-not-allowed"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Delete Election
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the election{" "}
                    <span className="font-semibold">
                      "{electionToDelete?.name}"
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <svg
                    className="h-6 w-6 text-green-600"
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
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Success!
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    The election has been deleted successfully.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 rounded-b-2xl">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                onClick={() => setShowSuccessModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default View_election;
