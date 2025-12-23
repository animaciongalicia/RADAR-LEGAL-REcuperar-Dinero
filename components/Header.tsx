
import React from 'react';
import { APP_CONFIG } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 border-b bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center">
            <span className="text-white font-serif font-bold">R</span>
          </div>
          <span className="font-semibold text-slate-800 tracking-tight">{APP_CONFIG.firmName}</span>
        </div>
        <div className="hidden md:block text-xs text-slate-500 font-medium uppercase tracking-widest">
          Especialistas en Impagos
        </div>
      </div>
    </header>
  );
};

export default Header;
