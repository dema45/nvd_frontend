import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const [menu1Open, setMenu1Open] = useState(false);
  const [menu2Open, setMenu2Open] = useState(false);
  const [menu3Open, setMenu3Open] = useState(false);
  const [menu4Open, setMenu4Open] = useState(false);
  const [menu5Open, setMenu5Open] = useState(false);
  const [menu6Open, setMenu6Open] = useState(false);
  const [menu7Open, setMenu7Open] = useState(false);
  const [menu8Open, setMenu8Open] = useState(false);
  const [menu9Open, setMenu9Open] = useState(false);

  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Keep menus open based on current route
  useEffect(() => {
    if (location.pathname.includes("constituency")) {
      setMenu3Open(true);
      setActiveMenu("manageConstituency");
    }
    if (location.pathname.includes("dzongkhag")) {
      setMenu2Open(true);
      setActiveMenu("manageDzongkhag");
    }

    if (
      location.pathname.includes("session") ||
      location.pathname.includes("party") ||
      location.pathname.includes("candidate") ||
      location.pathname.includes("election")
    ) {
      setMenu1Open(true);
      setActiveMenu("manageElection");
    }
    if (location.pathname.includes("session")) {
      setMenu4Open(true);
    }
    if (location.pathname.includes("party")) {
      setMenu5Open(true);
    }
    if (location.pathname.includes("candidate")) {
      setMenu6Open(true);
    }
    if (location.pathname.includes("election")) {
      setMenu7Open(true);
    }
    if (location.pathname.includes("voter_verification")) {
      setMenu8Open(true);
      setActiveMenu("voterVerification");
    }
    if (location.pathname.includes("result")) {
      setMenu9Open(true);
      setActiveMenu("declareResult");
    }
    if (location.pathname === "/dashboard") {
      setActiveMenu("dashboard");
    }
  }, [location.pathname]);

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleManagePartyClick = () => {
    setMenu5Open(!menu5Open);
    setMenu4Open(false);
    setMenu6Open(false);
    setMenu7Open(false);
  };

  const handleManageSessionClick = () => {
    setMenu4Open(!menu4Open);
    setMenu5Open(false);
    setMenu6Open(false);
    setMenu7Open(false);
  };

  const handleManageCandidateClick = () => {
    setMenu6Open(!menu6Open);
    setMenu4Open(false);
    setMenu5Open(false);
    setMenu7Open(false);
  };

  const handleManageElectionClick = () => {
    setMenu7Open(!menu7Open);
    setMenu4Open(false);
    setMenu5Open(false);
    setMenu6Open(false);
  };

  const handleVoterVerificationClick = () => {
    setMenu8Open(!menu8Open);
    setMenu4Open(false);
    setMenu5Open(false);
    setMenu6Open(false);
    setMenu7Open(false);
  };

  const handleDeclareResultClick = () => {
    setMenu9Open(!menu9Open);
    setMenu4Open(false);
    setMenu5Open(false);
    setMenu6Open(false);
    setMenu7Open(false);
    setMenu8Open(false);
  };

  return (
    <div className="h-full flex" style={{ fontFamily: "Poppins" }}>
      {/* Hamburger Menu for Small Screens */}
      <button
        className="md:hidden fixed top-4 left-4 p-2 bg-[#7083F5] text-white rounded-lg z-50"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative h-full w-72 md:w-72 lg:w-72 xl:w-96 flex flex-col rounded-tr-2xl bg-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40`}
      >
        {/* Logo and Text - Hidden on small screens */}
        <div className="hidden md:flex items-center justify-center -mb-3 mt-3 p-4">
          <svg
            width="50"
            height="50"
            viewBox="0 0 51 50"
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
              fontSize: "21px",
              color: "#8C2C9E",
              marginLeft: "10px",
              fontWeight: "bold",
            }}
          >
            National Digital Voting
          </span>
        </div>

        {/* Menu Items */}
        <ul className="mt-6 flex flex-col">
          {/* Dashboard */}
          <Link to="/dashboard" className="relative transition">
            <div
              className={`relative mx-auto m-2 flex items-center rounded-xl border-b-4 border-gray-300 py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 
                ${
                  activeMenu === "dashboard"
                    ? "bg-[#7083F5] text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-[#7083F5] hover:text-white"
                }
                cursor-pointer`}
              onClick={() => handleMenuClick("dashboard")}
            >
              <span className="mr-5 flex w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                >
                  <path
                    fill="currentColor"
                    d="M13 19h6V9.978l-7-5.444-7 5.444V19h6v-6h2v6zm8 1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.49a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79V20z"
                  />
                </svg>
              </span>
              Dashboard
            </div>
          </Link>

          {/* Manage Election */}
          <li className="relative transition">
            <input
              className="peer hidden"
              type="checkbox"
              id="menu-1"
              checked={menu1Open}
              onChange={() => setMenu1Open(!menu1Open)}
            />
            <div
              className={`relative mx-auto m-2 flex items-center rounded-xl border-b-4 border-gray-300 py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 
                ${
                  activeMenu === "manageElection"
                    ? "bg-[#7083F5] text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-[#7083F5] hover:text-white"
                }`}
              onClick={() => handleMenuClick("manageElection")}
            >
              <span className="mr-5 flex w-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`group-hover:stroke-white ${
                    activeMenu === "manageElection"
                      ? "stroke-white"
                      : "stroke-[#979797]"
                  }`}
                >
                  <path
                    d="M10.7516 16.8594V18.8894C10.7516 20.6094 9.15158 21.9994 7.18158 21.9994C5.21158 21.9994 3.60156 20.6094 3.60156 18.8894V16.8594C3.60156 18.5794 5.20158 19.7994 7.18158 19.7994C9.15158 19.7994 10.7516 18.5694 10.7516 16.8594Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.7538 14.1117C10.7538 14.6117 10.6138 15.0717 10.3738 15.4717C9.78372 16.4417 8.5737 17.0517 7.1737 17.0517C5.7737 17.0517 4.56369 16.4317 3.97369 15.4717C3.73369 15.0717 3.59375 14.6117 3.59375 14.1117C3.59375 13.2517 3.99373 12.4817 4.63373 11.9217C5.28373 11.3517 6.17369 11.0117 7.16369 11.0117C8.15369 11.0117 9.04372 11.3617 9.69372 11.9217C10.3538 12.4717 10.7538 13.2517 10.7538 14.1117Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.7516 14.11V16.86C10.7516 18.58 9.15158 19.8 7.18158 19.8C5.21158 19.8 3.60156 18.57 3.60156 16.86V14.11C3.60156 12.39 5.20158 11 7.18158 11C8.17158 11 9.06161 11.35 9.71161 11.91C10.3516 12.47 10.7516 13.25 10.7516 14.11Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21.9963 10.9692V13.0293C21.9963 13.5793 21.5563 14.0292 20.9963 14.0492H19.0362C17.9562 14.0492 16.9663 13.2592 16.8763 12.1792C16.8163 11.5492 17.0562 10.9592 17.4762 10.5492C17.8462 10.1692 18.3563 9.94922 18.9163 9.94922H20.9963C21.5563 9.96922 21.9963 10.4192 21.9963 10.9692Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 10.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H13.5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Manage Election
              <label
                htmlFor="menu-1"
                className="absolute inset-0 h-full w-full cursor-pointer"
              ></label>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`peer-checked:rotate-180 absolute right-3 top-8 transform -translate-y-1/2 md:top-6 md:translate-y-0 mr-12 md:mr-12 ml-auto h-4 transition ${
                activeMenu === "manageElection" ? "text-white" : "text-gray-500"
              } group-hover:text-white`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <ul
              className={`duration-400 peer-checked:max-h-96 m-2 flex ${
                menu1Open ? "max-h-96" : "max-h-0"
              } flex-col overflow-hidden rounded-2xl bg-white-100 transition-all duration-300`}
            >
              {/* Manage Session */}
              <Link to="/view_session" className="relative transition">
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="menu-4"
                  checked={menu4Open}
                  onChange={() => handleManageSessionClick()}
                />
                <div
                  className={`group relative mx-auto m-2 flex items-center rounded-xl py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 ${
                    location.pathname.includes("session")
                      ? "text-[#7083F5] bg-[#7083F5]/10"
                      : "text-gray-500 hover:text-[#7083F5] hover:bg-[#7083F5]/10"
                  } transition-colors duration-300`}
                >
                  <span className="mr-5"></span>
                  Manage Session
                  <label
                    htmlFor="menu-4"
                    className="absolute inset-0 h-full w-full cursor-pointer"
                  ></label>
                </div>
              </Link>

              {/* Manage Party */}
              <Link to="/view_party" className="relative transition">
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="menu-5"
                  checked={menu5Open}
                  onChange={() => handleManagePartyClick()}
                />
                <div
                  className={`group relative mx-auto m-2 flex items-center rounded-xl py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 ${
                    location.pathname.includes("party")
                      ? "text-[#7083F5] bg-[#7083F5]/10"
                      : "text-gray-500 hover:text-[#7083F5] hover:bg-[#7083F5]/10"
                  } transition-colors duration-300`}
                >
                  <span className="mr-5"></span>
                  Manage Party
                  <label
                    htmlFor="menu-5"
                    className="absolute inset-0 h-full w-full cursor-pointer"
                  ></label>
                </div>
              </Link>

              {/* Manage Candidate */}
              <Link to="/view_candidate" className="relative transition">
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="menu-6"
                  checked={menu6Open}
                  onChange={() => handleManageCandidateClick()}
                />
                <div
                  className={`group relative mx-auto m-2 flex items-center rounded-xl py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 ${
                    location.pathname.includes("candidate")
                      ? "text-[#7083F5] bg-[#7083F5]/10"
                      : "text-gray-500 hover:text-[#7083F5] hover:bg-[#7083F5]/10"
                  } transition-colors duration-300`}
                >
                  <span className="mr-5"></span>
                  Manage Candidate
                  <label
                    htmlFor="menu-6"
                    className="absolute inset-0 h-full w-full cursor-pointer"
                  ></label>
                </div>
              </Link>

              {/* Manage Election Round */}
              <Link to="/view_election" className="relative transition">
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="menu-7"
                  checked={menu7Open}
                  onChange={() => handleManageElectionClick()}
                />
                <div
                  className={`group relative mx-auto m-2 flex items-center rounded-xl py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 ${
                    location.pathname.includes("election")
                      ? "text-[#7083F5] bg-[#7083F5]/10"
                      : "text-gray-500 hover:text-[#7083F5] hover:bg-[#7083F5]/10"
                  } transition-colors duration-300`}
                >
                  <span className="mr-5"></span>
                  Manage Election Round
                  <label
                    htmlFor="menu-7"
                    className="absolute inset-0 h-full w-full cursor-pointer"
                  ></label>
                </div>
              </Link>
            </ul>
          </li>
          {/* Manage Dzongkhag */}
          <Link to="/view_dzongkhag" className="relative transition">
            <input
              className="peer hidden"
              type="checkbox"
              id="menu-2"
              checked={menu2Open}
              onChange={() => setMenu2Open(!menu2Open)}
            />
            <div
              className={`group relative mx-auto m-2 flex items-center rounded-xl border-b-4 border-gray-300 py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 
                ${
                  activeMenu === "manageDzongkhag"
                    ? "bg-[#7083F5] text-white"
                    : "bg-gray-50 text-gray-500 hover:bg-[#7083F5] hover:text-white"
                }
                cursor-pointer`}
              onClick={() => handleMenuClick("manageDzongkhag")}
            >
              <span className="mr-5 flex w-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22.7513C11.37 22.7513 10.78 22.5114 10.34 22.0614L8.82001 20.5414C8.70001 20.4214 8.38 20.2914 8.22 20.2914H6.06C4.76 20.2914 3.70999 19.2413 3.70999 17.9413V15.7814C3.70999 15.6214 3.57999 15.3014 3.45999 15.1814L1.94 13.6614C1.5 13.2214 1.25 12.6313 1.25 12.0013C1.25 11.3713 1.49 10.7813 1.94 10.3413L3.45999 8.82126C3.57999 8.70126 3.70999 8.38128 3.70999 8.22128V6.06137C3.70999 4.76137 4.76 3.71127 6.06 3.71127H8.22C8.38 3.71127 8.70001 3.58127 8.82001 3.46127L10.34 1.94125C11.22 1.06125 12.78 1.06125 13.66 1.94125L15.18 3.46127C15.3 3.58127 15.62 3.71127 15.78 3.71127H17.94C19.24 3.71127 20.29 4.76137 20.29 6.06137V8.22128C20.29 8.38128 20.42 8.70126 20.54 8.82126L22.06 10.3413C22.5 10.7813 22.75 11.3713 22.75 12.0013C22.75 12.6313 22.51 13.2214 22.06 13.6614L20.54 15.1814C20.42 15.3014 20.29 15.6214 20.29 15.7814V17.9413C20.29 19.2413 19.24 20.2914 17.94 20.2914H15.78C15.62 20.2914 15.3 20.4214 15.18 20.5414L13.66 22.0614C13.22 22.5114 12.63 22.7513 12 22.7513ZM4.51999 14.1213C4.91999 14.5213 5.20999 15.2214 5.20999 15.7814V17.9413C5.20999 18.4113 5.59 18.7914 6.06 18.7914H8.22C8.78 18.7914 9.48001 19.0813 9.88 19.4813L11.4 21.0013C11.72 21.3213 12.28 21.3213 12.6 21.0013L14.12 19.4813C14.52 19.0813 15.22 18.7914 15.78 18.7914H17.94C18.41 18.7914 18.79 18.4113 18.79 17.9413V15.7814C18.79 15.2214 19.08 14.5213 19.48 14.1213L21 12.6013C21.16 12.4413 21.25 12.2313 21.25 12.0013C21.25 11.7713 21.16 11.5614 21 11.4014L19.48 9.88132C19.08 9.48132 18.79 8.78128 18.79 8.22128V6.06137C18.79 5.59137 18.41 5.21127 17.94 5.21127H15.78C15.22 5.21127 14.52 4.92133 14.12 4.52133L12.6 3.00131C12.28 2.68131 11.72 2.68131 11.4 3.00131L9.88 4.52133C9.48001 4.92133 8.78 5.21127 8.22 5.21127H6.06C5.59 5.21127 5.20999 5.59137 5.20999 6.06137V8.22128C5.20999 8.78128 4.91999 9.48132 4.51999 9.88132L3 11.4014C2.84 11.5614 2.75 11.7713 2.75 12.0013C2.75 12.2313 2.84 12.4413 3 12.6013L4.51999 14.1213Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.0022 16C14.4422 16 13.9922 15.55 13.9922 15C13.9922 14.45 14.4422 14 14.9922 14C15.5422 14 15.9922 14.45 15.9922 15C15.9922 15.55 15.5522 16 15.0022 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.01001 10C8.45001 10 8 9.55 8 9C8 8.45 8.45 8 9 8C9.55 8 10 8.45 10 9C10 9.55 9.56001 10 9.01001 10Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.9975 15.7476C8.8075 15.7476 8.6175 15.6776 8.4675 15.5276C8.1775 15.2376 8.1775 14.7575 8.4675 14.4675L14.4675 8.4675C14.7575 8.1775 15.2376 8.1775 15.5276 8.4675C15.8176 8.7575 15.8176 9.23756 15.5276 9.52756L9.5275 15.5276C9.3775 15.6776 9.1875 15.7476 8.9975 15.7476Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Manage Dzongkhag
              <label
                htmlFor="menu-2"
                className="absolute inset-0 h-full w-full cursor-pointer"
              ></label>
            </div>
          </Link>
          {/* Manage Constituency */}
          <Link to="/view_constituency" className="relative transition">
            <input
              className="peer hidden"
              type="checkbox"
              id="menu-3"
              checked={menu3Open}
              onChange={() => setMenu3Open(!menu3Open)}
            />
            <div
              className={`group relative mx-auto m-2 flex items-center rounded-xl border-b-4 border-gray-300 py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 
      ${
        activeMenu === "manageConstituency"
          ? "bg-[#7083F5] text-white"
          : "bg-gray-50 text-gray-500"
      }
      hover:bg-[#7083F5] hover:text-white cursor-pointer`} // Added hover styles and cursor
              onClick={() => handleMenuClick("manageConstituency")}
            >
              <span className="mr-5 flex w-5">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 22.7513C11.37 22.7513 10.78 22.5114 10.34 22.0614L8.82001 20.5414C8.70001 20.4214 8.38 20.2914 8.22 20.2914H6.06C4.76 20.2914 3.70999 19.2413 3.70999 17.9413V15.7814C3.70999 15.6214 3.57999 15.3014 3.45999 15.1814L1.94 13.6614C1.5 13.2214 1.25 12.6313 1.25 12.0013C1.25 11.3713 1.49 10.7813 1.94 10.3413L3.45999 8.82126C3.57999 8.70126 3.70999 8.38128 3.70999 8.22128V6.06137C3.70999 4.76137 4.76 3.71127 6.06 3.71127H8.22C8.38 3.71127 8.70001 3.58127 8.82001 3.46127L10.34 1.94125C11.22 1.06125 12.78 1.06125 13.66 1.94125L15.18 3.46127C15.3 3.58127 15.62 3.71127 15.78 3.71127H17.94C19.24 3.71127 20.29 4.76137 20.29 6.06137V8.22128C20.29 8.38128 20.42 8.70126 20.54 8.82126L22.06 10.3413C22.5 10.7813 22.75 11.3713 22.75 12.0013C22.75 12.6313 22.51 13.2214 22.06 13.6614L20.54 15.1814C20.42 15.3014 20.29 15.6214 20.29 15.7814V17.9413C20.29 19.2413 19.24 20.2914 17.94 20.2914H15.78C15.62 20.2914 15.3 20.4214 15.18 20.5414L13.66 22.0614C13.22 22.5114 12.63 22.7513 12 22.7513ZM4.51999 14.1213C4.91999 14.5213 5.20999 15.2214 5.20999 15.7814V17.9413C5.20999 18.4113 5.59 18.7914 6.06 18.7914H8.22C8.78 18.7914 9.48001 19.0813 9.88 19.4813L11.4 21.0013C11.72 21.3213 12.28 21.3213 12.6 21.0013L14.12 19.4813C14.52 19.0813 15.22 18.7914 15.78 18.7914H17.94C18.41 18.7914 18.79 18.4113 18.79 17.9413V15.7814C18.79 15.2214 19.08 14.5213 19.48 14.1213L21 12.6013C21.16 12.4413 21.25 12.2313 21.25 12.0013C21.25 11.7713 21.16 11.5614 21 11.4014L19.48 9.88132C19.08 9.48132 18.79 8.78128 18.79 8.22128V6.06137C18.79 5.59137 18.41 5.21127 17.94 5.21127H15.78C15.22 5.21127 14.52 4.92133 14.12 4.52133L12.6 3.00131C12.28 2.68131 11.72 2.68131 11.4 3.00131L9.88 4.52133C9.48001 4.92133 8.78 5.21127 8.22 5.21127H6.06C5.59 5.21127 5.20999 5.59137 5.20999 6.06137V8.22128C5.20999 8.78128 4.91999 9.48132 4.51999 9.88132L3 11.4014C2.84 11.5614 2.75 11.7713 2.75 12.0013C2.75 12.2313 2.84 12.4413 3 12.6013L4.51999 14.1213Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.0022 16C14.4422 16 13.9922 15.55 13.9922 15C13.9922 14.45 14.4422 14 14.9922 14C15.5422 14 15.9922 14.45 15.9922 15C15.9922 15.55 15.5522 16 15.0022 16Z"
                    fill="currentColor"
                  />
                  <path
                    d="M9.01001 10C8.45001 10 8 9.55 8 9C8 8.45 8.45 8 9 8C9.55 8 10 8.45 10 9C10 9.55 9.56001 10 9.01001 10Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.9975 15.7476C8.8075 15.7476 8.6175 15.6776 8.4675 15.5276C8.1775 15.2376 8.1775 14.7575 8.4675 14.4675L14.4675 8.4675C14.7575 8.1775 15.2376 8.1775 15.5276 8.4675C15.8176 8.7575 15.8176 9.23756 15.5276 9.52756L9.5275 15.5276C9.3775 15.6776 9.1875 15.7476 8.9975 15.7476Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Manage Constituency
              <label
                htmlFor="menu-3"
                className="absolute inset-0 h-full w-full cursor-pointer"
              ></label>
            </div>
          </Link>

          {/* Voter Verification */}
          <li className="relative transition">
            <input
              className="peer hidden"
              type="checkbox"
              id="menu-8"
              checked={menu8Open}
              onChange={() => handleVoterVerificationClick()}
            />
            <Link to="/voter_verification" className="block">
              <div
                className={`group relative mx-auto m-2 flex items-center rounded-xl border-b-4 border-gray-300 py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 
        ${
          activeMenu === "voterVerification"
            ? "bg-[#7083F5] text-white"
            : "bg-gray-50 text-gray-500"
        }
        hover:bg-[#7083F5] hover:text-white cursor-pointer`} // Added hover styles and cursor
                onClick={() => handleMenuClick("voterVerification")}
              >
                <span className="mr-5 flex w-5">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                      fill="currentColor"
                    />
                    <path
                      d="M19.43 12.98C19.79 12.64 20.35 12.63 20.72 12.97C21.09 13.31 21.1 13.85 20.74 14.19L16.63 18.06C16.28 18.39 15.74 18.4 15.38 18.07L13.17 16.03C12.81 15.69 12.8 15.15 13.16 14.81C13.52 14.47 14.07 14.46 14.43 14.8L15.97 16.27L19.43 12.98Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Voter Verification
                <label
                  htmlFor="menu-8"
                  className="absolute inset-0 h-full w-full cursor-pointer"
                ></label>
              </div>
            </Link>
          </li>
        </ul>
        {/* Declare Result */}
<Link to="/Result-dashboard" className="relative transition">
  <div
    className={`group relative mx-auto m-2 flex items-center rounded-xl border-b-4 border-gray-300 py-3 pl-5 text-sm w-56 md:w-60 lg:w-64 xl:w-72 
      ${
        activeMenu === "declareResult"
          ? "bg-[#7083F5] text-white"
          : "bg-gray-50 text-gray-500"
      }
      hover:bg-[#7083F5] hover:text-white cursor-pointer`}
    onClick={() => handleMenuClick("declareResult")}
  >
    <span className="mr-5 flex w-5">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.625 7.5V16.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.375 7.5V16.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.75 12H20.25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
    Declare Result
  </div>
</Link>
        {/* Logout Button */}
        <div className="mt-auto mb-3 mr-3">
          <Link to="/login-admin" className="group relative mx-auto m-2 flex justify-center items-center rounded-xl border-b-4 border-gray-300 py-3 text-sm w-56 md:w-60 lg:w-64 xl:w-72 bg-gray-50 text-gray-500 hover:bg-[#7083F5] hover:text-white transition-all duration-200">
            <span className="flex w-5 mr-2">
              <svg
                width="21"
                height="17"
                viewBox="0 0 21 17"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.39006 9.02541H13.7602C14.1232 9.02541 14.4165 8.78741 14.4165 8.49416C14.4165 8.20091 14.1232 7.96291 13.7602 7.96291H2.43075L4.80441 6.04137C5.061 5.83419 5.061 5.49738 4.80441 5.29019C4.54781 5.083 4.13241 5.083 3.87647 5.29019L0 8.51062L3.87647 11.7316C4.00509 11.8352 4.17244 11.8872 4.34044 11.8872C4.50844 11.8872 4.67578 11.8352 4.80441 11.7316C5.061 11.5244 5.061 11.1881 4.80441 10.9804L2.39006 9.02541ZM19.6744 0H8.51813C7.79297 0 7.20563 0.475469 7.20563 1.0625V5.84375H8.52666V1.71063C8.52666 1.35575 8.88234 1.06781 9.32072 1.06781H18.8514C19.2905 1.06781 19.6455 1.35575 19.6455 1.71063L19.6665 15.2957C19.6665 15.6506 19.3115 15.9386 18.8724 15.9386H9.32203C8.88366 15.9386 8.52797 15.6506 8.52797 15.2957V11.1392L7.20694 11.1408V15.938C7.20694 16.5251 7.79428 17.0005 8.51944 17.0005H19.675C20.4002 17.0005 20.9882 16.5251 20.9882 15.938V1.06303C20.9882 0.476 20.4002 0.00053125 19.6757 0.00053125L19.6744 0Z" />
              </svg>
            </span>
            Log Out
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;