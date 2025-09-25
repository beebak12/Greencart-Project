// Goods.js (updated with sign-in prompt)
import React, { useState } from 'react';
import './Products.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/common/Header.js';

import { useSearch } from '../context/SearchContext';
import { useCart } from '../context/CartContext';


// Import your images (make sure these paths are correct)
import grainsImage from '../assets/icons/grains.webp';
import fruitsImage from '../assets/icons/fruits.png';
import vegetablesImage from '../assets/icons/vegetable.png';

import Cauli from '../assets/images/cauli.jpg';
import Cabbage from '../assets/images/cabbage.avif';
import Potato from '../assets/images/aalu.webp';
import Radish from '../assets/images/radish.avif';
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

import Brownrice from '../assets/images/brownrice.jpg';
import WholeWheat from '../assets/images/wholewheat.jpg';
import Millet from '../assets/images/millet.jpg';
import Corn from '../assets/images/corn.jpg';
import Beans from '../assets/images/beans.jpg';
import Soyabeans from '../assets/images/soyabeans.jpg';
import KidneyBeans from '../assets/images/kidneybeans.jpg';
import Whiterice from '../assets/images/whiterice.webp';
import FlaxSeeds from '../assets/images/flaxseed.jpg';
import ChiaSeeds from '../assets/images/chiaseeds.png';
import Barley from '../assets/images/Barley.webp';
import RedLentils from '../assets/images/relentils.jpg';
import BlackLentils from '../assets/images/blacklentil.jpg';
import Chickpeas from '../assets/images/chickpea.webp';

import Apple from '../assets/images/apple.jpg';
import Banana from '../assets/images/banana.jpg';
import Pomegranate from '../assets/images/anar.jpg';
import Grapes from '../assets/images/grapes.jpg';
import Guava from '../assets/images/guava.jpg';
import Papaya from '../assets/images/papaya.jpg';
import Pineapple from '../assets/images/pineapple.jpg';
import Peach from '../assets/images/peach.jpg';
import Strawberry from '../assets/images/strawberry.jpg';
import Kiwi from '../assets/images/kiwi.jpg';
import Mango from '../assets/images/mango.jpg';
import Lemon from '../assets/images/lemon.jpg';
import Orange from '../assets/images/orange.jpg';
import Watermelon from '../assets/images/watermelon.jpg';
import Dragonfruit from '../assets/images/dragonfruit.jpg';
import Litchhi from '../assets/images/litchi.jpg';

const Products = () => {
  const navigate = useNavigate();
  const { searchTerm } = useSearch();
  const { addToCart, isAuthenticated } = useCart(); // Assuming you have isAuthenticated in your CartContext
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddToCart = (product) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setSelectedProduct(product);
      setShowSignInPrompt(true);
      return;
    }
    
    addToCart(product);
    alert(`${product.name} added to cart!`);
  };

  const handleSignIn = () => {
    // Open sign in page in new tab
    window.open('/signin', '_blank'); 
    setShowSignInPrompt(false);
  };

  const handleCancel = () => {
    setShowSignInPrompt(false);
    setSelectedProduct(null);
  };

  // Sample product data
  const products = [
    { id: 1, name: "Cauliflower", price: 90, farmer: "Ram Bahadur Thapa", image: Cauli, description: "Nutrient-rich organic Cauliflower" },
    { id: 2, name: "Organic Brown Rice", price: 110, farmer: "Ram Bahadur Thapa", image: Brownrice, description: "Nutrient-rich organic brown rice" },
    { id: 3, name: "Apple", price: 250, farmer: "Binita Adhikari", image: Apple, description: "Nutrient-rich organic apple" },
    { id: 4, name: "Banana", price: 120, farmer: "Ram Bahadur Thapa", image: Banana, description: "High-quality organic Banana" },
    { id: 5, name: "Whole Wheat", price: 270, farmer: "Kishan Thapa", image: WholeWheat, description: "High-quality organic whole wheat" },
    { id: 6, name: "Cabbage", price: 120, farmer: " Gopal Adhikari", image: Cabbage, description: "High-quality organic Cabbage" },
    { id: 7, name: "Potato", price: 80, farmer: "Binita Adhikari", image: Potato, description: "Organic Potatoes" },
    { id: 8, name: "Millet", price: 300, farmer: "Ram Bahadur Thapa", image: Millet, description: "Protein-packed organic quinoa" },
    { id: 9, name: "Pomegranate", price: 350, farmer: "Kishan Thapa", image: Pomegranate, description: "Protein-packed organic pomogranate" },
    { id: 10, name: "Grapes", price: 250, farmer: "Ram Bahadur Thapa / Gopal Adhikari", image: Grapes, description: "Rich in iron" },
    { id: 11, name: "Corn", price: 150, farmer: "Binita Adhikari", image: Corn, description: "Steel-cut organic oats" },
    { id: 12, name: "Radish", price: 50, farmer: "Kishan Thapa", image: Radish, description: "Rich in iron" },
    { id: 13, name: "Carrot", price: 100, farmer: "Ram Bahadur Thapa", image: Carrot, description: "Fresh Organic sweet carrot" },
    { id: 14, name: "Capsicum", price: 150, farmer: " Gopal Adhikari", image: Capsicum, description: "Rich in taste" },
    { id: 15, name: "Mushroom", price: 280, farmer: "Ram Bahadur Thapa", image: Mushroom, description: "Rich in protein" },
    { id: 16, name: "Brinjal", price: 100, farmer: "Binita Adhikari", image: Brinjal, description: "Rich in fiber" },
    { id: 17, name: "Ladyfinger", price: 150, farmer: "Kishan Thapa", image: Ladyfinger, description: "Rich in vitamins" },
    { id: 18, name: "Bitter gourd", price: 90, farmer: " Gopal Adhikari", image: Bittergourd, description: "Rich in antioxidants" },
    { id: 19, name: "Broccoli", price: 120, farmer: "Binita Adhikari", image: Broccoli, description: "High in Vitamin-K" },
    { id: 20, name: "Pumpkin", price: 100, farmer: "Ram Bahadur Thapa", image: Pumpkin, description: "Rich in Vitamin-A" },
    { id: 21, name: "Chili", price: 150, farmer: "Binita Adhikari", image: Chilli, description: "Spicy and Tangy chili" },
    { id: 22, name: "Onion", price: 160, farmer: "Kishan Thapa", image: Onion, description: "Rich in flavor" },
    { id: 23, name: "Garlic", price: 350, farmer: "Kishan Thapa", image: Garlic, description: "Rich in medicinal properties" },
    { id: 24, name: "Green peas", price: 150, farmer: "Ram Bahadur Thapa", image: Greenpeas, description: "Rich in protein" },
    { id: 25, name: "Beans", price: 200, farmer: "Ram Bahadur Thapa", image: Beans, description: "Steel-cut organic oats" },
    { id: 26, name: "Soyabeans", price: 180, farmer: "Ram Bahadur Thapa", image: Soyabeans, description: "Steel-cut organic oats" },
    { id: 27, name: "Kidney Beans", price: 250, farmer: "Ram Bahadur Thapa", image: KidneyBeans, description: "Steel-cut organic oats" },
    { id: 28, name: "Brown Rice", price: 110, farmer: "Ram Bahadur Thapa", image: Brownrice, description: "Steel-cut organic oats" },
    { id: 29, name: "White Rice", price: 130, farmer: "Ram Bahadur Thapa", image: Whiterice, description: "Steel-cut organic oats" },
    { id: 30, name: "Flax Seeds", price: 250, farmer: " Gopal Adhikari", image: FlaxSeeds, description: "Steel-cut organic oats" },
    { id: 31, name: "Chia Seeds", price: 450, farmer: " Gopal Adhikari", image: ChiaSeeds, description: "Steel-cut organic oats" },
    { id: 32, name: "Barley", price: 150, farmer: " Gopal Adhikari", image: Barley, description: "Steel-cut organic oats" },
    { id: 33, name: "Red Lentils", price: 220, farmer: " Gopal Adhikari", image: RedLentils, description: "Steel-cut organic oats" },
    { id: 34, name: "Black Lentils", price: 280, farmer: " Gopal Adhikari", image: BlackLentils, description: "Steel-cut organic oats" },
    { id: 35, name: "Chickpeas", price: 200, farmer: " Gopal Adhikari", image: Chickpeas, description: "Steel-cut organic oats" },
    { id: 36, name: "Guava", price: 100, farmer: "Binita Adhikari", image: Guava, description: "Fresh Organic Guava" },
    { id: 37, name: "Papaya", price: 150, farmer: "Binita Adhikari", image: Papaya, description: "Rich in taste" },
    { id: 38, name: "Pineapple", price: 180, farmer: "Binita Adhikari", image: Pineapple, description: "Sweet and tangy" },
    { id: 39, name: "Peach", price: 100, farmer: "Binita Adhikari", image: Peach, description: "Sweet and Juicy" },
    { id: 40, name: "Strawberry", price: 250, farmer: "Binita Adhikari", image: Strawberry, description: "Sweet and juicy" },
    { id: 41, name: "Kiwi", price: 450, farmer: "Binita Adhikari", image: Kiwi, description: "Sweet in taste" },
    { id: 42, name: "Mango", price: 120, farmer: " Gopal Adhikari", image: Mango, description: "King of Fruits" },
    { id: 43, name: "Lemon", price: 180, farmer: "Kishan Thapa", image: Lemon, description: "Citric Fruit" },
    { id: 44, name: "Orange", price: 150, farmer: "Kishan Thapa", image: Orange, description: "rich in Vitamin-C" },
    { id: 45, name: "Watermelon", price: 60, farmer: "Kishan Thapa", image: Watermelon, description: "Sweet and Juicy watermelon" },
    { id: 46, name: "Dragon Fruit", price: 450, farmer: "Kishan Thapa", image: Dragonfruit, description: "Sweet organic Fruit" },
    { id: 47, name: "Ginger", price: 250, farmer: "Kishan Thapa", image: Ginger, description: "Rich in medicinal properties" },
    { id: 48, name: "Litchhi", price: 250, farmer: "Ram Bahadur Thapa", image: Litchhi, description: "Juicy Litchhi" }
  ];

   // Sort products alphabetically by name
  const sortedProducts = [...products].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  // Filter products based on search term
  const filteredProducts = sortedProducts.filter(product => {
    if (!searchTerm) return true;

    return (
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.farmer && product.farmer.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleCategoryClick = (category) => {
    navigate(`/${category}`);
    setMenuOpen(false); // close menu after navigation
  };

  return (
    <div>
      <Header/>
   
    <div className="products-page-root">
      

      {/* Sign-in Prompt Modal */}
      {showSignInPrompt && (
        <div className="modal-overlay">
          <div className="signin-prompt-modal">
            <h3>Please sign in to perform "Add to Cart"</h3>
            <div className="modal-buttons">
              <button className="signin-btn" onClick={handleSignIn}>
                Sign In
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="products-container">
        <h1 className="products-title">Our Organic Products</h1>

        {/* Product Listing Section */}
        <div className="products-section">
          <div className="products-grid">
            {filteredProducts.map((product, index) => (
              <div key={`${product.id}-${index}`} className="product-card">
                <div className="product-image-container">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzg4OCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9IjAuMzVlbSI+R3JhaW4gSW1hZ2U8L3RleHQ+PC9zdmc+';
                    }}
                  />
                </div>

                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p className="farmer">By: {product.farmer}</p>
                <p className="price">NRs {product.price}</p>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
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
     </div>
  );
};

export default Products;