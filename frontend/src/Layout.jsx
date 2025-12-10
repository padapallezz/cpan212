import React from "react";
import { Link } from "react-router-dom";

const LayoutWithSidebar = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-blue-600">
          BTracker
        </div>
        <nav className="flex-1 flex flex-col mt-4">
          <Link
            to="/"
            className="px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/bep"
            className="px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            BEP Analysis
          </Link>
          <Link
            to="/whatif"
            className="px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            What If
          </Link>
          <Link
            to="/whatif"
            className="px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            Forecast
          </Link>
          <Link
            to="/revenue"
            className="px-6 py-3 hover:bg-blue-600 transition-colors"
          >
            Revenue
          </Link>
        </nav>
        <div className="p-6 border-t border-blue-600 text-sm">
          &copy; {new Date().getFullYear()} BTracker
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default LayoutWithSidebar;
