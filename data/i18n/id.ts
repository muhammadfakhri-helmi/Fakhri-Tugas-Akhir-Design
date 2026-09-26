// Bahasa Indonesia. Istilah teknis pengeboran (tension, torque, drag,
// buckling, drillpipe, heavy-weight drillpipe, drill collar, make-up torque,
// overpull, build-and-hold) sengaja dibiarkan dalam bahasa Inggris, sama
// seperti pemakaiannya di laporan tugas akhir dan di lapangan.

import type { Dict } from "./en";

export const id: Dict = {
  htmlLang: "id",
  ogLocale: "id_ID",

  meta: {
    title: "Merancang untuk Gaya yang Tak Terlihat",
    pageTitle: "Merancang untuk Gaya yang Tak Terlihat — Studi Kasus Desain Drillstring",
    description:
      "Studi kasus interaktif dari sebuah tugas akhir S1: tiga desain drillstring untuk sumur berarah, diuji terhadap tension, torque, drag, dan buckling melalui perhitungan manual dan simulasi, lalu direvisi.",
    ogDescription: "Desain drillstring pada sumur berarah — beban mekanik, dua metode analisis, dan desain yang direvisi.",
    author: "Muhammad Fakhri Helmi",
    framing: "Tugas Akhir S1 · Teknik Perminyakan",
  },

  ui: {
    skip: "Langsung ke konten",
    pause: "Jeda animasi",
    play: "Putar animasi",
    chapters: "Bab",
    chapterIndex: "Daftar bab",
    language: "Bahasa",
    concept: "Visualisasi konseptual — bukan data operasional",
    loading3d: "Memuat tampilan 3D…",
    backToTop: "Kembali ke atas",
    builtWith: "Dibangun dengan Next.js, React Three Fiber, dan Motion",
  },

  chapters: {
    question: "Pertanyaan",
    path: "Lintasan sumur",
    anatomy: "Rangkaian",
    forces: "Empat gaya",
    designs: "Tiga desain",
    methods: "Dua metode",
    revision: "Revisi",
    conclusion: "Kesimpulan",
    skills: "Pendekatan",
  },

  hero: {
    question: "Bagaimana memastikan drillstring mampu bertahan di lintasan yang harus dilaluinya?",
    sub: (author) => `Studi kasus interaktif tentang desain drillstring, beban mekanik, dan validasi — oleh ${author}.`,
    explore: "Jelajahi analisis",
    skip: "Langsung ke kesimpulan",
  },

  path: {
    title: "Lintasan berarah mengubah cara rangkaian bergerak, menyentuh dinding sumur, dan menanggung beban.",
    intro:
      "Sumur studi memakai profil build-and-hold: dibor lurus ke bawah, dibelokkan di kick-off point, lalu sudutnya dipertahankan untuk mencapai target yang bergeser dari posisi rig.",
    groupLabel: "Bagian lintasan sumur",
    segments: {
      vertical: {
        name: "Vertikal",
        body: "Rangkaian menggantung hampir bebas. Beratnya sendiri, yang menarik lurus ke bawah, menjadi sebagian besar beban.",
      },
      build: {
        name: "Build",
        body: "Lubang mulai melengkung. Rangkaian tertekan ke dinding sumur, sehingga kontak dan gesekan mulai menambah torque dan drag.",
      },
      hold: {
        name: "Hold",
        body: "Sudut dipertahankan untuk mencapai target. Sebagian berat rangkaian kini bertumpu di sisi bawah lubang, tidak lagi menggantung dari atas.",
      },
    },
    note: "Geometri generik — bukan koordinat atau data survei sumur studi.",
  },

  anatomy: {
    title: "Setiap bagian menyumbang berat, kekuatan, dan respons yang berbeda terhadap beban.",
    groupLabel: "Komponen drillstring",
    components: {
      dp: {
        name: "Drillpipe",
        role: "Menahan beban, meneruskan putaran",
        body: "Bagian terpanjang. Setiap sambungan menahan semua yang ada di bawahnya dan meneruskan putaran dari rig. Dalam studi ini, rating kekuatan drillpipe adalah satu-satunya pembeda antara ketiga desain.",
      },
      hwdp: {
        name: "Heavy-weight drillpipe",
        role: "Pemberat fleksibel, transisi",
        body: "Lebih berat dari drillpipe, lebih lentur dari drill collar. Bagian ini menambah berat tanpa membuat ujung bawah rangkaian kaku — karena itulah bagian ini yang diubah ketika sebuah desain perlu direvisi.",
      },
      dc: {
        name: "Drill collar & BHA",
        role: "Weight on bit, kekakuan",
        body: "Tebal, kaku, dan berat. Drill collar memberi beban pada bit dan menjaga bagian bawah rangkaian yang tertekan agar tidak melengkung. Peralatan downhole seperti motor, alat ukur, dan stabilizer juga berada di sini.",
      },
      bit: {
        name: "Bit",
        role: "Memotong batuan",
        body: "Semua bagian di atasnya ada untuk menyalurkan berat dan putaran ke titik ini.",
      },
    },
    note: "Proporsi ilustratif — tanpa dimensi atau grade sebenarnya.",
  },

  forces: {
    title: "Desain yang layak harus diuji terhadap lebih dari satu gaya.",
    intro: "Rangkaian yang sama, di lintasan yang sama, menerima beban dengan empat cara berbeda. Gulir untuk melihat semuanya, atau langsung pilih salah satu.",
    controlLabel: (name) => `Gaya (langkah ${name})`,
    check: "Cek",
    bucklingNote: "Bentuk konseptual — bukan simulasi fisik.",
    criteriaTitle: "Empat gaya menjadi empat kriteria.",
    criteriaBody: "Setiap desain harus lolos semua cek, baik saat pengeboran maupun saat rangkaian dimasukkan dan dicabut dari lubang.",
    items: {
      tension: {
        name: "Tension",
        lead: "Setiap titik menahan semua yang menggantung di bawahnya.",
        body: "Tension paling besar di dekat permukaan, tempat seluruh rangkaian tergantung pada rig. Saat rangkaian dicabut dari lubang, gesekan menambah beban di atas berat rangkaian.",
        check: "Beban kerja tetap di bawah 90 % kekuatan pipa — ambang keselamatan dalam studi ini.",
      },
      torque: {
        name: "Torque",
        lead: "Putaran harus mengatasi gesekan di sepanjang lintasan.",
        body: "Di setiap titik kontak dengan dinding, sebagian torque hilang karena gesekan. Rig harus memasok jumlah totalnya, sehingga torque makin besar ke arah permukaan.",
        check: "Torque puncak tetap di bawah make-up torque sambungan pipa.",
      },
      drag: {
        name: "Drag",
        lead: "Kontak dengan dinding menahan setiap trip masuk dan keluar.",
        body: "Saat run in, berat rangkaian sendiri harus mendorong melewati hambatan. Saat pull out, rig harus mengatasinya — dalam batas margin overpull yang tersedia.",
        check: "Run in: berat yang tersedia lebih besar dari drag. Pull out: tarikan yang dibutuhkan tetap dalam margin overpull.",
      },
      buckling: {
        name: "Buckling",
        lead: "Bagian bawah rangkaian terdorong menjadi tertekan (kompresi).",
        body: "Weight on bit membuat ujung bawah rangkaian mengalami kompresi. Melewati beban kritis, pipa bisa melengkung membentuk pola sinusoidal atau heliks di dalam lubang.",
        check: "Kompresi tetap di bawah beban critical buckling.",
      },
    },
  },

  status: {
    pass: "Memenuhi kriteria studi",
    review: "Perlu ditinjau",
    exceed: "Melebihi batas",
    unknown: "Sedang dievaluasi ulang",
    needsRevision: "Perlu revisi",
    meetsAfterRevision: "Memenuhi kriteria studi setelah revisi",
    reevaluating: "Mengevaluasi ulang kedua metode",
  },

  designs: {
    title: "Tiga alternatif. Lintasan sumur yang sama. Margin keamanan yang berbeda.",
    intro:
      "Ketiga rangkaian memiliki panjang, berat, dan susunan yang sama. Yang berbeda hanya rating kekuatan drillpipe — jadi bebannya tetap sama, sedangkan batasnya bergeser.",
    groupLabel: "Alternatif desain",
    designLabel: (d) => `Desain ${d}`,
    summary: {
      A: "Mampu menahan keempat beban dengan margin pada kedua metode. Direkomendasikan pada studi awal.",
      B: "Beban sama dengan A, rating drillpipe lebih rendah. Torque menjadi masalah, dan kondisi saat pull out perlu diperhatikan.",
      C: "Rating drillpipe terendah. Torque melebihi batas pada kedua metode; tension sangat mepet.",
    },
    notes: {
      A: {
        tension: "Di bawah ambang 90 % pada kedua metode.",
        torque: "Jauh di bawah make-up torque pada kedua metode.",
        drag: "Berat cukup untuk run in; margin overpull cukup untuk pull out.",
        buckling: "Kecenderungan buckling sangat kecil.",
      },
      B: {
        tension: "Perhitungan manual: dalam batas. Simulasi: kondisi pull out ditandai terhadap ambang 90 %.",
        torque: "Perhitungan manual: di atas ambang 90 %, di bawah make-up torque. Simulasi: di atas make-up torque.",
        drag: "Sama dengan A — berat dan susunannya sama.",
        buckling: "Kecenderungan buckling sangat kecil.",
      },
      C: {
        tension: "Perhitungan manual: di atas ambang 90 %. Simulasi: kondisi pull out ditandai berisiko gagal.",
        torque: "Di atas make-up torque pada kedua metode.",
        drag: "Sama dengan A — berat dan susunannya sama.",
        buckling: "Kecenderungan buckling sangat kecil.",
      },
    },
    table: {
      check: "Cek",
      hand: "Hitung manual",
      sim: "Simulasi",
      caption: (d) => `Desain ${d}: hasil setiap cek menurut perhitungan manual dan simulasi`,
    },
    margin: {
      caption: "Beban sama, batas berbeda. Batang menunjukkan beban, garis tegak menunjukkan batas desain, dan area berarsir berada di atas ambang 90 %.",
      method: "perhitungan manual",
      aria: (name, status) => `${name}: ${status} (konseptual)`,
    },
    statusNote: "Status merangkum kesimpulan studi; posisi batang bersifat ilustratif.",
    whyLink: (d) => `Mengapa kedua metode berbeda pendapat tentang Desain ${d}?`,
  },

  methods: {
    title: "Perhitungan adalah titik awal. Perbandingan menunjukkan apa yang perlu dicermati.",
    intro:
      "Setiap desain dicek dua kali: secara manual, dengan persamaan mekanika beban per section, dan dengan simulasi WellPlan® di sepanjang lintasan. Trennya selaras untuk ketiga desain. Angkanya tidak selalu sama.",
    kindLabel: "Beban yang dibandingkan",
    depthLabel: "Ikuti kedalaman — dari permukaan ke bit",
    depthValue: (p) => `${p} persen dari permukaan menuju bit`,
    chartHand: "Analisis mekanika",
    chartSim: "Simulasi software",
    subHand: "per section",
    subSim: "bertahap",
    axis: {
      surface: "Permukaan",
      bit: "Bit",
      depth: "Kedalaman ↓",
      index: (kind) => `${kind} (indeks) →`,
      limit: "Batas desain",
    },
    readout: {
      at: "Pada kedalaman ini — perhitungan manual",
      sim: "simulasi",
      diff: "selisih",
    },
    curvesNote: "Kurva digambar untuk menjelaskan kedua pendekatan; bukan hasil studi maupun output WellPlan®.",
    showedTitle: "Apa yang ditunjukkan perbandingan",
    torqueFinding: "Torque: hasil perhitungan manual dekat dengan simulasi.",
    tensionFinding: "Tension: selisih antara kedua metode jauh lebih besar.",
    reasonLabel: (i) => `Alasan ${i}`,
    takeaway: "Intinya",
    reasons: [
      {
        title: "Per section vs. bertahap",
        body: "Perhitungan manual bekerja per section, memakai panjang setiap komponen. Simulasi menelusuri sumur dalam inkremen kedalaman yang kecil.",
      },
      {
        title: "Cara membaca lintasan",
        body: "Secara manual, perubahan sudut diambil dalam derajat bulat dan azimuth tidak dimasukkan. Simulasi membaca lintasan lebih presisi, termasuk azimuth.",
      },
      {
        title: "Artinya",
        body: "Perhitungan manual sudah cukup baik sebagai gambaran awal untuk torque. Untuk tension, simulasi diperlukan sebelum angkanya bisa dipercaya.",
      },
    ],
    designB:
      "Untuk Desain B, kedua metode bahkan berbeda vonis — secara manual bisa dipakai tetapi tidak dianjurkan, menurut simulasi tidak layak dipakai. Keduanya tetap mengarah ke tindakan yang sama: jangan dipakai apa adanya.",
    nextQuestion: "Jadi pertanyaannya menjadi: apa yang harus diubah?",
  },

  revision: {
    title: "Ketika sebuah desain belum memenuhi kriteria, saya mengubah susunannya dan mengujinya kembali.",
    p1: "Batas Desain B dan C tidak bisa diubah, jadi bebannya yang harus berubah. Memendekkan heavy-weight drillpipe dan memperpanjang drillpipe dengan panjang yang sama menjaga jangkauan rangkaian, tetapi mengurangi berat yang menggantung di bawah titik terlemahnya, yaitu di dekat permukaan.",
    p2: "Heavy-weight drillpipe menjadi tuasnya, bukan drill collar: drill collar memperkaku bagian bawah rangkaian, sedangkan heavy-weight drillpipe adalah pemberat yang fleksibel. Berat yang berkurang juga berarti dorongan yang lebih kecil saat run in, sehingga drag dan buckling dicek ulang setiap kali ada perubahan.",
    groupLabel: "Desain yang direvisi",
    reset: "Atur ulang",
    asDesigned: "Desain awal",
    revised: "Setelah revisi",
    sliderLabel: (d) => `Geser susunan Desain ${d} dari desain awal ke hasil revisi`,
    valueRevised: "Susunan setelah revisi",
    valueAsDesigned: "Desain awal",
    valueChanging: "Susunan sedang diubah",
    compositionAria: (d, done) =>
      `Komposisi rangkaian Desain ${d}: bagian drillpipe ${done ? "lebih panjang" : "sesuai desain awal"}, bagian heavy-weight ${done ? "lebih pendek" : "sesuai desain awal"}`,
    bar: { surface: "Permukaan · drillpipe", hwdp: "heavy-weight", bha: "BHA · bit" },
    caption: (d, done) => `Desain ${d}: hasil cek ${done ? "setelah" : "sebelum"} revisi`,
    revisedSummary: {
      B: "Setelah bagian heavy-weight dipendekkan, torque dan tension turun pada kedua metode.",
      C: "Membutuhkan pergeseran yang lebih besar daripada B. Setelahnya, kedua metode menunjukkan torque dan tension dalam batas.",
    },
    revisedNotes: {
      B: {
        tension: "Lebih rendah pada kedua metode setelah perubahan.",
        torque: "Kembali di bawah make-up torque pada kedua metode.",
        drag: "Dicek ulang: tidak ada masalah drag baru.",
        buckling: "Dicek ulang: tidak terjadi buckling.",
      },
      C: {
        tension: "Di bawah ambang pada kedua metode.",
        torque: "Di bawah make-up torque pada kedua metode.",
        drag: "Dicek ulang: saat run in beratnya masih cukup.",
        buckling: "Dicek ulang: tidak terjadi buckling.",
      },
    },
    note: "Rekonstruksi konseptual dari kesimpulan studi — panjang perubahan yang sebenarnya tidak ditampilkan.",
  },

  conclusion: {
    title: "Hasilnya bukan satu angka, melainkan keputusan desain yang beralasan dan dicek dengan dua metode.",
    rows: {
      A: { label: "Direkomendasikan pada studi awal", body: "Lolos keempat cek pada kedua metode." },
      B: { label: "Memenuhi kriteria studi setelah revisi", body: "Bagian heavy-weight dipendekkan, drillpipe diperpanjang." },
      C: { label: "Memenuhi kriteria studi setelah revisi", body: "Membutuhkan pergeseran yang lebih besar daripada B." },
    },
    body: "Perhitungan manual dan simulasi tidak selalu menghasilkan angka yang sama — dekat untuk torque, berjauhan untuk tension. Karena itu, evaluasi tidak pernah bertumpu pada satu metode saja.",
    seeMethod: "Lihat metodenya",
    nextTitle: "Yang akan saya uji selanjutnya",
    nextTests: [
      "Membandingkan dengan data pengeboran aktual dari sumur.",
      "Melakukan studi sensitivitas terhadap panjang komponen dan beban operasi.",
      "Menambahkan cek untuk efek lain seperti vibrasi.",
      "Memverifikasi silang dengan software simulasi kedua.",
    ],
  },

  skills: {
    title: "Uji asumsi, bandingkan bukti, dan tunjukkan alasannya.",
    body: "Penelitian ini membentuk cara saya mendekati masalah engineering. Enam langkah yang sama berlaku untuk setiap pertanyaan desain yang jawabannya harus bisa dipertanggungjawabkan, bukan sekadar dihitung.",
    stepLabel: (i) => `Langkah ${i}`,
    steps: [
      { step: "Tentukan input", body: "Lintasan sumur, batas rig, dan susunan rangkaian." },
      { step: "Uji beban", body: "Tension, torque, drag, dan buckling." },
      { step: "Bandingkan alternatif", body: "Tiga desain dengan satu set kriteria." },
      { step: "Validasi hasil", body: "Perhitungan manual dicek terhadap simulasi." },
      { step: "Revisi desain", body: "Ubah susunan, lalu uji kembali." },
      { step: "Jelaskan keputusan", body: "Rekomendasi dengan alasan yang terlihat jelas." },
    ],
  },

  footer: {
    summary:
      "Studi ini membandingkan tiga desain drillstring untuk sumur build-and-hold melalui perhitungan manual mekanika beban dan simulasi WellPlan®, lalu merevisi desain yang belum memenuhi kriteria studi.",
    disclaimer:
      "Lintasan sumur, model 3D, kurva, batang, dan indikator di halaman ini adalah ilustrasi konseptual orisinal. Hasil studi dirangkum dari kesimpulan proyek itu sendiri; tidak ada data sumur, halaman laporan, tabel, grafik, atau output software yang direproduksi. WellPlan® adalah merek dagang milik pemiliknya dan hanya disebut sebagai alat simulasi yang digunakan.",
  },

  labels3d: {
    rig: "Rig · permukaan",
    kop: "Kick-off point",
    vertical: "Vertikal",
    build: "Build",
    hold: "Hold",
    contact: "Kontak dinding · sisi bawah",
    target: "Target",
    dp: "Drillpipe",
    hwdp: "Heavy-weight",
    dc: "Collar · BHA",
    bit: "Bit",
    tensionTop: "Tension terbesar · dekat permukaan",
    torqueTop: "Torque membesar ke permukaan",
    neutral: "Titik netral",
    compression: "Kompresi · cek buckling",
    trip: "Trip in / trip out",
    design: (d) => `Desain ${d}`,
    recommended: "A · rekomendasi",
    afterRevision: (d) => `${d} · setelah revisi`,
    revised: (d) => `${d} · direvisi`,
    asDesigned: (d) => `${d} · desain awal`,
    margin: "Beban tertinggi · margin tertipis",
    hwSection: "Bagian heavy-weight",
    collarsUnchanged: "Collar tidak berubah",
  },

  fallback: {
    aria: "Gambar potongan lintasan sumur build-and-hold dengan drillstring di dalamnya",
    kickoff: "KICK-OFF",
    target: "TARGET",
  },
};
