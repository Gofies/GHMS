export function Checkbox({ id, ...props }) {
    return (
      <input
        id={id}
        type="checkbox"
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        {...props}
      />
    )
  }
  