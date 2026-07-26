// components/ui/Card.tsx
import React from 'react';

export const Card = ({ children }) => {
  return (
    <div
      className='bg-white w-full shadow-lg rounded-lg border border-gray-200 p-2 text-dark w-full' style={{ color: '#000000', width: '100%', maxWidth: '500px' }}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className='p-4 text-dark flex w-full'>
      {children}
    </div>
  );
};