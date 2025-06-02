import React, { useState } from 'react';
import pdp_leader from "../Assets/pdp_leader.jpeg";
import pdp from "../Assets/pdp.png";
import { FaFilePdf } from "react-icons/fa";

const ExploreParty1 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const totalPages = Math.ceil(1 / candidatesPerPage); // Update this if you add candidate data

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Leader Section */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <button
          onClick={() => window.history.back()}
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
            People's Democratic Party
          </h1>
          <div className="inline-block p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full shadow-inner">
            <img
              src={pdp}
              alt="Party Logo"
              className="mx-auto h-28 w-auto transition-all hover:scale-105"
            />
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 -z-0"></div>
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <img
                src={pdp_leader}
                alt="Party Leader"
                className="relative rounded-xl w-44 h-44 object-cover shadow-md border-4 border-white transform group-hover:scale-102 transition duration-300"
              />
            </div>
            <div className="flex-1">
              <blockquote className="italic text-lg text-gray-700 mb-6 leading-relaxed font-serif">
                "No nation today can stand alone in achievement. Time is slowly telling us that there can be no
                lasting individual success without success as a community..."
              </blockquote>
              <div className="text-center md:text-left space-y-2">
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Party Leader</p>
                <p className="text-2xl font-bold text-gray-900">Tshering Tobgay</p>
                <p className="text-gray-600">Haa - Sombaykha Constituency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Required Party Documents */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 font-serif">Party Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* Pledge */}
          <a
            href="/files/pdp_pledge.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
          >
            <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
            <div className="text-blue-600 font-bold mb-2">PLEDGE</div>
            <p className="text-sm text-gray-600">Download the party's pledge</p>
          </a>

          {/* Manifesto */}
          <a
            href="/files/pdp_manifesto.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
          >
            <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
            <div className="text-blue-600 font-bold mb-2">MANIFESTO</div>
            <p className="text-sm text-gray-600">Read the latest manifesto</p>
          </a>

          {/* Acceptance Letter */}
          <a
            href="/files/pdp_acceptance_letter.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border border-blue-100 rounded-xl shadow hover:shadow-lg p-4 text-center transition"
          >
            <FaFilePdf className="text-3xl text-red-600 mx-auto mb-2" />
            <div className="text-blue-600 font-bold mb-2">ACCEPTANCE LETTER</div>
            <p className="text-sm text-gray-600">View the letter sent to ECB</p>
          </a>
        </div>
      </section>
    </div>
  );
};

export default ExploreParty1;
