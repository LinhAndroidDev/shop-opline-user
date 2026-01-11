import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './cartSlice';
import { Table } from 'antd';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const columns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, item) => (
        <div className="d-flex align-items-center">
          <img
            src={item.image}
            alt={item.name}
            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }}
            className="rounded"
          />
          <div>
            <Link to={`/products/${item.id}`} className="text-decoration-none fw-bold">
              {item.name}
            </Link>
            <div className="text-muted small">
              {item.variant.color && <span>Màu: {item.variant.color}</span>}
              {item.variant.size && (
                <span className="ms-2">Size: {item.variant.size}</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatPrice(price),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (_, item) => (
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
          >
            <i className="fas fa-minus"></i>
          </button>
          <span className="fw-bold" style={{ minWidth: '40px', textAlign: 'center' }}>
            {item.quantity}
          </span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, item) => formatPrice(item.price * item.quantity),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, item) => (
        <button
          className="btn btn-sm btn-danger"
          onClick={() => removeFromCart(item.id, item.variant)}
        >
          <i className="fas fa-trash"></i>
        </button>
      ),
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <i className="fas fa-shopping-cart fa-4x text-muted mb-4"></i>
          <h3>Giỏ hàng của bạn đang trống</h3>
          <p className="text-muted mb-4">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
          <Link to="/products" className="btn btn-primary btn-lg">
            <i className="fas fa-shopping-bag me-2"></i>
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <i className="fas fa-shopping-cart me-2"></i>Giỏ hàng
      </h2>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <Table
                dataSource={cartItems}
                columns={columns}
                rowKey={(item) => `${item.id}-${item.variant.color}-${item.variant.size}`}
                pagination={false}
              />
              <div className="mt-3">
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  <i className="fas fa-trash me-2"></i>Xóa tất cả
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-calculator me-2"></i>Tổng thanh toán
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <span>Tạm tính:</span>
                <span className="fw-bold">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span>Phí vận chuyển:</span>
                <span>
                  {getTotalPrice() >= 500000 ? (
                    <span className="text-success">Miễn phí</span>
                  ) : (
                    <span>50.000đ</span>
                  )}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Tổng cộng:</span>
                <span className="fw-bold text-primary fs-5">
                  {formatPrice(getTotalPrice() >= 500000 ? getTotalPrice() : getTotalPrice() + 50000)}
                </span>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate('/checkout')}
                >
                  <i className="fas fa-credit-card me-2"></i>Tiếp tục đặt hàng
                </button>
                <Link to="/products" className="btn btn-outline-primary">
                  <i className="fas fa-arrow-left me-2"></i>Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

