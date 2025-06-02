// GeneralResultPage.jsx
import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const General_Result = () => {
  const userId = localStorage.getItem("userId");
  const [sessionId, setSessionId] = useState(1); // Default session ID, can be made dynamic
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [expandedDzongkhagId, setExpandedDzongkhagId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dzongkhagList, setDzongkhagList] = useState([]);
  const [detailedResults, setDetailedResults] = useState([]);
  const [candidateImages, setCandidateImages] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch constituency results
        const resultsResponse = await fetch(
          `http://localhost:4005/api/getSavedConstituencyResults?session_id=${sessionId}`
        );
        const resultsData = await resultsResponse.json();
        
        // Fetch candidate images
        const imagesResponse = await fetch(
          `http://localhost:4005/api/candidate/`
        );
        const imagesData = await imagesResponse.json();
        
        // Process the data
        processResultsData(resultsData, imagesData.data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId]);

  const processResultsData = (resultsData, imagesData) => {
    // Create a map of candidate images
    const imageMap = {};
    imagesData.forEach(candidate => {
      imageMap[candidate.candidate_name] = `http://localhost:4005${candidate.candidate_image}`;
    });
    setCandidateImages(imageMap);

    // Process constituency results into dzongkhag structure
    const dzongkhagMap = {};
    resultsData.constituency_results.forEach(constituency => {
      const dzongkhagName = constituency.dzongkhag_name;
      
      if (!dzongkhagMap[dzongkhagName]) {
        dzongkhagMap[dzongkhagName] = {
          dzongkhag: dzongkhagName,
          constituencies: []
        };
      }
      
      dzongkhagMap[dzongkhagName].constituencies.push({
        name: constituency.constituency_name,
        candidates: constituency.results.map(result => ({
          name: result.candidate_name,
          party: result.party_name,
          votes: result.vote_count,
          result: result.result,
          image: imageMap[result.candidate_name] || null
        }))
      });
    });

    // Convert to array format
    const detailedResultsArray = Object.values(dzongkhagMap).map((item, index) => ({
      id: index + 1,
      ...item
    }));

    // Create dzongkhag list for the table
    const dzongkhagListArray = Object.keys(dzongkhagMap).map((name, index) => ({
      id: index + 1,
      dzongkhagName: name
    }));

    setDetailedResults(detailedResultsArray);
    setDzongkhagList(dzongkhagListArray);
  };

  const getFilteredAndSortedResults = () => {
    let filtered = dzongkhagList.filter((dz) =>
      dz.dzongkhagName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case "Newest":
        return filtered.sort((a, b) => b.id - a.id);
      case "Oldest":
        return filtered.sort((a, b) => a.id - b.id);
      case "Name":
        return filtered.sort((a, b) => a.dzongkhagName.localeCompare(b.dzongkhagName));
      default:
        return filtered;
    }
  };

  const filteredResults = getFilteredAndSortedResults();
  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredResults.length);
  const currentResults = filteredResults.slice(startItem - 1, endItem);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "Poppins" }}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar userId={userId} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <p>Loading election results...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "Poppins" }}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar userId={userId} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center text-red-500">
              <p>Error loading results: {error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "Poppins" }}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar userId={userId} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900"> National Assembly Election, 2023 </h1>
              <p className="mt-1 text-gray-600">General Round Result.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <form className="relative flex-grow" onSubmit={(e) => e.preventDefault()}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500"
                    placeholder="Search Dzongkhag"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </form>

                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                  <label className="text-sm text-gray-700">Sort by:</label>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none"
                    >
                      <option value="Newest">Newest First</option>
                      <option value="Oldest">Oldest First</option>
                      <option value="Name">Dzongkhag Name</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase">S/N</th>
                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase">Dzongkhag Name</th>
                    <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentResults.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center py-6 text-gray-400">
                        {searchTerm ? "No matching results found." : "No results available."}
                      </td>
                    </tr>
                  )}

                  {currentResults.map((dzongkhag, idx) => (
                    <React.Fragment key={dzongkhag.id}>
                      <tr
                        className={`border-t cursor-pointer ${
                          expandedDzongkhagId === dzongkhag.id ? "bg-gray-50" : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          setExpandedDzongkhagId(
                            expandedDzongkhagId === dzongkhag.id ? null : dzongkhag.id
                          )
                        }
                      >
                        <td className="text-center px-4 py-4 text-sm font-medium text-gray-900">
                          {startItem + idx}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">{dzongkhag.dzongkhagName}</td>
                        <td className="px-4 py-4 text-center text-sm text-indigo-600 flex justify-center">
                          <ChevronDownIcon
                            className={`h-5 w-5 transform transition-transform duration-300 ${
                              expandedDzongkhagId === dzongkhag.id ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </td>
                      </tr>

                      {expandedDzongkhagId === dzongkhag.id && (
                        <tr>
                          <td colSpan="3" className="bg-gray-50 px-6 py-4 text-sm text-gray-700 border-t">
                            <p className="font-semibold mb-3">Results for {dzongkhag.dzongkhagName}:</p>
                            {(() => {
                              const detail = detailedResults.find((d) => d.dzongkhag === dzongkhag.dzongkhagName);
                              if (!detail) return <p>No detailed results found for this dzongkhag.</p>;

                              return detail.constituencies.map((constituency, ci) => (
                                <div
                                  key={ci}
                                  className="mb-4 border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
                                >
                                  <h4 className="font-semibold text-gray-800 mb-2">
                                    {constituency.name}
                                  </h4>
                                  <div className="space-y-3">
                                    {constituency.candidates.map((candidate, i) => (
                                      <div key={i} className="ml-4 flex items-center gap-3">
                                        {candidate.image && (
                                          <img 
                                            src={candidate.image} 
                                            alt={candidate.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                          />
                                        )}
                                        <div>
                                          <p className="font-medium">
                                            {candidate.name} ({candidate.party}) - {candidate.votes} votes
                                          </p>
                                          <p className={`text-sm ${
                                            candidate.result === "Winner" 
                                              ? "text-green-600 font-semibold" 
                                              : "text-gray-500"
                                          }`}>
                                            {candidate.result}
                                          </p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ));
                            })()}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-between items-center">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 rounded-lg text-sm text-white bg-indigo-600 disabled:bg-gray-300"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Showing {startItem} to {endItem} of {filteredResults.length} results
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 rounded-lg text-sm text-white bg-indigo-600 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default General_Result;