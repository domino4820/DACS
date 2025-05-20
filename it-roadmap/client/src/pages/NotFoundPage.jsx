import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { glitchAnimation } from "../lib/animations";

const NotFoundPage = () => {
  useEffect(() => {
    // Apply glitch animation to error code and title
    glitchAnimation(".error-code");
    glitchAnimation(".error-title");

    // Create scan line effect using CSS
    const scanLine = document.createElement("div");
    scanLine.classList.add("scan-line");
    scanLine.style.position = "absolute";
    scanLine.style.top = "0";
    scanLine.style.left = "0";
    scanLine.style.width = "100%";
    scanLine.style.height = "5px";
    scanLine.style.background = "rgba(255, 0, 64, 0.5)";
    scanLine.style.zIndex = "10";
    scanLine.style.animation = "scan-line 1.5s linear infinite";

    // Add keyframes for scan line if they don't exist
    if (!document.querySelector("#scan-line-keyframes")) {
      const style = document.createElement("style");
      style.id = "scan-line-keyframes";
      style.textContent = `
        @keyframes scan-line {
          0% { transform: translateY(0); }
          100% { transform: translateY(100vh); }
        }
        
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
      errorContainer.appendChild(scanLine);

      // Add flickering effect with CSS
      errorContainer.style.animation = "flicker 1s steps(3) infinite";
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-cyberpunk-darker">
      <div className="bg-cyber-grid bg-[length:30px_30px] absolute inset-0 opacity-10"></div>

      <div className="error-container border-2 border-cyberpunk-red p-8 m-4 max-w-lg bg-cyberpunk-darker/80 backdrop-blur-sm">
        <h1
          className="text-8xl font-bold font-cyber text-cyberpunk-red error-code"
          data-text="404"
        >
          404
        </h1>
        <div className="w-full h-1 bg-gradient-to-r from-cyberpunk-red via-cyberpunk-yellow to-cyberpunk-red mt-2 mb-4"></div>
        <h2
          className="text-2xl mt-4 font-cyber text-cyberpunk-yellow error-title"
          data-text="SYSTEM ERROR"
        >
          SYSTEM ERROR
        </h2>
        <p className="mt-4 font-mono-cyber text-white">
          <span className="text-cyberpunk-red">[ERROR]:</span> Requested node
          not found in network.
        </p>
        <p className="mt-2 font-mono-cyber text-white">
          <span className="text-cyberpunk-yellow">[WARNING]:</span> Unauthorized
          access attempt logged.
        </p>
        <p className="mt-2 font-mono-cyber text-white/70">
          Error code: x0000-NFND-404-NODE-MISSING
        </p>

        <Link
          to="/"
          className="mt-8 px-4 py-2 block mx-auto w-full max-w-xs text-center btn-cyber-yellow font-cyber"
        >
          RETURN TO MAIN TERMINAL
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-cyberpunk-dark to-transparent pointer-events-none"></div>
    </div>
  );
};

export default NotFoundPage;
