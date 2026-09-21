'use client';

import React from 'react';

/**
 * ConfirmModal - Elegáns, testreszabható modális párbeszédablak
 * Megerősítésekhez (pl. törlés), figyelmeztetésekhez és hibaüzenetekhez.
 */
export default function ConfirmModal({
  isOpen,
  title = 'Megerősítés szükséges',
  message,
  type = 'danger', // 'danger' | 'warning' | 'info' | 'success'
  confirmText = 'Igen, törlés',
  cancelText = 'Mégse',
  isAlertOnly = false,
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'success':
        return '✅';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  const getHeaderGradient = () => {
    switch (type) {
      case 'danger':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)';
      case 'warning':
        return 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)';
      case 'success':
        return 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)';
      case 'info':
      default:
        return 'linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(14, 42, 71, 0.1) 100%)';
    }
  };

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger';
      case 'warning':
        return 'btn btn-warning';
      case 'success':
        return 'btn btn-success';
      case 'info':
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container elegant-dialog-modal"
        style={{ maxWidth: '460px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header"
          style={{
            background: getHeaderGradient(),
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              background: 'var(--bg-card)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {getIcon()}
          </div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, flex: 1 }}>
            {title}
          </h3>
          <button className="modal-close-btn" onClick={onClose} title="Bezárás">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ padding: '1.5rem 1.4rem' }}>
          {typeof message === 'string' ? (
            <p style={{ fontSize: '0.92rem', lineHeight: '1.6', color: 'var(--text-main)', margin: 0 }}>
              {message}
            </p>
          ) : (
            message
          )}
        </div>

        <div className="modal-footer" style={{ justifyContent: isAlertOnly ? 'center' : 'flex-end' }}>
          {!isAlertOnly && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ minWidth: '100px' }}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            className={getConfirmButtonClass()}
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            style={{ minWidth: '120px' }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
