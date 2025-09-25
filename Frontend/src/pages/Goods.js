// Goods.js (corrected)
import React, { useEffect, useState } from 'react';
import './Goods.css';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';
import Navbarr from '../components/common/Navbarr';

// Import your images (make sure these paths are correct)
// import grainsImage from '../assets/icons/grains.webp';
// import fruitsImage from '../assets/icons/fruits.png';
// import vegetablesImage from '../assets/icons/vegetable.png';



const Goods = () => {
  const navigate = useNavigate();
  const { searchTerm, setSearchTerm } = useSearch();
  const { addToCart } = useCart();
  // const [menuOpen, setMenuOpen] = useState(false);

  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  // Fetch products from API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load products');
        setProducts(data.products || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


     // Sort products alphabetically by name
  const sortedProducts = [...products].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  // Filter products based on search term
  const filteredProducts = sortedProducts.filter(product => {
    if (!searchTerm) return true;

    const farmerStr = (product.farmerName || product.farmer?.name || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(term)) ||
      (product.description && product.description.toLowerCase().includes(term)) ||
      farmerStr.includes(term)
    );
  });

  // Clear search when leaving this page (back navigation or route change)
  useEffect(() => {
    return () => setSearchTerm('');
  }, [setSearchTerm]);

  const handleCategoryClick = (category) => {
    navigate(`/${category}`);
    // setMenuOpen(false); // close menu after navigation
  };

  return (
    <div className="goods-page-root">
      <Navbarr />

    {/* Category Buttons in center */}
    <h2 className="goods-subtitle">Select a category to explore</h2>
<div className="category-buttons">
  <button className="category-btn" onClick={() => handleCategoryClick('grains')}>Grains</button>
  <button className="category-btn" onClick={() => handleCategoryClick('vegetables')}>Vegetables</button>
  <button className="category-btn" onClick={() => handleCategoryClick('fruits')}>Fruits</button>
</div>

      

      <div className="goods-container">
        <h1 className="goods-title">Our Organic Products</h1>
        {loading && <div className="no-results"><p>Loading...</p></div>}
        {error && <div className="no-results"><p>{error}</p></div>}
        {/* Product Listing Section */}
        {/* Product Listing Section */}
        <div className="products-section">
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <div key={`${product._id || product.id}-${index}`} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.images?.[0]?.url || product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="farmer">By: {product.farmerName || product.farmer?.name || '—'}</p>
                <p className="price">NRs {product.price}</p>
                <p className="status" style={{color: (product.stock ?? 0) > 0 ? '#2e7d32' : '#c53030'}}>
                  {(product.stock ?? 0) > 0 ? 'In stock' : 'Out of stock'}
                </p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                  disabled={(product.stock ?? 0) <= 0}
                >
                  {(product.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of stock'}
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && searchTerm && (
            <div className="no-results">
              <p>No products found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Goods;
