//layout
import React, { useState } from 'react';
import { Sidebar } from './sidebar/Sidebar';
import { Header } from './header/Header';
import { Navbar } from './navbar/Navbar';

export const Layout = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <Navbar 
        isOpen={isMobileNavOpen} 
        onClose={() => setIsMobileNavOpen(false)} 
      />
      <div className="flex-1 flex flex-col w-full max-h-screen">
        <Header onMenuClick={() => setIsMobileNavOpen(true)} />
        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  );
};