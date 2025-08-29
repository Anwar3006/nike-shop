export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },

  // Products
  PRODUCTS: {
    LIST: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
    SEARCH: "/products/search",
  },

  // Collections
  COLLECTIONS: {
    LIST: "/collections",
    MEN: "/collections/men",
    WOMEN: "/collections/women",
    KIDS: "/collections/kids",
  },

  // User
  USER: {
    PROFILE: "/users/profile",
    ORDERS: "/users/orders",
    WISHLIST: "/users/wishlist",
  },
} as const;
