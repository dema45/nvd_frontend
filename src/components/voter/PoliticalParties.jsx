// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom"; // Add this import

// const PartyCard = ({ imageUrl, partyName, leaderName, onExplore }) => {
//   return (
//     <article className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
//       <div className="relative w-40 h-40 mb-5 overflow-hidden rounded-full shadow-md border-2 border-white bg-gray-50">
//         <img
//           src={imageUrl}
//           alt={`Logo of ${partyName}`}
//           className="absolute inset-0 w-full h-full object-cover"
//           onError={(e) => {
//             // Fallback in case image fails to load
//             e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA2MEMzNi4xOTI5IDYwIDI1IDQ4LjgwNzEgMjUgMzVDMjUgMjEuMTkyOSAzNi4xOTI5IDEwIDUwIDEwQzYzLjgwNzEgMTAgNzUgMjEuMTkyOSA3NSAzNUM3NSA0OC44MDcxIDYzLjgwNzEgNjAgNTAgNjBaIiBmaWxsPSIjOTM5M0EzIi8+CjxwYXRoIGQ9Ik01MCA2MEw0MCA4MEg2MEw1MCA2MFoiIGZpbGw9IiM5MzkzQTMiLz4KPC9zdmc+';
//           }}
//         />
//       </div>
//       <h2 className="text-lg font-semibold text-gray-800 text-center leading-tight">{partyName}</h2>
//       <p className="mt-2 text-sm text-gray-600 text-center mb-4">Leader: {leaderName}</p>
      
//       <button
//         onClick={() => onExplore(partyName, leaderName)}
//         className="mt-auto px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//       >
//         Explore
//       </button>
//     </article>
//   );
// };

// const PoliticalParties = () => {
//   const [parties, setParties] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate(); // Add this hook

//   const handleExplore = (partyName, leaderName) => {
//     // Navigate to the explore party page with party data
//     navigate('/exploreparty', { 
//       state: { 
//         partyName: partyName,
//         leaderName: leaderName 
//       } 
//     });
//   };

//   useEffect(() => {
//     const fetchParties = async () => {
//       try {
//         const response = await fetch('http://localhost:4005/api/parties');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const data = await response.json();
//         console.log('API Response:', data); // Debug log
        
//         // Handle different response formats - your API returns { data: [...] }
//         let partiesArray;
//         if (Array.isArray(data)) {
//           partiesArray = data;
//         } else if (data.data && Array.isArray(data.data)) {
//           partiesArray = data.data;
//         } else if (data.parties && Array.isArray(data.parties)) {
//           partiesArray = data.parties;
//         } else {
//           throw new Error('Invalid API response format: expected an array of parties');
//         }
        
//         setParties(partiesArray);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error fetching parties:', err);
//         setError(err.message);
//         setLoading(false);
//       }
//     };

//     fetchParties();
//   }, []);

//   if (loading) {
//     return (
//       <section className="px-6 py-12 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] w-full max-w-5xl mx-auto my-10">
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
//           <span className="ml-3 text-gray-600">Loading parties...</span>
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="px-6 py-12 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] w-full max-w-5xl mx-auto my-10">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-800 mb-4">
//             Participating Political Parties
//           </h1>
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <p className="text-red-600">Error loading parties: {error}</p>
//             <button 
//               onClick={() => window.location.reload()} 
//               className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
//             >
//               Retry
//             </button>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="px-6 py-12 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] w-full max-w-5xl mx-auto my-10">
//       <h1 className="text-2xl font-bold text-center text-gray-800 mb-10">
//         Participating Political Parties
//       </h1>

//       {!Array.isArray(parties) || parties.length === 0 ? (
//         <div className="text-center text-gray-600">
//           <p>No political parties found.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
//           {parties.map((party, index) => (
//             <PartyCard
//               key={party.party_id || index}
//               imageUrl={`http://localhost:4005${party.logo_path}`}
//               partyName={party.party_name}
//               leaderName={party.leader_name}
//               onExplore={handleExplore}
//             />
//           ))}
//         </div>
//       )}
//     </section>
//   );
// };

// export default PoliticalParties;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PartyCard = ({ imageUrl, partyName, leaderName, onExplore }) => {
  return (
    <article className="flex flex-col items-center bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="relative w-40 h-40 mb-5 overflow-hidden rounded-full shadow-md border-2 border-white bg-gray-50">
        <img
          src={imageUrl}
          alt={`Logo of ${partyName}`}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik01MCA2MEMzNi4xOTI5IDYwIDI1IDQ4LjgwNzEgMjUgMzVDMjUgMjEuMTkyOSAzNi4xOTI5IDEwIDUwIDEwQzYzLjgwNzEgMTAgNzUgMjEuMTkyOSA3NSAzNUM3NSA0OC44MDcxIDYzLjgwNzEgNjAgNTAgNjBaIiBmaWxsPSIjOTM5M0EzIi8+CjxwYXRoIGQ9Ik01MCA2MEw0MCA4MEg2MEw1MCA2MFoiIGZpbGw9IiM5MzkzQTMiLz4KPC9zdmc+';
          }}
        />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 text-center leading-tight">{partyName}</h2>
      <p className="mt-2 text-sm text-gray-600 text-center mb-4">Leader: {leaderName}</p>
      
      <button
        onClick={onExplore}
        className="mt-auto px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Explore
      </button>
    </article>
  );
};

const PoliticalParties = () => {
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleExplore = (partyId) => {
    navigate(`/exploreparty/${partyId}`);
  };

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await fetch('http://localhost:4005/api/parties');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        let partiesArray;
        if (Array.isArray(data)) {
          partiesArray = data;
        } else if (data.data && Array.isArray(data.data)) {
          partiesArray = data.data;
        } else if (data.parties && Array.isArray(data.parties)) {
          partiesArray = data.parties;
        } else {
          throw new Error('Invalid API response format: expected an array of parties');
        }
        
        setParties(partiesArray);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching parties:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  if (loading) {
    return (
      <section className="px-6 py-12 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] w-full max-w-5xl mx-auto my-10">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading parties...</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 py-12 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] w-full max-w-5xl mx-auto my-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Participating Political Parties
          </h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error loading parties: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-12 bg-white rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] w-full max-w-5xl mx-auto my-10">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-10">
        Participating Political Parties
      </h1>

      {!Array.isArray(parties) || parties.length === 0 ? (
        <div className="text-center text-gray-600">
          <p>No political parties found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10">
          {parties.map((party, index) => (
            <PartyCard
              key={party.party_id || index}
              imageUrl={`http://localhost:4005${party.logo_path}`}
              partyName={party.party_name}
              leaderName={party.leader_name}
              onExplore={() => handleExplore(party.party_id)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default PoliticalParties;