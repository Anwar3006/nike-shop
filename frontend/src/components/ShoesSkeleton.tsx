import React from "react";

const ShoesSkeleton = ({ length }: { length: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
          <div className="bg-gray-200 h-4 rounded mb-2"></div>
          <div className="bg-gray-200 h-4 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
};

export default ShoesSkeleton;
