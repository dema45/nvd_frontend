// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Dialog } from '@headlessui/react';
// import { FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import Navbar from './Navbar';
// import axios from 'axios';

// const PartySelection = () => {
//   const navigate = useNavigate();
//   const [selectedParty, setSelectedParty] = useState(null);
//   const [parties, setParties] = useState([]);
//   const [isConfirmOpen, setIsConfirmOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [showOtp, setShowOtp] = useState(false);
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [otpError, setOtpError] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [email, setEmail] = useState('');
//   const [userId, setUserId] = useState('');
  
//   // Added for blockchain vote submission
//   const [sessionId, setSessionId] = useState(null);
//   const [electionId, setElectionId] = useState(null);
//   const [electionType, setElectionType] = useState('primary');
//   const [voteSubmitError, setVoteSubmitError] = useState('');

//   // OTP Resend functionality
//   const [resendTimer, setResendTimer] = useState(60);
//   const [canResend, setCanResend] = useState(false);

//   // Timer function to control resend cooldown
//   const startResendTimer = () => {
//     setCanResend(false);
//     setResendTimer(60);

//     const timer = setInterval(() => {
//       setResendTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(timer);
//           setCanResend(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   // OTP reset function (used when resending)
//   const resetOtp = () => {
//     setOtp(['', '', '', '', '', '']);
//     setOtpError('');
//   };

//   // Function to handle OTP resend
//   const handleResendOTP = async () => {
//     if (canResend && email) {
//       try {
//         const response = await axios.post('http://localhost:4005/api/initiate_voteotp/vote-otp', { email });
//         resetOtp();
//         startResendTimer();
//         showAlert('OTP resent successfully!', 'green');
//       } catch (error) {
//         if (error.response?.status === 429) {
//           const waitTime = error.response.data?.remaining_time || 60;
//           setResendTimer(waitTime);
//           startResendTimer();
//           showAlert(`Please wait ${waitTime} seconds before retrying.`, 'red');
//         } else {
//           showAlert('Failed to resend OTP.', 'red');
//         }
//       }
//     }
//   };

//   // Fetch user email from token
//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.error('JWT token not found');
//           showAlert('Authentication required. Please login again.', 'red');
//           navigate('/login');
//           return;
//         }

//         // Parse the token to get cid
//         const parts = token.split('.');
//         if (parts.length !== 3) {
//           throw new Error('Invalid token format');
//         }

//         const payloadBase64 = parts[1];
//         const padded = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
//         const decoded = JSON.parse(atob(padded));
//         const loggedInUserCId = decoded.cid;
        
//         setUserId(loggedInUserCId); // Store user ID

//         // Fetch user data with proper error handling
//         const response = await axios.get(`http://localhost:4005/api/voters/getVoter/${loggedInUserCId}`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
        
//         if (response.data && response.data.email) {
//           setEmail(response.data.email);
//           console.log("User email fetched:", response.data.email);
//         } else {
//           throw new Error('Email not found in user data');
//         }
//       } catch (err) {
//         console.error('Error fetching user data:', err);
//         showAlert('Failed to load user data. Please refresh or login again.', 'red');
//       }
//     };

//     fetchUserData();
//   }, [navigate]);

//   // Fetch parties for the primary election
//   useEffect(() => {
//     const fetchParties = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:4005/api/elections/latest-session/primary');
        
//         // Debug the response structure
//         console.log("API Response:", response.data);
        
//         // Save election session data for vote submission
//         if (response.data && response.data.data) {
//           // Access correct nested properties based on actual API response structure
//           if (response.data.data.election && response.data.data.session) {
//             // Get IDs from the correct locations in the response
//             const sessionId = response.data.data.session.session_id;
//             const electionId = response.data.data.election.election_id;
            
//             // Store session and election IDs as strings
//             setSessionId(String(sessionId));
//             setElectionId(String(electionId));
            
//             console.log("Session ID set to:", String(sessionId));
//             console.log("Election ID set to:", String(electionId));
            
//             const mappedParties = response.data.data.pool.map(party => ({
//               id: String(party.party_id), // Convert party_id to string
//               name: party.party_name,
//               leader: party.leader_name,
//               logo: party.logo_path ? 
//                 `http://localhost:4005${party.logo_path}` : 
//                 '/path/to/default-logo.png'
//             }));
//             setParties(mappedParties);
//           } else {
//             console.error('Missing election or session data in response:', response.data);
//             setError('Missing election data from server');
//           }
//         } else {
//           console.error('Invalid response format:', response.data);
//           setError('Invalid data received from server');
//         }
//       } catch (err) {
//         console.error('Error fetching parties:', err);
//         setError('Failed to fetch parties');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchParties();
//   }, []);

//   const handleVoteClick = () => {
//     if (selectedParty) {
//       // First check if email is available before opening confirm dialog
//       if (!email) {
//         showAlert('Email not available. Please wait while we load your data or login again.', 'red');
//         // Try to fetch email again
//         refreshUserData();
//         return;
//       }
//       setIsConfirmOpen(true);
//     } else {
//       showAlert('Please select a party first!', 'red');
//     }
//   };

//   // Add function to refresh user data if needed
//   const refreshUserData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token || !userId) {
//         showAlert('Session expired. Please login again.', 'red');
//         navigate('/login');
//         return;
//       }

//       const response = await axios.get(`http://localhost:4005/api/voters/getVoter/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.data && response.data.email) {
//         setEmail(response.data.email);
//         console.log("User email refreshed:", response.data.email);
//       } else {
//         throw new Error('Email not found in user data');
//       }
//     } catch (err) {
//       console.error('Error refreshing user data:', err);
//       showAlert('Could not refresh user data. Please login again.', 'red');
//     }
//   };

//   const showAlert = (message, color) => {
//     const alertEl = document.createElement('div');
//     alertEl.className = `fixed top-4 right-4 bg-${color}-100 border border-${color}-400 text-${color}-700 px-4 py-3 rounded shadow-lg z-50`;
//     alertEl.innerHTML = `
//       <strong>${message}</strong>
//       <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
//         <svg class="fill-current h-6 w-6 text-${color}-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
//       </span>
//     `;
//     document.body.appendChild(alertEl);
//     setTimeout(() => {
//       alertEl.remove();
//     }, 3000);
//   };

//   // Updated confirmVote function with better error handling
//   const confirmVote = async () => {
//     if (!email) {
//       showAlert('Email not available. Please wait while we refresh your data.', 'red');
//       await refreshUserData();
      
//       if (!email) {
//         showAlert('Could not retrieve your email. Please reload the page or login again.', 'red');
//         return;
//       }
//     }
    
//     setIsSubmitting(true);
//     try {
//       const response = await axios.post('http://localhost:4005/api/initiate_voteotp/vote-otp', { email });
//       console.log("OTP initiated:", response.data);
//       setShowOtp(true);
//       startResendTimer(); // Start the resend timer when OTP is first sent
//     } catch (err) {
//       console.error('Failed to send OTP:', err);
//       showAlert('Failed to send OTP. Please try again.', 'red');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleOtpChange = (e, index) => {
//     if (isNaN(e.target.value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = e.target.value;
//     setOtp(newOtp);
    
//     // Focus next input field
//     if (e.target.value && index < 5) {
//       const nextInput = e.target.parentNode.childNodes[index + 1];
//       if (nextInput) nextInput.focus();
//     }
//   };

//   // Submit vote to blockchain after OTP verification
//   const submitVoteToBlockchain = async () => {
//     try {
//       // Debug the values we're about to check
//       console.log('Vote submission check - sessionId:', sessionId);
//       console.log('Vote submission check - userId:', userId);
//       console.log('Vote submission check - selectedParty:', selectedParty);
//       console.log('Vote submission check - electionId:', electionId);
      
//       // Validate all required fields are present
//       if (!sessionId) {
//         console.error('Missing sessionId for vote submission');
//         setVoteSubmitError('Session ID is missing. Please refresh the page and try again.');
//         return false;
//       }
      
//       if (!userId) {
//         console.error('Missing userId for vote submission');
//         setVoteSubmitError('User ID is missing. Please log in again and try.');
//         return false;
//       }
      
//       if (!selectedParty || !selectedParty.id) {
//         console.error('Missing selectedParty for vote submission');
//         setVoteSubmitError('No party selected. Please select a party and try again.');
//         return false;
//       }
      
//       if (!electionId) {
//         console.error('Missing electionId for vote submission');
//         setVoteSubmitError('Election ID is missing. Please refresh the page and try again.');
//         return false;
//       }

//       // Ensure all IDs are strings for the request
//       const voteData = {
//         session_id: String(sessionId),
//         voter_id: String(userId),
//         party_id: String(selectedParty.id),
//         election_id: String(electionId),
//         election_type: String(electionType)
//       };

//       console.log('Submitting vote data:', voteData);

//       const token = localStorage.getItem('token');
//       const response = await axios.post(
//         'http://localhost:4005/api/vote', 
//         voteData,
//         { headers: { Authorization: `Bearer ${token}` }}
//       );

//       console.log('Vote submission successful:', response.data);
//       return true;
//     } catch (err) {
//       const errorMessage = err.response?.data?.message || 'Failed to submit vote to blockchain.';
//       console.error('Failed to submit vote to blockchain:', err);
//       setVoteSubmitError(errorMessage);
//       return false;
//     }
//   };

//   // Updated OTP verification with blockchain vote submission
//   const verifyOtp = async () => {
//     const enteredOtp = otp.join('');
//     if (enteredOtp.length !== 6) {
//       setOtpError('Please enter a complete 6-digit OTP');
//       return;
//     }
   
//     setOtpError('');
//     setIsSubmitting(true);
    
//     try {
//       // Debug values before verification
//       console.log("Before verification - sessionId:", sessionId);
//       console.log("Before verification - electionId:", electionId);
//       console.log("Before verification - selectedParty:", selectedParty);
//       console.log("Before verification - userId:", userId);
      
//       // Step 1: Verify OTP
//       const otpResponse = await axios.post('http://localhost:4005/api/initiate_voteotp/verify-otp', { 
//         email, 
//         otp: enteredOtp 
//       });
      
//       console.log("OTP verified:", otpResponse.data);
      
//       // Step 2: Submit vote to blockchain
//       const voteSubmitted = await submitVoteToBlockchain();
      
//       if (voteSubmitted) {
//         setIsSuccess(true);
//         setShowOtp(false);
//         setTimeout(() => {
//           setIsConfirmOpen(false);
//           navigate('/results');
//         }, 2000);
//       } else {
//         // OTP was verified but vote submission failed
//         setOtpError(voteSubmitError || 'Vote submission failed. Please try again.');
//       }
//     } catch (err) {
//       console.error('OTP verification failed:', err);
//       setOtpError('Invalid OTP. Please try again.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
//           <p className="text-gray-600">Loading parties...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-500 text-xl mb-4">{error}</p>
//           <button 
//             onClick={() => window.location.reload()}
//             className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50" style={{ fontFamily: "Poppins" }}>
//       <Navbar />

//       <div className="container mx-auto px-4 py-12">
//         <motion.div 
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
//         >
//           <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Cast Your Vote</h2>
          
//           <div className="space-y-4 mb-8">
//             {parties.map((party, index) => (
//               <motion.div
//                 key={index}
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//               >
//                 <div
//                   onClick={() => setSelectedParty(party)}
//                   className={`flex items-center justify-between border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${
//                     selectedParty?.id === party.id 
//                       ? 'border-indigo-500 bg-indigo-50 shadow-md' 
//                       : 'border-gray-200 hover:border-indigo-300'
//                   }`}
//                 >
//                   <div className="flex items-center gap-4">
//                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
//                       selectedParty?.id === party.id 
//                         ? 'border-indigo-500 bg-indigo-500' 
//                         : 'border-gray-300'
//                     }`}>
//                       {selectedParty?.id === party.id && (
//                         <div className="w-3 h-3 rounded-full bg-white"></div>
//                       )}
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-lg font-medium text-gray-800">{party.name}</span>
//                       <span className="text-sm text-gray-500">Leader: {party.leader}</span>
//                     </div>
//                   </div>
//                   <img 
//                     src={party.logo} 
//                     alt={party.name} 
//                     className="h-12 w-12 object-contain rounded-full"
//                     onError={(e) => {
//                       e.target.onerror = null;
//                       e.target.src = "/path/to/default-logo.png";
//                     }}
//                   />
//                 </div>
//               </motion.div>
//             ))}
//           </div>

//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleVoteClick}
//             className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all shadow-lg ${
//               selectedParty 
//                 ? 'bg-[#7083F5] hover:shadow-indigo-200' 
//                 : 'bg-gray-300 cursor-not-allowed'
//             }`}
//             disabled={!selectedParty}
//           >
//             Submit Vote
//           </motion.button>
//         </motion.div>
//       </div>

//       <AnimatePresence>
//         {isConfirmOpen && (
//           <Dialog 
//             static 
//             as={motion.div}
//             open={isConfirmOpen}
//             onClose={() => !isSubmitting && setIsConfirmOpen(false)}
//             className="relative z-50"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            
//             <div className="fixed inset-0 flex items-center justify-center mb-32 p-4">
//               <Dialog.Panel 
//                 as={motion.div}
//                 initial={{ scale: 0.9, opacity: 0 }}
//                 animate={{ scale: 1, opacity: 1 }}
//                 exit={{ scale: 0.9, opacity: 0 }}
//                 className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg"  
//               >
//                 {!isSuccess ? (
//                   <>
//                     {!showOtp ? (
//                       <>
//                         <div className="flex justify-center mb-3">  
//                           <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">  
//                             <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"> 
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
//                             </svg>
//                           </div>
//                         </div>
                        
//                         <Dialog.Title className="text-xl font-bold text-center text-gray-800 mb-1">  
//                           Confirm Your Vote
//                         </Dialog.Title>
                        
//                         <Dialog.Description className="text-center text-sm text-gray-600 mb-4">  
//                           You are about to vote for <span className="font-bold text-indigo-600">{selectedParty?.name}</span>.
//                           An OTP will be sent to your registered email{email ? ` (${email.substring(0, 3)}...${email.substring(email.lastIndexOf('@')-2)})` : ''}.
//                         </Dialog.Description>

//                         <div className="flex justify-center gap-3 mt-4">
//                           <motion.button
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={() => setIsConfirmOpen(false)}
//                             disabled={isSubmitting}
//                             className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-sm"  
//                           >
//                             Cancel
//                           </motion.button>
                          
//                           <motion.button
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={confirmVote}
//                             disabled={isSubmitting}
//                             className="px-4 py-1.5 bg-[#7083F5] text-white rounded-md font-medium hover:shadow-md transition flex items-center justify-center gap-1.5 text-sm"  
//                           >
//                             {isSubmitting ? (
//                               <>
//                                 <FaSpinner className="animate-spin w-3.5 h-3.5" />
//                                 <span>Sending OTP...</span>
//                               </>
//                             ) : (
//                               'Send OTP'
//                             )}
//                           </motion.button>
//                         </div>
//                       </>
//                     ) : (
//                       <>
//                         <div className="flex justify-between items-center mb-4">
//                           <Dialog.Title className="text-xl font-bold text-gray-800">  
//                             Enter OTP
//                           </Dialog.Title>
//                           <button 
//                             onClick={() => {
//                               resetOtp();
//                               setShowOtp(false);
//                             }}
//                             className="text-gray-500 hover:text-gray-700"
//                           >
//                             <FaTimes />
//                           </button>
//                         </div>
                        
//                         <Dialog.Description className="text-sm text-gray-600 mb-4">  
//                           Please enter the 6-digit OTP sent to your email to verify your vote for <span className="font-bold text-indigo-600">{selectedParty?.name}</span>.
//                         </Dialog.Description>
                        
//                         <div className="flex justify-center space-x-2 mb-4">
//                           {otp.map((data, index) => (
//                             <input
//                               key={index}
//                               type="text"
//                               maxLength="1"
//                               value={data}
//                               onChange={(e) => handleOtpChange(e, index)}
//                               onFocus={(e) => e.target.select()}
//                               className="w-10 h-12 border-2 border-gray-300 rounded-lg text-center text-xl font-bold focus:border-indigo-500 focus:outline-none"
//                               autoFocus={index === 0}
//                             />
//                           ))}
//                         </div>
                        
//                         {otpError && (
//                           <p className="text-red-500 text-sm text-center mb-4">{otpError}</p>
//                         )}

//                         {/* Resend OTP Button */}
//                         <div className="mt-2 text-center">
//                           <p className="text-sm text-gray-600">
//                             Didn't receive code?{' '}
//                             <button
//                               onClick={handleResendOTP}
//                               disabled={!canResend}
//                               className={`font-medium transition duration-200 bg-transparent border-none cursor-pointer focus:outline-none ${
//                                 canResend
//                                   ? "text-indigo-600 hover:text-indigo-500"
//                                   : "text-gray-400 cursor-not-allowed"
//                               }`}
//                             >
//                               {canResend
//                                 ? "Resend"
//                                 : `Resend in ${resendTimer}s`}
//                             </button>
//                           </p>
//                         </div>
                        
//                         <div className="flex justify-center gap-3 mt-4">
//                           <motion.button
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={resetOtp}
//                             className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition text-sm"  
//                           >
//                             Clear
//                           </motion.button>
                          
//                           <motion.button
//                             whileHover={{ scale: 1.03 }}
//                             whileTap={{ scale: 0.97 }}
//                             onClick={verifyOtp}
//                             disabled={isSubmitting}
//                             className="px-4 py-1.5 bg-[#7083F5] text-white rounded-md font-medium hover:shadow-md transition flex items-center justify-center gap-1.5 text-sm"  
//                           >
//                             {isSubmitting ? (
//                               <>
//                                 <FaSpinner className="animate-spin w-3.5 h-3.5" />
//                                 <span>Verifying...</span>
//                               </>
//                             ) : (
//                               'Verify OTP'
//                             )}
//                           </motion.button>
//                         </div>
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   <motion.div
//                     initial={{ scale: 0.9, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     className="text-center py-4"  
//                   >
//                     <div className="flex justify-center mb-2">  
//                       <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ type: 'spring', stiffness: 200 }}
//                         className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"  
//                       >
//                         <FaCheckCircle className="w-10 h-10 text-green-500" /> 
//                       </motion.div>
//                     </div>
                    
//                     <h3 className="text-xl font-bold text-gray-800 mb-1">  
//                       Vote Submitted!
//                     </h3>
//                     <p className="text-sm text-gray-600 mb-4">
//                       Your vote for <span className="font-bold text-indigo-600">{selectedParty?.name}</span> has been successfully recorded on the blockchain.
//                     </p>
                    
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       transition={{ delay: 0.5 }}
//                       className="w-full bg-gray-100 rounded-full h-2" 
//                     >
//                       <motion.div
//                         initial={{ width: 0 }}
//                         animate={{ width: '100%' }}
//                         transition={{ duration: 2 }}
//                         className="bg-green-500 h-2 rounded-full"  
//                       ></motion.div>
//                     </motion.div>
//                   </motion.div>
//                 )}
//               </Dialog.Panel>
//             </div>
//           </Dialog>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default PartySelection;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { FaCheckCircle, FaSpinner, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import axios from 'axios';

const PartySelection = () => {
  const navigate = useNavigate();
  const [selectedParty, setSelectedParty] = useState(null);
  const [parties, setParties] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  
  // Added for blockchain vote submission
  const [sessionId, setSessionId] = useState(null);
  const [electionId, setElectionId] = useState(null);
  const [electionType, setElectionType] = useState('primary');
  const [voteSubmitError, setVoteSubmitError] = useState('');

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

  // Fetch user email from token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('JWT token not found');
          showAlert('Authentication required. Please login again.', 'red');
          navigate('/login');
          return;
        }

        // Parse the token to get cid
        const parts = token.split('.');
        if (parts.length !== 3) {
          throw new Error('Invalid token format');
        }

        const payloadBase64 = parts[1];
        const padded = payloadBase64.padEnd(payloadBase64.length + (4 - payloadBase64.length % 4) % 4, '=');
        const decoded = JSON.parse(atob(padded));
        const loggedInUserCId = decoded.cid;
        
        setUserId(loggedInUserCId); // Store user ID

        // Fetch user data with proper error handling
        const response = await axios.get(`http://localhost:4005/api/voters/getVoter/${loggedInUserCId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && response.data.email) {
          setEmail(response.data.email);
          console.log("User email fetched:", response.data.email);
        } else {
          throw new Error('Email not found in user data');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        showAlert('Failed to load user data. Please refresh or login again.', 'red');
      }
    };

    fetchUserData();
  }, [navigate]);

  // Fetch parties for the primary election
  useEffect(() => {
    const fetchParties = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:4005/api/elections/latest-session/primary');
        
        // Debug the response structure
        console.log("API Response:", response.data);
        
        // Save election session data for vote submission
        if (response.data && response.data.data) {
          // Access correct nested properties based on actual API response structure
          if (response.data.data.election && response.data.data.session) {
            // Get IDs from the correct locations in the response
            const sessionId = response.data.data.session.session_id;
            const electionId = response.data.data.election.election_id;
            
            // Store session and election IDs as strings
            setSessionId(String(sessionId));
            setElectionId(String(electionId));
            
            console.log("Session ID set to:", String(sessionId));
            console.log("Election ID set to:", String(electionId));
            
            const mappedParties = response.data.data.pool.map(party => ({
              id: String(party.party_id), // Convert party_id to string
              name: party.party_name,
              leader: party.leader_name,
              logo: party.logo_path ? 
                `http://localhost:4005${party.logo_path}` : 
                '/path/to/default-logo.png'
            }));
            setParties(mappedParties);
          } else {
            console.error('Missing election or session data in response:', response.data);
            setError('Missing election data from server');
          }
        } else {
          console.error('Invalid response format:', response.data);
          setError('Invalid data received from server');
        }
      } catch (err) {
        console.error('Error fetching parties:', err);
        setError('Failed to fetch parties');
      } finally {
        setLoading(false);
      }
    };

    fetchParties();
  }, []);

  const handleVoteClick = () => {
    if (selectedParty) {
      // First check if email is available before opening confirm dialog
      if (!email) {
        showAlert('Email not available. Please wait while we load your data or login again.', 'red');
        // Try to fetch email again
        refreshUserData();
        return;
      }
      setIsConfirmOpen(true);
    } else {
      showAlert('Please select a party first!', 'red');
    }
  };

  // Add function to refresh user data if needed
  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !userId) {
        showAlert('Session expired. Please login again.', 'red');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:4005/api/voters/getVoter/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.email) {
        setEmail(response.data.email);
        console.log("User email refreshed:", response.data.email);
      } else {
        throw new Error('Email not found in user data');
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      showAlert('Could not refresh user data. Please login again.', 'red');
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

  // Updated confirmVote function with better error handling
  const confirmVote = async () => {
    if (!email) {
      showAlert('Email not available. Please wait while we refresh your data.', 'red');
      await refreshUserData();
      
      if (!email) {
        showAlert('Could not retrieve your email. Please reload the page or login again.', 'red');
        return;
      }
    }
    
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:4005/api/initiate_voteotp/vote-otp', { email });
      console.log("OTP initiated:", response.data);
      setShowOtp(true);
      startResendTimer(); // Start the resend timer when OTP is first sent
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
    
    // Focus next input field
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
        'http://localhost:4005/api/voting-status/primary-vote',
        {
          cid: userId,
          session_id: sessionId
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

  // Submit vote to blockchain after OTP verification
  const submitVoteToBlockchain = async () => {
    try {
      // Debug the values we're about to check
      console.log('Vote submission check - sessionId:', sessionId);
      console.log('Vote submission check - userId:', userId);
      console.log('Vote submission check - selectedParty:', selectedParty);
      console.log('Vote submission check - electionId:', electionId);
      
      // Validate all required fields are present
      if (!sessionId) {
        console.error('Missing sessionId for vote submission');
        setVoteSubmitError('Session ID is missing. Please refresh the page and try again.');
        return false;
      }
      
      if (!userId) {
        console.error('Missing userId for vote submission');
        setVoteSubmitError('User ID is missing. Please log in again and try.');
        return false;
      }
      
      if (!selectedParty || !selectedParty.id) {
        console.error('Missing selectedParty for vote submission');
        setVoteSubmitError('No party selected. Please select a party and try again.');
        return false;
      }
      
      if (!electionId) {
        console.error('Missing electionId for vote submission');
        setVoteSubmitError('Election ID is missing. Please refresh the page and try again.');
        return false;
      }

      // Ensure all IDs are strings for the request
      const voteData = {
        session_id: String(sessionId),
        voter_id: String(userId),
        party_id: String(selectedParty.id),
        election_id: String(electionId),
        election_type: String(electionType)
      };

      console.log('Submitting vote data:', voteData);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4005/api/vote', 
        voteData,
        { headers: { Authorization: `Bearer ${token}` }}
      );

      console.log('Vote submission successful:', response.data);
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit vote to blockchain.';
      console.error('Failed to submit vote to blockchain:', err);
      setVoteSubmitError(errorMessage);
      return false;
    }
  };

  // Updated OTP verification with blockchain vote submission
  const verifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      setOtpError('Please enter a complete 6-digit OTP');
      return;
    }
   
    setOtpError('');
    setIsSubmitting(true);
    
    try {
      // Debug values before verification
      console.log("Before verification - sessionId:", sessionId);
      console.log("Before verification - electionId:", electionId);
      console.log("Before verification - selectedParty:", selectedParty);
      console.log("Before verification - userId:", userId);
      
      // Step 1: Verify OTP
      const otpResponse = await axios.post('http://localhost:4005/api/initiate_voteotp/verify-otp', { 
        email, 
        otp: enteredOtp 
      });
      
      console.log("OTP verified:", otpResponse.data);
      
      // Step 2: Submit vote to blockchain
      const voteSubmitted = await submitVoteToBlockchain();
      
      if (voteSubmitted) {
        // Step 3: Update voting status
        const statusUpdated = await updateVotingStatus();
        
        if (statusUpdated) {
          setIsSuccess(true);
          setShowOtp(false);
          setTimeout(() => {
            setIsConfirmOpen(false);
            navigate('/homepage'); // Redirect to election event page
          }, 2000);
        } else {
          setOtpError('Vote recorded but status update failed. Please contact support.');
        }
      } else {
        // OTP was verified but vote submission failed
        setOtpError(voteSubmitError || 'Vote submission failed. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setOtpError('Invalid OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading parties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
          >
            Retry
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
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Cast Your Vote</h2>
          
          <div className="space-y-4 mb-8">
            {parties.map((party, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  onClick={() => setSelectedParty(party)}
                  className={`flex items-center justify-between border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${
                    selectedParty?.id === party.id 
                      ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedParty?.id === party.id 
                        ? 'border-indigo-500 bg-indigo-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedParty?.id === party.id && (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-gray-800">{party.name}</span>
                      <span className="text-sm text-gray-500">Leader: {party.leader}</span>
                    </div>
                  </div>
                  <img 
                    src={party.logo} 
                    alt={party.name} 
                    className="h-12 w-12 object-contain rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/path/to/default-logo.png";
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
              selectedParty 
                ? 'bg-[#7083F5] hover:shadow-indigo-200' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            disabled={!selectedParty}
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
                          You are about to vote for <span className="font-bold text-indigo-600">{selectedParty?.name}</span>.
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
                          Please enter the 6-digit OTP sent to your email to verify your vote for <span className="font-bold text-indigo-600">{selectedParty?.name}</span>.
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
                      Your vote for <span className="font-bold text-indigo-600">{selectedParty?.name}</span> has been successfully recorded on the blockchain.
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

export default PartySelection;