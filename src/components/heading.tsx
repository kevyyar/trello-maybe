import { useAuth } from "../lib/auth-context";
import { useState, useRef, useEffect } from "react";

export const Heading = ({ onAddTask }: { onAddTask: () => void }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex justify-between items-center p-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold">Project Board</h1>
        <p className="text-sm text-gray-400">Manage your project tasks</p>
      </div>
      <div className="flex gap-2 text-sm font-semibold items-center">
        <button className="bg-white p-2 rounded-md hover:cursor-pointer">Filter</button>
        <button className="bg-white p-2 rounded-md hover:cursor-pointer">Sort</button>
        <button className="bg-blue-500 text-white p-2 rounded-md hover:cursor-pointer hover:bg-blue-600 transition-colors" onClick={onAddTask}>Add Task</button>
        {user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white p-2 rounded-full hover:cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <img
                src={user.photoURL || 'https://ui-avatars.com/api/?name=' + user.displayName}
                alt="User"
                className="w-6 h-6 rounded-full"
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
