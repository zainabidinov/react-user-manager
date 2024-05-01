import React, { useState } from "react";
import PasswordField from "../components/PasswordField";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [signupError, setSignupError] = useState("");

  const navigate = useNavigate();

  const validateInputs = () => {
    let isValid = true;

    if (!firstName) {
      setFirstNameError("Please enter a first name");
      isValid = false;
    } else {
      setFirstNameError("");
    }

    if (!lastName) {
      setLastNameError("Please enter a last name");
      isValid = false;
    } else {
      setLastNameError("");
    }

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

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords don't match");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        position: position || "-",
      };

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_SERVERURL}/signup`,
          formData
        );

        localStorage.setItem("token", response.data.token);

        navigate("/users");
      } catch (error) {
        setSignupError(error.response.data.error);
        if (error.response && error.response.status === 500) {
          setSignupError("Internal Server Error. Please try again later.");
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
        <h2 className="text-xl font-semibold mb-2">Create Account</h2>

        {signupError && <div className="mb-4 text-red-500">{signupError}</div>}

        <div className="mb-2">
          <label htmlFor="firstName" className="block mb-1">
            {" "}
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className={`w-full px-4 py-1 rounded border ${
              firstNameError && "border-red-500"
            }`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {firstNameError && (
            <span className="text-xs text-red-500">{firstNameError}</span>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="lastName" className="block mb-1">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className={`w-full px-4 py-1 rounded border ${
              lastNameError && "border-red-500"
            }`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {lastNameError && (
            <span className="text-xs text-red-500">{lastNameError}</span>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="position" className="block mb-1">
            Position
          </label>
          <input
            type="text"
            id="position"
            className="w-full px-4 py-1 rounded border"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div className="mb-2">
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
        <div className="mb-2">
          <label htmlFor="password" className="block mb-1">
            Password
          </label>
          <PasswordField
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            passwordError={passwordError}
            confirmPasswordError={confirmPasswordError}
          />
          {passwordError && (
            <span className="text-xs text-red-500">{passwordError}</span>
          )}
        </div>
        <div className="mb-2">
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <PasswordField
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            confirmPassword={confirmPassword}
            confirmPasswordError={confirmPasswordError}
          />
          {confirmPasswordError && (
            <span className="text-xs text-red-500">{confirmPasswordError}</span>
          )}
        </div>
        <div className="mb-2">
          <button
            type="submit"
            className="w-full py-1 bg-purple-600 text-white rounded"
          >
            Sign up
          </button>
        </div>

        <div className="text-center">
          <h1>
            Already have an account?{" "}
            <span
              className="text-purple-600 hover:underline hover:cursor-pointer "
              onClick={() => navigate("/login")}
            >
              Log in
            </span>
          </h1>
        </div>
      </form>
    </div>
  );
}

export default SignUp;
