import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import axios from 'axios';

const CandidateSelection = () => {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [parties, setParties] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voterCid, setVoterCid] = useState('');
  const [email, setEmail] = useState('');
  const [voterInfo, setVoterInfo] = useState({
    dzongkhag_id: '',
    constituency_id: '',
    session_id: '',
    election_id: ''
  });

  // OTP Resend functionality
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Timer function to control resend cooldown
  const startResendTimer = () => {
    setCanResend(false);
    setResendTimer(60);

    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // OTP reset function (used when resending)
  const resetOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setOtpError('');
  };

  // Function to handle OTP resend
  const handleResendOTP = async () => {
    if (canResend && email) {
      try {
        const response = await axios.post('http://localhost:4005/api/initiate_voteotp/vote-otp', { email });
        resetOtp();
        startResendTimer();
        showAlert('OTP resent successfully!', 'green');
      } catch (error) {
        if (error.response?.status === 429) {
          const waitTime = error.response.data?.remaining_time || 60;
          setResendTimer(waitTime);
          startResendTimer();
          showAlert(`Please wait ${waitTime} seconds before retrying.`, 'red');
        } else {
          showAlert('Failed to resend OTP.', 'red');
        }
      }
    }
  };

  // Decode JWT token to extract CID
  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Get voter CID from JWT token and fetch email
  useEffect(() => {
    const getVoterData = async () => {
      let token = null;
      
      // Get token from various sources
      token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('jwt');
      
      if (!token) {
        token = sessionStorage.getItem('token') || sessionStorage.getItem('authToken') || sessionStorage.getItem('jwt');
      }
      
      if (!token && axios.defaults.headers.common['Authorization']) {
        const authHeader = axios.defaults.headers.common['Authorization'];
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }
      
      if (!token) {
        setError('Unable to retrieve voter information. Please login again.');
        setLoading(false);
        return;
      }
      
      // Decode the token to get payload
      const decodedToken = decodeToken(token);
      if (!decodedToken) {
        setError('Invalid token. Please login again.');
        setLoading(false);
        return;
      }
      
      // Extract CID from token payload
      const cid = decodedToken.cid || 
                 decodedToken.citizenId || 
                 decodedToken.citizen_id || 
                 decodedToken.voterCid || 
                 decodedToken.voter_cid ||
                 decodedToken.id ||
                 decodedToken.userId ||
                 decodedToken.user_id ||
                 decodedToken.sub;
      
      if (!cid) {
        setError('Unable to retrieve voter CID from token.');
        setLoading(false);
        return;
      }

      setVoterCid(cid);

      // Fetch user email
      try {
        const response = await axios.get(`http://localhost:4005/api/voters/getVoter/${cid}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.email) {
          setEmail(response.data.email);
        } else {
          throw new Error('Email not found in user data');
        }
      } catch (err) {
        console.error('Error fetching user email:', err);
        setError('Failed to load user data. Please refresh or login again.');
        setLoading(false);
      }
    };

    getVoterData();
  }, []);

  // Fetch parties data
  const fetchParties = async () => {
    try {
      const response = await axios.get('http://localhost:4005/api/parties');
      
      const partiesLookup = {};
      if (response.data.status === 'success' && response.data.data) {
        response.data.data.forEach(party => {
          partiesLookup[party.party_id || party.id] = party.party_name || party.name;
        });
      }
      
      setParties(partiesLookup);
      return partiesLookup;
    } catch (err) {
      console.error('Error fetching parties:', err);
      return {};
    }
  };

  // Fetch candidates based on voter's constituency
  useEffect(() => {
    const fetchCandidates = async () => {
      if (!voterCid) return;

      try {
        setLoading(true);
        
        const [candidatesResponse, partiesLookup] = await Promise.all([
          axios.get(`http://localhost:4005/api/candidates/user/${voterCid}`),
          fetchParties()
        ]);
        
        if (candidatesResponse.data.status === 'success') {
          const mappedCandidates = candidatesResponse.data.data.map(candidate => ({
            id: candidate.candidateid,
            name: candidate.candidate_name,
            image: candidate.candidate_image ? 
              `http://localhost:4005${candidate.candidate_image}` : 
              '/path/to/default-candidate.png',
            party: candidate.party_id,
            partyName: partiesLookup[candidate.party_id] || `Party ${candidate.party_id}`,
            sessionId: candidate.session_id,
            dzongkhagId: candidate.dzongkhag_id,
            constituencyId: candidate.constituency_id,
            electionId: candidate.election_id || '2'
          }));

          setCandidates(mappedCandidates);
          
          if (mappedCandidates.length > 0) {
            setVoterInfo({
              dzongkhag_id: mappedCandidates[0].dzongkhagId,
              constituency_id: mappedCandidates[0].constituencyId,
              session_id: mappedCandidates[0].sessionId,
              election_id: mappedCandidates[0].electionId
            });
          }
        } else {
          setError('Failed to fetch candidates for your constituency');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching candidates:', err);
        
        if (err.response?.status === 404) {
          setError('No candidates found for your constituency');
        } else if (err.response?.status === 400) {
          setError('Invalid voter CID provided');
        } else {
          setError('Failed to fetch candidates. Please try again.');
        }
        setLoading(false);
      }
    };

    fetchCandidates();
  }, [voterCid]);

  const handleVoteClick = () => {
    if (selectedCandidate) {
      if (!email) {
        showAlert('Email not available. Please wait while we load your data or login again.', 'red');
        return;
      }
      setIsConfirmOpen(true);
    } else {
      showAlert('Please select a candidate first!', 'red');
    }
  };

  const showAlert = (message, color) => {
    const alertEl = document.createElement('div');
    alertEl.className = `fixed top-4 right-4 bg-${color}-100 border border-${color}-400 text-${color}-700 px-4 py-3 rounded shadow-lg z-50`;
    alertEl.innerHTML = `
      <strong>${message}</strong>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg class="fill-current h-6 w-6 text-${color}-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </span>
    `;
    document.body.appendChild(alertEl);
    setTimeout(() => {
      alertEl.remove();
    }, 3000);
  };

  const confirmVote = async () => {
    if (!email) {
      showAlert('Email not available. Please wait while we refresh your data.', 'red');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:4005/api/initiate_voteotp/vote-otp', { email });
      console.log("OTP initiated:", response.data);
      setShowOtp(true);
      startResendTimer();
    } catch (err) {
      console.error('Failed to send OTP:', err);
      showAlert('Failed to send OTP. Please try again.', 'red');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (e, index) => {
    if (isNaN(e.target.value)) return;
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);
    
    if (e.target.value && index < 5) {
      const nextInput = e.target.parentNode.childNodes[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  // Function to update voting status
  const updateVotingStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4005/api/voting-status/general-vote',
        {
          cid: voterCid,
          session_id: voterInfo.session_id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log('Voting status updated:', response.data);
      return true;
    } catch (err) {
      console.error('Failed to update voting status:', err);
      return false;
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter a complete 6-digit OTP');
      return;
    }
   
    setOtpError('');
    setIsSubmitting(true);
    
    try {
      // Step 1: Verify OTP
      const otpResponse = await axios.post('http://localhost:4005/api/initiate_voteotp/verify-otp', { 
        email, 
        otp: enteredOtp 
      });
      
      console.log("OTP verified:", otpResponse.data);
      
      // Step 2: Submit vote
      const voteData = {
        session_id: parseInt(voterInfo.session_id) || 1,
        voter_id: voterCid,
        dzongkhag_id: voterInfo.dzongkhag_id,
        constituency_id: voterInfo.constituency_id,
        election_id: voterInfo.election_id || "2",
        election_type: "general",
        candidateid: selectedCandidate.id
      };

      console.log('Submitting vote data:', voteData);
      
      const voteResponse = await axios.post('http://localhost:4005/api/castGeneralVote', voteData, {
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });
      
      console.log('Vote submission response:', voteResponse.data);
      
      if (voteResponse.data.status === 'success' || voteResponse.data.success || voteResponse.status === 200) {
        // Step 3: Update voting status
        const statusUpdated = await updateVotingStatus();
        
        if (statusUpdated) {
          setIsSuccess(true);
          setShowOtp(false);
          
          setTimeout(() => {
            setIsConfirmOpen(false);
            navigate('/homepage');
          }, 2000);
        } else {
          setOtpError('Vote recorded but status update failed. Please contact support.');
        }
      } else {
        throw new Error(voteResponse.data.message || 'Vote submission failed');
      }
    } catch (error) {
      console.error('OTP verification or vote submission failed:', error);
      
      let errorMessage = 'Invalid OTP or vote submission failed. Please try again.';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        if (status === 400) {
          errorMessage = data.message || 'Invalid vote data provided';
        } else if (status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
        } else if (status === 403) {
          errorMessage = data.message || 'You are not authorized to vote or have already voted';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = data.message || `Error ${status}: ${data.error || 'Unknown error'}`;
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setOtpError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading candidates for your constituency...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
            >
              Back to Login
            </button>  
          </div>
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">No Candidates Available</p>
            <p className="text-sm">There are no candidates registered for your constituency yet.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Poppins" }}>
      <Navbar />

      <div className="container mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Cast Your Vote</h2>
          <p className="text-center text-gray-600 mb-8 text-sm">
            Choose your candidate from your constituency
          </p>
          
          <div className="space-y-4 mb-8">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  onClick={() => setSelectedCandidate(candidate)}
                  className={`flex items-center justify-between border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${
                    selectedCandidate?.id === candidate.id 
                      ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedCandidate?.id === candidate.id 
                        ? 'border-indigo-500 bg-indigo-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedCandidate?.id === candidate.id && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-lg font-medium text-gray-800 block">{candidate.name}</span>
                      <span className="text-sm text-gray-500">{candidate.partyName}</span>
                    </div>
                  </div>
                  <img 
                    src={candidate.image} 
                    alt={candidate.name} 
                    className="h-12 w-12 object-cover rounded-full border-2 border-gray-200"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/default-candidate.png";
                    }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVoteClick}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all shadow-lg ${
              selectedCandidate 
                ? 'bg-[#7083F5] hover:shadow-indigo-200' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!selectedCandidate}
          >
            Submit Vote
          </motion.button>
        </motion.div>
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
            
            <div className="fixed inset-0 flex items-center justify-center mb-32 p-4">
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
                          You are about to vote for <span className="font-bold text-indigo-600">{selectedCandidate?.name}</span>.
                          An OTP will be sent to your registered email{email ? ` (${email.substring(0, 3)}...${email.substring(email.lastIndexOf('@')-2)})` : ''}.
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
                            {isSubmitting ? (
                              <>
                                <FaSpinner className="animate-spin w-3.5 h-3.5" />
                                <span>Sending OTP...</span>
                              </>
                            ) : (
                              'Send OTP'
                            )}
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
                          Please enter the 6-digit OTP sent to your email to verify your vote for <span className="font-bold text-indigo-600">{selectedCandidate?.name}</span>.
                        </Dialog.Description>
                        
                        <div className="flex justify-center space-x-2 mb-4">
                          {otp.map((data, index) => (
                            <input
                              key={index}
                              type="text"
                              maxLength="1"
                              value={data}
                              onChange={(e) => handleOtpChange(e, index)}
                              onFocus={(e) => e.target.select()}
                              className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none"
                              autoFocus={index === 0}
                            />
                          ))}
                        </div>
                        
                        {otpError && (
                          <p className="text-red-500 text-sm text-center mb-4">{otpError}</p>
                        )}

                        {/* Resend OTP Button */}
                        <div className="mt-2 text-center">
                          <p className="text-sm text-gray-600">
                            Didn't receive code?{' '}
                            <button
                              onClick={handleResendOTP}
                              disabled={!canResend}
                              className={`font-medium transition duration-200 bg-transparent border-none cursor-pointer focus:outline-none ${
                                canResend
                                  ? "text-indigo-600 hover:text-indigo-500"
                                  : "text-gray-400 cursor-not-allowed"
                              }`}
                            >
                              {canResend
                                ? "Resend"
                                : `Resend in ${resendTimer}s`}
                            </button>
                          </p>
                        </div>
                        
                        <div className="flex justify-center gap-3 mt-4">
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
                      Your vote for <span className="font-bold text-indigo-600">{selectedCandidate?.name}</span> has been successfully recorded.
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
};

export default CandidateSelection;