import React, { useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";

const PasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="password-input">
      <input
        type={showPassword ? "text" : "password"}
        id={props.id}
        onChange={props.onChange}
        className={`w-full px-4 py-1 rounded border ${
          (props.passwordError || props.confirmPasswordError) &&
          "border-red-500"
        }`}
      />
      <span
        className="absolute right-4 pr-3 text-gray-500 cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
      </span>
    </div>
  );
};

export default PasswordField;
