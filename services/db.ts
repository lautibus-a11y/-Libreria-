import { supabase } from './supabase';
import { Book, AppSettings, Order, Review } from '../types';

export const db = {
    // --- Libros ---
    async getBooks(): Promise<Book[]> {
        const { data, error } = await supabase
            .from('books')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(b => ({
            id: b.id,
            title: b.title,
            author: b.author,
            price: parseFloat(b.price),
            description: b.description,
            category: b.category,
            coverImage: b.cover_image,
            stock: b.stock,
            isFeatured: b.is_featured
        }));
    },

    async saveBooks(books: Book[]) {
        // 1. Obtener IDs actuales para manejar eliminaciones
        const { data: currentDbBooks } = await supabase.from('books').select('id');
        const dbIds = currentDbBooks?.map(b => b.id) || [];
        const localIds = books.map(b => b.id).filter(id => id.length > 20); // UUIDs son largos

        const idsToDelete = dbIds.filter(id => !localIds.includes(id));
        if (idsToDelete.length > 0) {
            await supabase.from('books').delete().in('id', idsToDelete);
        }

        // 2. Upsert de libros actuales
        const booksToUpsert = books.map(b => ({
            id: b.id.length > 20 ? b.id : undefined,
            title: b.title,
            author: b.author,
            price: b.price,
            description: b.description,
            category: b.category,
            cover_image: b.coverImage,
            stock: b.stock,
            is_featured: b.isFeatured
        }));

        const { error } = await supabase.from('books').upsert(booksToUpsert);
        if (error) throw error;
    },

    async deleteBook(id: string) {
        const { error } = await supabase.from('books').delete().eq('id', id);
        if (error) throw error;
    },

    // --- Configuración ---
    async getSettings(): Promise<AppSettings | null> {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (!data) return null;

        return {
            whatsappNumber: data.whatsapp_number,
            authorName: data.author_name,
            authorBio: data.author_bio,
            authorImage: data.author_image,
            categories: data.categories || []
        };
    },

    async saveSettings(settings: AppSettings) {
        const { data: existing } = await supabase.from('settings').select('id').limit(1).single();

        const settingsData = {
            whatsapp_number: settings.whatsappNumber,
            author_name: settings.authorName,
            author_bio: settings.authorBio,
            author_image: settings.authorImage,
            categories: settings.categories
        };

        if (existing) {
            const { error } = await supabase.from('settings').update(settingsData).eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase.from('settings').insert(settingsData);
            if (error) throw error;
        }
    },

    // --- Pedidos ---
    async getOrders(): Promise<Order[]> {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(o => ({
            id: o.id,
            items: o.items,
            total: parseFloat(o.total),
            status: o.status,
            customerName: o.customer_name,
            date: new Date(o.created_at).toLocaleDateString()
        }));
    },

    async saveOrder(order: Order) {
        const { error } = await supabase.from('orders').insert({
            items: order.items,
            total: order.total,
            status: order.status,
            customer_name: order.customerName
        });
        if (error) throw error;
    },

    async updateOrderStatus(orderId: string, status: string) {
        const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
        if (error) throw error;
    },

    // --- Reseñas ---
    async getReviews(): Promise<Review[]> {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return (data || []).map(r => ({
            id: r.id,
            bookId: r.book_id,
            userName: r.user_name,
            rating: r.rating,
            comment: r.comment,
            date: new Date(r.created_at).toLocaleDateString()
        }));
    },

    async saveReview(review: Review) {
        const { error } = await supabase.from('reviews').insert({
            book_id: review.bookId,
            user_name: review.userName,
            rating: review.rating,
            comment: review.comment
        });
        if (error) throw error;
    },

    async deleteReview(id: string) {
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) throw error;
    }
};
