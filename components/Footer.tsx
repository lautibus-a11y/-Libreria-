
import React from 'react';
import { Page, AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ settings, onNavigate }) => {
  return (
    <footer className="bg-[#1A3C34] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-serif tracking-tight">
              LUMINA <span className="font-light italic text-2xl">Editorial</span>
            </h2>
            <p className="text-white/60 max-w-sm leading-relaxed font-light">
              Dedicados a la creación y difusión de literatura independiente de alta calidad. Cada libro es una pieza de arte pensada para perdurar en el tiempo.
            </p>
            <div className="flex gap-4">
              {['Twitter', 'Instagram', 'Goodreads'].map(social => (
                <span key={social} className="text-[10px] uppercase tracking-[0.2em] font-bold text-gold cursor-default">
                  {social}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold">Navegación</h3>
            <ul className="space-y-4 text-sm text-white/60 font-medium">
              <li><button onClick={() => onNavigate(Page.Home)} className="hover:text-white transition-colors">Inicio</button></li>
              <li><button onClick={() => onNavigate(Page.Catalog)} className="hover:text-white transition-colors">Catálogo</button></li>
              <li><button onClick={() => onNavigate(Page.Admin)} className="hover:text-white transition-colors">Panel Autor</button></li>
              <li><span className="opacity-40 cursor-default">Términos y Condiciones</span></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gold">Contacto</h3>
            <div className="space-y-4 text-sm text-white/60 font-light">
              <p>Buenos Aires, Argentina</p>
              <p>WhatsApp: +{settings.whatsappNumber}</p>
              <p>lumina.editorial@email.com</p>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">
          <p>© {new Date().getFullYear()} {settings.authorName}. Todos los derechos reservados.</p>
          <p>Diseño Editorial de Lumina Studio</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
