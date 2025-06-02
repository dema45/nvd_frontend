import { useState } from "react";
import FormInput from "./formInput"; 
import { Link } from "react-router-dom";
import axios from "axios";

const AdminRegister = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    adminName: "",
  });
  
  const [error, setError] = useState(""); // To store error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, password, adminName } = values;
    if (!email || !password || !adminName) {
      setError("All fields are required.");
      return false;
    }
    
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return false;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    
    setError(""); // Clear any previous errors
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dataToSubmit = {
      email: values.email,
      password: values.password,
      adminname: values.adminName,
    };

    try {
    
      const response = await axios.post("http://localhost:4005/api/admin/dummy", dataToSubmit, {
        headers: {
          Authorization: `yourSecretKey`, 
        },
      });

      alert(response.data.message);
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data.message === "Admin already registered.") {
        alert("Admin already registered.");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center text-[#7083F5]">
          Admin Sign Up
        </h1>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Email Input */}
        <FormInput
          name="email"
          type="email"
          placeholder="Enter your email"
          label="Email"
          required
          value={values.email}
          onChange={handleChange}
        />

        {/* Password Input */}
        <FormInput
          name="password"
          type="password"
          placeholder="Enter Password"
          label="Password"
          required
          value={values.password}
          onChange={handleChange}
        />

        {/* Admin Name Input */}
        <FormInput
          name="adminName"
          type="text"
          placeholder="Enter Admin Name"
          label="Admin Name"
          required
          value={values.adminName}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-[#7083F5] text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600 mt-3">
          Already have an account?{" "}
          <Link to="/login-admin" className="text-[#7083F5] hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default AdminRegister;
