import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const handleFeaturesClick = (e) => {
    if (location.pathname === "/") {
      // If we're on the home page, prevent default and scroll to features
      e.preventDefault();
      const featuresSection = document.getElementById("features");
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: "smooth" });
      }
    }
    // Otherwise, the default Link behavior will take us to "/#features"
  };

  return (
    <header className="bg-white shadow-sm " style={{ fontFamily: "Poppins" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
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
          <Link
            to="/#features"
            onClick={handleFeaturesClick}
            className="text-gray-700 hover:text-purple-600"
          >
            Features
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-purple-600">
            About Us
          </Link>
          <a href="#voting_results" className="text-gray-700 hover:text-purple-600">
            Voting Results
          </a>
          <Link to="/contactus" className="text-gray-700 hover:text-purple-600">
            Contact
          </Link>
        </nav>
        <Link
          to="/login"
          className="bg-indigo-400 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
};

export default Header;