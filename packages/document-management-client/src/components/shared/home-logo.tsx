import React from 'react';

const HomeLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="180" height="48" viewBox="0 0 300 80">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 80">
      <text
        x="150"
        y="50"
        fontFamily="Arial, sans-serif"
        fontSize="40"
        fontWeight="bold"
        textAnchor="middle"
        fill="#2563EB"
      >
        <tspan>Docu</tspan>
        <tspan fill="#3B82F6">Manager</tspan>
      </text>

      <path d="M50 58 L250 58" stroke="#93C5FD" strokeWidth="3" strokeLinecap="round" />

      <g transform="translate(28, 30) scale(0.8)">
        <path d="M0 0 L20 0 L25 5 L25 35 L0 35 Z" fill="#BFDBFE" />
        <path d="M20 0 L20 5 L25 5" fill="none" stroke="#3B82F6" strokeWidth="1" />
        <path d="M5 10 L20 10" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 15 L20 15" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 20 L20 20" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M5 25 L15 25" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  </svg>
);

export default HomeLogo;
