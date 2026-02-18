import React, { useState } from 'react';
import { Book, AppSettings, Order, Review } from '../types';

interface AdminProps {
  books: Book[];
  settings: AppSettings;
  orders: Order[];
  reviews: Review[];
  onAddBook: (book: Omit<Book, 'id'>) => Promise<void>;
  onUpdateBook: (book: Book) => Promise<void>;
  onDeleteBook: (id: string) => Promise<void>;
  onSaveSettings: (settings: AppSettings) => Promise<void>;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateReviews: (reviews: Review[]) => void;
  onLogout: () => void;
}

const Admin: React.FC<AdminProps> = ({
  books,
  settings,
  orders,
  reviews,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  onSaveSettings,
  onUpdateOrders,
  onUpdateReviews,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'books' | 'settings' | 'orders' | 'reviews' | 'categories'>('books');
  const [editingBook, setEditingBook] = useState<Partial<Book> | null>(null);
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveBook = async () => {
    if (!editingBook) return;
    setIsSaving(true);
    try {
      if (editingBook.id) {
        // Actualizar libro existente
        await onUpdateBook(editingBook as Book);
      } else {
        // Crear libro nuevo
        const { id: _id, ...bookData } = editingBook as Book;
        await onAddBook({
          ...bookData,
          coverImage: editingBook.coverImage || 'https://picsum.photos/seed/' + Math.random() + '/600/900'
        });
      }
      setEditingBook(null);
    } catch (err: any) {
      alert('Error guardando libro: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este libro?')) {
      try {
        await onDeleteBook(id);
      } catch (err: any) {
        alert('Error eliminando libro: ' + err.message);
      }
    }
  };


  return (
    <div className="pt-24 pb-20 bg-emerald min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 animate-reveal">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight">Escritorio</h1>
            <p className="text-white/30 text-[9px] md:text-xs uppercase tracking-[0.4em] font-black">Lumina Editorial / Panel</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full md:w-auto px-6 py-3 glass text-red-400 hover:text-white hover:bg-red-500/20 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
          >
            Cerrar Sesión
          </button>
        </header>

        <div className="flex overflow-x-auto no-scrollbar gap-1 mb-10 border-b border-white/5 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {[
            { id: 'books', label: 'Obras', count: books.length, icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
            { id: 'categories', label: 'Géneros', count: settings.categories.length, icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M19 7h.01M19 11h.01M19 15h.01" /></svg> },
            { id: 'orders', label: 'Pedidos', count: orders.length, icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
            { id: 'reviews', label: 'Reseñas', count: reviews.length, icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
            { id: 'settings', label: 'Perfil', icon: <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-4 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative flex items-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'text-gold' : 'text-white/30'}`}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold animate-reveal"></div>}
            </button>
          ))}
        </div>

        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Colección', value: books.length, sub: 'Obras Activas', color: 'text-white' },
            { label: 'Ventas', value: orders.length, sub: 'Pedidos Totales', color: 'text-gold' },
            { label: 'Feedback', value: reviews.length, sub: 'Valoraciones', color: 'text-accent' },
            { label: 'Ingresos', value: `$${orders.reduce((acc, o) => acc + o.total, 0).toFixed(0)}`, sub: 'Bruto Estimado', color: 'text-white' }
          ].map((stat, i) => (
            <div key={i} className="glass p-8 rounded-[2rem] border border-white/5 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{stat.label}</p>
              <p className={`text-3xl font-serif ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-white/10 font-sans italic">{stat.sub}</p>
            </div>
          ))}
        </div>

        <div className="space-y-12">
          {activeTab === 'books' && (
            <>
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                  <div>
                    <h2 className="text-3xl font-serif text-white italic">Catálogo Activo</h2>
                    <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Gestiona tus obras y su disponibilidad comercial.</p>
                  </div>
                  <button
                    onClick={() => setEditingBook({ title: '', author: settings.authorName, price: 0, description: '', category: 'Ficción', stock: 10 })}
                    className="w-full sm:w-auto bg-gold text-emerald px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.2)] flex items-center justify-center gap-3 active:scale-95"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Añadir Nueva Obra
                  </button>
                </div>

                {books.length === 0 ? (
                  <div className="py-40 flex flex-col items-center justify-center space-y-6 glass rounded-[3rem]">
                    <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                      <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-xl font-serif text-white/20 italic">La estantería está expectante.</p>
                      <p className="text-[10px] text-white/10 uppercase tracking-widest">Empieza a escribir tu historia hoy mismo.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="hidden md:block glass rounded-[2.5rem] overflow-hidden border border-white/5">
                      <table className="w-full text-left">
                        <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
                          <tr>
                            <th className="px-8 py-6">Obra</th>
                            <th className="px-8 py-6">Categoría</th>
                            <th className="px-8 py-6">Stock</th>
                            <th className="px-8 py-6 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-white/80">
                          {books.map(book => (
                            <tr key={book.id} className="hover:bg-white/[0.02] transition-colors group">
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-5">
                                  <img src={book.coverImage} className="h-16 w-12 object-cover rounded-lg shadow-xl" alt="" />
                                  <div className="space-y-1">
                                    <p className="text-base font-bold text-white group-hover:text-gold transition-colors">{book.title}</p>
                                    <p className="text-[10px] text-white/30 tracking-widest uppercase">${book.price.toFixed(2)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-[10px] bg-white/5 px-3 py-1 rounded-full">{book.category}</span>
                              </td>
                              <td className="px-8 py-6">
                                <span className={`text-xs font-bold ${book.stock < 10 ? 'text-red-400' : 'text-accent'}`}>{book.stock} unid.</span>
                              </td>
                              <td className="px-8 py-6 text-right">
                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setEditingBook(book)} className="h-10 w-10 glass rounded-full flex items-center justify-center text-gold/60 hover:text-gold hover:bg-gold/10 transition-all">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                  </button>
                                  <button onClick={() => handleDeleteBook(book.id)} className="h-10 w-10 glass rounded-full flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-sans">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View - Cards Layout */}
                    <div className="grid grid-cols-1 gap-6 md:hidden">
                      {books.map(book => (
                        <div key={book.id} className="glass p-6 rounded-[2rem] border border-white/5 flex items-center gap-6 relative group">
                          <img src={book.coverImage} className="w-20 h-28 object-cover rounded-xl shadow-2xl" alt={book.title} />
                          <div className="flex-grow space-y-2">
                            <p className="font-serif text-white text-lg font-bold leading-tight">{book.title}</p>
                            <div className="flex items-center gap-4">
                              <span className="text-[9px] uppercase font-black text-gold tracking-widest">{book.category}</span>
                              <span className={`text-[9px] font-black uppercase ${book.stock < 10 ? 'text-red-400' : 'text-accent'}`}>
                                {book.stock} STK
                              </span>
                            </div>
                            <p className="text-white/40 font-mono text-[10px]">${book.price.toFixed(2)}</p>
                          </div>
                          <div className="flex flex-col gap-3">
                            <button onClick={() => setEditingBook(book)} className="h-10 w-10 glass rounded-full flex items-center justify-center text-gold hover:bg-gold/10 transition-all font-sans">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                            </button>
                            <button onClick={() => handleDeleteBook(book.id)} className="h-10 w-10 glass rounded-full flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all font-sans">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>

        {activeTab === 'orders' && (
          <div className="space-y-8 animate-reveal">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-3xl font-serif text-white italic">Gestión de Adquisiciones</h2>
                <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Monitorea y actualiza el estado de tus ventas.</p>
              </div>
            </div>

            <div className="glass rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl">
              {orders.length === 0 ? (
                <div className="py-40 flex flex-col items-center justify-center space-y-6">
                  <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-serif text-white/20 italic">El archivo de pedidos está virgen.</p>
                    <p className="text-[10px] text-white/10 uppercase tracking-widest">Las obras esperan un nuevo dueño.</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
                        <tr>
                          <th className="px-8 py-6">ID / Fecha</th>
                          <th className="px-8 py-6">Bibliófilo</th>
                          <th className="px-8 py-6">Obras</th>
                          <th className="px-8 py-6">Inversión</th>
                          <th className="px-8 py-6">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {orders.map(order => (
                          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-8">
                              <p className="text-[10px] font-mono text-gold mb-1">#{order.id.slice(-8)}</p>
                              <p className="text-xs text-white/40">{order.date}</p>
                            </td>
                            <td className="px-8 py-8">
                              <p className="text-sm font-bold text-white">{order.customerName}</p>
                            </td>
                            <td className="px-8 py-8">
                              <div className="space-y-1">
                                {order.items.map((item, idx) => (
                                  <p key={idx} className="text-[11px] text-white/60">• {item.book.title} <span className="text-gold/50">[x{item.quantity}]</span></p>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-8">
                              <p className="text-lg font-light text-accent tracking-tighter">${order.total.toFixed(2)}</p>
                            </td>
                            <td className="px-8 py-8">
                              <select
                                value={order.status}
                                onChange={(e) => {
                                  const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: e.target.value as any } : o);
                                  onUpdateOrders(updatedOrders);
                                }}
                                className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-gold border border-white/10 rounded-full px-4 py-2 outline-none focus:border-gold transition-all cursor-pointer"
                              >
                                <option value="pending" className="bg-emerald">Pendiente</option>
                                <option value="delivered" className="bg-emerald">Entregado</option>
                                <option value="cancelled" className="bg-emerald">Cancelado</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-white/5">
                    {orders.map(order => (
                      <div key={order.id} className="p-8 space-y-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-[10px] font-mono text-gold lowercase">#{order.id.slice(-8)}</p>
                            <p className="text-lg font-bold text-white">{order.customerName}</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-widest">{order.date}</p>
                          </div>
                          <p className="text-xl font-light text-accent tracking-tighter">${order.total.toFixed(2)}</p>
                        </div>
                        <div className="space-y-2 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                          {order.items.map((item, idx) => (
                            <p key={idx} className="text-[11px] text-white/60 flex justify-between">
                              <span>{item.book.title}</span>
                              <span className="text-gold/50">x{item.quantity}</span>
                            </p>
                          ))}
                        </div>
                        <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Estado:</span>
                          <select
                            value={order.status}
                            onChange={(e) => {
                              const updatedOrders = orders.map(o => o.id === order.id ? { ...o, status: e.target.value as any } : o);
                              onUpdateOrders(updatedOrders);
                            }}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gold outline-none cursor-pointer"
                          >
                            <option value="pending" className="bg-emerald">Pendiente</option>
                            <option value="delivered" className="bg-emerald">Entregado</option>
                            <option value="cancelled" className="bg-emerald">Cancelado</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 animate-reveal">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-3xl font-serif text-white italic">Opiniones del Círculo</h2>
                <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Lo que los bibliófilos dicen sobre tu obra.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.length === 0 ? (
                <div className="col-span-full py-48 flex flex-col items-center justify-center space-y-6 glass rounded-[3rem]">
                  <div className="h-20 w-20 bg-white/5 rounded-full flex items-center justify-center text-white/10">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-serif text-white/20 italic">Silencio en la biblioteca.</p>
                    <p className="text-[10px] text-white/10 uppercase tracking-widest">Aún no se han registrado impresiones.</p>
                  </div>
                </div>
              ) : (
                reviews.map(review => (
                  <div key={review.id} className="glass p-10 rounded-[2.5rem] space-y-6 relative group border border-white/5">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-lg font-serif text-white">{review.userName}</p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest">{review.date}</p>
                      </div>
                      <div className="flex text-gold">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <svg key={i} className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 leading-relaxed italic font-body">"{review.comment}"</p>
                    <button
                      onClick={() => onUpdateReviews(reviews.filter(r => r.id !== review.id))}
                      className="absolute bottom-6 right-6 h-8 w-8 glass rounded-full flex items-center justify-center text-red-400/40 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all font-sans"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="space-y-12 max-w-4xl animate-reveal">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-3xl font-serif text-white italic">Gestión de Géneros</h2>
                <p className="text-white/20 text-[10px] uppercase tracking-widest mt-1">Define las colecciones y categorías de tu biblioteca.</p>
              </div>
            </div>

            <div className="glass p-10 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] space-y-10 shadow-2xl border border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {localSettings.categories.map((cat, idx) => (
                  <div key={idx} className="glass px-6 py-4 rounded-2xl border border-gold/10 flex items-center justify-between group animate-reveal">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">{cat}</span>
                    <button
                      onClick={() => {
                        const updatedCats = localSettings.categories.filter(c => c !== cat);
                        const updatedSettings = { ...localSettings, categories: updatedCats };
                        setLocalSettings(updatedSettings);
                        onSaveSettings(updatedSettings);
                      }}
                      className="text-red-400/20 group-hover:text-red-400 transition-colors p-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Nuevo Género Literario</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      id="tab-category-input"
                      placeholder="Ej: Realismo Mágico, Ensayo..."
                      className="flex-grow glass px-8 py-5 rounded-2xl border border-white/5 outline-none focus:border-gold text-white font-serif text-xl"
                    />
                    <button
                      onClick={() => {
                        const input = document.getElementById('tab-category-input') as HTMLInputElement;
                        if (input.value.trim()) {
                          const updatedCats = [...localSettings.categories, input.value.trim()];
                          const updatedSettings = { ...localSettings, categories: updatedCats };
                          setLocalSettings(updatedSettings);
                          onSaveSettings(updatedSettings);
                          input.value = '';
                        }
                      }}
                      className="bg-gold text-emerald px-10 py-5 rounded-2xl hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest shadow-xl sm:w-auto w-full active:scale-95"
                    >
                      Registrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-12 max-w-4xl animate-reveal">
            <h2 className="text-3xl font-serif text-white italic">Configuración de Identidad</h2>
            <div className="glass p-12 rounded-[3.5rem] space-y-12 shadow-2xl border border-white/5">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="relative group">
                  <div className="h-48 w-48 rounded-[3rem] overflow-hidden border-4 border-white/5 shadow-2xl">
                    <img src={localSettings.authorImage} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  </div>
                  <input
                    type="file" id="author-img" className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setLocalSettings({ ...localSettings, authorImage: reader.result as string });
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label htmlFor="author-img" className="absolute bottom-4 right-4 h-12 w-12 bg-gold text-emerald rounded-2xl flex items-center justify-center cursor-pointer shadow-2xl hover:bg-white transition-all transform hover:scale-110">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </label>
                </div>
                <div className="flex-grow space-y-8 w-full">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Nombre Literario</label>
                    <input
                      type="text" className="w-full glass px-8 py-5 rounded-2xl border border-white/5 focus:border-gold outline-none text-white font-serif text-2xl"
                      value={localSettings.authorName} onChange={(e) => setLocalSettings({ ...localSettings, authorName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">WhatsApp de Contacto</label>
                    <input
                      type="text" className="w-full glass px-8 py-5 rounded-2xl border border-white/5 focus:border-gold outline-none text-white font-sans text-xl"
                      value={localSettings.whatsappNumber} onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">Biografía Curatorial</label>
                <textarea
                  className="w-full glass px-8 py-8 rounded-[2.5rem] border border-white/5 focus:border-gold outline-none text-white/70 font-body text-lg leading-relaxed h-48 resize-none"
                  value={localSettings.authorBio} onChange={(e) => setLocalSettings({ ...localSettings, authorBio: e.target.value })}
                />
              </div>

              <button
                onClick={() => onSaveSettings(localSettings)}
                className="w-full bg-gold text-emerald py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(212,175,55,0.2)] hover:bg-white transition-all transform hover:-translate-y-2"
              >
                Actualizar Perfil
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modern Editor Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-8 backdrop-blur-xl bg-black/60">
          <div className="absolute inset-0" onClick={() => setEditingBook(null)}></div>
          <div className="relative glass w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] rounded-none sm:rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl border-white/10 animate-reveal">
            <header className="px-6 sm:px-12 py-6 sm:py-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <div className="space-y-1">
                <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-gold/60">Editor de Obras</p>
                <h2 className="text-xl sm:text-3xl font-serif text-white">{editingBook.id ? 'Modificar Registro' : 'Nueva Adición'}</h2>
              </div>
              <button onClick={() => setEditingBook(null)} className="h-10 w-10 glass rounded-full flex items-center justify-center text-white/40 hover:text-white transition-all">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </header>

            <div className="flex-grow overflow-y-auto p-6 sm:p-12 space-y-8 sm:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                <div className="space-y-6 sm:space-y-8">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Título de la Obra</label>
                    <input
                      required type="text" className="w-full glass px-6 sm:px-8 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-white/5 focus:border-gold outline-none text-white font-serif text-lg sm:text-2xl transition-all"
                      value={editingBook.title} onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Costo (USD)</label>
                      <input
                        required type="number" step="0.01" className="w-full glass px-6 py-4 rounded-xl border border-white/5 focus:border-gold outline-none text-white font-sans text-sm sm:text-xl transition-all"
                        value={editingBook.price} onChange={(e) => setEditingBook({ ...editingBook, price: parseFloat(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Stock</label>
                      <input
                        required type="number" className="w-full glass px-6 py-4 rounded-xl border border-white/5 focus:border-gold outline-none text-white font-sans text-sm sm:text-xl transition-all"
                        value={editingBook.stock} onChange={(e) => setEditingBook({ ...editingBook, stock: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Género / Colección</label>
                    <select
                      required
                      className="w-full glass px-6 py-4 rounded-xl border border-white/5 focus:border-gold outline-none text-white text-[10px] tracking-widest uppercase font-bold appearance-none cursor-pointer"
                      value={editingBook.category}
                      onChange={(e) => setEditingBook({ ...editingBook, category: e.target.value })}
                    >
                      {settings.categories.map(cat => (
                        <option key={cat} value={cat} className="bg-emerald">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Sinopsis Editorial</label>
                  <textarea
                    required className="w-full glass px-6 sm:px-8 py-6 sm:py-8 rounded-xl sm:rounded-[2rem] border border-white/5 focus:border-gold outline-none text-white/60 font-body text-base sm:text-lg leading-relaxed h-40 sm:h-[15.5rem] resize-none transition-all"
                    value={editingBook.description} onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 ml-1">Arte de Portada</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                  <div className="h-32 w-24 sm:h-40 sm:w-28 glass rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden border border-white/5 shadow-xl mx-auto sm:mx-0">
                    {editingBook.coverImage ? (
                      <img src={editingBook.coverImage} className="h-full w-full object-cover" alt="Preview" />
                    ) : (
                      <svg className="h-8 w-8 text-white/5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    )}
                  </div>
                  <div className="flex-grow w-full space-y-4">
                    <div className="flex flex-col xs:flex-row items-center gap-4">
                      <input
                        type="file" id="cover-edit" className="hidden" accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => setEditingBook({ ...editingBook, coverImage: reader.result as string });
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label htmlFor="cover-edit" className="w-full xs:w-auto text-center glass px-6 py-3 rounded-lg border border-gold/20 text-gold text-[9px] font-black uppercase tracking-widest cursor-pointer hover:bg-gold hover:text-emerald transition-all active:scale-95">
                        Elegir Archivo
                      </label>
                      <p className="hidden xs:block text-[8px] text-white/10 italic">JPG, PNG, WEBP</p>
                    </div>
                    <input
                      type="text"
                      className="w-full glass px-4 py-3 rounded-lg border border-white/5 focus:border-gold outline-none text-[9px] text-white/40 font-mono transition-all"
                      value={editingBook.coverImage || ''} onChange={(e) => setEditingBook({ ...editingBook, coverImage: e.target.value })}
                      placeholder="O pega una URL de imagen..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 sm:pt-8 bg-emerald sm:bg-transparent -mx-6 -mb-6 p-6 sm:p-0 border-t border-white/5 sm:border-0 sticky bottom-0 sm:relative">
                <button
                  onClick={handleSaveBook}
                  disabled={isSaving}
                  className="w-full sm:w-auto px-10 py-5 sm:px-16 sm:py-6 bg-gold text-emerald rounded-xl sm:rounded-[2rem] font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-xl hover:bg-white transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Guardando...' : 'Confirmar Registro'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
