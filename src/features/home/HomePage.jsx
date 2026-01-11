import { Link } from 'react-router-dom';
import { products, categories } from '../../shared/utils/mockData';
import ProductCard from '../../shared/components/ProductCard';

const HomePage = () => {
  const featuredProducts = products.filter((p) => p.featured);
  const bestsellerProducts = products.filter((p) => p.bestseller);

  return (
    <div>
      {/* Banner Section */}
      <section className="bg-primary text-white py-5 mb-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">Khám phá bộ sưu tập mới</h1>
              <p className="lead mb-4">
                Cập nhật những xu hướng thời trang mới nhất với giá ưu đãi đặc biệt
              </p>
              <Link to="/products" className="btn btn-light btn-lg me-3">
                <i className="fas fa-shopping-bag me-2"></i>
                Mua ngay
              </Link>
              <Link to="/products" className="btn btn-outline-light btn-lg">
                Xem tất cả sản phẩm
              </Link>
            </div>
            <div className="col-lg-6">
              <img
                src="https://via.placeholder.com/600x400?text=Banner+Main"
                className="img-fluid rounded shadow"
                alt="Banner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">Danh mục nổi bật</h2>
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-6 col-md-4 col-lg-2">
                <Link
                  to={`/products?category=${category.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card text-center h-100 shadow-sm hover-shadow">
                    <div className="card-body">
                      <i className={`fas ${category.icon} fa-3x text-primary mb-3`}></i>
                      <h6 className="card-title">{category.name}</h6>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 bg-white">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Sản phẩm nổi bật</h2>
            <Link to="/products?featured=true" className="btn btn-outline-primary">
              Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
          <div className="row g-4">
            {featuredProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestseller Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Sản phẩm bán chạy</h2>
            <Link to="/products?bestseller=true" className="btn btn-outline-primary">
              Xem tất cả <i className="fas fa-arrow-right ms-2"></i>
            </Link>
          </div>
          <div className="row g-4">
            {bestsellerProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-5 gradient-primary text-white">
        <div className="container text-center">
          <h2 className="fw-bold mb-3">Giảm giá 50% cho đơn hàng đầu tiên</h2>
          <p className="lead mb-4">Áp dụng cho tất cả sản phẩm trong tháng này</p>
          <Link to="/products" className="btn btn-light btn-lg shadow-lg">
            <i className="fas fa-tags me-2"></i>
            Xem ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

