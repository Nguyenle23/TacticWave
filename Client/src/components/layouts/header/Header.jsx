import React from "react";
import { Menu, ChevronDown } from "lucide-react";
import { SearchBar } from "../../commons/SearchBar";

export const Header = ({ onMenuClick }) => {
  return (
    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
      <div className="flex items-center space-x-4">
        <button onClick={onMenuClick} className="lg:hidden p-2">
          <Menu size={24} />
        </button>
        <h2 className="text-xl font-semibold">Dashboard</h2>
      </div>
      <div className="flex items-center space-x-4">
        <SearchBar className="hidden md:block w-48 lg:w-96" />
        <div className="flex items-center space-x-2 cursor-pointer">
          <span>User 1</span>
          <ChevronDown size={20} />
        </div>
      </div>
    </div>
  );
};
