import React from 'react';
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";

function Reset_password() {
  return (
    <div className="flex h-screen bg-white" style={{fontFamily:"Poppins"}}>
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <section className="flex flex-col items-center px-6 py-8 mx-auto lg:py-12">
          <div className="w-full p-8 bg-white rounded-xl shadow-lg dark:border md:mt-8 sm:max-w-xl ">
            <div className="mb-8 text-center">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl ">
                Change Password
              </h2>
               
            </div>
            
            <form className="space-y-6 text-xl" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400 dark:text-black"
                  placeholder="name@company.com"
                  required
                />
              </div>
              
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400 dark:text-black"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Password must be at least 8 characters long
                </p>
              </div>
              
              <div>
                <label
                  htmlFor="confirm-password"
                  className="block mb-2 text-sm font-medium text-black dark:text-black"
                >
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:placeholder-gray-400 dark:text-black"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full text-white bg-[#8EA5FE] hover:bg-[#5269F2] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center transition-colors duration-200"
              >
                Reset Password
              </button>
            </form>
            
            
          </div>
        </section>
      </div>
    </div>
  );
}

export default Reset_password;