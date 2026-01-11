// Home API - Fetch featured products, categories, etc.
import { products, categories } from '../../shared/utils/mockData';

export const homeApi = {
  getFeaturedProducts: async () => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const featured = products.filter((p) => p.featured);
        resolve(featured);
      }, 100);
    });
  },

  getBestsellerProducts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const bestseller = products.filter((p) => p.bestseller);
        resolve(bestseller);
      }, 100);
    });
  },

  getCategories: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(categories);
      }, 100);
    });
  },
};

