import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  PencilSquareIcon
} from "@heroicons/react/24/outline";

const Navbar = ({ profileImage }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 sm:p-6 bg-gray-50   shadow-sm" style={{fontFamily:"Poppins"}}>
      <div className="w-9 sm:w-0"></div>
      <div className="flex-1 flex justify-center sm:justify-start">
  <h1 className="text-xl sm:text-2xl font-bold text-gray-800 ml-8">Hello <span className="ml-1">👋</span></h1>
</div>
      <div className="flex items-center gap-4 mr-12">
        <div className="hidden sm:block relative w-48 md:w-64 sm:mr-4 md:mr-16">
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 rounded-full bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center space-x-1 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-200">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6522/6522516.png"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
            <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
              <Link
                to="/edit_profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
              <Link
                to="/reset_password"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                Reset Password
              </Link>
              <button
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 border-t border-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;