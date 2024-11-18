import { useState } from "react"

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description }) => {
    setToasts((prev) => [...prev, { title, description }])

    setTimeout(() => {
      setToasts((prev) => prev.slice(1))
    }, 3000)
  }

  return {
    toast,
    ToastContainer: () => (
      <div className="fixed top-4 right-4 space-y-2 z-50">
        {toasts.map((toast, index) => (
          <div
            key={index}
            className="p-4 bg-white border rounded-md shadow-md"
          >
            <h4 className="font-semibold">{toast.title}</h4>
            <p className="text-sm text-gray-500">{toast.description}</p>
          </div>
        ))}
      </div>
    ),
  }
}
