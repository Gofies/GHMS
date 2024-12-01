export function Avatar({ children, className = '', ...props }) {
  return (
    <div className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden bg-gray-200 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt = '', className = '', ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      onError={(e) => (e.target.style.display = 'none')}
      {...props}
    />
  );
}

export function AvatarFallback({ children, className = '', ...props }) {
  return (
    <div
      className={`flex items-center justify-center w-full h-full bg-gray-500 text-white font-semibold ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}