// import React, { useState, useEffect } from "react";
// import Navbar from "../navbar/Navbar";
// import Sidebar from "../sidebar/Sidebar";
// import axios from "axios";

// const General_Result = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const userId = localStorage.getItem("userId");

//   // Modal states
//   const [showConfirmationModal, setShowConfirmationModal] = useState(false);
//   const [selectedResultId, setSelectedResultId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [isDeclaring, setIsDeclaring] = useState(false);
//   const [actionType, setActionType] = useState(null); // 'declare' or 'remove'
//   const [actionTarget, setActionTarget] = useState(null); // 'constituency' or 'national'
  
//   // Results data
//   const [results, setResults] = useState([]);
//   const [nationalAssemblyResults, setNationalAssemblyResults] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Session ID and Election ID state - dynamically fetched
//   const [sessionId, setSessionId] = useState(null);
//   const [electionId, setElectionId] = useState(null);

//   // Fetch session ID and election ID
//   const fetchSessionAndElectionIds = async () => {
//     try {
//       // Fetch session ID
//       const sessionResponse = await axios.get("http://localhost:4005/api/getCurrentSession");
//       const currentSessionId = sessionResponse.data.session_id;
      
//       // Fetch election ID (you might need to adjust this based on your API)
//       const electionResponse = await axios.get("http://localhost:4005/api/getCurrentElection");
//       const currentElectionId = electionResponse.data.election_id || 1; // Default to 1 if not available
      
//       return {
//         sessionId: currentSessionId,
//         electionId: currentElectionId
//       };
      
//     } catch (error) {
//       console.error("Error fetching IDs:", error);
//       // Fallback to default IDs
//       return {
//         sessionId: 1,
//         electionId: 1
//       };
//     }
//   };

//   // Fetch data from APIs
//   useEffect(() => {
//     console.log("Starting to fetch data...");
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);

//         // Fetch IDs first
//         console.log("Fetching session and election IDs...");
//         const { sessionId: currentSessionId, electionId: currentElectionId } = await fetchSessionAndElectionIds();
//         setSessionId(currentSessionId);
//         setElectionId(currentElectionId);
//         console.log("Current session ID:", currentSessionId);
//         console.log("Current election ID:", currentElectionId);

//         // Fetch constituency-wise results
//         console.log("Fetching constituency results...");
//         const constituencyResponse = await axios.get("http://localhost:4005/api/getConstituencyWiseResult");
//         console.log("Constituency response:", constituencyResponse.data);
//         const constituencyData = constituencyResponse.data.constituency_results;

//         // Transform constituency data to match frontend structure
//         console.log("Transforming constituency data...");
//         const transformedResults = transformConstituencyData(constituencyData);
//         console.log("Transformed results:", transformedResults);
//         setResults(transformedResults);

//         // Fetch overall party performance
//         console.log("Fetching party performance...");
//         const performanceResponse = await axios.get("http://localhost:4005/api/getOverallPartyPerformance");
//         console.log("Performance response:", performanceResponse.data);
//         const performanceData = performanceResponse.data.party_performance;

//         // Transform performance data to match frontend structure
//         console.log("Transforming performance data...");
//         const transformedPerformance = performanceData.map(item => ({
//           party: item.party_name,
//           totalCandidates: item.performance
//         }));
//         console.log("Transformed performance:", transformedPerformance);
//         setNationalAssemblyResults(transformedPerformance);

//         setIsLoading(false);
//         console.log("Data fetching completed successfully");
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // Helper function to transform constituency data to match frontend structure
//   const transformConstituencyData = (data) => {
//     console.log("Original data for transformation:", data);
//     const dzongkhagMap = {};

//     data.forEach(item => {
//       if (!dzongkhagMap[item.dzongkhag_name]) {
//         dzongkhagMap[item.dzongkhag_name] = {
//           dzongkhag: item.dzongkhag_name,
//           constituencies: []
//         };
//       }

//       const constituency = {
//         id: item.constituency_id,
//         name: item.constituency_name,
//         candidates: item.results.map(result => ({
//           id: result.party_id,
//           name: result.candidate_name,
//           party: result.party_name,
//           votes: result.vote_count,
//           isWinner: result.result === "Winner"
//         }))
//       };

//       dzongkhagMap[item.dzongkhag_name].constituencies.push(constituency);
//     });

//     const transformedData = Object.values(dzongkhagMap).map((item, index) => ({
//       id: index + 1,
//       dzongkhag: item.dzongkhag,
//       constituencies: item.constituencies
//     }));

//     console.log("Transformed constituency data:", transformedData);
//     return transformedData;
//   };

//   const openConfirmationModal = (type, target) => {
//     console.log(`Opening confirmation modal for action: ${type} on ${target}`);
//     setActionType(type);
//     setActionTarget(target);
//     setShowConfirmationModal(true);
//   };

//   const closeConfirmationModal = () => {
//     console.log("Closing confirmation modal");
//     setShowConfirmationModal(false);
//     setActionType(null);
//     setActionTarget(null);
//   };

//   const handleDeclareResult = async () => {
//     try {
//       if (actionTarget === 'constituency') {
//         // Build request data with proper constituency_id mapping
//         const requestData = {
//           session_id: sessionId,
//           constituency_results: results.flatMap(dzongkhag =>
//             dzongkhag.constituencies.map(constituency => {
//               const constituencyId = constituency.id;
              
//               if (!constituencyId || constituencyId === 'null' || constituencyId === 'undefined') {
//                 console.error(`Constituency ${constituency.name} is missing a valid ID.`);
//                 throw new Error(`Missing constituency ID for ${constituency.name}`);
//               }

//               return {
//                 dzongkhag_name: dzongkhag.dzongkhag || "",
//                 constituency_id: constituencyId.toString(),
//                 constituency_name: constituency.name || "",
//                 results: (constituency.candidates || []).map(candidate => ({
//                   party_id: candidate.id || null,
//                   party_name: candidate.party || "",
//                   candidate_name: candidate.name || "",
//                   vote_count: Number(candidate.votes) || 0,
//                   result: candidate.isWinner ? "Winner" : "Loss"
//                 }))
//               };
//             })
//           )
//         };

//         console.log("Request data being sent:", JSON.stringify(requestData, null, 2));

//         const response = await axios.post(
//           "http://localhost:4005/api/saveConstituencyResults",
//           requestData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             validateStatus: status => status < 500
//           }
//         );

//         if (response.status >= 400) {
//           console.warn("Validation error from server:", response.data);
//           throw new Error(response.data.message || "Failed to save results");
//         }
//       } else if (actionTarget === 'national') {
//         // Handle declaring national results
//         const requestData = {
//           session_id: sessionId,
//           election_id: electionId,
//           party_performance: nationalAssemblyResults.map(item => ({
//             party_name: item.party,
//             performance: item.totalCandidates
//           }))
//         };

//         console.log("Request data for national results:", JSON.stringify(requestData, null, 2));

//         const response = await axios.post(
//           "http://localhost:4005/api/saveOverallPartyPerformance",
//           requestData,
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             validateStatus: status => status < 500
//           }
//         );

//         if (response.status >= 400) {
//           console.warn("Validation error from server:", response.data);
//           throw new Error(response.data.message || "Failed to save national results");
//         }
//       }

//       // Success
//       setIsDeclaring(false);
//       setShowSuccessModal(true);
//       setTimeout(() => {
//         setShowSuccessModal(false);
//       }, 2000);
      
//     } catch (err) {
//       console.error("Detailed error:", {
//         message: err.message,
//         response: err.response?.data,
//         config: err.config
//       });

//       setIsDeclaring(false);
//       alert(`Error: ${err.response?.data?.message || err.message}`);
//     }
//   };

//   const handleRemoveResult = async () => {
//     console.log("Starting to remove results...");
//     console.log("Using session ID:", sessionId);
//     console.log("Using election ID:", electionId);
    
//     // Validate session ID and election ID
//     if (!sessionId || !electionId) {
//       console.error("Session ID or Election ID is not available");
//       setIsDeclaring(false);
//       alert("Error: Session ID or Election ID is not available. Please refresh the page and try again.");
//       return;
//     }

//     setIsDeclaring(true);
    
//     try {
//       if (actionTarget === 'constituency') {
//         // Remove constituency results
//         const requestData = {
//           session_id: sessionId
//         };
        
//         console.log("Delete request data for constituency results:", requestData);
        
//         const response = await axios.delete(
//           "http://localhost:4005/api/deleteConstituencyResults", 
//           {
//             data: requestData,
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             validateStatus: status => status < 500
//           }
//         );
        
//         console.log("Delete response for constituency results:", response.data);

//         if (response.status >= 400) {
//           console.warn("Error from server:", response.data);
//           throw new Error(response.data.message || "Failed to remove constituency results");
//         }
//       } else if (actionTarget === 'national') {
//         // Remove national results
//         const requestData = {
//           session_id: sessionId,
//           election_id: electionId
//         };
        
//         console.log("Delete request data for national results:", requestData);
        
//         const response = await axios.delete(
//           "http://localhost:4005/api/removeDeclaredOverallPartyPerformance", 
//           {
//             data: requestData,
//             headers: {
//               'Content-Type': 'application/json',
//               'Accept': 'application/json'
//             },
//             validateStatus: status => status < 500
//           }
//         );
        
//         console.log("Delete response for national results:", response.data);

//         if (response.status >= 400) {
//           console.warn("Error from server:", response.data);
//           throw new Error(response.data.message || "Failed to remove national results");
//         }
//       }

//       // Success - show success modal
//       setIsDeclaring(false);
//       setShowSuccessModal(true);
//       console.log("Results removed successfully");
      
//       // Auto-close success modal and refresh data
//       setTimeout(() => {
//         setShowSuccessModal(false);
//         console.log("Success modal closed, reloading page...");
//         window.location.reload();
//       }, 2000);
      
//     } catch (err) {
//       console.error("Error removing results:", err);
//       console.error("Error details:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status,
//         sessionId: sessionId,
//         electionId: electionId
//       });
      
//       setIsDeclaring(false);
      
//       const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred";
//       alert(`Error removing results: ${errorMessage}`);
//     }
//   };

//   const handleActionConfirmation = () => {
//     console.log(`Confirming action: ${actionType} for ${actionTarget}`);
//     setShowConfirmationModal(false);
    
//     if (actionType === 'declare') {
//       handleDeclareResult();
//     } else if (actionType === 'remove') {
//       handleRemoveResult();
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />
//           <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <h3 className="text-lg font-medium text-gray-900">Loading Results</h3>
//               <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the election results.</p>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />
//           <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
//                 <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900">Error Loading Results</h3>
//               <p className="mt-2 text-sm text-gray-500">{error}</p>
//               <button 
//                 onClick={() => window.location.reload()} 
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
//               >
//                 Try Again
//               </button>
//             </div>
//           </main>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
//       {/* Sidebar */}
//       <div className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
//         isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//       }`}>
//         {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//             <div className="mb-8 text-center">
//               <h1 className="text-2xl font-bold text-gray-900">General Election Results</h1>
//               {sessionId && (
//                 <p className="text-sm text-gray-600">Session ID: {sessionId} | Election ID: {electionId}</p>
//               )}
//             </div>

//             {/* Dzongkhag Results */}
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Results by Dzongkhag</h1>
//               <p className="text-sm text-gray-600 mb-6">Complete list of candidates results</p>
              
//               <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//                 {results.length > 0 ? (
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dzongkhag</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Constituency</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {results.map((dzongkhag, dzIndex) => (
//                         <React.Fragment key={dzongkhag.id}>
//                           {dzongkhag.constituencies.map((constituency, constIndex) => (
//                             <React.Fragment key={`${dzongkhag.id}-${constituency.name}`}>
//                               {constituency.candidates.map((candidate, candIndex) => (
//                                 <tr key={candidate.id} className={candidate.isWinner ? "" : ""}>
//                                   {constIndex === 0 && candIndex === 0 && (
//                                     <td rowSpan={dzongkhag.constituencies.reduce((acc, curr) => acc + curr.candidates.length, 0)} 
//                                         className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r">
//                                       {dzIndex + 1}
//                                     </td>
//                                   )}
                                  
//                                   {constIndex === 0 && candIndex === 0 && (
//                                     <td rowSpan={dzongkhag.constituencies.reduce((acc, curr) => acc + curr.candidates.length, 0)} 
//                                         className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
//                                       {dzongkhag.dzongkhag}
//                                     </td>
//                                   )}
                                  
//                                   {candIndex === 0 && (
//                                     <td rowSpan={constituency.candidates.length} 
//                                         className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
//                                       {constituency.name}
//                                     </td>
//                                   )}
                                  
//                                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {candidate.party}
//                                   </td>
                                  
//                                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                                     {candidate.name}
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                                     {candidate.votes.toLocaleString()}
//                                   </td>
//                                   <td className="px-4 py-4 whitespace-nowrap text-center">
//                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
//                                       candidate.isWinner 
//                                         ? "text-green-800 bg-green-100" 
//                                         : "text-gray-800 bg-gray-100"
//                                     }`}>
//                                       {candidate.isWinner ? "Winner" : "Loss"}
//                                     </span>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </React.Fragment>
//                           ))}
//                         </React.Fragment>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     No constituency results available
//                   </div>
//                 )}
//                 <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
//                   <button 
//                     onClick={() => openConfirmationModal('declare', 'constituency')} 
//                     className="px-6 py-2 rounded-lg border text-sm font-medium bg-[#8EA5FE] text-white hover:bg-[#6f8cff] transition-colors duration-200"
//                   >
//                     Declare General Round Results
//                   </button>
//                   <button 
//                     onClick={() => openConfirmationModal('remove', 'constituency')}
//                     disabled={!sessionId}
//                     className={`px-6 py-2 rounded-lg border text-sm font-medium ml-2 transition-colors duration-200 ${
//                       sessionId 
//                         ? "bg-[#FF6161] text-white hover:bg-[#FF4C4C]" 
//                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     Remove Results
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* National Assembly Results */}
//             <div className="mb-8">
//               <h1 className="text-2xl font-bold text-gray-900 mb-6">Election Result by Constituency</h1>
//               <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//                 {nationalAssemblyResults.length > 0 ? (
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-100">
//                       <tr>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Candidates</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {nationalAssemblyResults.map((party, index) => (
//                         <tr key={index} className="hover:bg-gray-50">
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
//                             {index + 1}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {party.party}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
//                             {party.totalCandidates}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <div className="p-6 text-center text-gray-500">
//                     No party performance data available
//                   </div>
//                 )}
//                 <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
//                   <button 
//                     onClick={() => openConfirmationModal('declare', 'national')} 
//                     className="px-6 py-2 rounded-lg border text-sm font-medium bg-[#8EA5FE] text-white hover:bg-[#6f8cff] transition-colors duration-200"
//                   >
//                     Declare Final Results
//                   </button>
//                   <button 
//                     onClick={() => openConfirmationModal('remove', 'national')}
//                     disabled={!sessionId || !electionId}
//                     className={`px-6 py-2 rounded-lg border text-sm font-medium ml-2 transition-colors duration-200 ${
//                       sessionId && electionId
//                         ? "bg-[#FF6161] text-white hover:bg-[#FF4C4C]" 
//                         : "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     Remove Results
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>

//       {/* Modals */}
//       {showConfirmationModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
//             <div className="text-center">
//               <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
//                 <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900">Confirm {actionType === 'declare' ? 'Declaration' : 'Removal'}</h3>
//               <p className="mt-2 text-sm text-gray-500">
//                 {actionType === 'declare' 
//                   ? `Are you sure you want to declare these ${actionTarget === 'constituency' ? 'constituency' : 'national'} results? This action cannot be undone.`
//                   : `Are you sure you want to remove ${actionTarget === 'constituency' ? 'constituency' : 'national'} results for Session ID: ${sessionId}${actionTarget === 'national' ? ` and Election ID: ${electionId}` : ''}? This action cannot be undone.`}
//               </p>
//             </div>
//             <div className="mt-5 flex justify-center space-x-4">
//               <button onClick={closeConfirmationModal} 
//                       className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
//                 Cancel
//               </button>
//               <button onClick={handleActionConfirmation} 
//                       className={`px-4 py-2 text-white rounded-md text-sm font-medium hover:bg-opacity-90 ${
//                         actionType === 'declare' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
//                       }`}>
//                 Confirm
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {isDeclaring && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl text-center">
//             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
//             <h3 className="text-lg font-medium text-gray-900">
//               {actionType === 'declare' 
//                 ? `Declaring ${actionTarget === 'constituency' ? 'Constituency' : 'National'} Results` 
//                 : `Removing ${actionTarget === 'constituency' ? 'Constituency' : 'National'} Results`}
//             </h3>
//             <p className="mt-2 text-sm text-gray-500">Please wait while we process your request.</p>
//           </div>
//         </div>
//       )}

//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl text-center">
//             <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-4">
//               <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
//               </svg>
//             </div>
//             <h3 className="text-lg font-medium text-gray-900">Success!</h3>
//             <p className="mt-2 text-sm text-gray-500">
//               {actionType === 'declare' 
//                 ? `${actionTarget === 'constituency' ? 'Constituency' : 'National'} results declared successfully.` 
//                 : `${actionTarget === 'constituency' ? 'Constituency' : 'National'} results removed successfully.`}
//             </p>
//             <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
//               <div className="bg-green-500 h-1.5 rounded-full animate-progress"></div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default General_Result;

import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import axios from "axios";

const General_Result = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");

  // Modal states
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [actionType, setActionType] = useState(null); // 'declare' or 'remove'
  const [actionTarget, setActionTarget] = useState(null); // 'constituency' or 'national'
  
  // Results data
  const [results, setResults] = useState([]);
  const [nationalAssemblyResults, setNationalAssemblyResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Session ID and Election ID state - dynamically fetched
  const [sessionId, setSessionId] = useState(null);
  const [electionId, setElectionId] = useState(null);

  // Party mapping for IDs (you might want to fetch this from your API)
  const [partyMap, setPartyMap] = useState({
    "Druk Nyamrup Tshogpa": 1,
    "Druk Phuensum Tshogpa": 2,
    "Bhutan Tendrel Party": 3,
    "Druk Thundrel Party": 4
  });

  // Fetch session ID and election ID
  // Replace the existing fetchSessionAndElectionIds function with this:
const fetchSessionAndElectionIds = async () => {
  try {
    // Fetch session ID and election ID from single endpoint
    const response = await axios.get("http://localhost:4005/api/elections/latest-session/general");
    
    const sessionId = response.data.data.session.session_id;
    const electionId = response.data.data.election.election_id;
    
    return {
      sessionId: sessionId,
      electionId: electionId
    };
    
  } catch (error) {
    console.error("Error fetching IDs:", error);
    return {
      sessionId: 1,
      electionId: 1
    };
  }
};
  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch IDs first
        const { sessionId: currentSessionId, electionId: currentElectionId } = await fetchSessionAndElectionIds();
        setSessionId(currentSessionId);
        setElectionId(currentElectionId);

        // Fetch constituency-wise results
        const constituencyResponse = await axios.get("http://localhost:4005/api/getConstituencyWiseResult");
        const constituencyData = constituencyResponse.data.constituency_results;

        // Transform constituency data to match frontend structure
        const transformedResults = transformConstituencyData(constituencyData);
        setResults(transformedResults);

        // Fetch overall party performance
        const performanceResponse = await axios.get("http://localhost:4005/api/getOverallPartyPerformance");
        const performanceData = performanceResponse.data.party_performance;

        // Transform performance data to match frontend structure
        const transformedPerformance = performanceData.map(item => ({
          party: item.party_name,
          totalCandidates: item.performance,
          partyId: item.party_id
        }));
        setNationalAssemblyResults(transformedPerformance);

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to transform constituency data to match frontend structure
  const transformConstituencyData = (data) => {
    const dzongkhagMap = {};

    data.forEach(item => {
      if (!dzongkhagMap[item.dzongkhag_name]) {
        dzongkhagMap[item.dzongkhag_name] = {
          dzongkhag: item.dzongkhag_name,
          constituencies: []
        };
      }

      const constituency = {
        id: item.constituency_id,
        name: item.constituency_name,
        candidates: item.results.map(result => ({
          id: result.party_id,
          name: result.candidate_name,
          party: result.party_name,
          votes: result.vote_count,
          isWinner: result.result === "Winner"
        }))
      };

      dzongkhagMap[item.dzongkhag_name].constituencies.push(constituency);
    });

    return Object.values(dzongkhagMap).map((item, index) => ({
      id: index + 1,
      dzongkhag: item.dzongkhag,
      constituencies: item.constituencies
    }));
  };

  const openConfirmationModal = (type, target) => {
    setActionType(type);
    setActionTarget(target);
    setShowConfirmationModal(true);
  };

  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
    setActionType(null);
    setActionTarget(null);
  };

  const handleDeclareResult = async () => {
    try {
      setIsDeclaring(true);
      
      if (actionTarget === 'constituency') {
        // Existing constituency declaration logic
        const requestData = {
          session_id: sessionId,
          constituency_results: results.flatMap(dzongkhag =>
            dzongkhag.constituencies.map(constituency => ({
              dzongkhag_name: dzongkhag.dzongkhag || "",
              constituency_id: constituency.id.toString(),
              constituency_name: constituency.name || "",
              results: (constituency.candidates || []).map(candidate => ({
                party_id: candidate.id || null,
                party_name: candidate.party || "",
                candidate_name: candidate.name || "",
                vote_count: Number(candidate.votes) || 0,
                result: candidate.isWinner ? "Winner" : "Loss"
              }))
            }))
          )
        };

        const response = await axios.post(
          "http://localhost:4005/api/saveConstituencyResults",
          requestData
        );

        if (response.status >= 400) {
          throw new Error(response.data.message || "Failed to save results");
        }
      } else if (actionTarget === 'national') {
        // NEW: Handle declaring national results with the correct API endpoint and format
        const requestData = {
          session_id: sessionId,
          election_id: electionId,
          party_performance: nationalAssemblyResults.map(item => ({
            party_id: item.partyId || partyMap[item.party] || 0, // Fallback to 0 if not found
            party_name: item.party,
            performance: item.totalCandidates
          }))
        };

        console.log("Sending to declareOverallPartyPerformance:", requestData);
        
        const response = await axios.post(
          "http://localhost:4005/api/declareOverallPartyPerformance",
          requestData,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status >= 400) {
          throw new Error(response.data.message || "Failed to declare national results");
        }
      }

      // Success
      setIsDeclaring(false);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
      
    } catch (err) {
      console.error("Error:", err);
      setIsDeclaring(false);
      alert(`Error: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleRemoveResult = async () => {
    setIsDeclaring(true);
    
    try {
      if (actionTarget === 'constituency') {
        const requestData = { session_id: sessionId };
        const response = await axios.delete(
          "http://localhost:4005/api/deleteConstituencyResults", 
          { data: requestData }
        );
        
        if (response.status >= 400) {
          throw new Error(response.data.message || "Failed to remove constituency results");
        }
      } else if (actionTarget === 'national') {
        const requestData = { session_id: sessionId, election_id: electionId };
        const response = await axios.delete(
          "http://localhost:4005/api/removeDeclaredOverallPartyPerformance", 
          { data: requestData }
        );

        if (response.status >= 400) {
          throw new Error(response.data.message || "Failed to remove national results");
        }
      }

      // Success
      setIsDeclaring(false);
      setShowSuccessModal(true);
      
      setTimeout(() => {
        setShowSuccessModal(false);
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error("Error removing results:", err);
      setIsDeclaring(false);
      alert(`Error removing results: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleActionConfirmation = () => {
    setShowConfirmationModal(false);
    
    if (actionType === 'declare') {
      handleDeclareResult();
    } else if (actionType === 'remove') {
      handleRemoveResult();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900">Loading Results</h3>
              <p className="mt-2 text-sm text-gray-500">Please wait while we fetch the election results.</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />
          <main className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Error Loading Results</h3>
              <p className="mt-2 text-sm text-gray-500">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
      {/* Sidebar */}
      <div className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">General Election Results</h1>
            </div>

            {/* Dzongkhag Results */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Election Results by Dzongkhag</h1>
              <p className="text-sm text-gray-600 mb-6">Complete list of candidates results</p>
              
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                {results.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dzongkhag</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Constituency</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Votes</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {results.map((dzongkhag, dzIndex) => (
                        <React.Fragment key={dzongkhag.id}>
                          {dzongkhag.constituencies.map((constituency, constIndex) => (
                            <React.Fragment key={`${dzongkhag.id}-${constituency.name}`}>
                              {constituency.candidates.map((candidate, candIndex) => (
                                <tr key={candidate.id} className={candidate.isWinner ? "" : ""}>
                                  {constIndex === 0 && candIndex === 0 && (
                                    <td rowSpan={dzongkhag.constituencies.reduce((acc, curr) => acc + curr.candidates.length, 0)} 
                                        className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900 border-r">
                                      {dzIndex + 1}
                                    </td>
                                  )}
                                  
                                  {constIndex === 0 && candIndex === 0 && (
                                    <td rowSpan={dzongkhag.constituencies.reduce((acc, curr) => acc + curr.candidates.length, 0)} 
                                        className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                      {dzongkhag.dzongkhag}
                                    </td>
                                  )}
                                  
                                  {candIndex === 0 && (
                                    <td rowSpan={constituency.candidates.length} 
                                        className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                                      {constituency.name}
                                    </td>
                                  )}
                                  
                                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {candidate.party}
                                  </td>
                                  
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {candidate.name}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                    {candidate.votes.toLocaleString()}
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-center">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                      candidate.isWinner 
                                        ? "text-green-800 bg-green-100" 
                                        : "text-gray-800 bg-gray-100"
                                    }`}>
                                      {candidate.isWinner ? "Winner" : "Loss"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No constituency results available
                  </div>
                )}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button 
                    onClick={() => openConfirmationModal('declare', 'constituency')} 
                    className="px-6 py-2 rounded-lg border text-sm font-medium bg-[#8EA5FE] text-white hover:bg-[#6f8cff] transition-colors duration-200"
                  >
                    Declare General Round Results
                  </button>
                  <button 
                    onClick={() => openConfirmationModal('remove', 'constituency')}
                    disabled={!sessionId}
                    className={`px-6 py-2 rounded-lg border text-sm font-medium ml-2 transition-colors duration-200 ${
                      sessionId 
                        ? "bg-[#FF6161] text-white hover:bg-[#FF4C4C]" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Remove Results
                  </button>
                </div>
              </div>
            </div>

            {/* National Assembly Results */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Election Result by Constituency</h1>
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                {nationalAssemblyResults.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">S/N</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Party</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total Candidates</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {nationalAssemblyResults.map((party, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-center text-gray-900">
                            {index + 1}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {party.party}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                            {party.totalCandidates}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No party performance data available
                  </div>
                )}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                  <button 
                    onClick={() => openConfirmationModal('declare', 'national')} 
                    className="px-6 py-2 rounded-lg border text-sm font-medium bg-[#8EA5FE] text-white hover:bg-[#6f8cff] transition-colors duration-200"
                  >
                    Declare Final Results
                  </button>
                  <button 
                    onClick={() => openConfirmationModal('remove', 'national')}
                    disabled={!sessionId || !electionId}
                    className={`px-6 py-2 rounded-lg border text-sm font-medium ml-2 transition-colors duration-200 ${
                      sessionId && electionId
                        ? "bg-[#FF6161] text-white hover:bg-[#FF4C4C]" 
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Remove Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Confirm {actionType === 'declare' ? 'Declaration' : 'Removal'}</h3>
              <p className="mt-2 text-sm text-gray-500">
                {actionType === 'declare' 
                  ? `Are you sure you want to declare these ${actionTarget === 'constituency' ? 'constituency' : 'national'} results? This action cannot be undone.`
                  : `Are you sure you want to remove ${actionTarget === 'constituency' ? 'constituency' : 'national'} results for Session ID: ${sessionId}${actionTarget === 'national' ? ` and Election ID: ${electionId}` : ''}? This action cannot be undone.`}
              </p>
            </div>
            <div className="mt-5 flex justify-center space-x-4">
              <button onClick={closeConfirmationModal} 
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleActionConfirmation} 
                      className={`px-4 py-2 text-white rounded-md text-sm font-medium hover:bg-opacity-90 ${
                        actionType === 'declare' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                      }`}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeclaring && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900">
              {actionType === 'declare' 
                ? `Declaring ${actionTarget === 'constituency' ? 'Constituency' : 'National'} Results` 
                : `Removing ${actionTarget === 'constituency' ? 'Constituency' : 'National'} Results`}
            </h3>
            <p className="mt-2 text-sm text-gray-500">Please wait while we process your request.</p>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl text-center">
            <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Success!</h3>
            <p className="mt-2 text-sm text-gray-500">
              {actionType === 'declare' 
                ? `${actionTarget === 'constituency' ? 'Constituency' : 'National'} results declared successfully.` 
                : `${actionTarget === 'constituency' ? 'Constituency' : 'National'} results removed successfully.`}
            </p>
            <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
              <div className="bg-green-500 h-1.5 rounded-full animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default General_Result;