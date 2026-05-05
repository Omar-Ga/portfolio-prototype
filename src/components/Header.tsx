import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDark, toggleTheme }) => {
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center backdrop-blur-lg border-b transition-colors duration-300 ${isDark ? 'bg-zinc-950/80 border-white/10' : 'bg-white/80 border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <h1 className={`text-xl font-bold tracking-tight uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Portfolio.3D
        </h1>
      </div>

      <div className="flex items-center gap-4">


        <button
          onClick={toggleTheme}
          className={`p-2.5 rounded-full transition-all hover:scale-110 active:scale-95 border ${isDark ? 'bg-white/5 text-white border-white/10' : 'bg-gray-100 text-gray-900 border-gray-200'}`}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
