
import React, { useState } from 'react';
import { Book, AppSettings, Page } from '../types';

interface HomeProps {
  books: Book[];
  settings: AppSettings;
  onNavigate: (page: Page, bookId?: string | null) => void;
  onAddToCart: (book: Book) => void;
}

const Home: React.FC<HomeProps> = ({ books, settings, onNavigate, onAddToCart }) => {
  const featuredBook = (settings.heroBookId ? books.find(b => b.id === settings.heroBookId) : null)
    || books.find(b => b.isFeatured)
    || books[0];
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');

  const categories = ['Todos', ...settings.categories];

  const filteredBooks = books.filter(b =>
    (filter === 'Todos' || b.category === filter) &&
    (b.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-emerald font-body">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-8">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald/40 via-emerald/80 to-emerald z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2000&auto=format&fit=crop"
            alt="Library"
            className="w-full h-full object-cover scale-110 opacity-40 blur-sm"
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-20 text-center space-y-12">
          <div className="animate-reveal space-y-8">
            <span className="inline-block px-5 py-2 glass text-gold text-[10px] tracking-[0.4em] font-black rounded-full uppercase">
              Lumina Editorial Presenta
            </span>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-serif leading-[0.9] text-white tracking-tighter text-balance">
              {featuredBook?.title || "El Arte de Narrar"}
            </h1>
            {featuredBook?.author && (
              <p className="text-sm md:text-base text-gold/80 font-sans font-medium tracking-[0.2em] uppercase">
                {featuredBook.author}
              </p>
            )}
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed font-sans">
              {featuredBook?.description
                ? featuredBook.description.length > 140
                  ? featuredBook.description.slice(0, 140) + '...'
                  : featuredBook.description
                : `Una curaduría exclusiva de ${settings.authorName}. Historias que trascienden el tiempo y el papel.`}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-reveal [animation-delay:200ms]">
            <button
              onClick={() => onNavigate(Page.Detail, featuredBook.id)}
              className="px-12 py-5 bg-gold text-emerald font-sans font-black text-xs tracking-[0.2em] uppercase rounded-full hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl"
            >
              Leer Reseña
            </button>
            <button
              onClick={() => document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-12 py-5 glass text-white font-sans font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-white/10 transition-all"
            >
              Explorar Catálogo
            </button>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog-section" className="pt-4 pb-32 bg-emerald">
        <div className="max-w-7xl mx-auto px-8 lg:px-12">
          <header className="mb-20 space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-serif text-white tracking-tight">Obras <span className="text-gold italic">Selectas</span></h2>
              <div className="h-1 w-24 bg-gold/30 rounded-full mx-auto"></div>
            </div>

            <div className="flex flex-col items-center gap-10">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-8 py-3 rounded-full text-[10px] font-black font-sans tracking-[0.2em] uppercase transition-all duration-700 relative group/tab ${filter === cat
                      ? 'text-gold'
                      : 'text-white/30 hover:text-white/60'
                      }`}
                  >
                    {cat}
                    {filter === cat && (
                      <div className="absolute inset-0 bg-gold/5 rounded-full border border-gold/20 -z-10 animate-reveal"></div>
                    )}
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gold transition-all duration-500 ${filter === cat ? 'w-4' : 'w-0 group-hover:tab:w-2'}`}></div>
                  </button>
                ))}
              </div>

              <div className="relative group w-full max-w-md font-sans">
                <input
                  type="text"
                  placeholder="Buscar en la biblioteca..."
                  className="w-full pl-12 pr-6 py-4 glass rounded-3xl text-sm outline-none focus:ring-1 focus:ring-gold/30 transition-all text-white/80 placeholder:text-white/20 border-white/5"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="absolute left-5 top-4 h-5 w-5 text-gold/40 group-focus-within:text-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </header>

          {/* Grid de Libros - Premium Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8 lg:gap-12">
            {filteredBooks.map(book => (
              <div key={book.id} className="group relative animate-reveal">
                {/* Book Card Container */}
                <div
                  className="relative glass rounded-[1.5rem] sm:rounded-[2.5rem] p-3 sm:p-5 transition-all duration-700 hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] hover:-translate-y-4 cursor-pointer flex flex-col h-full"
                  onClick={() => onNavigate(Page.Detail, book.id)}
                >
                  {/* Image Container */}
                  <div className="relative aspect-[3/4.2] mb-4 sm:mb-8 overflow-hidden rounded-[1rem] sm:rounded-[1.8rem] shadow-2xl">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 sm:space-y-4 px-1 sm:px-2 flex-grow">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] sm:text-[10px] text-gold font-black font-sans uppercase tracking-[0.2em] sm:tracking-[0.3em]">{book.category}</span>
                    </div>

                    <div className="space-y-1 sm:space-y-2">
                      <h3 className="text-sm sm:text-2xl font-serif text-white leading-tight line-clamp-2 min-h-[2.5rem] sm:min-h-[4rem] group-hover:text-gold transition-colors duration-500">
                        {book.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-white/40 font-sans line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>
                    </div>

                    <div className="pt-3 sm:pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[8px] sm:text-[9px] text-white/30 uppercase font-sans tracking-widest leading-none">Inversión</span>
                        <span className="text-base sm:text-xl font-light text-white font-sans">${book.price.toFixed(2)}</span>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(book); }}
                        className="h-10 w-10 sm:h-12 sm:w-12 bg-gold/10 text-gold rounded-full flex items-center justify-center hover:bg-gold hover:text-emerald transition-all duration-500 shadow-xl group/btn active:scale-90"
                      >
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBooks.length === 0 && (
            <div className="py-40 text-center glass rounded-[3rem]">
              <p className="text-2xl font-serif text-white/20 italic">No se hallaron coincidencias en el archivo.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
