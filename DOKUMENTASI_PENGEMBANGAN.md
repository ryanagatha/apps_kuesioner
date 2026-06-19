# 📄 Dokumentasi Pengembangan & Panduan Modifikasi Kuesioner AHP e-Audit

Dokumen ini mencatat seluruh pekerjaan yang telah dilakukan dalam membangun sistem kuesioner AHP online dan memberikan panduan bagi tim pengembang/akademik jika ingin melakukan modifikasi di masa mendatang.

---

## 🛠️ 1. Apa yang Telah Kita Lakukan (Recap Pekerjaan)

Kami telah membangun aplikasi web kuesioner pengambilan keputusan pakar menggunakan metode **Analytic Hierarchy Process (AHP)** secara end-to-end dengan fitur-fitur berikut:

1. **Frontend Modern (React + Vite + Tailwind CSS v4)**:
   - Dibuat menggunakan arsitektur wizard multi-step yang responsif.
   - Desain profesional bertema Navy/White dengan font **Segoe UI** agar selaras dengan dokumen rancangan penelitian Anda.
   - Menggunakan ikon modern dari library **Lucide React**.

2. **Mesin Kalkulasi AHP Lokal (Real-time)**:
   - Kode perhitungan di `src/utils/ahp.js` secara otomatis menghitung bobot prioritas lokal & global menggunakan metode *Geometric Mean*.
   - Melakukan kalkulasi *Consistency Ratio* (CR) secara real-time pada setiap sesi pengisian perbandingan berpasangan alternatif dan subkriteria.
   - Memunculkan peringatan otomatis jika $CR > 0.10$ untuk meminimalkan data tidak konsisten dari pakar sebelum data dikirim.

3. **Penyimpanan Handal (Autosave & Backup)**:
   - Integrasi `localStorage` otomatis menyimpan progres jawaban responden di setiap klik "Lanjut", sehingga responden bebas menutup browser dan melanjutkan kapan saja (*Resume Session*).
   - Menyediakan fitur ekspor data cadangan ke format **JSON** dan **CSV** langsung dari browser di halaman sukses.

4. **Integrasi Google Sheets Tanpa Hambatan (Batch-Write API)**:
   - Membuat script Google Apps Script (`google_apps_script.js`) yang bertindak sebagai API backend.
   - **Optimasi Kecepatan**: Menggunakan penulisan data secara kelompok (*Batch Write/setValues*) sehingga pengiriman 141 baris perbandingan berpasangan dari browser ke Google Sheets selesai dalam waktu kurang dari 1 detik.
   - **Self-Initializing**: Backend secara otomatis membuat sheet `Responden_Rekap` dan `Pairwise_Raw` beserta seluruh kolomnya saat ada data yang dikirim pertama kali.

5. **Deployment Online (GitHub Pages)**:
   - Repository git lokal telah dikonfigurasi dan dihubungkan ke GitHub Anda (`ryanagatha/apps_kuesioner`).
   - Web kuesioner resmi dipublikasikan secara online di: **[https://ryanagatha.github.io/apps_kuesioner/](https://ryanagatha.github.io/apps_kuesioner/)**

---

## 📂 2. Peta File Penting (File Mapping)

Jika tim Anda ingin mengedit kode, berikut adalah file-file yang perlu diperhatikan:
* ⚙️ **`src/data/constants.js`**: Tempat menyimpan seluruh teks kriteria, subkriteria, alternatif, skala Saaty, dan pertanyaan terbuka.
* 🧮 **`src/utils/ahp.js`**: Logika matematika perhitungan bobot AHP dan rumus *Consistency Ratio*.
* 🌐 **`src/App.jsx`**: Pusat navigasi step kuesioner, logika penyimpanan lokal, dan URL tujuan pengiriman Google Sheets (`GOOGLE_SHEET_WEBAPP_URL` di baris ke-23).
* 📝 **`google_apps_script.js`**: Kode backend yang disalin ke Extensions > Apps Script pada Google Sheets Anda.
* 🖥️ **`src/components/`**: Berisi seluruh file tampilan antarmuka (Landing, Profil, Validasi, Perbandingan, Review, dan Halaman Sukses).

---

## 💡 3. Panduan Modifikasi untuk Tim di Masa Depan

### Skenario A: Hanya Mengedit Kata-Kata / Redaksional (Typo, Terjemahan, Kalimat)
**TIDAK PERLU mengubah Google Sheets atau Apps Script.**

**Langkah-langkah:**
1. Buka file `src/data/constants.js`.
2. Edit teks di dalam variabel `CRITERIA`, `SUBCRITERIA`, `ALTERNATIVES`, atau `OPEN_QUESTIONS`. Jangan mengubah struktur `code` (seperti `'K1'`, `'K1.1'`) atau `id`.
3. Simpan file tersebut.
4. Jalankan perintah deploy di terminal Anda:
   ```bash
   npm run deploy
   ```
5. Tunggu 1 menit, dan perubahan teks Anda akan langsung live di github.io.

---

### Skenario B: Mengubah Jumlah Kriteria, Subkriteria, atau Alternatif (Ubah Struktur AHP)
**WAJIB mengubah Google Sheets & Apps Script karena struktur matematika matriks berubah.**

**Langkah-langkah:**
1. **Edit Kode React (Konfigurasi Data)**:
   - Buka `src/data/constants.js`.
   - Tambah atau kurangi objek di dalam array `CRITERIA`, `SUBCRITERIA`, atau `ALTERNATIVES`. Pastikan kode penomoran unik (misal: `K7`, `K1.4`, atau `Stack E`).
2. **Edit Kode Google Apps Script (Header Kolom)**:
   - Buka file `google_apps_script.js` di proyek Anda.
   - Pada fungsi `initializeSheetHeaders(sheet, type)`, sesuaikan daftar array header untuk `"rekap"` agar mencakup kode baru Anda.
     - Jika menambah subkriteria, tambahkan kodenya di dalam variabel `subIndices`.
     - Jika menambah alternatif, tambahkan kodenya di dalam variabel `altCodes`.
   - Salin seluruh kode baru tersebut.
3. **Perbarui Apps Script di Google Sheets**:
   - Buka Google Sheets Anda > **Ekstensi** > **Apps Script**.
   - Hapus kode lama, paste kode baru, lalu klik **Simpan**.
   - Klik **Terapkan (Deploy)** > **Kelola penerapan (Manage deployments)**.
   - Klik **ikon Pensil (Edit)** > pilih **Versi baru (New Version)** pada dropdown Versi > klik **Terapkan (Deploy)**.
4. **Deploy Website Baru**:
   - Jalankan perintah deploy di terminal laptop Anda:
     ```bash
     npm run deploy
     ```

---

### Skenario C: Menambah Pertanyaan Terbuka (Esai Baru)
**WAJIB mengubah Google Sheets & Apps Script.**

**Langkah-langkah:**
1. Buka `src/data/constants.js`. Tambahkan objek baru pada array `OPEN_QUESTIONS` dengan ID baru (misal: `open_q6`).
2. Buka `google_apps_script.js`.
   - Pada fungsi `initializeSheetHeaders`, sesuaikan loop penambahan header kolom agar mengulang hingga jumlah baru (misal: ganti `j <= 5` menjadi `j <= 6`).
   - Pada fungsi `writeRekapRow`, lakukan hal yang sama pada loop penulisan data `openQ["open_q" + j]`.
3. Salin kode baru tersebut ke Apps Script Google Sheets Anda, lalu lakukan **Deploy > Versi Baru** (seperti pada Skenario B).
4. Jalankan perintah `npm run deploy` di terminal laptop Anda.
