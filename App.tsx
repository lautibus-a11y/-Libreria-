
import React, { useState, useEffect, useCallback } from 'react';
import { Page, Book, AppSettings, CartItem, Order, Review } from './types';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Header from './components/Header';
import Footer from './components/Footer';
// Initial Mock Data
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'El Susurro del Roble',
    author: 'Elena Valente',
    price: 18.50,
    description: 'Una epopeya de realismo mágico que explora los lazos familiares a través de las estaciones en un valle olvidado.',
    category: 'Ficción',
    coverImage: 'https://picsum.photos/seed/book1/600/900',
    stock: 25,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Cenizas de Oro',
    author: 'Elena Valente',
    price: 22.00,
    description: 'Un thriller histórico ambientado en la Venecia del siglo XVIII, donde el arte y la traición se entrelazan.',
    category: 'Histórica',
    coverImage: 'https://picsum.photos/seed/book2/600/900',
    stock: 12
  },
  {
    id: '3',
    title: 'Poemas de Sal y Viento',
    author: 'Elena Valente',
    price: 15.00,
    description: 'Antología poética inspirada en los viajes de la autora por las costas mediterráneas.',
    category: 'Poesía',
    coverImage: 'https://picsum.photos/seed/book3/600/900',
    stock: 50
  },
  {
    id: '4',
    title: 'La Última Brújula',
    author: 'Elena Valente',
    price: 20.00,
    description: 'Novela de aventuras contemporánea que cuestiona el destino y las elecciones personales.',
    category: 'Aventura',
    coverImage: 'https://picsum.photos/seed/book4/600/900',
    stock: 15
  }
];

const INITIAL_SETTINGS: AppSettings = {
  whatsappNumber: '541172023171',
  authorName: 'Elena Valente',
  authorBio: 'Escritora independiente apasionada por las historias que conectan el pasado con el presente. Con más de 10 años explorando géneros que van desde el realismo mágico hasta el thriller histórico.',
  authorImage: 'https://picsum.photos/seed/author/400/400',
  categories: ['Ficción', 'Histórica', 'Poesía', 'Aventura']
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // New States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const savedBooks = localStorage.getItem('lumina_books');
    const savedSettings = localStorage.getItem('lumina_settings');
    const savedCart = localStorage.getItem('lumina_cart');
    const savedOrders = localStorage.getItem('lumina_orders');
    const savedReviews = localStorage.getItem('lumina_reviews');

    if (savedBooks) setBooks(JSON.parse(savedBooks));
    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedReviews) setReviews(JSON.parse(savedReviews));
  }, []);

  const saveToLocal = (newBooks: Book[], newSettings: AppSettings) => {
    setBooks(newBooks);
    setSettings(newSettings);
    localStorage.setItem('lumina_books', JSON.stringify(newBooks));
    localStorage.setItem('lumina_settings', JSON.stringify(newSettings));
  };

  const updateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('lumina_orders', JSON.stringify(newOrders));
  };

  const updateReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    localStorage.setItem('lumina_reviews', JSON.stringify(newReviews));
  };

  const playClick = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'); // Subtle pop/click
    audio.volume = 0.15;
    audio.play().catch(() => { }); // Catch silence policy
  }, []);

  const addToCart = (book: Book) => {
    playClick();
    setCart(prev => {
      const existing = prev.find(item => item.book.id === book.id);
      let newCart;
      if (existing) {
        newCart = prev.map(item => item.book.id === book.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        newCart = [...prev, { book, quantity: 1 }];
      }
      localStorage.setItem('lumina_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (bookId: string) => {
    playClick();
    setCart(prev => {
      const newCart = prev.filter(item => item.book.id !== bookId);
      localStorage.setItem('lumina_cart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const navigateTo = (page: Page, bookId: string | null = null) => {
    playClick();
    if (page === Page.Catalog) {
      setCurrentPage(Page.Home);
      setTimeout(() => {
        const catalogEl = document.getElementById('catalog-section');
        catalogEl?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    setCurrentPage(page);
    setSelectedBookId(bookId || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutWhatsApp = () => {
    playClick();
    const total = cart.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);
    const itemsList = cart.map(item => `- ${item.book.title} (x${item.quantity})`).join('\n');
    const message = encodeURIComponent(`¡Hola Lumina! Quisiera adquirir estas obras:\n\n${itemsList}\n\nTotal: $${total.toFixed(2)}`);

    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      status: 'pending',
      customerName: 'Bibliófilo via WhatsApp',
      date: new Date().toLocaleDateString()
    };
    updateOrders([...orders, newOrder]);

    window.open(`https://wa.me/${settings.whatsappNumber}?text=${message}`, '_blank');
    setCart([]);
    localStorage.removeItem('lumina_cart');
    setCurrentPage(Page.Home);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <Home
          books={books}
          settings={settings}
          onNavigate={navigateTo}
          onAddToCart={addToCart}
        />;
      case Page.Detail:
        const book = books.find(b => b.id === selectedBookId);
        return book ? <BookDetail
          book={book}
          onBack={() => navigateTo(Page.Home)}
          onAddToCart={addToCart}
        /> : <Home books={books} settings={settings} onNavigate={navigateTo} onAddToCart={addToCart} />;
      case Page.Login:
        return <Login onLogin={() => { playClick(); setIsAuthenticated(true); setCurrentPage(Page.Admin); }} />;
      case Page.Admin:
        return isAuthenticated ? (
          <Admin
            books={books}
            settings={settings}
            orders={orders}
            reviews={reviews}
            onSave={(b, s) => { playClick(); saveToLocal(b, s); }}
            onUpdateOrders={updateOrders}
            onUpdateReviews={updateReviews}
            onLogout={() => { playClick(); setIsAuthenticated(false); setCurrentPage(Page.Home); }}
          />
        ) : <Login onLogin={() => { playClick(); setIsAuthenticated(true); setCurrentPage(Page.Admin); }} />;
      default:
        return <Home books={books} settings={settings} onNavigate={navigateTo} onAddToCart={addToCart} />;
    }
  };

  // Floating Cart Indicator Component
  const CartFloatingBar = () => {
    if (cart.length === 0 || currentPage === Page.Admin || currentPage === Page.Login) return null;
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const totalPrice = cart.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);

    return (
      <div className="fixed bottom-20 left-0 right-0 mx-auto z-[100] w-[88%] sm:w-min sm:min-w-[480px] animate-reveal">
        <div className="glass text-white p-3 sm:p-4 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex items-center justify-between border border-white/10 px-4 sm:px-6">
          <div className="flex items-center gap-3 sm:gap-8">
            <div className="relative">
              <div className="h-14 w-14 bg-gold/10 rounded-full flex items-center justify-center">
                <svg className="h-7 w-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 bg-gold text-emerald text-[11px] font-black h-6 w-6 rounded-full flex items-center justify-center border-4 border-emerald shadow-lg">
                {totalItems}
              </span>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/30 font-black font-sans">Mi Biblioteca</p>
              <p className="font-serif text-xl sm:text-2xl text-white tracking-tighter">${totalPrice.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={handleCheckoutWhatsApp}
            className="bg-gold text-emerald px-5 sm:px-10 py-3 sm:py-5 rounded-[1.8rem] sm:rounded-[2rem] font-black font-sans text-[10px] sm:text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-2xl flex items-center gap-2 sm:gap-3 group ml-4"
          >
            <span className="hidden xs:inline">Adquirir Ahora</span>
            <span className="xs:hidden">Adquirir</span>
            <svg className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onNavigate={navigateTo} currentPage={currentPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <CartFloatingBar />
      <Footer settings={settings} onNavigate={navigateTo} />
    </div>
  );
};

export default App;
