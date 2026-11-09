const fs = require('fs');

const current = JSON.parse(fs.readFileSync('./data/activities.json', 'utf8'));

// Helper to determine rarity & xp/coins
function assignRarity(act, idx) {
  let rarity = "common";
  let xp = 10;
  let coins = 5;

  if (idx % 8 === 0) {
    rarity = "epic";
    xp = 50;
    coins = 20;
  } else if (idx % 3 === 0) {
    rarity = "rare";
    xp = 25;
    coins = 10;
  }

  // A couple of legendary ones
  if (act.id === "tech-001" || act.id === "kreatif-002" || act.id === "matematika-002" || act.id === "senang-008") {
    rarity = "legendary";
    xp = 100;
    coins = 40;
  }

  const needsInternet = act.device === "hp" || act.device === "laptop" || act.title.toLowerCase().includes("youtube") || act.title.toLowerCase().includes("browser");

  return {
    ...act,
    rarity,
    xp,
    coins,
    needs_internet: needsInternet,
    social: act.social === "bareng" ? "group" : "solo",
    device: act.device === "tanpa-alat" ? "none" : act.device === "hp" ? "phone" : act.device
  };
}

const migrated = current.map((a, i) => assignRarity(a, i));

// Now generate new rich activities to reach 90 activities (10 per category)
const newActivities = [
  // Senang-senang (add 1 to reach 10)
  {
    id: "senang-010",
    title: "Buat piala juara dari kertas dan berikan ke dirimu sendiri",
    description: "Ambil secarik kertas, buat bentuk piala penghargaan untuk satu hal sepele yang berhasil kamu lalui hari ini (misal: 'Juara Bangun Tepat Waktu').",
    categories: ["senang-senang"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Ambil selembar kertas dan spidol/pena",
      "Gambar bentuk trofi piala sederhana",
      "Tulis gelar juara terlucu untuk dirimu sendiri dan pajang di meja"
    ],
    free_check: { verified: true, notes: "Kertas bekas dan alat tulis rumah" }
  },

  // Self-improvement (current 5, add 5 more)
  {
    id: "self-006",
    title: "Teknik Pomodoro 25 Menit: Selesaikan 1 Hal Menumpuk",
    description: "Pilih satu tugas kecil yang sudah kamu tunda selama berhari-hari. Pasang timer 25 menit dan kerjakan tanpa distraksi.",
    categories: ["self-improvement"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 30,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Tentukan SATU tugas yang ingin kamu tuntaskan",
      "Matikan notifikasi HP dan pasang timer 25 menit",
      "Fokus penuh sampai alarm berbunyi, lalu istirahat 5 menit"
    ],
    free_check: { verified: true, notes: "Metode manajemen waktu mandiri" }
  },
  {
    id: "self-007",
    title: "Audit Pengeluaran Mingguan di Selembar Kertas",
    description: "Ingat-ingat pengeluaran 7 hari ke belakang. Tuliskan pos pengeluaran yang sebenarnya tidak kamu butuhkan untuk dievaluasi.",
    categories: ["self-improvement"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Bagi kertas menjadi 2 kolom: Butuh vs Ingin",
      "Catat pengeluaran mingguan yang masih kamu ingat",
      "Beri tanda centang pada kebiasaan jajan yang bisa dipangkas minggu depan"
    ],
    free_check: { verified: true, notes: "Evaluasi finansial pribadi gratis" }
  },
  {
    id: "self-008",
    title: "Tulis Surat Pendek untuk Dirimu 1 Tahun ke Depan",
    description: "Tuliskan harapan, kekhawatiranmu saat ini, dan pesan motivasi untuk dirimu yang akan membacanya di masa depan.",
    categories: ["self-improvement"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 20,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Tulis tanggal hari ini di sudut atas kertas",
      "Tulis apa yang sedang kamu perjuangkan dan impianmu 1 tahun ke depan",
      "Lipat kertasnya, masukkan ke dalam buku favorit, dan beri tanda tanggal buka"
    ],
    free_check: { verified: true, notes: "Journaling reflektif tanpa biaya" }
  },
  {
    id: "self-009",
    title: "Digital Detox 30 Menit: Taruh HP di Ruangan Lain",
    description: "Beri otakmu jeda dari dopamin instan. Letakkan ponsel di ruangan berbeda dan lakukan kegiatan analog tanpa layar.",
    categories: ["self-improvement"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 30,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Aktifkan mode senyap di HP",
      "Simpan HP di dalam laci atau ruangan lain",
      "Gunakan 30 menit ini untuk membaca buku fisik, merapikan baju, atau menyiram tanaman"
    ],
    free_check: { verified: true, notes: "100% bebas biaya" }
  },
  {
    id: "self-010",
    title: "Masterclass Nilai Hidup: Pilih 5 Prinsip Utamamu",
    description: "Dari daftar nilai umum (kejujuran, kebebasan, keluarga, loyalitas, kreativitas, disiplin), pilih 5 prinsip nomor satu yang paling memandumu.",
    categories: ["self-improvement"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Tuliskan 15 nilai hidup yang terlintas",
      "Coret 10 di antaranya sampai tersisa 5 nilai paling krusial",
      "Tulis alasan 1 kalimat mengapa masing-masing nilai itu tidak bisa kamu kompromikan"
    ],
    free_check: { verified: true, notes: "Latihan penetapan nilai diri pribadi" }
  },

  // Tech & Ngoprek (current 5, add 5 more)
  {
    id: "tech-006",
    title: "Eksplorasi Fitur Tersembunyi Browser: Reader Mode & Canvas",
    description: "Pelajari cara kerja Reader Mode pada artikel berita dan lihat bagaimana browser menyaring iklan menjadi teks buku yang bersih.",
    categories: ["tech"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "laptop",
    needs_internet: true,
    difficulty: "easy",
    steps: [
      "Buka artikel portal berita panjang",
      "Tekan shortcut Reader Mode (F9 di Edge atau ikon buku di Firefox)",
      "Atur ukuran font dan latar gelap untuk pengalaman baca santai"
    ],
    free_check: { verified: true, notes: "Fitur bawaan web browser" }
  },
  {
    id: "tech-007",
    title: "Ubah Tampilan Terminal dengan Prompt Keren",
    description: "Pelajari cara mengubah prompt PowerShell atau Bash agar menampilkan waktu atau username berwarna cerah.",
    categories: ["tech"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 20,
    social: "solo",
    place: "indoor",
    device: "laptop",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Buka file profil terminal ($PROFILE di PowerShell atau ~/.bashrc)",
      "Tambahkan fungsi prompt custom sederhana",
      "Restart terminal dan nikmati tampilan baru buatanmu"
    ],
    free_check: { verified: true, notes: "Kustomisasi OS bawaan gratis" }
  },
  {
    id: "tech-008",
    title: "Bikin Kalkulator Hitung Umur Sederhana di Console JS",
    description: "Buka Developer Tools console di browser, tulis 4 baris kode JavaScript untuk menghitung berapa hari kamu sudah hidup di dunia.",
    categories: ["tech"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "laptop",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Tekan F12 atau Ctrl+Shift+I lalu klik tab Console",
      "Ketik: const lahir = new Date('YYYY-MM-DD');",
      "Ketik: Math.floor((new Date() - lahir) / (1000*60*60*24)) + ' hari!';",
      "Tekan Enter dan lihat hasilnya"
    ],
    free_check: { verified: true, notes: "Menggunakan runtime JS bawaan browser" }
  },
  {
    id: "tech-009",
    title: "Audit Izin Privasi Aplikasi di Smartphone",
    description: "Buka pengaturan privasi di HP, periksa aplikasi mana saja yang memiliki akses kamera, mikrofon, dan lokasi di latar belakang.",
    categories: ["tech"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "phone",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Buka Settings > Privacy > Permission Manager di HP",
      "Cek izin Microphone dan Location",
      "Cabut izin aplikasi yang mencurigakan atau jarang dipakai"
    ],
    free_check: { verified: true, notes: "Fitur keamanan standar smartphone" }
  },
  {
    id: "tech-010",
    title: "Rancang Desain UI Portofolio Minimalis di Excalidraw",
    description: "Buka website papan sketsa open-source gratis excalidraw.com, gambar wireframe kasarnya hanya dalam 15 menit.",
    categories: ["tech"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 20,
    social: "solo",
    place: "indoor",
    device: "laptop",
    needs_internet: true,
    difficulty: "easy",
    steps: [
      "Buka excalidraw.com di browser (tanpa perlu register)",
      "Gambar layout 3 section: Hero, Portofolio Karya, dan Kontak",
      "Eksport hasil gambarmu sebagai PNG untuk disimpan"
    ],
    free_check: { verified: true, notes: "Layanan open-source gratis tanpa paywall" }
  },

  // Psikologi (current 4, add 6 more)
  {
    id: "psikologi-005",
    title: "Praktik Menulis 'Unsent Letter' untuk Lepaskan Beban",
    description: "Tuliskan surat jujur sejujur-jujurnya kepada seseorang yang pernah mengecewakanmu, lalu robek dan buang kertasnya tanpa pernah mengirimkannya.",
    categories: ["psikologi"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Siapkan selembar kertas dan tempat yang tenang",
      "Tumpahkan semua uneg-uneg dan emosi yang terpendam",
      "Setelah selesai, robek kertas tersebut sebagai simbol pelepasan beban emosi"
    ],
    free_check: { verified: true, notes: "Terapi ekspresif mandiri gratis" }
  },
  {
    id: "psikologi-006",
    title: "Uji Sensasi Mindfulness Makan 1 Butir Makanan",
    description: "Ambil satu kismis, kacang, atau biskuit kecil. Amati tekstur, aroma, dan kunyah sangat perlahan selama 2 menit penuh.",
    categories: ["psikologi"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Ambil 1 butir camilan kecil yang ada di dapur",
      "Jangan langsung telan: perhatikan aroma dan bentuknya selama 30 detik",
      "Kunyah perlahan dan rasakan lapisan rasanya dengan perhatian penuh"
    ],
    free_check: { verified: true, notes: "Latihan sensorik mindfulness sederhana" }
  },
  {
    id: "psikologi-007",
    title: "Analisis Lingkaran Kendali (Circle of Control)",
    description: "Gambar 2 lingkaran konsentris. Lingkaran dalam = hal yang bisa kamu kontrol. Lingkaran luar = hal di luar kendalimu.",
    categories: ["psikologi"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Gambar lingkaran besar dan lingkaran kecil di dalamnya",
      "Tulis hal di luar kendali di lingkaran luar (macet, cuaca, omongan orang)",
      "Tulis hal dalam kendalimu di lingkaran dalam (reaksi, usaha, waktu tidur)",
      "Fokuskan energi 100% hanya pada isi lingkaran dalam"
    ],
    free_check: { verified: true, notes: "Kerangka stoikisme & psikologi kognitif" }
  },
  {
    id: "psikologi-008",
    title: "Jurnal Body Scan 7 Menit dari Ujung Kepala ke Kaki",
    description: "Duduk santai di kursi, pindahkan perhatian mentalmu perlahan dari dahi, rahang, bahu, perut, hingga ujung jemari kaki.",
    categories: ["psikologi"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Pejamkan mata dan atur napas normal",
      "Perhatikan apakah rahangmu sedang mengeras atau bahumu sedang tegang",
      "Keluarkan napas sambil sengaja mengendurkan otot yang tegang tersebut"
    ],
    free_check: { verified: true, notes: "Relaksasi somatik gratis" }
  },
  {
    id: "psikologi-009",
    title: "Latihan 'Reframing Pikiran': Ubah 'Harus' Jadi 'Bisa'",
    description: "Tuliskan 3 kalimat keluhan 'Aku harus...' lalu ubah kalimatnya menjadi 'Aku memilih untuk...' atau 'Aku berkesempatan untuk...'.",
    categories: ["psikologi"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Tulis keluhanmu (misal: 'Aku harus bangun pagi besok')",
      "Ubah sudut pandangnya ('Aku bisa bangun pagi untuk punya waktu tenang sendiri')",
      "Amati bagaimana pergeseran kata mengubah energimu"
    ],
    free_check: { verified: true, notes: "Teknik linguistik kognitif mandiri" }
  },
  {
    id: "psikologi-010",
    title: "Petakan 'Energi Vampir' vs 'Pengisi Daya' Mingguanmu",
    description: "Identifikasi 3 aktivitas yang menguras energimu tanpa hasil, dan 3 aktivitas yang membuatmu kembali bersemangat.",
    categories: ["psikologi"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Bagi kertas menjadi kolom (+) Charger dan (-) Drainer",
      "Isi masing-masing minimal 3 hal konkret berdasarkan pengalaman seminggu ini",
      "Buat komitmen untuk mengurangi durasi salah satu Drainer mulai besok"
    ],
    free_check: { verified: true, notes: "Manajemen energi mental gratis" }
  },

  // Matematika & Logika (current 4, add 6 more)
  {
    id: "matematika-005",
    title: "Pecahkan Teka-Teki Timbangan 8 Bola Logika",
    description: "Ada 8 bola, 1 bola lebih berat dari lainnya. Dengan timbangan neraca dua lengan, temukan bola terberat hanya dalam 2 kali penimbangan!",
    categories: ["matematika"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Petakan solusinya: bagi 8 bola menjadi kelompok 3, 3, dan 2",
      "Timbang 3 vs 3. Jika seimbang, bola berat ada di kelompok 2",
      "Jika tidak seimbang, timbang 1 vs 1 dari kelompok yang berat!",
      "Catat alur logika pemecahannya di kertas"
    ],
    free_check: { verified: true, notes: "Teka-teki nalar murni" }
  },
  {
    id: "matematika-006",
    title: "Hitung Hari Kelahiran Sederhana (Algoritma Doomsday)",
    description: "Pelajari trik nalar untuk mengetahui hari apa tanggal tertentu dalam sejarah hanya dengan perhitungan aritmatika modulo 7.",
    categories: ["matematika"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 20,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Pahami konsep bahwa 1 minggu = 7 hari (operasi kelipatan 7)",
      "Cari tahu hari jangkar tahun ini (misal: 4/4, 6/6, 8/8, 10/10 selalu jatuh di hari yang sama!)",
      "Tebak hari kelahiranmu menggunakan jarak dari tanggal jangkar"
    ],
    free_check: { verified: true, notes: "Teori bilangan mental math gratis" }
  },
  {
    id: "matematika-007",
    title: "Eksplorasi Kotak Ajaib 3x3 (Magic Square)",
    description: "Isi kotak 3x3 dengan angka 1 sampai 9 sedemikian rupa sehingga jumlah setiap baris, kolom, dan diagonalnya selalu sama dengan 15.",
    categories: ["matematika"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Gambar grid 3x3 di kertas",
      "Letakkan angka 5 tepat di kotak tengah",
      "Coba pasangkan angka genap di sudut dan angka ganjil di sisi hingga semua baris bernilai 15"
    ],
    free_check: { verified: true, notes: "Puzzle matematika klasik" }
  },
  {
    id: "matematika-008",
    title: "Eksperimen Peluang Koin: Lempar 30 Kali dan Catat Distribusi",
    description: "Ambil 1 koin logam, lempar 30 kali dan catat frekuensi Angka vs Gambar. Buktikan Hukum Bilangan Besar (Law of Large Numbers).",
    categories: ["matematika"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Buat tabel Angka vs Gambar di kertas",
      "Lemparkan koin secara adil sebanyak 30 kali",
      "Hitung persentasenya dan lihat apakah mendekati 50%"
    ],
    free_check: { verified: true, notes: "Eksperimen statistik manual" }
  },
  {
    id: "matematika-009",
    title: "Trik Kuadrat Cepat Angka Berakhiran 5",
    description: "Hitung kuadrat angka berakhiran 5 dalam 2 detik: untuk 65², kalikan 6 x 7 = 42, lalu tempel 25 di belakangnya = 4225!",
    categories: ["matematika"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Pahami rumusnya: n5² = (n * (n+1)) disambung 25",
      "Coba hitung: 25² (2x3 = 6 -> 625)",
      "Coba hitung: 85² (8x9 = 72 -> 7225)",
      "Coba 3 soal buatanmu sendiri"
    ],
    free_check: { verified: true, notes: "Aritmatika cepat Vedic math" }
  },
  {
    id: "matematika-010",
    title: "Pecahkan Teka-Teki Menara Hanoi 4 Cakram di Meja",
    description: "Gunakan 4 koin/benda dengan ukuran berbeda. Pindahkan tumpukan dari tiang A ke tiang C tanpa pernah meletakkan cakram besar di atas cakram kecil.",
    categories: ["matematika"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 20,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Buat 3 lingkaran di atas kertas sebagai tiang A, B, dan C",
      "Tumpuk 4 koin dari yang terbesar di bawah ke terkecil di atas",
      "Pindahkan seluruh tumpukan ke tiang C dalam langkah minimum 2⁴ - 1 = 15 langkah!"
    ],
    free_check: { verified: true, notes: "Logika rekursi klasik" }
  },

  // Main Game (current 4, add 6 more)
  {
    id: "game-005",
    title: "Game Kata Sambung Cepat Berantai (Word Chain)",
    description: "Mainkan bersama teman atau lawan dirimu sendiri: sebutkan kata baru yang huruf depannya adalah suku kata atau huruf terakhir kata sebelumnya.",
    categories: ["game"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "group",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Tentukan kata pertama (misal: 'Kucing')",
      "Orang berikutnya harus menyambung huruf terakhir 'G' (misal: 'Gajah')",
      "Beri batas waktu 5 detik per giliran"
    ],
    free_check: { verified: true, notes: "Game verbal tanpa perlengkapan" }
  },
  {
    id: "game-006",
    title: "Permainan Titik dan Kotak (Dots and Boxes) di Kertas",
    description: "Buat grid titik 6x6 di kertas. Tarik garis bergantian menghubungkan dua titik. Siapa yang menutup kotak berhak mengklaim inisialnya.",
    categories: ["game"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 15,
    social: "group",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Bikin pola titik rapi 6x6 di selembar kertas",
      "Gantian menarik 1 garis horizontal atau vertikal",
      "Tulis inisial namamu saat menutup kotak ke-4 dan ambil giliran tambahan"
    ],
    free_check: { verified: true, notes: "Game strategi kertas pena" }
  },
  {
    id: "game-007",
    title: "Main Game Tebak Gambar (Pictionary) Tanpa Bicara",
    description: "Satu orang menggambar satu kata rahasia di kertas dalam 60 detik tanpa boleh bicara atau menulis huruf, yang lain menebak.",
    categories: ["game"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 15,
    social: "group",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Tulis 5 kata rahasia di gulungan kertas kecil",
      "Ambil 1 gulungan dan mulai gambar di kertas besar",
      "Tebak bersama dalam batas waktu 1 menit"
    ],
    free_check: { verified: true, notes: "Party game analog gratis" }
  },
  {
    id: "game-008",
    title: "Tantangan Juggling 2 Kertas Gumpalan selama 30 Detik",
    description: "Remas 2 lembar kertas bekas jadi bola kecil. Coba lemparkan bergantian dari tangan kanan ke kiri tanpa jatuh selama 30 detik.",
    categories: ["game"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Buat 2 bola kertas seukuran kepalan tangan kecil",
      "Lemparkan bola 1 melengkung ke atas, saat bola 1 di puncak, lempar bola 2",
      "Tangkap bola 1 dengan tangan lainnya dan teruskan ritmenya"
    ],
    free_check: { verified: true, notes: "Melatih koordinasi motorik tangan mata" }
  },
  {
    id: "game-009",
    title: "Game Tebak Siapa Aku (20 Questions)",
    description: "Pikirkan satu tokoh nyata atau fiksi. Lawan bicaramu berhak mengajukan maksimal 20 pertanyaan yang hanya bisa dijawab 'Ya' atau 'Tidak'.",
    categories: ["game"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 15,
    social: "group",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Satu orang memikirkan tokoh terkenal di kepalanya",
      "Penebak mengajukan pertanyaan deduktif: 'Apakah dia masih hidup?', 'Apakah dia musisi?'",
      "Hitung mundur hingga maksimal 20 pertanyaan"
    ],
    free_check: { verified: true, notes: "Game deduksi verbal klasik" }
  },
  {
    id: "game-010",
    title: "Tantangan Speedrun Sudoku Mudah di Browser",
    description: "Buka situs sudoku publik gratis, pilih tingkat Easy, dan selesaikan dalam waktu tercepat yang bisa kamu catat.",
    categories: ["game"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "phone",
    needs_internet: true,
    difficulty: "medium",
    steps: [
      "Buka web sudoku gratisan di HP",
      "Pilih tingkat pemula",
      "Fokus isi kotak tanpa melakukan tebakan acak"
    ],
    free_check: { verified: true, notes: "Situs game logika publik gratis" }
  },

  // Kreatif & Seni (current 4, add 6 more)
  {
    id: "kreatif-005",
    title: "Bikin Kolase Tipografi dari Potongan Judul Brosur",
    description: "Gunting kata-kata menarik dari koran atau selebaran bekas, susun ulang di selembar kertas membentuk kalimat motivasi unik.",
    categories: ["kreatif"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 20,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Kumpulkan selebaran iklan atau majalah bekas",
      "Gunting 5 sampai 10 kata dengan jenis huruf berbeda",
      "Tempelkan dengan lem kertas membentuk slogan karyamu"
    ],
    free_check: { verified: true, notes: "Kolase seni daur ulang kertas" }
  },
  {
    id: "kreatif-006",
    title: "Buat Peta Fiksi 'Pulau Pribadi' Lengkap dengan Landmark",
    description: "Gambar peta sebuah pulau khayalan di kertas. Beri nama teluk, gunung, dan benteng rahasia sesuai imajinasimu.",
    categories: ["kreatif"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Gambar garis pantai pulau bergelombang di tengah kertas",
      "Tambahkan ikon gunung, hutan, dan sungai",
      "Beri nama lokasi yang unik: 'Teluk Kopi Hangat', 'Puncak Santai'"
    ],
    free_check: { verified: true, notes: "World-building ilustratif manual" }
  },
  {
    id: "kreatif-007",
    title: "Coba Teknik Blind Contour Drawing Wajahmu Sendiri",
    description: "Bercermin, lalu gambar wajahmu di kertas TANPA sekalipun melihat ke arah kertas sampai gambarnya selesai!",
    categories: ["kreatif"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Duduk di depan cermin dengan kertas dan pulpen di pangkuan",
      "Arahkan mata 100% ke pantulan cermin",
      "Gerakkan tangan menggambar kontur mata, hidung, bibir tanpa melirik ke kertas",
      "Lihat hasil akhirnya yang abstrak dan penuh kejutan"
    ],
    free_check: { verified: true, notes: "Metode latihan seni rupa klasik" }
  },
  {
    id: "kreatif-008",
    title: "Menulis Paragraf Deskripsi Ruangan Menggunakan 5 Indra",
    description: "Deskripsikan kamarmu sekarang tapi wajib melibatkan: apa yang terlihat, terdengar, tercium, terasa di kulit, dan dirasakan di lidah.",
    categories: ["kreatif"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Buka notes atau buku catatan",
      "Tulis 1 paragraf pendek (4-5 kalimat)",
      "Pastikan setiap indera memiliki representasi kata konkret"
    ],
    free_check: { verified: true, notes: "Latihan creative writing sensory" }
  },
  {
    id: "kreatif-009",
    title: "Desain Logo Personal Monogram Inisial Namamu",
    description: "Ambil inisial huruf nama depan dan belakangmu, gabungkan kedua huruf tersebut menjadi satu simbol logo elegan di kertas.",
    categories: ["kreatif"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Tulis 2 huruf inisialmu dalam berbagai gaya (balok, miring, kursif)",
      "Eksplorasi titik potong di mana kedua huruf bisa saling menyatu",
      "Tebalkan sketsa terbaik dengan pulpen hitam"
    ],
    free_check: { verified: true, notes: "Eksplorasi desain grafis manual" }
  },
  {
    id: "kreatif-010",
    title: "Tulis Pantun Nasihat Lucu 4 Bait untuk Media Sosial",
    description: "Ciptakan pantun dengan sajak a-b-a-b yang mengangkat fenomena kehidupan sehari-hari (misal: rebahan, tanggal tua, atau tugas).",
    categories: ["kreatif"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 15,
    social: "solo",
    place: "indoor",
    device: "phone",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Tentukan pesan inti atau lelucon yang ingin disampaikan",
      "Buat baris 3 dan 4 terlebih dahulu sebagai isi",
      "Rancang baris 1 dan 2 sebagai sampiran dengan rima akhir yang pas"
    ],
    free_check: { verified: true, notes: "Sastra lisan Nusantara tanpa biaya" }
  },

  // Fisik & Gerak (current 4, add 6 more)
  {
    id: "fisik-005",
    title: "Latihan Keseimbangan Satu Kaki (Flamingo Pose)",
    description: "Berdiri dengan 1 kaki, angkat kaki lainnya setinggi lutut. Tahan selama 45 detik di tiap kaki untuk memperkuat otot stabilisator pergelangan.",
    categories: ["fisik"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Berdiri tegak di permukaan datar tanpa alas kaki",
      "Fokuskan pandangan pada satu titik diam di depanmu",
      "Angkat kaki kanan dan tahan selama 45 detik, lalu ganti kaki kiri"
    ],
    free_check: { verified: true, notes: "Latihan propriosepsi mandiri" }
  },
  {
    id: "fisik-006",
    title: "Sesi Peregangan Pergelangan Tangan dan Jari (Anti-Carpal)",
    description: "Bagi yang sering mengetik atau memegang HP: regangkan pergelangan tangan ke atas dan ke bawah untuk melancarkan sirkulasi darah.",
    categories: ["fisik"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Luruskan satu tangan ke depan dengan telapak menghadap depan",
      "Tarik lembut jari-jari ke arah tubuh dengan tangan lain, tahan 15 detik",
      "Balikkan telapak menghadap ke bawah dan ulangi peregangan"
    ],
    free_check: { verified: true, notes: "Ergonomi fisik gratis" }
  },
  {
    id: "fisik-007",
    title: "30 Kali Jumping Jacks Cepat di Kamar",
    description: "Naikkan denyut jantung dan buang kantuk dalam 60 detik dengan gerakan lompat tepuk tangan klasik.",
    categories: ["fisik"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Pastikan ruangan di sekitarmu bebas dari benda tajam",
      "Lompat dengan kaki melebar sambil menepuk tangan di atas kepala",
      "Lakukan sebanyak 30 repetisi ritmis"
    ],
    free_check: { verified: true, notes: "Kalisthenics kardio kilat" }
  },
  {
    id: "fisik-008",
    title: "Tantangan Wall Sit 45 Detik Membakar Paha",
    description: "Sandarkan punggung ke dinding, turunkan posisi tubuh seperti duduk di kursi tak terlihat dengan sudut lutut 90 derajat.",
    categories: ["fisik"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 5,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Cari dinding kosong dan sandarkan punggung rata",
      "Geser kaki ke depan hingga lutut membentuk sudut siku 90 derajat",
      "Tahan posisi ini selama 45 detik sambil mengatur napas stabil"
    ],
    free_check: { verified: true, notes: "Latihan isometrik kaki gratis" }
  },
  {
    id: "fisik-009",
    title: "Jalan Cepat Naik Turun Tangga 5 Putaran",
    description: "Manfaatkan tangga rumah atau kantor untuk kardio ringan pembakar kalori tanpa perlu treadmill.",
    categories: ["fisik"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "medium",
    steps: [
      "Gunakan alas kaki atau sandal karet yang tidak licin",
      "Naik tangga dengan langkah mantap menggunakan dorongan tumit",
      "Turun perlahan untuk menjaga sendi lutut, ulangi 5 kali siklus"
    ],
    free_check: { verified: true, notes: "Pemanfaatan fasilitas fisik yang ada" }
  },
  {
    id: "fisik-010",
    title: "Sesi Yoga Pose Anak (Child's Pose) & Kucing-Sapi 5 Menit",
    description: "Lepaskan beban tulang belakang dengan transisi pose yoga restorative di lantai beralas karpet.",
    categories: ["fisik"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Duduk berlutut di atas karpet, rentangkan tangan ke depan hingga dahi menempel lantai (Child's Pose, 2 menit)",
      "Pindah ke posisi merangkak, lengkungkan punggung ke atas dan ke bawah bergantian (Cat-Cow, 3 menit)",
      "Rasakan seluruh otot tulang belakang menjadi lega"
    ],
    free_check: { verified: true, notes: "Yoga restorative mandiri gratis" }
  },

  // Sosial & Teman (current 4, add 6 more)
  {
    id: "sosial-005",
    title: "Ucapkan Terima Kasih Spesifik ke Orang yang Membantu Hari Ini",
    description: "Alih-alih cuma bilang 'makasih', ucapkan dengan alasan konkret: 'Terima kasih ya sudah bantu beresin meja tadi, sangat meringankan tugasku'.",
    categories: ["sosial"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 5,
    social: "group",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Pikirkan satu orang di rumah atau rekan kerja yang sudah berinteraksi denganmu",
      "Identifikasi satu hal spesifik yang dia lakukan",
      "Sampaikan rasa terima kasihmu secara langsung atau via pesan singkat"
    ],
    free_check: { verified: true, notes: "Komunikasi interpersonal empatik gratis" }
  },
  {
    id: "sosial-006",
    title: "Buat Catatan Rekomendasi 3 Lagu/Film untuk Sahabat",
    description: "Pikirkan selera seorang sahabatmu. Pilih 3 rekomendasi lagu atau film yang sangat cocok dengan kepribadiannya dan kirimkan daftarnya.",
    categories: ["sosial"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "phone",
    needs_internet: true,
    difficulty: "easy",
    steps: [
      "Pilih 1 orang teman dekat",
      "Pikirkan lagu atau film yang baru-baru ini kamu nikmati dan relevan dengannya",
      "Kirim pesan: 'Lagi dengar ini dan kepikiran kamu, coba dengar deh!'"
    ],
    free_check: { verified: true, notes: "Berbagi kurasi karya gratis" }
  },
  {
    id: "sosial-007",
    title: "Tanyakan Kabar Tetangga Sebelah Rumah dengan Senyuman",
    description: "Sapa tetangga sebelah rumah saat berpapasan di luar pagar, tanyakan kabar sederhana untuk mempererat tali silaturahmi lingkungan.",
    categories: ["sosial"],
    rarity: "common",
    xp: 10,
    coins: 5,
    duration_min: 5,
    social: "group",
    place: "outdoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Keluar ke halaman atau teras rumah",
      "Saat melihat tetangga melintas, lempar senyuman ramah",
      "Sapa dengan hangat: 'Selamat sore Pak/Bu, sehat selalu ya'"
    ],
    free_check: { verified: true, notes: "Etika sosial bertetangga langsung" }
  },
  {
    id: "sosial-008",
    title: "Bikin Tantangan Voting Seru di Status WhatsApp/Instagram",
    description: "Buat polling santai yang mengundang debat seru teman: 'Bubur diaduk vs tidak diaduk' atau 'Tim martabak manis vs telur'.",
    categories: ["sosial"],
    rarity: "rare",
    xp: 25,
    coins: 10,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "phone",
    needs_internet: true,
    difficulty: "easy",
    steps: [
      "Buka fitur status atau story di media sosialmu",
      "Gunakan stiker polling pertanyaan ringan",
      "Balas komentar atau respons teman yang masuk dengan ramah"
    ],
    free_check: { verified: true, notes: "Interaksi sosial digital gratis" }
  },
  {
    id: "sosial-009",
    title: "Tawarkan Bantuan Tanpa Diminta untuk Tugas Rumah Sepele",
    description: "Bantu cuci piring yang ada di wastafel, buang sampah keluar, atau bawakan air minum untuk anggota keluargamu.",
    categories: ["sosial"],
    rarity: "epic",
    xp: 50,
    coins: 20,
    duration_min: 10,
    social: "group",
    place: "indoor",
    device: "none",
    needs_internet: false,
    difficulty: "easy",
    steps: [
      "Perhatikan hal kecil di rumah yang bisa dirapikan sekarang",
      "Kerjakan tanpa banyak bicara atau mengeluh",
      "Rasakan kepuasan saat melihat rumah sedikit lebih nyaman"
    ],
    free_check: { verified: true, notes: "Aksi kebaikan nyata di rumah" }
  },
  {
    id: "sosial-010",
    title: "Tulis Pesan Kejutan 'Aku Bangga Padamu' ke Pasangan/Sahabat",
    description: "Kirim pesan menyentuh hati ke orang terpenting dalam hidupmu, apresiasi kegigihan mereka dalam menghadapi masa sulit akhir-akhir ini.",
    categories: ["sosial"],
    rarity: "legendary",
    xp: 100,
    coins: 40,
    duration_min: 10,
    social: "solo",
    place: "indoor",
    device: "phone",
    needs_internet: true,
    difficulty: "medium",
    steps: [
      "Pilih 1 orang yang paling berjuang dalam hidupmu",
      "Tuliskan 3 kalimat tulus mengapa kamu bangga melihat perjuangannya",
      "Kirimkan dan biarkan harinya menjadi lebih cerah"
    ],
    free_check: { verified: true, notes: "Afirmasi positif antar manusia gratis" }
  }
];

const allCombined = [...migrated, ...newActivities];
console.log('Total activities after addition:', allCombined.length);

fs.writeFileSync('./data/activities.json', JSON.stringify(allCombined, null, 2), 'utf8');
console.log('Successfully written to ./data/activities.json');
