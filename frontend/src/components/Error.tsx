import React from "react";

const Error = ({ error, title }: { error?: Error; title: string }) => {
  return (
    <div className="text-center py-16 font-bevellier">
      <h2 className="text-2xl font-semibold mb-2 text-red-600">
        Error Loading {title}
      </h2>
      <p className="text-gray-500 mb-4">
        {error?.message || "Something went wrong"}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 hover:cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
};

export default Error;
