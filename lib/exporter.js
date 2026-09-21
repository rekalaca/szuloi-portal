import * as XLSX from 'xlsx';

/**
 * Clean numeric string formatter for Excel cell values
 */
function cleanVal(val) {
  if (val === undefined || val === null) return '';
  return val;
}

/**
 * Export table data to native Excel (.xlsx) file
 */
export function exportToExcel({ filename, sheetTitle, headers, rows, summaryData = [] }) {
  // 1. Build Array of Arrays (AoA)
  const aoa = [];

  // Title header rows
  aoa.push([sheetTitle]);
  aoa.push([`Generálva: ${new Date().toLocaleDateString('hu-HU')} ${new Date().toLocaleTimeString('hu-HU')}`]);
  aoa.push([]); // blank line

  // Summary box section if present
  if (summaryData.length > 0) {
    aoa.push(['PÉNZÜGYI ÖSSZESÍTŐ']);
    summaryData.forEach(item => {
      aoa.push([item.label, item.value]);
    });
    aoa.push([]); // blank line
  }

  // Table Headers
  aoa.push(headers);

  // Table Data Rows
  rows.forEach(r => {
    aoa.push(r.map(cleanVal));
  });

  // 2. Create Sheet & Workbook
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Auto-calculate column widths
  const colWidths = headers.map((h, colIdx) => {
    let maxLen = (h || '').toString().length;
    rows.forEach(r => {
      const valStr = (r[colIdx] || '').toString();
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    return { wch: Math.max(maxLen + 4, 10) };
  });
  ws['!cols'] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Elszámolás');

  // 3. Trigger Download
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Open print / PDF preview window with elegant styles
 */
export function printTableToPDF({ title, subtitle, headers, rows, summaryData = [] }) {
  const printWindow = window.open('', '_blank', 'width=1100,height=850');
  if (!printWindow) {
    alert('Kérjük, engedélyezze az előugró ablakokat a PDF exportáláshoz!');
    return;
  }

  const summaryHtml = summaryData.length > 0 ? `
    <div class="summary-grid">
      ${summaryData.map(s => `
        <div class="summary-box">
          <div class="summary-label">${s.label}</div>
          <div class="summary-val">${s.value}</div>
        </div>
      `).join('')}
    </div>
  ` : '';

  const tableHeaderHtml = `
    <tr>
      ${headers.map(h => `<th>${h}</th>`).join('')}
    </tr>
  `;

  const tableBodyHtml = rows.map((r, idx) => `
    <tr class="${idx % 2 === 0 ? 'even' : 'odd'}">
      ${r.map(cell => `<td>${cell || '—'}</td>`).join('')}
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html lang="hu">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @page {
          size: landscape;
          margin: 12mm;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #111;
          background: #fff;
          margin: 0;
          padding: 10px;
          font-size: 11px;
        }
        .header-bar {
          border-bottom: 2px solid #d4af37;
          padding-bottom: 10px;
          margin-bottom: 15px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        h1 {
          font-size: 18px;
          margin: 0 0 4px 0;
          color: #0b1120;
        }
        .subtitle {
          font-size: 12px;
          color: #555;
          margin: 0;
        }
        .meta {
          font-size: 10px;
          color: #777;
          text-align: right;
        }
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 10px;
          margin-bottom: 15px;
        }
        .summary-box {
          border: 1px solid #ddd;
          background: #f8fafc;
          border-radius: 6px;
          padding: 8px 12px;
        }
        .summary-label {
          font-size: 10px;
          color: #666;
          margin-bottom: 3px;
        }
        .summary-val {
          font-size: 14px;
          font-weight: 800;
          color: #0b1120;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #cbd5e1;
          padding: 5px 6px;
          text-align: left;
        }
        th {
          background-color: #0b1120;
          color: #fff;
          font-weight: 700;
          font-size: 10px;
          text-transform: uppercase;
        }
        tr.even {
          background-color: #ffffff;
        }
        tr.odd {
          background-color: #f8fafc;
        }
        .footer-note {
          font-size: 9px;
          color: #888;
          text-align: center;
          margin-top: 20px;
          border-top: 1px solid #e2e8f0;
          padding-top: 8px;
        }
        @media print {
          body {
            padding: 0;
          }
          .no-print {
            display: none;
          }
        }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <div>
          <h1>🏫 ${title}</h1>
          <p class="subtitle">${subtitle || 'Széchenyi István Gimnázium és Technikum • 11. D Osztály'}</p>
        </div>
        <div class="meta">
          <strong>Szülői Portál</strong><br>
          Kiadás dátuma: ${new Date().toLocaleDateString('hu-HU')}
        </div>
      </div>

      ${summaryHtml}

      <table>
        <thead>
          ${tableHeaderHtml}
        </thead>
        <tbody>
          ${tableBodyHtml}
        </tbody>
      </table>

      <div class="footer-note">
        Dokumentum generálva a Széchenyi 11. D Szülői Portálról (https://szuloi-portal.vercel.app). Hivatalos SZMK nyilvántartás.
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
