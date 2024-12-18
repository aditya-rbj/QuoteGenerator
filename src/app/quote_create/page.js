"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateQuote() {
  const [quoteText, setQuoteText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();

  // Handle text input change
  const handleQuoteTextChange = (e) => {
    setQuoteText(e.target.value);
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  // Upload image and get mediaUrl
  const handleImageUpload = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        {
          method: "POST",
          headers: {},
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed");
      }

      // Get media URL from response
      const { url } = data?.[0];
      console.log("object", data, url);
      setImageUrl(url);
      setLoading(false);
    } catch (err) {
      setError("Image upload failed");
      setLoading(false);
    }
  };

  // Handle quote submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quoteText || !imageUrl) {
      setError("Please provide both text and image.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://assignment.stage.crafto.app/postQuote",
        {
          method: "POST",
          headers: {
            Authorization:
              typeof window !== undefined
                ? JSON.parse(localStorage.getItem("token"))
                : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: quoteText,
            mediaUrl: imageUrl,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Quote creation failed");
      }

      router.push("/quote_lists"); // Redirect to the quote list page
    } catch (err) {
      setError("Quote creation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Create a Quote
        </h1>

        {/* Display error if any */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Quote Text */}
          <div className="mb-4">
            <label
              htmlFor="quoteText"
              className="block text-sm font-medium text-gray-700"
            >
              Quote Text
            </label>
            <textarea
              id="quoteText"
              value={quoteText}
              onChange={handleQuoteTextChange}
              className="w-full p-3 border border-gray-300 rounded-md"
              rows="4"
              placeholder="Enter the quote text"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Upload Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-3 border border-gray-300 rounded-md"
              required
            />
            <button
              type="button"
              onClick={handleImageUpload}
              className="w-full mt-2 p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? "Uploading Image..." : "Upload Image"}
            </button>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mb-4">
              <img
                src={imageUrl}
                alt="Uploaded Preview"
                className="w-full h-48 object-cover rounded-md"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Creating Quote..." : "Create Quote"}
          </button>
        </form>
      </div>
    </div>
  );
}
