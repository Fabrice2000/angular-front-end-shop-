# My Shop — Angular E-Commerce Application

Repository: https://github.com/Fabrice2000/angular-front-end-shop-.git

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run start

# Run Storybook (component library)
npm run storybook
```

- **App URL**: http://localhost:4200
- **Storybook URL**: http://localhost:6006

## 📋 Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Routes](#routes)
- [State Management](#state-management)
- [Components](#components)
- [API Endpoints](#api-endpoints)
- [User Journey](#user-journey)

## 🏗️ Architecture

### Project Structure

```
src/app/
├── components/          # Reusable UI components + Storybook stories
│   ├── login-form.component.ts
│   ├── product-card.component.ts
│   ├── products-list.component.ts
│   ├── cart-item.stories.ts
│   ├── cart-icon.stories.ts
│   └── toast-container.component.ts
├── services/           # Business logic & API services
│   ├── shop-api.service.ts
│   └── toast.service.ts
├── state/             # NgRx state management
│   ├── auth/          # Authentication state
│   ├── products/      # Products catalog state
│   └── cart/          # Shopping cart state (NEW)
├── shop/              # Shop feature modules
│   ├── cart/          # Cart page & components
│   ├── checkout/      # 3-step checkout flow
│   └── product-details/  # Product detail page
├── interceptors/      # HTTP interceptors
└── mocks/            # MSW mock API handlers
```

### Technology Stack

- **Framework**: Angular 20+ (standalone components)
- **State Management**: NgRx (Store + Effects)
- **Styling**: Tailwind CSS
- **API Mocking**: MSW (Mock Service Worker)
- **Component Library**: Storybook
- **HTTP Client**: Angular HttpClient with interceptors

## ✨ Features

### Core Features

✅ **Product Browsing**
- Grid display with cards showing product images, prices, ratings, and stock
- Filter and sort products by rating, price, date
- Responsive grid layout (1-4 columns based on screen size)

✅ **Shopping Cart**
- Add/remove products with quantity management
- Real-time price calculation
- Cart persistence in localStorage
- Badge showing item count in header
- Automatic 10% discount for orders over 50€

✅ **Product Details**
- Full product information with large images
- Stock availability indicator
- Quantity selector
- Add to cart functionality
- Average rating display

✅ **Checkout Flow (3 Steps)**
1. **Summary**: Review cart items and totals
2. **Address**: Fill shipping information form with validation
3. **Confirmation**: Review and place order with confirmation number

✅ **Authentication**
- Login form with JWT token management
- Token refresh mechanism
- Protected routes with auth interceptor

### Bonus Features

🎁 **Toast Notifications**
- Success/error/info/warning messages
- Auto-dismiss after 3 seconds
- Animated slide-in effect

🎁 **Stock Indicators**
- Real-time stock display on product cards
- Out of stock warning
- Quantity validation against available stock

🎁 **Discount System**
- Automatic 10% discount for orders > 50€
- Visual feedback in cart and checkout

🎁 **Enhanced UX**
- Loading states and animations
- Responsive design (mobile-first)
- Confirmation dialogs for destructive actions
- Form validation with error messages

## 🛣️ Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomeComponent | Landing page |
| `/login` | LoginPageComponent | User authentication |
| `/shop/products` | ProductsPageComponent | Product catalog |
| `/shop/products/:id` | ProductDetailsPageComponent | Product detail view |
| `/cart` | CartPageComponent | Shopping cart |
| `/checkout` | Step1SummaryComponent | Checkout - Order summary |
| `/checkout/address` | Step2AddressComponent | Checkout - Shipping address |
| `/checkout/confirm` | Step3ConfirmComponent | Checkout - Confirmation |
| `/shop/rating` | ProductRatingPageComponent | Product ratings |

## 🗄️ State Management

### NgRx Store Structure

```typescript
{
  auth: {
    accessToken: string | null,
    refreshToken: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  products: {
    items: Product[],
    loading: boolean,
    error: string | null
  },
  cart: {
    items: CartItem[],      // { product: Product, quantity: number }[]
    totalPrice: number,
    count: number,
    discount: number,
    loading: boolean,
    error: string | null
  }
}
```

### Cart Actions

- `addItem({ product, quantity })` - Add product to cart
- `removeItem({ productId })` - Remove product from cart
- `updateQuantity({ productId, quantity })` - Update item quantity
- `clearCart()` - Empty the cart
- `loadCart()` - Load cart from localStorage (on app init)

### Cart Selectors

- `selectCartItems` - Get all cart items
- `selectCartTotal` - Get subtotal
- `selectCartCount` - Get total item count
- `selectCartDiscount` - Get discount amount
- `selectCartFinalTotal` - Get total after discount

## 🧩 Components

### Shop Components

**CartIconComponent** (`app-cart-icon`)
- Displays shopping cart icon with badge
- Shows item count
- Links to cart page

**CartItemComponent** (`app-cart-item`)
- Individual cart item display
- Quantity controls (+/-)
- Remove button
- Stock validation

**CartPageComponent** (`app-cart-page`)
- Full cart view with all items
- Price summary with discounts
- Links to checkout or continue shopping

**ProductDetailsPageComponent**
- Complete product information
- Image gallery
- Add to cart with quantity selector
- Stock and rating display

### Checkout Components

**Step1SummaryComponent**
- Order summary review
- Price breakdown with discounts
- Continue to address button

**Step2AddressComponent**
- Shipping address form (reactive)
- Form validation
- Save to localStorage
- Navigation controls

**Step3ConfirmComponent**
- Final order review
- Address confirmation
- Place order button
- Order confirmation with tracking number

### Shared Components

**ProductCardComponent** (`app-product-card`)
- Product thumbnail
- Price, rating, category
- Stock indicator
- Link to product details

**ProductsListComponent** (`app-products-list`)
- Grid layout for product cards
- Responsive columns

**ToastContainerComponent** (`app-toast-container`)
- Global notification system
- Multiple toast types
- Auto-dismiss functionality

## 🌐 API Endpoints (MSW Mocked)

### Products

```
GET  /api/products/           - List products (with pagination, filtering, sorting)
GET  /api/products/:id/       - Get product details
GET  /api/products/:id/rating/ - Get product rating
```

### Authentication

```
POST /api/auth/token/         - Login (get access & refresh tokens)
POST /api/auth/token/refresh/ - Refresh access token
```

### Cart & Orders

```
POST /api/cart/validate/      - Validate cart and calculate totals
POST /api/order/              - Create new order
```

### Example Requests

**Get Products**
```http
GET /api/products/?page=1&page_size=10&min_rating=3&ordering=-price
```

**Validate Cart**
```http
POST /api/cart/validate/
Content-Type: application/json

{
  "items": [
    { "product_id": 1, "quantity": 2 },
    { "product_id": 5, "quantity": 1 }
  ]
}
```

**Place Order**
```http
POST /api/order/
Content-Type: application/json

{
  "items": [...],
  "shipping_address": {
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean@example.com",
    "phone": "0612345678",
    "address": "123 rue de la Paix",
    "city": "Paris",
    "postalCode": "75001",
    "country": "France"
  },
  "total": 45.50
}
```

## 👤 User Journey

### Complete Shopping Experience

1. **Browse Products** (`/shop/products`)
   - View product catalog
   - Filter by rating/price
   - See stock availability

2. **View Product Details** (`/shop/products/:id`)
   - Check detailed description
   - View ratings
   - Select quantity
   - Add to cart

3. **Manage Cart** (`/cart`)
   - Review selected items
   - Adjust quantities
   - Remove unwanted items
   - See price breakdown with discounts

4. **Checkout Process**
   
   **Step 1: Summary** (`/checkout`)
   - Review order
   - See total and discounts
   
   **Step 2: Address** (`/checkout/address`)
   - Fill shipping information
   - Form validation
   
   **Step 3: Confirm** (`/checkout/confirm`)
   - Final review
   - Place order
   - Get confirmation number

5. **Order Confirmation**
   - Receive order number
   - Estimated delivery date
   - Email confirmation (mocked)

## 🧪 Testing with Storybook

Run Storybook to view and test components in isolation:

```bash
npm run storybook
```

### Available Stories

- `Shop/CartItem` - Cart item component variations
- `Shop/CartIcon` - Cart icon with different item counts
- `Shop/ProductCard` - Product cards with various states
- `Components/LoginForm` - Login form states
- `Components/ProductsList` - Product grid layouts

## 💾 Data Persistence

### LocalStorage Keys

- `cart` - Cart items (auto-sync with NgRx)
- `shippingAddress` - Last used shipping address
- `access_token` - JWT access token
- `refresh_token` - JWT refresh token

### Cart Persistence Flow

1. User adds item → NgRx action dispatched
2. Reducer updates state
3. Effect saves to localStorage
4. On page reload: Effect loads from localStorage

## 🎨 Styling

The application uses **Tailwind CSS** with a custom design system:

- **Colors**: Blue (primary), Green (success), Red (error), Gray (neutral)
- **Typography**: System font stack with responsive sizes
- **Spacing**: 4px base unit (Tailwind's default)
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## 📦 Product Catalog

The mock data includes 20 products across various categories:

- **Écriture** (Writing): Pens, pencils, markers
- **Papeterie** (Stationery): Notebooks, paper
- **Rangement** (Storage): Binders, folders, cases
- **Dessin** (Art): Brushes, paints, colored markers
- **Bureau** (Office): Stamps, erasable markers

Each product includes:
- Name, price, category
- Description (French)
- Stock level
- Ratings (1-5 stars)
- Placeholder image

## 🔐 Security Features

- JWT token authentication
- HTTP interceptor for automatic token injection
- Token refresh mechanism
- Protected routes (ready for auth guards)

## 🚧 Future Enhancements

- User account management
- Order history
- Product reviews
- Wishlist functionality
- Search functionality
- Payment integration
- Email notifications
- Admin dashboard

## 📝 Development Notes

### Running the App

The application uses MSW for API mocking. The mock worker is initialized in `main.ts` when `environment.useMsw` is true.

### State Management

NgRx store is fully configured with:
- Store Devtools (for debugging)
- Effects for async operations
- Selectors for efficient state queries

### Component Architecture

All components use Angular's standalone API (no NgModule). This provides:
- Better tree-shaking
- Simpler mental model
- Easier testing

## 🤝 Contributing

This is a student project created for educational purposes.

## 📄 License

Educational project - No license specified

---

**Created by**: Fabrice Kouadjeu  
**Course**: Angular Front-end Development  
**Exercise**: Building a Full Shopping Experience  
**Date**: November 2025
