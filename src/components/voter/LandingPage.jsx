import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../Assets/logo.png'; 
import Hero from './Hero';
import VotingFeatures from './VotingFeatures';
import VotingResults from './VotingResults';
import Footer from './Footer';
import Header from './Header';
import { motion } from "framer-motion";

const LandingPage = () => {
  return (
    <div className="bg-white text-black" style={{fontFamily:"Poppins"}} >
      {/* Header Section */}
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12">Features of the National Digital Voting System</h2>
          <VotingFeatures />
        </div>
      </section>

     {/* About Blockchain Voting */}
<section id="about" className="py-20 bg-gradient-to-b from-gray-50 to-white">
  <div className="container mx-auto px-6">
    <div className="text-center mb-16">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Your vote, your voice — secured on the blockchain
      </motion.h2>
      
      <div className="flex justify-center mb-8">
      </div>
    </div>

    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-white rounded-xl shadow-lg p-8 md:p-10 border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-blue-50 mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Secure & Transparent</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Our Decentralized Voting System revolutionizes elections with blockchain technology, ensuring security, transparency, and tamper-proof voting. Each vote is immutably recorded and publicly verifiable while preserving voter privacy.
            </p>
            
            <div className="flex items-center mb-6">
              <div className="p-3 rounded-lg bg-purple-50 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Fast & Efficient</h3>
            </div>
            <p className="text-gray-600">
              Smart contracts automate vote counting, reducing errors and delivering results faster than traditional systems. Real-time transparency allows instant verification by all stakeholders.
            </p>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4">
                <div className="w-full h-full mx-auto rotate-180 opacity-30 blur-lg filter bg-gradient-to-r from-blue-400 to-purple-600"></div>
              </div>
              <img 
                src="https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1000" 
                alt="Blockchain technology" 
                className="relative rounded-lg shadow-md w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300"
        >
          <div className="text-blue-500 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Fraud Prevention</h3>
          <p className="text-gray-600 text-sm">
            Cryptographic security eliminates risks of manipulation and duplicate voting.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300"
        >
          <div className="text-purple-500 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Full Auditability</h3>
          <p className="text-gray-600 text-sm">
            Every vote is time-stamped and recorded chronologically for complete traceability.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 transition-all duration-300"
        >
          <div className="text-blue-400 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Accessibility</h3>
          <p className="text-gray-600 text-sm">
            Our user-friendly platform enhances participation while maintaining security.
          </p>
        </motion.div>
      </div>
    </div>
  </div>
</section>
      {/* Voting Results */}
      <section id="voting_results" className="py-16 bg-gray-100 text-black">
        <div className="container mx-auto text-center">
      
          <VotingResults />
        </div>
      </section>
      
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default LandingPage;