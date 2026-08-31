-- ============================================================
-- BEM FKIP Kabinet Progresio — Supabase Schema Setup
-- Jalankan di: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- BERITA
create table if not exists berita (
  id bigint generated always as identity primary key,
  judul text not null,
  kategori text default 'Umum',
  tanggal text,
  penulis text,
  isi text,
  icon text default '📢',
  featured boolean default false,
  created_at timestamptz default now()
);

-- KEGIATAN
create table if not exists kegiatan (
  id bigint generated always as identity primary key,
  nama text not null,
  tanggal text,
  tempat text,
  dept text,
  status text default 'rencana',
  icon text default '📋',
  created_at timestamptz default now()
);

-- PROKER
create table if not exists proker (
  id bigint generated always as identity primary key,
  nama text not null,
  dept text,
  waktu text,
  pct integer default 0,
  status text default 'rencana',
  created_at timestamptz default now()
);

-- PENGUMUMAN
create table if not exists pengumuman (
  id bigint generated always as identity primary key,
  judul text not null,
  tanggal text,
  isi text,
  tag text default '',
  created_at timestamptz default now()
);

-- NOTULENSI
create table if not exists notulensi (
  id bigint generated always as identity primary key,
  judul text not null,
  tanggal text,
  peserta text,
  file text default '',
  created_at timestamptz default now()
);

-- ASPIRASI
create table if not exists aspirasi (
  id bigint generated always as identity primary key,
  nama text default 'Anonim',
  kategori text default 'Umum',
  pesan text not null,
  tanggal text,
  status text default 'baru',
  created_at timestamptz default now()
);

-- ============================================================
-- Allow public read + write (tanpa RLS — cocok untuk setup awal)
-- ============================================================
alter table berita     enable row level security;
alter table kegiatan   enable row level security;
alter table proker     enable row level security;
alter table pengumuman enable row level security;
alter table notulensi  enable row level security;
alter table aspirasi   enable row level security;

-- Policy: izinkan semua operasi dari anon key
create policy "public all" on berita     for all using (true) with check (true);
create policy "public all" on kegiatan   for all using (true) with check (true);
create policy "public all" on proker     for all using (true) with check (true);
create policy "public all" on pengumuman for all using (true) with check (true);
create policy "public all" on notulensi  for all using (true) with check (true);
create policy "public all" on aspirasi   for all using (true) with check (true);

-- ============================================================
-- Seed data awal
-- ============================================================
insert into berita (judul, kategori, tanggal, penulis, isi, icon, featured) values
  ('Seminar Nasional Pendidikan 2025 Sukses Digelar', 'Akademik', '15 Mar 2026', 'Kominfo', 'BEM FKIP Kabinet Progresio berhasil menyelenggarakan Seminar Nasional Pendidikan bertema "Transformasi Pendidikan di Era Digital" di Aula Utama UNUC. Dihadiri lebih dari 400 peserta dari berbagai perguruan tinggi.', '🎓', true),
  ('Bakti Sosial Progresio Sentuh 150 Keluarga', 'Sosial', '2 Mar 2026', 'Dept. Advokasi', 'Divisi Advokasi & Kesejahteraan BEM FKIP mengadakan bakti sosial dengan mendistribusikan paket alat tulis dan bimbingan belajar gratis di Desa Sumber, Cirebon.', '🤝', false),
  ('Open Rekrutmen Panitia Festival Seni 2026', 'Pengumuman', '28 Apr 2026', 'Sekretaris', 'BEM FKIP membuka kesempatan bagi seluruh mahasiswa FKIP aktif untuk bergabung sebagai panitia Festival Seni & Budaya yang akan digelar pada semester genap.', '📢', false);

insert into kegiatan (nama, tanggal, tempat, dept, status, icon) values
  ('Seminar Nasional Pendidikan 2026', '2026-03-15', 'Aula Utama UNUC', 'Pendidikan', 'selesai', '🎓'),
  ('Bakti Sosial Progresio', '2026-03-02', 'Desa Sumber, Cirebon', 'Advokasi', 'selesai', '🤝'),
  ('Festival Seni & Budaya FKIP', 'Agustus 2026', 'Kampus UNUC', 'Minat & Bakat', 'rencana', '🎭'),
  ('Kajian Keagamaan Rutin', 'Setiap Jumat', 'Mushola FKIP', 'Keagamaan', 'berjalan', '🕌');

insert into proker (nama, dept, waktu, pct, status) values
  ('Gerakan Literasi FKIP', 'Pendidikan', 'Mar–Apr 2026', 100, 'selesai'),
  ('Seminar Nasional Pendidikan', 'Pendidikan', 'Mar 2026', 100, 'selesai'),
  ('Bakti Sosial Progresio', 'Advokasi', 'Mar 2026', 100, 'selesai'),
  ('Kajian Keagamaan Rutin', 'Keagamaan', 'Sepanjang Tahun', 60, 'berjalan'),
  ('Festival Seni & Budaya FKIP', 'Minat & Bakat', 'Agustus 2026', 20, 'rencana'),
  ('Jaringan Alumni & Mitra', 'Jaringan', 'Q2–Q3 2026', 10, 'rencana');

insert into pengumuman (judul, tanggal, isi, tag) values
  ('Open Rekrutmen Panitia Festival Seni 2026', '28 Apr 2026', 'Pendaftaran dibuka untuk mahasiswa FKIP aktif. Formulir di sekretariat BEM FKIP.', 'Baru'),
  ('Rapat Koordinasi Bulanan — April 2026', '10 Apr 2026', 'Jumat, 12 April 2026 pukul 15.00 WIB di Ruang Rapat FKIP.', ''),
  ('Jadwal Kegiatan Semester Genap 2025/2026', '1 Mar 2026', 'Kalender kegiatan resmi BEM FKIP semester genap telah ditetapkan.', '');

insert into notulensi (judul, tanggal, peserta) values
  ('Notulensi Rapat Koordinasi Bulanan — April 2026', '12 Apr 2026', '38 pengurus'),
  ('Notulensi Rapat Koordinasi Bulanan — Maret 2026', '14 Mar 2026', '42 pengurus'),
  ('Notulensi Rapat Pleno — Penyusunan Proker 2026', '11 Jan 2026', 'Seluruh pengurus');
