// Disable anime.js import for now
// import { animate } from "animejs";

// Placeholder function to avoid errors
const animate = (config) => {
  console.warn("Anime.js animations disabled - using CSS fallbacks");
  return null;
};

/**
 * Adds a glitch effect to elements
 * @param {string} selector - CSS selector for target elements
 */
export const glitchAnimation = (selector) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    elements.forEach((el) => {
      // Set data-text attribute for pseudo-elements
      if (!el.hasAttribute("data-text")) {
        el.setAttribute("data-text", el.textContent);
      }

      // Add glitch-text class if not present
      if (!el.classList.contains("glitch-text")) {
        el.classList.add("glitch-text");
      }
    });
  } catch (error) {
    console.error("Error in glitchAnimation:", error);
  }
};

/**
 * Creates a neon pulse effect for buttons or borders using CSS only
 * @param {string} selector - CSS selector for target elements
 * @param {string} color - Hexadecimal color code for the neon effect
 */
export const neonPulse = (selector, color = "#00f6ff") => {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    // Apply CSS animations instead of using AnimeJS
    elements.forEach((el) => {
      // Set initial boxShadow
      el.style.boxShadow = `0 0 5px ${color}, 0 0 10px ${color}`;
      el.style.animation = "neon-pulse 1.5s infinite alternate";
    });
  } catch (error) {
    console.error("Error in neonPulse:", error);
  }
};

/**
 * Animate text typing effect
 * @param {string} selector - CSS selector for target element
 * @param {string} text - Text to type (defaults to element's content)
 * @param {number} duration - Animation duration in ms
 */
export const typeText = (selector, text = null, duration = 1000) => {
  try {
    const el = document.querySelector(selector);
    if (!el) return;

    const content = text || el.textContent;
    el.textContent = "";
    el.style.opacity = 1;

    let i = 0;
    const interval = duration / content.length;

    const timer = setInterval(() => {
      if (i < content.length) {
        el.textContent += content.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, interval);
  } catch (error) {
    console.error("Error in typeText:", error);
  }
};

/**
 * Creates a scan line effect that moves across the element using CSS
 * @param {string} selector - CSS selector for target elements
 */
export const scanLineEffect = (selector) => {
  // This function has been disabled to remove the scanning line effect
  console.log("Scan line effect has been disabled");
  return; // Early return to prevent effect from being applied
};

/**
 * Creates a mecha-inspired panel transform effect using CSS
 * @param {string} selector - CSS selector for target elements
 */
export const mechaPanelEffect = (selector) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    elements.forEach((el) => {
      // Add mecha panel class
      if (!el.classList.contains("mecha-panel")) {
        el.classList.add("mecha-panel");
      }

      // Add CSS-based hover transitions instead of AnimeJS
      el.style.transition = "transform 0.3s ease-out, box-shadow 0.3s ease-out";

      // Add hover effect
      el.addEventListener("mouseenter", () => {
        el.style.transform = "skew(-8deg) scale(1.02)";
        el.style.boxShadow =
          "inset 0 0 20px rgba(255, 222, 0, 0.5), 0 0 15px rgba(255, 222, 0, 0.3)";
      });

      el.addEventListener("mouseleave", () => {
        el.style.transform = "skew(-5deg) scale(1)";
        el.style.boxShadow = "inset 0 0 10px rgba(255, 222, 0, 0.3)";
      });
    });
  } catch (error) {
    console.error("Error in mechaPanelEffect:", error);
  }
};

// Optional: Simple AnimeJS animation function for when you need it
export const simpleAnimate = (selector, properties) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    // Only use a very simple animation with minimal properties
    animate({
      targets: elements,
      ...properties,
      easing: "easeOutElastic(1, .5)",
      duration: 1000,
    });
  } catch (error) {
    console.error("Error in simpleAnimate:", error);
    // Apply fallback CSS animation if AnimeJS fails
    applyFallbackAnimation(selector);
  }
};

// Fallback animation applying CSS
const applyFallbackAnimation = (selector) => {
  try {
    const elements = document.querySelectorAll(selector);
    if (!elements || elements.length === 0) return;

    elements.forEach((el) => {
      el.style.animation = "neon-pulse 1.5s infinite alternate";
    });
  } catch (error) {
    console.error("Error applying fallback animation:", error);
  }
};

/**
 * Initialize cyberpunk animations
 * Call this function once the DOM is fully loaded
 */
export const initCyberpunkAnimations = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return; // Exit if not in browser environment
  }

  console.log("Initializing cyberpunk animations...");

  // Make sure DOM is fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyAnimations();
    });
  } else {
    // DOM already loaded, apply animations with a slight delay to ensure rendering
    setTimeout(applyAnimations, 200);
  }
};

// Separated function to be called when DOM is ready
const applyAnimations = () => {
  try {
    console.log("Applying cyberpunk animations...");

    // Add glitch effect to titles
    setTimeout(() => glitchAnimation(".glitch-this"), 100);

    // Add neon pulse to buttons with increasing delays (CSS-based)
    setTimeout(() => neonPulse(".btn-cyber"), 200);
    setTimeout(() => neonPulse(".btn-cyber-pink", "#f700ff"), 300);
    setTimeout(() => neonPulse(".btn-cyber-yellow", "#ffde00"), 400);

    // Apply mecha panel effect (CSS-based)
    setTimeout(() => mechaPanelEffect(".mecha-panel-effect"), 500);

    // Scan line effect removed
    // setTimeout(() => scanLineEffect(".cyber-scan-effect"), 600);

    console.log("Cyberpunk animations initialized successfully");
  } catch (error) {
    console.error("Error initializing cyberpunk animations:", error);
    // Apply fallback styles
    applyFallbackStyles();
  }
};

// Apply fallback styles function
const applyFallbackStyles = () => {
  try {
    // Create and add style element with fallback animation keyframes
    const style = document.createElement("style");
    style.textContent = `
      @keyframes neon-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      /* Removed scan-line animation keyframes */
      .btn-cyber {
        box-shadow: 0 0 5px #00f6ff, 0 0 10px #00f6ff;
        animation: neon-pulse 1.5s infinite alternate;
      }
      .btn-cyber-pink {
        box-shadow: 0 0 5px #f700ff, 0 0 10px #f700ff;
        animation: neon-pulse 1.5s infinite alternate;
      }
      .btn-cyber-yellow {
        box-shadow: 0 0 5px #ffde00, 0 0 10px #ffde00;
        animation: neon-pulse 1.5s infinite alternate;
      }
    `;
    document.head.appendChild(style);
    console.log("Fallback styles applied");
  } catch (error) {
    console.error("Error applying fallback styles:", error);
  }
};
