import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const View_candidate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // Data states
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState([]);
  const [dzongkhags, setDzongkhags] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  // API URL
  const API_URL = "http://localhost:4005/api";

  // Fetch all necessary data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reference data first
        const [dzongkhagsRes, sessionsRes] = await Promise.all([
          axios.get(`${API_URL}/dzongkhags/`),
          axios.get(`${API_URL}/sessions/`)
        ]);
        
        setDzongkhags(dzongkhagsRes.data || []);
        setSessions(sessionsRes.data || []);
  
        // Fetch parties if not loaded
        if (parties.length === 0) {
          const partiesResponse = await axios.get(`${API_URL}/parties`);
          setParties(partiesResponse.data.data || []);
        }
  
        // Don't fetch candidates if we're in search mode (searchTerm is set)
        if (!searchTerm) {
          await fetchCandidates();
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, [currentPage, selectedSession, selectedDzongkhag, itemsPerPage]);
  // Handle search by CID
  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (searchTerm) {
        // Call the specific candidate endpoint with the CID
        const response = await axios.get(`${API_URL}/candidate/${searchTerm}`);
        if (response.data && response.data.data) {
          // Set as array with single candidate
          setCandidates([response.data.data]);
          setTotalItems(1);
          
          // Fetch the constituency for this specific candidate
          const dzongkhagId = response.data.data.dzongkhag_id;
          if (dzongkhagId) {
            const constituencyResponse = await axios.get(`${API_URL}/dzongkhags/${dzongkhagId}/constituencies`);
            if (constituencyResponse.data && constituencyResponse.data.constituencies) {
              setConstituencies(constituencyResponse.data.constituencies);
            }
          }
        } else {
          setCandidates([]);
          setTotalItems(0);
        }
      } else {
        // If no search term, revert to normal loading
        fetchCandidates();
      }
    } catch (error) {
      console.error("Error searching candidate:", error);
      setCandidates([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };
  // Add a new function to fetch candidates with filters
  const fetchCandidates = async () => {
    try {
      setIsLoading(true);
      // Build query params
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };
  
      // Add filters if selected
      if (selectedSession) {
        params.session_id = selectedSession;
      }
      if (selectedDzongkhag) {
        params.dzongkhag_id = selectedDzongkhag;
      }
  
      // Fetch candidates with filters
      const candidatesResponse = await axios.get(`${API_URL}/candidate`, { params });
      
      const candidatesData = candidatesResponse.data.data || [];
      setCandidates(candidatesData);
      setTotalItems(candidatesResponse.data.total || 0);
  
      // Fetch constituencies for all candidates
      if (candidatesData.length > 0) {
        // Extract unique dzongkhag IDs from candidates
        const uniqueDzongkhagIds = [...new Set(candidatesData.map(c => c.dzongkhag_id))];
        
        // Fetch constituencies for all dzongkhags that have candidates
        const constituencyPromises = uniqueDzongkhagIds.map(dzId => 
          axios.get(`${API_URL}/dzongkhags/${dzId}/constituencies`)
        );
        
        const constituencyResponses = await Promise.all(constituencyPromises);
        
        // Combine all constituencies from different dzongkhags
        const allConstituencies = constituencyResponses.flatMap(res => 
          res.data.constituencies || []
        );
        setConstituencies(allConstituencies);
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dzongkhag filter change
  const handleDzongkhagChange = (e) => {
    setSelectedDzongkhag(e.target.value);
    setCurrentPage(1);
  };

  // Handle session filter change
  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
    setCurrentPage(1);
  };

  // Handle delete click
  const handleDeleteClick = (candidateId, candidateName) => {
    setCandidateToDelete({ id: candidateId, name: candidateName });
    setShowDeleteModal(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`${API_URL}/candidate/${candidateToDelete.id}`);
      
      // Refresh the candidate list with current filters
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };
      if (searchTerm) params.cid = searchTerm;
      if (selectedSession) params.session_id = selectedSession;
      if (selectedDzongkhag) params.dzongkhag_id = selectedDzongkhag;

      const response = await axios.get(`${API_URL}/candidate`, { params });
      
      setCandidates(response.data.data || []);
      setTotalItems(response.data.total || 0);

      setShowDeleteModal(false);
      setShowSuccessModal(true);
      setCandidateToDelete(null);

      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error deleting candidate:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format party name
  const getPartyName = (partyId) => {
    const party = parties.find(p => p.party_id === partyId);
    return party ? party.party_name : 'Unknown';
  };

  // Format dzongkhag name
  const getDzongkhagName = (dzongkhagId) => {
    const dzongkhag = dzongkhags.find(d => d.dzongkhag_id === dzongkhagId);
    return dzongkhag ? dzongkhag.dzongkhag_name : 'Unknown';
  };

  // Format constituency name
  const getConstituencyName = (constituencyId) => {
    const constituency = constituencies.find(c => c.constituency_id === constituencyId);
    return constituency ? constituency.constituency_name : 'Unknown';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "Poppins" }}>
      {/* Sidebar */}
      <div className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Session and Dzongkhag Selection */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mt-2 w-1/2">
                {/* Election Session Dropdown */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Session</label>
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

                {/* Dzongkhag Dropdown */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Dzongkhag</label>
                  <select
                    value={selectedDzongkhag}
                    onChange={handleDzongkhagChange}
                    className="mt-1 p-2 border border-[#8EA5FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700"
                  >
                    <option value="">All Dzongkhags</option>
                    {dzongkhags.map((dzongkhag) => (
                      <option key={dzongkhag.dzongkhag_id} value={dzongkhag.dzongkhag_id}>
                        {dzongkhag.dzongkhag_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">View All Candidates</h1>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <form onSubmit={handleSearch} className="relative flex-grow max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search candidates by CID..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>

                <div className="mt-4 md:mt-0">
                  <Link
                    to="/create_candidate"
                    className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#7083F5] hover:bg-[#536aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Add New Candidate
                  </Link>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <>
                <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">CID</th>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Dzongkhag</th>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Constituency</th>
                          <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {candidates.length > 0 ? (
                          candidates.map((candidate, index) => (
                            <tr key={candidate.candidateid} className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                {startItem + index}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {candidate.candidateid}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {candidate.candidate_name}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {getPartyName(candidate.party_id)}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {getDzongkhagName(candidate.dzongkhag_id)}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {getConstituencyName(candidate.constituency_id)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center space-x-3">
                                  <Link
                                    to={`/edit_candidate/${candidate.candidateid}`}
                                    className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteClick(candidate.candidateid, candidate.candidate_name)}
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
                            <td colSpan="7" className="px-4 py-4 text-center text-sm text-gray-500">
                              No candidates found matching your criteria
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                    Showing <span className="font-medium">{startItem}</span> to{" "}
                    <span className="font-medium">{endItem}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> candidates
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
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
                    ))}

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
              </>
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-64">
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
                <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Candidate</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the candidate{" "}
                    <span className="font-semibold">"{candidateToDelete?.name}"</span>?
                    This action cannot be undone.
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
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-64">
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
                <h3 className="text-lg leading-6 font-medium text-gray-900">Success!</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    The candidate has been deleted successfully.
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

export default View_candidate;