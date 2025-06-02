import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import { Link } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const View_party = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const userId = localStorage.getItem("userId");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("Newest");
    const [selectedSession, setSelectedSession] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [partyToDelete, setPartyToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    
    // State for parties and sessions
    const [parties, setParties] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to fetch parties with session names
    const fetchParties = async (sessionId = "") => {
        setIsLoading(true);
        try {
            let url = 'http://localhost:4005/api/parties';
            
            if (sessionId) {
                url = `http://localhost:4005/api/parties/session/${sessionId}`;
            }
            
            const partiesResponse = await axios.get(url);
            console.log('Parties API Response:', partiesResponse);
            
            let partiesData = [];
            if (Array.isArray(partiesResponse.data)) {
                partiesData = partiesResponse.data;
            } else if (partiesResponse.data && Array.isArray(partiesResponse.data.data)) {
                partiesData = partiesResponse.data.data;
            } else if (partiesResponse.data && partiesResponse.data.parties) {
                partiesData = partiesResponse.data.parties;
            }
            
            // Now fetch session names for each party
            const partiesWithSessionNames = await Promise.all(
                partiesData.map(async (party) => {
                    if (party.session_id) {
                        try {
                            const sessionResponse = await axios.get(`http://localhost:4005/api/sessions/${party.session_id}`);
                            return {
                                ...party,
                                session_name: sessionResponse.data.session_name || "Unknown Session"
                            };
                        } catch (error) {
                            console.error(`Error fetching session for party ${party.party_id}:`, error);
                            return {
                                ...party,
                                session_name: "Unknown Session"
                            };
                        }
                    }
                    return party;
                })
            );
            
            console.log('Parties with session names:', partiesWithSessionNames);
            setParties(partiesWithSessionNames);
        } catch (error) {
            console.error('Error fetching parties:', error);
            console.error('Error details:', error.response?.data);
            toast.error('Failed to load parties');
            setParties([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch sessions and initial parties on component mount
    useEffect(() => {
        const fetchSessionsAndParties = async () => {
            setIsLoading(true);
            try {
                // Fetch sessions
                const sessionsResponse = await axios.get('http://localhost:4005/api/sessions');
                console.log('Sessions Response:', sessionsResponse);
                
                const sessionsData = Array.isArray(sessionsResponse.data) 
                    ? sessionsResponse.data 
                    : (sessionsResponse.data.data || []);
                setSessions(sessionsData);

                // Initial fetch of all parties
                await fetchParties();
            } catch (error) {
                console.error('Error fetching data:', error);
                console.error('Error details:', error.response?.data);
                toast.error('Failed to load sessions and parties');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSessionsAndParties();
    }, []);

    // Handle session change
    const handleSessionChange = (e) => {
        const sessionName = e.target.value;
        console.log('Session selected:', sessionName);
        setSelectedSession(sessionName);
        setCurrentPage(1); // Reset to first page when session changes
        
        if (sessionName === "") {
            fetchParties();
            return;
        }
        
        // Find the session ID that corresponds to the selected name
        const selectedSessionObj = sessions.find(session => session.session_name === sessionName);
        console.log('Selected session object:', selectedSessionObj);
        
        if (selectedSessionObj) {
            fetchParties(selectedSessionObj.session_id);
        } else {
            console.warn('Could not find session ID for name:', sessionName);
            fetchParties();
        }
    };

    // Handle party deletion - Open modal
    const handleDeleteClick = (partyId, partyName) => {
        setPartyToDelete({ id: partyId, name: partyName });
        setShowDeleteModal(true);
    };

    // Handle party deletion - Confirm and delete
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`http://localhost:4005/api/parties/${partyToDelete.id}`);
            setParties(parties.filter(party => party.party_id !== partyToDelete.id));
            setShowDeleteModal(false);
            setShowSuccessModal(true);
            
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 2000);
            
            toast.success('Party deleted successfully');
        } catch (error) {
            console.error('Error deleting party:', error);
            toast.error('Failed to delete party');
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter and sort parties
    const getFilteredAndSortedParties = () => {
        return parties
            .filter(party => {
                return party.party_name.toLowerCase().includes(searchTerm.toLowerCase());
            })
            .sort((a, b) => {
                switch(sortBy) {
                    case "Newest":
                        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
                    case "Oldest":
                        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
                    case "Name":
                        return a.party_name.localeCompare(b.party_name);
                    default:
                        return 0;
                }
            });
    };

    // Get current parties for pagination
    const getCurrentParties = () => {
        const filteredParties = getFilteredAndSortedParties();
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return filteredParties.slice(indexOfFirstItem, indexOfLastItem);
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle next page
    const nextPage = () => {
        if (currentPage < Math.ceil(filteredAndSortedParties.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // Handle previous page
    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Compute pagination values
    const filteredAndSortedParties = getFilteredAndSortedParties();
    const currentParties = getCurrentParties();
    const totalPages = Math.ceil(filteredAndSortedParties.length / itemsPerPage);
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredAndSortedParties.length);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50" style={{fontFamily:"Poppins"}}>
            {/* Sidebar */}
            <div
                className={`fixed inset-0 z-20 lg:static lg:inset-auto lg:z-auto transition-transform transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {isSidebarOpen && <Sidebar closeSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userId={userId} />

                <main className="flex-1 overflow-y-auto p-6">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {/* Session Selection */}
                        <div className="w-1/3 mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Session
                            </label>
                            <select
                                value={selectedSession}
                                onChange={handleSessionChange}
                                className="mt-1 p-2 border border-[#8EA5FE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8EA5FE] w-full text-gray-700"
                            >
                                <option value="">All Sessions</option>
                                {sessions.map((session) => (
                                    <option 
                                        key={session.session_id} 
                                        value={session.session_name}
                                    >
                                        {session.session_name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        View All Parties
                                    </h1>
                                </div>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="relative flex-grow max-w-2xl">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search parties..."
                                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center">
                                        <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
                                        <label
                                            htmlFor="sort"
                                            className="text-sm font-medium text-gray-700 mr-2"
                                        >
                                            Sort by:
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="sort"
                                                value={sortBy}
                                                onChange={(e) => setSortBy(e.target.value)}
                                                className="appearance-none bg-white border border-gray-300 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="Newest">Newest First</option>
                                                <option value="Oldest">Oldest First</option>
                                                <option value="Name">Party Name</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 md:mt-0">
                                        <Link
                                            to="/create_party"
                                            className="inline-flex items-center px-8 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-[#7083F5] hover:bg-[#536aed] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                                        >
                                            Create New Party
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                S/N
                                            </th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Party Name
                                            </th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Leader
                                            </th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Session
                                            </th>
                                            <th className="px-4 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
                                                    <div className="flex justify-center items-center">
                                                        <svg className="animate-spin h-5 w-5 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Loading parties...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : currentParties.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 py-4 text-center text-sm text-gray-500">
                                                    No parties found
                                                </td>
                                            </tr>
                                        ) : (
                                            currentParties.map((party, index) => (
                                                <tr
                                                    key={party.party_id || index}
                                                    className="hover:bg-gray-50 transition-colors duration-150"
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                                        {startItem + index}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                                        {party.party_name}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                                        {party.leader_name}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 text-center">
                                                        {party.session_name || "Unknown Session"}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center space-x-3">
                                                            {/* Edit Button */}
                                                            <Link
                                                                to={`/edit_party/${party.party_id}`}
                                                                className="text-indigo-600 hover:text-indigo-900 px-4 py-2 rounded-lg border border-indigo-200 hover:border-indigo-300 bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200 text-sm font-medium"
                                                            >
                                                                Edit
                                                            </Link>

                                                            {/* Delete Button */}
                                                            <button
                                                                onClick={() => handleDeleteClick(party.party_id, party.party_name)}
                                                                className="text-red-600 hover:text-red-900 px-4 py-2 rounded-lg border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination */}
                        {!isLoading && filteredAndSortedParties.length > 0 && (
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
                                <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                                    Showing <span className="font-medium">{startItem}</span> to{" "}
                                    <span className="font-medium">{endItem}</span> of{" "}
                                    <span className="font-medium">{filteredAndSortedParties.length}</span> results
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={prevPage}
                                        disabled={currentPage === 1}
                                        className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                                            currentPage === 1
                                                ? "border-gray-300 text-gray-400 bg-white cursor-not-allowed"
                                                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        Previous
                                    </button>
                                    
                                    {/* Page numbers */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                                                currentPage === number
                                                    ? "border-indigo-500 text-white bg-indigo-600"
                                                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={nextPage}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className={`px-3 py-1 rounded-lg border text-sm font-medium ${
                                            currentPage === totalPages || totalPages === 0
                                                ? "border-gray-300 text-gray-400 bg-white cursor-not-allowed"
                                                : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-center">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg
                                        className="h-6 w-6 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Delete Party
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Are you sure you want to delete the party{" "}
                                        <span className="font-semibold">
                                            "{partyToDelete?.name}"
                                        </span>
                                        ? This action cannot be undone.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-2xl">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? (
                                    <span className="flex items-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Deleting...
                                    </span>
                                ) : (
                                    "Delete"
                                )}
                            </button>
                            <button
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4 pb-24">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
                        <div className="p-6">
                            <div className="flex items-center justify-center">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg
                                        className="h-6 w-6 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="mt-3 text-center sm:mt-5">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Success!
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        The party has been deleted successfully.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:px-6 rounded-b-2xl">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                onClick={() => setShowSuccessModal(false)}
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default View_party;