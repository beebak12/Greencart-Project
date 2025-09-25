import React, { useState, useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../context/SearchContext';
import GreencartLogo from '../../assets/icons/greencart-logo.png';
import './Navbarr.css';

const Navbarr = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const { setSearchTerm } = useSearch();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

   // Add ref for search container
  const searchContainerRef = useRef(null);

  // Sample data for search (replace with your actual data or API)
  const [searchData] = useState({
    products: [
      { id: 1, name: 'Organic Tomatoes', type: 'product', category: 'vegetables' },
      { id: 2, name: 'Fresh Apples', type: 'product', category: 'fruits' },
      { id: 3, name: 'Free Range Eggs', type: 'product', category: 'dairy' },
      { id: 4, name: 'Organic Rice', type: 'product', category: 'grains' },
      { id: 5, name: 'Fresh Milk', type: 'product', category: 'dairy' }
    ],
    farmers: [
      { id: 1, name: 'Ram Bahadur Thapa', type: 'farmer', location: 'Chitwan' },
      { id: 2, name: 'Sita Kumari', type: 'farmer', location: 'Kathmandu' },
      { id: 3, name: 'Hari Prasad', type: 'farmer', location: 'Pokhara' },
      { id: 4, name: 'Gita Sharma', type: 'farmer', location: 'Lalitpur' }
    ]
  });

  // Load user name (for Welcome message)
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userData');
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u?.name || u?.fullName || '');
      }
    } catch {}
  }, []);

  // Fixed scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


 // NEW: Click outside detection to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  // Improved search functionality
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const productResults = searchData.products
      .filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      )
      .map(product => ({
        type: 'product',
        item: product,
        display: `${product.name} (${product.category})`
      }));

    const farmerResults = searchData.farmers
      .filter(farmer =>
        farmer.name.toLowerCase().includes(query) ||
        farmer.location.toLowerCase().includes(query)
      )
      .map(farmer => ({
        type: 'farmer',
        item: farmer,
        display: `${farmer.name} - Farmer (${farmer.location})`
      }));

    const allResults = [...productResults, ...farmerResults];
    setSearchResults(allResults);
    setShowSearchResults(true);
  }, [searchQuery, searchData]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLinkClick = (link) => {
    setActiveLink(link);
    closeMenu();
    switch (link) {
      case 'home': navigate('/home'); break;
      case 'contact': navigate('/contactus'); break;
      case 'goods': navigate('/goods'); break;
      case 'order-history': navigate('/OrderHistory'); break;
      case 'aboutus': navigate('/aboutus'); break;
      case 'cart': navigate('/cart'); break;
      default: navigate('/');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Set global search term and go to unified Goods page which lists all items
      setSearchTerm(searchQuery);
      navigate('/goods');
        setShowSearchResults(false); 
    }
  };

  const handleSearchResultClick = (result) => {
    setSearchQuery('');
    setShowSearchResults(false);

    if (result.type === 'product') {
      setSearchTerm(result.item.name);
      navigate('/goods');
    } else if (result.type === 'farmer') {
      setSearchTerm(result.item.name);
      navigate('/farmers');
    }
  };
  // NEW: Handle input blur (optional alternative approach)
  const handleInputBlur = () => {
    // Small delay to allow click on search results
    setTimeout(() => {
      setShowSearchResults(false);
    }, 150);
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/Signin');
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className={`top-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          {/* Logo Section */}
          <div className="header-logo" onClick={() => handleLinkClick('home')}>
            <img src={GreencartLogo} alt="GreenCart Logo" className="logo-image" />
            <div className="logo-text-container">
              <span className="logo-text"></span>
              <span className="logo-subtitle">Organic Store</span>
            </div>
          </div>

          {/* Search Bar with Results */}
          <div className="header-search-container" ref={searchContainerRef}>
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-group">
                <span className="search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path 
                      d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <input 
                  type="text" 
                  placeholder="Search products or farmers..." 
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearchResults(true)}
                   onBlur={handleInputBlur} 
                />
                {searchQuery && (
                  <button type="button" className="search-clear"  onClick={() => {
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}

                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="search-results-dropdown">
                    {searchResults.length > 0 ? (
        <>
          {searchResults.map((result, index) => (
            <div
              key={index}
              className="search-result-item"
              onClick={() => handleSearchResultClick(result)}
            >
              <div className="search-result-type">
                {result.type === 'product' ? 'Product' : 'Farmer'}
              </div>
              <div className="search-result-name">{result.display}</div>
            </div>
          ))}

          <div 
            className="view-all-results"
            onClick={() => {
              setSearchTerm(searchQuery);
              navigate('/goods');
              setShowSearchResults(false);
            }}
          >
            View all results for "{searchQuery}"
          </div>
        </>
                    ) : (
                      <div className="no-results"> "{searchQuery}"</div>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Logout Button */}
          <div className="header-actions">
            {userName && (
              <span style={{marginRight: '12px', color: '#033a1d'}}>Welcome, {userName}</span>
            )}
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M16 17L21 12L16 7" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M21 12H9" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Button */}
      <button className={`nav-toggle ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Mobile Backdrop */}
      <div className={`mobile-backdrop ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Side Navbar */}
      <nav className={`navbar ${isMenuOpen ? 'active' : ''} ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <ul className="nav-menu">
            {[
              { id: 'home', text: 'Home', icon: 'M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z M9 22V12H15V22' },
              { id: 'goods', text: 'Products', icon: 'M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z M16 21V5C16 4.46957 15.7893 3.96086 15.4142 3.58579C15.0391 3.21071 14.5304 3 14 3H10C9.46957 3 8.96086 3.21071 8.58579 3.58579C8.21071 3.96086 8 4.46957 8 5V21' },
              { id: 'order-history', text: 'Order History', icon: 'M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15 M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z M9 12H15 M9 16H15' },
              
              { id: 'contact', text: 'Contact', icon: 'M21 11.5V16.5C21 17.0304 20.7893 17.5391 20.4142 17.9142C20.0391 18.2893 19.5304 18.5 19 18.5H5C4.46957 18.5 3.96086 18.2893 3.58579 17.9142C3.21071 17.5391 3 17.0304 3 16.5V7.5C3 6.96957 3.21071 6.46086 3.58579 6.08579C3.96086 5.71071 4.46957 5.5 5 5.5H14 M7 9.5L12 12.5L17 9.5' },
              { id: 'cart', text: 'Cart', icon: 'M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.3 5.1 16.3H17M17 13V16.3M9 20C9 20.5523 8.55228 21 8 21C7.44772 21 7 20.5523 7 20C7 19.4477 7.44772 19 8 19C8.55228 19 9 19.4477 9 20ZM19 20C19 20.5523 18.5523 21 18 21C17.4477 21 17 20.5523 17 20C17 19.4477 17.4477 19 18 19C18.5523 19 19 19.4477 19 20Z' }
            ].map((item) => (
              <li key={item.id} className="nav-item">
                <button 
                  className={`nav-link ${activeLink === item.id ? 'active' : ''}`}
                  onClick={() => handleLinkClick(item.id)}
                >
                  <span className="nav-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                      <path 
                        d={item.icon}
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="nav-text">{item.text}</span>
                  
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbarr;
