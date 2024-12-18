import React from "react";
const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="animate-pulse bg-gray-300 h-6 w-3/4"></div>
      <div className="animate-pulse bg-gray-300 h-4 w-full"></div>
      <div className="animate-pulse bg-gray-300 h-4 w-3/4"></div>
    </div>
  );
};

export default LoadingSkeleton;
