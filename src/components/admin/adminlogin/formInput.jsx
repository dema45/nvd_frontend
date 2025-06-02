import React from "react";

const FormInput = ({ label, errorMessage, ...inputProps }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-600 text-sm">{label}</label>
      <input
        {...inputProps}
        className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7083F5] outline-none mt-1"
      />
      {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
    </div>
  );
};

export default FormInput;
