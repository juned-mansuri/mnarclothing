import React from 'react';

const OutOfService = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md animate-fade-in">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5957/5957191.png"
          alt="Out of Service"
          className="w-28 mx-auto mb-6"
        />
        <h1 className="text-2xl font-semibold text-red-600 mb-3">Out of Service</h1>
        <p className="text-gray-600 mb-5">
          Sorry, this Site is temporarily Out of Service. Please check back later or try refreshing.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default OutOfService;
