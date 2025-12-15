/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from 'msw';
import { products } from './data';
import { paginate, avgRating } from './utils';

const API = '/api';

export const handlers = [
  // Auth: POST /api/auth/token/ -> { access, refresh }
  http.post(`${API}/auth/token/`, async () => {
    // Ici on accepte tout payload pour valider l'intégration front.
    return HttpResponse.json(
      {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      },
      { status: 200 },
    );
  }),

  // Auth refresh: POST /api/auth/token/refresh/ -> { access }
  http.post(`${API}/auth/token/refresh/`, async () => {
    return HttpResponse.json({ access: 'mock-access-token-refreshed' }, { status: 200 });
  }),

  // Products list: GET /api/products/?page=&page_size=&min_rating=&ordering=
  http.get(`${API}/products/`, async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || '1');
    const page_size = Number(url.searchParams.get('page_size') || '10');
    const min_rating = Number(url.searchParams.get('min_rating') || '0');
    const ordering = url.searchParams.get('ordering') || '-created_at';

    const rows = products
      .map((p) => ({ ...p, _avg: avgRating(p.ratings) }))
      .filter((p) => p._avg >= min_rating);

    const sign = ordering.startsWith('-') ? -1 : 1;
    const key = ordering.replace(/^-/, '');
    rows.sort((a: any, b: any) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * sign);

    const { count, results } = paginate(rows, page, page_size);
    return HttpResponse.json({ count, next: null, previous: null, results }, { status: 200 });
  }),

  // Product details: GET /api/products/:id/
  http.get(`${API}/products/:id/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json({ ...p, avg_rating: avgRating(p.ratings) }, { status: 200 });
  }),

  // Product rating: GET /api/products/:id/rating/
  http.get(`${API}/products/:id/rating/`, async ({ params }) => {
    const id = Number(params['id']);
    const p = products.find((x) => x.id === id);
    if (!p) return HttpResponse.json({ detail: 'Not found.' }, { status: 404 });
    return HttpResponse.json(
      { product_id: id, avg_rating: avgRating(p.ratings), count: p.ratings.length },
      { status: 200 },
    );
  }),

  // Cart validation: POST /api/cart/validate/
  http.post(`${API}/cart/validate/`, async ({ request }) => {
    try {
      const body = await request.json();
      const items = (body as any).items || [];
      
      let subtotal = 0;
      for (const item of items) {
        const product = products.find((p) => p.id === item.product_id);
        if (product) {
          subtotal += product.price * item.quantity;
        }
      }

      // Apply discount logic (10% if total > 50€)
      const discount = subtotal > 50 ? subtotal * 0.1 : 0;
      const total = subtotal - discount;

      return HttpResponse.json(
        {
          subtotal: Number(subtotal.toFixed(2)),
          discount: Number(discount.toFixed(2)),
          total: Number(total.toFixed(2)),
          message: discount > 0 ? 'Réduction de 10% appliquée!' : null,
        },
        { status: 200 },
      );
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid request.' }, { status: 400 });
    }
  }),

  // Order creation: POST /api/order/
  http.post(`${API}/order/`, async ({ request }) => {
    try {
      const body = await request.json();
      const orderData = body as any;
      
      // Generate order confirmation number
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      return HttpResponse.json(
        {
          order_number: orderNumber,
          status: 'confirmed',
          items: orderData.items || [],
          shipping_address: orderData.shipping_address || {},
          total: orderData.total || 0,
          estimated_delivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          message: 'Votre commande a été confirmée avec succès!',
        },
        { status: 201 },
      );
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid order data.' }, { status: 400 });
    }
  }),

  // User profile: GET /api/me/
  http.get(`${API}/me/`, async () => {
    return HttpResponse.json(
      {
        id: 'user-123',
        username: 'johndoe',
        email: 'john.doe@example.com',
        fullName: 'John Doe',
        defaultAddress: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75001',
          country: 'France',
        },
        preferences: {
          newsletter: true,
          defaultMinRating: 3,
        },
      },
      { status: 200 }
    );
  }),

  // Update user profile: PATCH /api/me/
  http.patch(`${API}/me/`, async ({ request }) => {
    try {
      const updates = await request.json();
      // Merge with existing profile
      return HttpResponse.json(
        {
          id: 'user-123',
          username: 'johndoe',
          email: 'john.doe@example.com',
          fullName: (updates as any).fullName || 'John Doe',
          defaultAddress: (updates as any).defaultAddress || {
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
          preferences: {
            newsletter: (updates as any).preferences?.newsletter ?? true,
            defaultMinRating: (updates as any).preferences?.defaultMinRating ?? 3,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid update data.' }, { status: 400 });
    }
  }),

  // User orders: GET /api/me/orders/
  http.get(`${API}/me/orders/`, async () => {
    return HttpResponse.json(
      [
        {
          id: 'order-001',
          user: 'user-123',
          total: 45.5,
          status: 'livrée',
          createdAt: '2025-12-01T10:30:00Z',
          itemCount: 3,
        },
        {
          id: 'order-002',
          user: 'user-123',
          total: 128.9,
          status: 'expédiée',
          createdAt: '2025-12-10T14:20:00Z',
          itemCount: 5,
        },
        {
          id: 'order-003',
          user: 'user-123',
          total: 67.3,
          status: 'en cours',
          createdAt: '2025-12-14T09:15:00Z',
          itemCount: 2,
        },
      ],
      { status: 200 }
    );
  }),

  // Order details: GET /api/orders/:id/
  http.get(`${API}/orders/:id/`, async ({ params }) => {
    const id = params['id'];
    
    // Mock different order details based on ID
    if (id === 'order-001') {
      return HttpResponse.json(
        {
          id: 'order-001',
          user: 'user-123',
          total: 45.5,
          status: 'livrée',
          createdAt: '2025-12-01T10:30:00Z',
          itemCount: 3,
          items: [
            { productId: '1', productName: 'Stylo Bleu', quantity: 2, price: 2.5 },
            { productId: '2', productName: 'Cahier A5', quantity: 1, price: 3.9 },
            { productId: '4', productName: 'Crayon HB', quantity: 10, price: 1.2 },
          ],
          subtotal: 40.5,
          taxes: 2.0,
          shipping: 3.0,
          shippingAddress: {
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
        },
        { status: 200 }
      );
    } else if (id === 'order-002') {
      return HttpResponse.json(
        {
          id: 'order-002',
          user: 'user-123',
          total: 128.9,
          status: 'expédiée',
          createdAt: '2025-12-10T14:20:00Z',
          itemCount: 5,
          items: [
            { productId: '10', productName: 'Bloc Notes', quantity: 3, price: 3.0 },
            { productId: '11', productName: 'Feuilles A4', quantity: 5, price: 4.0 },
            { productId: '7', productName: 'Surligneur Jaune', quantity: 10, price: 1.7 },
            { productId: '3', productName: 'Classeur Rouge', quantity: 4, price: 4.5 },
            { productId: '5', productName: 'Règle 30cm', quantity: 2, price: 1.5 },
          ],
          subtotal: 120.0,
          taxes: 6.0,
          shipping: 2.9,
          shippingAddress: {
            street: '45 Avenue des Champs',
            city: 'Lyon',
            postalCode: '69001',
            country: 'France',
          },
        },
        { status: 200 }
      );
    } else if (id === 'order-003') {
      return HttpResponse.json(
        {
          id: 'order-003',
          user: 'user-123',
          total: 67.3,
          status: 'en cours',
          createdAt: '2025-12-14T09:15:00Z',
          itemCount: 2,
          items: [
            { productId: '9', productName: 'Feutre Noir', quantity: 5, price: 2.0 },
            { productId: '6', productName: 'Gomme Blanche', quantity: 20, price: 0.9 },
          ],
          subtotal: 62.0,
          taxes: 3.1,
          shipping: 2.2,
          shippingAddress: {
            street: '123 Rue de la Paix',
            city: 'Paris',
            postalCode: '75001',
            country: 'France',
          },
        },
        { status: 200 }
      );
    }

    return HttpResponse.json({ detail: 'Order not found.' }, { status: 404 });
  }),

  // Wishlist: GET /api/me/wishlist/
  http.get(`${API}/me/wishlist/`, async () => {
    // Return mock wishlist product IDs
    return HttpResponse.json(['1', '3', '7'], { status: 200 });
  }),

  // Wishlist: POST /api/me/wishlist/ (add or remove)
  http.post(`${API}/me/wishlist/`, async ({ request }) => {
    try {
      const body = await request.json();
      const { productId, action } = body as any;

      if (action === 'add') {
        return HttpResponse.json({ success: true, message: 'Product added to wishlist' }, { status: 200 });
      } else if (action === 'remove') {
        return HttpResponse.json({ success: true, message: 'Product removed from wishlist' }, { status: 200 });
      }

      return HttpResponse.json({ detail: 'Invalid action' }, { status: 400 });
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid request' }, { status: 400 });
    }
  }),

  // Product Reviews: GET /api/products/:id/reviews/
  http.get(`${API}/products/:id/reviews/`, async ({ params }) => {
    const productId = params['id'];
    
    // Mock reviews data
    const reviewsData: any = {
      '1': [
        { id: 'r1', productId: '1', user: 'Alice', rating: 4, comment: 'Très bon stylo, écriture fluide!', createdAt: '2025-12-01T10:00:00Z' },
        { id: 'r2', productId: '1', user: 'Bob', rating: 5, comment: 'Parfait pour prendre des notes.', createdAt: '2025-12-05T14:30:00Z' },
      ],
      '2': [
        { id: 'r3', productId: '2', user: 'Charlie', rating: 5, comment: 'Cahier de qualité, je recommande!', createdAt: '2025-11-28T09:15:00Z' },
      ],
      '3': [
        { id: 'r4', productId: '3', user: 'Diana', rating: 3, comment: 'Correct mais un peu cher.', createdAt: '2025-12-03T16:45:00Z' },
      ],
    };

    const reviews = reviewsData[productId as string] || [];
    return HttpResponse.json(reviews, { status: 200 });
  }),

  // Create Product Review: POST /api/products/:id/reviews/
  http.post(`${API}/products/:id/reviews/`, async ({ params, request }) => {
    try {
      const productId = params['id'];
      const body = await request.json();
      const { rating, comment } = body as any;

      const newReview = {
        id: `r-${Date.now()}`,
        productId,
        user: 'Current User',
        rating,
        comment,
        createdAt: new Date().toISOString(),
      };

      return HttpResponse.json(newReview, { status: 201 });
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid review data' }, { status: 400 });
    }
  }),

  // Apply Promo Code: POST /api/cart/apply-promo/
  http.post(`${API}/cart/apply-promo/`, async ({ request }) => {
    try {
      const body = await request.json();
      const { items, code } = body as any;

      let itemsTotal = 0;
      for (const item of items || []) {
        const product = products.find((p) => p.id === item.product_id);
        if (product) {
          itemsTotal += product.price * item.quantity;
        }
      }

      let discount = 0;
      let shipping = 5.0;
      const appliedPromos: string[] = [];

      // Promo codes logic
      const promoCode = (code || '').toUpperCase();
      
      if (promoCode === 'WELCOME10') {
        discount = itemsTotal * 0.1;
        appliedPromos.push('WELCOME10');
      } else if (promoCode === 'FREESHIP') {
        shipping = 0;
        appliedPromos.push('FREESHIP');
      } else if (promoCode === 'VIP20') {
        if (itemsTotal >= 50) {
          discount = itemsTotal * 0.2;
          appliedPromos.push('VIP20');
        } else {
          return HttpResponse.json(
            { detail: 'Code VIP20 valable uniquement pour un montant supérieur à 50€' },
            { status: 400 }
          );
        }
      } else if (promoCode && promoCode !== '') {
        return HttpResponse.json({ detail: 'Code promo invalide' }, { status: 400 });
      }

      const taxes = (itemsTotal - discount) * 0.2; // 20% TVA
      const grandTotal = itemsTotal - discount + shipping + taxes;

      return HttpResponse.json(
        {
          itemsTotal: Number(itemsTotal.toFixed(2)),
          discount: Number(discount.toFixed(2)),
          shipping: Number(shipping.toFixed(2)),
          taxes: Number(taxes.toFixed(2)),
          grandTotal: Number(grandTotal.toFixed(2)),
          appliedPromos,
        },
        { status: 200 }
      );
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid request' }, { status: 400 });
    }
  }),

  // Validate Stock: POST /api/cart/validate-stock/
  http.post(`${API}/cart/validate-stock/`, async ({ request }) => {
    try {
      const body = await request.json();
      const { items } = body as any;

      for (const item of items || []) {
        const product = products.find((p) => p.id === item.product_id);
        if (product) {
          const stock = product.stock || 100; // Default stock
          if (item.quantity > stock) {
            return HttpResponse.json(
              {
                valid: false,
                message: `Stock insuffisant pour ${product.name}. Disponible: ${stock}`,
                productId: product.id,
                productName: product.name,
              },
              { status: 400 }
            );
          }
        }
      }

      return HttpResponse.json({ valid: true, message: 'Stock validé' }, { status: 200 });
    } catch (error) {
      return HttpResponse.json({ detail: 'Invalid request' }, { status: 400 });
    }
  }),

  // Admin Stats endpoint
  http.get('/api/admin/stats/', () => {
    return HttpResponse.json(
      {
        totalRevenue: 45789.50,
        totalOrders: 328,
        totalCustomers: 156,
        totalProducts: 20,
        recentOrders: [
          {
            id: 'ORD-2025-001',
            customerName: 'Marie Dupont',
            total: 156.80,
            status: 'livrée',
            date: '2025-12-14T10:30:00Z',
          },
          {
            id: 'ORD-2025-002',
            customerName: 'Jean Martin',
            total: 89.90,
            status: 'expédiée',
            date: '2025-12-14T14:15:00Z',
          },
          {
            id: 'ORD-2025-003',
            customerName: 'Sophie Bernard',
            total: 234.50,
            status: 'en cours',
            date: '2025-12-15T09:00:00Z',
          },
          {
            id: 'ORD-2025-004',
            customerName: 'Pierre Durand',
            total: 45.20,
            status: 'livrée',
            date: '2025-12-15T11:45:00Z',
          },
          {
            id: 'ORD-2025-005',
            customerName: 'Claire Leroy',
            total: 178.30,
            status: 'expédiée',
            date: '2025-12-15T15:20:00Z',
          },
        ],
        topProducts: [
          {
            id: 1,
            name: 'Stylo Bleu',
            sales: 245,
            revenue: 612.50,
          },
          {
            id: 2,
            name: 'Cahier A5',
            sales: 198,
            revenue: 772.20,
          },
          {
            id: 3,
            name: 'Classeur Rouge',
            sales: 156,
            revenue: 702.00,
          },
          {
            id: 7,
            name: 'Marqueurs',
            sales: 142,
            revenue: 852.00,
          },
          {
            id: 10,
            name: 'Bloc Notes',
            sales: 128,
            revenue: 384.00,
          },
        ],
        monthlyRevenue: [
          { month: 'Juillet', revenue: 3450.00 },
          { month: 'Août', revenue: 4120.50 },
          { month: 'Septembre', revenue: 5670.80 },
          { month: 'Octobre', revenue: 6890.20 },
          { month: 'Novembre', revenue: 8320.40 },
          { month: 'Décembre', revenue: 10456.30 },
        ],
      },
      { status: 200 }
    );
  }),
];
