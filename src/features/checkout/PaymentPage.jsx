import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOrder } from '../order/orderSlice';
import { useCart } from '../cart/cartSlice';
import { Modal } from 'antd';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createOrder } = useOrder();
  const { clearCart } = useCart();
  const orderData = location.state?.orderData;
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  if (!orderData) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <h3>Không có thông tin đơn hàng</h3>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/')}>
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng (COD)',
      icon: 'fa-money-bill-wave',
      description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    },
    {
      id: 'wallet',
      name: 'Ví điện tử',
      icon: 'fa-wallet',
      description: 'Thanh toán qua ví điện tử (MoMo, ZaloPay, VNPay)',
    },
    {
      id: 'bank',
      name: 'Chuyển khoản ngân hàng',
      icon: 'fa-university',
      description: 'Chuyển khoản qua ngân hàng',
    },
  ];

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      const order = createOrder({
        ...orderData,
        paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'processing',
      });
      
      clearCart();
      
      Modal.success({
        title: 'Thanh toán thành công!',
        content: `Đơn hàng của bạn đã được tạo với mã: ${order.id}`,
        onOk: () => {
          navigate(`/orders/${order.id}`);
        },
      });
    }, 1500);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <i className="fas fa-credit-card me-2"></i>Thanh toán
      </h2>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-credit-card me-2"></i>Chọn phương thức thanh toán
              </h5>
            </div>
            <div className="card-body">
              {paymentMethods.map((method) => (
                <div key={method.id} className="mb-3">
                  <div className="form-check p-3 border rounded cursor-pointer">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id={`payment-${method.id}`}
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label
                      className="form-check-label cursor-pointer w-100"
                      htmlFor={`payment-${method.id}`}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`fas ${method.icon} fa-2x text-primary me-3`}></i>
                        <div>
                          <h6 className="mb-1 fw-bold">{method.name}</h6>
                          <small className="text-muted">{method.description}</small>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '100px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-receipt me-2"></i>Tổng thanh toán
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Tạm tính:</span>
                <span>{formatPrice(orderData.subtotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Phí vận chuyển:</span>
                <span>
                  {orderData.shipping === 0 ? (
                    <span className="text-success">Miễn phí</span>
                  ) : (
                    formatPrice(orderData.shipping)
                  )}
                </span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <strong>Tổng cộng:</strong>
                <strong className="text-primary fs-5">
                  {formatPrice(orderData.total)}
                </strong>
              </div>

              <div className="mb-3">
                <h6 className="fw-bold">Thông tin giao hàng:</h6>
                <div className="small">
                  <div className="mb-1">
                    <strong>Người nhận:</strong> {orderData.fullName}
                  </div>
                  <div className="mb-1">
                    <strong>SĐT:</strong> {orderData.phone}
                  </div>
                  <div className="mb-1">
                    <strong>Địa chỉ:</strong> {orderData.address}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-lg w-100"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Xác nhận thanh toán
                  </>
                )}
              </button>

              <button
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={() => navigate('/checkout')}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Quay lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

