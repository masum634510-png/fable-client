import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent">Fable</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            A digital platform connecting ebook lovers, readers, and collectors with talented writers.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Form */}
        <div>
          <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-4">Newsletter</h4>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
              className="px-4 py-2 text-sm w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md font-medium transition cursor-pointer"
            >
              Subscribe
            </button>
          </form>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Fable. All rights reserved.
        </p>
        
        {/* Social Icons */}
        <div className="flex gap-4">
          <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-xs font-bold" aria-label="Facebook">
            FB
          </a>
          <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-xs font-bold" aria-label="Twitter">
            TW
          </a>
          <a href="#" className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition text-xs font-bold" aria-label="Instagram">
            IG
          </a>
        </div>
      </div>
    </footer>
  );
}
