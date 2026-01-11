import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { products } from '../../shared/utils/mockData';
import { useCart } from '../../features/cart/cartSlice';
import { Modal } from 'antd';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedColor(foundProduct.variants?.colors?.[0] || '');
      setSelectedSize(foundProduct.variants?.sizes?.[0] || '');
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container my-5 text-center">
        <h3>Sản phẩm không tồn tại</h3>
        <Link to="/products" className="btn btn-primary mt-3">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      Modal.warning({
        title: 'Chọn biến thể',
        content: 'Vui lòng chọn màu sắc và kích thước trước khi thêm vào giỏ hàng.',
      });
      return;
    }
    addToCart(product, { color: selectedColor, size: selectedSize }, quantity);
    setModalVisible(true);
  };

  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      Modal.warning({
        title: 'Chọn biến thể',
        content: 'Vui lòng chọn màu sắc và kích thước trước khi mua hàng.',
      });
      return;
    }
    addToCart(product, { color: selectedColor, size: selectedSize }, quantity);
    navigate('/cart');
  };

  const images = product.images || [product.image];

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/products">Sản phẩm</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Image Gallery */}
        <div className="col-md-6 mb-4">
          <div className="mb-3">
            <img
              src={images[selectedImage]}
              className="img-fluid rounded shadow"
              alt={product.name}
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
            />
          </div>
          {images.length > 1 && (
            <div className="d-flex gap-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  className={`img-thumbnail cursor-pointer ${
                    selectedImage === index ? 'border-primary' : ''
                  }`}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() => setSelectedImage(index)}
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-md-6">
          <h1 className="mb-3">{product.name}</h1>

          {/* Price */}
          <div className="mb-3">
            <h3 className="text-primary fw-bold mb-2">{formatPrice(product.price)}</h3>
            {product.originalPrice && product.originalPrice > product.price && (
              <div>
                <span className="text-muted text-decoration-line-through me-2">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="badge bg-danger">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </div>
            )}
          </div>

          {/* Rating */}
          {product.rating && (
            <div className="mb-3">
              <span className="text-warning">
                <i className="fas fa-star"></i> {product.rating}
              </span>
              <span className="text-muted ms-2">({product.reviews} đánh giá)</span>
            </div>
          )}

          {/* Stock Status */}
          <div className="mb-4">
            {product.inStock ? (
              <span className="badge bg-success">
                <i className="fas fa-check me-1"></i>Còn hàng
              </span>
            ) : (
              <span className="badge bg-danger">
                <i className="fas fa-times me-1"></i>Hết hàng
              </span>
            )}
          </div>

          <hr />

          {/* Color Selection */}
          {product.variants?.colors && product.variants.colors.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Màu sắc: {selectedColor}</h6>
              <div className="d-flex gap-2 flex-wrap">
                {product.variants.colors.map((color) => (
                  <button
                    key={color}
                    className={`btn ${
                      selectedColor === color ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.variants?.sizes && product.variants.sizes.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold mb-3">Kích thước: {selectedSize}</h6>
              <div className="d-flex gap-2 flex-wrap">
                {product.variants.sizes.map((size) => (
                  <button
                    key={size}
                    className={`btn ${
                      selectedSize === size ? 'btn-primary' : 'btn-outline-primary'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-4">
            <h6 className="fw-bold mb-3">Số lượng</h6>
            <div className="d-flex align-items-center gap-3">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <i className="fas fa-minus"></i>
              </button>
              <input
                type="number"
                className="form-control text-center"
                style={{ width: '100px' }}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, value));
                }}
                min="1"
              />
              <button
                className="btn btn-outline-secondary"
                onClick={() => setQuantity(quantity + 1)}
              >
                <i className="fas fa-plus"></i>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3 mb-4">
            <button
              className="btn btn-primary btn-lg flex-fill"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <i className="fas fa-cart-plus me-2"></i>
              Thêm vào giỏ
            </button>
            <button
              className="btn btn-success btn-lg flex-fill"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              <i className="fas fa-bolt me-2"></i>
              Mua ngay
            </button>
          </div>

          {/* Shipping Info */}
          <div className="card" style={{ backgroundColor: 'var(--primary-light)' }}>
            <div className="card-body">
              <h6 className="fw-bold mb-2">
                <i className="fas fa-truck me-2 text-primary"></i>Thông tin vận chuyển
              </h6>
              <ul className="mb-0 small">
                <li>Miễn phí vận chuyển cho đơn hàng trên 500.000đ</li>
                <li>Giao hàng trong 2-5 ngày làm việc</li>
                <li>Đổi trả miễn phí trong 30 ngày</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-info-circle me-2"></i>Mô tả chi tiết
              </h5>
            </div>
            <div className="card-body">
              <p className="mb-0">{product.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal
        title="Thêm vào giỏ hàng thành công"
        open={modalVisible}
        onOk={() => {
          setModalVisible(false);
          navigate('/cart');
        }}
        onCancel={() => setModalVisible(false)}
        okText="Xem giỏ hàng"
        cancelText="Tiếp tục mua sắm"
      >
        <p>Sản phẩm đã được thêm vào giỏ hàng của bạn.</p>
      </Modal>
    </div>
  );
};

export default ProductDetail;

