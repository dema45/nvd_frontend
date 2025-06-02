import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const VotingResults = () => {
  const [activeTab, setActiveTab] = useState("primary");
  const [declaredResults, setDeclaredResults] = useState([]);
  const [partyLogos, setPartyLogos] = useState({});
  const [generalResults, setGeneralResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generalLoading, setGeneralLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generalError, setGeneralError] = useState(null);
  const [isDeclaring, setIsDeclaring] = useState(false);
  const [message, setMessage] = useState(null);

  const totalSeats = 47;

  const BASE_API = "http://localhost:4005";

  const handleDeclarePrimaryResult = async () => {
    setIsDeclaring(true);
    setMessage(null);

    try {
      const response = await fetch(`${BASE_API}/api/declarePrimaryResult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: 1, election_id: 1, topTwoOnly: false })
      });
      await response.json();
      setMessage("✅ Results declared successfully");
      fetchDeclaredResults();
    } catch (err) {
      setMessage("❌ Failed to declare results");
      console.error(err);
    } finally {
      setIsDeclaring(false);
    }
  };

  const fetchDeclaredResults = async () => {
    try {
      const res = await fetch(`${BASE_API}/api/getDeclaredPrimaryResult`);
      const data = await res.json();
      setDeclaredResults(data);
    } catch (err) {
      setError("Error loading results");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartyLogos = async () => {
    try {
      const res = await fetch(`${BASE_API}/api/parties`);
      const json = await res.json();
      const logos = {};
      json.data.forEach(party => {
        logos[party.party_name] = `${BASE_API}${party.logo_path}`;
      });
      setPartyLogos(logos);
    } catch (err) {
      console.error("Error fetching party logos", err);
    }
  };

  // Function to fetch general round results
  const fetchGeneralResults = async () => {
    setGeneralLoading(true);
    setGeneralError(null);
    
    try {
      // First, get the latest session ID
      const sessionResponse = await fetch(`${BASE_API}/api/elections/latest-session/general`);
      if (!sessionResponse.ok) {
        throw new Error('Failed to fetch session data');
      }
      
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.data.session.session_id;
      
      // Then, get the party performance data using the session ID
      const performanceResponse = await fetch(`${BASE_API}/api/getDeclaredOverallPartyPerformance?session_id=${sessionId}`);
      if (!performanceResponse.ok) {
        throw new Error('Failed to fetch party performance data');
      }
      
      const performanceData = await performanceResponse.json();
      
      // Transform the API data to match our component structure
      const transformedResults = performanceData.map(party => {
        // Parse performance string (e.g., "3/3" means 3 seats won out of 3 contested)
        const [seatsWon, seatsContested] = party.performance.split('/').map(Number);
        
        return {
          id: party.id,
          party_id: party.party_id,
          name: party.party_name,
          seatsWon: seatsWon,
          seatsContested: seatsContested,
          performance: party.performance,
          vote_count: 0 // API doesn't provide vote count for general round
        };
      });
      
      setGeneralResults(transformedResults);
    } catch (err) {
      setGeneralError(err.message);
      console.error('Error fetching general results:', err);
    } finally {
      setGeneralLoading(false);
    }
  };

  useEffect(() => {
    fetchDeclaredResults();
    fetchPartyLogos();
  }, []);

  // Fetch general results when general tab is selected
  useEffect(() => {
    if (activeTab === "general") {
      fetchGeneralResults();
    }
  }, [activeTab]);

  const uniqueResults = Array.from(
    new Map(declaredResults.map((party) => [party.party_name, party])).values()
  );

  const generalQualified = uniqueResults
    .slice()
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          2019 National Voting Results
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Results from the Primary and General Rounds
        </p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setActiveTab("primary")}
          className={`px-6 py-2 text-sm font-semibold rounded-full mr-4 ${
            activeTab === "primary"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          🗳️ Primary Round
        </button>
        <button
          onClick={() => setActiveTab("general")}
          className={`px-6 py-2 text-sm font-semibold rounded-full ${
            activeTab === "general"
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          ⚖️ General Round
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "primary" && (
        <>
          <div className="text-center mb-8">
            {/* <button
              onClick={handleDeclarePrimaryResult}
              disabled={isDeclaring}
              className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {isDeclaring ? "Declaring..." : "📤 Declare Primary Results"}
            </button> */}
            {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
          </div>

          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : uniqueResults.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-600">📭 Result not declared yet</p>
              <button
                onClick={fetchDeclaredResults}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                🔄 Refresh
              </button>
            </div>
          ) : (
            <>
              <section className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">All Parties</h2>
                  <p className="text-gray-600">Votes from the Primary Round</p>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(uniqueResults.length, 4)} gap-6`}>
                  {uniqueResults.map((party, idx) => (
                    <PartyCard
                      key={idx}
                      name={party.party_name}
                      votes={party.vote_count}
                      image={partyLogos[party.party_name]}
                    />
                  ))}
                </div>
              </section>

              <section>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">🎯 Qualified for General Round</h2>
                  <p className="text-gray-600">Top two parties with highest votes</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {generalQualified.map((party, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border">
                      <div className="flex flex-col items-center">
                        <img
                          src={partyLogos[party.party_name]}
                          alt={party.party_name}
                          className="w-24 h-24 object-contain mb-4"
                        />
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{party.party_name}</h3>
                        <p className="text-gray-600">{party.vote_count.toLocaleString()} votes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </>
      )}

      {activeTab === "general" && (
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">🏁 General Round</h2>
            <p className="text-gray-600">Live results from the General Election</p>
          </div>
          
          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-2 text-gray-600">Loading results...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p>Error loading results: {error}</p>
              </div>
              <button
                onClick={fetchGeneralResults}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && generalResults.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {generalResults.map((party) => (
                  <div
                    key={party.id}
                    className="bg-white p-8 rounded-2xl shadow-lg border hover:shadow-xl transition transform hover:-translate-y-1"
                  >
                    <div className="flex flex-col items-center">
                      <img src={party.image} alt={party.name} className="w-24 h-24 object-contain mb-4" />
                      {party.leader && (
                        <img
                          src={party.leader}
                          alt={`${party.name} Leader`}
                          className="w-20 h-20 object-cover rounded-full border-2 border-white shadow-md mb-2"
                        />
                      )}
                      <h3 className="text-xl font-bold text-gray-800 text-center">{party.name}</h3>
                      <p className="text-purple-600 font-semibold mt-2 text-xl">
                        🪑 {party.seatsWon} / {totalSeats} seats won
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Performance: {party.performance} constituencies
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-8">
                <button
                  onClick={fetchGeneralResults}
                  className="bg-green-600 text-white px-4 py-2 rounded mr-4 hover:bg-green-700 transition"
                >
                  🔄 Refresh Results
                </button>
              </div>
            </>
          )}
          
          {!loading && !error && generalResults.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No general election results available yet.</p>
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link
              to="/generaldetailedresult"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-purple-700 transition"
            >
              📊 View Detailed General Round Results
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

const PartyCard = ({ name, votes, image }) => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1">
    <div className="p-6">
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-white rounded-full p-4 shadow-inner border flex items-center justify-center">
          <img src={image} alt={name} className="max-h-20 object-contain" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-center text-gray-800">{name}</h3>
      <p className="text-center text-gray-600 mt-1">{votes.toLocaleString()} votes</p>
    </div>
  </div>
);

export default VotingResults;