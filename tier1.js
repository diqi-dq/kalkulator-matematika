/* ========================================================
   TIER 1: VANILLA JS HANDLER
   Perintah yang dieksekusi instan tanpa Pyodide.
   ======================================================== */

function jalankanTier1(q, out) {
  var lower = q.toLowerCase();

  // --- HITUNG ---
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

  // --- DESIMAL ---
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

  // --- BINER ---
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

  // --- FAKTORIAL ---
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

  // --- BILANGAN PRIMA ---
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

  // --- PYTHAGORAS ---
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

  // --- DERAJAT KE RADIAN ---
  if (lower.startsWith("derajat ke radian")) {
    var e = q.replace(/^derajat ke radian\s*/i, "").trim();
    e = e.replace(/\bpi\b/gi, String(Math.PI));
    e = e.replace(/\^/g, '**');
    if (!/^[\d\s\+\-\*\/\(\)\.\,\*]+$/.test(e)) {
      out.innerHTML = "❌ Ekspresi tidak valid.";
      return true;
    }
    try {
      var derajat = Function('"use strict"; return (' + e + ')')();
      if (typeof derajat !== 'number' || !isFinite(derajat)) {
        out.innerHTML = "❌ Nilai derajat tidak valid.";
        return true;
      }
      var radian = derajat * Math.PI / 180;
      out.innerHTML = derajat + "° = " + formatAngkaJS(radian) + " rad";
    } catch(err) {
      out.innerHTML = "❌ " + err.message;
    }
    return true;
  }
// --- FPB (multi-bilangan) ---
if (lower.startsWith("fpb")) {
  var rest = q.replace(/^fpb\s*/i, "").trim();
  // ✅ Support pemisah: ; , atau spasi
  var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
  
  if (parts.length < 2) {
    out.innerHTML = "Format: fpb <a>; <b> [; <c> ...]<br>Contoh: fpb 12; 18; 24";
    return true;
  }
  
  var bilangan = [];
  for (var i = 0; i < parts.length; i++) {
    var n = parseInt(parts[i]);
    if (isNaN(n)) {
      out.innerHTML = "❌ Semua argumen harus bilangan bulat. Argumen ke-" + (i+1) + " tidak valid: " + parts[i];
      return true;
    }
    bilangan.push(Math.abs(n));
  }
  
  // Hitung FPB iteratif
  var hasil = bilangan[0];
  for (var i = 1; i < bilangan.length; i++) {
    hasil = gcd(hasil, bilangan[i]);
    if (hasil === 1) break; // FPB = 1, tidak bisa lebih kecil
  }
  
  out.innerHTML = "FPB(" + bilangan.join(", ") + ") = " + hasil;
  return true;
}

// --- KPK (multi-bilangan) ---
if (lower.startsWith("kpk")) {
  var rest = q.replace(/^kpk\s*/i, "").trim();
  // ✅ Support pemisah: ; , atau spasi
  var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
  
  if (parts.length < 2) {
    out.innerHTML = "Format: kpk <a>; <b> [; <c> ...]<br>Contoh: kpk 4; 6; 8";
    return true;
  }
  
  var bilangan = [];
  for (var i = 0; i < parts.length; i++) {
    var n = parseInt(parts[i]);
    if (isNaN(n)) {
      out.innerHTML = "❌ Semua argumen harus bilangan bulat. Argumen ke-" + (i+1) + " tidak valid: " + parts[i];
      return true;
    }
    if (n === 0) {
      out.innerHTML = "❌ KPK tidak terdefinisi untuk 0.";
      return true;
    }
    bilangan.push(Math.abs(n));
  }
  
  // Hitung KPK iteratif
  var hasil = bilangan[0];
  for (var i = 1; i < bilangan.length; i++) {
    hasil = (hasil * bilangan[i]) / gcd(hasil, bilangan[i]);
  }
  
  out.innerHTML = "KPK(" + bilangan.join(", ") + ") = " + hasil;
  return true;
}

// --- CEK PRIMA ---
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

// --- FAKTORISASI PRIMA ---
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

// --- FPB dengan faktorisasi ---
if (lower.startsWith("fpb detail")) {
  var rest = q.replace(/^fpb detail\s*/i, "").trim();
  var parts = rest.split(/[;,\s]+/).map(function(s){return s.trim();}).filter(function(s){return s.length > 0;});
  
  if (parts.length < 2) {
    out.innerHTML = "Format: fpb detail <a>; <b> [; <c> ...]";
    return true;
  }
  
  var bilangan = parts.map(function(p){ return Math.abs(parseInt(p)); });
  if (bilangan.some(isNaN)) {
    out.innerHTML = "❌ Semua argumen harus bilangan bulat.";
    return true;
  }
  
  // Faktorisasi tiap bilangan
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
  
  // FPB: ambil pangkat terkecil untuk setiap prima yang muncul di SEMUA bilangan
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
    html += "  " + b + " = " + str + "<br>";
  });
  html += "<br>FPB = " + (langkahFPB.length > 0 ? langkahFPB.join(" × ") : "1") + " = " + fpb;
  
  out.innerHTML = html;
  return true;
}

// --- KONVERSI BASIS ---
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

  return false;
}
