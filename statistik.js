/* ========================================================
   MODUL STATISTIK (Tier 1 — Vanilla JS)
   ======================================================== */

function jalankanStatistik(q, out) {
  var lower = q.toLowerCase();

  // --- FUNGSI BANTU STATISTIK ---
function parseData(str) {
  var s = String(str).trim();
  if (!s) return null;

  // ✅ FIX: Strategi parsing yang lebih cerdas
  // 1. Jika ada ';' → itu pemisah data
  // 2. Jika ada spasi → itu pemisah data
  // 3. Jika hanya koma → cek pola:
  //    - "digit, digit" → pemisah
  //    - "digit,digit" → desimal

  var parts;
  if (s.indexOf(';') !== -1) {
    parts = s.split(';');
  } else if (/\s/.test(s)) {
    parts = s.split(/\s+/);
  } else if (/\d,\s/.test(s)) {
    // Ada pola "digit, spasi" → koma adalah pemisah
    parts = s.split(/,\s*/);
  } else if (/\d,\d/.test(s)) {
    // Ada pola "digit,digit" → koma adalah desimal
    // Tapi ini berarti hanya ada satu angka
    parts = [s];
  } else {
    parts = s.split(',');
  }

  var data = [];
  for (var i = 0; i < parts.length; i++) {
    var v = parts[i].trim();
    if (v === '') continue;
    // ✅ FIX: Konversi koma desimal ke titik
    v = v.replace(',', '.');
    var num = parseFloat(v);
    if (isNaN(num)) return null;
    data.push(num);
  }
  return data;
}

  function rataRata(data) {
    var jumlah = 0;
    for (var i = 0; i < data.length; i++) jumlah += data[i];
    return jumlah / data.length;
  }

  function hitungKuartil(data, q) {
    var sorted = data.slice().sort(function(a, b) { return a - b; });
    var n = sorted.length;
    var pos = q * (n + 1) / 4 - 1;
    if (pos < 0) return sorted[0];
    if (pos >= n - 1) return sorted[n - 1];
    var bawah = Math.floor(pos);
    var atas = Math.ceil(pos);
    var frac = pos - bawah;
    return sorted[bawah] + frac * (sorted[atas] - sorted[bawah]);
  }

  function hitungPersentil(data, p) {
    var sorted = data.slice().sort(function(a, b) { return a - b; });
    var n = sorted.length;
    var pos = p * (n + 1) / 100 - 1;
    if (pos < 0) return sorted[0];
    if (pos >= n - 1) return sorted[n - 1];
    var bawah = Math.floor(pos);
    var atas = Math.ceil(pos);
    var frac = pos - bawah;
    return sorted[bawah] + frac * (sorted[atas] - sorted[bawah]);
  }

  function erf(x) {
    var sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;
    var t = 1 / (1 + p * x);
    var y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  // --- RATA-RATA GEOMETRI ---
  if (lower.startsWith("rata-rata geometri")) {
    var data = parseData(q.replace(/^rata-rata geometri\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: rata-rata geometri <data>"; return true; }
    var produk = 1;
    for (var i = 0; i < data.length; i++) produk *= data[i];
    var gm = Math.pow(produk, 1 / data.length);
    out.innerHTML = "Rata-rata geometri = " + formatAngkaJS(gm);
    return true;
  }

  if (lower.startsWith("rata-rata harmonis")) {
    var data = parseData(q.replace(/^rata-rata harmonis\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: rata-rata harmonis <data>"; return true; }
    var jumlah = 0;
    for (var i = 0; i < data.length; i++) jumlah += 1 / data[i];
    var hm = data.length / jumlah;
    out.innerHTML = "Rata-rata harmonis = " + formatAngkaJS(hm);
    return true;
  }

  if (lower.startsWith("rata-rata")) {
    var data = parseData(q.replace(/^rata-rata\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: rata-rata <data>"; return true; }
    var jumlah = 0;
    for (var i = 0; i < data.length; i++) jumlah += data[i];
    var mean = jumlah / data.length;
    out.innerHTML = "Rata-rata = " + formatAngkaJS(mean) + " (n = " + data.length + ")";
    return true;
  }

  if (lower.startsWith("median")) {
    var data = parseData(q.replace(/^median\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: median <data>"; return true; }
    data.sort(function(a, b) { return a - b; });
    var n = data.length;
    var med = (n % 2 === 1) ? data[(n - 1) / 2] : (data[n / 2 - 1] + data[n / 2]) / 2;
    out.innerHTML = "Median = " + formatAngkaJS(med) + " (n = " + n + ")";
    return true;
  }

  if (lower.startsWith("modus")) {
    var data = parseData(q.replace(/^modus\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: modus <data>"; return true; }
    var freq = {};
    for (var i = 0; i < data.length; i++) {
      freq[data[i]] = (freq[data[i]] || 0) + 1;
    }
    var maxFreq = 0;
    for (var k in freq) if (freq[k] > maxFreq) maxFreq = freq[k];
    var modus = [];
    for (var k in freq) if (freq[k] === maxFreq) modus.push(k);
    out.innerHTML = "Modus = " + modus.join(", ") + " (frekuensi = " + maxFreq + ")";
    return true;
  }

  if (lower.startsWith("jangkauan")) {
    var data = parseData(q.replace(/^jangkauan\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: jangkauan <data>"; return true; }
    var min = Math.min.apply(null, data);
    var max = Math.max.apply(null, data);
    out.innerHTML = "Jangkauan = " + formatAngkaJS(max - min) + " (min = " + min + ", max = " + max + ")";
    return true;
  }

  if (lower.startsWith("varians")) {
    var data = parseData(q.replace(/^varians\s*/i, ""));
    if (!data || data.length < 2) { out.innerHTML = "Format: varians <data> (minimal 2 data)"; return true; }
    var mean = rataRata(data);
    var jumlah = 0;
    for (var i = 0; i < data.length; i++) jumlah += Math.pow(data[i] - mean, 2);
    var variansSampel = jumlah / (data.length - 1);
    var variansPopulasi = jumlah / data.length;
    out.innerHTML = "Varians sampel (n-1) = " + formatAngkaJS(variansSampel) +
                     "<br>Varians populasi (n) = " + formatAngkaJS(variansPopulasi);
    return true;
  }

  if (lower.startsWith("standar deviasi")) {
    var data = parseData(q.replace(/^standar deviasi\s*/i, ""));
    if (!data || data.length < 2) { out.innerHTML = "Format: standar deviasi <data> (minimal 2 data)"; return true; }
    var mean = rataRata(data);
    var jumlah = 0;
    for (var i = 0; i < data.length; i++) jumlah += Math.pow(data[i] - mean, 2);
    var sdSampel = Math.sqrt(jumlah / (data.length - 1));
    var sdPopulasi = Math.sqrt(jumlah / data.length);
    out.innerHTML = "Standar deviasi sampel (n-1) = " + formatAngkaJS(sdSampel) +
                     "<br>Standar deviasi populasi (n) = " + formatAngkaJS(sdPopulasi);
    return true;
  }

  if (lower.startsWith("kovarian")) {
    var rest = q.replace(/^kovarian\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 2) { out.innerHTML = "Format: kovarian <data1> ; <data2>"; return true; }
    var data1 = parseData(parts[0]);
    var data2 = parseData(parts[1]);
    if (!data1 || !data2 || data1.length !== data2.length) {
      out.innerHTML = "❌ Kedua data harus memiliki panjang sama.";
      return true;
    }
    var mean1 = rataRata(data1);
    var mean2 = rataRata(data2);
    var jumlah = 0;
    for (var i = 0; i < data1.length; i++) jumlah += (data1[i] - mean1) * (data2[i] - mean2);
    var kovSampel = jumlah / (data1.length - 1);
    var kovPopulasi = jumlah / data1.length;
    out.innerHTML = "Kovarian sampel (n-1) = " + formatAngkaJS(kovSampel) +
                     "<br>Kovarian populasi (n) = " + formatAngkaJS(kovPopulasi);
    return true;
  }

  if (lower.startsWith("urutan")) {
    var data = parseData(q.replace(/^urutan\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: urutan <data>"; return true; }
    data.sort(function(a, b) { return a - b; });
    out.innerHTML = "Urutan: " + data.map(formatAngkaJS).join(", ");
    return true;
  }

  if (lower.startsWith("ringkasan")) {
    var data = parseData(q.replace(/^ringkasan\s*/i, ""));
    if (!data || data.length === 0) { out.innerHTML = "Format: ringkasan <data>"; return true; }
    data.sort(function(a, b) { return a - b; });
    var n = data.length;
    var mean = rataRata(data);
    var med = (n % 2 === 1) ? data[(n - 1) / 2] : (data[n / 2 - 1] + data[n / 2]) / 2;
    var min = data[0], max = data[n - 1];
    var freq = {};
    for (var i = 0; i < data.length; i++) freq[data[i]] = (freq[data[i]] || 0) + 1;
    var maxFreq = 0;
    for (var k in freq) if (freq[k] > maxFreq) maxFreq = freq[k];
    var modus = [];
    for (var k in freq) if (freq[k] === maxFreq) modus.push(k);
    out.innerHTML = "n = " + n + "<br>" +
                    "Rata-rata = " + formatAngkaJS(mean) + "<br>" +
                    "Median = " + formatAngkaJS(med) + "<br>" +
                    "Modus = " + modus.join(", ") + "<br>" +
                    "Jangkauan = " + formatAngkaJS(max - min) + " (min = " + min + ", max = " + max + ")";
    return true;
  }

  if (lower.startsWith("kuartil bawah")) {
    var data = parseData(q.replace(/^kuartil bawah\s*/i, ""));
    if (!data || data.length < 4) { out.innerHTML = "Format: kuartil bawah <data> (minimal 4 data)"; return true; }
    var q1 = hitungKuartil(data, 1);
    out.innerHTML = "Kuartil bawah (Q1) = " + formatAngkaJS(q1);
    return true;
  }

  if (lower.startsWith("kuartil atas")) {
    var data = parseData(q.replace(/^kuartil atas\s*/i, ""));
    if (!data || data.length < 4) { out.innerHTML = "Format: kuartil atas <data> (minimal 4 data)"; return true; }
    var q3 = hitungKuartil(data, 3);
    out.innerHTML = "Kuartil atas (Q3) = " + formatAngkaJS(q3);
    return true;
  }

  if (lower.startsWith("iqr") || lower.startsWith("jangkauan interkuartil")) {
    var prefix = lower.startsWith("iqr") ? /^iqr\s*/i : /^jangkauan interkuartil\s*/i;
    var data = parseData(q.replace(prefix, ""));
    if (!data || data.length < 4) { out.innerHTML = "Format: iqr <data> (minimal 4 data)"; return true; }
    var q1 = hitungKuartil(data, 1);
    var q3 = hitungKuartil(data, 3);
    out.innerHTML = "IQR = Q3 - Q1 = " + formatAngkaJS(q3 - q1) +
                     "<br>Q1 = " + formatAngkaJS(q1) + ", Q3 = " + formatAngkaJS(q3);
    return true;
  }

  if (lower.startsWith("persentil")) {
    var rest = q.replace(/^persentil\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 2) { out.innerHTML = "Format: persentil <p>; <data>"; return true; }
    var p = parseFloat(parts[0]);
    var data = parseData(parts[1]);
    if (isNaN(p) || p < 0 || p > 100) { out.innerHTML = "❌ p harus 0-100."; return true; }
    if (!data || data.length === 0) { out.innerHTML = "Format: persentil <p>; <data>"; return true; }
    var pers = hitungPersentil(data, p);
    out.innerHTML = "Persentil ke-" + p + " = " + formatAngkaJS(pers);
    return true;
  }

  if (lower.startsWith("lima angka")) {
    var data = parseData(q.replace(/^lima angka\s*/i, ""));
    if (!data || data.length < 4) { out.innerHTML = "Format: lima angka <data> (minimal 4 data)"; return true; }
    data.sort(function(a, b) { return a - b; });
    var min = data[0];
    var max = data[data.length - 1];
    var q1 = hitungKuartil(data, 1);
    var med = hitungPersentil(data, 50);
    var q3 = hitungKuartil(data, 3);
    out.innerHTML = "Min = " + formatAngkaJS(min) +
                    "<br>Q1 = " + formatAngkaJS(q1) +
                    "<br>Median = " + formatAngkaJS(med) +
                    "<br>Q3 = " + formatAngkaJS(q3) +
                    "<br>Max = " + formatAngkaJS(max);
    return true;
  }

  if (lower.startsWith("box plot")) {
    var data = parseData(q.replace(/^box plot\s*/i, ""));
    if (!data || data.length < 4) { out.innerHTML = "Format: box plot <data> (minimal 4 data)"; return true; }
    data.sort(function(a, b) { return a - b; });
    var min = data[0];
    var max = data[data.length - 1];
    var q1 = hitungKuartil(data, 1);
    var med = hitungPersentil(data, 50);
    var q3 = hitungKuartil(data, 3);
    var iqr = q3 - q1;
    var batasBawah = q1 - 1.5 * iqr;
    var batasAtas = q3 + 1.5 * iqr;
    var outliers = data.filter(function(x) { return x < batasBawah || x > batasAtas; });
    var html = "Box Plot:<br>" +
               "Min = " + formatAngkaJS(min) + "<br>" +
               "Q1 = " + formatAngkaJS(q1) + "<br>" +
               "Median = " + formatAngkaJS(med) + "<br>" +
               "Q3 = " + formatAngkaJS(q3) + "<br>" +
               "Max = " + formatAngkaJS(max) + "<br>" +
               "IQR = " + formatAngkaJS(iqr) + "<br>" +
               "Batas bawah = " + formatAngkaJS(batasBawah) + "<br>" +
               "Batas atas = " + formatAngkaJS(batasAtas);
    if (outliers.length > 0) {
      html += "<br>Outlier: " + outliers.map(formatAngkaJS).join(", ");
    } else {
      html += "<br>Tidak ada outlier.";
    }
    out.innerHTML = html;
    return true;
  }

  // --- DISTRIBUSI ---
  if (lower.startsWith("distribusi normal")) {
    var rest = q.replace(/^distribusi normal\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 3) { out.innerHTML = "Format: distribusi normal <x>; <mu>; <sigma>"; return true; }
    var x = parseFloat(parts[0]), mu = parseFloat(parts[1]), sigma = parseFloat(parts[2]);
    if (isNaN(x) || isNaN(mu) || isNaN(sigma) || sigma <= 0) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    var cdf = 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
    out.innerHTML = "PDF = " + formatAngkaJS(pdf) + "<br>CDF = " + formatAngkaJS(cdf);
    return true;
  }

  if (lower.startsWith("distribusi binomial")) {
    var rest = q.replace(/^distribusi binomial\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 3) { out.innerHTML = "Format: distribusi binomial <n>; <k>; <p>"; return true; }
    var n = parseInt(parts[0]), k = parseInt(parts[1]), p = parseFloat(parts[2]);
    if (isNaN(n) || isNaN(k) || isNaN(p) || p < 0 || p > 1 || k < 0 || k > n) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var cnk = Number(binomialBigInt(n, k));
    var pdf = cnk * Math.pow(p, k) * Math.pow(1 - p, n - k);
    var cdf = 0;
    for (var i = 0; i <= k; i++) {
      cdf += Number(binomialBigInt(n, i)) * Math.pow(p, i) * Math.pow(1 - p, n - i);
    }
    out.innerHTML = "PDF = " + formatAngkaJS(pdf) + "<br>CDF (≤ k) = " + formatAngkaJS(cdf);
    return true;
  }

  if (lower.startsWith("distribusi geometri")) {
    var rest = q.replace(/^distribusi geometri\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 2) { out.innerHTML = "Format: distribusi geometri <k>; <p>"; return true; }
    var k = parseInt(parts[0]), p = parseFloat(parts[1]);
    if (isNaN(k) || isNaN(p) || p <= 0 || p > 1 || k < 1) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var pdf = Math.pow(1 - p, k - 1) * p;
    var cdf = 1 - Math.pow(1 - p, k);
    out.innerHTML = "PDF = " + formatAngkaJS(pdf) + "<br>CDF (≤ k) = " + formatAngkaJS(cdf);
    return true;
  }

  if (lower.startsWith("distribusi eksponensial")) {
    var rest = q.replace(/^distribusi eksponensial\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 2) { out.innerHTML = "Format: distribusi eksponensial <x>; <lambda>"; return true; }
    var x = parseFloat(parts[0]), lambda = parseFloat(parts[1]);
    if (isNaN(x) || isNaN(lambda) || lambda <= 0 || x < 0) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var pdf = lambda * Math.exp(-lambda * x);
    var cdf = 1 - Math.exp(-lambda * x);
    out.innerHTML = "PDF = " + formatAngkaJS(pdf) + "<br>CDF = " + formatAngkaJS(cdf);
    return true;
  }

  if (lower.startsWith("distribusi hipergeometrik")) {
    var rest = q.replace(/^distribusi hipergeometrik\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 4) { out.innerHTML = "Format: distribusi hipergeometrik <N>; <K>; <n>; <k>"; return true; }
    var N = parseInt(parts[0]), K = parseInt(parts[1]), n = parseInt(parts[2]), k = parseInt(parts[3]);
    if (isNaN(N) || isNaN(K) || isNaN(n) || isNaN(k) || k > K || n - k > N - K) {
      out.innerHTML = "❌ Argumen tidak valid."; return true;
    }
    var pembilang = Number(binomialBigInt(K, k)) * Number(binomialBigInt(N - K, n - k));
    var penyebut = Number(binomialBigInt(N, n));
    var pdf = pembilang / penyebut;
    out.innerHTML = "PDF = " + formatAngkaJS(pdf);
    return true;
  }

  if (lower.startsWith("z-score")) {
    var rest = q.replace(/^z-score\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 3) { out.innerHTML = "Format: z-score <x>; <mu>; <sigma>"; return true; }
    var x = parseFloat(parts[0]), mu = parseFloat(parts[1]), sigma = parseFloat(parts[2]);
    if (isNaN(x) || isNaN(mu) || isNaN(sigma) || sigma <= 0) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var z = (x - mu) / sigma;
    out.innerHTML = "Z-Score = " + formatAngkaJS(z);
    return true;
  }

  if (lower.startsWith("p-value")) {
    var rest = q.replace(/^p-value\s*/i, "").trim();
    var z = parseFloat(rest);
    if (isNaN(z)) { out.innerHTML = "Format: p-value <z>"; return true; }
    var p = 2 * (1 - 0.5 * (1 + erf(Math.abs(z) / Math.sqrt(2))));
    out.innerHTML = "P-value (dua sisi) = " + formatAngkaJS(p);
    return true;
  }

  if (lower.startsWith("interval kepercayaan")) {
    var rest = q.replace(/^interval kepercayaan\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 4) { out.innerHTML = "Format: interval kepercayaan <mean>; <std>; <n>; <tingkat>"; return true; }
    var mean = parseFloat(parts[0]), sd = parseFloat(parts[1]), n = parseInt(parts[2]), tingkat = parseFloat(parts[3]);
    if (isNaN(mean) || isNaN(sd) || isNaN(n) || isNaN(tingkat) || n < 1) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var zTabel = {0.80: 1.282, 0.90: 1.645, 0.95: 1.960, 0.98: 2.326, 0.99: 2.576};
    var z = zTabel[tingkat] || 1.96;
    var margin = z * sd / Math.sqrt(n);
    var bawah = mean - margin;
    var atas = mean + margin;
    out.innerHTML = "Interval kepercayaan " + (tingkat * 100) + "%:<br>" +
                    "[" + formatAngkaJS(bawah) + ", " + formatAngkaJS(atas) + "]<br>" +
                    "Margin kesalahan = " + formatAngkaJS(margin);
    return true;
  }

  if (lower.startsWith("ukuran sampel")) {
    var rest = q.replace(/^ukuran sampel\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 3) { out.innerHTML = "Format: ukuran sampel <margin>; <std>; <tingkat>"; return true; }
    var margin = parseFloat(parts[0]), sd = parseFloat(parts[1]), tingkat = parseFloat(parts[2]);
    if (isNaN(margin) || isNaN(sd) || isNaN(tingkat) || margin <= 0) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var zTabel = {0.80: 1.282, 0.90: 1.645, 0.95: 1.960, 0.98: 2.326, 0.99: 2.576};
    var z = zTabel[tingkat] || 1.96;
    var n = Math.ceil(Math.pow(z * sd / margin, 2));
    out.innerHTML = "Ukuran sampel minimum = " + n;
    return true;
  }

  if (lower.startsWith("margin kesalahan")) {
    var rest = q.replace(/^margin kesalahan\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 3) { out.innerHTML = "Format: margin kesalahan <std>; <n>; <tingkat>"; return true; }
    var sd = parseFloat(parts[0]), n = parseInt(parts[1]), tingkat = parseFloat(parts[2]);
    if (isNaN(sd) || isNaN(n) || isNaN(tingkat) || n < 1) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var zTabel = {0.80: 1.282, 0.90: 1.645, 0.95: 1.960, 0.98: 2.326, 0.99: 2.576};
    var z = zTabel[tingkat] || 1.96;
    var margin = z * sd / Math.sqrt(n);
    out.innerHTML = "Margin kesalahan = " + formatAngkaJS(margin);
    return true;
  }

  if (lower.startsWith("regresi linier")) {
    var rest = q.replace(/^regresi linier\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 2) { out.innerHTML = "Format: regresi linier <x> ; <y>"; return true; }
    var xData = parseData(parts[0]);
    var yData = parseData(parts[1]);
    if (!xData || !yData || xData.length !== yData.length || xData.length < 2) {
      out.innerHTML = "❌ Kedua data harus sama panjang dan minimal 2.";
      return true;
    }
    var n = xData.length;
    var sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
    for (var i = 0; i < n; i++) {
      sumX += xData[i];
      sumY += yData[i];
      sumXY += xData[i] * yData[i];
      sumX2 += xData[i] * xData[i];
      sumY2 += yData[i] * yData[i];
    }
    var slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    var intercept = (sumY - slope * sumX) / n;
    var r = (n * sumXY - sumX * sumY) / Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    var r2 = r * r;
    out.innerHTML = "y = " + formatAngkaJS(slope) + "x + " + formatAngkaJS(intercept) + "<br>" +
                    "r = " + formatAngkaJS(r) + "<br>" +
                    "R² = " + formatAngkaJS(r2);
    return true;
  }

  if (lower.startsWith("peluang")) {
    var rest = q.replace(/^peluang\s*/i, "").trim();
    var parts = rest.split(";").map(function(s){return s.trim();});
    if (parts.length < 2) { out.innerHTML = "Format: peluang <n>; <k>"; return true; }
    var n = parseInt(parts[0]), k = parseInt(parts[1]);
    if (isNaN(n) || isNaN(k) || k < 0 || k > n) { out.innerHTML = "❌ Argumen tidak valid."; return true; }
    var cnk = Number(binomialBigInt(n, k));
    var total = Math.pow(2, n);
    var peluang = cnk / total;
    out.innerHTML = "C(" + n + ", " + k + ") = " + cnk + "<br>" +
                    "Total kemungkinan = 2^" + n + " = " + total + "<br>" +
                    "Peluang = " + formatAngkaJS(peluang);
    return true;
  }

  return false;
}
