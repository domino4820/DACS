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
            "bg-white dark:bg-gray-800 border rounded-md shadow-lg p-4 flex items-start gap-3",
            toast.variant === "destructive" && "border-red-500 dark:border-red-400",
          )}
        >
          <div className="flex-1">
            {toast.title && <div className="font-medium">{toast.title}</div>}
            {toast.description && <div className="text-sm text-gray-500 dark:text-gray-400">{toast.description}</div>}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )
}
