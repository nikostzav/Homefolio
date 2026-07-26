import React from 'react';

export const Input = ({ type = 'text', value, onChange, placeholder, className, onKeyDown, disabled }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onKeyDown={onKeyDown}
      disabled={disabled}
      className={`w-full px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    />
  );
};
