import React, { useState } from "react";
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = (dropdown) => {
    setDropdownOpen(dropdownOpen === dropdown ? null : dropdown);
  };

  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  return (
    <nav className="font-reader relative z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex-shrink-0">
          <a href="#" className="text-xl font-bold text-primary-50">
            TRUSTREEL.AI
          </a>
        </div>
        <div className="hidden md:flex space-x-4 items-baseline">
          <div className="relative group">
            <button
              onClick={() => toggleDropdown('product')}
              className="text-primary-50 hover:text-[#f230aa] nav-link flex items-center"
            >
              Product
              <ChevronDownIcon className="w-5 h-5 ml-1" />
            </button>
            <AnimatePresence>
              {dropdownOpen === 'product' && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute bg-white shadow-lg rounded mt-2 navbar_dropdown-list"
                >
                  <a href="#" className="block px-4 py-2 text-primary-900 hover:text-[#f230aa]">
                    Video Generation
                  </a>
                  <a href="#" className="block px-4 py-2 text-primary-900 hover:text-[#f230aa]">
                    Conversational Video Interface
                  </a>
                  <a href="#" className="block px-4 py-2 text-primary-900 hover:text-[#f230aa]">
                    AI Models
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="#" className="text-primary-50 hover:text-[#f230aa] nav-link">
            Pricing
          </a>
          <a href="#" className="text-primary-50 hover:text-[#f230aa] nav-link">
            Docs
          </a>
          <div className="relative group">
            <button
              onClick={() => toggleDropdown('resources')}
              className="text-primary-50 hover:text-[#f230aa] nav-link flex items-center"
            >
              Resources
              <ChevronDownIcon className="w-5 h-5 ml-1" />
            </button>
            <AnimatePresence>
              {dropdownOpen === 'resources' && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute bg-white shadow-lg rounded mt-2 navbar_dropdown-list"
                >
                  <a href="#" className="block px-4 py-2 text-primary-900  hover:text-[#f230aa]">
                    Blog
                  </a>
                  <a href="#" className="block px-4 py-2 text-primary-900  hover:text-[#f230aa]">
                    Changelog
                  </a>
                  <a href="#" className="block px-4 py-2 text-primary-900  hover:text-[#f230aa]">
                    Support
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a href="#" className="text-primary-50 hover:text-[#f230aa] nav-link">
            Careers
          </a>
        </div>
        <div className="hidden md:flex space-x-4 items-baseline">
          <a href="/login" className="text-primary-50 hover:text-[#f230aa] nav-link">
          Log In
          </a>
          <a href="/signup" className="rounded-md  text-primary-50 hover:text-primary-50 nav-link bg-indigo-600 btnx">
            Get Started For Free
          </a>
        </div>
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-primary-50 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden relative z-10 bg-white shadow-lg rounded mt-2 p-4">
          <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
            Product
          </a>
          <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
            Pricing
          </a>
          <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
            Docs
          </a>
          <button
            onClick={() => toggleDropdown('resources')}
            className="block w-full px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full flex items-center justify-between"
          >
            <div></div>
            <h3 className="-mr-10">Resources</h3>
            <ChevronDownIcon className="w-5 h-5 ml-1" />
          </button>
          <AnimatePresence>
            {dropdownOpen === 'resources' && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={dropdownVariants}
                className="pl-4"
              >
                <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
                  Blog
                </a>
                <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
                  Changelog
                </a>
                <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
                  Support
                </a>
              </motion.div>
            )}
          </AnimatePresence>
          <a href="#" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
            Careers
          </a>
          <a href="/login" className="block px-4 py-2 text-primary-900 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
            Log In
          </a>
          <a href="/signup" className="block px-4 py-2 hover:bg-[#f230aa] hover:text-primary-50 rounded-full">
            Get Started For Free
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;