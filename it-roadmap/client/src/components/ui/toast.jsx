"use client"
import { createContext, useContext, useState } from "react"
import { cn } from "../../lib/utils"

const ToastContext = createContext({
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
})

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  const { addToast } = context

  return {
    toast: (props) => {
      addToast(props)
    },
  }
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id)
    }, 5000)
  }

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return <ToastContext.Provider value={{ toasts, addToast, removeToast }}>{children}</ToastContext.Provider>
}

export function Toaster() {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 w-full max-w-sm p-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-card border rounded-md shadow-md p-4 flex items-start gap-3", // Base styles
            { // Variant styles
              "border-[hsl(var(--border))]": !toast.variant || toast.variant === "default",
              "border-destructive/50 bg-destructive/5 text-destructive": toast.variant === "destructive",
            },
            // toast.className // Allow passing custom classes
          )}
        >
          <div className="flex-1">
            {toast.title && <div className="font-medium">{toast.title}</div>} {/* Title inherits color */}
            {toast.description && (
              <div className={cn(
                "text-sm",
                toast.variant === "destructive" ? "text-destructive/90" : "text-muted-foreground"
              )}>
                {toast.description}
              </div>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-1 focus-visible:outline-ring rounded-sm" // Updated close button
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
