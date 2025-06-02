
// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { FaFilePdf } from "react-icons/fa";

// const ExploreParty1 = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [partyData, setPartyData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { id } = useParams(); // Get party ID from URL params
  
//   const candidatesPerPage = 6;
//   const API_BASE_URL = 'http://localhost:4005';

//   // Fetch party data by ID
//   useEffect(() => {
//     const fetchPartyData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_BASE_URL}/api/parties/${id}`);
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch party data: ${response.status}`);
//         }
        
//         const result = await response.json();
        
//         if (result.status === 'success') {
//           setPartyData(result.data);
//         } else {
//           throw new Error('Failed to load party data');
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error('Error fetching party data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchPartyData();
//     }
//   }, [id]);

//   const indexOfLastCandidate = currentPage * candidatesPerPage;
//   const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
//   const totalPages = Math.ceil(1 / candidatesPerPage);

//   const goToPage = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading party information...</p>
//         </div>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Party</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={() => window.history.back()}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // No data state
//   if (!partyData) {
//     return (
//       <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-gray-600 text-lg">No party data found</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
//       {/* Leader Section */}
//       <section className="py-8 px-4 max-w-6xl mx-auto">
//         <button
//           onClick={() => window.history.back()}
//           className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//           <span className="font-medium">Back to Parties</span>
//         </button>

//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
//             {partyData.party_name}
//           </h1>
//           <div className="inline-block p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full shadow-inner">
//             <img
//               src={`${API_BASE_URL}${partyData.logo_path}`}
//               alt={`${partyData.party_name} Logo`}
//               className="mx-auto h-28 w-auto transition-all hover:scale-105"
//               onError={(e) => {
//                 e.target.src = '/default-party-logo.png'; // Fallback image
//               }}
//             />
//           </div>
//         </div>

//         <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 relative overflow-hidden">
//           <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 -z-0"></div>
//           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
//             <div className="relative group">
//               <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
//               <img
//                 src={`${API_BASE_URL}${partyData.logo_path}`}
//                 alt={`${partyData.leader_name}`}
//                 className="relative rounded-xl w-44 h-44 object-cover shadow-md border-4 border-white transform group-hover:scale-102 transition duration-300"
//                 onError={(e) => {
//                   e.target.src = '/default-leader-photo.png'; // Fallback image
//                 }}
//               />
//             </div>
//             <div className="flex-1">
//               <blockquote className="italic text-lg text-gray-700 mb-6 leading-relaxed font-serif">
//                 "Leading with vision and dedication to serve our nation and its people with unwavering commitment to democracy and progress."
//               </blockquote>
//               <div className="text-center md:text-left space-y-2">
//                 <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Party Leader</p>
//                 <p className="text-2xl font-bold text-gray-900">{partyData.leader_name}</p>
//                 <p className="text-gray-600">{partyData.party_name}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Required Party Documents */}
//       <section className="max-w-6xl mx-auto px-4 pb-10">
//         <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Party Information</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {/* Pledge */}
//           {partyData.Pledge_path && (
//             <a
//               href={`${API_BASE_URL}${partyData.Pledge_path}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
//             >
//               <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
//               <div className="text-blue-600 font-bold mb-2">PLEDGE</div>
//               <p className="text-sm text-gray-600">Download the party's pledge</p>
//             </a>
//           )}

//           {/* Manifesto */}
//           {partyData.manifesto_path && (
//             <a
//               href={`${API_BASE_URL}${partyData.manifesto_path}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
//             >
//               <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
//               <div className="text-blue-600 font-bold mb-2">MANIFESTO</div>
//               <p className="text-sm text-gray-600">Read the latest manifesto</p>
//             </a>
//           )}

//           {/* Acceptance Letter */}
//           {partyData.acceptance_letter_path && (
//             <a
//               href={`${API_BASE_URL}${partyData.acceptance_letter_path}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
//             >
//               <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
//               <div className="text-blue-600 font-bold mb-2">ACCEPTANCE LETTER</div>
//               <p className="text-sm text-gray-600">View the letter sent to ECB</p>
//             </a>
//           )}
//         </div>
//       </section>
//     </div>
//   );
// };

// export default ExploreParty1;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";

const ExploreParty1 = () => {
  const { id } = useParams();
  const [partyData, setPartyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:4005';

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/parties/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch party data: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.status === 'success') {
          setPartyData(result.data);
        } else {
          throw new Error(result.message || 'Failed to load party data');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching party data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPartyData();
    } else {
      navigate('/politicalParty');
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading party information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Party</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/politicalParty')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Parties List
          </button>
        </div>
      </div>
    );
  }

  if (!partyData) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">No party data found</p>
          <button
            onClick={() => navigate('/political-parties')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Parties List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/homepage')}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-6 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-2 group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Parties</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
            {partyData.party_name}
          </h1>
          <div className="inline-block p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full shadow-inner">
            {/* <img
              src={`${API_BASE_URL}${partyData.logo_path}`}
              alt={`${partyData.party_name} Logo`}
              className="mx-auto h-28 w-auto transition-all hover:scale-105"
              onError={(e) => {
                e.target.src = '/default-party-logo.png';
              }}
            /> */}
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 -z-0"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={`${API_BASE_URL}${partyData.leader_photo_path || partyData.logo_path}`}
                alt={`${partyData.leader_name}`}
                className="relative rounded-xl w-44 h-44 object-cover shadow-md border-4 border-white transform group-hover:scale-102 transition duration-300"
                onError={(e) => {
                  e.target.src = '/default-leader-photo.png';
                }}
              />
            </div>
            <div className="flex-1">
              <blockquote className="italic text-lg text-gray-700 mb-6 leading-relaxed font-serif">
                {partyData.motto || "Leading with vision and dedication to serve our nation and its people."}
              </blockquote>
              <div className="text-center md:text-left space-y-2">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Party Leader</p>
                <p className="text-2xl font-bold text-gray-900">{partyData.leader_name}</p>
                <p className="text-gray-600">{partyData.party_name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Party Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {partyData.Pledge_path && (
            <a
              href={`${API_BASE_URL}${partyData.Pledge_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
            >
              <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
              <div className="text-blue-600 font-bold mb-2">PLEDGE</div>
              <p className="text-sm text-gray-600">Download the party's pledge</p>
            </a>
          )}

          {partyData.manifesto_path && (
            <a
              href={`${API_BASE_URL}${partyData.manifesto_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
            >
              <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
              <div className="text-blue-600 font-bold mb-2">MANIFESTO</div>
              <p className="text-sm text-gray-600">Read the latest manifesto</p>
            </a>
          )}

          {partyData.acceptance_letter_path && (
            <a
              href={`${API_BASE_URL}${partyData.acceptance_letter_path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
            >
              <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
              <div className="text-blue-600 font-bold mb-2">ACCEPTANCE LETTER</div>
              <p className="text-sm text-gray-600">View the letter sent to ECB</p>
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

export default ExploreParty1;