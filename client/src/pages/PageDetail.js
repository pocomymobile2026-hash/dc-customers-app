import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSearch, FiArrowLeft, FiLock } from 'react-icons/fi';
import DataForm from '../components/DataForm';
import DataTable from '../components/DataTable';
import DataModal from '../components/DataModal';
import Dashboard from '../components/Dashboard';
import '../styles/PageDetail.css';

function PageDetail({ userData }) {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadPageData();
  }, [pageId]);

  useEffect(() => {
    loadDashboard();
  }, [rows]);

  const loadPageData = async () => {
    try {
      const response = await axios.get(`/api/pages/${pageId}`);
      setPage(response.data.page);
      setRows(response.data.rows || []);
    } catch (error) {
      console.error('পৃষ্ঠার ডেটা লোড করতে ত্রুটি:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const response = await axios.get(`/api/pages/${pageId}/dashboard`);
      setDashboard(response.data.dashboard);
    } catch (error) {
      console.error('ড্যাশবোর্ড লোড করতে ত্রুটি:', error);
    }
  };

  const handleAddData = async (data) => {
    try {
      const response = await axios.post('/api/data/add', {
        pageId,
        ...data
      });
      if (response.data.success) {
        loadPageData();
      }
    } catch (error) {
      console.error('ডেটা যোগ করতে ত্রুটি:', error);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleClosePage = async () => {
    if (!pinInput) return;
    try {
      await axios.put(`/api/pages/${pageId}/close`);
      loadPageData();
      setShowCloseConfirm(false);
      setPinInput('');
    } catch (error) {
      console.error('পৃষ্ঠা বন্ধ করতে ত্রুটি:', error);
    }
  };

  const handleReopenPage = async () => {
    if (!pinInput) return;
    try {
      await axios.put(`/api/pages/${pageId}/reopen`);
      loadPageData();
      setShowCloseConfirm(false);
      setPinInput('');
    } catch (error) {
      console.error('পৃষ্ঠা খুলতে ত্রুটি:', error);
    }
  };

  const filteredRows = rows.filter(row =>
    (row.remark && row.remark.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (row.bd_number && row.bd_number.includes(searchQuery)) ||
    (row.uae_number && row.uae_number.includes(searchQuery))
  );

  if (loading) {
    return <div className="loading">লোড হচ্ছে...</div>;
  }

  if (!page) {
    return <div className="error">পৃষ্ঠা পাওয়া যায়নি</div>;
  }

  return (
    <div className="page-detail-container">
      {/* Header */}
      <div className="page-detail-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/')}>
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1>{page.name}</h1>
            <p className="page-info">{page.date} | রেট: {page.rate}</p>
          </div>
        </div>
        <div className="header-right">
          {page.is_closed === 1 ? (
            <button
              className="reopen-btn"
              onClick={() => setShowCloseConfirm(true)}
              title="পৃষ্ঠা খুলুন"
            >
              <FiLock size={20} /> খুলুন
            </button>
          ) : (
            <button
              className="close-btn"
              onClick={() => setShowCloseConfirm(true)}
              title="পৃষ্ঠা বন্ধ করুন"
            >
              বন্ধ করুন
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="অনুসন্ধান করুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Dashboard */}
      {dashboard && <Dashboard dashboard={dashboard} rate={page.rate} />}

      {/* Data Table */}
      <DataTable rows={filteredRows} onRowClick={handleRowClick} />

      {/* Data Form (only if page is not closed) */}
      {page.is_closed === 0 && (
        <DataForm onAddData={handleAddData} />
      )}

      {/* Data Modal */}
      {showModal && selectedRow && (
        <DataModal
          row={selectedRow}
          page={page}
          onClose={() => setShowModal(false)}
          onUpdate={loadPageData}
        />
      )}

      {/* Close Page Modal */}
      {showCloseConfirm && (
        <div className="modal-overlay" onClick={() => setShowCloseConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{page.is_closed === 1 ? 'পৃষ্ঠা খুলুন' : 'পৃষ্ঠা বন্ধ করুন'}</h3>
            <p>আপনার PIN লিখুন:</p>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="0000"
              maxLength="4"
              inputMode="numeric"
            />
            <div className="modal-actions">
              <button
                className="btn-confirm"
                onClick={page.is_closed === 1 ? handleReopenPage : handleClosePage}
              >
                {page.is_closed === 1 ? 'খুলুন' : 'বন্ধ করুন'}
              </button>
              <button
                className="btn-cancel"
                onClick={() => {
                  setShowCloseConfirm(false);
                  setPinInput('');
                }}
              >
                বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageDetail;
