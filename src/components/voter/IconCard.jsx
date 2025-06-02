import React from "react";

const IconCard = ({ children, className }) => {
  return (
    <div className={`p-4 border border-gray-200 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default IconCard;
