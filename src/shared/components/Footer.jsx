import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ backgroundColor: 'var(--text-main)', color: 'var(--bg-white)' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5>
              <i className="fas fa-shopping-bag me-2"></i>
              ShopOnline
            </h5>
            <p>Chuyên cung cấp các sản phẩm chất lượng cao với giá cả hợp lý.</p>
              <div className="d-flex gap-3">
              <a href="#" style={{ color: 'var(--bg-white)' }}>
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a href="#" style={{ color: 'var(--bg-white)' }}>
                <i className="fab fa-instagram fa-2x"></i>
              </a>
              <a href="#" style={{ color: 'var(--bg-white)' }}>
                <i className="fab fa-twitter fa-2x"></i>
              </a>
            </div>
          </div>

          <div className="col-md-2 mb-4">
            <h5>Liên kết</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Chính sách</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Chính sách vận chuyển
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" style={{ color: 'var(--bg-white)' }} className="text-decoration-none">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          <div className="col-md-3 mb-4">
            <h5>Liên hệ</h5>
            <ul className="list-unstyled">
              <li>
                <i className="fas fa-phone me-2"></i>
                0123 456 789
              </li>
              <li>
                <i className="fas fa-envelope me-2"></i>
                info@shoponline.com
              </li>
              <li>
                <i className="fas fa-map-marker-alt me-2"></i>
                123 Đường ABC, Quận 1, TP.HCM
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <div className="text-center">
          <p className="mb-0" style={{ color: 'var(--bg-white)' }}>&copy; 2024 ShopOnline. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

