

export const Card= ({ children }) => {
  return (
    <div
      className='bg-white w-full shadow-lg border border-gray-200 p-2 text-dark w-full rounded-b-lg'
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