import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

const View_dzongkhag = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [dzongkhags, setDzongkhags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [dzongkhagToDelete, setDzongkhagToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    fetchDzongkhags();
  }, []);

  const fetchDzongkhags = async () => {
    try {
      const response = await fetch("http://localhost:4005/api/dzongkhags");
      if (!response.ok) throw new Error("Failed to fetch dzongkhags");
      const data = await response.json();
      setDzongkhags(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter dzongkhags based on search term
  const getFilteredDzongkhags = () => {
    let filtered = [...dzongkhags];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(dzongkhag =>
        dzongkhag.dzongkhag_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by name by default
    filtered.sort((a, b) => a.dzongkhag_name.localeCompare(b.dzongkhag_name));
    
    return filtered;
  };

  // Get current dzongkhags for pagination
  const getCurrentDzongkhags = () => {
    const filteredDzongkhags = getFilteredDzongkhags();
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredDzongkhags.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Handle next page
  const nextPage = () => {
    if (currentPage < Math.ceil(getFilteredDzongkhags().length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handle previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDzongkhagToDelete({ id: id, name: name });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!dzongkhagToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:4005/api/dzongkhags/${dzongkhagToDelete.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete dzongkhag");
      
      setDzongkhags(dzongkhags.filter((dzongkhag) => dzongkhag.dzongkhag_id !== dzongkhagToDelete.id));
      
      const filteredCount = getFilteredDzongkhags().length;
      const totalPages = Math.ceil(filteredCount / itemsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      
      setShowDeleteModal(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      alert("Error deleting dzongkhag: " + error.message);
    } finally {
      setIsDeleting(false);
      setDzongkhagToDelete(null);
    }
  };

  // Calculate values for pagination display
  const filteredDzongkhags = getFilteredDzongkhags();
  const totalPages = Math.ceil(filteredDzongkhags.length / itemsPerPage);
  const currentDzongkhags = getCurrentDzongkhags();
  const startItem = filteredDzongkhags.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredDzongkhags.length);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
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
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    View All Dzongkhags
                  </h1>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="relative flex-grow max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search dzongkhags..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="mt-4 md:mt-0">
                  <Link
                    to="/create_dzongkhag"
                    className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#7083F5] hover:bg-[#536aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                  >
                    Create New Dzongkhag
                  </Link>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
                <p className="text-gray-700">Loading dzongkhags...</p>
              </div>
            ) : error ? (
              <div className="bg-white shadow-xl rounded-2xl p-8 text-center">
                <p className="text-red-500">{error}</p>
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
                          Dzongkhag Name
                        </th>
                        <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentDzongkhags.length > 0 ? (
                        currentDzongkhags.map((dzongkhag, index) => (
                          <tr
                            key={dzongkhag.dzongkhag_id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                              {startItem + index}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {dzongkhag.dzongkhag_name}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-3">
                                <Link
                                  to={`/edit_dzongkhag/${dzongkhag.dzongkhag_id}`}
                                  className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                                >
                                  Edit
                                </Link>
                                <button
                                  onClick={() =>
                                    handleDeleteClick(dzongkhag.dzongkhag_id, dzongkhag.dzongkhag_name)
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
                          <td colSpan="3" className="px-4 py-4 text-center text-sm text-gray-500">
                            No dzongkhags found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredDzongkhags.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing <span className="font-medium">{startItem}</span> to{" "}
                  <span className="font-medium">{endItem}</span> of{" "}
                  <span className="font-medium">{filteredDzongkhags.length}</span> results
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
                  Delete Dzongkhag
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete the dzongkhag{" "}
                    <span className="font-semibold">
                      "{dzongkhagToDelete?.name}"
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
                    The dzongkhag has been deleted successfully.
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

export default View_dzongkhag;