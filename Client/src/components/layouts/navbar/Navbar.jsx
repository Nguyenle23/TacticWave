import React from 'react';
// import { X } from 'lucide-react';
// import { SidebarItem } from './Sidebar';
// import { NAVIGATION_ITEMS, MANAGE_ITEMS } from '../../constants/navigation';

export const Navbar = ({ isOpen, onClose }) => {
  return (
    <div className={`lg:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
        {/* ... Same content as Sidebar but with close button ... */}
      </div>
    </div>
  );
};