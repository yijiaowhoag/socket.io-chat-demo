import React, { useState } from 'react';
import { MdDarkMode } from 'react-icons/md';
import { HiSun } from 'react-icons/hi';
import Button from './Button';

const Layout: React.FC<React.ComponentProps<'main'>> = ({ children }) => {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');

  const toggleMode = () => {
    return mode === 'dark' ? setMode('light') : setMode('dark');
  };

  const bgColor = mode === 'dark' ? 'bg-dark' : 'bg-light';
  const textColor = mode === 'dark' ? 'text-white' : 'text-slate-950';

  return (
    <main>
      <section className={`${bgColor} ${textColor}`}>
        <div className="relative flex min-h-screen flex-col items-center justify-center py-12 text-center">
          {children}
          <Button
            onClick={toggleMode}
            variant={mode === 'dark' ? 'light' : 'dark'}
            icon={mode === 'dark' ? MdDarkMode : HiSun}
            className="absolute top-4 right-4"
          />
        </div>
      </section>
    </main>
  );
};

export default Layout;
