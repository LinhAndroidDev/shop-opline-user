// Product API
import { products } from '../../shared/utils/mockData';

export const productApi = {
  getAll: async (filters = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...products];

        if (filters.search) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(filters.search.toLowerCase())
          );
        }

        if (filters.categoryId) {
          filtered = filtered.filter((p) => p.categoryId === parseInt(filters.categoryId));
        }

        if (filters.featured) {
          filtered = filtered.filter((p) => p.featured);
        }

        if (filters.bestseller) {
          filtered = filtered.filter((p) => p.bestseller);
        }

        resolve(filtered);
      }, 100);
    });
  },

  getById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = products.find((p) => p.id === parseInt(id));
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      }, 100);
    });
  },
};

