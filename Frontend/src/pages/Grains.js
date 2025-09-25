import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 
import { useSearch } from '../context/SearchContext';
import './Grains.css';

import Navbarr from '../components/common/Navbarr';

const Grains = () => {
  
  const { addToCart } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate(); 

  const [grainsData, setGrainsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Clear search when leaving this page (back navigation or route change)
  useEffect(() => {
    return () => setSearchTerm('');
  }, [setSearchTerm]); 

  useEffect(() => {
    const fetchGrains = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/category/grains`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load grains');
        setGrainsData(data.products || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGrains();
  }, []);
  
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
  // Sample grains data - replaced by API
   // Sort grains alphabetically by name
  const sortedGrains = [...grainsData].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const filteredGrains = sortedGrains.filter(grain => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const farmerStr = (grain.farmerName || grain.farmer?.name || '').toLowerCase();
    return (
      (grain.name && grain.name.toLowerCase().includes(term)) ||
      (grain.description && grain.description.toLowerCase().includes(term)) ||
      farmerStr.includes(term)
    );
  });

  return (
    <div>
      <Navbarr />
      {/* Category Buttons in center */}
<div className="category-buttons">
  <button className="category-btn" onClick={() => handleCategoryClick('grains')}>Grains</button>
  <button className="category-btn" onClick={() => handleCategoryClick('vegetables')}>Vegetables</button>
  <button className="category-btn" onClick={() => handleCategoryClick('fruits')}>Fruits</button>
</div>
    
    <div className="grains-container">
      <div className="grains-header">
        <h1 className="grains-title">Organic Grains</h1>
        <p className="grains-subtitle">Nutritious grains from trusted farmers</p>
      </div>

      {loading && <div className="no-results"><p>Loading...</p></div>}
      {error && <div className="no-results"><p>{error}</p></div>}
      <div className="grains-grid">
        {filteredGrains.map((grain) => (
          <div key={grain._id || grain.id} className="grain-card">
            <div className="grain-image-container">
              <img 
                src={grain.images?.[0]?.url || grain.image} 
                alt={grain.name}
                className="grain-image"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
            <div className="grain-info">
              <h3 className="grain-name">{grain.name}</h3>
              <p className="grain-description">{grain.description}</p>
              <p className="grain-farmer">By: {grain.farmerName || grain.farmer?.name || '—'}</p>
              <div className="grain-price">NRs {grain.price}</div>
              <div style={{color: (grain.stock ?? 0) > 0 ? '#2e7d32' : '#c53030'}}>
                {(grain.stock ?? 0) > 0 ? 'In stock' : 'Out of stock'}
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(grain)}
                disabled={(grain.stock ?? 0) <= 0}
              >
                {(grain.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredGrains.length === 0 && (
        <div className="no-results">
          <p>No grains found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Grains;