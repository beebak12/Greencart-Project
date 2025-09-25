import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 
import { useSearch } from '../context/SearchContext';
import './Fruits.css';

import Navbarr from '../components/common/Navbarr';



const Fruits = () => {
  
  const { addToCart } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate(); 

  const [fruitsData, setFruitsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Clear search when leaving this page (back navigation or route change)
  useEffect(() => {
    return () => setSearchTerm('');
  }, [setSearchTerm]); 
  
  const handleAddToCart = (product) => {
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

 const handleCategoryClick = (category) => {
    // ADD PROPER NAVIGATION
    if (category === 'grains') {
      navigate('/grains');
    } else if (category === 'vegetables') {
      navigate('/vegetables');
    } else if (category === 'fruits') {
      navigate('/fruits'); // This will navigate to fruits page
    }
  };
  useEffect(() => {
    const fetchFruits = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/category/fruits`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load fruits');
        setFruitsData(data.products || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFruits();
  }, []);

  // Sort alphabetically by name
  const sortedFruits = [...fruitsData].sort((a, b) => a.name.localeCompare(b.name));

  const filteredFruits = sortedFruits.filter(fruit => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const farmerStr = (fruit.farmerName || fruit.farmer?.name || '').toLowerCase();
    return (
      (fruit.name && fruit.name.toLowerCase().includes(term)) ||
      (fruit.description && fruit.description.toLowerCase().includes(term)) ||
      farmerStr.includes(term)
    );
  });

  return (
    <div>
      <Navbarr/>

      {/* Category Buttons in center */}
<div className="category-buttons">
  <button className="category-btn" onClick={() => handleCategoryClick('grains')}>Grains</button>
  <button className="category-btn" onClick={() => handleCategoryClick('vegetables')}>Vegetables</button>
  <button className="category-btn" onClick={() => handleCategoryClick('fruits')}>Fruits</button>
</div>
    
    <div className="fruits-container">
      <div className="fruits-header">
        <h1 className="fruits-title">Organic Fruits</h1>
        <p className="fruits-subtitle">Nutritious fruits from trusted farmers</p>
      </div>

      {loading && <div className="no-results"><p>Loading...</p></div>}
      {error && <div className="no-results"><p>{error}</p></div>}
      <div className="fruits-grid">
        {filteredFruits.map((fruit) => (
          <div key={fruit._id || fruit.id} className="fruit-card">
            <div className="fruit-image-container">
              <img 
                src={fruit.images?.[0]?.url || fruit.image} 
                alt={fruit.name}
                className="fruit-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
            <div className="fruit-info">
              <h3 className="fruit-name">{fruit.name}</h3>
              <p className="fruit-description">{fruit.description}</p>
              <p className="fruit-farmer">By: {fruit.farmerName || fruit.farmer?.name || '—'}</p>
              <div className="fruit-price">NRs {fruit.price}</div>
              <div style={{color: (fruit.stock ?? 0) > 0 ? '#2e7d32' : '#c53030'}}>
                {(fruit.stock ?? 0) > 0 ? 'In stock' : 'Out of stock'}
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(fruit)}
                disabled={(fruit.stock ?? 0) <= 0}
              >
                {(fruit.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredFruits.length === 0 && (
        <div className="no-results">
          <p>No fruits found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Fruits;