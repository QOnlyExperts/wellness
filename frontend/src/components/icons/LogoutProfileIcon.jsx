// components/icons/LogoutProfileIcon.jsx
const LogoutProfileIcon = ({ size = 24, color = "#000000", className = "" }) => {
  return (
    <svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M13 3H12C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21H13M17 8L21 12M21 12L17 16M21 12H9"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LogoutProfileIcon;
