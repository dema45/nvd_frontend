import React from 'react';
import { Link as ScrollLink } from 'react-scroll'; // Import react-scroll's Link
import { Link } from 'react-router-dom'; // Regular Link for navigation
import Logo from '../Assets/logo.svg'; 
import cb from "../Assets/cb.png";
import VotingResults from './VotingResults';
import Footer from './Footer';
import PoliticalParties from './PoliticalParties';
import ElectionEvents from './ElectionEvents';
import Navbar from './Navbar';

const Homepage = () => {
  return (
    <div className="bg-white text-black" style={{fontFamily:"Poppins"}}>
      {/* Header Section */}
      <Navbar/>

      {/* Hero Section */}
      <div className='text-black py-20 min-h-[80vh] flex items-center'>
        <div className='flex items-center justify-center max-w-screen-xl mx-auto h-full px-6 w-full'>
          {/* Left Side: Text Content */}
          <div className='w-full md:w-1/2 text-center md:text-left'>
            <p className='md:text-2xl text-2xl text-black font-extrabold'>
              Experience the future of Decentralized Voting System
            </p>
            <h1 className='md:text-5xl sm:text-4xl text-3xl font-bold md:py-6'>
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text">
                Transform the Way You Vote
              </span>
            </h1>
            
            <p className='md:text-xl text-lg text-gray-400'>
              Say goodbye to centralized voting and hello to trust and transparent National Digital Voting System using Blockchain Technology
            </p>
  
            {/* Smooth Scroll Button */}
            <ScrollLink
              to="politicalParty" // Matches the section id
              smooth={true}
              duration={800}
              offset={-80} // Adjust this value if you have a fixed header
              className='cursor-pointer'
            >
              <button className='bg-blue-600 w-[200px] rounded-md font-medium my-6 mx-auto md:mx-0 py-3 text-white hover:bg-blue-700 transition-colors mt-16'>
                Explore More
              </button>
            </ScrollLink>
          </div>
  
          {/* Right Side: Image */}
         <div className="w-full md:w-1/2 flex justify-center items-center p-6">
  <div className="relative group">
    <img
      src={cb}
      alt="Blockchain voting illustration"
      className="rounded-full w-[420px] h-[420px] object-cover 
               border-4 border-white 
               shadow-lg shadow-gray-700/50 
               transition-all duration-300 
               group-hover:scale-[1.02] 
               group-hover:shadow-xl group-hover:shadow-blue-400/30"
    />
    <div className="absolute inset-0 rounded-full 
                   bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 
                   opacity-0 group-hover:opacity-100 
                   transition-opacity duration-500" />
  </div>
</div>
        </div>
      </div>
      
      {/* Political Party Section */}
      <section id="politicalParty" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <PoliticalParties />
        </div>
      </section>
      
      {/* Election Event Section */}
      <section id="about" className="py-16 bg-white text-black">
        <div className="container mx-auto px-6 text-center">
          <ElectionEvents/>
        </div>
      </section>

      {/* Voting Results */}
      <section id="voting_results" className="py-16 bg-white text-black">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Real-Time Voting Results</h2>
          <VotingResults />
        </div>
      </section>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Homepage;