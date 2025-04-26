import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.getElementById('hamburger-button');
      
      if (sidebarOpen && 
          sidebar && 
          !sidebar.contains(event.target as Node) && 
          hamburger && 
          !hamburger.contains(event.target as Node)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div 
          id="sidebar"
          className={`fixed lg:static top-0 left-0 h-full bg-white w-64 z-30 shadow-lg transform transition-transform duration-300 lg:transform-none ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
