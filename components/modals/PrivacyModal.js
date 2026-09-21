'use client';

import React from 'react';

export default function PrivacyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📜 Adatkezelési Tájékoztató</h3>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <h4 style={{ color: 'var(--brand-accent)', marginBottom: '0.5rem' }}>
            Adatkezelési Tájékoztató és Hozzájárulás
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Hatályos: 2026. szeptember 1-től
          </p>

          <p><strong>1. Adatkezelő adatai:</strong></p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Név: <strong>Rékási László</strong><br />
            E-mail: <a href="mailto:rekalaca@gmail.com" style={{ color: 'var(--brand-accent)' }}>rekalaca@gmail.com</a><br />
            Szervezet: Nyíregyházi SZC Széchenyi István Technikum és Kollégium 11. D osztály Szülői Munkaközösség
          </p>

          <p><strong>2. Kezelt személyes adatok köre:</strong></p>
          <ul style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginLeft: '1.2rem', marginBottom: '1rem' }}>
            <li>Szülő/gondviselő e-mail címe és jelszava (kódolva tárolva),</li>
            <li>Gyermek neve (a 11. D osztály 37 fős névsorából),</li>
            <li>Osztálypénz befizetési státuszok és naplózási időpontok.</li>
          </ul>

          <p><strong>3. Tanulónkénti regisztrációs limit:</strong></p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Az adatbiztonság és a visszaélések megelőzése érdekében tanulónként legfeljebb <strong>2 szülői/gondviselői fiók</strong> regisztrálható a rendszerben.
          </p>

          <p><strong>4. Az adatkezelés célja és jogalapja:</strong></p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            A 11. D osztály szülői kapcsolattartásának elősegítése és az osztálypénz átlátható elszámolása (GDPR 6. cikk (1) a) szerinti önkéntes hozzájárulás).
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            Megértettem és elfogadom
          </button>
        </div>
      </div>
    </div>
  );
}
