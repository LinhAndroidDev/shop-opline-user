// Cart utility functions

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

export const calculateShipping = (totalPrice, shippingMethod = 'standard') => {
  if (totalPrice >= 500000) return 0;
  const shippingMethods = {
    standard: 50000,
    express: 100000,
  };
  return shippingMethods[shippingMethod] || 50000;
};

export const calculateTotal = (subtotal, shipping) => {
  return subtotal + shipping;
};

