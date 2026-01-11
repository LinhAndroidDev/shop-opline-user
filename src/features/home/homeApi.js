// Home API - Fetch featured products, categories, etc.
import { products } from '../../shared/utils/mockData';
import { apiClient } from '../../shared/utils/apiClient';

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
    try {
      const categories = await apiClient.get('/category');
      
      // Transform API response to match component expectations
      // Map API categories to include icon for display
      const categoryIcons = {
        'Quần áo': 'fa-tshirt',
        'Đồ uống': 'fa-coffee',
        'Điện thoại': 'fa-mobile-alt',
        'Đồ ăn vặt': 'fa-cookie',
        'Giày': 'fa-shoe-prints',
      };

      return categories.map((category) => ({
        id: category.id,
        name: category.name,
        parentId: category.parentId,
        icon: categoryIcons[category.name] || 'fa-tag', // Default icon
      }));
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Return empty array or fallback to mock data if API fails
      return [];
    }
  },
};

