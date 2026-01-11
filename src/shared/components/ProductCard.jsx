import { Link } from 'react-router-dom';
import { useCart } from '../../features/cart/cartSlice';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultVariant = {
      color: product.variants?.colors?.[0] || '',
      size: product.variants?.sizes?.[0] || '',
    };
    addToCart(product, defaultVariant, 1);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="card h-100 shadow-sm">
      <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
        <div className="position-relative">
          <img
            src={product.image}
            className="card-img-top"
            alt={product.name}
            style={{ height: '250px', objectFit: 'cover' }}
          />
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="badge bg-danger position-absolute top-0 end-0 m-2">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </span>
          )}
          {!product.inStock && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <span className="badge bg-secondary">Hết hàng</span>
            </div>
          )}
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title">{product.name}</h6>
          <div className="mb-2">
            <span className="fw-bold text-primary">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-muted text-decoration-line-through ms-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="mb-2">
              <small className="text-warning">
                <i className="fas fa-star"></i> {product.rating}
              </small>
              <small className="text-muted ms-2">({product.reviews} đánh giá)</small>
            </div>
          )}
          <button
            className="btn btn-primary mt-auto"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <i className="fas fa-cart-plus me-2"></i>
            Thêm vào giỏ
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

