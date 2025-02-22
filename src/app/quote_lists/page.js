"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchQuotes = async () => {
      if (!hasMore || loading) return;

      setLoading(true);
      setError(null);

      const limit = 20;
      const offset = page * limit;

      try {
        const response = await fetch(
          `https://assignment.stage.crafto.app/getQuotes?limit=${limit}&offset=${offset}`,
          {
            method: "GET",
            headers: {
              Authorization:
                typeof window !== undefined
                  ? JSON.parse(localStorage.getItem("token"))
                  : "",
            },
          }
        );

        const data = await response.json();

        if (data?.data?.length === 0) {
          setHasMore(false);
        } else {
          setQuotes((prevQuotes) => [...prevQuotes, ...data?.data]);
        }
      } catch (err) {
        setError("Failed to load quotes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [page, hasMore]);

  const handleLoadMore = () => {
    if (hasMore) setPage((prevPage) => prevPage + 1);
  };

  const handleCreateQuote = () => {
    router.push("/quote_create"); // Navigate to the "Create Quote" page
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <button
        className="absolute top-4 right-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        onClick={handleLogout}
      >
        Logout
      </button>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-semibold text-center mb-6">Quotes</h1>

        {/* Display error if there is one */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quotes?.map((quote, index) => (
            <div
              key={index}
              className="relative bg-white rounded-lg shadow-lg overflow-hidden group"
            >
              <img
                src={quote.mediaUrl || null}
                alt="quote image"
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {quote.text}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{quote.username}</p>
                <p className="text-xs text-gray-500">
                  {new Date(quote.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {hasMore && (
          <div className="text-center mt-6">
            <button
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700"
          onClick={handleCreateQuote}
        >
          <span className="text-2xl">+</span>
        </button>
      </div>
    </div>
  );
}
