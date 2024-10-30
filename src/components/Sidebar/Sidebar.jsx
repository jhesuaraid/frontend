import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { FaHome, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; // Importa los íconos que necesites
import { AiOutlineVideoCameraAdd, AiOutlinePlayCircle, AiOutlineLogout, AiOutlineUser, AiOutlineUnorderedList, AiOutlineLaptop, AiOutlineMenuFold, AiOutlineMenuUnfold, AiOutlineMessage } from "react-icons/ai";


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full border bg-white border-gray-150 text-white w-20 hover:w-64 transition-all duration-300 ease-in-out overflow-hidden`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="p-4 text-xl font-bold flex justify-center text-gray-600">
          <span className={`${isOpen ? 'opacity-1' : 'opacity-0'}`}>Sidebar</span>
        </div>

        <nav className="mt-4">
          <Link to="/dashboard/createvideo" className={`flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]`}>
            <AiOutlineVideoCameraAdd className="text-2xl absolute " />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? '' : 'opacity-0'}`}>Video Generation</span>
          </Link>

          <Link to="/dashboard/videolist" className={`flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]`}>
            <AiOutlinePlayCircle className="text-2xl absolute " />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? '' : 'opacity-0'}`}>Video List</span>
          </Link>

          {/*
          <a href="/dashboard/subidafile" className="flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]">
            <AiOutlineMenuUnfold className="text-2xl absolute " />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? '' : 'opacity-0'}`}>Profile</span>
          </a>
          
          <a href="/dashboard/subidafile" className="flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]">
            <AiOutlineUpload  className="text-2xl absolute " />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? '' : 'opacity-0'}`}>Upload Clients</span>
          </a>
          */}
          <Link to="/dashboard/subidafile" className="flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]">
            <AiOutlineUser className="text-2xl absolute " />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? '' : 'opacity-0'}`}>Clients Email List</span>
          </Link>
          {/*
          <a href="#" className="flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]">
            <AiOutlineLaptop className="text-2xl absolute " />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? 'opacity-1 ' : 'opacity-0'}`}>Settings</span>
          </a>
          */}
          <a
            href="#"
            className="flex items-center p-4 hover:bg-gray-50 mt-4 text-gray-600 hover:text-[#f230aa]"
            onClick={handleLogout}
          >
            <AiOutlineLogout className="text-2xl absolute" />
            <span className={`ml-8 absolute transition-opacity duration-300 min-w-max ${isOpen ? '' : 'opacity-0'}`}>
              Logout
            </span>
          </a>

        </nav>
      </div>
    </>
  );
};

export default Sidebar;
