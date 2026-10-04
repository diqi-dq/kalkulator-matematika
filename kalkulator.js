/* ========================================================
   KALKULATOR MATEMATIKA — CORE
   Data, fungsi bantu, render, dan fungsi global.
   ======================================================== */

// ========================================================
// STATE GLOBAL
// ========================================================
var py = null;
var siap = false;
var sedangMemuat = false;
var kategoriAktif = "Semua";

// ========================================================
// DAFTAR PERINTAH
// ========================================================
var daftarPerintah = [
  { kategori: "Tabel Nilai", nama: "Tabel nilai (eksak)", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel x^2; x; 2; 5", ket: "Menampilkan tabel nilai dalam bentuk eksak. Pemisah argumen: titik koma (;)." },
  { kategori: "Tabel Nilai", nama: "Tabel nilai (desimal)", format: "tabel desimal <ekspresi>; x; a; b [; langkah]", contoh: "tabel desimal sin(x); x; 0; 3,14; 0,785", ket: "Menampilkan tabel nilai dalam bentuk desimal." },
  { kategori: "Tabel Nilai", nama: "Tabel pangkat", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel x^2; x; 2; 5", ket: "Tabel dengan ekspresi pangkat." },
  { kategori: "Tabel Nilai", nama: "Tabel pecahan", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel 1/x; x; 1; 5", ket: "Tabel dengan hasil pecahan eksak." },
  { kategori: "Tabel Nilai", nama: "Tabel akar", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel sqrt(x); x; 1; 5", ket: "Tabel dengan akar kuadrat." },
  { kategori: "Tabel Nilai", nama: "Tabel logaritma", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel log(x); x; 1; 5", ket: "Tabel dengan logaritma natural." },
  { kategori: "Tabel Nilai", nama: "Tabel eksponen", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel e^x; x; 0; 1; 0,25", ket: "Tabel dengan fungsi eksponen." },
  { kategori: "Tabel Nilai", nama: "Tabel trigonometri", format: "tabel <ekspresi>; x; a; b [; langkah]", contoh: "tabel sin(x); x; 0; pi; pi/4", ket: "Tabel dengan fungsi trigonometri." },
  { kategori: "Tabel Nilai", nama: "Tabel langkah pecahan", format: "tabel <ekspresi>; x; a; b; 1/2", contoh: "tabel x^2; x; 0; 2; 1/2", ket: "Tabel dengan langkah pecahan." },
  { kategori: "Tabel Nilai", nama: "Tabel langkah persen", format: "tabel <ekspresi>; x; a; b; 10%", contoh: "tabel x^2; x; 0; 1; 10%", ket: "Tabel dengan langkah persen." },

  { kategori: "Hitung", nama: "Hitung aritmetika", format: "hitung <ekspresi>", contoh: "hitung 2 + 3 * 4", ket: "Menghitung ekspresi aritmetika." },
  { kategori: "Hitung", nama: "Hitung persen", format: "hitung <a>% dari <b>", contoh: "hitung 15% dari 200", ket: "Menghitung persentase." },
  { kategori: "Hitung", nama: "Hitung pangkat", format: "hitung <a>^<b>", contoh: "hitung 2^10", ket: "Menghitung pangkat." },
  { kategori: "Hitung", nama: "Hitung akar", format: "hitung sqrt(<a>)", contoh: "hitung sqrt(144)", ket: "Menghitung akar." },
  { kategori: "Hitung", nama: "Hitung logaritma", format: "hitung log(<a>)", contoh: "hitung log(100)", ket: "Menghitung logaritma natural." },
  { kategori: "Hitung", nama: "Hitung trigonometri", format: "hitung sin(<sudut>)", contoh: "hitung sin(pi/6)", ket: "Menghitung trigonometri." },
  { kategori: "Hitung", nama: "Hitung faktorial", format: "hitung <n>!", contoh: "hitung 5!", ket: "Menghitung faktorial." },
  { kategori: "Hitung", nama: "Hitung kombinasi", format: "hitung C(<n>,<k>)", contoh: "hitung C(5,2)", ket: "Menghitung kombinasi." },
  { kategori: "Hitung", nama: "Hitung permutasi", format: "hitung P(<n>,<k>)", contoh: "hitung P(5,2)", ket: "Menghitung permutasi." },

  { kategori: "Aljabar", nama: "Pecahkan persamaan", format: "pecahkan <persamaan>", contoh: "pecahkan x^2-4=0", ket: "Mencari solusi persamaan." },
  { kategori: "Aljabar", nama: "Pecahkan sistem persamaan", format: "pecahkan <pers1>; <pers2>", contoh: "pecahkan x+y=5; x-y=1", ket: "Mencari solusi sistem persamaan. Pemisah: titik koma (;)." },
  { kategori: "Aljabar", nama: "Selesaikan pertidaksamaan", format: "selesaikan pertidaksamaan <pertidaksamaan>", contoh: "selesaikan pertidaksamaan x^2-4<0", ket: "Mencari interval solusi pertidaksamaan." },
  { kategori: "Aljabar", nama: "Faktorkan", format: "faktorkan <ekspresi>", contoh: "faktorkan x^2-4", ket: "Memfaktorkan ekspresi." },
  { kategori: "Aljabar", nama: "Faktor bilangan", format: "faktor <bilangan bulat>", contoh: "faktor 12", ket: "Faktorisasi bilangan bulat." },
  { kategori: "Aljabar", nama: "Jabarkan", format: "jabarkan <ekspresi>", contoh: "jabarkan (x+1)^3", ket: "Menjabarkan ekspresi." },
  { kategori: "Aljabar", nama: "Sederhanakan", format: "sederhanakan <ekspresi>", contoh: "sederhanakan x^2-8x+16", ket: "Menyederhanakan ekspresi ke bentuk paling sederhana." },
  { kategori: "Aljabar", nama: "Jumlah fungsi", format: "jumlah fungsi <f> ; <g> [; <h> ...]", contoh: "jumlah fungsi x^2 ; 2x+1", ket: "(f+g)(x) = f(x) + g(x)" },
  { kategori: "Aljabar", nama: "Kurang fungsi", format: "kurang fungsi <f> ; <g> [; <h> ...]", contoh: "kurang fungsi x^2 ; 2x+1", ket: "(f-g)(x) = f(x) - g(x)" },
  { kategori: "Aljabar", nama: "Kali fungsi", format: "kali fungsi <f> ; <g> [; <h> ...]", contoh: "kali fungsi x^2 ; 2x+1", ket: "(f×g)(x) = f(x) × g(x)" },
  { kategori: "Aljabar", nama: "Bagi fungsi", format: "bagi fungsi <f> ; <g> [; <h> ...]", contoh: "bagi fungsi x^2 ; x-1", ket: "(f÷g)(x) = f(x) / g(x), g(x) ≠ 0" },
  { kategori: "Aljabar", nama: "Komposisi fungsi", format: "komposisi fungsi <f> ; <g> [; <h> ...]", contoh: "komposisi fungsi x^2 ; 2x+1", ket: "(f∘g)(x) = f(g(x))" },
  { kategori: "Aljabar", nama: "Komposisi balik", format: "komposisi balik <f> ; <g>", contoh: "komposisi balik x^2 ; 2x+1", ket: "(g∘f)(x) = g(f(x))" },

  { kategori: "Kalkulus", nama: "Integral tak tentu", format: "integral <ekspresi>", contoh: "integral x^2", ket: "Menghitung antiturunan." },
  { kategori: "Kalkulus", nama: "Integral tentu", format: "integral <ekspresi>; x; a; b", contoh: "integral x^2; x; 0; 1", ket: "Menghitung integral tentu (pemisah: titik koma)." },
  { kategori: "Kalkulus", nama: "Turunan pertama", format: "turunan <ekspresi>", contoh: "turunan 3 x^4", ket: "Menghitung turunan pertama." },
  { kategori: "Kalkulus", nama: "Turunan kedua", format: "turunan2 <ekspresi>", contoh: "turunan2 x^4", ket: "Menghitung turunan kedua." },
  { kategori: "Kalkulus", nama: "Limit", format: "limit <ekspresi>; x->nilai", contoh: "limit sin(x)/x; x->0", ket: "Menghitung limit fungsi (pemisah: titik koma)." },
  { kategori: "Kalkulus", nama: "Deret Taylor", format: "deret taylor <ekspresi>; x; titik; orde", contoh: "deret taylor sin(x)/x; x; 0; 6", ket: "Ekspansi deret Taylor (pemisah: titik koma)." },
  { kategori: "Kalkulus", nama: "Ekspansi deret", format: "ekspansi deret <ekspresi>; x; titik; orde", contoh: "ekspansi deret cos(x); x; 0; 6", ket: "Ekspansi deret (pemisah: titik koma)." },
  { kategori: "Kalkulus", nama: "Kekontinuan", format: "kekontinuan <ekspresi>", contoh: "kekontinuan 1/sin(x)", ket: "Menganalisis kekontinuan fungsi, titik diskontinu, dan domain." },

  { kategori: "Barisan & Deret", nama: "Barisan", format: "barisan <rumus>; n; a; b", contoh: "barisan 1/n; n; 1; 10", ket: "Menampilkan suku barisan (pemisah: titik koma)." },
  { kategori: "Barisan & Deret", nama: "Suku ke-k", format: "suku <rumus>; n; k", contoh: "suku 1/n; n; 5", ket: "Menghitung suku ke-k (pemisah: titik koma)." },
  { kategori: "Barisan & Deret", nama: "Deret", format: "deret <rumus>; n; a; b", contoh: "deret 1/n; n; 1; 10", ket: "Menjumlahkan deret (pemisah: titik koma)." },
  { kategori: "Barisan & Deret", nama: "Deret tak hingga", format: "deret takhingga <rumus>; n", contoh: "deret takhingga 1/n^2; n", ket: "Menjumlahkan deret tak hingga (pemisah: titik koma)." },

  { kategori: "Matriks", nama: "Determinan", format: "determinan [[a;b];[c;d]]", contoh: "determinan [[1;2];[3;4]]", ket: "Determinan matriks (pemisah elemen: titik koma)." },
  { kategori: "Matriks", nama: "Jumlah matriks", format: "jumlah matriks [[...]] + [[...]] [+ ...]", contoh: "jumlah matriks [[1;2];[3;4]] + [[5;6];[7;8]]", ket: "Menjumlahkan dua atau lebih matriks (dimensi harus sama)." },
  { kategori: "Matriks", nama: "Kurang matriks", format: "kurang matriks [[...]] - [[...]] [- ...]", contoh: "kurang matriks [[5;6];[7;8]] - [[1;2];[3;4]]", ket: "Mengurangkan dua atau lebih matriks (dimensi harus sama)." },
  { kategori: "Matriks", nama: "Kali matriks", format: "kali matriks [[...]] * [[...]] [* ...]", contoh: "kali matriks [[1;2];[3;4]] * [[5;6];[7;8]]", ket: "Mengalikan dua atau lebih matriks (kolom A = baris B)." },
  { kategori: "Matriks", nama: "Invers matriks", format: "invers matriks [[a;b];[c;d]]", contoh: "invers matriks [[1;2];[3;4]]", ket: "Invers matriks persegi (determinan ≠ 0)." },
  { kategori: "Matriks", nama: "Transpos matriks", format: "transpos matriks [[a;b;c];[d;e;f]]", contoh: "transpos matriks [[1;2;3];[4;5;6]]", ket: "Transpos matriks (tukar baris & kolom)." },

  { kategori: "Matriks", nama: "Matriks diagonal", format: "matriks diagonal [a;b;c]", contoh: "matriks diagonal [1;2;3]", ket: "Matriks diagonal (pemisah: titik koma)." },
  { kategori: "Matriks", nama: "Matriks Gell-Mann", format: "matriks Gell-Mann n", contoh: "matriks Gell-Mann 1", ket: "Gell-Mann Matrix." },

  { kategori: "Bilangan", nama: "Bilangan prima", format: "bilangan prima n", contoh: "bilangan prima 20", ket: "Prima ≤ n." },
  { kategori: "Bilangan", nama: "Desimal", format: "desimal <ekspresi>", contoh: "desimal 1/3", ket: "Konversi ke desimal." },
  { kategori: "Bilangan", nama: "Biner", format: "biner <bilangan bulat>", contoh: "biner 10", ket: "Konversi ke biner." },

  { kategori: "Trigonometri", nama: "Sinus", format: "sinus <sudut>", contoh: "sinus pi/6", ket: "sin(x).", visual: true },
  { kategori: "Trigonometri", nama: "Kosinus", format: "kosinus <sudut>", contoh: "kosinus pi/3", ket: "cos(x)." },
  { kategori: "Trigonometri", nama: "Tangen", format: "tangen <sudut>", contoh: "tangen pi/4", ket: "tan(x)." },
  { kategori: "Trigonometri", nama: "Arcsinus", format: "arcsinus <nilai>", contoh: "arcsinus 0,5", ket: "arcsin(x)." },
  { kategori: "Trigonometri", nama: "Sinus hiperbolik", format: "sinus hiperbolik <nilai>", contoh: "sinus hiperbolik 1", ket: "sinh(x)." },
  { kategori: "Trigonometri", nama: "Derajat ke radian", format: "derajat ke radian <derajat>", contoh: "derajat ke radian 180", ket: "Konversi sudut." },

  { kategori: "Kombinatorika", nama: "Faktorial", format: "faktorial n", contoh: "faktorial 5", ket: "n!." },
  { kategori: "Kombinatorika", nama: "Kombinasi", format: "kombinasi n; k", contoh: "kombinasi 5; 2", ket: "C(n,k) (pemisah: titik koma)." },

  { kategori: "Lainnya", nama: "Pythagoras", format: "pythagoras <N>", contoh: "pythagoras 10", ket: "N tripel Pythagoras primitif." },

  { kategori: "Statistik", nama: "Rata-rata", format: "rata-rata <data>", contoh: "rata-rata 1, 2, 3, 4, 5", ket: "Menghitung rata-rata (mean) dari data." },
  { kategori: "Statistik", nama: "Median", format: "median <data>", contoh: "median 1, 2, 3, 4, 5", ket: "Menghitung median dari data." },
  { kategori: "Statistik", nama: "Modus", format: "modus <data>", contoh: "modus 1, 2, 2, 3, 3, 3, 4", ket: "Menghitung modus (nilai tersering)." },
  { kategori: "Statistik", nama: "Jangkauan", format: "jangkauan <data>", contoh: "jangkauan 1, 2, 3, 4, 5", ket: "Menghitung jangkauan (max - min)." },
  { kategori: "Statistik", nama: "Ringkasan statistik", format: "ringkasan <data>", contoh: "ringkasan 1, 2, 3, 4, 5", ket: "Rata-rata, median, modus, jangkauan sekaligus." },
  { kategori: "Statistik", nama: "Varians", format: "varians <data>", contoh: "varians 1, 2, 3, 4, 5", ket: "Varians sampel (n-1)." },
  { kategori: "Statistik", nama: "Standar deviasi", format: "standar deviasi <data>", contoh: "standar deviasi 1, 2, 3, 4, 5", ket: "Simpangan baku sampel (n-1)." },
  { kategori: "Statistik", nama: "Kovarian", format: "kovarian <data1> ; <data2>", contoh: "kovarian 1,2,3 ; 4,5,6", ket: "Kovarian dua himpunan data." },
  { kategori: "Statistik", nama: "Urutan angka", format: "urutan <data>", contoh: "urutan 5, 2, 8, 1, 9", ket: "Sortir data dari terkecil ke terbesar." },
  { kategori: "Statistik", nama: "Kuartil bawah", format: "kuartil bawah <data>", contoh: "kuartil bawah 1,2,3,4,5,6,7,8", ket: "Kuartil bawah (Q1)." },
  { kategori: "Statistik", nama: "Kuartil atas", format: "kuartil atas <data>", contoh: "kuartil atas 1,2,3,4,5,6,7,8", ket: "Kuartil atas (Q3)." },
  { kategori: "Statistik", nama: "Jangkauan interkuartil", format: "iqr <data>", contoh: "iqr 1,2,3,4,5,6,7,8", ket: "IQR = Q3 - Q1." },
  { kategori: "Statistik", nama: "Persentil", format: "persentil <p>; <data>", contoh: "persentil 25; 1,2,3,4,5,6,7,8", ket: "Persentil ke-p." },
  { kategori: "Statistik", nama: "Ringkasan lima angka", format: "lima angka <data>", contoh: "lima angka 1,2,3,4,5,6,7,8", ket: "Min, Q1, Median, Q3, Max." },
  { kategori: "Statistik", nama: "Box plot (teks)", format: "box plot <data>", contoh: "box plot 1,2,3,4,5,6,7,8", ket: "Representasi teks box plot." },
  { kategori: "Statistik", nama: "Rata-rata geometri", format: "rata-rata geometri <data>", contoh: "rata-rata geometri 1, 2, 4, 8", ket: "Rata-rata geometri." },
  { kategori: "Statistik", nama: "Rata-rata harmonis", format: "rata-rata harmonis <data>", contoh: "rata-rata harmonis 1, 2, 4", ket: "Rata-rata harmonis." },
  { kategori: "Statistik", nama: "Peluang", format: "peluang <n>; <k>", contoh: "peluang 5; 2", ket: "Peluang kombinasi C(n,k)/2^n." },
  { kategori: "Statistik", nama: "Distribusi normal", format: "distribusi normal <x>; <mu>; <sigma>", contoh: "distribusi normal 0; 0; 1", ket: "PDF distribusi normal." },
  { kategori: "Statistik", nama: "Distribusi binomial", format: "distribusi binomial <n>; <k>; <p>", contoh: "distribusi binomial 10; 5; 0,5", ket: "PDF binomial." },
  { kategori: "Statistik", nama: "Distribusi geometri", format: "distribusi geometri <k>; <p>", contoh: "distribusi geometri 3; 0,5", ket: "PDF geometri." },
  { kategori: "Statistik", nama: "Distribusi eksponensial", format: "distribusi eksponensial <x>; <lambda>", contoh: "distribusi eksponensial 1; 0,5", ket: "PDF eksponensial." },
  { kategori: "Statistik", nama: "Distribusi hipergeometrik", format: "distribusi hipergeometrik <N>; <K>; <n>; <k>", contoh: "distribusi hipergeometrik 50; 10; 5; 2", ket: "PDF hipergeometrik." },
  { kategori: "Statistik", nama: "Z-Score", format: "z-score <x>; <mu>; <sigma>", contoh: "z-score 1,5; 0; 1", ket: "Skor-Z." },
  { kategori: "Statistik", nama: "P-Value", format: "p-value <z>", contoh: "p-value 1,96", ket: "P-value dua sisi dari Z." },
  { kategori: "Statistik", nama: "Interval kepercayaan", format: "interval kepercayaan <mean>; <std>; <n>; <tingkat>", contoh: "interval kepercayaan 100; 15; 30; 0,95", ket: "Interval kepercayaan mean." },
  { kategori: "Statistik", nama: "Ukuran sampel", format: "ukuran sampel <margin>; <std>; <tingkat>", contoh: "ukuran sampel 5; 15; 0,95", ket: "Ukuran sampel minimum." },
  { kategori: "Statistik", nama: "Margin kesalahan", format: "margin kesalahan <std>; <n>; <tingkat>", contoh: "margin kesalahan 15; 30; 0,95", ket: "Margin of error." },
  { kategori: "Statistik", nama: "Regresi linier", format: "regresi linier <x> ; <y>", contoh: "regresi linier 1,2,3,4,5 ; 2,4,5,4,5", ket: "Regresi linier sederhana (OLS)." },
  { kategori: "Statistik", nama: "Distribusi Beta", format: "distribusi beta <x>; <alpha>; <beta>", contoh: "distribusi beta 0,5; 2; 3", ket: "PDF distribusi Beta." }
];

// ========================================================
// URUTAN KATEGORI
// ========================================================
var urutanKategori = [
  "Hitung",
  "Bilangan",
  "Aljabar",
  "Trigonometri",
  "Kalkulus",
  "Barisan & Deret",
  "Matriks",
  "Tabel Nilai",
  "Kombinatorika",
  "Statistik",
  "Lainnya"
];

// ========================================================
// FUNGSI BANTU UMUM
// ========================================================
function pisahArgumen(rest) {
  if (rest.indexOf(";") !== -1) {
    return rest.split(";").map(function(s){return s.trim();});
  }
  return rest.split(",").map(function(s){return s.trim();});
}

function konversiKomaDesimal(str) {
  return str.replace(/(\d),(\d)/g, '$1.$2');
}

function formatAngkaJS(n) {
  if (typeof n !== 'number' || !isFinite(n)) return String(n);
  if (Number.isInteger(n)) return String(n);
  var s = n.toFixed(10).replace(/\.?0+$/, '');
  return s.replace('.', ',');
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function konversiAngka(str) {
  var s = String(str).trim().toLowerCase();
  s = s.replace(/\s+/g, '');
  s = s.replace(/\bpi\b/g, String(Math.PI));
  s = s.replace(/\be\b/g, String(Math.E));
  s = s.replace(/(\d+(?:\.\d+)?)%/g, function(match, num) {
    return String(parseFloat(num) / 100);
  });
  var maxIter = 5;
  while (maxIter-- > 0) {
    var sebelum = s;
    s = s.replace(/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/g, function(match, a, b) {
      return String(parseFloat(a) / parseFloat(b));
    });
    if (s === sebelum) break;
  }
  try {
    var ekspresi = s.replace(/\^/g, '**');
    if (/^[\d\s\+\-\*\/\(\)\.\*\*]+$/.test(ekspresi)) {
      var hasil = Function('"use strict"; return (' + ekspresi + ')')();
      if (typeof hasil === 'number' && isFinite(hasil)) {
        return hasil;
      }
    }
  } catch(e) {}
  var hasil = parseFloat(s);
  if (isNaN(hasil)) return null;
  return hasil;
}

function sisipKaliImplisit(expr) {
  var hasil = expr;
  var fungsi = [
    'sin','cos','tan','cot','sec','csc',
    'asin','acos','atan','sinh','cosh','tanh',
    'log','ln','exp','sqrt','abs','Abs',
    'pi','oo','inf','infinity',
    'Matrix','Eq','N','Sum','Product','Limit','Integral','Derivative',
    'Piecewise','sign','floor','ceil','factorial','binomial',
    'gcd','lcm','mod','Min','Max','Rational','Float','Integer'
  ];

  hasil = hasil.replace(/(\d+(?:\.\d+)?)\s*%\s*dari\s*(\d+(?:\.\d+)?)/gi, '($1/100)*$2');
  hasil = hasil.replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
  hasil = hasil.replace(/\bC\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, 'binomial($1,$2)');
  hasil = hasil.replace(/\bP\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, 'factorial($1)/factorial($1-$2)');

  hasil = hasil.replace(/\bsinus hiperbolik\b/gi, 'sinh');
  hasil = hasil.replace(/\bkosinus hiperbolik\b/gi, 'cosh');
  hasil = hasil.replace(/\btangen hiperbolik\b/gi, 'tanh');
  hasil = hasil.replace(/\barcsinus\b/gi, 'asin');
  hasil = hasil.replace(/\barckosinus\b/gi, 'acos');
  hasil = hasil.replace(/\barcktangen\b/gi, 'atan');
  hasil = hasil.replace(/\bsinus\b/gi, 'sin');
  hasil = hasil.replace(/\bkosinus\b/gi, 'cos');
  hasil = hasil.replace(/\btangen\b/gi, 'tan');
  hasil = hasil.replace(/\bkosekan\b/gi, 'csc');
  hasil = hasil.replace(/\bsekan\b/gi, 'sec');
  hasil = hasil.replace(/\bkotangen\b/gi, 'cot');
  hasil = hasil.replace(/\btakhingga\b/gi, 'oo');

  var fungsiTrigo = ['sin','cos','tan','cot','sec','csc',
                     'asin','acos','atan','sinh','cosh','tanh',
                     'log','ln','exp','sqrt','abs'];

  var berubah = true;
  var maxIter = 10;
  while (berubah && maxIter-- > 0) {
    berubah = false;
    for (var fi = 0; fi < fungsiTrigo.length; fi++) {
      var f = fungsiTrigo[fi];
      var re = new RegExp('\\b' + f + '\\s+(?!\\()([a-zA-Z0-9_.]+(?:\\s*[\\*\\/]\\s*[a-zA-Z0-9_.]+)*)', 'g');
      var sebelum = hasil;
      hasil = hasil.replace(re, function(match, arg) {
        return f + '(' + arg + ')';
      });
      if (hasil !== sebelum) berubah = true;
    }
  }

  hasil = hasil.replace(/\s+/g, ' ').trim();
  hasil = hasil.replace(/(\d)\s+([a-zA-Z])/g, '$1*$2');
  hasil = hasil.replace(/(\d)([a-zA-Z])/g, '$1*$2');
  hasil = hasil.replace(/\)\s+([a-zA-Z])/g, ')*$1');
  hasil = hasil.replace(/\)([a-zA-Z])/g, ')*$1');
  hasil = hasil.replace(/([a-zA-Z]+)\s*\(/g, function(match, word) {
    if (fungsi.indexOf(word) !== -1 || fungsi.indexOf(word.toLowerCase()) !== -1) {
      return match;
    }
    return word + '*(';
  });
  hasil = hasil.replace(/\)\s*\(/g, ')*(');
  hasil = hasil.replace(/(\d)\s*\(/g, '$1*(');
  hasil = hasil.replace(/\s*([\+\-\*\/\=\<\>])\s*/g, '$1');
  hasil = hasil.replace(/,\s*/g, ',');

  return hasil;
}

function deteksiVariabel(expr) {
  var bersih = expr.replace(/\b(sin|cos|tan|log|exp|sqrt|pi|oo)\b/gi, '');
  var cocok = bersih.match(/\b([a-zA-Z])\b/g);
  if (cocok && cocok.length > 0) {
    if (cocok.indexOf('x') !== -1) return 'x';
    if (cocok.indexOf('y') !== -1) return 'y';
    if (cocok.indexOf('z') !== -1) return 'z';
    return cocok[0];
  }
  return 'x';
}

// ========================================================
// RENDER TOMBOL KATEGORI
// ========================================================
function renderKategori() {
  var container = document.getElementById('km-kategori');
  if (!container) return;

  var kategoriSet = {};
  daftarPerintah.forEach(function(p) {
    kategoriSet[p.kategori] = true;
  });

  var kategoriList = urutanKategori.filter(function(kat) {
    return kategoriSet[kat];
  });
  Object.keys(kategoriSet).forEach(function(kat) {
    if (urutanKategori.indexOf(kat) === -1) {
      kategoriList.push(kat);
    }
  });

  var html = "";
  var aktifSemua = (kategoriAktif === "Semua");
  html += '<button onclick="kmPilihKategori(\'Semua\')" ' +
          'style="padding:8px 16px; border-radius:20px; border:1px solid ' + (aktifSemua ? '#1a73e8' : '#ddd') + '; ' +
          'background:' + (aktifSemua ? '#1a73e8' : '#fff') + '; ' +
          'color:' + (aktifSemua ? '#fff' : '#000') + '; ' +
          'cursor:pointer; font-size:13px; font-weight:600;">Semua</button>';

  kategoriList.forEach(function(kat) {
    var aktif = (kategoriAktif === kat);
    html += '<button onclick="kmPilihKategori(\'' + kat.replace(/'/g, "\\'") + '\')" ' +
            'style="padding:8px 16px; border-radius:20px; border:1px solid ' + (aktif ? '#1a73e8' : '#ddd') + '; ' +
            'background:' + (aktif ? '#1a73e8' : '#fff') + '; ' +
            'color:' + (aktif ? '#fff' : '#000') + '; ' +
            'cursor:pointer; font-size:13px; font-weight:600;">' + kat + '</button>';
  });

  container.innerHTML = html;
}

// ========================================================
// RENDER DAFTAR PERINTAH
// ========================================================
function renderDaftar(filter) {
  var container = document.getElementById('km-daftar');
  var html = "";

  var hasil = daftarPerintah.filter(function(p) {
    if (kategoriAktif !== "Semua" && p.kategori !== kategoriAktif) {
      return false;
    }
    if (!filter) return true;
    var f = filter.toLowerCase();
    return p.nama.toLowerCase().indexOf(f) !== -1 ||
           p.format.toLowerCase().indexOf(f) !== -1 ||
           p.contoh.toLowerCase().indexOf(f) !== -1 ||
           p.ket.toLowerCase().indexOf(f) !== -1 ||
           p.kategori.toLowerCase().indexOf(f) !== -1;
  });

  if (hasil.length === 0) {
    container.innerHTML = '<div style="padding:30px 20px; color:#000; text-align:center; font-size:14px;">Tidak ada perintah yang cocok.</div>';
    return;
  }

  var kategoriTerakhir = "";
  hasil.forEach(function(p) {
    if (kategoriAktif === "Semua" && p.kategori !== kategoriTerakhir) {
      kategoriTerakhir = p.kategori;
      html += '<div style="padding:12px 20px; background:#e8f0fe; border-bottom:1px solid #c5d9f1; position:sticky; top:0; z-index:1;">' +
                '<span style="color:#000; font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:0.8px;">' + p.kategori + '</span>' +
              '</div>';
    }

    html += '<div onclick="kmPakaiPerintah(\'' + p.contoh.replace(/'/g, "\\'") + '\')" ' +
            'style="padding:16px 20px; border-bottom:1px solid #f0f0f0; cursor:pointer; background:#fff;" ' +
            'onmouseover="this.style.background=\'#f8fbff\'" ' +
            'onmouseout="this.style.background=\'#fff\'">' +
            '<div style="font-size:15px; font-weight:700; color:#000; margin-bottom:8px;">' + p.nama + '</div>' +
            '<div style="font-size:12px; color:#000; font-family:Consolas, Monaco, monospace; background:#f5f5f5; padding:6px 10px; border-radius:4px; margin-bottom:8px;">' +
              'Format: ' + p.format +
            '</div>' +
            '<div style="font-size:13px; color:#000; line-height:1.6; margin-bottom:8px;">' + p.ket + '</div>' +
            '<div style="font-size:12px; color:#000; font-family:Consolas, Monaco, monospace;">' +
              'Contoh: ' + p.contoh +
            '</div>' +
            '</div>';
  });

  container.innerHTML = html;
}

// ========================================================
// FUNGSI GLOBAL (dipanggil dari onclick)
// ========================================================
window.kmPilihKategori = function(kat) {
  kategoriAktif = kat;
  renderKategori();
  renderDaftar(document.getElementById('km-cari').value.trim());
};

window.kmCariPerintah = function() {
  var q = document.getElementById('km-cari').value.trim();
  if (q) {
    kategoriAktif = "Semua";
    renderKategori();
  }
  renderDaftar(q);
};

window.kmPakaiPerintah = function(contoh) {
  document.getElementById('km-input').value = contoh;
  document.getElementById('km-input').focus();
};

// ========================================================
// FUNGSI BANTU TIER 1 (BigInt, sieving, dll.)
// ========================================================
function faktorialBigInt(n) {
  var hasil = BigInt(1);
  for (var i = 2; i <= n; i++) {
    hasil *= BigInt(i);
  }
  return hasil;
}

function binomialBigInt(n, k) {
  if (k < 0 || k > n) return BigInt(0);
  if (k === 0 || k === n) return BigInt(1);
  k = Math.min(k, n - k);
  var hasil = BigInt(1);
  for (var i = 1; i <= k; i++) {
    hasil = hasil * BigInt(n - k + i) / BigInt(i);
  }
  return hasil;
}

function permutasiBigInt(n, k) {
  if (k < 0 || k > n) return BigInt(0);
  var hasil = BigInt(1);
  for (var i = 0; i < k; i++) {
    hasil *= BigInt(n - i);
  }
  return hasil;
}

function sievePrima(n) {
  if (n < 2) return [];
  var sieve = new Uint8Array(n + 1);
  sieve[0] = 1; sieve[1] = 1;
  for (var i = 2; i * i <= n; i++) {
    if (!sieve[i]) {
      for (var j = i * i; j <= n; j += i) {
        sieve[j] = 1;
      }
    }
  }
  var hasil = [];
  for (var i = 2; i <= n; i++) {
    if (!sieve[i]) hasil.push(i);
  }
  return hasil;
}

function pythagorasPrimitif(N) {
  var hasil = [];
  var m = 2;
  while (hasil.length < N && m < 10000) {
    for (var n = 1; n < m; n++) {
      if (gcd(m, n) === 1 && (m - n) % 2 === 1) {
        var a = m * m - n * n;
        var b = 2 * m * n;
        var c = m * m + n * n;
        hasil.push([a, b, c]);
        if (hasil.length >= N) break;
      }
    }
    m++;
  }
  return hasil;
}

function gcd(a, b) {
  while (b) {
    var t = b;
    b = a % b;
    a = t;
  }
  return a;
}

// ========================================================
// INISIALISASI
// ========================================================
document.addEventListener('DOMContentLoaded', function() {
  renderKategori();
  renderDaftar("");
});
