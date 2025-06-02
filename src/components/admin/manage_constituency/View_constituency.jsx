import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const View_constituency = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
  const [dzongkhags, setDzongkhags] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [allConstituencies, setAllConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [constituencyToDelete, setConstituencyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Fetch Dzongkhags from API
  useEffect(() => {
    const fetchDzongkhags = async () => {
      try {
        const response = await fetch("http://localhost:4005/api/dzongkhags");
        if (!response.ok) throw new Error("Failed to fetch dzongkhags");
        const data = await response.json();
        setDzongkhags(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching dzongkhags:", error);
      }
    };
    fetchDzongkhags();
  }, []);

  // Fetch all constituencies on initial load
  useEffect(() => {
    const fetchAllConstituencies = async () => {
      try {
        const response = await fetch("http://localhost:4005/api/constituencies");
        if (!response.ok) throw new Error("Failed to fetch constituencies");
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setAllConstituencies(data);
          setConstituencies(data);
        } else if (data && Array.isArray(data.constituencies)) {
          setAllConstituencies(data.constituencies);
          setConstituencies(data.constituencies);
        } else {
          setAllConstituencies([]);
          setConstituencies([]);
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching all constituencies:", error);
        setAllConstituencies([]);
        setConstituencies([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllConstituencies();
  }, []);

  // Fetch Constituencies based on selected Dzongkhag
  useEffect(() => {
    if (selectedDzongkhag) {
      const fetchConstituencies = async () => {
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:4005/api/dzongkhags/${selectedDzongkhag}/constituencies`);
          if (!response.ok) throw new Error("Failed to fetch constituencies for dzongkhag");
          const data = await response.json();
          
          if (data && data.constituencies) {
            setConstituencies(data.constituencies);
          } else {
            setConstituencies([]);
          }
        } catch (error) {
          setError(error.message);
          console.error("Error fetching constituencies:", error);
          setConstituencies([]);
        } finally {
          setLoading(false);
        }
      };
      fetchConstituencies();
    } else {
      // Show all constituencies when no dzongkhag is selected
      setConstituencies(allConstituencies);
    }
  }, [selectedDzongkhag, allConstituencies]);

  // Get filtered constituencies
  const getFilteredAndSortedConstituencies = () => {
    let filtered = [...constituencies];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((constituency) =>
        constituency.constituency_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.constituency_id - a.constituency_id);
        break;
      case "Oldest":
        filtered.sort((a, b) => a.constituency_id - b.constituency_id);
        break;
      case "Name":
        filtered.sort((a, b) => 
          a.constituency_name.localeCompare(b.constituency_name)
        );
        break;
      default:
        break;
    }

    return filtered;
  };

  // Get current constituencies for pagination
  const getCurrentConstituencies = () => {
    const filteredConstituencies = getFilteredAndSortedConstituencies();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredConstituencies.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next page
  const nextPage = () => {
    const filteredCount = getFilteredAndSortedConstituencies().length;
    const totalPages = Math.ceil(filteredCount / itemsPerPage);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // Search already applied via getFilteredAndSortedConstituencies
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
    
    // If search is cleared, reset to show appropriate constituencies
    if (e.target.value === "") {
      if (selectedDzongkhag) {
        const dzongkhagConstituencies = allConstituencies.filter(
          constituency => constituency.dzongkhag_id === selectedDzongkhag
        );
        setConstituencies(dzongkhagConstituencies);
      } else {
        setConstituencies(allConstituencies);
      }
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleDzongkhagChange = (e) => {
    setSelectedDzongkhag(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = (constituencyId, constituencyName) => {
    setConstituencyToDelete({ id: constituencyId, name: constituencyName });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`http://localhost:4005/api/constituencies/${constituencyToDelete.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete constituency");

      // Remove the deleted constituency from state
      setConstituencies(constituencies.filter((constituency) => 
        constituency.constituency_id !== constituencyToDelete.id
      ));
      setAllConstituencies(allConstituencies.filter((constituency) => 
        constituency.constituency_id !== constituencyToDelete.id
      ));

      const filteredCount = getFilteredAndSortedConstituencies().length;
      const totalPages = Math.ceil(filteredCount / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      
      // Auto close success modal after 2 seconds
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (error) {
      alert("Error deleting constituency: " + error.message);
    } finally {
      setIsDeleting(false);
      setConstituencyToDelete(null);
    }
  };

  // Calculate pagination values
  const filteredConstituencies = getFilteredAndSortedConstituencies();
  const totalPages = Math.ceil(filteredConstituencies.length / itemsPerPage);
  const currentConstituencies = getCurrentConstituencies();
  const startItem = filteredConstituencies.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredConstituencies.length);

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
        {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            {/* Dzongkhag Selection */}
            <div className="w-full md:w-1/3 mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Dzongkhag
              </label>
              <select
                value={selectedDzongkhag}
                onChange={handleDzongkhagChange}
                className="mt-1 p-2 border border-[#8EA5FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700"
              >
                <option value="">All Dzongkhags</option>
                {dzongkhags.length > 0 ? (
                  dzongkhags.map((dzongkhag) => (
                    <option key={dzongkhag.dzongkhag_id} value={dzongkhag.dzongkhag_id}>
                      {dzongkhag.dzongkhag_name}
                    </option>
                  ))
                ) : (
                  <option value="">Loading Dzongkhags...</option>
                )}
              </select>
            </div>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    View All Constituencies
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
                    placeholder="Search constituencies..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </form>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                    <label
                      htmlFor="sort"
                      className="text-sm font-medium text-gray-700 mr-2"
                    >
                      Sort by:
                    </label>
                    <div className="relative">
                      <select
                        id="sort"
                        value={sortBy}
                        onChange={handleSortChange}
                        className="appearance-none bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Newest">Newest First</option>
                        <option value="Oldest">Oldest First</option>
                        <option value="Name">Constituency Name</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link
                      to="/create_constituency"
                      className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#7083F5] hover:bg-[#536aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                    >
                      Create New Constituency
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <p className="text-center text-gray-700 mt-4">Loading constituencies...</p>
            ) : error ? (
              <p className="text-center text-red-500 mt-4">{error}</p>
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
                          Constituency Name
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dzongkhag
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentConstituencies.length > 0 ? (
                        currentConstituencies.map((constituency, index) => {
                          const dzongkhag = dzongkhags.find(
                            (d) => d.dzongkhag_id === constituency.dzongkhag_id
                          );
                          return (
                            <tr
                              key={constituency.constituency_id}
                              className="hover:bg-gray-50 transition-colors duration-150"
                            >
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                {startItem + index}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {constituency.constituency_name}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                {dzongkhag?.dzongkhag_name || "N/A"}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-center">
                                <div className="flex justify-center space-x-3">
                                  <Link
                                    to={`/edit_constituency/${constituency.constituency_id}`}
                                    className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                                  >
                                    Edit
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteClick(constituency.constituency_id, constituency.constituency_name)}
                                    className="text-red-600 hover:text-red-900 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="px-4 py-4 text-center text-sm text-gray-500"
                          >
                            No constituencies found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredConstituencies.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{startItem}</span> to{" "}
                  <span className="font-medium">{endItem}</span> of{" "}
                  <span className="font-medium">{filteredConstituencies.length}</span>{" "}
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
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-60">
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
                  Delete Constituency
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the constituency{" "}
                    <span className="font-semibold">
                      "{constituencyToDelete?.name}"
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
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-60">
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
                    The constituency has been deleted successfully.
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

export default View_constituency;