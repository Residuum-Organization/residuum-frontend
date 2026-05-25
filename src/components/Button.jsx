export default function Button({ children, type = "button" }) {
  return (
    <div className="flex justify-center">
      <button
        type={type}
        className="
          bg-blue-900
          text-white
          px-16
          py-3
          rounded-full
          text-base
          font-semibold
          hover:bg-blue-950
          transition
          cursor-pointer
        "
      >
        {children}
      </button>
    </div>
  );
}