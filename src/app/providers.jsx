import { CartProvider } from '../features/cart/cartSlice';
import { OrderProvider } from '../features/order/orderSlice';
import { ConfigProvider } from 'antd';

export const AppProviders = ({ children }) => {
  return (
    <ConfigProvider>
      <CartProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </CartProvider>
    </ConfigProvider>
  );
};

