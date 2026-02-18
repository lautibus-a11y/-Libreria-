
import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCatalogClick = () => {
    onNavigate(Page.Catalog);
    setIsOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${scrolled
      ? 'glass py-3 shadow-2xl'
      : 'bg-transparent py-8'
      }`}>
      <div className="max-w-7xl mx-auto px-8 sm:px-12">
        <div className="flex justify-between items-center h-14">
          <div
            className="flex-shrink-0 cursor-pointer group"
            onClick={() => onNavigate(Page.Home)}
          >
            <h1 className="text-2xl md:text-3xl font-serif tracking-tighter text-white">
              LUMINA <span className="font-light italic text-gold/80 ml-1">Editorial</span>
            </h1>
          </div>

          <nav className="hidden md:flex space-x-12 items-center font-sans">
            <button
              onClick={() => onNavigate(Page.Home)}
              className={`text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-500 hover:text-gold ${currentPage === Page.Home ? 'text-gold' : 'text-white/50'}`}
            >
              Inicio
            </button>
            <button
              onClick={handleCatalogClick}
              className={`text-[11px] font-bold tracking-[0.25em] uppercase transition-all duration-500 hover:text-gold text-white/50`}
            >
              Catálogo
            </button>
            <button
              onClick={() => onNavigate(Page.Admin)}
              className="text-[10px] font-black tracking-[0.2em] uppercase px-8 py-2.5 rounded-full border border-white/10 hover:border-gold hover:bg-gold hover:text-emerald transition-all duration-500 text-white/80"
            >
              Escritorio
            </button>
          </nav>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-4 rounded-full glass text-white/80 hover:text-gold transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Mobile Overlay */}
      <div className={`fixed inset-0 bg-emerald/98 backdrop-blur-3xl z-[101] transition-all duration-700 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full font-sans">
          <header className="p-10 flex justify-end">
            <button onClick={() => setIsOpen(false)} className="text-white/40 p-4 hover:text-gold transition-colors">
              <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          <div className="flex-grow flex flex-col items-center justify-center space-y-12">
            <button
              onClick={() => { onNavigate(Page.Home); setIsOpen(false); }}
              className="text-4xl font-serif text-white hover:text-gold transition-all hover:scale-110"
            >
              Inicio
            </button>
            <button
              onClick={() => { handleCatalogClick(); setIsOpen(false); }}
              className="text-4xl font-serif text-white hover:text-gold transition-all hover:scale-110"
            >
              Colecciones
            </button>
            <button
              onClick={() => { onNavigate(Page.Admin); setIsOpen(false); }}
              className="px-10 py-4 rounded-full border border-white/10 text-gold font-bold tracking-widest uppercase hover:bg-gold hover:text-emerald transition-all"
            >
              Panel Administrativo
            </button>
          </div>
          <footer className="p-12 text-center">
            <p className="text-white/10 text-[10px] font-black tracking-widest uppercase mb-4">Arte de la Narración</p>
            <p className="text-gold/20 text-xs font-serif italic">Lumina Editorial © 2024</p>
          </footer>
        </div>
      </div>
    </header>
  );
};

export default Header;
