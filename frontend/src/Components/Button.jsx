import { IoSend } from "react-icons/io5";

export const Button = ({ onClick, className, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-primary px-4 py-2 rounded-r-lg transition-colors duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <IoSend className="w-5 h-5" /> {/* Replace with your desired icon */}
    </button>
  );
};

export default Button;