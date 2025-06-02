import React from "react";

const FormInput = ({ label, errorMessage, ...inputProps }) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && (
        <label className="text-sm text-gray-600 mb-1">
          {label}
        </label>
      )}
      <input
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        {...inputProps}
      />
      {errorMessage && (
        <span className="text-xs text-red-500 mt-1">{errorMessage}</span>
      )}
    </div>
  );
};

export default FormInput;
