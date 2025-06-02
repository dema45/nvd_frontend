import React, { useState } from 'react';
import pdp_leader from "../Assets/pdp_leader.jpeg";
import pdp from "../Assets/pdp.png";
import pdpCandidates from '../data/pdpCandidates';

const PDPPoliticalParty = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  // Calculate which candidates to show on current page
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = pdpCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(pdpCandidates.length / candidatesPerPage);

  // Function to change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Leader Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-10 group"
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

        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 font-serif tracking-tight">
            People's Democratic Party
          </h1>
          <div className="inline-block p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full shadow-inner">
            <img 
              src={pdp} 
              alt="Party Logo" 
              className="mx-auto h-36 w-auto transition-all hover:scale-105" 
            />
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-8 mb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-30 -z-0"></div>
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <img 
                src={pdp_leader} 
                alt="Party Leader" 
                className="relative rounded-xl w-52 h-52 object-cover shadow-md border-4 border-white transform group-hover:scale-102 transition duration-300" 
              />
            </div>
            <div className="flex-1">
              <blockquote className="italic text-xl text-gray-700 mb-8 leading-relaxed font-serif">
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

      {/* Candidates Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Party Candidates</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Candidates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {currentCandidates.map((candidate, index) => (
              <div 
                key={index} 
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition duration-300 -z-0"></div>
                <div className="relative z-10">
                  <div className="relative mx-auto w-32 h-32 mb-6 group">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-600 blur-md opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="relative rounded-full w-full h-full object-cover border-4 border-white shadow-md"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">{candidate.name}</h3>
                  <p className="text-gray-600 text-center mb-6">{candidate.constituency}</p>
                  
                  <div className="flex justify-center space-x-5">
                    {candidate.social.facebook !== '#' && (
                      <a 
                        href={candidate.social.facebook} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {candidate.social.twitter !== '#' && (
                      <a 
                        href={candidate.social.twitter} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {candidate.social.linkedin !== '#' && (
                      <a 
                        href={candidate.social.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-200 rounded-l-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 border ${currentPage === i + 1 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-transparent' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-200 rounded-r-lg bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  Next
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PDPPoliticalParty;