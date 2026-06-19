export const CRITERIA = [
  {
    code: 'K1',
    name: 'Data Connectivity and Ingestion',
    description: 'Kemampuan stack untuk mengakses, mengambil, dan menghubungkan data audit dari berbagai sumber secara efisien dan andal.'
  },
  {
    code: 'K2',
    name: 'Data Preparation and Management',
    description: 'Kemampuan stack membersihkan, mentransformasi, memanipulasi, dan mengelola data audit agar siap dianalisis.'
  },
  {
    code: 'K3',
    name: 'Audit Analytics and Testing Capability',
    description: 'Kemampuan stack menjalankan prosedur audit berbasis data untuk pengujian substantif dan kepatuhan.'
  },
  {
    code: 'K4',
    name: 'Advanced Analytics Capability',
    description: 'Kemampuan stack mendukung analitik lanjutan di luar analisis audit dasar.'
  },
  {
    code: 'K5',
    name: 'Reporting and Audit Communication',
    description: 'Kemampuan stack menyajikan hasil analisis secara jelas, komunikatif, dan dapat digunakan dalam tindak lanjut pemeriksaan.'
  },
  {
    code: 'K6',
    name: 'Governance, Security, and Operational Feasibility',
    description: 'Kemampuan stack menjamin kualitas, keamanan, keterlacakan, dan kelayakan operasional dengan keterbatasan sumber daya.'
  }
];

export const SUBCRITERIA = [
  {
    code: 'K1.1',
    parent: 'K1',
    name: 'Konektivitas ke multi-type files dan database',
    description: 'Kemampuan mengakses data dari berbagai format file dan database yang umum digunakan dalam pemeriksaan (Excel, CSV, TXT, JSON, XML, PDF terstruktur, ODBC).'
  },
  {
    code: 'K1.2',
    parent: 'K1',
    name: 'Konektivitas ke open data, API, ERP, dan cloud',
    description: 'Kemampuan menghubungkan sumber data eksternal, web API, sistem ERP (SAP/Oracle), dan penyimpanan cloud.'
  },
  {
    code: 'K1.3',
    parent: 'K1',
    name: 'Kemudahan dan keandalan proses ingestion',
    description: 'Kemampuan mengambil data secara mudah, cepat, stabil, dan minim kesalahan, termasuk adanya preview data.'
  },
  {
    code: 'K2.1',
    parent: 'K2',
    name: 'Kemampuan data shaping dan transformation',
    description: 'Kemampuan mengubah data mentah menjadi data yang siap dianalisis (cleaning, standardizing, filtering, merging, reshaping).'
  },
  {
    code: 'K2.2',
    parent: 'K2',
    name: 'Kemampuan manipulasi data audit',
    description: 'Kemampuan melakukan operasi data audit yang spesifik seperti join, split, deduplikasi, dan rekonsiliasi data skala besar.'
  },
  {
    code: 'K2.3',
    parent: 'K2',
    name: 'Efisiensi repository dan pengelolaan data',
    description: 'Kemampuan menyimpan dan mengelola data secara efisien tanpa memerlukan infrastruktur server database yang besar.'
  },
  {
    code: 'K3.1',
    parent: 'K3',
    name: 'Kemampuan analisis deskriptif dan eksploratif',
    description: 'Kemampuan melakukan profiling data, summarizing, pivoting, tabulasi, dan visualisasi cepat untuk pemahaman awal.'
  },
  {
    code: 'K3.2',
    parent: 'K3',
    name: 'Kemampuan pengujian audit spesifik',
    description: 'Mendukung teknik pengujian substantif (sampling, trend analysis, verification, Benford\'s Law, dan pengujian numerik lainnya).'
  },
  {
    code: 'K3.3',
    parent: 'K3',
    name: 'Kemampuan anomaly/risk detection',
    description: 'Kemampuan mendeteksi red flags, outlier, duplikasi tidak lazim, transaksi mencurigakan, dan pola risiko kepatuhan.'
  },
  {
    code: 'K4.1',
    parent: 'K4',
    name: 'Kemampuan text mining',
    description: 'Kemampuan mengolah teks bebas (keyword search, fuzzy join, fuzzy duplicate, clustering teks, sentiment/semantic analysis).'
  },
  {
    code: 'K4.2',
    parent: 'K4',
    name: 'Kemampuan machine learning',
    description: 'Mendukung pemodelan prediktif, clustering otomatis untuk klasifikasi risiko wajib pajak (supervised/unsupervised learning).'
  },
  {
    code: 'K4.3',
    parent: 'K4',
    name: 'Fleksibilitas pengembangan analitik lanjutan',
    description: 'Kemudahan memperluas fungsionalitas dengan script kustom (Python/R), library pihak ketiga, atau use case analitik baru.'
  },
  {
    code: 'K5.1',
    parent: 'K5',
    name: 'Kualitas visualisasi analitik',
    description: 'Kemampuan menyusun dashboard, chart interaktif, heatmap, dan representasi visual yang mempermudah interpretasi data.'
  },
  {
    code: 'K5.2',
    parent: 'K5',
    name: 'Kemudahan reporting audit',
    description: 'Kemudahan menyusun, mengekspor (PDF/Excel), dan mendokumentasikan hasil temuan audit untuk laporan resmi.'
  },
  {
    code: 'K5.3',
    parent: 'K5',
    name: 'Keterhubungan insight dengan tindak lanjut audit',
    description: 'Sejauh mana hasil analisis data dapat langsung diterjemahkan menjadi kertas kerja pemeriksaan (KKP) atau temuan formal.'
  },
  {
    code: 'K6.1',
    parent: 'K6',
    name: 'Data quality, integrity, and audit trail',
    description: 'Menjaga kualitas data, integritas bukti digital (hashing), jejak audit yang tidak bisa diubah (reproducibility).'
  },
  {
    code: 'K6.2',
    parent: 'K6',
    name: 'Access control and data protection',
    description: 'Menjamin keamanan data wajib pajak melalui enkripsi, kontrol akses pengguna, dan log perlindungan data.'
  },
  {
    code: 'K6.3',
    parent: 'K6',
    name: 'Low/less-code usability, cost, and supportability',
    description: 'Kemudahan penggunaan untuk auditor non-programmer, kebutuhan spesifikasi komputer yang ringan, biaya lisensi rendah/gratis, dan kemudahan pemeliharaan.'
  }
];

export const ALTERNATIVES = [
  {
    code: 'Stack A',
    name: 'Spreadsheet-centric lightweight stack',
    components: 'Excel 365/Power Query + Pivot Table + DuckDB/Parquet',
    description: 'Mengandalkan Excel yang sudah dikenal luas oleh auditor, dioptimalkan dengan Power Query untuk transformasi data lokal, serta DuckDB/Parquet untuk memproses data berukuran jutaan baris tanpa lag di komputer biasa.'
  },
  {
    code: 'Stack B',
    name: 'Low-code analytics stack',
    components: 'Power Query + Orange Data Mining + DuckDB/SQLite/Parquet',
    description: 'Menggabungkan Power Query (Excel/Power BI Desktop) dengan Orange Data Mining (aplikasi visual berbasis workflow untuk machine learning ringan), didukung database lokal (DuckDB/SQLite) untuk analisis visual tanpa coding.'
  },
  {
    code: 'Stack C',
    name: 'Script-assisted open analytics stack',
    components: 'Power Query + Python/R + DuckDB/Parquet',
    description: 'Menggabungkan kemudahan Power Query untuk ETL awal dengan kekuatan analisis kustom berbasis script Python/R (Jupyter/RStudio) dan DuckDB untuk fleksibilitas tingkat tinggi dalam advanced audit analytics.'
  },
  {
    code: 'Stack D',
    name: 'Reporting-oriented hybrid stack',
    components: 'Power Query + Python/Orange Data Mining + Power BI + DuckDB/Parquet',
    description: 'Menyediakan workflow komprehensif dari persiapan data (Power Query), analitik lanjutan (Python/Orange), visualisasi interaktif tingkat tinggi (Power BI), dan repository lokal (DuckDB/Parquet) untuk pelaporan eksekutif.'
  }
];

export const SAATY_SCALE = [
  { value: 1, label: 'Sama penting / Sama sesuai (Equal Importance)', description: 'Kedua elemen memberikan kontribusi yang sama terhadap tujuan.' },
  { value: 3, label: 'Sedikit lebih penting / sesuai (Moderate Importance)', description: 'Pengalaman dan penilaian sedikit memihak satu elemen dibanding yang lain.' },
  { value: 5, label: 'Lebih penting / sesuai (Strong Importance)', description: 'Pengalaman dan penilaian sangat memihak satu elemen dibanding yang lain.' },
  { value: 7, label: 'Sangat lebih penting / sesuai (Very Strong Importance)', description: 'Satu elemen sangat disukai dan dominasinya terbukti dalam praktik.' },
  { value: 9, label: 'Mutlak lebih penting / sesuai (Extreme Importance)', description: 'Bukti yang memihak satu elemen atas yang lain memiliki tingkat penegasan tertinggi.' },
  { value: 2, label: 'Nilai Antara (2)', description: 'Nilai di antara 1 dan 3.' },
  { value: 4, label: 'Nilai Antara (4)', description: 'Nilai di antara 3 dan 5.' },
  { value: 6, label: 'Nilai Antara (6)', description: 'Nilai di antara 5 dan 7.' },
  { value: 8, label: 'Nilai Antara (8)', description: 'Nilai di antara 7 dan 9.' }
];

export const OPEN_QUESTIONS = [
  {
    id: 'open_q1',
    question: 'Apakah enam kriteria utama sudah mencerminkan kebutuhan pemilihan data analytics stack untuk e-Audit pemeriksaan pajak? Mohon penjelasannya.'
  },
  {
    id: 'open_q2',
    question: 'Apakah subkriteria yang digunakan sudah cukup operasional, relevan, dan mudah dipahami oleh praktisi/pakar?'
  },
  {
    id: 'open_q3',
    question: 'Apakah alternatif stack yang digunakan (Stack A, B, C, D) sudah realistis untuk diterapkan dalam konteks pemeriksaan pajak di Indonesia?'
  },
  {
    id: 'open_q4',
    question: 'Risiko implementasi (misal: kompetensi SDM, keamanan data, infrastruktur) apa saja yang paling krusial untuk diperhatikan?'
  },
  {
    id: 'open_q5',
    question: 'Rekomendasi tambahan apa yang perlu dipertimbangkan terkait teknologi, prosedur, tata kelola, atau kebijakan e-Audit berbasis data analytics di masa depan?'
  }
];
