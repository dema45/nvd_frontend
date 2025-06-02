import React, { useState } from "react";
import Navbar from "./Navbar";

const Contact = () => {
  const [formStatus, setFormStatus] = useState(""); // "", "loading", "success", "error"
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus("loading");

    // Simulate form submission
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% success rate mock
      setFormStatus(isSuccess ? "success" : "error");
      
      // Clear form on success
      if (isSuccess) {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      }
    }, 1500);
  };

  return (
    <div className="">
       <Navbar/>  
    
    <section id="contact" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
    
      
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8" data-aos="fade-up">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Contact Us
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Reach out with questions, feedback, or partnership opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div className="space-y-6">
            <div
              className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4 border-blue-500"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <i className="bi bi-geo-alt text-3xl text-blue-600"></i>
              </div>
              <h4 className="text-2xl font-bold text-gray-800 mb-2">National Digital Voting</h4>
              <p className="text-gray-600 text-center leading-relaxed">
                The National Digital Voting system is a revolutionary, blockchain-based solution designed to modernize and secure the electoral process for Bhutan's National Assembly elections. Our system ensures votes are immutable, transparent, and tamper-proof.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-400"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <i className="bi bi-telephone text-2xl text-blue-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-800">Call Us</h4>
                <a href="tel:+97517233422" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-1">
                  +975 17233422
                </a>
              </div>

              <div
                className="flex flex-col items-center bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4 border-blue-400"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-3">
                  <i className="bi bi-envelope text-2xl text-blue-600"></i>
                </div>
                <h4 className="text-xl font-semibold text-gray-800">Email Us</h4>
                <a href="mailto:nationaldigitalvoting@gmail.com" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 mt-1">
                  nationaldigitalvoting@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-xl rounded-xl p-8 space-y-6 max-w-xl w-full mx-auto hover:shadow-2xl transition-shadow duration-300"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            <fieldset disabled={formStatus === "loading"} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="Your Name"
                    required
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="What's this about?"
                  required
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                  placeholder="Your message here..."
                  required
                ></textarea>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center ${formStatus === "loading" ? "cursor-not-allowed" : ""}`}
                >
                  {formStatus === "loading" ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>

                {formStatus === "success" && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Your message has been sent successfully! We'll get back to you soon.
                  </div>
                )}
                {formStatus === "error" && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Oops! Something went wrong. Please try again or contact us directly.
                  </div>
                )}
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </section>
    </div>
  );
};

export default Contact;