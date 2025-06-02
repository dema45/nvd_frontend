// overflow-y-auto and apply in my code:
import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [deletedVoterData, setDeletedVoterData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [allVoters, setAllVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [dzongkhags, setDzongkhags] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [votersPerPage] = useState(7);
  const [candidateToDelete, setCandidateToDelete] = useState({
    cid: null,
    name: "",
  });

  // Format date function for success modal
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return "N/A";
    }
  };

  // Fetch dzongkhags
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found - redirecting to login");
      window.location.href = "/login-admin";
      return;
    }

    fetch("http://localhost:4005/api/dzongkhags", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/login-admin";
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const dzongkhagsList = Array.isArray(data) ? data : data.data || [];
        setDzongkhags(dzongkhagsList);
      })
      .catch((error) => {
        console.error("Error fetching dzongkhags:", error);
      });
  }, []);

  // Fetch voters
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      console.error("No JWT token found - redirecting to login");
      window.location.href = "/login-admin";
      return;
    }

    fetch("http://localhost:4005/api/acep/accepted", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
            localStorage.removeItem("jwtToken");
            window.location.href = "/login-admin";
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const voters = Array.isArray(data) ? data : data.data || [];
        setAllVoters(voters);
        setFilteredVoters(voters);
      })
      .catch((error) => {
        console.error("Error fetching voters:", error);
      });
  }, []);

  // Fetch constituencies when dzongkhag changes
 useEffect(() => {
  if (selectedDzongkhag) {
    fetchConstituencies(selectedDzongkhag);
  } else {
    // Important: If no dzongkhag is selected, we still need constituency data for all voters
    // Fetch all constituencies
    fetchAllConstituencies();
  }
}, [selectedDzongkhag]);

  const getDzongkhagName = (dzongkhagId) => {
    if (!dzongkhagId) return "N/A";
    const dzongkhag = dzongkhags.find(
      (d) => d.dzongkhag_id?.toString() === dzongkhagId?.toString()
    );
    return dzongkhag ? dzongkhag.dzongkhag_name : dzongkhagId;
  };

 const getConstituencyName = (constituencyId) => {
  if (!constituencyId) return "N/A";
  
  // Check if constituencies array has data and find the constituency
  const constituency = constituencies.find(
    (c) => c.constituency_id?.toString() === constituencyId?.toString()
  );
  
  return constituency ? constituency.constituency_name : "N/A";
};

  const fetchConstituencies = (dzongkhagId) => {
    if (!dzongkhagId) {
      setConstituencies([]);
      return;
    }

    const token = localStorage.getItem("jwtToken");
    const url = `http://localhost:4005/api/dzongkhags/${dzongkhagId}/constituencies`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        const constituenciesList = data.constituencies || [];
        setConstituencies(constituenciesList);
      })
      .catch((error) => {
        console.error("Error fetching constituencies:", error);
        setConstituencies([]);
      });
  };
  const fetchAllConstituencies = () => {
  const token = localStorage.getItem("jwtToken");
  
  fetch("http://localhost:4005/api/constituencies", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const allConstituencies = Array.isArray(data) ? data : data.constituencies || [];
      setConstituencies(allConstituencies);
    })
    .catch((error) => {
      console.error("Error fetching all constituencies:", error);
      setConstituencies([]);
    });
};

  const handleDeleteClick = (cid, name) => {
    setCandidateToDelete({ cid, name });
    setShowDeleteModal(true);
  };

  const handleDeleteVoter = (cid) => {
    const token = localStorage.getItem("jwtToken");
    fetch(`http://localhost:4005/api/acep/deletevoter/${cid}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          const deletedVoter = allVoters.find(voter => voter.cid === cid);
          setDeletedVoterData(deletedVoter);
          
          setAllVoters((prev) => prev.filter((voter) => voter.cid !== cid));
          setFilteredVoters((prev) => prev.filter((voter) => voter.cid !== cid));
          setShowDeleteModal(false);
          setShowSuccessModal(true);
          
          setTimeout(() => {
            setShowSuccessModal(false);
          }, 2000);
        } else {
          return res.json().then((data) => {
            throw new Error(data.message || "Error deleting voter");
          });
        }
      })
      .catch((err) => {
        console.error("Delete request failed:", err);
        alert(err.message || "Network error while deleting voter.");
      });
  };

  // Apply all filters and sorting
  useEffect(() => {
    let results = [...allVoters];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(
        (voter) =>
          voter.cid?.toString().toLowerCase().includes(search) ||
          voter.uname?.toLowerCase().includes(search) ||
          voter.email?.toLowerCase().includes(search)
      );
    }

    if (selectedDzongkhag) {
      results = results.filter(
        (voter) => voter.dzongkhag?.toString() === selectedDzongkhag
      );
    }

    if (selectedConstituency) {
      results = results.filter(
        (voter) => voter.constituencies?.toString() === selectedConstituency
      );
    }

    if (sortBy === "Newest") {
      results.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
    } else if (sortBy === "Oldest") {
      results.sort(
        (a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0)
      );
    } else if (sortBy === "Name") {
      results.sort((a, b) => (a.uname || "").localeCompare(b.uname || ""));
    }

    setFilteredVoters(results);
    setCurrentPage(1);
  }, [searchTerm, selectedDzongkhag, selectedConstituency, sortBy, allVoters]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleDzongkhagChange = (e) => {
    const dzongkhagId = e.target.value;
    setSelectedDzongkhag(dzongkhagId);
    setSelectedConstituency("");
  };

  const handleConstituencyChange = (e) => {
    setSelectedConstituency(e.target.value);
  };

  // Pagination logic
  const indexOfLastVoter = currentPage * votersPerPage;
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
  const currentVoters = filteredVoters.slice(
    indexOfFirstVoter,
    indexOfLastVoter
  );
  const totalPages = Math.ceil(filteredVoters.length / votersPerPage);

  const startItem = indexOfFirstVoter + 1;
  const endItem = Math.min(indexOfLastVoter, filteredVoters.length);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
        {isSidebarOpen && <Sidebar closeSidebar={toggleSidebar} />}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} userId={userId} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Statistics Cards Section */}

            

            {/* Voter Verification Table Section */}
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    All Voters
                  </h1>

                  <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search */}
                    <form
                      onSubmit={handleSearch}
                      className="relative flex-grow max-w-md"
                    >
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search voters..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </form>

                    {/* Dzongkhag Filter */}
                    <div className="flex items-center">
                      <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <select
                        value={selectedDzongkhag}
                        onChange={handleDzongkhagChange}
                        className="appearance-none bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">All Dzongkhags</option>
                        {dzongkhags.map((dzongkhag) => (
                          <option
                            key={dzongkhag.dzongkhag_id}
                            value={dzongkhag.dzongkhag_id}
                          >
                            {dzongkhag.dzongkhag_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Constituency Filter */}
                    <div className="flex items-center">
                      <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <select
                        value={selectedConstituency}
                        onChange={handleConstituencyChange}
                        className="appearance-none bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={!selectedDzongkhag}
                      >
                        <option value="">All Constituencies</option>
                        {constituencies.map(constituency => (
                          <option 
                            key={constituency.constituency_id} 
                            value={constituency.constituency_id}
                          >
                            {constituency.constituency_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center">
                      <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="appearance-none bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="Newest">Newest First</option>
                        <option value="Oldest">Oldest First</option>
                        <option value="Name">Name</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S/N
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CID
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dzongkhag
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Constituency
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentVoters.length > 0 ? (
                      currentVoters.map((voter, index) => (
                        <tr
                          key={`${voter.cid}-${index}`}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                            {startItem + index}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                            {voter.cid}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                            {voter.uname}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                            {voter.age}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                            {voter.email}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                            {getDzongkhagName(voter.dzongkhag)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                            {getConstituencyName(voter.constituencies)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <div className="flex justify-center space-x-3">
                              <button
                                onClick={() =>
                                  handleDeleteClick(voter.cid, voter.uname)
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
                          colSpan="8"
                          className="px-4 py-4 text-center text-sm text-gray-500"
                        >
                          No voters found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                Showing{" "}
                <span className="font-medium">
                  {filteredVoters.length > 0 ? startItem : 0}
                </span>{" "}
                to <span className="font-medium">{endItem}</span> of{" "}
                <span className="font-medium">{filteredVoters.length}</span>{" "}
                voters
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
          </div>
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete voter {candidateToDelete.name}{" "}
              (CID: {candidateToDelete.cid})?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVoter(candidateToDelete.cid)}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Delete
              </button>
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
                  Voter Deleted Successfully!
                </h3>
                <div className="mt-2 text-sm text-gray-500">
                  <p className="mb-1">
                    <span className="font-medium">Name:</span> {deletedVoterData?.uname || "N/A"}
                  </p>
                  <p className="mb-1">
                    <span className="font-medium">CID:</span> {deletedVoterData?.cid || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Dzongkhag:</span> {getDzongkhagName(deletedVoterData?.dzongkhag)}
                  </p>
                </div>
              </div>
              <div className="mt-8 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full"
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

export default Dashboard; 