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
    <nav className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-gray-200/80 dark:border-gray-800/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Fable
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-medium transition pb-1 ${pathname === '/' ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className={`font-medium transition pb-1 ${pathname.startsWith('/browse') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
            >
              Browse Ebooks
            </Link>
            
            {user ? (
              <>
                <Link 
                  href={`/dashboard/${user.role}`} 
                  className={`font-medium transition pb-1 ${pathname.startsWith('/dashboard') ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={logout} 
                  className="px-4 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium transition text-sm cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full font-medium transition shadow-md hover:shadow-lg cursor-pointer"
                >
                  Register
                </Link>
              </>
            )}
            
            <div className="pl-2 border-l border-gray-200 dark:border-gray-800">
              <ThemeToggle />
            </div>
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex items-center md:hidden">
            <div className="mr-2">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 focus:outline-none p-2 rounded-md"
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
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 transition-colors">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col gap-2">
            <Link 
              href="/" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-slate-800"
            >
              Browse Ebooks
            </Link>
            
            {user ? (
              <>
                <Link 
                  href={`/dashboard/${user.role}`}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); setIsOpen(false); }} 
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-center bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
