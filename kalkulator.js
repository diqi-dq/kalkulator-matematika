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
  // ... (Tabel Nilai, Hitung, Aljabar, Kalkulus, Barisan, Matriks — TIDAK BERUBAH) ...

  // ========== BILANGAN ==========
  { kategori: "Bilangan", nama: "Bilangan prima", format: "bilangan prima n", contoh: "bilangan prima 20", ket: "Prima ≤ n." },
  { kategori: "Bilangan", nama: "Desimal", format: "desimal <ekspresi>", contoh: "desimal 1/3", ket: "Konversi ke desimal." },
  // ✅ FIX: Hapus "Biner" — duplikat dengan "Ke biner"
  // { kategori: "Bilangan", nama: "Biner", format: "biner <bilangan bulat>", contoh: "biner 10", ket: "Konversi ke biner." },
  
  { 
    kategori: "Bilangan", 
    nama: "FPB", 
    format: "fpb <a>; <b> [; <c> ...]", 
    contoh: "fpb 12; 18; 24", 
    ket: "Faktor Persekutuan Terbesar dari 2 atau lebih bilangan." 
  },
  { 
    kategori: "Bilangan", 
    nama: "KPK", 
    format: "kpk <a>; <b> [; <c> ...]", 
    contoh: "kpk 4; 6; 8", 
    ket: "Kelipatan Persekutuan Terkecil dari 2 atau lebih bilangan." 
  },
  { 
    kategori: "Bilangan", 
    nama: "FPB detail", 
    format: "fpb detail <a>; <b> [; <c> ...]", 
    contoh: "fpb detail 12; 18", 
    ket: "FPB dengan langkah faktorisasi prima." 
  },
  { 
    kategori: "Bilangan", 
    nama: "KPK detail", 
    format: "kpk detail <a>; <b> [; <c> ...]", 
    contoh: "kpk detail 12; 18", 
    ket: "KPK dengan langkah faktorisasi prima." 
  },
  { 
    kategori: "Bilangan", 
    nama: "Faktorisasi prima", 
    format: "faktorisasi <n>", 
    contoh: "faktorisasi 60", 
    ket: "Faktorisasi bilangan prima." 
  },
  { kategori: "Bilangan", nama: "Cek prima", format: "prima? <n>", contoh: "prima? 17", ket: "Cek apakah bilangan prima." },
    
  { kategori: "Bilangan", nama: "Ke biner", format: "ke biner <n>", contoh: "ke biner 10", ket: "Konversi ke biner." },
  { kategori: "Bilangan", nama: "Ke oktal", format: "ke oktal <n>", contoh: "ke oktal 10", ket: "Konversi ke oktal." },
  { kategori: "Bilangan", nama: "Ke heksadesimal", format: "ke heksadesimal <n>", contoh: "ke heksadesimal 255", ket: "Konversi ke heksadesimal." },

  // ========== TRIGONOMETRI ==========
  { kategori: "Trigonometri", nama: "Sinus", format: "sinus <sudut>", contoh: "sinus pi/6", ket: "sin(x).", visual: true },
  { kategori: "Trigonometri", nama: "Kosinus", format: "kosinus <sudut>", contoh: "kosinus pi/3", ket: "cos(x)." },
  { kategori: "Trigonometri", nama: "Tangen", format: "tangen <sudut>", contoh: "tangen pi/4", ket: "tan(x)." },
  { kategori: "Trigonometri", nama: "Arcsinus", format: "arcsinus <nilai>", contoh: "arcsinus 0,5", ket: "arcsin(x)." },
  { kategori: "Trigonometri", nama: "Sinus hiperbolik", format: "sinus hiperbolik <nilai>", contoh: "sinus hiperbolik 1", ket: "sinh(x)." },
  { kategori: "Trigonometri", nama: "Kosinus hiperbolik", format: "kosinus hiperbolik <nilai>", contoh: "kosinus hiperbolik 1", ket: "cosh(x)." },
  { kategori: "Trigonometri", nama: "Tangen hiperbolik", format: "tangen hiperbolik <nilai>", contoh: "tangen hiperbolik 1", ket: "tanh(x)." },
  // ✅ FIX: Hapus "Derajat ke radian" — duplikat dengan kategori Konversi
  // { kategori: "Trigonometri", nama: "Derajat ke radian", format: "derajat ke radian <derajat>", contoh: "derajat ke radian 180", ket: "Konversi sudut." },

  // ... (Kombinatorika, Lainnya, Statistik — TIDAK BERUBAH) ...

  // ========== KONVERSI ==========
  // ... (semua entri Konversi — TIDAK BERUBAH) ...
];

// ========================================================
// URUTAN KATEGORI
// ========================================================
var urutanKategori = [
  "Hitung",
  "Bilangan",
  "Konversi",
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
  var temp = [];
  // ✅ FIX: Regex lebih luas untuk C(...) dan P(...)
  var hasil = str.replace(/\b[CP]\s*\([^)]*\)/g, function(match) {
    temp.push(match);
    return "__CP__" + (temp.length - 1) + "__";
  });

  // Konversi koma desimal ke titik
  hasil = hasil.replace(/(\d),(\d)/g, '$1.$2');

  // Kembalikan C(...) dan P(...)
  hasil = hasil.replace(/__CP__(\d+)__/g, function(match, idx) {
    return temp[parseInt(idx)];
  });

  return hasil;
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
  // ✅ FIX: Regex lebih spesifik untuk 'e'
  // Hanya ubah 'e' yang berdiri sendiri (bukan bagian dari 'exp', 'deret', dll.)
  s = s.replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, String(Math.E));
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
  // ✅ FIX: Pisahkan konstanta dari fungsi
  var konstanta = ['pi', 'oo', 'inf', 'infinity', 'E', 'I'];

  var fungsi = [
    'sin','cos','tan','cot','sec','csc',
    'asin','acos','atan','sinh','cosh','tanh',
    'log','ln','exp','sqrt','abs','Abs',
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
  // ✅ FIX: Handle konstanta diikuti kurung
  hasil = hasil.replace(/\b(pi|oo|inf|infinity|E|I)\s*\(/g, '$1*(');

  // Handle fungsi
  hasil = hasil.replace(/([a-zA-Z]+)\s*\(/g, function(match, word) {
    if (fungsi.indexOf(word) !== -1 || fungsi.indexOf(word.toLowerCase()) !== -1) {
      return match;
    }
    if (konstanta.indexOf(word) !== -1 || konstanta.indexOf(word.toLowerCase()) !== -1) {
      return word + '*(';
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
  // ✅ FIX: Deklarasi var di luar loop
  var i, j;
  for (i = 2; i * i <= n; i++) {
    if (!sieve[i]) {
      for (j = i * i; j <= n; j += i) {
        sieve[j] = 1;
      }
    }
  }
  var hasil = [];
  for (i = 2; i <= n; i++) {
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