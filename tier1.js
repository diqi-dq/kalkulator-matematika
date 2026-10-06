/* ========================================================
   TIER 1: VANILLA JS HANDLER
   Perintah yang dieksekusi instan tanpa Pyodide.
   Versi: BERSIH — tanpa duplikasi
   ======================================================== */

function jalankanTier1(q, out) {
  var lower = q.toLowerCase();

  // ========================================================
  // 1. HITUNG
  // ========================================================
  if (lower.startsWith("hitung")) {
    var expr = q.replace(/^hitung\s*/i, "").trim();
    expr = expr.replace(/\bpi\b/gi, String(Math.PI));
    expr = expr.replace(/\be\b/g, String(Math.E));
    expr = expr.replace(/(\d+(?:\.\d+)?)%\s*dari\s*(\d+(?:\.\d+)?)/gi, '($1/100)*$2');
    expr = expr.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)');
    expr = expr.replace(/\bsqrt\s*\(/gi, 'Math.sqrt(');
    expr = expr.replace(/\blogs?\s*\(/gi, 'Math.log(');
    expr = expr.replace(/\blog10\s*\(/gi, 'Math.log10(');
    expr = expr.replace(/\bexp\s*\(/gi, 'Math.exp(');
    expr = expr.replace(/\bsin\s*\(/gi, 'Math.sin(');
    expr = expr.replace(/\bcos\s*\(/gi, 'Math.cos(');
    expr = expr.replace(/\btan\s*\(/gi, 'Math.tan(');
    expr = expr.replace(/\basin\s*\(/gi, 'Math.asin(');
    expr = expr.replace(/\bacos\s*\(/gi, 'Math.acos(');
    expr = expr.replace(/\batan\s*\(/gi, 'Math.atan(');
    expr = expr.replace(/\bsinh\s*\(/gi, 'Math.sinh(');
    expr = expr.replace(/\bcosh\s*\(/gi, 'Math.cosh(');
    expr = expr.replace(/\btanh\s*\(/gi, 'Math.tanh(');
    expr = expr.replace(/\babs\s*\(/gi, 'Math.abs(');
    expr = expr.replace(/\^/g, '**');
    
    expr = expr.replace(/(\d+)!/g, function(m, n) {
      return "(" + Number(faktorialBigInt(parseInt(n))) + ")";
    });
    expr = expr.replace(/\bC\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, function(m, n, k) {
      return "(" + Number(binomialBigInt(parseInt(n), parseInt(k))) + ")";
    });
    expr = expr.replace(/\bP\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)/g, function(m, n, k) {
      return "(" + Number(permutasiBigInt(parseInt(n), parseInt(k))) + ")";
    });

    if (!/^[\d\s\+\-\*\/\(\)\.\,\*A-Za-z_]+$/.test(expr)) {
      out.innerHTML = "❌ Ekspresi tidak valid.";
      return true;
    }
    var aman = expr.replace(/Math\.[a-zA-Z0-9_]+/g, 'M');
    if (!/^[\d\s\+\-\*\/\(\)\.\,\*Mn]+$/.test(aman)) {
      out.innerHTML = "❌ Ekspresi tidak valid.";
      return true;
    }

    try {
      var hasil = Function('"use strict"; return (' + expr + ')')();
      if (typeof hasil === 'number' && isFinite(hasil)) {
        out.innerHTML = formatAngkaJS(hasil);
      } else {
        out.innerHTML = "❌ Hasil tidak valid.";
      }
    } catch(e) {
      out.innerHTML = "❌ " + e.message;
    }
    return true;
  }

  // ========================================================
  // 2. DESIMAL
  // ========================================================
  if (lower.startsWith("desimal")) {
    var e = q.replace(/^desimal\s*/i, "").trim();
    e = e.replace(/\bpi\b/gi, String(Math.PI));
    e = e.replace(/\be\b/g, String(Math.E));
    e = e.replace(/\bsqrt\s*\(/gi, 'Math.sqrt(');
    e = e.replace(/\bsin\s*\(/gi, 'Math.sin(');
    e = e.replace(/\bcos\s*\(/gi, 'Math.cos(');
    e = e.replace(/\btan\s*\(/gi, 'Math.tan(');
    e = e.replace(/\blog\s*\(/gi, 'Math.log(');
    e = e.replace(/\^/g, '**');
    e = e.replace(/(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/g, '($1/$2)');

    if (!/^[\d\s\+\-\*\/\(\)\.\,\*A-Za-z_]+$/.test(e)) {
      out.innerHTML = "❌ Ekspresi tidak valid.";
      return true;
    }
    var aman = e.replace(/Math\.[a-zA-Z0-9_]+/g, 'M');
    if (!/^[\d\s\+\-\*\/\(\)\.\,\*Mn]+$/.test(aman)) {
      out.innerHTML = "❌ Ekspresi tidak valid.";
      return true;
    }

    try {
      var hasil = Function('"use strict"; return (' + e + ')')();
      if (typeof hasil === 'number' && isFinite(hasil)) {
        out.innerHTML = formatAngkaJS(hasil);
      } else {
        out.innerHTML = "❌ Hasil tidak valid.";
      }
    } catch(err) {
      out.innerHTML = "❌ " + err.message;
    }
    return true;
  }

  // ========================================================
  // 3. BINER
  // ========================================================
  if (lower.startsWith("biner")) {
    var num = q.replace(/^biner\s*/i, "").trim();
    if (!/^\d+$/.test(num)) {
      out.innerHTML = "Format: biner <bilangan bulat positif>. Contoh: biner 10";
      return true;
    }
    var n = parseInt(num, 10);
    out.innerHTML = num + " dalam biner = " + n.toString(2);
    return true;
  }

  // ========================================================
  // 4. FAKTORIAL
  // ========================================================
  if (lower.startsWith("faktorial")) {
    var num = q.replace(/^faktorial\s*/i, "").trim();
    if (!/^\d+$/.test(num)) {
      out.innerHTML = "Format: faktorial n. Contoh: faktorial 5";
      return true;
    }
    var n = parseInt(num, 10);
    if (n < 0 || n > 1000) {
      out.innerHTML = "❌ n harus 0 sampai 1000.";
      return true;
    }
    var hasil = faktorialBigInt(n);
    out.innerHTML = n + "! = " + hasil.toString();
    return true;
  }

  // ========================================================
  // 5. BILANGAN PRIMA
  // ========================================================
  if (lower.startsWith("bilangan prima")) {
    var num = q.replace(/^bilangan prima\s*/i, "").trim();
    if (!/^\d+$/.test(num)) {
      out.innerHTML = "Format: bilangan prima n. Contoh: bilangan prima 20";
      return true;
    }
    var n = parseInt(num, 10);
    if (n > 100000) {
      out.innerHTML = "❌ n maksimal 100.000.";
      return true;
    }
    var prima = sievePrima(n);
    out.innerHTML = "Prima ≤ " + n + ":<br>" + prima.join(", ");
    return true;
  }

  // ========================================================
  // 6. PYTHAGORAS
  // ========================================================
  if (lower.startsWith("pythagoras")) {
    var num = q.replace(/^pythagoras\s*/i, "").trim() || "10";
    if (!/^\d+$/.test(num)) {
      out.innerHTML = "Format: pythagoras N. Contoh: pythagoras 10";
      return true;
    }
    var N = parseInt(num, 10);
    if (N > 1000) {
      out.innerHTML = "❌ N maksimal 1000.";
      return true;
    }
    var hasil = pythagorasPrimitif(N);
    var html = "Tripel Pythagoras primitif (" + N + " buah):<br>";
    html += hasil.map(function(t) {
      return "(" + t[0] + ", " + t[1] + ", " + t[2] + ")";
    }).join("<br>");
    out.innerHTML = html;
    return true;
  }

  // ========================================================
  // 7. FPB DETAIL (HARUS SEBELUM "fpb" BIASA)
  // ========================================================
  if (lower.startsWith("fpb detail")) {
    var rest = q.replace(/^fpb detail\s*/i, "").trim();
    var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
    
    if (parts.length < 2) {
      out.innerHTML = "Format: fpb detail &lt;a&gt;; &lt;b&gt; [; &lt;c&gt; ...]<br>Contoh: fpb detail 12; 18";
      return true;
    }
    
    var bilangan = [];
    for (var i = 0; i < parts.length; i++) {
      var n = parseInt(parts[i]);
      if (isNaN(n)) {
        out.innerHTML = "❌ Argumen ke-" + (i+1) + " tidak valid: " + parts[i];
        return true;
      }
      bilangan.push(Math.abs(n));
    }
    
    function faktorisasi(n) {
      var faktor = {};
      for (var i = 2; i * i <= n; i++) {
        while (n % i === 0) {
          faktor[i] = (faktor[i] || 0) + 1;
          n = n / i;
        }
      }
      if (n > 1) faktor[n] = (faktor[n] || 0) + 1;
      return faktor;
    }
    
    var faktorisasiList = bilangan.map(faktorisasi);
    
    var primaSemua = Object.keys(faktorisasiList[0]).map(Number);
    for (var i = 1; i < faktorisasiList.length; i++) {
      primaSemua = primaSemua.filter(function(p) {
        return faktorisasiList[i][p] !== undefined;
      });
    }
    
    var fpb = 1;
    var langkahFPB = [];
    primaSemua.forEach(function(p) {
      var minPangkat = Math.min.apply(null, faktorisasiList.map(function(f){ return f[p] || 0; }));
      fpb *= Math.pow(p, minPangkat);
      langkahFPB.push(p + "^" + minPangkat);
    });
    
    var html = "<b>FPB(" + bilangan.join(", ") + ")</b><br>";
    html += "Faktorisasi prima:<br>";
    bilangan.forEach(function(b, i) {
      var f = faktorisasiList[i];
      var str = Object.keys(f).map(function(p) {
        return f[p] > 1 ? p + "^" + f[p] : p;
      }).join(" × ");
      html += "&nbsp;&nbsp;" + b + " = " + str + "<br>";
    });
    html += "<br>FPB = " + (langkahFPB.length > 0 ? langkahFPB.join(" × ") : "1") + " = " + fpb;
    
    out.innerHTML = html;
    return true;
  }

  // ========================================================
  // 8. KPK DETAIL (HARUS SEBELUM "kpk" BIASA)
  // ========================================================
  if (lower.startsWith("kpk detail")) {
    var rest = q.replace(/^kpk detail\s*/i, "").trim();
    var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
    
    if (parts.length < 2) {
      out.innerHTML = "Format: kpk detail &lt;a&gt;; &lt;b&gt; [; &lt;c&gt; ...]<br>Contoh: kpk detail 4; 6";
      return true;
    }
    
    var bilangan = [];
    for (var i = 0; i < parts.length; i++) {
      var n = parseInt(parts[i]);
      if (isNaN(n)) {
        out.innerHTML = "❌ Argumen ke-" + (i+1) + " tidak valid: " + parts[i];
        return true;
      }
      if (n === 0) {
        out.innerHTML = "❌ KPK tidak terdefinisi untuk 0.";
        return true;
      }
      bilangan.push(Math.abs(n));
    }
    
    function faktorisasi(n) {
      var faktor = {};
      for (var i = 2; i * i <= n; i++) {
        while (n % i === 0) {
          faktor[i] = (faktor[i] || 0) + 1;
          n = n / i;
        }
      }
      if (n > 1) faktor[n] = (faktor[n] || 0) + 1;
      return faktor;
    }
    
    var faktorisasiList = bilangan.map(faktorisasi);
    
    var primaSemua = {};
    faktorisasiList.forEach(function(f) {
      Object.keys(f).forEach(function(p) {
        if (!primaSemua[p] || f[p] > primaSemua[p]) {
          primaSemua[p] = f[p];
        }
      });
    });
    
    var kpk = 1;
    var langkahKPK = [];
    Object.keys(primaSemua).sort(function(a,b){return a-b;}).forEach(function(p) {
      kpk *= Math.pow(p, primaSemua[p]);
      langkahKPK.push(p + "^" + primaSemua[p]);
    });
    
    var html = "<b>KPK(" + bilangan.join(", ") + ")</b><br>";
    html += "Faktorisasi prima:<br>";
    bilangan.forEach(function(b, i) {
      var f = faktorisasiList[i];
      var str = Object.keys(f).map(function(p) {
        return f[p] > 1 ? p + "^" + f[p] : p;
      }).join(" × ");
      html += "&nbsp;&nbsp;" + b + " = " + str + "<br>";
    });
    html += "<br>KPK = " + langkahKPK.join(" × ") + " = " + kpk;
    
    out.innerHTML = html;
    return true;
  }

  // ========================================================
  // 9. FPB BIASA (SETELAH "fpb detail")
  // ========================================================
  if (lower.startsWith("fpb")) {
    var rest = q.replace(/^fpb\s*/i, "").trim();
    var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
    
    if (parts.length < 2) {
      out.innerHTML = "Format: fpb &lt;a&gt;; &lt;b&gt; [; &lt;c&gt; ...]<br>Contoh: fpb 12; 18; 24";
      return true;
    }
    
    var bilangan = [];
    for (var i = 0; i < parts.length; i++) {
      var n = parseInt(parts[i]);
      if (isNaN(n)) {
        out.innerHTML = "❌ Argumen ke-" + (i+1) + " tidak valid: " + parts[i];
        return true;
      }
      bilangan.push(Math.abs(n));
    }
    
    var hasil = bilangan[0];
    for (var i = 1; i < bilangan.length; i++) {
      hasil = gcd(hasil, bilangan[i]);
      if (hasil === 1) break;
    }
    
    out.innerHTML = "FPB(" + bilangan.join(", ") + ") = " + hasil;
    return true;
  }

  // ========================================================
  // 10. KPK BIASA (SETELAH "kpk detail")
  // ========================================================
  if (lower.startsWith("kpk")) {
    var rest = q.replace(/^kpk\s*/i, "").trim();
    var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
    
    if (parts.length < 2) {
      out.innerHTML = "Format: kpk &lt;a&gt;; &lt;b&gt; [; &lt;c&gt; ...]<br>Contoh: kpk 4; 6; 8";
      return true;
    }
    
    var bilangan = [];
    for (var i = 0; i < parts.length; i++) {
      var n = parseInt(parts[i]);
      if (isNaN(n)) {
        out.innerHTML = "❌ Argumen ke-" + (i+1) + " tidak valid: " + parts[i];
        return true;
      }
      if (n === 0) {
        out.innerHTML = "❌ KPK tidak terdefinisi untuk 0.";
        return true;
      }
      bilangan.push(Math.abs(n));
    }
    
    var hasil = bilangan[0];
    for (var i = 1; i < bilangan.length; i++) {
      hasil = (hasil * bilangan[i]) / gcd(hasil, bilangan[i]);
    }
    
    out.innerHTML = "KPK(" + bilangan.join(", ") + ") = " + hasil;
    return true;
  }

  // ========================================================
  // 11. CEK PRIMA
  // ========================================================
  if (lower.startsWith("prima?")) {
    var num = parseInt(q.replace(/^prima\?\s*/i, "").trim());
    if (isNaN(num) || num < 0) { out.innerHTML = "Format: prima? <n>"; return true; }
    if (num < 2) { out.innerHTML = num + " bukan bilangan prima"; return true; }
    var isPrima = true;
    for (var i = 2; i * i <= num; i++) {
      if (num % i === 0) { isPrima = false; break; }
    }
    out.innerHTML = num + (isPrima ? " adalah bilangan prima" : " bukan bilangan prima");
    return true;
  }

  // ========================================================
  // 12. FAKTORISASI PRIMA
  // ========================================================
  if (lower.startsWith("faktorisasi")) {
    var num = parseInt(q.replace(/^faktorisasi\s*/i, "").trim());
    if (isNaN(num) || num < 2) { out.innerHTML = "Format: faktorisasi <n> (n ≥ 2)"; return true; }
    
    var n = num;
    var faktor = {};
    for (var i = 2; i * i <= n; i++) {
      while (n % i === 0) {
        faktor[i] = (faktor[i] || 0) + 1;
        n = n / i;
      }
    }
    if (n > 1) faktor[n] = (faktor[n] || 0) + 1;
    
    var hasilStr = Object.keys(faktor).map(function(p) {
      var exp = faktor[p];
      return exp > 1 ? p + "^" + exp : p;
    }).join(" × ");
    
    out.innerHTML = num + " = " + hasilStr;
    return true;
  }

  // ========================================================
  // 13. KONVERSI BASIS
  // ========================================================
  if (lower.startsWith("ke biner")) {
    var num = parseInt(q.replace(/^ke biner\s*/i, "").trim());
    if (isNaN(num) || num < 0) { out.innerHTML = "Format: ke biner <n>"; return true; }
    out.innerHTML = num + "₁₀ = " + num.toString(2) + "₂";
    return true;
  }

  if (lower.startsWith("ke oktal")) {
    var num = parseInt(q.replace(/^ke oktal\s*/i, "").trim());
    if (isNaN(num) || num < 0) { out.innerHTML = "Format: ke oktal <n>"; return true; }
    out.innerHTML = num + "₁₀ = " + num.toString(8) + "₈";
    return true;
  }

  if (lower.startsWith("ke heksadesimal")) {
    var num = parseInt(q.replace(/^ke heksadesimal\s*/i, "").trim());
    if (isNaN(num) || num < 0) { out.innerHTML = "Format: ke heksadesimal <n>"; return true; }
    out.innerHTML = num + "₁₀ = " + num.toString(16).toUpperCase() + "₁₆";
    return true;
  }

  // ========================================================
  // 14. SISTEM KONVERSI UNIVERSAL
  // ========================================================
  
  // Tabel faktor konversi ke satuan dasar
  var tabelKonversi = {
    // --- PANJANG (dasar: meter) ---
    "km": { kategori: "panjang", faktor: 1000, nama: "km" },
    "kilometer": { kategori: "panjang", faktor: 1000, nama: "km" },
    "hm": { kategori: "panjang", faktor: 100, nama: "hm" },
    "hektometer": { kategori: "panjang", faktor: 100, nama: "hm" },
    "dam": { kategori: "panjang", faktor: 10, nama: "dam" },
    "dekameter": { kategori: "panjang", faktor: 10, nama: "dam" },
    "m": { kategori: "panjang", faktor: 1, nama: "m" },
    "meter": { kategori: "panjang", faktor: 1, nama: "m" },
    "dm": { kategori: "panjang", faktor: 0.1, nama: "dm" },
    "desimeter": { kategori: "panjang", faktor: 0.1, nama: "dm" },
    "cm": { kategori: "panjang", faktor: 0.01, nama: "cm" },
    "sentimeter": { kategori: "panjang", faktor: 0.01, nama: "cm" },
    "mm": { kategori: "panjang", faktor: 0.001, nama: "mm" },
    "milimeter": { kategori: "panjang", faktor: 0.001, nama: "mm" },
    "inci": { kategori: "panjang", faktor: 0.0254, nama: "inci" },
    "in": { kategori: "panjang", faktor: 0.0254, nama: "inci" },
    "kaki": { kategori: "panjang", faktor: 0.3048, nama: "kaki" },
    "ft": { kategori: "panjang", faktor: 0.3048, nama: "kaki" },
    "yard": { kategori: "panjang", faktor: 0.9144, nama: "yard" },
    "yd": { kategori: "panjang", faktor: 0.9144, nama: "yard" },
    "mil": { kategori: "panjang", faktor: 1609.34, nama: "mil" },
    "mile": { kategori: "panjang", faktor: 1609.34, nama: "mil" },
    "mil laut": { kategori: "panjang", faktor: 1852, nama: "mil laut" },
    "nmi": { kategori: "panjang", faktor: 1852, nama: "mil laut" },
    
    // --- BERAT (dasar: gram) ---
    "kg": { kategori: "berat", faktor: 1000, nama: "kg" },
    "kilogram": { kategori: "berat", faktor: 1000, nama: "kg" },
    "hg": { kategori: "berat", faktor: 100, nama: "hg" },
    "ons": { kategori: "berat", faktor: 100, nama: "ons" },
    "dag": { kategori: "berat", faktor: 10, nama: "dag" },
    "g": { kategori: "berat", faktor: 1, nama: "g" },
    "gram": { kategori: "berat", faktor: 1, nama: "g" },
    "dg": { kategori: "berat", faktor: 0.1, nama: "dg" },
    "cg": { kategori: "berat", faktor: 0.01, nama: "cg" },
    "mg": { kategori: "berat", faktor: 0.001, nama: "mg" },
    "miligram": { kategori: "berat", faktor: 0.001, nama: "mg" },
    "ton": { kategori: "berat", faktor: 1000000, nama: "ton" },
    "kuintal": { kategori: "berat", faktor: 100000, nama: "kuintal" },
    "kw": { kategori: "berat", faktor: 100000, nama: "kuintal" },
    "pon": { kategori: "berat", faktor: 453.592, nama: "pon" },
    "lb": { kategori: "berat", faktor: 453.592, nama: "pon" },
    "pound": { kategori: "berat", faktor: 453.592, nama: "pon" },
    
    // --- WAKTU (dasar: detik) ---
    "detik": { kategori: "waktu", faktor: 1, nama: "detik" },
    "s": { kategori: "waktu", faktor: 1, nama: "detik" },
    "menit": { kategori: "waktu", faktor: 60, nama: "menit" },
    "min": { kategori: "waktu", faktor: 60, nama: "menit" },
    "jam": { kategori: "waktu", faktor: 3600, nama: "jam" },
    "h": { kategori: "waktu", faktor: 3600, nama: "jam" },
    "hari": { kategori: "waktu", faktor: 86400, nama: "hari" },
    "minggu": { kategori: "waktu", faktor: 604800, nama: "minggu" },
    "bulan": { kategori: "waktu", faktor: 2592000, nama: "bulan" },
    "tahun": { kategori: "waktu", faktor: 31536000, nama: "tahun" },
    "abad": { kategori: "waktu", faktor: 3153600000, nama: "abad" },
    "windu": { kategori: "waktu", faktor: 252288000, nama: "windu" },
    "lustrum": { kategori: "waktu", faktor: 157680000, nama: "lustrum" },
    
    // --- VOLUME (dasar: liter) ---
    "kl": { kategori: "volume", faktor: 1000, nama: "kl" },
    "liter": { kategori: "volume", faktor: 1, nama: "liter" },
    "l": { kategori: "volume", faktor: 1, nama: "liter" },
    "dl": { kategori: "volume", faktor: 0.1, nama: "dl" },
    "cl": { kategori: "volume", faktor: 0.01, nama: "cl" },
    "ml": { kategori: "volume", faktor: 0.001, nama: "ml" },
    "mililiter": { kategori: "volume", faktor: 0.001, nama: "ml" },
    "m3": { kategori: "volume", faktor: 1000, nama: "m³" },
    "cm3": { kategori: "volume", faktor: 0.001, nama: "cm³" },
    "galon": { kategori: "volume", faktor: 3.78541, nama: "galon" },
    "cangkir": { kategori: "volume", faktor: 0.24, nama: "cangkir" },
    "sdm": { kategori: "volume", faktor: 0.015, nama: "sdm" },
    "sdt": { kategori: "volume", faktor: 0.005, nama: "sdt" },
    
    // --- LUAS (dasar: m²) ---
    "km2": { kategori: "luas", faktor: 1000000, nama: "km²" },
    "hm2": { kategori: "luas", faktor: 10000, nama: "hm²" },
    "hektar": { kategori: "luas", faktor: 10000, nama: "hektar" },
    "ha": { kategori: "luas", faktor: 10000, nama: "hektar" },
    "are": { kategori: "luas", faktor: 100, nama: "are" },
    "m2": { kategori: "luas", faktor: 1, nama: "m²" },
    "dm2": { kategori: "luas", faktor: 0.01, nama: "dm²" },
    "cm2": { kategori: "luas", faktor: 0.0001, nama: "cm²" },
    "mm2": { kategori: "luas", faktor: 0.000001, nama: "mm²" },
    "acre": { kategori: "luas", faktor: 4046.86, nama: "acre" },
    "kaki2": { kategori: "luas", faktor: 0.092903, nama: "kaki²" },
    "inci2": { kategori: "luas", faktor: 0.00064516, nama: "inci²" },
    
    // --- KECEPATAN (dasar: m/detik) ---
    "m/detik": { kategori: "kecepatan", faktor: 1, nama: "m/detik" },
    "m/s": { kategori: "kecepatan", faktor: 1, nama: "m/detik" },
    "km/jam": { kategori: "kecepatan", faktor: 0.277778, nama: "km/jam" },
    "km/h": { kategori: "kecepatan", faktor: 0.277778, nama: "km/jam" },
    "mil/jam": { kategori: "kecepatan", faktor: 0.44704, nama: "mil/jam" },
    "mph": { kategori: "kecepatan", faktor: 0.44704, nama: "mil/jam" },
    "knot": { kategori: "kecepatan", faktor: 0.514444, nama: "knot" },
    "mach": { kategori: "kecepatan", faktor: 343, nama: "mach" },
    
    // --- DATA DIGITAL (dasar: byte) ---
    "bit": { kategori: "data", faktor: 0.125, nama: "bit" },
    "byte": { kategori: "data", faktor: 1, nama: "byte" },
    "b": { kategori: "data", faktor: 1, nama: "byte" },
    "kb": { kategori: "data", faktor: 1024, nama: "KB" },
    "kilobyte": { kategori: "data", faktor: 1024, nama: "KB" },
    "mb": { kategori: "data", faktor: 1048576, nama: "MB" },
    "megabyte": { kategori: "data", faktor: 1048576, nama: "MB" },
    "gb": { kategori: "data", faktor: 1073741824, nama: "GB" },
    "gigabyte": { kategori: "data", faktor: 1073741824, nama: "GB" },
    "tb": { kategori: "data", faktor: 1099511627776, nama: "TB" },
    "terabyte": { kategori: "data", faktor: 1099511627776, nama: "TB" },
    
    // --- ENERGI (dasar: joule) ---
    "joule": { kategori: "energi", faktor: 1, nama: "J" },
    "j": { kategori: "energi", faktor: 1, nama: "J" },
    "kalori": { kategori: "energi", faktor: 4.184, nama: "kal" },
    "kal": { kategori: "energi", faktor: 4.184, nama: "kal" },
    "kkal": { kategori: "energi", faktor: 4184, nama: "kkal" },
    "kwh": { kategori: "energi", faktor: 3600000, nama: "kWh" },
    
    // --- TEKANAN (dasar: pascal) ---
    "pascal": { kategori: "tekanan", faktor: 1, nama: "Pa" },
    "pa": { kategori: "tekanan", faktor: 1, nama: "Pa" },
    "kpa": { kategori: "tekanan", faktor: 1000, nama: "kPa" },
    "atm": { kategori: "tekanan", faktor: 101325, nama: "atm" },
    "bar": { kategori: "tekanan", faktor: 100000, nama: "bar" },
    "psi": { kategori: "tekanan", faktor: 6894.76, nama: "psi" },
    "mmhg": { kategori: "tekanan", faktor: 133.322, nama: "mmHg" }
  };

  // --- KONVERSI SUHU (khusus) ---
  var matchSuhu = q.match(/^([a-z]+)\s+ke\s+([a-z]+)\s+([\d.,\-]+)$/i);
  if (matchSuhu) {
    var dari = matchSuhu[1].trim().toLowerCase();
    var ke = matchSuhu[2].trim().toLowerCase();
    var nilai = parseFloat(matchSuhu[3].trim().replace(",", "."));
    
    if (!isNaN(nilai)) {
      var satuanSuhu = ["celsius", "fahrenheit", "kelvin", "reamur", "rankine"];
      
      if (satuanSuhu.indexOf(dari) !== -1 && satuanSuhu.indexOf(ke) !== -1) {
        var celsius;
        if (dari === "celsius") celsius = nilai;
        else if (dari === "fahrenheit") celsius = (nilai - 32) * 5 / 9;
        else if (dari === "kelvin") celsius = nilai - 273.15;
        else if (dari === "reamur") celsius = nilai * 5 / 4;
        else if (dari === "rankine") celsius = (nilai - 491.67) * 5 / 9;
        
        var hasil;
        var simbol;
        if (ke === "celsius") { hasil = celsius; simbol = "°C"; }
        else if (ke === "fahrenheit") { hasil = celsius * 9 / 5 + 32; simbol = "°F"; }
        else if (ke === "kelvin") { hasil = celsius + 273.15; simbol = " K"; }
        else if (ke === "reamur") { hasil = celsius * 4 / 5; simbol = "°R"; }
        else if (ke === "rankine") { hasil = (celsius + 273.15) * 9 / 5; simbol = "°Ra"; }
        
        var simbolAsal;
        if (dari === "celsius") simbolAsal = "°C";
        else if (dari === "fahrenheit") simbolAsal = "°F";
        else if (dari === "kelvin") simbolAsal = " K";
        else if (dari === "reamur") simbolAsal = "°R";
        else if (dari === "rankine") simbolAsal = "°Ra";
        
        out.innerHTML = nilai + simbolAsal + " = " + formatAngkaJS(hasil) + simbol;
        return true;
      }
    }
  }

  // --- KONVERSI SUDUT (khusus) ---
  if (lower.startsWith("derajat ke radian")) {
    var derajat = parseFloat(q.replace(/^derajat ke radian\s*/i, "").trim().replace(",", "."));
    if (isNaN(derajat)) { out.innerHTML = "Format: derajat ke radian <derajat>"; return true; }
    out.innerHTML = derajat + "° = " + formatAngkaJS(derajat * Math.PI / 180) + " rad";
    return true;
  }

  if (lower.startsWith("radian ke derajat")) {
    var radian = parseFloat(q.replace(/^radian ke derajat\s*/i, "").trim().replace(",", "."));
    if (isNaN(radian)) { out.innerHTML = "Format: radian ke derajat <radian>"; return true; }
    out.innerHTML = radian + " rad = " + formatAngkaJS(radian * 180 / Math.PI) + "°";
    return true;
  }

  if (lower.startsWith("derajat ke gradian")) {
    var derajat = parseFloat(q.replace(/^derajat ke gradian\s*/i, "").trim().replace(",", "."));
    if (isNaN(derajat)) { out.innerHTML = "Format: derajat ke gradian <derajat>"; return true; }
    out.innerHTML = derajat + "° = " + formatAngkaJS(derajat * 10 / 9) + " grad";
    return true;
  }

  if (lower.startsWith("gradian ke derajat")) {
    var gradian = parseFloat(q.replace(/^gradian ke derajat\s*/i, "").trim().replace(",", "."));
    if (isNaN(gradian)) { out.innerHTML = "Format: gradian ke derajat <gradian>"; return true; }
    out.innerHTML = gradian + " grad = " + formatAngkaJS(gradian * 9 / 10) + "°";
    return true;
  }

  // --- KONVERSI UNIVERSAL (panjang, berat, waktu, volume, luas, kecepatan, data, energi, tekanan) ---
  var matchKonversi = q.match(/^([a-z0-9\/²³\s]+?)\s+ke\s+([a-z0-9\/²³\s]+?)\s+([\d.,\-]+)$/i);
  if (matchKonversi) {
    var satuan1 = matchKonversi[1].trim().toLowerCase();
    var satuan2 = matchKonversi[2].trim().toLowerCase();
    var nilaiStr = matchKonversi[3].trim();
    var nilai = parseFloat(nilaiStr.replace(",", "."));
    
    if (tabelKonversi[satuan1] && tabelKonversi[satuan2]) {
      var data1 = tabelKonversi[satuan1];
      var data2 = tabelKonversi[satuan2];
      
      if (data1.kategori !== data2.kategori) {
        out.innerHTML = "❌ Tidak bisa konversi dari " + data1.kategori + " ke " + data2.kategori;
        return true;
      }
      
      if (isNaN(nilai)) {
        out.innerHTML = "❌ Nilai tidak valid: " + nilaiStr;
        return true;
      }
      
      var hasil = nilai * data1.faktor / data2.faktor;
      out.innerHTML = nilaiStr + " " + data1.nama + " = " + formatAngkaJS(hasil) + " " + data2.nama;
      return true;
    }
  }

// ========================================================
// BULATKAN, MUTLAK, SISA
// ========================================================

// --- BULATKAN ---
if (lower.startsWith("bulatkan")) {
  var rest = q.replace(/^bulatkan\s*/i, "").trim();
  // Format: bulatkan <n> [ke <desimal>]
  var match = rest.match(/^([\d.,\-]+)\s*(?:ke\s*(\d+))?$/i);
  if (!match) {
    out.innerHTML = "Format: bulatkan &lt;n&gt; [ke &lt;desimal&gt;]<br>Contoh: bulatkan 3,14159 ke 2";
    return true;
  }
  var num = parseFloat(match[1].replace(",", "."));
  var desimal = match[2] ? parseInt(match[2]) : 0;
  if (isNaN(num)) {
    out.innerHTML = "❌ Nilai tidak valid: " + match[1];
    return true;
  }
  if (desimal < 0 || desimal > 20) {
    out.innerHTML = "❌ Desimal harus 0-20.";
    return true;
  }
  var hasil = num.toFixed(desimal);
  out.innerHTML = num + " dibulatkan ke " + desimal + " desimal = " + hasil.replace(".", ",");
  return true;
}

// --- MUTLAK ---
if (lower.startsWith("mutlak")) {
  var num = parseFloat(q.replace(/^mutlak\s*/i, "").trim().replace(",", "."));
  if (isNaN(num)) {
    out.innerHTML = "Format: mutlak &lt;n&gt;<br>Contoh: mutlak -5";
    return true;
  }
  out.innerHTML = "|" + num + "| = " + Math.abs(num);
  return true;
}

// --- SISA BAGI (MODULO) ---
if (lower.startsWith("sisa")) {
  var rest = q.replace(/^sisa\s*/i, "").trim();
  // Format: sisa <a> bagi <b>
  var match = rest.match(/^(\d+)\s+bagi\s+(\d+)$/i);
  if (!match) {
    out.innerHTML = "Format: sisa &lt;a&gt; bagi &lt;b&gt;<br>Contoh: sisa 17 bagi 5";
    return true;
  }
  var a = parseInt(match[1]);
  var b = parseInt(match[2]);
  if (b === 0) {
    out.innerHTML = "❌ Tidak bisa bagi dengan 0.";
    return true;
  }
  out.innerHTML = a + " mod " + b + " = " + (a % b);
  return true;
}

  return false;
}