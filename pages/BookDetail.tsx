
import React, { useState } from 'react';
import { Book } from '../types';

interface BookDetailProps {
  book: Book;
  onBack: () => void;
  onAddToCart: (book: Book) => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ book, onBack, onAddToCart }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="pt-40 pb-32 bg-emerald min-h-screen font-body">
      <div className="max-w-7xl mx-auto px-8 lg:px-16">
        <button
          onClick={onBack}
          className="relative z-50 flex items-center gap-4 text-white/30 hover:text-gold transition-all mb-20 group font-sans text-[10px] font-bold tracking-[0.3em] uppercase cursor-pointer"
        >
          <div className="h-10 w-10 glass rounded-full flex items-center justify-center group-hover:bg-gold group-hover:text-emerald transition-all">
            <svg className="h-4 w-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          Regresar a Colecciones
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          <div className="lg:col-span-5 animate-reveal">
            <div className="relative aspect-[3/4.5] rounded-[3rem] shadow-[0_80px_160px_rgba(0,0,0,0.6)] overflow-hidden bg-white/5 p-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald/40 to-white/10 z-10"></div>
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-[2.8rem]" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-16 animate-reveal [animation-delay:200ms]">
            <div className="space-y-8">
              <span className="text-gold font-black font-sans uppercase tracking-[0.4em] text-[11px] px-5 py-2 glass rounded-full inline-block">
                Archivo Literario / {book.category}
              </span>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif text-white leading-[0.85] tracking-tighter text-balance">{book.title}</h1>
              <p className="text-2xl text-accent font-sans font-light italic">Autora: {book.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-16 py-12 border-y border-white/5">
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold font-sans">Inversión Cultual</p>
                <p className="text-5xl font-light text-white font-sans tracking-tighter">${book.price.toFixed(2)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold font-sans">Disponibilidad</p>
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${book.stock > 0 ? 'bg-gold animate-pulse' : 'bg-red-500'}`}></div>
                  <p className={`text-xl font-bold font-sans uppercase tracking-widest ${book.stock > 0 ? 'text-white' : 'text-red-500'}`}>
                    {book.stock > 0 ? `${book.stock} Unidades` : 'Agotado'}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h3 className="text-[10px] font-black text-gold uppercase tracking-[0.4em] font-sans">Fragmento de la Obra</h3>
              <div className="text-xl md:text-2xl text-white/70 leading-relaxed font-serif italic border-l-3 border-gold/30 pl-10 max-w-3xl">
                {book.description}
              </div>
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => onAddToCart(book)}
                disabled={book.stock === 0}
                className="flex-grow bg-gold text-emerald px-12 py-7 rounded-3xl text-xs font-black tracking-widest uppercase shadow-2xl hover:bg-white transition-all transform hover:-translate-y-2 flex items-center justify-center gap-4 disabled:bg-white/10 disabled:text-white/20"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                Confirmar Reserva
              </button>
              <button
                onClick={() => setShowPreview(true)}
                className="glass text-white px-12 py-7 rounded-3xl text-xs font-bold font-sans tracking-widest uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-4"
              >
                Hojear Muestra
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-emerald/95 backdrop-blur-3xl animate-blur-in" onClick={() => setShowPreview(false)}></div>
          <div className="relative bg-beige w-full max-w-5xl h-[85vh] md:h-auto md:max-h-[90vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_100px_200px_rgba(0,0,0,0.8)] flex flex-col animate-reveal">

            {/* Header Sticky */}
            <header className="px-6 py-4 md:px-12 md:py-10 border-b border-black/5 flex justify-between items-center bg-beige/80 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="h-10 w-10 md:h-12 md:w-12 rounded-full glass border border-black/10 flex items-center justify-center text-emerald hover:bg-emerald hover:text-white transition-all active:scale-90"
                >
                  <svg className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="space-y-0.5">
                  <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-black/40">Muestra de Calidad</p>
                  <h2 className="text-xl md:text-3xl font-serif text-emerald italic line-clamp-1">{book.title}</h2>
                </div>
              </div>
            </header>

            {/* Content Scrollable */}
            <div className="flex-grow overflow-y-auto p-8 md:p-16 lg:p-28 font-serif text-lg md:text-2xl lg:text-3xl leading-[1.8] text-emerald italic bg-[url('https://www.transparenttextures.com/patterns/paper.png')] scroll-smooth">
              <p className="mb-8 md:mb-12 first-letter:text-5xl md:first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-gold text-justify">
                Las sombras se alargaban sobre el valle de Elena Valente con una parsimonia que solo los siglos de olvido pueden justificar. En cada rincón del bosque, un susurro...
              </p>
              <p className="mb-8 md:mb-12 text-justify">
                No era una voz humana, sino el crujir de lo antiguo enfrentándose a lo nuevo. {book.title} comenzaba así, como un secreto compartido entre el viento y el lector.
              </p>
              <p className="mb-8 text-justify">
                La tinta parecía cobrar vida sobre el pergamino, trazando destinos entrelazados que desafiaban la lógica mundana. Cada página, un universo contenido en promesas de papel y sueños de tinta fresca.
              </p>

              <div className="pt-12 pb-8 border-t border-black/5 mt-12 text-center space-y-6">
                <p className="text-gold font-sans text-[10px] tracking-widest uppercase font-black">Fin del fragmento gratuito</p>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full md:w-auto px-8 py-4 bg-emerald/5 text-emerald rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-emerald hover:text-white transition-all"
                >
                  Cerrar Vista Previa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;
