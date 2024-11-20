export function Button({ children, type = "button", variant = "primary", ...props }) {
    const className = `px-4 py-2 font-semibold rounded ${
      variant === "primary" ? "bg-blue-600 text-white" : "bg-transparent text-blue-600"
    } hover:bg-blue-700`;
  
    return (
      <button type={type} className={className} {...props}>
        {children}
      </button>
    );
  }
  