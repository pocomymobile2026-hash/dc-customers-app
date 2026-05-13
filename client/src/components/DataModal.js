import React, { useState } from 'react';
import axios from 'axios';
import { FiX, FiEdit, FiCopy, FiTrash2 } from 'react-icons/fi';
import '../styles/DataModal.css';

function DataModal({ row, page, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...row });
  const [copied, setCopied] = useState(null);
  const [oldBDNumber, setOldBDNumber] = useState(null);

  const playSound = (type = 'beep') => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'beep') {
      oscillator.frequency.value = 1000;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'success') {
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    }
  };

  const handleVerify = async () => {
    try {
      await axios.put(`/api/data/${row.id}/verify`);
      playSound('success');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('যাচাইকরণ ত্রুটি:', error);
    }
  };

  const handleCopyBDNumber = () => {
    const numberToCopy = row.bd_number.replace(/-/g, '');
    navigator.clipboard.writeText(numberToCopy);
    playSound('beep');
    setCopied('bd');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyForWT = () => {
    const numberToCopy = row.bd_number.replace(/-/g, '');
    const text = `${numberToCopy}===${row.bdt}\n*নগদ*`;
    navigator.clipboard.writeText(text);
    playSound('beep');
    setCopied('wt');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSaveEdit = async () => {
    try {
      if (editData.bd_number !== row.bd_number) {
        setOldBDNumber(row.bd_number);
      }
      await axios.put(`/api/data/${row.id}`, {
        remark: editData.remark,
        bdNumber: editData.bd_number,
        dirham: editData.dirham,
        bdt: editData.bdt,
        uaeNumber: editData.uae_number
      });
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('সম্পাদনা ত্রুটি:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই রো ডিলিট করতে চান?')) {
      try {
        await axios.delete(`/api/data/${row.id}`);
        onUpdate();
        onClose();
      } catch (error) {
        console.error('ডিলিট ত্রুটি:', error);
      }
    }
  };

  const formatBDNumber = (number) => {
    if (!number) return '';
    return `${number.slice(0, 5)}-${number.slice(5)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content data-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="close-btn" onClick={onClose}>
            <FiX size={24} />
          </button>
          {!isEditing && (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FiEdit size={20} /> সম্পাদনা
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="edit-form">
            <h3>ডেটা সম্পাদনা করুন</h3>
            <div className="form-group">
              <label>রিমার্ক</label>
              <input
                type="text"
                value={editData.remark || ''}
                onChange={(e) => setEditData({ ...editData, remark: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>বাংলাদেশ নম্বর</label>
              <input
                type="tel"
                value={editData.bd_number || ''}
                onChange={(e) => setEditData({ ...editData, bd_number: e.target.value })}
                inputMode="numeric"
              />
              {oldBDNumber && (
                <p className="old-number">আগের নম্বর: {formatBDNumber(oldBDNumber)}</p>
              )}
            </div>
            <div className="form-group">
              <label>দিরহাম</label>
              <input
                type="number"
                step="0.01"
                value={editData.dirham || ''}
                onChange={(e) => setEditData({ ...editData, dirham: e.target.value })}
                inputMode="decimal"
              />
            </div>
            <div className="form-group">
              <label>বাংলা টাকা</label>
              <input
                type="number"
                step="0.01"
                value={editData.bdt || ''}
                onChange={(e) => setEditData({ ...editData, bdt: e.target.value })}
                inputMode="decimal"
              />
            </div>
            <div className="form-actions">
              <button className="btn-save" onClick={handleSaveEdit}>সংরক্ষণ করুন</button>
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>বাতিল করুন</button>
            </div>
          </div>
        ) : (
          <>
            <div className="modal-body">
              <div className="data-display">
                <div className="display-section">
                  <h4>রিমার্ক</h4>
                  <p className="remark-text">{row.remark}</p>
                </div>

                <div className="display-section">
                  <h4>বাংলাদেশ নম্বর</h4>
                  <p className="bd-number-text">{formatBDNumber(row.bd_number)}</p>
                </div>

                <div className="numbers-row">
                  <div className="number-group">
                    <p>দিরহাম</p>
                    <p className="dirham-text">{row.dirham}</p>
                  </div>
                  <div className="number-group">
                    <p>বাংলা টাকা</p>
                    <p className="bdt-text">{row.bdt}</p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className={`copy-btn wt-copy ${copied === 'wt' ? 'copied' : ''}`}
                  onClick={handleCopyForWT}
                >
                  {copied === 'wt' ? '✓ কপিড' : 'কপি করুন (WT)'}
                </button>
                <button
                  className={`copy-btn bd-copy ${copied === 'bd' ? 'copied' : ''}`}
                  onClick={handleCopyBDNumber}
                >
                  {copied === 'bd' ? '✓ কপিড' : 'নম্বর কপি'}
                </button>
              </div>
            </div>

            <div className="modal-footer">
              {row.is_verified === 0 && (
                <button className="verify-btn" onClick={handleVerify}>
                  ✓ যাচাই করুন
                </button>
              )}
              <button className="delete-btn" onClick={handleDelete}>
                <FiTrash2 size={18} /> ডিলিট
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DataModal;
