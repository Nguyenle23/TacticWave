import React from 'react';
import { NAVIGATION_ITEMS, MANAGE_ITEMS, OPTION_ITEMS } from '../../../constants/navigation';
import * as Icons from 'lucide-react';

export const SidebarItem = ({ icon, label, active }) => {
    const Icon = Icons[icon];
    return (
        <div className={`flex items-center space-x-2 p-2 rounded-lg cursor-pointer 
        ${active ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}>
        <Icon size={20} />
        <span>{label}</span>
        </div>
    );
};

export const Sidebar = () => {
    return (
        <div className="hidden lg:block w-64 bg-white border-r h-screen p-4 relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-blue-700 text-left">TacticWave</h1>
            </div>
            
            <div className="space-y-2">
                {NAVIGATION_ITEMS.map((item) => (
                <SidebarItem key={item.path} {...item} />
                ))}
            </div>
            
            <div className="mt-8">
                <div className="text-sm text-gray-500 mb-2">MANAGE</div>
                <div className="space-y-2">
                {MANAGE_ITEMS.map((item) => (
                    <SidebarItem key={item.path} {...item} />
                ))}
                </div>
            </div>

            {/* This option items should sticky at bottom sidebar */}
            <div className="absolute inset-x-0 bottom-8 left-3.5">
                <div className="text-sm text-gray-500 mb-2">OPTIONS</div>
                <div className="space-y-2">
                {OPTION_ITEMS.map((item) => (
                    <SidebarItem key={item.path} {...item} />
                ))}
                </div>
            </div>  
        </div>
    );
};