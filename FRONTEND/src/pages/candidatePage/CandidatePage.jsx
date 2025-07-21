import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Bookmark,
  Briefcase,
  ClipboardList,
  FilePlus,
  LogOut
} from 'lucide-react';
import { logout } from '../../features/auth/AuthSlice';

const CandidatePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const links = [
    { label: 'Profile', path: '/dashboard/profile', icon: <User size={18} /> },
    { label: 'Saved Jobs', path: '/dashboard/saved-jobs', icon: <Bookmark size={18} /> },
    { label: 'Applied Jobs', path: '/dashboard/applied-jobs', icon: <ClipboardList size={18} /> },
    { label: 'Your Jobs', path: '/dashboard/posted-jobs', icon: <Briefcase size={18} /> },
    { label: 'Post a Job', path: '/dashboard/post-job', icon: <FilePlus size={18} /> },
    { label: 'Applications', path: '/dashboard/employer-applications', icon: <FilePlus size={18} /> },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-l p-4 sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <div className="flex flex-col gap-2">
          {links.map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-semibold shadow-md'
                    : 'text-gray-700 hover:bg-gray-200 hover:text-blue-600'
                }`
              }
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 text-red-600 hover:text-red-800 text-sm px-4 py-2 cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'User'}!</h1> */}
        <Outlet />
      </main>
    </div>
  );
};

export default CandidatePage;
