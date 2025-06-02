import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import background from "../Assets/background.png";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    uname: "",
    age: "",
    cid: "",
    dzongkhag: "",
    constituencies: "",
  });
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dzongkhags, setDzongkhags] = useState([]);
  const [constituencies, setConstituencies] = useState([]);
  const [isLoadingDzongkhags, setIsLoadingDzongkhags] = useState(false);
  const [isLoadingConstituencies, setIsLoadingConstituencies] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch dzongkhags on component mount
  useEffect(() => {
    const fetchDzongkhags = async () => {
      setIsLoadingDzongkhags(true);
      setError("");
      try {
        const response = await fetch("http://localhost:4005/api/dzongkhags");
        if (!response.ok) {
          throw new Error("Failed to fetch dzongkhags");
        }
        const data = await response.json();
        setDzongkhags(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error fetching dzongkhags:", err);
        setError("Failed to load dzongkhags. Please try again later.");
      } finally {
        setIsLoadingDzongkhags(false);
      }
    };

    fetchDzongkhags();
  }, []);

  // Fetch constituencies when dzongkhag is selected
  useEffect(() => {
    if (!values.dzongkhag) {
      setConstituencies([]);
      return;
    }

    const fetchConstituencies = async () => {
      setIsLoadingConstituencies(true);
      setError("");
      try {
        const response = await fetch(
          `http://localhost:4005/api/dzongkhags/${values.dzongkhag}/constituencies`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch constituencies");
        }
        const data = await response.json();
        setConstituencies(data.constituencies || []);
      } catch (err) {
        console.error("Error fetching constituencies:", err);
        setError("Failed to load constituencies. Please try again.");
      } finally {
        setIsLoadingConstituencies(false);
      }
    };

    fetchConstituencies();
  }, [values.dzongkhag]);

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!values.email) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        newErrors.email = "Please enter a valid email";
      }

      if (!values.uname) {
        newErrors.uname = "Name is required";
      } else if (values.uname.length < 3) {
        newErrors.uname = "Name must be at least 3 characters";
      }

      if (!values.cid) {
        newErrors.cid = "CID is required";
      } else if (!/^\d{11}$/.test(values.cid)) {
        newErrors.cid = "CID must be 11 digits";
      }

      if (!values.age) {
        newErrors.age = "Age is required";
      } else if (isNaN(values.age) || values.age < 18) {
        newErrors.age = "You must be at least 18 years old";
      }
    }

    if (step === 2) {
      if (!values.dzongkhag) {
        newErrors.dzongkhag = "Dzongkhag is required";
      }
      if (!values.constituencies) {
        newErrors.constituencies = "Constituency is required";
      }
    }

    if (step === 3) {
      if (!values.password) {
        newErrors.password = "Password is required";
      } else if (values.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(values.password)) {
        newErrors.password =
          "Password must contain uppercase, lowercase and number";
      }

      if (!values.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (values.password !== values.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "dzongkhag" ? { constituencies: "" } : {}),
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const resetForm = () => {
    setValues({
      email: "",
      password: "",
      confirmPassword: "",
      uname: "",
      age: "",
      cid: "",
      dzongkhag: "",
      constituencies: "",
    });
    setStep(1);
    setShowSuccessModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateStep(3)) return;
  
    if (values.password !== values.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }
  
    setIsSubmitting(true);
    setError("");
  
    try {
      const res = await fetch("http://localhost:4005/api/voters/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          dzongkhag: values.dzongkhag, // Send dzongkhag ID
          constituencies: values.constituencies // Send constituency ID
        }),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate("/login");
          resetForm();
        }, 3000);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-xl p-8 w-[400px] max-w-[70vw] mx-4 flex flex-col justify-center shadow-xl border border-gray-100">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-50 mb-4">
                  <svg
                    className="h-8 w-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">
                  Registration Successful!
                </h3>
                <p className="text-gray-600 mt-2">
                  Your account is pending admin approval.
                </p>
              </div>
              <div className="mt-8 w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full animate-progress"
                  style={{
                    animation: "progress 3s linear forwards",
                  }}
                ></div>
                <style jsx>{`
                  @keyframes progress {
                    from {
                      width: 100%;
                    }
                    to {
                      width: 0%;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative h-screen w-screen overflow-hidden flex flex-col"
        style={{
          fontFamily: "Poppins",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Blurred Background Only */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
            transform: "scale(1.02)",
          }}
        />

        {/* Semi-transparent overlay - adjust opacity as needed */}
        <div className="fixed inset-0 -z-10 bg-black/20" />

        {/* Crisp Content */}
        <div className="relative z-0">
          <Header />

          {/* Remove the gradient background from this div */}
          <div className="min-h-screen text-gray-800 flex items-center justify-center p-6 pb-40">
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-100 relative"
            >
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#7083F5]">
                  Sign up to start Voting
                </h2>

                {/* Progress indicator */}
                <div className="flex justify-center mt-6 mb-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${
                        step >= i
                          ? "bg-[#7083F5] text-white"
                          : "bg-gray-200 text-gray-500"
                      }
                      ${
                        i === step ? "ring-2 ring-[#7083F5] ring-offset-2" : ""
                      }`}
                      >
                        {i}
                      </div>
                      {i < 3 && (
                        <div
                          className={`w-8 h-1 ${
                            step > i ? "bg-[#7083F5]" : "bg-gray-200"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Personal Information */}
              {step === 1 && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      required
                      value={values.email}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="uname"
                      placeholder="Enter your name"
                      required
                      value={values.uname}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        errors.uname ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    />
                    {errors.uname && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.uname}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Citizenship ID
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cid"
                      placeholder="Enter your 11-digit CID"
                      required
                      value={values.cid}
                      onChange={handleChange}
                      maxLength="11"
                      className={`w-full p-3 rounded-lg border ${
                        errors.cid ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    />
                    {errors.cid && (
                      <p className="mt-1 text-sm text-red-500">{errors.cid}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter your age"
                      required
                      value={values.age}
                      onChange={handleChange}
                      min="18"
                      max="120"
                      className={`w-full p-3 rounded-lg border ${
                        errors.age ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    />
                    {errors.age && (
                      <p className="mt-1 text-sm text-red-500">{errors.age}</p>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#7083F5] hover:bg-[#5A6BD7] text-white py-2 px-6 rounded-lg font-bold transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Continue
                    </button>
                  </div>

                  <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-[#7083F5] hover:underline font-medium"
                    >
                      Log in
                    </Link>
                  </p>
                </>
              )}

              {/* Step 2: Location Information */}
              {step === 2 && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Dzongkhag <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="dzongkhag"
                      value={values.dzongkhag}
                      onChange={handleChange}
                      required
                      disabled={isLoadingDzongkhags}
                      className={`w-full p-3 rounded-lg border ${
                        errors.dzongkhag ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    >
                      <option value="">Select Dzongkhag</option>
                      {isLoadingDzongkhags ? (
                        <option value="" disabled>
                          Loading dzongkhags...
                        </option>
                      ) : (
                        dzongkhags.map((dz) => (
                          <option key={dz.dzongkhag_id} value={dz.dzongkhag_id}>
                            {dz.dzongkhag_name}
                          </option>
                        ))
                      )}
                    </select>
                    {errors.dzongkhag && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.dzongkhag}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Constituency <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="constituencies"
                      value={values.constituencies}
                      onChange={handleChange}
                      required
                      disabled={!values.dzongkhag || isLoadingConstituencies}
                      className={`w-full p-3 rounded-lg border ${
                        errors.constituencies
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    >
                      <option value="">
                        {isLoadingConstituencies
                          ? "Loading constituencies..."
                          : values.dzongkhag
                          ? "Select Constituency"
                          : "First select Dzongkhag"}
                      </option>
                      {constituencies.map((c) => (
                        <option
                          key={c.constituency_id}
                          value={c.constituency_id}
                        >
                          {c.constituency_name}
                        </option>
                      ))}
                    </select>
                    {errors.constituencies && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.constituencies}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm text-[#7083F5] hover:text-[#5A6BD7] font-medium px-4 py-2 rounded-lg hover:bg-[#7083F5]/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-[#7083F5] hover:bg-[#5A6BD7] text-white py-2 px-6 rounded-lg font-bold transition-colors duration-200 shadow-md hover:shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                </>
              )}

              {/* Step 3: Password */}
              {step === 3 && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      required
                      value={values.password}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    />
                    {errors.password ? (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.password}
                      </p>
                    ) : (
                      <p className="mt-1 text-xs text-gray-500">
                        Must be at least 8 characters with uppercase, lowercase,
                        and number
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      required
                      value={values.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-lg border ${
                        errors.confirmPassword
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-[#7083F5] focus:border-transparent`}
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="text-sm text-[#7083F5] hover:text-[#5A6BD7] font-medium px-4 py-2 rounded-lg hover:bg-[#7083F5]/10 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#7083F5] hover:bg-[#5A6BD7] text-white py-2 px-6 rounded-lg font-bold transition-colors duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Registering...
                        </>
                      ) : (
                        "Complete Registration"
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;