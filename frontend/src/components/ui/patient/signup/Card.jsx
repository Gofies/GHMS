export function Card({ children, className, ...props }) {
    return (
      <div
        className={`rounded-lg shadow-lg bg-white ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
  
  export function CardHeader({ children, className }) {
    return (
      <div className={`px-6 py-4 border-b ${className}`}>{children}</div>
    )
  }
  
  export function CardContent({ children, className }) {
    return (
      <div className={`px-6 py-4 ${className}`}>{children}</div>
    )
  }
  
  export function CardFooter({ children, className }) {
    return (
      <div className={`px-6 py-4 border-t ${className}`}>{children}</div>
    )
  }
  
  export function CardTitle({ children, className }) {
    return (
      <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
    )
  }
  
  export function CardDescription({ children, className }) {
    return (
      <p className={`text-sm text-gray-500 ${className}`}>{children}</p>
    )
  }
  