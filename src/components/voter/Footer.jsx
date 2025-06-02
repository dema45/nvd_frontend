import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#7082f5] text-white py-8">
      <div className="container mx-auto text-center">
        <p className="text-sm mb-4">© 2025 National Digital Voting System. All rights reserved.</p>
        <div className="space-x-6">
          <a href="/privacy-policy" className="text-gray-200 hover:text-white">Privacy Policy</a>
          <a href="/terms-of-service" className="text-gray-200 hover:text-white">Terms of Service</a>
          <a href="/contact" className="text-gray-200 hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
