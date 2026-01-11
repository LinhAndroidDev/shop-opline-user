import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../features/home/HomePage';
import ProductListPage from '../features/product/ProductListPage';
import ProductDetailPage from '../features/product/ProductDetailPage';
import CartPage from '../features/cart/CartPage';
import CheckoutPage from '../features/checkout/CheckoutPage';
import PaymentPage from '../features/checkout/PaymentPage';
import OrderTrackingPage from '../features/order/OrderTrackingPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import Header from '../shared/components/Header';
import Footer from '../shared/components/Footer';

export const AppRouter = () => {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/orders" element={<OrderTrackingPage />} />
            <Route path="/orders/:id" element={<OrderTrackingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="*"
              element={
                <div className="container my-5 text-center">
                  <h2>404 - Trang không tồn tại</h2>
                  <p className="text-muted">Trang bạn đang tìm kiếm không tồn tại.</p>
                  <a href="/" className="btn btn-primary">
                    Về trang chủ
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

