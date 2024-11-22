import React from "react";
import * as Icons from "lucide-react";
import { useLocation } from "react-router-dom";

export const SidebarItem = ({ icon, label, path, onClick }) => {
  const Icon = Icons[icon];
  const location = useLocation();
  const active = location.pathname === path;

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault(); // Prevent default navigation
      onClick(); // Trigger the modal or custom behavior
    }
  };

  return (
    <a
      href={path} // Use `href` to maintain a clickable link for accessibility
      onClick={handleClick}
      className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer 
        ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </a>
  );
};
