import React, { useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import '../styles/DataForm.css';

function DataForm({ onAddData }) {
  const [formData, setFormData] = useState({
    remark: '',
    bdNumber: '',
    dirham: '',
    bdt: '',
    uaeNumber: ''
  });
  const inputRefs = useRef({});
  const inputOrder = ['remark', 'bdNumber', 'dirham', 'bdt', 'uaeNumber'];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleKeyDown = (e, currentField) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault();
      const currentIndex = inputOrder.indexOf(currentField);
      if (currentIndex < inputOrder.length - 1) {
        const nextField = inputOrder[currentIndex + 1];
        inputRefs.current[nextField]?.focus();
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.remark.trim() === '') return;

    onAddData({
      remark: formData.remark,
      bdNumber: formData.bdNumber,
      dirham: parseFloat(formData.dirham) || 0,
      bdt: parseFloat(formData.bdt) || 0,
      uaeNumber: formData.uaeNumber
    });

    // Reset form
    setFormData({
      remark: '',
      bdNumber: '',
      dirham: '',
      bdt: '',
      uaeNumber: ''
    });

    inputRefs.current.remark?.focus();
  };

  return (
    <form className="data-form" onSubmit={handleSubmit}>
      <h3>দ্রুত এন্ট্রি ফর্ম</h3>
      <div className="form-fields">
        <div className="form-group">
          <label>রিমার্ক</label>
          <input
            ref={el => inputRefs.current.remark = el}
            type="text"
            value={formData.remark}
            onChange={(e) => handleInputChange('remark', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'remark')}
            placeholder="নোট লিখুন"
            required
          />
        </div>
        <div className="form-group">
          <label>বাংলাদেশ নম্বর</label>
          <input
            ref={el => inputRefs.current.bdNumber = el}
            type="tel"
            value={formData.bdNumber}
            onChange={(e) => handleInputChange('bdNumber', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'bdNumber')}
            placeholder="01xxx xxxxxx"
            inputMode="numeric"
          />
        </div>
        <div className="form-group">
          <label>দিরহাম</label>
          <input
            ref={el => inputRefs.current.dirham = el}
            type="number"
            step="0.01"
            value={formData.dirham}
            onChange={(e) => handleInputChange('dirham', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'dirham')}
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label>বাংলা টাকা</label>
          <input
            ref={el => inputRefs.current.bdt = el}
            type="number"
            step="0.01"
            value={formData.bdt}
            onChange={(e) => handleInputChange('bdt', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'bdt')}
            placeholder="0.00"
            inputMode="decimal"
          />
        </div>
        <div className="form-group">
          <label>UAE নম্বর</label>
          <input
            ref={el => inputRefs.current.uaeNumber = el}
            type="tel"
            value={formData.uaeNumber}
            onChange={(e) => handleInputChange('uaeNumber', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'uaeNumber')}
            placeholder="971xxxxxxxxx"
            inputMode="numeric"
          />
        </div>
      </div>
      <button type="submit" className="form-submit-btn">
        <FiSend size={16} /> পাঠান
      </button>
    </form>
  );
}

export default DataForm;
