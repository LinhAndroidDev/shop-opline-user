import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../shared/components/ProductCard';
import { Table } from 'antd';
import { homeApi } from '../home/homeApi';
import { productApi } from './productApi';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setCategoriesLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          homeApi.getCategories(),
          productApi.getAll({
            categoryId: searchParams.get('category'),
            search: searchParams.get('search'),
          }),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Extract unique colors and sizes from products
  const allColors = useMemo(() => {
    const colors = new Set();
    products.forEach((product) => {
      product.variants?.colors?.forEach((color) => colors.add(color));
    });
    return Array.from(colors);
  }, []);

  const allSizes = useMemo(() => {
    const sizes = new Set();
    products.forEach((product) => {
      product.variants?.sizes?.forEach((size) => sizes.add(size));
    });
    return Array.from(sizes);
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    if (products.length === 0) return;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      const categoryId = parseInt(selectedCategory);
      filtered = filtered.filter((product) => product.categoryId === categoryId);
    }

    // Color filter
    if (selectedColor !== 'all') {
      filtered = filtered.filter((product) =>
        product.variants?.colors?.includes(selectedColor)
      );
    }

    // Size filter
    if (selectedSize !== 'all') {
      filtered = filtered.filter((product) =>
        product.variants?.sizes?.includes(selectedSize)
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Featured/Bestseller filter
    if (searchParams.get('featured') === 'true') {
      filtered = filtered.filter((product) => product.featured);
    }
    if (searchParams.get('bestseller') === 'true') {
      filtered = filtered.filter((product) => product.bestseller);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // newest (keep original order)
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, selectedColor, selectedSize, priceRange, sortBy, searchQuery, searchParams]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  return (
    <div className="container my-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Sản phẩm
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <i className="fas fa-filter me-2"></i>Bộ lọc
              </h5>
            </div>
            <div className="card-body">
              {/* Category Filter */}
              <div className="mb-4">
                <h6 className="fw-bold">Danh mục</h6>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={categoriesLoading}
                >
                  <option value="all">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categoriesLoading && (
                  <small className="text-muted">Đang tải danh mục...</small>
                )}
              </div>

              {/* Price Filter */}
              <div className="mb-4">
                <h6 className="fw-bold">Giá</h6>
                <div className="mb-2">
                  <label className="form-label">Từ: {formatPrice(priceRange[0])}</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="5000000"
                    step="100000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  />
                </div>
                <div>
                  <label className="form-label">Đến: {formatPrice(priceRange[1])}</label>
                  <input
                    type="range"
                    className="form-range"
                    min="0"
                    max="5000000"
                    step="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  />
                </div>
              </div>

              {/* Color Filter */}
              <div className="mb-4">
                <h6 className="fw-bold">Màu sắc</h6>
                <select
                  className="form-select"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {allColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              {/* Size Filter */}
              <div className="mb-4">
                <h6 className="fw-bold">Kích thước</h6>
                <select
                  className="form-select"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  {allSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedColor('all');
                  setSelectedSize('all');
                  setPriceRange([0, 5000000]);
                }}
              >
                <i className="fas fa-redo me-2"></i>Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-md-9">
          {/* Sort and Search */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Danh sách sản phẩm</h2>
            <div className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '200px' }}
              />
              <select
                className="form-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ width: '180px' }}
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: Tăng dần</option>
                <option value="price-desc">Giá: Giảm dần</option>
                <option value="name-asc">Tên: A-Z</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-muted mb-4">
            Tìm thấy {filteredProducts.length} sản phẩm
          </p>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-search fa-3x text-muted mb-3"></i>
              <h5>Không tìm thấy sản phẩm nào</h5>
              <p className="text-muted">Vui lòng thử lại với bộ lọc khác</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListing;

