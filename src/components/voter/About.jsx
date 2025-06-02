import React from "react";
import Header from "./Header";
import primary from "../Assets/primary.jpeg";
import blockchainVoting from "../Assets/blockchainVoting.webp";
import img1 from "../Assets/img1.jpg";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="font-sans bg-gray-50">
      <Header />
      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          Bhutanese Democratic Evolution
        </h2>
        
        <div className="flex flex-col md:flex-row items-center mb-24 gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-xl shadow-2xl h-80">
              <img 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500" 
                src={primary} 
                alt="Traditional Bhutanese voting" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h4 className="text-3xl text-gray-800 font-bold mb-4">Traditional Voting in Bhutan</h4>
            <p className="text-gray-600 text-lg leading-relaxed">
              For centuries, Bhutanese democracy was expressed through traditional methods - village gatherings, 
              consensus-building, and the trusted wisdom of local leaders. The transition to modern electoral 
              processes maintained these values of integrity and community participation.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row-reverse items-center mb-24 gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-xl shadow-2xl h-80">
              <img 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500" 
                src={blockchainVoting}
                alt="Blockchain voting technology" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h4 className="text-3xl text-gray-800 font-bold mb-4">The Blockchain Revolution</h4>
            <p className="text-gray-600 text-lg leading-relaxed">
              Bhutan is now pioneering blockchain-based voting to enhance transparency while preserving our democratic 
              values. Each vote is recorded as an immutable transaction, creating a permanent, verifiable record while 
              maintaining voter anonymity through cryptographic security.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center mb-24 gap-12">
          <div className="w-full md:w-1/2">
            <div className="relative overflow-hidden rounded-xl shadow-2xl h-80">
              <img 
                className="w-full h-full object-cover transform hover:scale-105 transition duration-500" 
                src={img1}
                alt="Bhutan digital identity" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <h4 className="text-3xl text-gray-800 font-bold mb-4">Secure Digital Identity</h4>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our system integrates with Bhutan's national digital ID to ensure one person, one vote. Cryptographic 
              signatures verify voter eligibility without revealing personal details. This maintains the integrity 
              of our elections while making voting accessible to all citizens, even in remote regions.
            </p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            Voices on Bhutan's Voting Evolution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="p-8">
                <div className="text-indigo-500 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg italic mb-6">
                  "In my village, we used to gather under the cypress tree to discuss community matters. 
                  Now with blockchain voting, we maintain that spirit of participation while embracing 
                  technology that ensures every voice is counted accurately."
                </p>
                <p className="text-gray-900 font-medium">Tashi Dorji</p>
                <p className="text-gray-600 text-sm">Farmer from Bumthang</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="p-8">
                <div className="text-indigo-500 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg italic mb-6">
                  "As election officials, blockchain technology has transformed our work. We spend less time 
                  verifying paper ballots and more time engaging with voters. The immutable record gives 
                  everyone confidence in the results."
                </p>
                <p className="text-gray-900 font-medium">Sonam Wangmo</p>
                <p className="text-gray-600 text-sm">Election Commissioner</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2">
              <div className="p-8">
                <div className="text-indigo-500 mb-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <p className="text-gray-700 text-lg italic mb-6">
                  "Our youth are digital natives who expect to interact with government as easily as they 
                  do with social media. Blockchain voting meets them where they are while maintaining 
                  the sacred trust of our democratic process."
                </p>
                <p className="text-gray-900 font-medium">Karma Tenzin</p>
                <p className="text-gray-600 text-sm">University Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="container mx-auto px-6 text-center py-20">
          <h2 className="mb-6 text-4xl font-bold text-center text-white">
            Experience Bhutan's Voting Future
          </h2>
          <h3 className="my-6 text-2xl text-blue-100">
            Register now for the next blockchain-based election
          </h3>
          <Link 
            to="/signup" 
            className="inline-block bg-white text-indigo-600 font-bold rounded-full mt-6 py-4 px-10 shadow-lg uppercase tracking-wider hover:bg-indigo-50 hover:scale-105 transition-all duration-300"
          >
            Register to Vote
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;