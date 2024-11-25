export function Badge({ children, variant = 'default', className = '', ...props }) {
  const variantClasses = {
    default: 'bg-gray-200 text-gray-700',
    outline: 'border border-gray-300 text-gray-700',
    primary: 'bg-blue-500 text-white',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
