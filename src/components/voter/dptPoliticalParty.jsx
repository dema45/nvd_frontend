import React, { useState } from 'react';
import dptLeader from "../Assets/pdp_leader.jpeg"; // Make sure this image exists
import dptLogo from "../Assets/dpt.png";

// Mock data for DPT candidates
const dptCandidates = [
  {
    name: "Pema Gyamtsho",
    constituency: "Chhoekhor-Tang",
    image: dptLeader,
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Dorji Choden",
    constituency: "Thimphu",
    image: "https://via.placeholder.com/150", // Replace with actual image
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Kinzang Dorji",
    constituency: "Paro",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Sonam Penjor",
    constituency: "Punakha",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Ugyen Dorji",
    constituency: "Wangdue Phodrang",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Tashi Dema",
    constituency: "Trongsa",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Karma Wangchuk",
    constituency: "Bumthang",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Pema Wangmo",
    constituency: "Mongar",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  },
  {
    name: "Tshering Dorji",
    constituency: "Trashigang",
    image: "https://via.placeholder.com/150",
    social: {
      facebook: "#",
      twitter: "#",
      linkedin: "#"
    }
  }
];

const DPTPoliticalParty = () => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const candidatesPerPage = 6;

  // Calculate pagination
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = dptCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(dptCandidates.length / candidatesPerPage);

  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* Leader Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-blue-600 hover:underline mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Parties
        </button>

        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Druk Phuensum Tshogpa (DPT)</h1>
          <img src={dptLogo} alt="DPT Logo" className="mx-auto h-40 w-auto" />
        </div>

        <div className="bg-white shadow-lg rounded-xl p-8 mb-16 relative">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img src={dptLeader} alt="DPT Leader" className="rounded-lg w-48 h-48 object-cover" />
            <div>
              <p className="italic text-lg text-gray-600 mb-6">
                "Our party stands for sustainable development, cultural preservation, and national sovereignty. 
                We believe in a Bhutan that remains true to its heritage while embracing positive change."
              </p>
              <div className="text-center md:text-left">
                <p className="font-semibold text-gray-900">President</p>
                <p className="text-gray-700">Pema Gyamtsho</p>
                <p className="text-gray-500">Chhoekhor-Tang Constituency</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Candidates Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">DPT Candidates</h2>
          
          {/* Candidates Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCandidates.map((candidate, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                />
                <h3 className="text-xl font-semibold text-center">{candidate.name}</h3>
                <p className="text-gray-600 text-center mb-4">{candidate.constituency}</p>
                
                <div className="flex justify-center space-x-4">
                  {candidate.social.facebook && candidate.social.facebook !== '#' && (
                    <a href={candidate.social.facebook} target="_blank" rel="noopener noreferrer">
                      <img src="/icons/facebook.svg" alt="Facebook" className="h-5 w-5" />
                    </a>
                  )}
                  {candidate.social.twitter && candidate.social.twitter !== '#' && (
                    <a href={candidate.social.twitter} target="_blank" rel="noopener noreferrer">
                      <img src="/icons/twitter.svg" alt="Twitter" className="h-5 w-5" />
                    </a>
                  )}
                  {candidate.social.linkedin && candidate.social.linkedin !== '#' && (
                    <a href={candidate.social.linkedin} target="_blank" rel="noopener noreferrer">
                      <img src="/icons/linkedin.svg" alt="LinkedIn" className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border rounded-l-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={`px-4 py-2 border ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-r-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default DPTPoliticalParty;