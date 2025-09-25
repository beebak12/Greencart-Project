import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom'; 
import Navbarr from '../components/common/Navbarr';
import { useSearch } from '../context/SearchContext';
import './Vegetables.css';
import Cauli from '../assets/images/cauli.jpg';
import Cabbage from '../assets/images/cabbage.avif';
import Potato from '../assets/images/aalu.webp';
import Radish  from '../assets/images/radish.avif';
import Carrot from '../assets/images/carrot.jpg';
import Capsicum from '../assets/images/capsicum.png';
import Mushroom from '../assets/images/mushroom.jpeg';
import Brinjal from '../assets/images/brinjal.webp';
import Ladyfinger from '../assets/images/ladyfinger.webp';
import Bittergourd from '../assets/images/bittergourd.jpg';
import Broccoli from '../assets/images/Brocoli.jpg';
import Pumpkin from '../assets/images/pumpkin.jpg';
import Onion from '../assets/images/onion.jpeg';
import Garlic from '../assets/images/garlic.jpg';
import Greenpeas from '../assets/images/greenpea.jpg';
import Ginger from '../assets/images/ginger.jpg';
import Chilli from '../assets/images/chilly.webp';




const Vegetables = () => {
  
  console.log('Vegetables component loaded!');
  const { addToCart } = useCart();
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate(); 

  const [vegData, setVegData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Clear search when leaving this page (back navigation or route change)
  useEffect(() => {
    return () => setSearchTerm('');
  }, [setSearchTerm]);

  useEffect(() => {
    const fetchVeg = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/products/category/vegetables`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load vegetables');
        setVegData(data.products || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVeg();
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
  
  // Sample Vegetables data - you can replace with real data
  // Static list removed; using API
  // (If you want to use static data, assign it to a variable like const sampleVegetables = [ ... ];)


  // Sort grains alphabetically by name
  const sortedVegetables = [...vegData].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const filteredVegetables = sortedVegetables.filter(veg => {
    if (!searchTerm) return true;
    return (
      (veg.name && veg.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (veg.description && veg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (veg.farmer && veg.farmer.toLowerCase().includes(searchTerm.toLowerCase()))
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
    
    <div className="vegetables-container">
      <div className="vegetables-header">
        <h1 className="vegetables-title">Organic Vegetables</h1>
        <p className="vegetables-subtitle">Nutritious Vegetables from trusted farmers</p>
      </div>

      {loading && <div className="no-results"><p>Loading...</p></div>}
      {error && <div className="no-results"><p>{error}</p></div>}
      <div className="vegetables-grid">
        {filteredVegetables.map((vegetable) => (
          <div key={vegetable._id || vegetable.id} className="vegetables-card">
            <div className="vegetables-image-container">
              <img src={vegetable.images?.[0]?.url || vegetable.image} alt={vegetable.name} className="vegetable-image"  onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+SW1hZ2UgTm90IEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
                }}
              />
            </div>
            <div className="vegetable-info">
              <h3 className="vegetable-name">{vegetable.name}</h3>
              <p className="vegetable-description">{vegetable.description}</p>
              <p className="vegetable-farmer">By: {vegetable.farmerName || vegetable.farmer?.name || '—'}</p>
              <div className="vegetable-price">NRs {vegetable.price}</div>
              <div style={{color: (vegetable.stock ?? 0) > 0 ? '#2e7d32' : '#c53030'}}>
                {(vegetable.stock ?? 0) > 0 ? 'In stock' : 'Out of stock'}
              </div>
              <button 
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(vegetable)}
                disabled={(vegetable.stock ?? 0) <= 0}
              >
                {(vegetable.stock ?? 0) > 0 ? 'Add to Cart' : 'Out of stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredVegetables.length === 0 && (
        <div className="no-results">
          <p>No vegetables found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Vegetables;