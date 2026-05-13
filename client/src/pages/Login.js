import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Login.css';

function Login({ onLogin }) {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await axios.post(endpoint, { name, pin });

      if (response.data.success) {
        onLogin({
          userId: response.data.userId,
          name: response.data.name
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'একটি ত্রুটি ঘটেছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>DC CUSTOMER'S</h1>
        <p className="subtitle">গ্রাহক ব্যবস্থাপনা অ্যাপ্লিকেশন</p>

        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('login');
              setError('');
            }}
          >
            লগইন
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('register');
              setError('');
            }}
          >
            নতুন অ্যাকাউন্ট
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>আপনার নাম</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="নাম লিখুন"
              required
            />
          </div>

          <div className="form-group">
            <label>৪ সংখ্যার PIN</label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="0000"
              maxLength="4"
              inputMode="numeric"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'অপেক্ষা করছেন...' : activeTab === 'login' ? 'লগইন করুন' : 'অ্যাকাউন্ট তৈরি করুন'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
