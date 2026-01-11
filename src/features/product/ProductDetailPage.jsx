import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/cartSlice';
import { Modal } from 'antd';
import { productApi } from './productApi';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await productApi.getById(id);
        setProduct(productData);
        setSelectedColor(productData.variants?.colors?.[0] || '');
        setSelectedSize(productData.variants?.sizes?.[0] || '');
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

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
    // Check if product has variants
    const hasVariants = product.variants && 
      (product.variants.colors?.length > 0 || product.variants.sizes?.length > 0);
    
    if (hasVariants) {
      // If has variants, require selection
      if (product.variants.colors?.length > 0 && !selectedColor) {
        Modal.warning({
          title: 'Chọn biến thể',
          content: 'Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng.',
        });
        return;
      }
      if (product.variants.sizes?.length > 0 && !selectedSize) {
        Modal.warning({
          title: 'Chọn biến thể',
          content: 'Vui lòng chọn kích thước trước khi thêm vào giỏ hàng.',
        });
        return;
      }
    }
    
    addToCart(product, { 
      color: selectedColor || '', 
      size: selectedSize || '' 
    }, quantity);
    setModalVisible(true);
  };

  const handleBuyNow = () => {
    // Check if product has variants
    const hasVariants = product.variants && 
      (product.variants.colors?.length > 0 || product.variants.sizes?.length > 0);
    
    if (hasVariants) {
      // If has variants, require selection
      if (product.variants.colors?.length > 0 && !selectedColor) {
        Modal.warning({
          title: 'Chọn biến thể',
          content: 'Vui lòng chọn màu sắc trước khi mua hàng.',
        });
        return;
      }
      if (product.variants.sizes?.length > 0 && !selectedSize) {
        Modal.warning({
          title: 'Chọn biến thể',
          content: 'Vui lòng chọn kích thước trước khi mua hàng.',
        });
        return;
      }
    }
    
    addToCart(product, { 
      color: selectedColor || '', 
      size: selectedSize || '' 
    }, quantity);
    navigate('/cart');
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = images.length > 1;

  // Calculate delivery date (2-5 days from now)
  const getDeliveryDate = () => {
    const today = new Date();
    const minDays = 2;
    const maxDays = 5;
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + minDays);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + maxDays);
    
    const formatDate = (date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day} Th${month.toString().padStart(2, '0')}`;
    };
    
    return `${formatDate(minDate)} - ${formatDate(maxDate)}`;
  };

  return (
    <div className="bg-main">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb mb-0" style={{ fontSize: '0.875rem' }}>
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">Trang chủ</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/products" className="text-decoration-none text-muted">Sản phẩm</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="bg-white rounded shadow-sm p-4 mb-4">
          <div className="row g-4">
            {/* Left: Product Images */}
            <div className="col-lg-5">
              {/* Main Image */}
              <div className="mb-3" style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
                <img
                  src={images[selectedImage] || product.image}
                  className="img-fluid w-100"
                  alt={product.name}
                  style={{ 
                    aspectRatio: '1 / 1',
                    objectFit: 'contain',
                    backgroundColor: '#fafafa'
                  }}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
                  }}
                />
              </div>

              {/* Thumbnail Carousel */}
              {hasMultipleImages && (
                <div className="position-relative">
                  <div className="d-flex gap-2 overflow-auto" style={{ padding: '5px 0' }}>
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(index)}
                        onMouseEnter={() => setSelectedImage(index)}
                        style={{
                          minWidth: '70px',
                          width: '70px',
                          height: '70px',
                          border: selectedImage === index ? '2px solid var(--primary)' : '1px solid #e5e7eb',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          backgroundColor: '#fff',
                          flexShrink: 0,
                          transition: 'border-color 0.2s ease',
                        }}
                      >
                        <img
                          src={img}
                          className="w-100 h-100"
                          alt={`${product.name} ${index + 1}`}
                          style={{ objectFit: 'contain', padding: '5px' }}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/70x70?text=No+Image';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-3 pt-3 border-top d-flex align-items-center gap-3">
                <span className="text-muted small">Chia sẻ:</span>
                <div className="d-flex gap-2">
                  <a href="#" className="text-decoration-none">
                    <i className="fab fa-facebook text-primary" style={{ fontSize: '1.25rem' }}></i>
                  </a>
                  <a href="#" className="text-decoration-none">
                    <i className="fab fa-pinterest text-danger" style={{ fontSize: '1.25rem' }}></i>
                  </a>
                  <a href="#" className="text-decoration-none">
                    <i className="fab fa-twitter text-info" style={{ fontSize: '1.25rem' }}></i>
                  </a>
                </div>
                <div className="ms-auto d-flex align-items-center gap-2 text-muted small cursor-pointer">
                  <i className="far fa-heart"></i>
                  <span>Đã thích (0)</span>
                </div>
              </div>
            </div>

            {/* Right: Product Info */}
            <div className="col-lg-7">
              {/* Product Title */}
              <h1 className="mb-2" style={{ fontSize: '1.25rem', fontWeight: 400, lineHeight: '1.5', color: '#111827' }}>
                {product.name}
              </h1>

              {/* Rating */}
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="d-flex align-items-center gap-1">
                  <span className="text-warning">
                    <i className="fas fa-star"></i>
                  </span>
                  <span className="fw-bold" style={{ fontSize: '0.95rem' }}>4.9</span>
                </div>
                <div className="border-start ps-3" style={{ height: '20px' }}></div>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>22 Đánh giá</span>
                <div className="border-start ps-3" style={{ height: '20px' }}></div>
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Đã bán 100+</span>
              </div>

              {/* Price */}
              <div className="bg-light rounded p-3 mb-3">
                <div className="d-flex align-items-baseline gap-2">
                  <span className="text-danger fw-bold" style={{ fontSize: '1.75rem' }}>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-muted text-decoration-line-through" style={{ fontSize: '1rem' }}>
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="badge bg-danger" style={{ fontSize: '0.75rem' }}>
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
                {product.discount && (
                  <div className="mt-1 small text-muted">
                    Giảm {product.discount}% (Tiết kiệm {formatPrice(product.originalPrice - product.price)})
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-start gap-2 mb-2">
                  <i className="fas fa-truck text-primary mt-1" style={{ fontSize: '1.1rem' }}></i>
                  <div className="flex-grow-1">
                    <div className="fw-bold small mb-1">Vận Chuyển</div>
                    <div className="small">
                      Nhận từ <strong>{getDeliveryDate()}</strong>, phí giao 
                      {product.price >= 500000 ? (
                        <span className="text-success"> 0₫</span>
                      ) : (
                        <span> 50.000₫</span>
                      )}
                    </div>
                    <div className="small text-success mt-1">
                      <i className="fas fa-gift me-1"></i>
                      Tặng Voucher 15.000₫ nếu đơn giao sau thời gian trên.
                    </div>
                  </div>
                </div>
              </div>

              {/* Shopee Assurance / Guarantee */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-start gap-2">
                  <i className="fas fa-shield-alt text-success mt-1" style={{ fontSize: '1.1rem' }}></i>
                  <div className="flex-grow-1">
                    <div className="fw-bold small mb-1">An Tâm Mua Sắm</div>
                    <div className="small text-muted">
                      Trả hàng miễn phí 15 ngày. Bảo hiểm bảo vệ người tiêu dùng
                    </div>
                  </div>
                  <i className="fas fa-chevron-down text-muted small"></i>
                </div>
              </div>

              {/* Stock Status */}
              <div className="mb-3 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <span className="small text-muted">Tình trạng:</span>
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
              </div>

              {/* Size Selection (if exists) */}
              {product.variants?.sizes && product.variants.sizes.length > 0 && (
                <div className="mb-3">
                  <div className="mb-2" style={{ fontSize: '0.95rem' }}>
                    Số Lượng{selectedSize && <span className="text-muted ms-2">({selectedSize})</span>}
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        className={`btn ${
                          selectedSize === size ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setSelectedSize(size)}
                        style={{ 
                          minWidth: '80px',
                          border: selectedSize === size ? '2px solid var(--primary)' : '1px solid #e5e7eb'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color/Type Selection (if exists) */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div className="mb-3">
                  <div className="mb-2" style={{ fontSize: '0.95rem' }}>
                    Phân Loại{selectedColor && <span className="text-muted ms-2">({selectedColor})</span>}
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    {product.variants.colors.map((color) => (
                      <button
                        key={color}
                        className={`btn ${
                          selectedColor === color ? 'btn-primary' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setSelectedColor(color)}
                        style={{ 
                          minWidth: '120px',
                          border: selectedColor === color ? '2px solid var(--primary)' : '1px solid #e5e7eb'
                        }}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-4">
                <div className="mb-2" style={{ fontSize: '0.95rem' }}>Số Lượng</div>
                <div className="d-flex align-items-center gap-2" style={{ width: 'fit-content' }}>
                  <button
                    className="btn btn-outline-secondary"
                    style={{ width: '40px', height: '40px', padding: 0 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    style={{ width: '80px', height: '40px' }}
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setQuantity(Math.max(1, value));
                    }}
                    min="1"
                  />
                  <button
                    className="btn btn-outline-secondary"
                    style={{ width: '40px', height: '40px', padding: 0 }}
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3">
                <button
                  className="btn flex-fill"
                  style={{ 
                    backgroundColor: '#fff',
                    border: '1px solid var(--primary)',
                    color: 'var(--primary)',
                    height: '48px',
                    fontSize: '1rem'
                  }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  Thêm Vào Giỏ Hàng
                </button>
                <button
                  className="btn btn-primary flex-fill"
                  style={{ 
                    height: '48px',
                    fontSize: '1rem',
                    fontWeight: 500
                  }}
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                >
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        <div className="bg-white rounded shadow-sm p-4">
          <div className="mb-3 pb-2 border-bottom">
            <h5 className="mb-0" style={{ fontSize: '1.125rem', fontWeight: 500 }}>
              <i className="fas fa-info-circle me-2 text-primary"></i>Mô Tả Sản Phẩm
            </h5>
          </div>
          <div 
            className="mt-3"
            style={{ 
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              lineHeight: '1.8',
              fontSize: '0.95rem',
              color: '#374151'
            }}
          >
            {product.description || 'Không có mô tả cho sản phẩm này.'}
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
