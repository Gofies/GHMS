export function ScrollArea({ children, className = '', style = {}, ...props }) {
  return (
    <div
      className={`overflow-y-auto overflow-x-hidden ${className}`}
      style={{ maxHeight: '100%', ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
