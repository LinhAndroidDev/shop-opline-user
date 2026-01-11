import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../features/cart/cartSlice';
import { useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="fas fa-shopping-bag me-2"></i>
          ShopOnline
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/orders">
                Đơn hàng
              </Link>
            </li>
          </ul>

          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-light" type="submit">
              <i className="fas fa-search"></i>
            </button>
          </form>

          <div className="d-flex align-items-center">
            <Link to="/cart" className="btn btn-outline-light me-2 position-relative">
              <i className="fas fa-shopping-cart"></i>
              {getTotalItems() > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            <button className="btn btn-outline-light">
              <i className="fas fa-user me-2"></i>
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

