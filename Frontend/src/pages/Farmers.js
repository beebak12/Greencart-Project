// Farmers.js
import React, { useEffect, useState } from 'react';
import { useSearch } from '../context/SearchContext';
import { useNavigate } from 'react-router-dom';
import './Farmers.css';
import Farmer1 from '../assets/images/farmer1.jpg';
import Farmer2 from '../assets/images/farmer2.webp';
import Farmer3 from '../assets/images/farmer3.jpg';
import Farmer4 from '../assets/images/farmer4.jpg';
import Navbarr from '../components/common/Navbarr';

const Farmers = () => {
  const [selectedLocation, setSelectedLocation] = useState('All');
  const { searchTerm, setSearchTerm } = useSearch();
  const navigate = useNavigate();

  // Farmers from API
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/farmers`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load farmers');
        setFarmers(data.farmers || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  // Sample data for registered farmers (removed)
  // const farmers = [
  //   {
  //     id: 1,
  //     name: "Ram Bahadur Thapa",
  //     location: "Shivanagar, Chitwan",
  //     phone: "+977 9845123456",
  //     items: ["Rice", "Cauliflower", "Bananas", "Millet", "Pumpkin", "Grapes", "Carrot", "Mushroom", "Kidneybeans", "Greenpeas", "litchhi", "Soyabean", "Beans"],
  //     since: "2018",
  //     image: "Farmer1",
  //     page: "/ram"
  //   },
  //   {
  //     id: 2,
  //     name: "Gopal Adhikari",
  //     location: "Parsa, Chitwan",
  //     phone: "+977 9856123456",
  //     items: ["Barley", "Cabbage", "Grapes", "Capsicum", "Bitter gourd", "Flax seeds", "Chia seeds", "Red Lentils", "Black lentil", "chickpeas","Mango"],
  //     since: "2020",
  //     image: "Farmer2",
  //     page: "/gopal"
  //   },
  //   {
  //     id: 3,
  //     name: "Binita Adhikari",
  //     location: "Lanku, Chitwan",
  //     phone: "+977 9867123456",
  //     items: ["Apples", "Potato", "Corn", "Brinjal", "Broccoli", "Chilli", "Guava", "Papaya", "Pineapple", "Peach", "Strawbeey", "Kiwi"],
  //     since: "2019",
  //     image: "Farmer3",
  //     page: "/binita"
  //   },
  //   {
  //     id: 4,
  //     name: "Kishan Thapa",
  //     location: "Bharatpur, Chitwan",
  //     phone: "+977 9878123456",
  //     items: ["Wheat", "Pomegranate", "Radish", "Lady finger", "Onion", "Ginger", "Lemon", "Orange", "Watermelon", "Dragon fruit"],
  //     since: "2017",
  //     image: "Farmer4",
  //     page: "/kishan"
  //   }
  // // end of removed list

  // Clear search when leaving this page (back navigation or route change)
  useEffect(() => {
    return () => setSearchTerm('');
  }, [setSearchTerm]);

  // Get unique locations for filter
  const locations = [...new Set(farmers.map(farmer => farmer.location))];

  // Filter farmers based on search term and location
  const filteredFarmers = (farmers || []).filter(farmer => {
    const matchesSearch = searchTerm ? (
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase())) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;

    const matchesLocation = selectedLocation === 'All' || farmer.location === selectedLocation;

    return matchesSearch && matchesLocation;
  });

  return (
    <div>
      <Navbarr />

      <div className="farmers-container">
        <h1 className="page-title">{searchTerm ? `Farmers Matching "${searchTerm}"` : 'Registered Farmers'}</h1>

        {/* Filters */}
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search farmers or items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="location-filter">
            <label>Filter by Location:</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="All">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </div>
        </div>

        {loading && <div className="no-results"><p>Loading...</p></div>}
        {error && <div className="no-results"><p>{error}</p></div>}
        {/* Farmers List */}
        <div className="farmers-list">
          {filteredFarmers.length > 0 ? (
            filteredFarmers.map(farmer => (
              <div
                key={farmer.id}
                className="farmer-card"
                onClick={() => navigate(farmer.page)} // Navigate to respective page
                style={{ cursor: "pointer" }}
              >
                <div className="farmer-image">
                  <div className="image-placeholder">
                    <img
                      src={
                        farmer.image === "Farmer1" ? Farmer1 :
                          farmer.image === "Farmer2" ? Farmer2 :
                            farmer.image === "Farmer3" ? Farmer3 :
                              farmer.image === "Farmer4" ? Farmer4 :
                            
                                  ""
                      }
                      alt={farmer.name}
                      className="farmer-img"
                    />
                  </div>
                </div>

                <div className="farmer-info">
                  <h2 className="farmer-name">{farmer.fullName || farmer.name}</h2>

                  <div className="farmer-details">
                    <div className="detail-item">
                      <span className="icon">📍</span>
                      <span>{farmer.location}</span>
                    </div>

                    <div className="detail-item">
                      <span className="icon">📞</span>
                      <span>{farmer.phone}</span>
                    </div>

                    <div className="detail-item">
                      <span className="icon">⭐</span>
                      <span>Member since {farmer.since}</span>
                    </div>
                  </div>

                  <div className="items-section">
                    <h3>Items Produced:</h3>
                    <div className="items-list">
                      {farmer.items.map((item, index) => (
                        <span key={index} className="item-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No farmers found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Farmers;
