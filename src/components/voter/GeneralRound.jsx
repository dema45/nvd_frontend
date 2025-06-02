import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Assets/logo.svg';
import candidatesByConstituency from '../data/candidatesByConstituency';
import dzongkhagsWithConstituencies from '../data/dzongkhags';

export default function GeneralRound() {
  const navigate = useNavigate();
  const [selectedDzongkhag, setSelectedDzongkhag] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [pendingVote, setPendingVote] = useState(null);

  const handleDzongkhagChange = (e) => {
    setSelectedDzongkhag(e.target.value);
    setSelectedConstituency('');
  };

  const handleVoteClick = (candidate) => {
    setPendingVote(candidate);
    setIsConfirmOpen(true);
  };

  const confirmVote = () => {
    setShowOtp(true);
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter 6-digit OTP');
      return;
    }
    
    setOtpError('');
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setShowOtp(false);
    
    setTimeout(() => {
      setIsConfirmOpen(false);
      navigate('/homepage');
    }, 2000);
  };

  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
  };

  const currentCandidates =
    selectedDzongkhag && selectedConstituency
      ? candidatesByConstituency[selectedDzongkhag]?.[selectedConstituency] || []
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="w-8 h-8" />
            <span className="text-lg font-semibold text-purple-600">National Digital Voting</span>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/features" className="text-gray-700 hover:text-purple-600">Features</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600">About</Link>
            <Link to="/results" className="text-gray-700 hover:text-purple-600">Results</Link>
          </nav>
          <Link to="/profile" className="flex items-center space-x-2">
            <FaUserCircle className="text-gray-700 w-8 h-8" />
            <span className="text-gray-700 hidden sm:inline">Dorji</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8"
        >
          <h1 className="text-2xl font-bold text-center text-gray-800">General Round Voting</h1>
          <p className="text-center text-gray-600 mt-2">Select your Dzongkhag and Constituency to vote for the National Assembly</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dzongkhag</label>
              <select
                value={selectedDzongkhag}
                onChange={handleDzongkhagChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              >
                <option value="">-- Select Dzongkhag --</option>
                {Object.keys(dzongkhagsWithConstituencies).map((dz) => (
                  <option key={dz} value={dz}>{dz}</option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Constituency</label>
              <select
                value={selectedConstituency}
                onChange={(e) => setSelectedConstituency(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                disabled={!selectedDzongkhag}
              >
                <option value="">-- Select Constituency --</option>
                {dzongkhagsWithConstituencies[selectedDzongkhag]?.map((constituency) => (
                  <option key={constituency} value={constituency}>{constituency}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {selectedConstituency && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Candidates for {selectedConstituency}, {selectedDzongkhag}
            </h2>

            {currentCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentCandidates.map((candidate) => (
                  <motion.div 
                    key={candidate.id} 
                    className="bg-white p-6 rounded-xl shadow-md border"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-center">
                      <img 
                        src={candidate.photo} 
                        alt={candidate.name} 
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-100" 
                      />
                      <h3 className="text-lg font-bold">{candidate.name}</h3>
                      <p className="text-purple-600 font-medium">{candidate.partyName}</p>
                      <p className="text-sm text-gray-500">{candidate.partySymbol}</p>
                      <motion.button
                        onClick={() => handleVoteClick(candidate)}
                        className="mt-4 w-full bg-[#7082f5] hover:bg-[#5a6fe0] text-white py-2 rounded-lg shadow-md"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Vote
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-100 text-yellow-800 border border-yellow-300 rounded-lg">
                No candidates found for this constituency.
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isConfirmOpen && (
          <Dialog 
            static 
            as={motion.div}
            open={isConfirmOpen}
            onClose={() => !isSubmitting && setIsConfirmOpen(false)}
            className="relative z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel 
                as={motion.div}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg"  
              >
                {!isSuccess ? (
                  <>
                    {!showOtp ? (
                      <>
                        <div className="flex justify-center mb-3">  
                          <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">  
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                          </div>
                        </div>
                        
                        <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-1">  
                          Confirm Your Vote
                        </Dialog.Title>
                        
                        <Dialog.Description className="text-center text-sm text-gray-600 mb-4">  
                          You are about to vote for <span className="font-bold text-indigo-600">{pendingVote?.name}</span> from <span className="font-bold text-indigo-600">{pendingVote?.partyName}</span>.
                          This action cannot be undone.
                        </Dialog.Description>

                        <div className="flex justify-center gap-3 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setIsConfirmOpen(false)}
                            disabled={isSubmitting}
                            className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-sm"  
                          >
                            Cancel
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={confirmVote}
                            disabled={isSubmitting}
                            className="px-4 py-1.5 bg-[#7083F5] text-white rounded-md font-medium hover:shadow-md transition flex items-center justify-center gap-1.5 text-sm"  
                          >
                            Confirm Vote
                          </motion.button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <Dialog.Title className="text-xl font-bold text-gray-800">  
                            Enter OTP
                          </Dialog.Title>
                          <button 
                            onClick={() => {
                              resetOtp();
                              setShowOtp(false);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes />
                          </button>
                        </div>
                        
                        <Dialog.Description className="text-sm text-gray-600 mb-4">  
                          Please enter any 6-digit number to confirm your vote for <span className="font-bold text-indigo-600">{pendingVote?.name}</span>.
                        </Dialog.Description>
                        
                        <div className="flex justify-center space-x-3 mb-4">
                          {otp.map((data, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={data}
                              onChange={(e) => handleOtpChange(e.target, index)}
                              onFocus={(e) => e.target.select()}
                              className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none"
                            />
                          ))}
                        </div>
                        
                        {otpError && (
                          <p className="text-red-500 text-sm text-center mb-4">{otpError}</p>
                        )}
                        
                        <div className="flex justify-center gap-3">
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={resetOtp}
                            className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-sm"  
                          >
                            Clear
                          </motion.button>
                          
                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={verifyOtp}
                            disabled={isSubmitting}
                            className="px-4 py-1.5 bg-[#7083F5] text-white rounded-md font-medium hover:shadow-md transition flex items-center justify-center gap-1.5 text-sm"  
                          >
                            {isSubmitting ? (
                              <>
                                <FaSpinner className="animate-spin w-3.5 h-3.5" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              'Verify OTP'
                            )}
                          </motion.button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-4"  
                  >
                    <div className="flex justify-center mb-2">  
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"  
                      >
                        <FaCheckCircle className="w-10 h-10 text-green-500" /> 
                      </motion.div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-1">  
                      Vote Submitted!
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your vote for <span className="font-bold text-indigo-600">{pendingVote?.name}</span> has been successfully recorded.
                    </p>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="w-full bg-gray-100 rounded-full h-2" 
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2 }}
                        className="bg-green-500 h-2 rounded-full"  
                      ></motion.div>
                    </motion.div>
                  </motion.div>
                )}
              </Dialog.Panel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}