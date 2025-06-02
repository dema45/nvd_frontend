import React, { useState } from "react";
import { Link } from "react-router-dom";

import pdp from "../Assets/pdp.png";
import dnt from "../Assets/dnt.png";
import pdpLeader from "../Assets/pdp_leader.jpeg";
import dntLeader from "../Assets/dnt_leader.jpeg";
import btpLogo from "../Assets/btp.jpeg";
import dptLogo from "../Assets/dpt.png";  

const VotingResults = () => {
  const [activeTab, setActiveTab] = useState("primary");

  const totalSeats = 47;

  const primaryResults = [
    { name: "People's Democratic Party", votes: 92400, image: pdp, leader: pdpLeader },
    { name: "Druk Phuensum Tshogpa", votes: 90000, image: dnt, leader: dntLeader },
    { name: "Bhutan Tendrel Party", votes: 80400, image: btpLogo },
    { name: "Druk Nyamrup Tshogpa", votes: 75900, image: dptLogo },
  ];

  const generalQualified = [...primaryResults]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 2)
    .map((party, index) => ({
      ...party,
      seatsWon: index === 0 ? 30 : 17, // Adjust as needed
    }));

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
          {/* All Parties */}
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">All Parties</h2>
              <p className="text-gray-600">Votes from the Primary Round</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {primaryResults.map((party, idx) => (
                <PartyCard
                  key={idx}
                  name={party.name}
                  votes={party.votes}
                  image={party.image}
                />
              ))}
            </div>
          </section>

          {/* Qualified for General Round */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">🎯 Qualified for General Round</h2>
              <p className="text-gray-600">Top two parties with highest votes</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {generalQualified.map((party, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl shadow-lg border"
                >
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      <img
                        src={party.image}
                        alt={party.name}
                        className="w-28 h-28 object-contain"
                      />
                      {party.leader && (
                        <div className="absolute -bottom-3 -right-3 bg-white rounded-full p-1 shadow-md border">
                          <img
                            src={party.leader}
                            alt={`${party.name} Leader`}
                            className="w-16 h-16 object-cover rounded-full border-2 border-white"
                          />
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{party.name}</h3>
                    <p className="text-gray-600 font-medium">
                      {party.votes.toLocaleString()} votes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === "general" && (
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">🏁 General Round</h2>
            <p className="text-gray-600">Final contenders from the Primary Round</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {generalQualified.map((party, idx) => (
              <div
                key={idx}
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
                  <h3 className="text-xl font-bold text-gray-800">{party.name}</h3>
                  <p className="text-gray-600">{party.votes.toLocaleString()} votes</p>
                  <p className="text-purple-600 font-semibold mt-2 text-xl">
                    🪑 {party.seatsWon} / {totalSeats} seats won
                  </p>
                </div>
              </div>
            ))}
          </div>
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