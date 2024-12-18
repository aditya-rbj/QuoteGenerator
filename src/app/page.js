"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import OtpInput from "../../components/opt";

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Clear any previous errors
    setSuccess(false); // Clear success message

    try {
      // Use the provided curl request data
      const response = await fetch(
        "https://assignment.stage.crafto.app/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        console.log(data);
        if (typeof window !== undefined) {
          localStorage.setItem("token", JSON.stringify(data?.token));
        }
        router.push("/quote_lists");
      } else {
        setError(data?.message || "Something went wrong!"); // Set error from the response
      }
    } catch (error) {
      console.error("Error during login request:", error);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md sm:max-w-sm md:max-w-md lg:max-w-lg p-6 sm:p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl sm:text-xl font-semibold text-center mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* OTP Input */}
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              OTP
            </label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Login"}
          </button>

          {/* Error or Success Message */}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && (
            <p className="mt-4 text-sm text-green-600">Login Successful!</p>
          )}
        </form>
      </div>
    </div>
  );
}
