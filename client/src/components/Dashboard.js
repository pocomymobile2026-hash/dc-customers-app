import React from 'react';
import '../styles/Dashboard.css';

function Dashboard({ dashboard, rate }) {
  const bdtToDirectham = (bdt) => (bdt / rate).toFixed(2);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h3>মোট এন্ট্রি</h3>
        <p className="dashboard-value">{dashboard.totalRows}</p>
      </div>
      <div className="dashboard-card">
        <h3>যাচাইকৃত</h3>
        <p className="dashboard-value verified">{dashboard.verifiedCount}</p>
      </div>
      <div className="dashboard-card">
        <h3>বাকি</h3>
        <p className="dashboard-value pending">{dashboard.pendingCount}</p>
      </div>
      <div className="dashboard-card">
        <h3>মোট দিরহাম</h3>
        <p className="dashboard-value dirham">{parseFloat(dashboard.totalDirham).toFixed(2)}</p>
      </div>
      <div className="dashboard-card">
        <h3>মোট টাকা</h3>
        <p className="dashboard-value bdt">{parseFloat(dashboard.totalBDT).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Dashboard;
