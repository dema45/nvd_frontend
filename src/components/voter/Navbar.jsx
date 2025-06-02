import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import {
  ChevronDownIcon,
  PencilSquareIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage] = useState("https://cdn-icons-png.flaticon.com/512/6522/6522516.png");

  return (
    <header className="bg-white shadow-sm " style={{fontFamily:"Poppins"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/homepage" className="flex items-center space-x-2">
          <div className="hidden md:flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 51 51"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24.9915 0V7.78081L0 21.054V13.2732L24.9915 0Z"
                fill="#8C2C9E"
              />
              <path
                d="M50.4829 13.2732L42.9854 17.3924L24.9915 7.78081V0L50.4829 13.2732Z"
                fill="#9257A1"
              />
              <path
                d="M25.4914 27.004V34.3271L50.4829 21.054V13.2732L25.4914 27.004Z"
                fill="#8C2C9E"
              />
              <path
                d="M25.4914 27.004V34.3271L0 21.054L7.49746 17.072L25.4914 27.004Z"
                fill="#9257A1"
              />
              <path
                d="M24.9915 15V22.7808L0 36.054V28.2732L24.9915 15Z"
                fill="#8C2C9E"
              />
              <path
                d="M50.4829 28.2732L42.9854 32.3924L24.9915 22.7808V15L50.4829 28.2732Z"
                fill="#9257A1"
              />
              <path
                d="M25.4914 42.004V49.3271L50.4829 36.054V28.2732L25.4914 42.004Z"
                fill="#8C2C9E"
              />
              <path
                d="M25.4914 42.004V49.3271L0 36.054L7.49746 32.072L25.4914 42.004Z"
                fill="#9257A1"
              />
            </svg>

            <span
              style={{
                fontSize: "18px",
                color: "#8C2C9E",
                marginLeft: "8px",
                fontWeight: "bold",
              }}
            >
              National Digital Voting
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/homepage" className="text-gray-700 hover:text-purple-600">Features</Link>

          <Link to="/aboutus" className="text-gray-700 hover:text-purple-600">About Us</Link>
          <a href="#voting_results" className="text-gray-700 hover:text-purple-600">Voting Results</a>
          <Link to="/contact" className="text-gray-700 hover:text-purple-600">Contact</Link>
        </nav>
        
        {/* User Icon or Profile */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-1 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200">
              <img
                src={profileImage}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <Link
                to="/userprofile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
             
              <Link to="/"
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;