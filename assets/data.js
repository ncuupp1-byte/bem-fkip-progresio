/**
 * BEM FKIP Progresio — Shared Data Store
 * Backend: Supabase (PostgreSQL)
 * Fallback: localStorage (offline / demo)
 */

// ── SUPABASE CONFIG ───────────────────────────────────────────────
const SUPABASE_URL = 'https://lqdhaphbclxyaladtvqj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxZGhhcGhiY2x4eWFsYWR0dnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNTI3MTUsImV4cCI6MjEwMzcyODcxNX0.G1C8RczKu1PlVMoOJi1-UvdJe0bwnHENpFKbpTAyX8E';

// ── SUPABASE REST HELPERS ─────────────────────────────────────────
const SB = {
  headers: {
    'apikey': SUPABASE_KEY,
    'Authorization': 'Bearer ' + SUPABASE_KEY,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  },

  url(table, params) {
    return SUPABASE_URL + '/rest/v1/' + table + (params ? '?' + params : '');
  },

  async get(table, params) {
    try {
      const res = await fetch(this.url(table, params || 'order=id.asc'), {
        headers: this.headers
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.warn('[SB.get] fallback localStorage:', table, e);
      return null;
    }
  },

  async insert(table, data) {
    try {
      const res = await fetch(this.url(table), {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.error('[SB.insert]', table, e);
      return null;
    }
  },

  async update(table, id, data) {
    try {
      const res = await fetch(this.url(table, 'id=eq.' + id), {
        method: 'PATCH',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.error('[SB.update]', table, e);
      return null;
    }
  },

  async delete(table, id) {
    try {
      const res = await fetch(this.url(table, 'id=eq.' + id), {
        method: 'DELETE',
        headers: this.headers
      });
      if (!res.ok) throw new Error(await res.text());
      return true;
    } catch (e) {
      console.error('[SB.delete]', table, e);
      return false;
    }
  },

  async upsert(table, data) {
    try {
      const res = await fetch(this.url(table), {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (e) {
      console.error('[SB.upsert]', table, e);
      return null;
    }
  }
};

// ── BEM OBJECT ────────────────────────────────────────────────────
const BEM = {
  // ── KREDENSIAL ADMIN (tetap di client — tidak ada sensitive data) ─
  USERS: [
    {
      username: 'ketua',
      password: 'progresio2026',
      role: 'ketua',
      label: 'Ketua BEM FKIP',
      name: 'Muhammad Supian',
      access: ['dashboard','profil','berita','kegiatan','keuangan','notulensi','dokumen','aspirasi','pengurus','proker']
    },
    {
      username: 'sekretaris',
      password: 'sekret2026',
      role: 'sekretaris',
      label: 'Sekretaris Umum',
      name: 'Mohamad Ade Rizqi',
      access: ['dashboard','berita','notulensi','dokumen','pengumuman']
    },
    {
      username: 'bendahara',
      password: 'keuangan2026',
      role: 'bendahara',
      label: 'Bendahara Umum',
      name: 'Nazwa Rizkika Amalia',
      access: ['dashboard','keuangan']
    },
    {
      username: 'dept.pendidikan',
      password: 'pendidikan2026',
      role: 'departemen',
      label: 'Dept. Pendidikan',
      name: 'Purnamawati Salama',
      dept: 'Pendidikan',
      access: ['dashboard','kegiatan','proker']
    },
    {
      username: 'dept.minatbakat',
      password: 'minatbakat2026',
      role: 'departemen',
      label: 'Dept. Minat & Bakat',
      name: 'Syamsudin',
      dept: 'Minat & Bakat',
      access: ['dashboard','kegiatan','proker']
    },
    {
      username: 'dept.advokasi',
      password: 'advokasi2026',
      role: 'departemen',
      label: 'Dept. Advokasi & Kesejahteraan',
      name: 'Muhammad Rijal',
      dept: 'Advokasi',
      access: ['dashboard','aspirasi','kegiatan','proker']
    },
    {
      username: 'dept.kominfo',
      password: 'kominfo2026',
      role: 'departemen',
      label: 'Dept. Komunikasi & Informasi',
      name: 'Miftahussurur',
      dept: 'Kominfo',
      access: ['dashboard','berita','pengurus','kegiatan']
    },
    {
      username: 'dept.keagamaan',
      password: 'keagamaan2026',
      role: 'departemen',
      label: 'Dept. Keagamaan',
      name: 'Neng Nurul Amaliah',
      dept: 'Keagamaan',
      access: ['dashboard','kegiatan','proker']
    },
    {
      username: 'dept.jaringan',
      password: 'jaringan2026',
      role: 'departemen',
      label: 'Dept. Jaringan & Relasi',
      name: 'David Muhammad',
      dept: 'Jaringan',
      access: ['dashboard','berita','kegiatan']
    }
  ],

  // ── AUTH HELPERS ─────────────────────────────────────────────────
  login(username, password) {
    const user = this.USERS.find(u => u.username === username && u.password === password);
    if (user) {
      sessionStorage.setItem('bem_user', JSON.stringify(user));
      return user;
    }
    return null;
  },
  logout() {
    sessionStorage.removeItem('bem_user');
    window.location.href = 'login.html';
  },
  currentUser() {
    const raw = sessionStorage.getItem('bem_user');
    return raw ? JSON.parse(raw) : null;
  },
  requireAuth(neededAccess) {
    const user = this.currentUser();
    if (!user) { window.location.href = 'login.html'; return null; }
    if (neededAccess && !user.access.includes(neededAccess)) {
      alert('Akses ditolak. Halaman ini tidak tersedia untuk role Anda.');
      window.location.href = 'index.html';
      return null;
    }
    return user;
  },
  canAccess(key) {
    const user = this.currentUser();
    return user && user.access.includes(key);
  },

  // ── DATA HELPERS (Supabase primary, localStorage fallback) ────────

  /** Baca semua data dari tabel Supabase */
  async getData(table) {
    const rows = await SB.get(table);
    if (rows !== null) return rows;
    // fallback ke localStorage
    const raw = localStorage.getItem('bem_' + table);
    return raw ? JSON.parse(raw) : [];
  },

  /** Simpan (insert) satu baris ke Supabase */
  async insertData(table, data) {
    // Hapus field id agar Supabase generate sendiri
    const { id, ...payload } = data;
    const result = await SB.insert(table, payload);
    return result;
  },

  /** Update satu baris di Supabase by id */
  async updateData(table, id, data) {
    const { id: _id, created_at, ...payload } = data;
    return await SB.update(table, id, payload);
  },

  /** Hapus satu baris di Supabase by id */
  async deleteData(table, id) {
    return await SB.delete(table, id);
  },

  // ── PENGURUS: tetap localStorage (data tidak sering berubah) ──────
  getPengurus() {
    const raw = localStorage.getItem('bem_pengurus');
    return raw ? JSON.parse(raw) : PENGURUS_DEFAULT;
  },
  setPengurus(val) {
    localStorage.setItem('bem_pengurus', JSON.stringify(val));
  },

  // ── LEGACY sync helpers (dipakai halaman lama, auto-async wrapper) ─
  /** @deprecated Gunakan getData() async */
  getDataSync(key) {
    const raw = localStorage.getItem('bem_' + key);
    return raw ? JSON.parse(raw) : null;
  },
  /** @deprecated Gunakan insertData/updateData/deleteData */
  setData(key, val) {
    localStorage.setItem('bem_' + key, JSON.stringify(val));
  },

  // ── INIT (seed localStorage fallback jika belum ada) ─────────────
  initDefaults() {
    if (!localStorage.getItem('bem_inited_v2')) {
      localStorage.setItem('bem_berita',     JSON.stringify(BERITA_DEFAULT));
      localStorage.setItem('bem_kegiatan',   JSON.stringify(KEGIATAN_DEFAULT));
      localStorage.setItem('bem_proker',     JSON.stringify(PROKER_DEFAULT));
      localStorage.setItem('bem_pengumuman', JSON.stringify(PENGUMUMAN_DEFAULT));
      localStorage.setItem('bem_notulensi',  JSON.stringify(NOTULENSI_DEFAULT));
      localStorage.setItem('bem_pengurus',   JSON.stringify(PENGURUS_DEFAULT));
      localStorage.setItem('bem_inited_v2',  'true');
    }
  }
};

// ── DEFAULT DATASETS (fallback offline) ──────────────────────────

const PENGURUS_DEFAULT = {
  pelindung: 'Prof. Dr. H. Farihin Nur, M.Pd.',
  penasehat: 'Dr. Mikkey Anggara Suganda, M. Or',
  bph: [
    { jabatan: 'Ketua (Gubernur)', nama: 'Muhammad Supian', nim: '0501241009', prodi: 'FKIP' },
    { jabatan: 'Wakil Ketua', nama: 'Khoirunnisa', nim: '', prodi: 'FKIP' },
    { jabatan: 'Sekretaris I', nama: 'Mohamad Ade Rizqi', nim: '', prodi: 'FKIP' },
    { jabatan: 'Sekretaris II', nama: 'Azzahra Ramadani', nim: '', prodi: 'FKIP' },
    { jabatan: 'Bendahara I', nama: 'Nazwa Rizkika Amalia', nim: '', prodi: 'FKIP' },
    { jabatan: 'Bendahara II', nama: 'Maiatus Soburoh', nim: '', prodi: 'FKIP' }
  ],
  departemen: [
    { nama: 'Departemen Pendidikan', kepala: 'Purnamawati Salama', anggota: ['Intan Nuraini', 'Zelda Fadiyah El Salsabila'] },
    { nama: 'Departemen Minat & Bakat', kepala: 'Syamsudin', anggota: [] },
    { nama: 'Departemen Advokasi & Kesejahteraan', kepala: 'Muhammad Rijal', anggota: ['Zatin Nisya'] },
    { nama: 'Departemen Komunikasi & Informasi', kepala: 'Miftahussurur', anggota: ['Fatkurrohman'] },
    { nama: 'Departemen Keagamaan', kepala: 'Neng Nurul Amaliah', anggota: ['Siti Rahmah', 'Khaulatul Maula'] },
    { nama: 'Departemen Jaringan & Relasi', kepala: 'David Muhammad', anggota: [] }
  ]
};

const BERITA_DEFAULT = [
  { id: 1, judul: 'Seminar Nasional Pendidikan 2025 Sukses Digelar', kategori: 'Akademik', tanggal: '15 Mar 2026', penulis: 'Kominfo', isi: 'BEM FKIP Kabinet Progresio berhasil menyelenggarakan Seminar Nasional Pendidikan bertema "Transformasi Pendidikan di Era Digital" di Aula Utama UNUC.', icon: '🎓', featured: true },
  { id: 2, judul: 'Bakti Sosial Progresio Sentuh 150 Keluarga', kategori: 'Sosial', tanggal: '2 Mar 2026', penulis: 'Dept. Advokasi', isi: 'Divisi Advokasi & Kesejahteraan BEM FKIP mengadakan bakti sosial di Desa Sumber, Cirebon.', icon: '🤝', featured: false },
  { id: 3, judul: 'Open Rekrutmen Panitia Festival Seni 2026', kategori: 'Pengumuman', tanggal: '28 Apr 2026', penulis: 'Sekretaris', isi: 'BEM FKIP membuka kesempatan bagi seluruh mahasiswa FKIP aktif untuk bergabung sebagai panitia.', icon: '📢', featured: false }
];

const KEGIATAN_DEFAULT = [
  { id: 1, nama: 'Seminar Nasional Pendidikan 2026', tanggal: '2026-03-15', tempat: 'Aula Utama UNUC', dept: 'Pendidikan', status: 'selesai', icon: '🎓' },
  { id: 2, nama: 'Bakti Sosial Progresio', tanggal: '2026-03-02', tempat: 'Desa Sumber, Cirebon', dept: 'Advokasi', status: 'selesai', icon: '🤝' },
  { id: 3, nama: 'Festival Seni & Budaya FKIP', tanggal: 'Agustus 2026', tempat: 'Kampus UNUC', dept: 'Minat & Bakat', status: 'rencana', icon: '🎭' },
  { id: 4, nama: 'Kajian Keagamaan Rutin', tanggal: 'Setiap Jumat', tempat: 'Mushola FKIP', dept: 'Keagamaan', status: 'berjalan', icon: '🕌' }
];

const PROKER_DEFAULT = [
  { id: 1, nama: 'Gerakan Literasi FKIP', dept: 'Pendidikan', waktu: 'Mar–Apr 2026', pct: 100, status: 'selesai' },
  { id: 2, nama: 'Seminar Nasional Pendidikan', dept: 'Pendidikan', waktu: 'Mar 2026', pct: 100, status: 'selesai' },
  { id: 3, nama: 'Bakti Sosial Progresio', dept: 'Advokasi', waktu: 'Mar 2026', pct: 100, status: 'selesai' },
  { id: 4, nama: 'Kajian Keagamaan Rutin', dept: 'Keagamaan', waktu: 'Sepanjang Tahun', pct: 60, status: 'berjalan' },
  { id: 5, nama: 'Festival Seni & Budaya FKIP', dept: 'Minat & Bakat', waktu: 'Agustus 2026', pct: 20, status: 'rencana' },
  { id: 6, nama: 'Jaringan Alumni & Mitra', dept: 'Jaringan', waktu: 'Q2–Q3 2026', pct: 10, status: 'rencana' }
];

const PENGUMUMAN_DEFAULT = [
  { id: 1, judul: 'Open Rekrutmen Panitia Festival Seni 2026', tanggal: '28 Apr 2026', isi: 'Pendaftaran dibuka untuk mahasiswa FKIP aktif. Formulir di sekretariat BEM FKIP.', tag: 'Baru' },
  { id: 2, judul: 'Rapat Koordinasi Bulanan — April 2026', tanggal: '10 Apr 2026', isi: 'Jumat, 12 April 2026 pukul 15.00 WIB di Ruang Rapat FKIP.', tag: '' },
  { id: 3, judul: 'Jadwal Kegiatan Semester Genap 2025/2026', tanggal: '1 Mar 2026', isi: 'Kalender kegiatan resmi BEM FKIP semester genap telah ditetapkan.', tag: '' }
];

const NOTULENSI_DEFAULT = [
  { id: 1, judul: 'Notulensi Rapat Koordinasi Bulanan — April 2026', tanggal: '12 Apr 2026', peserta: '38 pengurus', file: '' },
  { id: 2, judul: 'Notulensi Rapat Koordinasi Bulanan — Maret 2026', tanggal: '14 Mar 2026', peserta: '42 pengurus', file: '' },
  { id: 3, judul: 'Notulensi Rapat Pleno — Penyusunan Proker 2026', tanggal: '11 Jan 2026', peserta: 'Seluruh pengurus', file: '' }
];

// Auto-init fallback
BEM.initDefaults();
