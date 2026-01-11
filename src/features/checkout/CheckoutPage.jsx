import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../cart/cartSlice';
import { TextField, Button, Box, Paper, Typography } from '@mui/material';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    shippingMethod: 'standard',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const shippingMethods = {
    standard: { name: 'Giao hàng tiêu chuẩn', price: 50000, days: '2-5 ngày' },
    express: { name: 'Giao hàng nhanh', price: 100000, days: '1-2 ngày' },
  };

  const shippingPrice =
    getTotalPrice() >= 500000 ? 0 : shippingMethods[formData.shippingMethod].price;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^[0-9]{10,11}$/.test(formData.phone))
      newErrors.phone = 'Số điện thoại không hợp lệ';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Email không hợp lệ';
    if (!formData.address.trim()) newErrors.address = 'Vui lòng nhập địa chỉ';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/payment', {
        state: {
          orderData: {
            ...formData,
            items: cartItems,
            subtotal: getTotalPrice(),
            shipping: shippingPrice,
            total: getTotalPrice() + shippingPrice,
          },
        },
      });
    }, 1000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="text-center py-5">
          <h3>Giỏ hàng của bạn đang trống</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate('/products')}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">
        <i className="fas fa-shopping-cart me-2"></i>Đặt hàng
      </h2>

      <div className="row">
        <div className="col-lg-8 mb-4">
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom className="mb-4">
              <i className="fas fa-user me-2"></i>Thông tin giao hàng
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Họ tên *"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                error={!!errors.fullName}
                helperText={errors.fullName}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Số điện thoại *"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Địa chỉ giao hàng *"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                margin="normal"
                required
              />

              <div className="mb-3 mt-3">
                <label className="form-label fw-bold">Phương thức giao hàng *</label>
                {Object.entries(shippingMethods).map(([key, method]) => (
                  <div key={key} className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="shippingMethod"
                      id={`shipping-${key}`}
                      value={key}
                      checked={formData.shippingMethod === key}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor={`shipping-${key}`}>
                      {method.name} - {formatPrice(method.price)} ({method.days})
                    </label>
                  </div>
                ))}
              </div>

              <TextField
                fullWidth
                label="Ghi chú"
                name="notes"
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={loading}
                  sx={{ py: 1.5 }}
                >
                  {loading ? 'Đang xử lý...' : 'Tiếp tục thanh toán'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </div>

        <div className="col-lg-4">
          <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: '100px' }}>
            <Typography variant="h6" gutterBottom>
              <i className="fas fa-receipt me-2"></i>Tóm tắt đơn hàng
            </Typography>
            <hr />

            <div className="mb-3">
              <strong>Sản phẩm ({cartItems.length})</strong>
              <div className="mt-2" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cartItems.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2 small">
                    <div>
                      <div className="fw-bold">{item.name}</div>
                      <div className="text-muted">
                        {item.variant.color && `Màu: ${item.variant.color}`}
                        {item.variant.size && ` | Size: ${item.variant.size}`}
                        {' x '}
                        {item.quantity}
                      </div>
                    </div>
                    <div className="text-end">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-2">
              <span>Tạm tính:</span>
              <span>{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span>Phí vận chuyển:</span>
              <span>
                {shippingPrice === 0 ? (
                  <span className="text-success">Miễn phí</span>
                ) : (
                  formatPrice(shippingPrice)
                )}
              </span>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <strong>Tổng cộng:</strong>
              <strong className="text-primary fs-5">
                {formatPrice(getTotalPrice() + shippingPrice)}
              </strong>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

