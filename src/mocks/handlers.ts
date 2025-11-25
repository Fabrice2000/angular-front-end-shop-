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
];
