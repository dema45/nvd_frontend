// import React, { useState, useEffect } from "react";
// import primary from "../Assets/primary.jpeg";
// import general from "../Assets/general.jpeg";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { FaSpinner, FaCheckCircle, FaClock } from "react-icons/fa";

// const ElectionEvents = () => {
//   const [electionsData, setElectionsData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [userId, setUserId] = useState('');
//   const [votingStatus, setVotingStatus] = useState({
//     primary_voted: false,
//     general_voted: false
//   });
//   const [currentSessionId, setCurrentSessionId] = useState(null);
//   const navigate = useNavigate();

//   // Fetch user ID from token
//   useEffect(() => {
//     const fetchUserId = () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const parts = token.split('.');
//         if (parts.length !== 3) {
//           throw new Error('Invalid token format');
//         }

//         const payloadBase64 = parts[1];
//         const padded = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
//         const decoded = JSON.parse(atob(padded));
//         setUserId(decoded.cid);
//       } catch (err) {
//         console.error('Error decoding token:', err);
//         navigate('/login');
//       }
//     };

//     fetchUserId();
//   }, [navigate]);

//   // Fetch elections and voting status
//   useEffect(() => {
//     if (!userId) return;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
        
//         // Fetch election data first
//         const response = await axios.get("http://localhost:4005/api/elections/latest-session/all");
//         setElectionsData(response.data.data);
        
//         // Get session ID from response
//         if (response.data?.data?.session?.session_id) {
//           const sessionId = response.data.data.session.session_id;
//           setCurrentSessionId(sessionId);
          
//           // Fetch voting status
//           const statusResponse = await axios.get(
//             `http://localhost:4005/api/voting-status?cid=${userId}&session_id=${sessionId}`
//           );
          
//           if (statusResponse.data?.data) {
//             setVotingStatus(statusResponse.data.data);
//           }
//         }

//         setLoading(false);
//       } catch (err) {
//         setError("Failed to fetch election data");
//         setLoading(false);
//         console.error("Error fetching election data:", err);
//       }
//     };

//     fetchData();
//   }, [userId]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "Not scheduled";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getElectionStatus = (electionData) => {
//     if (!electionData) return "not-created";
    
//     const now = new Date();
//     const start = new Date(electionData.start_date);
//     const end = new Date(electionData.end_date);
    
//     if (now < start) return "upcoming";
//     if (now >= start && now <= end) return "active";
//     return "ended";
//   };

//   const getButtonConfig = (electionType, status, hasPool) => {
//     const hasVoted = electionType === 'primary' 
//       ? votingStatus.primary_voted 
//       : votingStatus.general_voted;

//     if (hasVoted) {
//       return {
//         text: 'Already Voted',
//         icon: <FaCheckCircle className="mr-2" />,
//         color: 'bg-green-500',
//         disabled: true
//       };
//     }

//     switch (status) {
//       case "not-created":
//         return {
//           text: 'Election Not Created',
//           icon: <FaClock className="mr-2" />,
//           color: 'bg-gray-300',
//           disabled: true
//         };
//       case "upcoming":
//         return {
//           text: 'Voting Not Started',
//           icon: <FaClock className="mr-2" />,
//           color: 'bg-yellow-500',
//           disabled: true
//         };
//       case "active":
//         return hasPool 
//           ? {
//               text: 'Vote Now',
//               icon: null,
//               color: 'bg-blue-600 hover:bg-blue-700',
//               disabled: false
//             }
//           : {
//               text: `No ${electionType === 'primary' ? 'Parties' : 'Candidates'} Available`,
//               icon: null,
//               color: 'bg-gray-400',
//               disabled: true
//             };
//       case "ended":
//         return {
//           text: 'Voting Ended',
//           icon: null,
//           color: 'bg-gray-400',
//           disabled: true
//         };
//       default:
//         return {
//           text: 'Loading...',
//           icon: null,
//           color: 'bg-gray-300',
//           disabled: true
//         };
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
//           <p className="text-gray-600">Loading election data...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 text-xl mb-4">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const elections = [
//     {
//       title: "Primary Round Election",
//       description: "Cast your vote for your preferred political party in the primary round.",
//       electionType: "primary",
//       imgSrc: primary,
//     },
//     {
//       title: "General Round Election",
//       description: "Cast your vote for your preferred candidate in the general election.",
//       electionType: "general",
//       imgSrc: general,
//     },
//   ];

//   return (
//     <div className="p-6 bg-gray-50">
//       <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Upcoming Election Events</h2>

//       <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
//         {elections.map((election, index) => {
//           const electionData = electionsData?.elections?.find(
//             (e) => e.election_type === election.electionType
//           );

//           const status = getElectionStatus(electionData);
//           const hasPool = electionData?.pool?.length > 0;
//           const buttonConfig = getButtonConfig(election.electionType, status, hasPool);

//           return (
//             <div
//               key={index}
//               className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col"
//             >
//               <div className="relative overflow-hidden flex-shrink-0">
//                 <img
//                   src={election.imgSrc}
//                   alt={election.title}
//                   className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
//                   <h3 className="text-white text-xl font-bold">{election.title}</h3>
//                 </div>
//               </div>

//               <div className="p-6 flex-grow flex flex-col">
//                 <h2 className="text-xl font-semibold mb-3 text-gray-800">{election.title}</h2>
//                 <p className="text-gray-600 mb-4 flex-grow">{election.description}</p>

//                 {electionData ? (
//                   <>
//                     <div className="flex items-center gap-2 mb-2">
//                       <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                       </svg>
//                       <span className="text-sm text-gray-600">
//                         <strong>Starts:</strong> {formatDate(electionData.start_date)}
//                       </span>
//                     </div>

//                     <div className="flex items-center gap-2 mb-4">
//                       <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//                       </svg>
//                       <span className="text-sm text-gray-600">
//                         <strong>Ends:</strong> {formatDate(electionData.end_date)}
//                       </span>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="mb-4 text-gray-500 italic">
//                     Election not scheduled yet
//                   </div>
//                 )}

//                 <div className="mt-auto">
//                   {buttonConfig.disabled ? (
//                     <button
//                       className={`w-full px-4 py-2.5 ${buttonConfig.color} text-white rounded-lg font-medium cursor-not-allowed flex items-center justify-center`}
//                       disabled
//                     >
//                       {buttonConfig.icon}
//                       {buttonConfig.text}
//                     </button>
//                   ) : (
//                     <Link to={`/${election.electionType === 'primary' ? 'PartySelection' : 'CandidateSelection'}`}>
//                       <button
//                         className={`w-full px-4 py-2.5 ${buttonConfig.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center`}
//                       >
//                         {buttonConfig.icon}
//                         {buttonConfig.text}
//                       </button>
//                     </Link>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ElectionEvents;

import React, { useState, useEffect } from "react";
import primary from "../Assets/primary.jpeg";
import general from "../Assets/general.jpeg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSpinner, FaCheckCircle, FaClock, FaExclamationTriangle } from "react-icons/fa";

const ElectionEvents = () => {
  const [electionsData, setElectionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noElectionData, setNoElectionData] = useState(false);
  const [userId, setUserId] = useState('');
  const [votingStatus, setVotingStatus] = useState({
    primary_voted: false,
    general_voted: false
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const navigate = useNavigate();

  // Fetch user ID from token
  useEffect(() => {
    const fetchUserId = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }

        const payloadBase64 = parts[1];
        const padded = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
        const decoded = JSON.parse(atob(padded));
        setUserId(decoded.cid);
      } catch (err) {
        console.error('Error decoding token:', err);
        navigate('/login');
      }
    };

    fetchUserId();
  }, [navigate]);

  // Fetch elections and voting status
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoElectionData(false);
        
        // Fetch election data first
        const response = await axios.get("http://localhost:4005/api/elections/latest-session/all");
        
        // Check if there's no election data or empty elections array
        if (!response.data?.data || !response.data.data.elections || response.data.data.elections.length === 0) {
          setNoElectionData(true);
          setLoading(false);
          return;
        }
        
        setElectionsData(response.data.data);
        
        // Get session ID from response
        if (response.data?.data?.session?.session_id) {
          const sessionId = response.data.data.session.session_id;
          setCurrentSessionId(sessionId);
          
          // Fetch voting status
          const statusResponse = await axios.get(
            `http://localhost:4005/api/voting-status?cid=${userId}&session_id=${sessionId}`
          );
          
          if (statusResponse.data?.data) {
            setVotingStatus(statusResponse.data.data);
          }
        }

        setLoading(false);
      } catch (err) {
        // Check if it's a 404 or similar error indicating no elections
        if (err.response?.status === 404 || err.response?.data?.message?.includes('No session found')) {
          setNoElectionData(true);
        } else {
          setError("Failed to fetch election data");
        }
        setLoading(false);
        console.error("Error fetching election data:", err);
      }
    };

    fetchData();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getElectionStatus = (electionData) => {
    if (!electionData) return "not-created";
    
    const now = new Date();
    const start = new Date(electionData.start_date);
    const end = new Date(electionData.end_date);
    
    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "ended";
  };

  const getButtonConfig = (electionType, status, hasPool) => {
    const hasVoted = electionType === 'primary' 
      ? votingStatus.primary_voted 
      : votingStatus.general_voted;

    if (hasVoted) {
      return {
        text: 'Already Voted',
        icon: <FaCheckCircle className="mr-2" />,
        color: 'bg-green-500',
        disabled: true
      };
    }

    switch (status) {
      case "not-created":
        return {
          text: 'Election Not Created',
          icon: <FaClock className="mr-2" />,
          color: 'bg-gray-300',
          disabled: true
        };
      case "upcoming":
        return {
          text: 'Voting Not Started',
          icon: <FaClock className="mr-2" />,
          color: 'bg-yellow-500',
          disabled: true
        };
      case "active":
        return hasPool 
          ? {
              text: 'Vote Now',
              icon: null,
              color: 'bg-blue-600 hover:bg-blue-700',
              disabled: false
            }
          : {
              text: `No ${electionType === 'primary' ? 'Parties' : 'Candidates'} Available`,
              icon: null,
              color: 'bg-gray-400',
              disabled: true
            };
      case "ended":
        return {
          text: 'Voting Ended',
          icon: null,
          color: 'bg-gray-400',
          disabled: true
        };
      default:
        return {
          text: 'Loading...',
          icon: null,
          color: 'bg-gray-300',
          disabled: true
        };
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading election data...</p>
        </div>
      </div>
    );
  }

  // Show "Election not started yet" message
  if (noElectionData) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Upcoming Election Events</h2>
        
        <div className="flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <FaClock className="text-6xl text-yellow-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Election Not Started Yet</h3>
            <p className="text-gray-600 mb-6">
              No elections have been scheduled at this time. Please check back later for upcoming election events.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show actual error message for connection/server issues
  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const elections = [
    {
      title: "Primary Round Election",
      description: "Cast your vote for your preferred political party in the primary round.",
      electionType: "primary",
      imgSrc: primary,
    },
    {
      title: "General Round Election",
      description: "Cast your vote for your preferred candidate in the general election.",
      electionType: "general",
      imgSrc: general,
    },
  ];

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Upcoming Election Events</h2>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
        {elections.map((election, index) => {
          const electionData = electionsData?.elections?.find(
            (e) => e.election_type === election.electionType
          );

          const status = getElectionStatus(electionData);
          const hasPool = electionData?.pool?.length > 0;
          const buttonConfig = getButtonConfig(election.electionType, status, hasPool);

          return (
            <div
              key={index}
              className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group flex flex-col"
            >
              <div className="relative overflow-hidden flex-shrink-0">
                <img
                  src={election.imgSrc}
                  alt={election.title}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <h3 className="text-white text-xl font-bold">{election.title}</h3>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-3 text-gray-800">{election.title}</h2>
                <p className="text-gray-600 mb-4 flex-grow">{election.description}</p>

                {electionData ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">
                        <strong>Starts:</strong> {formatDate(electionData.start_date)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span className="text-sm text-gray-600">
                        <strong>Ends:</strong> {formatDate(electionData.end_date)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mb-4 text-gray-500 italic">
                    Election not scheduled yet
                  </div>
                )}

                <div className="mt-auto">
                  {buttonConfig.disabled ? (
                    <button
                      className={`w-full px-4 py-2.5 ${buttonConfig.color} text-white rounded-lg font-medium cursor-not-allowed flex items-center justify-center`}
                      disabled
                    >
                      {buttonConfig.icon}
                      {buttonConfig.text}
                    </button>
                  ) : (
                    <Link to={`/${election.electionType === 'primary' ? 'PartySelection' : 'CandidateSelection'}`}>
                      <button
                        className={`w-full px-4 py-2.5 ${buttonConfig.color} text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center`}
                      >
                        {buttonConfig.icon}
                        {buttonConfig.text}
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ElectionEvents;