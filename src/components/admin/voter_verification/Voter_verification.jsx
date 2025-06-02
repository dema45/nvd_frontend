// import React, { useState, useEffect } from "react";
// import Navbar from "../navbar/Navbar";
// import Sidebar from "../sidebar/Sidebar";
// import { 
//   MagnifyingGlassIcon, 
//   FunnelIcon, 
//   ChevronDownIcon 
// } from "@heroicons/react/24/outline";

// const Voter_verification = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const userId = localStorage.getItem("userId");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortBy, setSortBy] = useState("Newest");
//   const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [voters, setVoters] = useState([]);
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [voterToReject, setVoterToReject] = useState(null);
//   const [rejectionReason, setRejectionReason] = useState("");
//   const [isRejecting, setIsRejecting] = useState(false);
//   const [isAccepting, setIsAccepting] = useState(false);
//   const [lastAction, setLastAction] = useState(null);
//   const [dzongkhags, setDzongkhags] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [votersPerPage] = useState(5);
//   const [constituencies, setConstituencies] = useState([]);
//   const [allConstituencies, setAllConstituencies] = useState([]); // New state for all constituencies
//   const [error, setError] = useState("");

//   // Format date function from Create_session
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
    
//     try {
//       const date = new Date(dateString);
//       return date.toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch (error) {
//       console.error("Date formatting error:", error);
//       return "N/A";
//     }
//   };

//   // Fetch the list of voters
//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       setError("No authentication token found");
//       return;
//     }

//     fetch("http://localhost:4005/api/admin/voters/pending", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       }
//     })
//       .then((res) => res.json())
//       .then((json) => {
//         setVoters(json);
//       })
//       .catch((error) => {
//         console.error("Error fetching voter data:", error);
//         setError("Failed to fetch voter data");
//       });
//   }, []);
// useEffect(() => {
//   if (voters.length > 0) {
//     console.log("First voter object:", voters[0]);
//     console.log("Available properties:", Object.keys(voters[0]));
//   }
//   if (allConstituencies.length > 0) {
//     console.log("All constituencies loaded:", allConstituencies);
//     console.log("First constituency structure:", allConstituencies[0]);
//   }
// }, [voters, allConstituencies]);

//   // Fetch all dzongkhags and constituencies on component mount
//   useEffect(() => {
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       setError("No authentication token found");
//       return;
//     }

//     // Fetch all dzongkhags
//     fetch("http://localhost:4005/api/dzongkhags", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const dzongkhagsList = Array.isArray(data) ? data : data.data || [];
//         setDzongkhags(dzongkhagsList);
//       })
//       .catch((error) => {
//         console.error("Error fetching dzongkhags:", error);
//         setError("Failed to fetch dzongkhags");
//       });

//     // Fetch all constituencies
//     fetch("http://localhost:4005/api/constituencies", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const constituenciesList = Array.isArray(data) ? data : data.data || [];
//         setAllConstituencies(constituenciesList);
//       })
//       .catch((error) => {
//         console.error("Error fetching all constituencies:", error);
//         setError("Failed to fetch constituencies");
//       });
//   }, []);

//   const getDzongkhagName = (dzongkhagId) => {
//     if (!dzongkhagId) return "N/A";
//     const dzongkhag = dzongkhags.find(
//       (d) => d.dzongkhag_id?.toString() === dzongkhagId?.toString()
//     );
//     return dzongkhag ? dzongkhag.dzongkhag_name : dzongkhagId;
//   };

//   // 1. Fix the getConstituencyName function to handle the correct property name
// // Updated getConstituencyName function for your data structure
// const getConstituencyName = (constituencyId) => {
//   if (!constituencyId) return "N/A";
  
//   const idString = constituencyId.toString();
  
//   // Check in the allConstituencies list first
//   const allConstituency = allConstituencies.find(
//     (c) => c.constituency_id?.toString() === idString
//   );
//   if (allConstituency) {
//     return allConstituency.constituency_name;
//   }
  
//   // Check in the current constituencies list (filtered by dzongkhag)
//   const currentConstituency = constituencies.find(
//     (c) => c.constituency_id?.toString() === idString
//   );
//   if (currentConstituency) {
//     return currentConstituency.constituency_name;
//   }
  
//   // If allConstituencies is empty, we'll show the ID for now
//   // You could implement individual fetching here if needed
//   return `ID: ${constituencyId}`;
// };


//   const fetchConstituencies = (dzongkhagId) => {
//     if (!dzongkhagId) {
//       setConstituencies([]);
//       return;
//     }

//     const token = localStorage.getItem("jwtToken");
//     const url = `http://localhost:4005/api/dzongkhags/${dzongkhagId}/constituencies`;

//     fetch(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         const constituenciesList = data.constituencies || [];
//         setConstituencies(constituenciesList);
//       })
//       .catch((error) => {
//         console.error("Error fetching constituencies:", error);
//         setConstituencies([]);
//         setError("Failed to fetch constituencies");
//       });
//   };

//   const handleSearch = (e) => {
//     e.preventDefault();
//     setCurrentPage(1);
//   };

//   const handleSortChange = (e) => {
//     setSortBy(e.target.value);
//     setCurrentPage(1);
//   };

//   const handleDzongkhagChange = (e) => {
//     const dzongkhagId = e.target.value;
//     setSelectedDzongkhag(dzongkhagId);
//     setCurrentPage(1);
//     fetchConstituencies(dzongkhagId);
//   };

//   const handleAccept = async (cid) => {
//     const token = localStorage.getItem("jwtToken");
//     if (!token) {
//       setError("No authentication token found");
//       return;
//     }

//     setIsAccepting(true);
//     setError("");

//     try {
//       const res = await fetch(
//         `http://localhost:4005/api/admin/approve/${cid}`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await res.json();
//       if (!res.ok) {
//         throw new Error(data.message || "Failed to approve voter");
//       }

//       if (data.token) {
//         localStorage.setItem("jwtToken", data.token);
//       }

//       setVoters(voters.filter((voter) => voter.cid !== cid));
//       setLastAction("accept");
//       setShowSuccessModal(true);

//       // Hide success modal after 2 seconds
//       setTimeout(() => {
//         setShowSuccessModal(false);
//       }, 2000);

//     } catch (error) {
//       console.error("Approval error:", error);
//       setError(error.message || "Failed to approve voter");
//     } finally {
//       setIsAccepting(false);
//     }
//   };

//   const handleRejectClick = (voter) => {
//     setVoterToReject(voter);
//     setShowRejectModal(true);
//     setError("");
//   };

//   const handleConfirmReject = async () => {
//     if (!rejectionReason.trim()) {
//       setError("Please provide a reason for rejection");
//       return;
//     }

//     setIsRejecting(true);
//     setError("");

//     try {
//       const token = localStorage.getItem("jwtToken");
//       const response = await fetch(
//         `http://localhost:4005/api/admin/reject/${voterToReject.cid}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ rejectionReason }),
//         }
//       );

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to reject voter");
//       }

//       setVoters(voters.filter((voter) => voter.cid !== voterToReject.cid));
//       setLastAction("reject");
//       setShowRejectModal(false);
//       setShowSuccessModal(true);

//       // Hide success modal after 2 seconds
//       setTimeout(() => {
//         setShowSuccessModal(false);
//       }, 2000);

//     } catch (error) {
//       console.error("Rejection error:", error);
//       setError(error.message || "Failed to reject voter");
//     } finally {
//       setIsRejecting(false);
//       setRejectionReason("");
//     }
//   };

//   // Filter voters based on search term (CID), Dzongkhag and pending status
//   const filteredVoters = voters.filter((voter) => {
//     const searchMatch =
//       searchTerm === "" || voter.cid.includes(searchTerm.trim());
//     const dzongkhagMatch =
//       selectedDzongkhag === "" || voter.dzongkhag === selectedDzongkhag;
//     const statusMatch = voter.status === "pending";

//     return searchMatch && dzongkhagMatch && statusMatch;
//   });

//   const sortedVoters = [...filteredVoters].sort((a, b) => {
//     switch (sortBy) {
//       case "Newest":
//         return b.id - a.id;
//       case "Oldest":
//         return a.id - b.id;
//       case "Name":
//         return a.uname.localeCompare(b.uname);
//       case "Age":
//         return a.age - b.age;
//       default:
//         return 0;
//     }
//   });

//   // Pagination logic
//   const indexOfLastVoter = currentPage * votersPerPage;
//   const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
//   const currentVoters = sortedVoters.slice(indexOfFirstVoter, indexOfLastVoter);
//   const totalPages = Math.ceil(sortedVoters.length / votersPerPage);

//   // Change page
//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "Poppins" }}>
//       {/* Sidebar */}
//       <div className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
//         isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
//       }`}>
//         {isSidebarOpen && (
//           <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
//         )}
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Navbar
//           toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
//           userId={userId}
//         />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
//             {/* Error Message */}
//             {error && (
//               <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
//                 <span className="block sm:inline">{error}</span>
//               </div>
//             )}

//             {/* Dzongkhag Selection */}
//             <div className="w-1/3 mb-6">
//               <label className="block text-gray-700 text-sm font-medium mb-1">
//                 Dzongkhag
//               </label>
//               <select
//                 value={selectedDzongkhag}
//                 onChange={handleDzongkhagChange}
//                 className="mt-1 p-2 border border-[#8EA5FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700"
//               >
//                 <option value="">All Dzongkhags</option>
//                 {dzongkhags.map((dzongkhag) => (
//                   <option key={dzongkhag.dzongkhag_id} value={dzongkhag.dzongkhag_id}>
//                     {dzongkhag.dzongkhag_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Header Section */}
//             <div className="mb-8">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900">
//                     Voter Verification
//                   </h1>
//                 </div>
//               </div>
//             </div>

//             {/* Filters Section */}
//             <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
//               <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                 <form
//                   onSubmit={handleSearch}
//                   className="relative flex-grow max-w-2xl"
//                 >
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Search voters..."
//                     className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                 </form>

//                 <div className="flex items-center space-x-4">
//                   <div className="flex items-center">
//                     <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
//                     <label
//                       htmlFor="sort"
//                       className="text-sm font-medium text-gray-700 mr-2"
//                     >
//                       Sort by:
//                     </label>
//                     <div className="relative">
//                       <select
//                         id="sort"
//                         value={sortBy}
//                         onChange={handleSortChange}
//                         className="appearance-none bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       >
//                         <option value="Newest">Newest First</option>
//                         <option value="Oldest">Oldest First</option>
//                         <option value="Name">Name</option>
//                         <option value="Age">Age</option>
//                       </select>
//                       <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
//                         <ChevronDownIcon className="h-4 w-4 text-gray-400" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead className="bg-gray-100">
//                     <tr>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         S/N
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         CID
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Age
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Dzongkhag
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Constituency
//                       </th>
//                       <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {currentVoters.length > 0 ? (
//                       currentVoters.map((voter, index) => (
//                         <tr
//                           key={voter.cid}
//                           className="hover:bg-gray-50 transition-colors duration-150"
//                         >
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
//                             {indexOfFirstVoter + index + 1}
//                           </td>
//                           <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
//                             {voter.cid}
//                           </td>
//                           <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
//                             {voter.uname}
//                           </td>
//                           <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
//                             {voter.age}
//                           </td>
//                           <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
//                             {voter.email}
//                           </td>
//                           <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
//                             {getDzongkhagName(voter.dzongkhag)}
//                           </td>
//                           <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
//   {getConstituencyName(voter.constituencies)} {/* Keep as voter.constituencies - this is correct */}
// </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-center">
//                             <div className="flex justify-center space-x-3">
//                               <button
//                                 onClick={() => handleAccept(voter.cid)}
//                                 disabled={isAccepting}
//                                 className={`text-green-600 hover:text-green-900 px-4 py-2 rounded-lg border border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 transition-colors duration-200 text-sm font-medium ${
//                                   isAccepting ? "opacity-50 cursor-not-allowed" : ""
//                                 }`}
//                               >
//                                 {isAccepting ? "Accepting..." : "Accept"}
//                               </button>
//                               <button
//                                 onClick={() => handleRejectClick(voter)}
//                                 className="text-red-600 hover:text-red-900 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
//                               >
//                                 Reject
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="8"
//                           className="px-4 py-4 text-center text-sm text-gray-500"
//                         >
//                           No pending voter verifications found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Pagination - Always show if there are voters */}
//             {sortedVoters.length > 0 && (
//               <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4">
//                 <div className="text-sm text-gray-500 mb-4 sm:mb-0">
//                   Showing{" "}
//                   <span className="font-medium">{indexOfFirstVoter + 1}</span>{" "}
//                   to{" "}
//                   <span className="font-medium">
//                     {Math.min(indexOfLastVoter, sortedVoters.length)}
//                   </span>{" "}
//                   of <span className="font-medium">{sortedVoters.length}</span>{" "}
//                   results
//                 </div>

//                 {/* Page Navigation Buttons */}
//                 <div className="flex items-center space-x-2">
//                   <button
//                     onClick={prevPage}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-lg border text-sm font-medium ${
//                       currentPage === 1
//                         ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
//                         : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//                     }`}
//                   >
//                     Previous
//                   </button>

//                   {/* Page Numbers */}
//                   <div className="flex space-x-1">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                       (number) => (
//                         <button
//                           key={number}
//                           onClick={() => paginate(number)}
//                           className={`px-3 py-1 rounded-lg border text-sm font-medium ${
//                             currentPage === number
//                               ? "border-indigo-500 text-white bg-indigo-600"
//                               : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//                           }`}
//                         >
//                           {number}
//                         </button>
//                       )
//                     )}
//                   </div>

//                   <button
//                     onClick={nextPage}
//                     disabled={currentPage === totalPages || totalPages === 0}
//                     className={`px-3 py-1 rounded-lg border text-sm font-medium ${
//                       currentPage === totalPages || totalPages === 0
//                         ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
//                         : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </main>
//       </div>

//       {/* Rejection Modal (styled like Create_session) */}
//       {showRejectModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-64">
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-center">
//                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
//                   <svg
//                     className="h-6 w-6 text-red-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-3 text-center sm:mt-5">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Confirm Rejection
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Are you sure you want to reject voter{" "}
//                     <span className="font-semibold">
//                       {voterToReject?.uname} (CID: {voterToReject?.cid})
//                     </span>
//                     ?
//                   </p>
//                 </div>
//               </div>
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Reason for Rejection
//                 </label>
//                 <textarea
//                   rows="3"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
//                   placeholder="Enter reason..."
//                   value={rejectionReason}
//                   onChange={(e) => setRejectionReason(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
//               <button
//                 type="button"
//                 className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
//                 onClick={handleConfirmReject}
//                 disabled={isRejecting || !rejectionReason.trim()}
//               >
//                 {isRejecting ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Rejecting...
//                   </span>
//                 ) : (
//                   "Confirm Reject"
//                 )}
//               </button>
//               <button
//                 type="button"
//                 className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
//                 onClick={() => {
//                   setShowRejectModal(false);
//                   setRejectionReason("");
//                 }}
//                 disabled={isRejecting}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal (styled like Create_session) */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-64">
//           <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
//             <div className="p-6">
//               <div className="flex items-center justify-center">
//                 <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
//                   <svg
//                     className="h-6 w-6 text-green-600"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//               </div>
//               <div className="mt-3 text-center sm:mt-5">
//                 <h3 className="text-lg leading-6 font-medium text-gray-900">
//                   Success!
//                 </h3>
//                 <div className="mt-2">
//                   <p className="text-sm text-gray-500">
//                     Voter has been {lastAction === "reject" ? "rejected" : "accepted"} successfully.
//                   </p>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-gray-50 px-4 py-3 sm:px-6 rounded-b-2xl">
//               <div className="w-full bg-gray-200 rounded-full h-1.5">
//                 <div
//                   className="bg-green-500 h-1.5 rounded-full"
//                   style={{
//                     animation: "progress 2s linear forwards",
//                   }}
//                 ></div>
//                 <style jsx>{`
//                   @keyframes progress {
//                     from {
//                       width: 100%;
//                     }
//                     to {
//                       width: 0%;
//                     }
//                   }
//                 `}</style>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Voter_verification;

import React, { useState, useEffect } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ChevronDownIcon 
} from "@heroicons/react/24/outline";

const Voter_verification = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = localStorage.getItem("userId");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedDzongkhag, setSelectedDzongkhag] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [voters, setVoters] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [voterToReject, setVoterToReject] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [dzongkhags, setDzongkhags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [votersPerPage] = useState(5);
  const [constituencies, setConstituencies] = useState([]);
  const [error, setError] = useState("");

  // Format date function
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

  // Fetch the list of voters
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    fetch("http://localhost:4005/api/admin/voters/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => res.json())
      .then((json) => {
        setVoters(json);
      })
      .catch((error) => {
        console.error("Error fetching voter data:", error);
        setError("Failed to fetch voter data");
      });
  }, []);

  // Fetch all dzongkhags on component mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    // Fetch all dzongkhags
    fetch("http://localhost:4005/api/dzongkhags", {
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
        const dzongkhagsList = Array.isArray(data) ? data : data.data || [];
        setDzongkhags(dzongkhagsList);
      })
      .catch((error) => {
        console.error("Error fetching dzongkhags:", error);
        setError("Failed to fetch dzongkhags");
      });

    // Fetch all constituencies initially
    fetchAllConstituencies();
  }, []);

  // Fetch constituencies when dzongkhag changes
  useEffect(() => {
    if (selectedDzongkhag) {
      fetchConstituencies(selectedDzongkhag);
    } else {
      // If no dzongkhag is selected, we still need constituency data for all voters
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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleDzongkhagChange = (e) => {
    const dzongkhagId = e.target.value;
    setSelectedDzongkhag(dzongkhagId);
    setSelectedConstituency("");
    setCurrentPage(1);
  };

  const handleConstituencyChange = (e) => {
    setSelectedConstituency(e.target.value);
    setCurrentPage(1);
  };

  const handleAccept = async (cid) => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setError("No authentication token found");
      return;
    }

    setIsAccepting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:4005/api/admin/approve/${cid}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to approve voter");
      }

      if (data.token) {
        localStorage.setItem("jwtToken", data.token);
      }

      setVoters(voters.filter((voter) => voter.cid !== cid));
      setLastAction("accept");
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

    } catch (error) {
      console.error("Approval error:", error);
      setError(error.message || "Failed to approve voter");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectClick = (voter) => {
    setVoterToReject(voter);
    setShowRejectModal(true);
    setError("");
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) {
      setError("Please provide a reason for rejection");
      return;
    }

    setIsRejecting(true);
    setError("");

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:4005/api/admin/reject/${voterToReject.cid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rejectionReason }),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reject voter");
      }

      setVoters(voters.filter((voter) => voter.cid !== voterToReject.cid));
      setLastAction("reject");
      setShowRejectModal(false);
      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);

    } catch (error) {
      console.error("Rejection error:", error);
      setError(error.message || "Failed to reject voter");
    } finally {
      setIsRejecting(false);
      setRejectionReason("");
    }
  };

  // Filter voters based on search term, dzongkhag, and constituency
  const filteredVoters = voters.filter((voter) => {
    const searchMatch =
      searchTerm === "" || 
      voter.cid.includes(searchTerm.trim()) || 
      voter.uname.toLowerCase().includes(searchTerm.toLowerCase());
    
    const dzongkhagMatch =
      selectedDzongkhag === "" || 
      voter.dzongkhag?.toString() === selectedDzongkhag;
    
    const constituencyMatch =
      selectedConstituency === "" || 
      voter.constituencies?.toString() === selectedConstituency;
    
    const statusMatch = voter.status === "pending";

    return searchMatch && dzongkhagMatch && constituencyMatch && statusMatch;
  });

  const sortedVoters = [...filteredVoters].sort((a, b) => {
    switch (sortBy) {
      case "Newest":
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      case "Oldest":
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      case "Name":
        return (a.uname || "").localeCompare(b.uname || "");
      case "Age":
        return a.age - b.age;
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastVoter = currentPage * votersPerPage;
  const indexOfFirstVoter = indexOfLastVoter - votersPerPage;
  const currentVoters = sortedVoters.slice(indexOfFirstVoter, indexOfLastVoter);
  const totalPages = Math.ceil(sortedVoters.length / votersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50" style={{ fontFamily: "Poppins" }}>
      {/* Sidebar */}
      <div className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
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
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Voter Verification
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
                    placeholder="Search voters..."
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
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
                      <option value="Age">Age</option>
                    </select>
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
                          key={voter.cid}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                            {indexOfFirstVoter + index + 1}
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
                                onClick={() => handleAccept(voter.cid)}
                                disabled={isAccepting}
                                className={`text-green-600 hover:text-green-900 px-4 py-2 rounded-lg border border-green-200 hover:border-green-300 bg-green-50 hover:bg-green-100 transition-colors duration-200 text-sm font-medium ${
                                  isAccepting ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              >
                                {isAccepting ? "Accepting..." : "Accept"}
                              </button>
                              <button
                                onClick={() => handleRejectClick(voter)}
                                className="text-red-600 hover:text-red-900 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                              >
                                Reject
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
                          No pending voter verifications found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {sortedVoters.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between p-4">
                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstVoter + 1}</span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastVoter, sortedVoters.length)}
                  </span>{" "}
                  of <span className="font-medium">{sortedVoters.length}</span>{" "}
                  results
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                        : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                    }`}
                  >
                    Previous
                  </button>

                  <div className="flex space-x-1">
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
                  </div>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                      currentPage === totalPages || totalPages === 0
                        ? "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
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

      {/* Rejection Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-64">
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
                  Confirm Rejection
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to reject voter{" "}
                    <span className="font-semibold">
                      {voterToReject?.uname} (CID: {voterToReject?.cid})
                    </span>
                    ?
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Rejection
                </label>
                <textarea
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7083F5]"
                  placeholder="Enter reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                onClick={handleConfirmReject}
                disabled={isRejecting || !rejectionReason.trim()}
              >
                {isRejecting ? (
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
                    Rejecting...
                  </span>
                ) : (
                  "Confirm Reject"
                )}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
                disabled={isRejecting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24 pl-64">
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
                    Voter has been {lastAction === "reject" ? "rejected" : "accepted"} successfully.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 rounded-b-2xl">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
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

export default Voter_verification;