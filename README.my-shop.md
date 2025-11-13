# My Shop — Angular Front-end

Repository: https://github.com/Fabrice2000/angular-front-end-shop-.git

## Quick Start

- **Start the app**: `npm run start` (uses existing project start script)
- **Run Storybook**: `npm run storybook` (may require Storybook to be initialized)
- **App URL**: http://localhost:4200
- **Navigation**: Go to http://localhost:4200/app for main navigation links

## Architecture

- **State**: NgRx store under `src/app/state/` (auth + products)
- **API**: MSW mock is enabled in `main.ts` when `environment.useMsw` is true; `ShopApiService` calls endpoints under `/api/*`
- **Pages**: `LoginPageComponent` (`/login`), `ProductsPageComponent` (`/shop/products`), `ProductRatingPageComponent` (`/shop/rating`). Use `AppPlaceholderComponent` links to navigate
- **Storybook stories**: `src/app/components/*.stories.ts` — ProductCard, ProductsList, LoginForm

## Features Implemented

✅ **Complete Angular application** with routing and navigation  
✅ **NgRx store architecture** (auth & products slices with actions, reducers, effects)  
✅ **Three main pages**: Login, Products, Rating  
✅ **Presentational components** ready for Storybook  
✅ **Service layer** for API integration with MSW  
✅ **Authentication interceptor** for token management

## Current Status

- **App is running** on http://localhost:4200 with simplified UI (no Material Design yet)
- **NgRx scaffolding** is complete but temporarily disabled for initial setup
- **Storybook** stories created but initialization requires dependency resolution
- **MSW integration** ready for API mocking

## Next Steps

1. **Re-enable NgRx**: Uncomment store providers in `app.config.ts`
2. **Install Angular Material**: `ng add @angular/material`
3. **Initialize Storybook**: Resolve dependency conflicts and run `npx storybook@latest init`
4. **Enable MSW**: Verify mock API endpoints work with real HTTP calls

## Notes

This is a functional minimal scaffold. All core files are in place and the app compiles/runs successfully.
