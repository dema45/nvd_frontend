

import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link } from "react-router-dom";

const Primary_Result = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = JSON.parse(localStorage.getItem("userId") || "null");
  
  // Modal states for declaring results
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeclaring, setIsDeclaring] = useState(false);
  
  // Modal states for removing results
  const [showRemoveConfirmationModal, setShowRemoveConfirmationModal] = useState(false);
  const [showRemoveSuccessModal, setShowRemoveSuccessModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Results data
  const [allParties, setAllParties] = useState([]);
  const [topTwoParties, setTopTwoParties] = useState([]);
  
  // Session and election IDs
  const [sessionId, setSessionId] = useState(null);
  const [electionId, setElectionId] = useState(null);

  // Fetch latest session and election IDs
  const fetchLatestSessionAndElection = async () => {
    try {
      const response = await fetch('http://localhost:4005/api/elections/latest-session/primary');
      if (!response.ok) {
        throw new Error(`Failed to fetch latest session and election data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if the data structure matches what we expect
      if (!data.data || !data.data.session || !data.data.election) {
        throw new Error("Invalid data structure received from API");
      }
      
      const sessionId = data.data.session.session_id;
      const electionId = data.data.election.election_id;
      
      setSessionId(sessionId);
      setElectionId(electionId);
      
      return { sessionId, electionId };
      
    } catch (err) {
      console.error('Error in fetchLatestSessionAndElection:', err);
      setError(`Error fetching latest session: ${err.message}`);
      throw err;
    }
  };

  // Fetch all parties data with session ID
  const fetchAllParties = async (sessionId) => {
    if (!sessionId) {
      console.error('Missing sessionId');
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:4005/api/getPrimaryVoteCounts?session_id=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch all parties data');
      }
      const data = await response.json();
      
      // Sort by vote count in descending order
      const sortedData = data.sort((a, b) => b.vote_count - a.vote_count);
      setAllParties(sortedData);
    } catch (err) {
      setError(`Error fetching all parties: ${err.message}`);
    }
  };

  // Fetch top two parties data
  const fetchTopTwoParties = async (sessionId, electionId) => {
    if (!sessionId || !electionId) {
      console.error('Missing sessionId or electionId');
      return;
    }
    
    try {
      const url = `http://localhost:4005/api/getTopTwoPrimaryParties`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch top two parties data: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setTopTwoParties(data);
      
    } catch (err) {
      console.error('Error in fetchTopTwoParties:', err);
      setError(`Error fetching top two parties: ${err.message}`);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First fetch the session and election IDs
        const { sessionId, electionId } = await fetchLatestSessionAndElection();
        
        // Then fetch all parties and top two parties in parallel
        await Promise.all([
          fetchAllParties(sessionId),
          fetchTopTwoParties(sessionId, electionId)
        ]);
      } catch (err) {
        console.error('Error in initial data fetch:', err);
        setError('Failed to load election data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Declare result handlers
  const openConfirmationModal = (id) => {
    setSelectedResultId(id);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setSelectedResultId(null);
  };

 const handleDeclareResult = async () => {
  if (!sessionId || !electionId) {
    setError('Missing session or election information');
    return;
  }

  setShowConfirmationModal(false);
  setIsDeclaring(true);

  try {
    const requestBodies = [
      { session_id: sessionId, election_id: electionId, topTwoOnly: false }, // Declare All
      { session_id: sessionId, election_id: electionId, topTwoOnly: true }   // Declare Top 2
    ];

    for (const requestBody of requestBodies) {
      const response = await fetch('http://localhost:4005/api/declarePrimaryResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to declare results');
      }

      const result = await response.json();
      console.log('✅ Declared:', result);
    }

    // Show success modal
    setShowSuccessModal(true);

    // Refresh data
    await Promise.all([
      fetchAllParties(sessionId),
      fetchTopTwoParties(sessionId, electionId)
    ]);
  } catch (err) {
    console.error('Error declaring results:', err);
    setError(`Error declaring results: ${err.message}`);
  } finally {
    setIsDeclaring(false);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 2000);
  }
};

  // Remove result handlers
  const openRemoveConfirmationModal = () => {
    setShowRemoveConfirmationModal(true);
  };

  const closeRemoveConfirmationModal = () => {
    setShowRemoveConfirmationModal(false);
  };

  const handleRemoveResult = async () => {
    if (!sessionId || !electionId) {
      setError('Missing session or election information');
      return;
    }

    setShowRemoveConfirmationModal(false);
    setIsRemoving(true);
    
    try {
      // Prepare the request body
      const requestBody = {
        session_id: sessionId,
        election_id: electionId
      };

      // Make the API call to remove results
      const response = await fetch('http://localhost:4005/api/removeDeclaredPrimaryResult', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Failed to remove results');
      }

      const result = await response.json();
      
      // Show success message
      setShowRemoveSuccessModal(true);
      console.log('Result removed successfully:', result);

      // Refresh the data after removal
      await Promise.all([
        fetchAllParties(sessionId),
        fetchTopTwoParties(sessionId, electionId)
      ]);
      
    } catch (err) {
      setError(`Error removing results: ${err.message}`);
      console.error('Removal error:', err);
    } finally {
      setIsRemoving(false);
      
      // Hide success modal after 2 seconds
      setTimeout(() => {
        setShowRemoveSuccessModal(false);
      }, 2000);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800">Loading Election Results...</h3>
            <p className="text-gray-500 mt-2">Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
              <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Error Loading Data</h3>
            <p className="text-gray-500 mt-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
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
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Declare Election Results
              </h1>
            </div>

            {/* All Parties Table */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    All Political Parties
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Complete list of participating parties ({allParties.length} parties)
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S/N
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Party Name
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Election Type
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allParties.length > 0 ? (
                      allParties.map((party, index) => (
                        <tr
                          key={`${party.party_id}-${party.session_id}-${party.election_id}`}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {party.party_name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {party.vote_count.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center capitalize">
                            {party.election_type}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                          No political parties found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Selected Two Parties Table */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Top 2 Parties
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    {sessionId && electionId ? (
                      `Parties with the highest votes (Session ${sessionId}, Election ${electionId})`
                    ) : (
                      "Parties with the highest votes"
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Party Name
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                      <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topTwoParties.length > 0 ? (
                      topTwoParties.map((party, index) => (
                        <tr
                          key={party.party_id}
                          className={`hover:bg-gray-50 transition-colors duration-150 ${
                            index === 0 ? 'bg-green-50' : index === 1 ? 'bg-blue-50' : ''
                          }`}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              index === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {index === 0 ? '1st' : '2nd'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {party.party_name}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center font-semibold">
                            {party.vote_count.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Qualified
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-4 text-center text-sm text-gray-500">
                          No top parties data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={openRemoveConfirmationModal}
                className="px-6 py-2 rounded-lg border text-sm font-medium bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 transition-colors duration-200"
                disabled={allParties.length === 0}
              >
                Remove All Results
              </button>
              <button
                onClick={() => openConfirmationModal('all')}
                className="px-6 py-2 rounded-lg border text-sm font-medium bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 transition-colors duration-200"
                disabled={allParties.length === 0}
              >
                Declare All Results
              </button>
              {/* <button
                onClick={() => openConfirmationModal('top2')}
                className="px-6 py-2 rounded-lg border text-sm font-medium bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 transition-colors duration-200"
                disabled={topTwoParties.length === 0}
              >
                Declare Final Result
              </button> */}
            </div>
          </div>
        </main>
      </div>

      {/* Declare Result Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-24 pl-80">
          <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col justify-center shadow-xl border border-gray-100">
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
                Confirm Declaration
              </h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to declare {selectedResultId === 'all' ? 'all' : 'the final'} result? This action cannot be undone.
              </p>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="button"
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-200 w-28"
                onClick={closeConfirmationModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200 w-28"
                onClick={handleDeclareResult}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Result Confirmation Modal */}
      {showRemoveConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-24 pl-80">
          <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col justify-center shadow-xl border border-gray-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-4">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Confirm Removal
              </h3>
              <p className="text-gray-500 mt-2">
                Are you sure you want to remove all results? This action cannot be undone.
              </p>
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                type="button"
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-200 w-28"
                onClick={closeRemoveConfirmationModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-6 py-2.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm transition-all duration-200 w-28"
                onClick={handleRemoveResult}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Declaring Result Loading Indicator */}
      {isDeclaring && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-24 pl-80">
          <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Declaring Result...
            </h3>
            <p className="text-gray-500 mt-2">Please wait a moment</p>
          </div>
        </div>
      )}

      {/* Removing Result Loading Indicator */}
      {isRemoving && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-24 pl-80">
          <div className="bg-white rounded-xl p-8 w-[500px] max-w-[95vw] mx-4 flex flex-col items-center justify-center shadow-xl border border-gray-100">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-6"></div>
            <h3 className="text-xl font-semibold text-gray-800">
              Removing Result...
            </h3>
            <p className="text-gray-500 mt-2">Please wait a moment</p>
          </div>
        </div>
      )}

      {/* Declare Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-24 pl-80">
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
                Result declared successfully.
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
      )}

      {/* Remove Success Modal */}
      {showRemoveSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 pb-24 pl-80">
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
                Result removed successfully.
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
      )}
    </div>
  );
};

export default Primary_Result;