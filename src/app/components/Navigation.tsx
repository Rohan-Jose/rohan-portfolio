'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white text-2xl font-bold">
              Rohan Jose
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link 
                href="/" 
                className={`${isActive('/') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Home
              </Link>
              <Link 
                href="/projects" 
                className={`${isActive('/projects') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Projects
              </Link>
              <Link 
                href="/contact" 
                className={`${isActive('/contact') ? 'text-white' : 'text-gray-300'} hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors`}
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 