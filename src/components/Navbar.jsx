'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-gray-200/80 dark:border-slate-800/80 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 items-center h-16">
          
          {/* SECTION 1 (LEFT): Brand Logo */}
          <div className="flex items-center justify-start">
            <Link href="/" className="group flex items-center gap-3 font-extrabold text-2xl transition">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 group-hover:shadow-indigo-500/40 transition-all duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent tracking-tight">
                  Fable
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-indigo-500 dark:text-indigo-400 uppercase -mt-1">
                  Ebook Platform
                </span>
              </div>
            </Link>
          </div>

          {/* SECTION 2 (CENTER): Main Navigation Links */}
          <div className="hidden md:flex items-center justify-center space-x-2">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname === '/' 
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-900'
              }`}
            >
              Home
            </Link>
            
            <Link 
              href="/browse" 
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                pathname.startsWith('/browse') 
                  ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-900'
              }`}
            >
              Browse Ebooks
            </Link>

            {user && (
              <Link 
                href={`/dashboard/${user.role}`} 
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith('/dashboard') 
                    ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-slate-900'
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* SECTION 3 (RIGHT): User Actions / Authentication / Theme Toggle */}
          <div className="hidden md:flex items-center justify-end space-x-3">
            {user ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-800">
                  <img 
                    src={user.profilePicture || "https://api.dicebear.com/7.x/avataaars/svg?seed=User"} 
                    alt={user.fullName} 
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 max-w-[90px] truncate">
                    {user.fullName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold capitalize">
                    {user.role}
                  </span>
                </div>

                <button 
                  onClick={logout} 
                  className="px-3.5 py-1.5 rounded-full border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500 hover:text-white font-medium transition text-xs cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-sm transition px-3 py-2"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
            
            <div className="pl-1">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Toggle (Right Side Mobile) */}
          <div className="flex items-center justify-end gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 focus:outline-none p-2 rounded-xl border border-gray-200 dark:border-slate-800"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-2 transition-colors">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
              pathname === '/' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/browse" 
            onClick={() => setIsOpen(false)}
            className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
              pathname.startsWith('/browse') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Browse Ebooks
          </Link>
          
          {user ? (
            <>
              <Link 
                href={`/dashboard/${user.role}`}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-base font-medium ${
                  pathname.startsWith('/dashboard') ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Dashboard ({user.role})
              </Link>
              <button 
                onClick={() => { logout(); setIsOpen(false); }} 
                className="w-full text-left px-4 py-2.5 rounded-xl text-base font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link 
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl text-base font-medium border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300"
              >
                Login
              </Link>
              <Link 
                href="/register"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-2.5 rounded-xl text-base font-semibold bg-gradient-to-r from-indigo-600 to-pink-600 text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
