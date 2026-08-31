const ExcelJS = require('exceljs');

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Bob - Keuangan Organisasi';
  wb.created = new Date();

  const DARK_BLUE = '1E3A5F';
  const LIGHT_BLUE = 'DBEAFE';
  const LIGHT_GREEN = 'DCFCE7';
  const LIGHT_RED = 'FEE2E2';
  const GRAY = 'F7F8FA';
  const BORDER_GRAY = 'E5E7EB';
  const IDR0 = '"Rp"#,##0';

  function headerStyle(bg, fgColor) {
    return {
      font: { bold: true, color: { argb: 'FF' + (fgColor || 'FFFFFF') }, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + (bg || DARK_BLUE) } },
      alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
      border: {
        top: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } },
        bottom: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } },
        left: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } },
        right: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } }
      }
    };
  }

  function cellBorder() {
    return {
      top: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } },
      bottom: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } },
      left: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } },
      right: { style: 'thin', color: { argb: 'FF' + BORDER_GRAY } }
    };
  }

  // ============================================================
  // SHEET 1: COVER
  // ============================================================
  const cover = wb.addWorksheet('Cover', { properties: { tabColor: { argb: 'FF' + DARK_BLUE } } });
  cover.columns = [{ width: 5 }, { width: 28 }, { width: 38 }, { width: 20 }, { width: 20 }];

  cover.getRow(1).height = 10;
  cover.mergeCells('B2:E2');
  const titleCell = cover.getCell('B2');
  titleCell.value = 'LAPORAN KEUANGAN ORGANISASI';
  titleCell.style = {
    font: { bold: true, size: 18, color: { argb: 'FFFFFFFF' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + DARK_BLUE } },
    alignment: { horizontal: 'center', vertical: 'middle' }
  };
  cover.getRow(2).height = 50;

  const infoFields = [
    ['Nama Organisasi', ''],
    ['Divisi / Bidang', ''],
    ['Ketua Organisasi', ''],
    ['Bendahara', ''],
    ['Periode Kepengurusan', ''],
    ['Institusi / Kampus', ''],
    ['Tanggal Dibuat', new Date().toLocaleDateString('id-ID')]
  ];

  cover.getRow(3).height = 10;
  infoFields.forEach((f, i) => {
    const r = 4 + i;
    cover.getRow(r).height = 25;
    const labelCell = cover.getCell(r, 2);
    labelCell.value = f[0];
    labelCell.style = {
      font: { bold: true, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + GRAY } },
      border: cellBorder(), alignment: { vertical: 'middle' }
    };
    const valCell = cover.getCell(r, 3);
    valCell.value = f[1];
    valCell.style = { font: { size: 11 }, border: cellBorder(), alignment: { vertical: 'middle' } };
  });

  // ============================================================
  // SHEET 2: BUKU KAS
  // ============================================================
  const trx = wb.addWorksheet('Buku Kas', { properties: { tabColor: { argb: 'FF16A34A' } } });
  trx.columns = [
    { key: 'no', width: 5 },
    { key: 'tanggal', width: 14 },
    { key: 'jenis', width: 14 },
    { key: 'kategori', width: 20 },
    { key: 'deskripsi', width: 35 },
    { key: 'kegiatan', width: 25 },
    { key: 'bukti', width: 20 },
    { key: 'pemasukan', width: 18 },
    { key: 'pengeluaran', width: 18 },
    { key: 'saldo', width: 18 },
    { key: 'ket', width: 25 }
  ];

  trx.mergeCells('A1:K1');
  trx.getCell('A1').value = 'BUKU KAS UMUM';
  trx.getCell('A1').style = headerStyle(DARK_BLUE);
  trx.getRow(1).height = 30;

  // Info row
  const trxInfo = trx.getRow(2);
  trxInfo.height = 20;
  trx.mergeCells('A2:B2'); trx.getCell('A2').value = 'Organisasi:';
  trx.mergeCells('C2:E2'); trx.getCell('C2').value = { formula: "Cover!C4" };
  trx.mergeCells('F2:G2'); trx.getCell('F2').value = 'Periode:';
  trx.mergeCells('H2:K2'); trx.getCell('H2').value = { formula: "Cover!C8" };
  trx.getRow(2).eachCell(c => {
    c.style = { font: { italic: true, size: 10 }, fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F8FA' } }, border: cellBorder() };
  });

  // Header
  const trxHdr = ['No', 'Tanggal', 'Jenis', 'Kategori', 'Deskripsi', 'Kegiatan', 'No Bukti', 'Pemasukan (Rp)', 'Pengeluaran (Rp)', 'Saldo (Rp)', 'Keterangan'];
  const hRow = trx.addRow(trxHdr);
  hRow.height = 30;
  hRow.eachCell(c => { c.style = headerStyle(DARK_BLUE); });

  // Saldo awal row
  const saRow = trx.addRow(['', '', '', '', 'SALDO AWAL', '', '', 0, 0, { formula: 'H4-I4' }, '']);
  saRow.height = 22;
  saRow.eachCell((c, cn) => {
    c.style = {
      font: { bold: true, size: 11 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + LIGHT_BLUE } },
      border: cellBorder(),
      alignment: { vertical: 'middle' }
    };
    if (cn === 8 || cn === 9 || cn === 10) c.numFmt = IDR0;
  });

  // 50 data rows
  for (let i = 5; i <= 54; i++) {
    const row = trx.addRow([
      i - 4, '', '', '', '', '', '', 0, 0,
      { formula: `J${i-1}+H${i}-I${i}` },
      ''
    ]);
    row.height = 18;
    row.eachCell((c, cn) => {
      c.border = cellBorder();
      if (cn === 8) {
        c.numFmt = IDR0;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + LIGHT_GREEN } };
      } else if (cn === 9) {
        c.numFmt = IDR0;
        c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + LIGHT_RED } };
      } else if (cn === 10) {
        c.numFmt = IDR0;
      }
    });
    trx.getCell(i, 3).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: ['"Pemasukan,Pengeluaran"'],
      showErrorMessage: true, errorTitle: 'Input Error', error: 'Pilih Pemasukan atau Pengeluaran'
    };
  }

  // Total row
  const totRow = trx.addRow(['', '', '', '', 'TOTAL', '', '',
    { formula: 'SUM(H5:H54)' }, { formula: 'SUM(I5:I54)' }, { formula: 'H55-I55' }, ''
  ]);
  totRow.height = 24;
  totRow.eachCell((c, cn) => {
    c.style = {
      font: { bold: true, size: 12 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } },
      border: cellBorder()
    };
    if (cn === 8 || cn === 9 || cn === 10) c.numFmt = IDR0;
  });

  trx.views = [{ state: 'frozen', ySplit: 3 }];

  // ============================================================
  // SHEET 3: KEGIATAN
  // ============================================================
  const proj = wb.addWorksheet('Kegiatan', { properties: { tabColor: { argb: 'FF3B82F6' } } });
  proj.columns = [
    { width: 5 }, { width: 30 }, { width: 14 }, { width: 14 }, { width: 22 },
    { width: 18 }, { width: 18 }, { width: 18 }, { width: 14 }, { width: 14 }, { width: 25 }
  ];

  proj.mergeCells('A1:K1');
  proj.getCell('A1').value = 'DAFTAR KEGIATAN / PROYEK ORGANISASI';
  proj.getCell('A1').style = headerStyle(DARK_BLUE);
  proj.getRow(1).height = 30;

  const projHdr = ['No', 'Nama Kegiatan', 'Tgl Mulai', 'Tgl Selesai', 'Penanggung Jawab',
    'Anggaran (Rp)', 'Realisasi (Rp)', 'Sisa (Rp)', '% Serapan', 'Status', 'Keterangan'];
  const ph = proj.addRow(projHdr);
  ph.height = 30;
  ph.eachCell(c => { c.style = headerStyle(DARK_BLUE); });

  for (let i = 3; i <= 32; i++) {
    const row = proj.addRow([
      i - 2, '', '', '', '', 0, 0,
      { formula: `F${i}-G${i}` },
      { formula: `IF(F${i}>0,G${i}/F${i}*100,0)` },
      'Aktif', ''
    ]);
    row.height = 20;
    row.eachCell((c, cn) => {
      c.border = cellBorder();
      if (cn === 6 || cn === 7 || cn === 8) c.numFmt = IDR0;
      if (cn === 9) c.numFmt = '0.0"%"';
    });
    proj.getCell(i, 10).dataValidation = {
      type: 'list', allowBlank: true,
      formulae: ['"Aktif,Selesai,Ditangguhkan,Dibatalkan"']
    };
  }

  proj.views = [{ state: 'frozen', ySplit: 2 }];

  // ============================================================
  // SHEET 4: RAB
  // ============================================================
  const rab = wb.addWorksheet('RAB', { properties: { tabColor: { argb: 'FFD97706' } } });
  rab.columns = [
    { width: 5 }, { width: 35 }, { width: 28 }, { width: 12 },
    { width: 12 }, { width: 18 }, { width: 20 }, { width: 25 }
  ];

  rab.mergeCells('A1:H1');
  rab.getCell('A1').value = 'RENCANA ANGGARAN BIAYA (RAB)';
  rab.getCell('A1').style = headerStyle(DARK_BLUE);
  rab.getRow(1).height = 30;

  const rabHdr = ['No', 'Uraian Kegiatan', 'Program/Kegiatan', 'Volume', 'Satuan', 'Harga Satuan (Rp)', 'Total (Rp)', 'Keterangan'];
  const rh = rab.addRow(rabHdr);
  rh.height = 30;
  rh.eachCell(c => { c.style = headerStyle(DARK_BLUE); });

  for (let i = 3; i <= 52; i++) {
    const row = rab.addRow([i - 2, '', '', 1, '', 0, { formula: `D${i}*F${i}` }, '']);
    row.height = 20;
    row.eachCell((c, cn) => {
      c.border = cellBorder();
      if (cn === 6 || cn === 7) c.numFmt = IDR0;
    });
  }

  const rabTot = rab.addRow(['', '', '', '', '', 'TOTAL RAB', { formula: 'SUM(G3:G52)' }, '']);
  rabTot.height = 25;
  rabTot.eachCell((c, cn) => {
    c.style = {
      font: { bold: true, size: 12 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } },
      border: cellBorder()
    };
    if (cn === 7) c.numFmt = IDR0;
  });

  rab.views = [{ state: 'frozen', ySplit: 2 }];

  // ============================================================
  // SHEET 5: LAPORAN BULANAN
  // ============================================================
  const lap = wb.addWorksheet('Laporan Bulanan', { properties: { tabColor: { argb: 'FF6366F1' } } });
  lap.columns = [
    { width: 5 }, { width: 18 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 25 }
  ];

  lap.mergeCells('A1:G1');
  lap.getCell('A1').value = 'REKAP LAPORAN KEUANGAN BULANAN';
  lap.getCell('A1').style = headerStyle(DARK_BLUE);
  lap.getRow(1).height = 30;

  const lapHdr = ['No', 'Bulan', 'Total Pemasukan', 'Total Pengeluaran', 'Surplus / Defisit', '% Realisasi', 'Keterangan'];
  const lh = lap.addRow(lapHdr);
  lh.height = 28;
  lh.eachCell(c => { c.style = headerStyle(DARK_BLUE); });

  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  months.forEach((m, idx) => {
    const r = 3 + idx;
    const row = lap.addRow([idx + 1, m, 0, 0, { formula: `C${r}-D${r}` }, 0, '']);
    row.height = 20;
    row.eachCell((c, cn) => {
      c.border = cellBorder();
      if (cn === 3 || cn === 4 || cn === 5) c.numFmt = IDR0;
      if (cn === 6) c.numFmt = '0.0"%"';
    });
  });

  const lapTot = lap.addRow(['', 'TOTAL TAHUNAN',
    { formula: 'SUM(C3:C14)' }, { formula: 'SUM(D3:D14)' }, { formula: 'C15-D15' }, '', ''
  ]);
  lapTot.height = 25;
  lapTot.eachCell((c, cn) => {
    c.style = {
      font: { bold: true, size: 12 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } },
      border: cellBorder()
    };
    if (cn === 3 || cn === 4 || cn === 5) c.numFmt = IDR0;
  });

  lap.views = [{ state: 'frozen', ySplit: 2 }];

  // ============================================================
  // SHEET 6: DASHBOARD
  // ============================================================
  const dash = wb.addWorksheet('Dashboard', { properties: { tabColor: { argb: 'FF8B5CF6' } } });
  dash.columns = [
    { width: 3 }, { width: 24 }, { width: 22 }, { width: 22 }, { width: 22 }, { width: 22 }, { width: 3 }
  ];

  dash.getRow(1).height = 15;

  dash.mergeCells('B2:F2');
  dash.getCell('B2').value = 'DASHBOARD KEUANGAN ORGANISASI';
  dash.getCell('B2').style = headerStyle(DARK_BLUE);
  dash.getRow(2).height = 40;

  dash.mergeCells('B3:F3');
  dash.getCell('B3').value = { formula: 'CONCATENATE("Organisasi: ",Cover!C4,"  |  Periode: ",Cover!C8)' };
  dash.getCell('B3').style = {
    font: { italic: true, size: 11, color: { argb: 'FF57606A' } },
    alignment: { horizontal: 'center' },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F8FA' } },
    border: cellBorder()
  };
  dash.getRow(3).height = 22;

  dash.getRow(4).height = 15;

  // Summary boxes: Pemasukan, Pengeluaran, Saldo
  const summaryData = [
    { col: 'B', label: 'TOTAL PEMASUKAN', formula: "'Laporan Bulanan'!C15", bg: LIGHT_GREEN },
    { col: 'C', label: 'TOTAL PENGELUARAN', formula: "'Laporan Bulanan'!D15", bg: LIGHT_RED },
    { col: 'D', label: 'SALDO BERSIH', formula: "'Laporan Bulanan'!E15", bg: LIGHT_BLUE },
    { col: 'E', label: 'TOTAL RAB', formula: "RAB!G53", bg: 'FEF3C7' },
    { col: 'F', label: 'JML KEGIATAN', formula: "COUNTA(Kegiatan!B3:B32)", bg: 'F3E8FF' },
  ];

  summaryData.forEach(s => {
    const labelCell = dash.getCell(`${s.col}5`);
    labelCell.value = s.label;
    labelCell.style = {
      font: { bold: true, size: 10, color: { argb: 'FF57606A' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + s.bg } },
      alignment: { horizontal: 'center' }, border: cellBorder()
    };
    dash.getRow(5).height = 22;

    const valCell = dash.getCell(`${s.col}6`);
    valCell.value = { formula: s.formula };
    if (s.col !== 'F') valCell.numFmt = IDR0;
    valCell.style = {
      font: { bold: true, size: 14 },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + s.bg } },
      alignment: { horizontal: 'center', vertical: 'middle' }, border: cellBorder()
    };
    dash.getRow(6).height = 38;
  });

  dash.getRow(7).height = 15;

  // Petunjuk
  dash.mergeCells('B8:F8');
  dash.getCell('B8').value = 'PETUNJUK: Isi data di sheet "Buku Kas", "Kegiatan", dan "RAB". Dashboard ini otomatis terupdate.';
  dash.getCell('B8').style = {
    font: { italic: true, size: 10, color: { argb: 'FFDC2626' } },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3CD' } },
    border: cellBorder(), alignment: { wrapText: true }
  };
  dash.getRow(8).height = 30;

  dash.getRow(9).height = 10;

  // Rekap per bulan
  dash.mergeCells('B10:F10');
  dash.getCell('B10').value = 'REKAP PER BULAN';
  dash.getCell('B10').style = headerStyle('3B82F6');
  dash.getRow(10).height = 26;

  const dashColHdr = ['Bulan', 'Pemasukan', 'Pengeluaran', 'Saldo', 'Status'];
  ['B','C','D','E','F'].forEach((col, idx) => {
    dash.getCell(`${col}11`).value = dashColHdr[idx];
    dash.getCell(`${col}11`).style = headerStyle(DARK_BLUE);
  });
  dash.getRow(11).height = 24;

  months.forEach((m, idx) => {
    const r = 12 + idx;
    dash.getCell(`B${r}`).value = m;
    dash.getCell(`C${r}`).value = { formula: `'Laporan Bulanan'!C${3+idx}` };
    dash.getCell(`D${r}`).value = { formula: `'Laporan Bulanan'!D${3+idx}` };
    dash.getCell(`E${r}`).value = { formula: `C${r}-D${r}` };
    dash.getCell(`F${r}`).value = { formula: `IF(E${r}>0,"Surplus",IF(E${r}<0,"Defisit","Seimbang"))` };
    dash.getRow(r).height = 20;
    ['B','C','D','E','F'].forEach(col => { dash.getCell(`${col}${r}`).border = cellBorder(); });
    ['C','D','E'].forEach(col => { dash.getCell(`${col}${r}`).numFmt = IDR0; });
    dash.getCell(`B${r}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF7F8FA' } };
  });

  // ============================================================
  // WRITE FILE
  // ============================================================
  await wb.xlsx.writeFile('organisasi-keuangan/Template_Keuangan_Organisasi.xlsx');
  console.log('Done! Excel created at organisasi-keuangan/Template_Keuangan_Organisasi.xlsx');
}

main().catch(e => { console.error(e); process.exit(1); });
