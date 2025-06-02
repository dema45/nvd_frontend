import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { FaSpinner } from "react-icons/fa";

const Result = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedSession, setSelectedSession] = useState("");
  const [electionsData, setElectionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Results data
  const [results, setResults] = useState([
    {
      id: 1,
      name: "Primary Round",
      type: "primary",
    },
    {
      id: 2,
      name: "General Round",
      type: "general",
    },
  ]);

  useEffect(() => {
    const fetchElectionData = async () => {
      try {
        const response = await axios.get("http://localhost:4005/api/elections/latest-session/all");
        setElectionsData(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch election data");
        setLoading(false);
        console.error("Error fetching election data:", err);
      }
    };

    fetchElectionData();
  }, []);

  // Function to check election status
  const getElectionStatus = (electionType) => {
    if (!electionsData) return "not-created";
    
    const electionData = electionsData?.elections?.find(
      (e) => e.election_type === electionType
    );
    
    if (!electionData) return "not-created";
    
    const now = new Date();
    const start = new Date(electionData.start_date);
    const end = new Date(electionData.end_date);
    
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "ended";
  };

  // Filter and sort results based on search term and sort option
  const getFilteredAndSortedResults = () => {
    let filtered = [...results];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(result =>
        result.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "Newest":
        filtered.sort((a, b) => b.id - a.id);
        break;
      case "Oldest":
        filtered.sort((a, b) => a.id - b.id);
        break;
      case "Name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Term:", searchTerm);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    console.log("Sort By:", e.target.value);
  };
  
  const handleSessionChange = (e) => {
    setSelectedSession(e.target.value);
    console.log("Selected Session:", e.target.value);
  };

  const filteredResults = getFilteredAndSortedResults();

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50 items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading election data...</p>
        </div>
      </div>
    );
  }

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
                    View Election Results
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Session Filter */}
            {/* <div className="w-1/3 mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Session
              </label>
              <select
                value={selectedSession}
                onChange={handleSessionChange}
                className="mt-1 p-2 border border-[#8EA5FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700"
              >
                <option value="" disabled hidden>
                  Select Election Session
                </option>
                <option value="Election 2023">Election 2023</option>
                <option value="Election 2019">Election 2019</option>
                <option value="Election 2015">Election 2015</option>
              </select>
            </div> */}

            {/* Filters Section */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <form onSubmit={handleSearch} className="relative flex-grow max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search results..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                        <option value="Name">Result Name</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S/N
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Round Name
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result, index) => {
                        const status = getElectionStatus(result.type);
                        
                        return (
                          <tr
                            key={result.id}
                            className="hover:bg-gray-50 transition-colors duration-150"
                          >
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                              {index + 1}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                              {result.name}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-center">
                              {status === "not-created" && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                  Not Created
                                </span>
                              )}
                              {status === "upcoming" && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Upcoming
                                </span>
                              )}
                              {status === "active" && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                  Voting in Progress
                                </span>
                              )}
                              {status === "ended" && (
                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  Concluded
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-3">
                                {result.type === "primary" ? (
                                  status === "ended" ? (
                                    <Link
                                      to="/primary-result"
                                      className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                                    >
                                      Declare Primary Results
                                    </Link>
                                  ) : status === "active" ? (
                                    <button
                                      className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-500 text-sm font-medium cursor-not-allowed"
                                      disabled
                                    >
                                      Voting in Progress
                                    </button>
                                  ) : (
                                    <button
                                      className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm font-medium cursor-not-allowed"
                                      disabled
                                    >
                                      Results Not Available
                                    </button>
                                  )
                                ) : (
                                  status === "ended" ? (
                                    <Link
                                      to="/General-result"
                                      className="text-green-600 hover:text-green-900 px-4 py-2 rounded-lg border border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
                                    >
                                      Declare General Results
                                    </Link>
                                  ) : status === "active" ? (
                                    <button
                                      className="px-4 py-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-500 text-sm font-medium cursor-not-allowed"
                                      disabled
                                    >
                                      Voting in Progress
                                    </button>
                                  ) : (
                                    <button
                                      className="px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 text-sm font-medium cursor-not-allowed"
                                      disabled
                                    >
                                      Results Not Available
                                    </button>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                          No results found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Result;