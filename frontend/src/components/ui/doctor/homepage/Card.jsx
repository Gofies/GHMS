export function Card({ children, className = "" }) {
    return <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>{children}</div>;
  }
  
  export function CardHeader({ children, className = "" }) {
    return <div className={`border-b pb-4 mb-4 ${className}`}>{children}</div>;
  }
  
  export function CardContent({ children, className = "" }) {
    return <div className={className}>{children}</div>;
  }
  
  export function CardFooter({ children, className = "" }) {
    return <div className={`pt-4 mt-4 border-t ${className}`}>{children}</div>;
  }
  
  export function CardTitle({ children, className = "" }) {
    return <h2 className={`text-xl font-bold ${className}`}>{children}</h2>;
  }
  
  export function CardDescription({ children, className = "" }) {
    return <p className={`text-gray-600 ${className}`}>{children}</p>;
  }
  