import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/SideBar.css';

const SideBar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>
          <FaTimes />
        </button>
        <div className="sidebar-content">
          {children}
        </div>
      </div>
      {!isOpen && (
        <button className="open-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
      )}
    </>
  );
};

export default SideBar;