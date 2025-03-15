import React from 'react';

const AppLogo = ({ width = 64, height = 64, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={width}
      height={height}
      className={className}
    >
      {/* Background Square with Rounded Corners */}
      <rect x="2" y="2" width="60" height="60" rx="12" ry="12" fill="#2563EB" />

      {/* Simplified Folder Shape */}
      <path d="M14 18 L14 46 L50 46 L50 18 L14 18 Z" fill="#FFFFFF" />

      {/* Folder Top Flap - Simplified */}
      <path d="M14 18 L24 18 L28 14 L50 14 L50 18 L14 18 Z" fill="#F0F9FF" />

      {/* Simplified Document Lines (fewer, thicker) */}
      <rect x="18" y="24" width="22" height="3" rx="1" ry="1" fill="#DBEAFE" />
      <rect x="18" y="30" width="22" height="3" rx="1" ry="1" fill="#DBEAFE" />
      <rect x="18" y="36" width="22" height="3" rx="1" ry="1" fill="#DBEAFE" />

      {/* Document with corner fold - Simplified */}
      <path d="M42 22 L42 38 L46 38 L46 26 L50 26 L50 22 L42 22 Z" fill="#BFDBFE" />
      <path d="M46 22 L50 26 L46 26 Z" fill="#93C5FD" />
    </svg>
  );
};

export default AppLogo;
