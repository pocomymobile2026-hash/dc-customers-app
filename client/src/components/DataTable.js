import React from 'react';
import '../styles/DataTable.css';

function DataTable({ rows, onRowClick }) {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>রিমার্ক</th>
            <th>বাংলাদেশ নম্বর</th>
            <th>দিরহাম</th>
            <th>বাংলা টাকা</th>
            <th>স্ট্যাটাস</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className={`table-row color-${row.color || 'normal'} ${row.is_verified === 1 ? 'verified' : ''}`}
              onClick={() => onRowClick(row)}
            >
              <td className="remark">{row.remark}</td>
              <td className="bd-number">{row.bd_number ? `${row.bd_number.slice(0, 5)}-${row.bd_number.slice(5)}` : '-'}</td>
              <td className="dirham">{row.dirham || '-'}</td>
              <td className="bdt">{row.bdt || '-'}</td>
              <td className="status">
                {row.is_verified === 1 ? (
                  <span className="verified-badge">✓</span>
                ) : (
                  <span className="pending-badge">⏳</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="no-data">কোনো ডেটা নেই</p>
      )}
    </div>
  );
}

export default DataTable;
