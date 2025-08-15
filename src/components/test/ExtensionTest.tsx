'use client';

import React, { useState } from 'react';
import { logger } from '@/lib/logger';


// This component tests all your extensions
const ExtensionTest: React.FC = () => {
  const [count, setCount] = useState(0);
  const unused = 'This should show ESLint warning'; // ESLint test

  const handleClick = () => {
    setCount(prev => prev + 1);
    logger.info('Button clicked'); // ESLint will warn about console.log
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Extension Test
        </h1>

        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-4">
              Count: <span className="font-semibold text-blue-600">{count}</span>
            </p>

            <button
              onClick={handleClick}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105"
            >
              Increment
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Extension Tests:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Prettier: Auto-formatting on save</li>
              <li>✅ ESLint: Unused variable warning above</li>
              <li>✅ Tailwind: Classes with IntelliSense</li>
              <li>✅ TypeScript: Type checking and hints</li>
              <li>✅ Auto Rename Tag: Try renaming JSX tags</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionTest;
