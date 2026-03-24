import { useClerk, useUser } from '@clerk/clerk-react';
import React from 'react';
import { Eraser, FileText, Hash, House, Image, Scissors, SquarePen, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Protect } from '@clerk/clerk-react';
import { LogOut } from 'lucide-react';

const navItems = [
  { to: '/ai', label: 'Dashboard', Icon: House },
  { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
  { to: '/ai/blog-titles', label: 'Blog Titles', Icon: Hash },
  { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
  { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
  { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
  { to: '/ai/review-resume', label: 'Review Resume', Icon: FileText },
  { to: '/ai/community', label: 'Community', Icon: Users },
];


const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`w-60 h-full bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'
        } transition-all duration-300 ease-in-out z-20`}
    >
      <div className='flex-1 w-full overflow-y-auto py-7 scrollbar-hide'>
        <img
          src={user.imageUrl}
          alt="User avatar"
          className='w-13 rounded-full mx-auto'
        />
        <h1 className='mt-1 text-center font-medium'>{user.fullName}</h1>

        <div className='px-6 mt-5 text-sm text-gray-600 font-medium space-y-1'>
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/ai'}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 flex items-center gap-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] hover:bg-right text-white shadow-lg shadow-indigo-100'
                  : 'hover:bg-slate-50 text-slate-500 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      <div className='w-full border-t border-slate-100 p-4 flex flex-col gap-1'>
        <div onClick={openUserProfile} className='flex gap-3 items-center cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100'>
          <img src={user.imageUrl} className='w-9 rounded-full shadow-sm' alt="" />
          <div className='flex-1 min-w-0'>
            <h1 className='text-sm font-bold text-slate-700 truncate'>{user.fullName}</h1>
            <p className='text-[10px] font-bold text-slate-400 leading-none uppercase tracking-tighter'>
              <Protect plan='premium' fallback="Free Tier">Premium User</Protect>
            </p>
          </div>
        </div>

        <button 
          onClick={() => signOut()} 
          className='w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-xl text-xs text-slate-600 hover:text-rose-600 font-bold uppercase tracking-wider transition-all duration-300'
        >
          <LogOut className='w-4 h-4' />
          Sign Out
        </button>
      </div>


    </div>
  );
};
export default Sidebar;