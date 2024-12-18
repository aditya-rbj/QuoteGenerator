"use client";

import { useState } from "react";

const OtpInput = ({ value, onChange }) => {
  const [otp, setOtp] = useState(value || ["", "", "", ""]);

  const handleChange = (e, index) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value.slice(0, 1);
    setOtp(newOtp);
    onChange(newOtp.join(""));
  };

  const handleFocusNext = (e, index) => {
    if (e.target.value.length === 1 && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleFocusPrev = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        gap: "1rem",
        marginTop: "10px",
      }}
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleFocusPrev(e, index)}
          onInput={(e) => handleFocusNext(e, index)}
          maxLength={1}
          style={{ maxWidth: "5rem", minHeight: "2.5rem" }}
          className=" text-center text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      ))}
    </div>
  );
};

export default OtpInput;
