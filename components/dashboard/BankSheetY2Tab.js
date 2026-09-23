'use client';

import React, { useState } from 'react';
import { AppStore } from '@/lib/store';
import { exportToExcel, printTableToPDF } from '@/lib/exporter';

export default function BankSheetY2Tab({ currentUser }) {
  const [filterText, setFilterText] = useState('');
  const records = AppStore.getBankRecordsY2();
  const summary = AppStore.getBankSummaryY2();
  const cashFlow = AppStore.getCashFlowY2();
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
      '#', 'Tanuló Neve', '09. hó', '10. hó', '11. hó', '12. hó', '01. hó', '02. hó', '03. hó', '04. hó', '05. hó', '06. hó', 'Befizetve', 'Hátralék', 'Kirándulás', 'Megjegyzés'
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
      ''
    ]);

    const summaryData = [
      { label: '1. tanévről áthozott maradvány:', value: `${(summary.carriedForward2024 || 627081).toLocaleString('hu-HU')} Ft` },
      { label: '2. Tanévi Összes Banki Befizetés:', value: `${(summary.yearIncome2025 || 714000).toLocaleString('hu-HU')} Ft` },
      { label: '2. Tanévi Összes Banki Kiadás:', value: `${(summary.totalExpenses || 118660).toLocaleString('hu-HU')} Ft` },
      { label: 'Egyéb bevételek:', value: `${(summary.otherIncome || 25000).toLocaleString('hu-HU')} Ft` },
      { label: 'Záró OTP Számlaegyenleg:', value: `${(summary.closingOtpBalance || 1247421).toLocaleString('hu-HU')} Ft` },
      { label: 'Készpénzes Bevételek (Szilágyi V. 60k + Angel Zs. 40k):', value: `+${cashFlow.formattedTotalIncome}` },
      { label: 'Készpénzes Kiadások (Névnapok + közös főzés):', value: `-${cashFlow.formattedTotalExpenses}` },
      { label: 'Készpénz Záró Maradvány:', value: `${cashFlow.formattedClosingCashBalance}` },
      { label: 'Teljes Tanévi Vagyon (Bank + Kp):', value: `${cashFlow.formattedGrandTotalClosingBalance}` }
    ];

    exportToExcel({
      filename: 'szechenyi_11d_2_tanev_banki_elszamolas_2025_2026',
      sheetTitle: 'Széchenyi 11. D - 2. tanév (2025/2026) Banki és Készpénzes Elszámolás',
      headers,
      rows,
      summaryData
    });
  };

  const handlePrintPDF = () => {
    const headers = [
      '#', 'Tanuló Neve', '09. hó', '10. hó', '11. hó', '12. hó', '01. hó', '02. hó', '03. hó', '04. hó', '05. hó', '06. hó', 'Befizetve', 'Hátralék', 'Kirándulás', 'Megjegyzés'
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
      '—'
    ]);

    const summaryData = [
      { label: '1. tanévről áthozott maradvány', value: `${(summary.carriedForward2024 || 627081).toLocaleString('hu-HU')} Ft` },
      { label: '2. Tanévi Összes Banki Befizetés', value: `${(summary.yearIncome2025 || 714000).toLocaleString('hu-HU')} Ft` },
      { label: '2. Tanévi Összes Banki Kiadás', value: `${(summary.totalExpenses || 118660).toLocaleString('hu-HU')} Ft` },
      { label: 'Egyéb bevételek', value: `${(summary.otherIncome || 25000).toLocaleString('hu-HU')} Ft` },
      { label: 'Záró OTP Számlaegyenleg', value: `${(summary.closingOtpBalance || 1247421).toLocaleString('hu-HU')} Ft` },
      { label: 'Készpénzes Bevételek (Szilágyi V. 60k + Angel Zs. 40k)', value: `+${cashFlow.formattedTotalIncome}` },
      { label: 'Készpénzes Kiadások (Névnapok + közös főzés)', value: `-${cashFlow.formattedTotalExpenses}` },
      { label: 'Készpénz Záró Maradvány', value: `${cashFlow.formattedClosingCashBalance}` },
      { label: 'Teljes Tanévi Vagyon (Bank + Kp)', value: `${cashFlow.formattedGrandTotalClosingBalance}` }
    ];

    printTableToPDF({
      title: '2. tanév (2025/2026) Banki és Készpénzes Elszámolás',
      subtitle: 'Széchenyi István Gimnázium és Technikum • 11. D Osztálypénz és Pénzügyi Nyilvántartás',
      headers,
      rows,
      summaryData
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="table-card">
        <div className="table-header-row">
          <div>
            <h3 className="table-title">🏦 2. tanév (2025/2026) Banki Elszámolás</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Havi 3 000 Ft-os osztálypénz és kirándulási befizetések hivatalos OTP bankkivonat szerinti nyilvántartása
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
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
        <div className="mobile-table-hint" style={{ display: 'none' }}>
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
                <th>Hátralék</th>
                <th>Kirándulás</th>
                <th>Előző évi hátralék</th>
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
                    <td>
                      {canView ? (r.m09 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m10 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m11 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m12 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m01 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m02 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m03 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m04 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m05 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td>
                      {canView ? (r.m06 || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--success-text)' }}>
                      {canView ? r.total : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ fontWeight: 800, color: r.debt === '0 Ft' ? 'var(--text-muted)' : 'var(--danger-text)' }}>
                      {canView ? r.debt : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--brand-accent)' }}>
                      {canView ? (r.trip || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {canView ? (r.prevDebt || '—') : <span className="privacy-blurred">•••• Ft</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} className="col-sticky-total">Összesen (Havi bevételek)</td>
                <td>{summary.monthlyIncomeTotals.m09}</td>
                <td>{summary.monthlyIncomeTotals.m10}</td>
                <td>{summary.monthlyIncomeTotals.m11}</td>
                <td>{summary.monthlyIncomeTotals.m12}</td>
                <td>{summary.monthlyIncomeTotals.m01}</td>
                <td>{summary.monthlyIncomeTotals.m02}</td>
                <td>{summary.monthlyIncomeTotals.m03}</td>
                <td>{summary.monthlyIncomeTotals.m04}</td>
                <td>{summary.monthlyIncomeTotals.m05}</td>
                <td>{summary.monthlyIncomeTotals.m06}</td>
                <td style={{ color: 'var(--success-text)' }}>{summary.monthlyIncomeTotals.total}</td>
                <td style={{ color: 'var(--danger-text)' }}>{summary.monthlyIncomeTotals.debtTotal}</td>
                <td style={{ color: 'var(--brand-accent)' }}>{summary.monthlyIncomeTotals.tripTotal}</td>
                <td>—</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2nd Year Financial Summary & Expenses Breakdown */}
      <div className="table-card">
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
          📊 2025/2026. Tanév Banki Pénzügyi Összesítő és Kiadások
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>Előző évről áthozott maradvány</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{(summary.carriedForward2024 || 627081).toLocaleString('hu-HU')} Ft</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>2025/26 Évi Osztálypénz (Bank)</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-text)' }}>{(summary.yearIncome2025 || 714000).toLocaleString('hu-HU')} Ft</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>Egyéb bevétel</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--brand-accent)' }}>{(summary.otherIncome || 25000).toLocaleString('hu-HU')} Ft</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>Összes Felmerült Kiadás (Bank)</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger-text)' }}>{(summary.totalExpenses || 118660).toLocaleString('hu-HU')} Ft</div>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--brand-accent)' }}>
            <small style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>Záró OTP Számlaegyenleg</small>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-accent)' }}>{(summary.closingOtpBalance || 1247421).toLocaleString('hu-HU')} Ft</div>
          </div>
        </div>

        <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-muted)' }}>
          Banki kiadások havi bontása (Névnapok, banki költségek, egyéb kiadások):
        </h5>

        <div className="responsive-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-exp-name">Kiadás megnevezése</th>
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
                <th>Összesen</th>
              </tr>
            </thead>
            <tbody>
              {summary.monthlyExpenses.map((exp, idx) => (
                <tr key={idx}>
                  <td className="col-exp-name"><strong>{exp.name}</strong></td>
                  <td>{exp.m09 || '—'}</td>
                  <td>{exp.m10 || '—'}</td>
                  <td>{exp.m11 || '—'}</td>
                  <td>{exp.m12 || '—'}</td>
                  <td>{exp.m01 || '—'}</td>
                  <td>{exp.m02 || '—'}</td>
                  <td>{exp.m03 || '—'}</td>
                  <td>{exp.m04 || '—'}</td>
                  <td>{exp.m05 || '—'}</td>
                  <td>{exp.m06 || '—'}</td>
                  <td style={{ fontWeight: 800, color: 'var(--danger-text)' }}>{exp.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td className="col-sticky-total">Összes Havi Kiadás</td>
                <td>{summary.monthlyExpenseTotals.m09}</td>
                <td>{summary.monthlyExpenseTotals.m10}</td>
                <td>{summary.monthlyExpenseTotals.m11}</td>
                <td>{summary.monthlyExpenseTotals.m12}</td>
                <td>{summary.monthlyExpenseTotals.m01}</td>
                <td>{summary.monthlyExpenseTotals.m02}</td>
                <td>{summary.monthlyExpenseTotals.m03}</td>
                <td>{summary.monthlyExpenseTotals.m04}</td>
                <td>{summary.monthlyExpenseTotals.m05}</td>
                <td>{summary.monthlyExpenseTotals.m06}</td>
                <td style={{ color: 'var(--danger-text)' }}>{summary.monthlyExpenseTotals.total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 2nd Year Cash Flow (Készpénzes Elszámolás / Házipénztár) */}
      <div className="table-card">
        <div className="table-header-row">
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
              💵 2025/2026. Tanév Készpénzes Elszámolás (Házipénztár)
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
              A készpénzben átvett osztálypénzek és kirándulási díjak, valamint a készpénzből vásárolt névnapi ajándékok és közös főzéshez vett dolgok nyilvántartása
            </p>
          </div>
        </div>

        {/* KPI boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>Készpénzes Bevételek</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-text)' }}>
              +{cashFlow.formattedTotalIncome}
            </div>
            <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Szilágyi V. (60k) + Angel Zs. (40k)</small>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>Készpénzes Kiadások</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger-text)' }}>
              -{cashFlow.formattedTotalExpenses}
            </div>
            <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{cashFlow.expenses.length} db készpénzes tétel összesen</small>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '2px solid var(--brand-accent)', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)' }}>
            <small style={{ color: 'var(--brand-accent)', fontWeight: 700 }}>Készpénz Záró Maradvány</small>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--brand-accent)' }}>
              {cashFlow.formattedClosingCashBalance}
            </div>
            <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Bevételek - Kiadások egyenlege</small>
          </div>
          <div style={{ background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)' }}>Teljes Tanévi Vagyon (Bank + Kp)</small>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-text)' }}>
              {cashFlow.formattedGrandTotalClosingBalance}
            </div>
            <small style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>OTP: 1 247 421 Ft + Kp: {cashFlow.formattedClosingCashBalance}</small>
          </div>
        </div>

        {/* Készpénzes Bevételek & Kiadások táblázatai - egymás alatt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Bevételek */}
          <div>
            <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📥</span> Készpénzes Befizetések:
            </h5>
            <div className="responsive-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="col-num" style={{ width: '40px' }}>#</th>
                    <th className="col-name">Tanuló Neve</th>
                    <th>Megnevezés / Jogcím</th>
                    <th>Kategória</th>
                    <th style={{ textAlign: 'right' }}>Összeg</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlow.incomes.map((inc) => {
                    const isChild = currentUser?.childName?.toLowerCase() === inc.studentName?.toLowerCase();
                    const canView = isAdmin || isChild;
                    return (
                      <tr key={inc.id} className={isChild ? 'highlighted-row' : ''}>
                        <td className="col-num"><strong>{inc.id}</strong></td>
                        <td className="col-name">
                          {canView ? (
                            <>
                              <strong>{inc.studentName}</strong>
                              {isChild && <span className="badge badge-primary" style={{ marginLeft: '6px' }}>Saját gyermek</span>}
                            </>
                          ) : (
                            <span className="privacy-masked-name">🔒 11. D Tanuló</span>
                          )}
                        </td>
                        <td>{inc.description}</td>
                        <td><span className="badge badge-primary">{inc.category}</span></td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--success-text)' }}>
                          {canView ? inc.formattedAmount : <span className="privacy-blurred">•••• Ft</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="col-sticky-total">Összes Készpénz Bevétel</td>
                    <td style={{ textAlign: 'right', color: 'var(--success-text)', fontWeight: 800 }}>
                      {cashFlow.formattedTotalIncome}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Kiadások */}
          <div>
            <h5 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--danger-text)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>📤</span> Készpénzes Kiadások:
            </h5>
            <div className="responsive-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th className="col-num" style={{ width: '40px' }}>#</th>
                    <th className="col-exp-name">Dátum</th>
                    <th>Kiadás megnevezése / Célja</th>
                    <th style={{ textAlign: 'right' }}>Összeg</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlow.expenses.map((exp) => (
                    <tr key={exp.id}>
                      <td className="col-num"><strong>{exp.id}</strong></td>
                      <td className="col-exp-name"><strong>{exp.date}</strong></td>
                      <td><strong>{exp.description}</strong></td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: 'var(--danger-text)' }}>
                        -{exp.formattedAmount}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="col-sticky-total">Összes Készpénz Kiadás</td>
                    <td style={{ textAlign: 'right', color: 'var(--danger-text)', fontWeight: 800 }}>
                      -{cashFlow.formattedTotalExpenses}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
