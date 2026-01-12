// Product API
import { apiClient } from '../../shared/utils/apiClient';

// Transform API product to app format
const transformProduct = (apiProduct) => {
  const product = {
    id: apiProduct.id,
    name: apiProduct.name,
    price: apiProduct.price,
    description: apiProduct.description,
    image: apiProduct.thumbnail || (apiProduct.images && apiProduct.images[0]) || '',
    images: apiProduct.images || [],
    category: apiProduct.category?.name || '',
    categoryId: apiProduct.category?.id || null,
    status: apiProduct.status,
    inStock: apiProduct.status === 'ACTIVE',
    // Calculate original price if discount exists
    originalPrice: apiProduct.discount
      ? Math.round(apiProduct.price / (1 - apiProduct.discount / 100))
      : null,
    // Transform variant - keep color objects with hexCode and name
    variants: apiProduct.variant
      ? {
          colors: apiProduct.variant.color || [],
          sizes: apiProduct.variant.size || [],
        }
      : {
          colors: [],
          sizes: [],
        },
    // For backward compatibility
    featured: false,
    bestseller: false,
    rating: null,
    reviews: 0,
  };

  return product;
};

export const productApi = {
  getAll: async (filters = {}) => {
    try {
      const products = await apiClient.get('/product');

      // Transform products
      let transformed = products.map(transformProduct);

      // Apply filters
      if (filters.search) {
        transformed = transformed.filter((p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.categoryId) {
        transformed = transformed.filter((p) => p.categoryId === parseInt(filters.categoryId));
      }

      if (filters.status) {
        transformed = transformed.filter((p) => p.status === filters.status);
      }

      // Filter by status ACTIVE by default
      transformed = transformed.filter((p) => p.status === 'ACTIVE');

      return transformed;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const products = await apiClient.get('/product');
      const product = products.find((p) => p.id === parseInt(id));
      
      if (product) {
        return transformProduct(product);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },
};

