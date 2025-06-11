import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { glitchAnimation } from "../lib/animations";

const NotFoundPage = () => {
  useEffect(() => {
    // Apply glitch animation to error code and title
    glitchAnimation(".error-code");
    glitchAnimation(".error-title");

    // Add keyframes for flicker effect only if they don't exist
    if (!document.querySelector("#error-flicker-keyframes")) {
      const style = document.createElement("style");
      style.id = "error-flicker-keyframes";
      style.textContent = `
        @keyframes flicker {
          0%, 100% { border-color: rgba(255, 0, 64, 0.7); box-shadow: 0 0 10px rgba(255, 0, 64, 0.5), inset 0 0 20px rgba(255, 0, 64, 0.3); }
          50% { border-color: rgba(255, 222, 0, 0.7); box-shadow: 0 0 15px rgba(255, 222, 0, 0.5), inset 0 0 25px rgba(255, 222, 0, 0.3); }
        }
      `;
      document.head.appendChild(style);
    }

    const errorContainer = document.querySelector(".error-container");
    if (errorContainer) {
      errorContainer.style.position = "relative";
      errorContainer.style.overflow = "hidden";

      // Add flickering effect with CSS
      errorContainer.style.animation = "flicker 1s steps(3) infinite";
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="error-container max-w-md w-full bg-black bg-opacity-60 backdrop-blur-md rounded-lg border border-red-500 p-8 text-center">
        <div className="error-code text-6xl font-bold text-red-500 mb-4">
          404
        </div>
        <h1 className="error-title text-2xl font-bold text-white mb-6">
          Page Not Found
        </h1>
        <p className="text-gray-300 mb-8">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 rounded bg-gradient-to-r from-red-600 to-purple-600 text-white font-bold transition-transform hover:scale-105"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
