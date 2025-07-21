import React, { useState } from 'react';
import { Link, NavLink} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Briefcase,FilePlus, Menu, Search, User, X, ClipboardList, LogOut ,DoorOpen,Edit3,PenLine,FileText} from 'lucide-react';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);


const navLinks = [

  ...(user?.role !== 'admin' ? [{ to: `/common/jobs`, label: 'Search Jobs', icon:<Search size={16}/>}] : []),


  ...(user?.role === 'candidate'
    ? [
        {
          to: '/candidate/saved-jobs',
          label: 'Saved Jobs',
          icon: <Bookmark size={16} />,
        },
        {
          to: '/candidate/applied-jobs',
          label: 'Applied Jobs',
          icon: <ClipboardList size={16} />,
        },
      ]
    : []),

  ...(user?.role === 'employer'
    ? [
        {
          to: '/employer/posted-jobs',
          label: 'Your Jobs',
          icon: <Briefcase size={16} />,
        },
        {
          to: '/employer/create-job',
          label: 'Create Job',
          icon: <Edit3 size={16} />,
        },
        {
          to: '/employer/employer-applications',
          label: 'Applications',
          icon: <FileText size={16} />,
        },
      ]
    : []),

  ...(user?.role === 'admin'
    ? [
        {
          to: '/admin/dashboard',
          label: 'Admin Dashboard',
          icon: <Briefcase size={16} />,
        },
      ]
    : []),
  { to: `/common/profile`, label: 'Profile', icon: <User size={16} /> }

];


  

  return (
    <nav className="bg-white shadow-md px-6 py-4 w-full fixed top-0 left-0">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/common/dashboard" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map(({ to, label,icon }, i) => 
              <NavLink
              key={i}
              to={to}
              className={({ isActive }) =>
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'
              }
            >
              <div className='flex items-center  gap-1'>{icon}{label}</div>
            </NavLink>

          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden flex flex-col space-y-3 px-6 pt-4 pb-2 bg-white shadow-inner"
          >
            {navLinks.map(({ to, label }, i) => (
              <NavLink
                key={i}
                to={to}
                className={({ isActive }) =>
                  isActive ? 'text-blue-600 font-semibold' : 'text-gray-600'
                }
                onClick={() => setIsOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
