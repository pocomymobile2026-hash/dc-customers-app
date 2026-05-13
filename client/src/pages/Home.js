import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiLogOut, FiPlus } from 'react-icons/fi';
import '../styles/Home.css';

function Home({ userData, onLogout }) {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [showNewPageForm, setShowNewPageForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [newPage, setNewPage] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    rate: ''
  });

  useEffect(() => {
    loadPages();
  }, [userData]);

  const loadPages = async () => {
    try {
      const response = await axios.get(`/api/pages/user/${userData.userId}`);
      setPages(response.data.pages || []);
    } catch (error) {
      console.error('পৃষ্ঠা লোড করতে ত্রুটি:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/pages/create', {
        userId: userData.userId,
        name: newPage.name,
        date: newPage.date,
        rate: parseFloat(newPage.rate)
      });

      if (response.data.success) {
        setNewPage({ name: '', date: new Date().toISOString().split('T')[0], rate: '' });
        setShowNewPageForm(false);
        loadPages();
      }
    } catch (error) {
      console.error('পৃষ্ঠা তৈরি করতে ত্রুটি:', error);
    }
  };

  const handlePageClick = (pageId) => {
    navigate(`/page/${pageId}`);
  };

  const filteredPages = pages.filter(page =>
    page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.date.includes(searchQuery)
  );

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <div className="header-left">
          <h1>DC CUSTOMER'S</h1>
        </div>
        <div className="header-center">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="পৃষ্ঠা খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <button className="logout-btn" onClick={onLogout} title="লগআউট">
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="user-info">
        <p>স্বাগতম, <strong>{userData?.name}</strong></p>
      </div>

      {/* New Page Button */}
      <div className="new-page-section">
        {!showNewPageForm ? (
          <button className="create-page-btn" onClick={() => setShowNewPageForm(true)}>
            <FiPlus size={20} /> নতুন পৃষ্ঠা তৈরি করুন
          </button>
        ) : (
          <form className="new-page-form" onSubmit={handleCreatePage}>
            <h3>নতুন পৃষ্ঠা তৈরি করুন</h3>
            <div className="form-group">
              <label>পৃষ্ঠার নাম</label>
              <input
                type="text"
                value={newPage.name}
                onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                placeholder="যেমন: জানুয়ারি বিক্রয়"
                required
              />
            </div>
            <div className="form-group">
              <label>তারিখ</label>
              <input
                type="date"
                value={newPage.date}
                onChange={(e) => setNewPage({ ...newPage, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>রেট (দিরহাম থেকে টাকা)</label>
              <input
                type="number"
                step="0.01"
                value={newPage.rate}
                onChange={(e) => setNewPage({ ...newPage, rate: e.target.value })}
                placeholder="যেমন: 20.5"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-submit">তৈরি করুন</button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowNewPageForm(false)}
              >
                বাতিল করুন
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Pages List */}
      <div className="pages-container">
        {loading ? (
          <p className="loading">লোড হচ্ছে...</p>
        ) : filteredPages.length === 0 ? (
          <p className="no-pages">কোনো পৃষ্ঠা নেই। একটি নতুন পৃষ্ঠা তৈরি করুন।</p>
        ) : (
          filteredPages.map((page) => (
            <div
              key={page.id}
              className="page-card"
              onClick={() => handlePageClick(page.id)}
            >
              <div className="page-header">
                <h3>{page.name}</h3>
                {page.is_closed === 1 && <span className="closed-badge">বন্ধ</span>}
              </div>
              <div className="page-details">
                <p><strong>তারিখ:</strong> {new Date(page.date).toLocaleDateString('bn-BD')}</p>
                <p><strong>রেট:</strong> {page.rate}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
