/**
 * Admin UI Shell Builder — dipakai oleh semua halaman admin
 * Call: initAdminShell(user, activeKey, pageTitle)
 */

const NAV_ITEMS = [
  { section: 'Umum' },
  { key: 'dashboard', icon: '🏠', label: 'Dashboard', href: 'index.html' },
  { section: 'Konten' },
  { key: 'berita', icon: '📰', label: 'Berita & Pengumuman', href: 'berita.html' },
  { key: 'kegiatan', icon: '📅', label: 'Kegiatan & Proker', href: 'kegiatan.html' },
  { section: 'Organisasi' },
  { key: 'pengurus', icon: '👥', label: 'Data Pengurus', href: 'pengurus.html' },
  { key: 'aspirasi', icon: '💬', label: 'Aspirasi Masuk', href: 'aspirasi.html' },
  { key: 'keuangan', icon: '💰', label: 'Keuangan', href: '../organisasi-keuangan/index.html' },
  { section: 'Dokumen' },
  { key: 'notulensi', icon: '📝', label: 'Notulensi', href: 'notulensi.html' },
];

function initAdminShell(user, activeKey, pageTitle) {
  // Build sidebar HTML
  let navHTML = '';
  NAV_ITEMS.forEach(item => {
    if (item.section) {
      navHTML += `<div class="nav-section">${item.section}</div>`;
      return;
    }
    const isActive = item.key === activeKey;
    const hasAccess = BEM.canAccess(item.key);
    navHTML += `<a href="${hasAccess ? item.href : '#'}" class="nav-item${isActive ? ' active' : ''}${!hasAccess ? ' locked' : ''}" ${!hasAccess ? 'onclick="return false"' : ''}>
      <span class="nav-icon">${item.icon}</span>${item.label}${!hasAccess ? ' 🔒' : ''}
    </a>`;
  });

  document.getElementById('app').innerHTML = `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <img id="sb-logo1" style="height:32px;width:32px;object-fit:contain" alt="BEM"/>
        <img id="sb-logo2" style="height:32px;width:32px;object-fit:contain;margin-left:4px" alt="Progresio"/>
        <div class="sidebar-brand-text">
          <div class="org">BEM FKIP</div>
          <div class="kab">Kabinet Progresio</div>
        </div>
      </div>
      <div class="sidebar-user">
        <div class="uname">${user.name}</div>
        <div class="urole">${user.label}</div>
      </div>
      <nav class="sidebar-nav">${navHTML}</nav>
      <div class="sidebar-footer">
        <button class="logout-btn" onclick="BEM.logout()">🚪 Keluar</button>
      </div>
    </aside>
    <div class="main">
      <div class="topbar">
        <div class="topbar-title">${pageTitle}</div>
        <div class="topbar-right">
          <span>${user.name}</span>
          <a href="../index.html" class="btn btn-outline" style="font-size:11px">← Lihat Website</a>
        </div>
      </div>
      <div class="content" id="adminContent"></div>
    </div>
  `;

  // Inject logos
  document.getElementById('sb-logo1').src = LOGO_BEM;
  document.getElementById('sb-logo2').src = LOGO_KAB;
}

function setContent(html) {
  document.getElementById('adminContent').innerHTML = html;
}
