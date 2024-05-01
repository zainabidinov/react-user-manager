import React, { useState } from "react";
import PasswordField from "../components/PasswordField";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!email) {
      setEmailError("Please enter an email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Please enter a password");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      const formData = {
        email: email,
        password: password,
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVERURL}/login`,
          formData
        );

        localStorage.setItem("token", response.data.token);

        navigate("/users");
      } catch (error) {
        console.error("Error during login:", error);
        if (error.response && error.response.status === 404) {
          setLoginError(error.response.data.detail);
        } else if (error.response && error.response.status === 401) {
          setLoginError(error.response.data.detail);
        } else {
          setLoginError("An unexpected error occurred. Please try again.");
        }
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        className="max-w-md w-full p-4 bg-white rounded shadow-lg relative z-10"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-semibold mb-2">Login</h2>

        {loginError && <div className="mb-4 text-red-500">{loginError}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className={`w-full px-4 py-1 rounded border ${
              emailError && "border-red-500"
            }`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <span className="text-xs text-red-500">{emailError}</span>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            passwordError={passwordError}
          />
          {passwordError && (
            <span className="text-xs text-red-500">{passwordError}</span>
          )}
        </div>

        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-1 bg-purple-600 text-white rounded"
          >
            Log in
          </button>
        </div>

        <div className="text-center">
          <h1>
            Don't have an account yet?{" "}
            <span
              className="text-purple-600 hover:underline hover:cursor-pointer "
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </h1>
        </div>
      </form>
    </div>
  );
}

export default LogIn;
