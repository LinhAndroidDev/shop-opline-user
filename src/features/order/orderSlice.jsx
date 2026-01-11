import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockOrders, orderStatuses } from '../../shared/utils/mockData';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      ...orderData,
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId) => {
    return orders.find((order) => order.id === orderId);
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const value = {
    orders,
    createOrder,
    getOrderById,
    updateOrderStatus,
    orderStatuses,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

