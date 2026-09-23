'use client';

import React, { useState } from 'react';
import { AppStore } from '@/lib/store';
import { exportToExcel, printTableToPDF } from '@/lib/exporter';

export default function BankSheetY3Tab({ currentUser }) {
  const [filterText, setFilterText] = useState('');
  const records = AppStore.getBankRecordsY3();
  const summary = AppStore.getBankSummaryY3();
  const isAdmin = currentUser?.role === 'admin';

  const filteredRecords = records.filter(r => {
    const isChild = currentUser?.childName?.toLowerCase() === r.name.toLowerCase();
    const cleanFilter = filterText.toLowerCase().trim();

    if (!cleanFilter) return true;

    // Admin can filter by any name or ID
    if (isAdmin) {
      return r.name.toLowerCase().includes(cleanFilter) || r.id.toString().includes(cleanFilter);
    }

    // Parent can filter their own child's name, or student IDs
    if (isChild && r.name.toLowerCase().includes(cleanFilter)) return true;
    return `tanuló #${r.id}`.includes(cleanFilter) || r.id.toString().includes(cleanFilter);
  });

  const handleExportExcel = () => {
    const headers = [
      '#', 'Tanuló Neve', '09. hó', '10. hó', '11. hó', '12. hó', '01. hó', '02. hó', '03. hó', '04. hó', '05. hó', '06. hó', 'Befizetve', 'Tartozás (3. év)', 'Kirándulás', 'Korábbi elmaradás', 'Megjegyzés'
    ];
    const rows = filteredRecords.map(r => {
      const isChild = currentUser?.childName?.toLowerCase() === r.name.toLowerCase();
      const canView = isAdmin || isChild;
      return [
        r.id,
        canView ? r.name : `11. D Tanuló #${r.id}`,
        canView ? (r.m09 || '') : '••••',
        canView ? (r.m10 || '') : '••••',
        canView ? (r.m11 || '') : '••••',
        canView ? (r.m12 || '') : '••••',
        canView ? (r.m01 || '') : '••••',
        canView ? (r.m02 || '') : '••••',
        canView ? (r.m03 || '') : '••••',
        canView ? (r.m04 || '') : '••••',
        canView ? (r.m05 || '') : '••••',
        canView ? (r.m06 || '') : '••••',
        canView ? r.total : '••••',
        canView ? r.debt : '••••',
        canView ? (r.trip || '') : '••••',
        canView ? (r.prevDebt || '') : '••••',
        canView ? (r.note || '') : ''
      ];
    });

    rows.push([
      '', 'Összesen (Havi bevételek)',
      summary.monthlyIncomeTotals.m09 || '0 Ft',
      summary.monthlyIncomeTotals.m10 || '0 Ft',
      summary.monthlyIncomeTotals.m11 || '0 Ft',
      summary.monthlyIncomeTotals.m12 || '0 Ft',
      summary.monthlyIncomeTotals.m01 || '0 Ft',
      summary.monthlyIncomeTotals.m02 || '0 Ft',
      summary.monthlyIncomeTotals.m03 || '0 Ft',
      summary.monthlyIncomeTotals.m04 || '0 Ft',
      summary.monthlyIncomeTotals.m05 || '0 Ft',
      summary.monthlyIncomeTotals.m06 || '0 Ft',
      summary.monthlyIncomeTotals.total,
      summary.monthlyIncomeTotals.debtTotal,
      summary.monthlyIncomeTotals.tripTotal,
      '', ''
    ]);

    const summaryData = [
      { label: '2. tanévről áthozott nyitó maradvány:', value: `${(summary.openingBalance || 1247421).toLocaleString('hu-HU')} Ft` },
      { label: '3. Tanévi Összes Új Befizetés:', value: `${(summary.totalIncome || 0).toLocaleString('hu-HU')} Ft` },
      { label: '3. Tanévi Összes Kiadás:', value: `${(summary.totalExpenses || 0).toLocaleString('hu-HU')} Ft` },
      { label: 'Aktuális OTP Számlaegyenleg:', value: `${(summary.closingOtpBalance || 1247421).toLocaleString('hu-HU')} Ft` }
    ];

    exportToExcel({
      filename: 'szechenyi_11d_3_tanev_banki_elszamolas_2026_2027',
      sheetTitle: 'Széchenyi 11. D - 3. tanév (2026/2027) Banki Elszámolás',
      headers,
      rows,
      summaryData
    });
  };

  const handlePrintPDF = () => {
    const headers = [
      '#', 'Tanuló Neve', '09. hó', '10. hó', '11. hó', '12. hó', '01. hó', '02. hó', '03. hó', '04. hó', '05. hó', '06. hó', 'Befizetve', 'Tartozás', 'Kirándulás', 'Elmaradás', 'Megjegyzés'
    ];
    const rows = filteredRecords.map(r => {
      const isChild = currentUser?.childName?.toLowerCase() === r.name.toLowerCase();
      const canView = isAdmin || isChild;
      return [
        r.id,
        canView ? r.name : `11. D Tanuló #${r.id}`,
        canView ? (r.m09 || '—') : '••••',
        canView ? (r.m10 || '—') : '••••',
        canView ? (r.m11 || '—') : '••••',
        canView ? (r.m12 || '—') : '••••',
        canView ? (r.m01 || '—') : '••••',
        canView ? (r.m02 || '—') : '••••',
        canView ? (r.m03 || '—') : '••••',
        canView ? (r.m04 || '—') : '••••',
        canView ? (r.m05 || '—') : '••••',
        canView ? (r.m06 || '—') : '••••',
        canView ? r.total : '••••',
        canView ? r.debt : '••••',
        canView ? (r.trip || '—') : '••••',
        canView ? (r.prevDebt || '—') : '••••',
        canView ? (r.note || '—') : ''
      ];
    });

    rows.push([
      '', 'Összesen (Havi bevételek)',
      summary.monthlyIncomeTotals.m09 || '0 Ft',
      summary.monthlyIncomeTotals.m10 || '0 Ft',
      summary.monthlyIncomeTotals.m11 || '0 Ft',
      summary.monthlyIncomeTotals.m12 || '0 Ft',
      summary.monthlyIncomeTotals.m01 || '0 Ft',
      summary.monthlyIncomeTotals.m02 || '0 Ft',
      summary.monthlyIncomeTotals.m03 || '0 Ft',
      summary.monthlyIncomeTotals.m04 || '0 Ft',
      summary.monthlyIncomeTotals.m05 || '0 Ft',
      summary.monthlyIncomeTotals.m06 || '0 Ft',
      summary.monthlyIncomeTotals.total,
      summary.monthlyIncomeTotals.debtTotal,
      summary.monthlyIncomeTotals.tripTotal,
      '—', '—'
    ]);

    const summaryData = [
      { label: '2. tanévről áthozott nyitó maradvány', value: `${(summary.openingBalance || 1247421).toLocaleString('hu-HU')} Ft` },
      { label: '3. Tanévi Összes Befizetés', value: `${(summary.totalIncome || 0).toLocaleString('hu-HU')} Ft` },
      { label: '3. Tanévi Összes Kiadás', value: `${(summary.totalExpenses || 0).toLocaleString('hu-HU')} Ft` },
      { label: 'Aktuális OTP Számlaegyenleg', value: `${(summary.closingOtpBalance || 1247421).toLocaleString('hu-HU')} Ft` }
    ];

    printTableToPDF({
      title: '3. tanév (2026/2027) Banki Elszámolás',
      subtitle: 'Széchenyi István Gimnázium és Technikum • 11. D Osztálypénz és Banki Nyilvántartás',
      headers,
      rows,
      summaryData
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="table-card" style={{ border: '1px solid rgba(212, 175, 55, 0.35)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px', justifyContent: 'center' }}>
            <span className="badge badge-warning">⭐ AKTÍV TANÉV</span>
          </div>
          <h3 className="table-title" style={{ justifyContent: 'center', margin: '0 auto 0.35rem' }}>
            🏦 3. tanév (2026/2027) Banki Elszámolás
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 auto', maxWidth: '650px' }}>
            Havi 3 000 Ft-os osztálypénz (30 000 Ft/év), kirándulási és elmaradás-befizetések naprakész nyilvántartása
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {isAdmin && (
            <>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handleExportExcel}
                title="Táblázat letöltése Excel (.xlsx) fájlként"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0.45rem 0.85rem' }}
              >
                📊 Excel (.xlsx)
              </button>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={handlePrintPDF}
                title="Táblázat nyomtatása vagy mentése PDF-ként"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '0.45rem 0.85rem' }}
              >
                📄 PDF / Nyomtatás
              </button>
            </>
          )}
          <input
            type="text"
            placeholder={isAdmin ? "Szűrés tanuló nevére..." : "Szűrés tanuló sorszámára (#)..."}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* GDPR Privacy Notice for Parents */}
        {!isAdmin && (
          <div className="privacy-notice-banner">
            <span style={{ fontSize: '1.2rem' }}>🔒</span>
            <div>
              <strong>Adatvédelmi és GDPR védelem aktív:</strong> Szülőként kizárólag a saját gyermeke (<strong>{currentUser?.childName || 'Saját gyermek'}</strong>) pontos befizetési tételeit láthatja. A többi tanuló neve és egyéni összegei a személyiségi jogok védelmében el vannak rejtve.
            </div>
          </div>
        )}

        {/* Mobile scroll hint */}
        <div className="mobile-table-hint">
          <span>👈</span> Húzza a táblázatot balra a havi bontás és részletek megtekintéséhez <span>👉</span>
        </div>

        <div className="responsive-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-num" style={{ width: '40px' }}>#</th>
                <th className="col-name">Tanuló Neve</th>
                <th>09. hó</th>
                <th>10. hó</th>
                <th>11. hó</th>
                <th>12. hó</th>
                <th>01. hó</th>
                <th>02. hó</th>
                <th>03. hó</th>
                <th>04. hó</th>
                <th>05. hó</th>
                <th>06. hó</th>
                <th>Befizetve</th>
                <th>Tartozás (3. év)</th>
                <th>Kirándulás</th>
                <th>Korábbi elmaradás</th>
                <th>Megjegyzés</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => {
                const isChild = currentUser?.childName?.toLowerCase() === r.name.toLowerCase();
                const canView = isAdmin || isChild;

                return (
                  <tr key={r.id} className={isChild ? 'highlighted-row' : ''}>
                    <td className="col-num"><strong>{r.id}</strong></td>
                    <td className="col-name">
                      {canView ? (
                        <>
                          <strong>{r.name}</strong>
                          {isChild && <span className="badge badge-primary" style={{ marginLeft: '6px' }}>Saját gyermek</span>}
                        </>
                      ) : (
                        <span className="privacy-masked-name">
                          🔒 11. D Tanuló #{r.id}
                        </span>
                      )}
                    </td>
                    <td>{canView ? (r.m09 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m10 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m11 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m12 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m01 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m02 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m03 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m04 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m05 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td>{canView ? (r.m06 || '—') : <span className="privacy-blurred">•••• Ft</span>}</td>
                    <td style={{ fontWeight: 800, color: 'var(--success-text)' }}>
                      {canView ? r.total : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ fontWeight: 800, color: r.debt === '0 Ft' ? 'var(--text-muted)' : 'var(--danger-text)' }}>
                      {canView ? r.debt : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>
                      {canView ? (r.trip || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ color: r.prevDebt ? 'var(--danger-text)' : 'var(--text-muted)', fontWeight: r.prevDebt ? 700 : 400 }}>
                      {canView ? (r.prevDebt || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {canView ? (r.note || '—') : <span className="privacy-blurred">••••</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="col-sticky-total">Összesen (Havi bevételek)</td>
                <td>{summary.monthlyIncomeTotals.m09 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m10 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m11 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m12 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m01 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m02 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m03 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m04 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m05 || '0 Ft'}</td>
                <td>{summary.monthlyIncomeTotals.m06 || '0 Ft'}</td>
                <td style={{ color: 'var(--success-text)' }}>{summary.monthlyIncomeTotals.total}</td>
                <td style={{ color: 'var(--danger-text)' }}>{summary.monthlyIncomeTotals.debtTotal}</td>
                <td style={{ color: 'var(--brand-accent)' }}>{summary.monthlyIncomeTotals.tripTotal}</td>
                <td colSpan={2}>—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 3rd Year Financial Summary & Balances */}
      <div className="table-card">
        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
          📊 2026/2027. (3.) Tanév Pénzügyi Összesítő és Nyitó Egyenleg
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>2. tanévről áthozott nyitó maradvány</small>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
              {(summary.openingBalance || 1247421).toLocaleString('hu-HU')} Ft
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>3. Tanévi Összes Befizetés</small>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success-text)' }}>
              {(summary.totalIncome || 0).toLocaleString('hu-HU')} Ft
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>3. Tanévi Összes Kiadás</small>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--danger-text)' }}>
              {(summary.totalExpenses || 0).toLocaleString('hu-HU')} Ft
            </div>
          </div>

          <div style={{ background: 'var(--bg-input)', padding: '1.1rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--brand-accent)', boxShadow: '0 4px 16px rgba(212, 175, 55, 0.15)' }}>
            <small style={{ color: 'var(--brand-accent)', fontWeight: 800, display: 'block', marginBottom: '4px' }}>Aktuális OTP Számlaegyenleg</small>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
              {(summary.closingOtpBalance || 1247421).toLocaleString('hu-HU')} Ft
            </div>
          </div>
        </div>

        <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
          Kiadások összesítése kategóriánként:
        </h5>

        <div className="responsive-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kiadási Kategória</th>
                <th>Összesen Felmerült Költség</th>
                <th>Állapot</th>
              </tr>
            </thead>
            <tbody>
              {summary.monthlyExpenses.map((exp, idx) => (
                <tr key={idx}>
                  <td><strong>{exp.name}</strong></td>
                  <td style={{ fontWeight: 800, color: exp.total !== '0 Ft' ? 'var(--danger-text)' : 'var(--text-muted)' }}>
                    {exp.total}
                  </td>
                  <td>
                    <span className={`badge ${exp.total !== '0 Ft' ? 'badge-warning' : 'badge-primary'}`}>
                      {exp.total !== '0 Ft' ? 'Elkönyvelve' : 'Még nincs tétel'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
