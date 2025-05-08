import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";

const UserForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userDetails"));
    if (storedData) setUserData(storedData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prevData) => ({
      ...prevData,
      [name]: name === "mobile" ? value.replace(/\D/g, "").slice(0, 10) : value.trimStart(),
    }));
  };

  const handleBlur = () => {
    localStorage.setItem("userDetails", JSON.stringify(userData));
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const validateMobile = (mobile) => /^[0-9]{10}$/.test(mobile);

  const isFormValid = userData.name && validateEmail(userData.email) && validateMobile(userData.mobile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      await Swal.fire({
        icon: "error",
        title: "Invalid Input",
        text: "Please enter valid details!",
      });
      return;
    }

    localStorage.setItem("userDetails", JSON.stringify(userData));

    await Swal.fire({
      icon: "success",
      title: "Success!",
      text: "Your details have been saved.",
      confirmButtonText: "OK",
    });

    navigate("/document-upload");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg text-white">
        <h2 className="text-2xl font-bold text-center mb-6">👤 Enter Your Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div className="flex items-center bg-gray-700 p-3 rounded-lg border border-gray-600 focus-within:ring-2 focus-within:ring-blue-400">
            <FiUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              className="w-full bg-transparent outline-none text-white"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex items-center bg-gray-700 p-3 rounded-lg border border-gray-600 focus-within:ring-2 focus-within:ring-blue-400">
            <FiMail className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none text-white"
              required
            />
          </div>

          {/* Mobile Number Input */}
          <div className="flex items-center bg-gray-700 p-3 rounded-lg border border-gray-600 focus-within:ring-2 focus-within:ring-blue-400">
            <FiPhone className="text-gray-400 mr-3" />
            <input
              type="tel"
              name="mobile"
              value={userData.mobile}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your mobile number"
              className="w-full bg-transparent outline-none text-white"
              required
            />
          </div>

          {/* Next Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full p-3 rounded-lg text-white font-bold transition-all ${
              isFormValid ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-500 cursor-not-allowed"
            }`}
          >
            Next ➡️
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
