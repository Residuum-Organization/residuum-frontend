export default function SocialButton({ icon, alt }) {
  return (
    <button
      type="button"
      className="
        w-16 h-16
        rounded-full
        border border-gray-300
        flex items-center justify-center
        hover:bg-gray-100
        hover:scale-105
        transition
        shadow-sm
        cursor-pointer
      "
    >
      <img
        src={icon}
        alt={alt}
        className="w-8 h-8"
      />
    </button>
  );
}