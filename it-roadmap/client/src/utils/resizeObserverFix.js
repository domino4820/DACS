/**
 * Xử lý lỗi ResizeObserver loop trong ReactFlow
 * Lỗi này không ảnh hưởng đến chức năng hoạt động của ứng dụng
 * nhưng gây ra cảnh báo khó chịu trong console
 */

export function applyResizeObserverFix() {
  if (typeof window === "undefined") {
    return; // Không áp dụng trên server-side rendering
  }

  // Ghi đè phương thức error của console để lọc các cảnh báo ResizeObserver
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Kiểm tra các dạng thông báo lỗi khác nhau
    if (
      args[0] &&
      ((typeof args[0] === "string" &&
        args[0].includes("ResizeObserver loop")) ||
        args[0]?.message?.includes?.("ResizeObserver loop") ||
        args[0]?.toString?.().includes?.("ResizeObserver loop"))
    ) {
      // Bỏ qua lỗi ResizeObserver loop
      return;
    }
    // Gọi phương thức gốc cho các lỗi khác
    originalConsoleError.apply(console, args);
  };

  // Hỗ trợ đặc biệt cho ReactFlow khi nó sử dụng ResizeObserver
  if (window.ResizeObserver) {
    // Lưu triển khai ResizeObserver gốc
    const OriginalResizeObserver = window.ResizeObserver;

    // Ghi đè với phiên bản xử lý lỗi tốt hơn
    window.ResizeObserver = class EnhancedResizeObserver extends (
      OriginalResizeObserver
    ) {
      constructor(callback) {
        // Bọc callback với xử lý lỗi
        const wrappedCallback = (entries, observer) => {
          // Debounce resize events to reduce frequency
          if (this._timeout) {
            clearTimeout(this._timeout);
          }

          this._timeout = setTimeout(() => {
            try {
              callback(entries, observer);
            } catch (error) {
              if (!String(error).includes("ResizeObserver loop")) {
                throw error; // Chỉ bắt lỗi ResizeObserver
              }
              // Otherwise silently ignore the error
            }
          }, 20); // Small delay to batch resize events
        };

        super(wrappedCallback);
        this._timeout = null;
      }

      disconnect() {
        if (this._timeout) {
          clearTimeout(this._timeout);
          this._timeout = null;
        }
        super.disconnect();
      }

      // Override observe to add additional error handling
      observe(target, options) {
        try {
          return super.observe(target, options);
        } catch (error) {
          console.warn("ResizeObserver error caught:", error);
          // Continue execution, don't break the app
        }
      }
    };
  }

  // Also handle error events globally
  window.addEventListener(
    "error",
    (event) => {
      if (event.message && event.message.includes("ResizeObserver loop")) {
        event.stopImmediatePropagation();
        event.preventDefault();
        return true;
      }
    },
    true
  );

  console.log("✅ Enhanced ResizeObserver fix applied");
}

export default applyResizeObserverFix;
