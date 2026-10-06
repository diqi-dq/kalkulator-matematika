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

// ========================================================
// FPB DETAIL — HARUS DICEK SEBELUM "fpb" BIASA
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
// KPK DETAIL — HARUS DICEK SEBELUM "kpk" BIASA
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
// FPB BIASA — DICEK SETELAH "fpb detail"
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
// KPK BIASA — DICEK SETELAH "kpk detail"
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

// ========================================================
// KONVERSI SATUAN — LENGKAP
// ========================================================

// --- A. SUHU ---
if (lower.startsWith("celsius ke fahrenheit")) {
  var c = parseFloat(q.replace(/^celsius ke fahrenheit\s*/i, "").trim().replace(",", "."));
  if (isNaN(c)) { out.innerHTML = "Format: celsius ke fahrenheit <c>"; return true; }
  var f = c * 9 / 5 + 32;
  out.innerHTML = c + "°C = " + formatAngkaJS(f) + "°F";
  return true;
}
if (lower.startsWith("fahrenheit ke celsius")) {
  var f = parseFloat(q.replace(/^fahrenheit ke celsius\s*/i, "").trim().replace(",", "."));
  if (isNaN(f)) { out.innerHTML = "Format: fahrenheit ke celsius <f>"; return true; }
  var c = (f - 32) * 5 / 9;
  out.innerHTML = f + "°F = " + formatAngkaJS(c) + "°C";
  return true;
}
if (lower.startsWith("celsius ke kelvin")) {
  var c = parseFloat(q.replace(/^celsius ke kelvin\s*/i, "").trim().replace(",", "."));
  if (isNaN(c)) { out.innerHTML = "Format: celsius ke kelvin <c>"; return true; }
  out.innerHTML = c + "°C = " + formatAngkaJS(c + 273.15) + " K";
  return true;
}
if (lower.startsWith("kelvin ke celsius")) {
  var k = parseFloat(q.replace(/^kelvin ke celsius\s*/i, "").trim().replace(",", "."));
  if (isNaN(k)) { out.innerHTML = "Format: kelvin ke celsius <k>"; return true; }
  out.innerHTML = k + " K = " + formatAngkaJS(k - 273.15) + "°C";
  return true;
}
if (lower.startsWith("fahrenheit ke kelvin")) {
  var f = parseFloat(q.replace(/^fahrenheit ke kelvin\s*/i, "").trim().replace(",", "."));
  if (isNaN(f)) { out.innerHTML = "Format: fahrenheit ke kelvin <f>"; return true; }
  out.innerHTML = f + "°F = " + formatAngkaJS((f - 32) * 5 / 9 + 273.15) + " K";
  return true;
}
if (lower.startsWith("kelvin ke fahrenheit")) {
  var k = parseFloat(q.replace(/^kelvin ke fahrenheit\s*/i, "").trim().replace(",", "."));
  if (isNaN(k)) { out.innerHTML = "Format: kelvin ke fahrenheit <k>"; return true; }
  out.innerHTML = k + " K = " + formatAngkaJS((k - 273.15) * 9 / 5 + 32) + "°F";
  return true;
}
if (lower.startsWith("celsius ke reamur")) {
  var c = parseFloat(q.replace(/^celsius ke reamur\s*/i, "").trim().replace(",", "."));
  if (isNaN(c)) { out.innerHTML = "Format: celsius ke reamur <c>"; return true; }
  out.innerHTML = c + "°C = " + formatAngkaJS(c * 4 / 5) + "°R";
  return true;
}
if (lower.startsWith("reamur ke celsius")) {
  var r = parseFloat(q.replace(/^reamur ke celsius\s*/i, "").trim().replace(",", "."));
  if (isNaN(r)) { out.innerHTML = "Format: reamur ke celsius <r>"; return true; }
  out.innerHTML = r + "°R = " + formatAngkaJS(r * 5 / 4) + "°C";
  return true;
}

// --- B. PANJANG ---
if (lower.startsWith("km ke meter")) {
  var km = parseFloat(q.replace(/^km ke meter\s*/i, "").trim().replace(",", "."));
  if (isNaN(km)) { out.innerHTML = "Format: km ke meter <km>"; return true; }
  out.innerHTML = km + " km = " + formatAngkaJS(km * 1000) + " m";
  return true;
}
if (lower.startsWith("km ke cm")) {
  var km = parseFloat(q.replace(/^km ke cm\s*/i, "").trim().replace(",", "."));
  if (isNaN(km)) { out.innerHTML = "Format: km ke cm <km>"; return true; }
  out.innerHTML = km + " km = " + formatAngkaJS(km * 100000) + " cm";
  return true;
}
if (lower.startsWith("km ke mm")) {
  var km = parseFloat(q.replace(/^km ke mm\s*/i, "").trim().replace(",", "."));
  if (isNaN(km)) { out.innerHTML = "Format: km ke mm <km>"; return true; }
  out.innerHTML = km + " km = " + formatAngkaJS(km * 1000000) + " mm";
  return true;
}
if (lower.startsWith("meter ke cm")) {
  var m = parseFloat(q.replace(/^meter ke cm\s*/i, "").trim().replace(",", "."));
  if (isNaN(m)) { out.innerHTML = "Format: meter ke cm <m>"; return true; }
  out.innerHTML = m + " m = " + formatAngkaJS(m * 100) + " cm";
  return true;
}
if (lower.startsWith("meter ke mm")) {
  var m = parseFloat(q.replace(/^meter ke mm\s*/i, "").trim().replace(",", "."));
  if (isNaN(m)) { out.innerHTML = "Format: meter ke mm <m>"; return true; }
  out.innerHTML = m + " m = " + formatAngkaJS(m * 1000) + " mm";
  return true;
}
if (lower.startsWith("meter ke km")) {
  var m = parseFloat(q.replace(/^meter ke km\s*/i, "").trim().replace(",", "."));
  if (isNaN(m)) { out.innerHTML = "Format: meter ke km <m>"; return true; }
  out.innerHTML = m + " m = " + formatAngkaJS(m / 1000) + " km";
  return true;
}
if (lower.startsWith("cm ke meter")) {
  var cm = parseFloat(q.replace(/^cm ke meter\s*/i, "").trim().replace(",", "."));
  if (isNaN(cm)) { out.innerHTML = "Format: cm ke meter <cm>"; return true; }
  out.innerHTML = cm + " cm = " + formatAngkaJS(cm / 100) + " m";
  return true;
}
if (lower.startsWith("cm ke mm")) {
  var cm = parseFloat(q.replace(/^cm ke mm\s*/i, "").trim().replace(",", "."));
  if (isNaN(cm)) { out.innerHTML = "Format: cm ke mm <cm>"; return true; }
  out.innerHTML = cm + " cm = " + formatAngkaJS(cm * 10) + " mm";
  return true;
}
if (lower.startsWith("mm ke cm")) {
  var mm = parseFloat(q.replace(/^mm ke cm\s*/i, "").trim().replace(",", "."));
  if (isNaN(mm)) { out.innerHTML = "Format: mm ke cm <mm>"; return true; }
  out.innerHTML = mm + " mm = " + formatAngkaJS(mm / 10) + " cm";
  return true;
}
if (lower.startsWith("inci ke cm")) {
  var inci = parseFloat(q.replace(/^inci ke cm\s*/i, "").trim().replace(",", "."));
  if (isNaN(inci)) { out.innerHTML = "Format: inci ke cm <inci>"; return true; }
  out.innerHTML = inci + " inci = " + formatAngkaJS(inci * 2.54) + " cm";
  return true;
}
if (lower.startsWith("cm ke inci")) {
  var cm = parseFloat(q.replace(/^cm ke inci\s*/i, "").trim().replace(",", "."));
  if (isNaN(cm)) { out.innerHTML = "Format: cm ke inci <cm>"; return true; }
  out.innerHTML = cm + " cm = " + formatAngkaJS(cm / 2.54) + " inci";
  return true;
}
if (lower.startsWith("kaki ke meter")) {
  var kaki = parseFloat(q.replace(/^kaki ke meter\s*/i, "").trim().replace(",", "."));
  if (isNaN(kaki)) { out.innerHTML = "Format: kaki ke meter <kaki>"; return true; }
  out.innerHTML = kaki + " kaki = " + formatAngkaJS(kaki * 0.3048) + " m";
  return true;
}
if (lower.startsWith("meter ke kaki")) {
  var m = parseFloat(q.replace(/^meter ke kaki\s*/i, "").trim().replace(",", "."));
  if (isNaN(m)) { out.innerHTML = "Format: meter ke kaki <m>"; return true; }
  out.innerHTML = m + " m = " + formatAngkaJS(m / 0.3048) + " kaki";
  return true;
}
if (lower.startsWith("mil ke km")) {
  var mil = parseFloat(q.replace(/^mil ke km\s*/i, "").trim().replace(",", "."));
  if (isNaN(mil)) { out.innerHTML = "Format: mil ke km <mil>"; return true; }
  out.innerHTML = mil + " mil = " + formatAngkaJS(mil * 1.60934) + " km";
  return true;
}
if (lower.startsWith("km ke mil")) {
  var km = parseFloat(q.replace(/^km ke mil\s*/i, "").trim().replace(",", "."));
  if (isNaN(km)) { out.innerHTML = "Format: km ke mil <km>"; return true; }
  out.innerHTML = km + " km = " + formatAngkaJS(km / 1.60934) + " mil";
  return true;
}

// --- C. BERAT ---
if (lower.startsWith("kg ke gram")) {
  var kg = parseFloat(q.replace(/^kg ke gram\s*/i, "").trim().replace(",", "."));
  if (isNaN(kg)) { out.innerHTML = "Format: kg ke gram <kg>"; return true; }
  out.innerHTML = kg + " kg = " + formatAngkaJS(kg * 1000) + " g";
  return true;
}
if (lower.startsWith("kg ke mg")) {
  var kg = parseFloat(q.replace(/^kg ke mg\s*/i, "").trim().replace(",", "."));
  if (isNaN(kg)) { out.innerHTML = "Format: kg ke mg <kg>"; return true; }
  out.innerHTML = kg + " kg = " + formatAngkaJS(kg * 1e6) + " mg";
  return true;
}
if (lower.startsWith("gram ke kg")) {
  var g = parseFloat(q.replace(/^gram ke kg\s*/i, "").trim().replace(",", "."));
  if (isNaN(g)) { out.innerHTML = "Format: gram ke kg <g>"; return true; }
  out.innerHTML = g + " g = " + formatAngkaJS(g / 1000) + " kg";
  return true;
}
if (lower.startsWith("gram ke mg")) {
  var g = parseFloat(q.replace(/^gram ke mg\s*/i, "").trim().replace(",", "."));
  if (isNaN(g)) { out.innerHTML = "Format: gram ke mg <g>"; return true; }
  out.innerHTML = g + " g = " + formatAngkaJS(g * 1000) + " mg";
  return true;
}
if (lower.startsWith("mg ke gram")) {
  var mg = parseFloat(q.replace(/^mg ke gram\s*/i, "").trim().replace(",", "."));
  if (isNaN(mg)) { out.innerHTML = "Format: mg ke gram <mg>"; return true; }
  out.innerHTML = mg + " mg = " + formatAngkaJS(mg / 1000) + " g";
  return true;
}
if (lower.startsWith("ton ke kg")) {
  var ton = parseFloat(q.replace(/^ton ke kg\s*/i, "").trim().replace(",", "."));
  if (isNaN(ton)) { out.innerHTML = "Format: ton ke kg <ton>"; return true; }
  out.innerHTML = ton + " ton = " + formatAngkaJS(ton * 1000) + " kg";
  return true;
}
if (lower.startsWith("kg ke ton")) {
  var kg = parseFloat(q.replace(/^kg ke ton\s*/i, "").trim().replace(",", "."));
  if (isNaN(kg)) { out.innerHTML = "Format: kg ke ton <kg>"; return true; }
  out.innerHTML = kg + " kg = " + formatAngkaJS(kg / 1000) + " ton";
  return true;
}
if (lower.startsWith("pon ke kg")) {
  var pon = parseFloat(q.replace(/^pon ke kg\s*/i, "").trim().replace(",", "."));
  if (isNaN(pon)) { out.innerHTML = "Format: pon ke kg <pon>"; return true; }
  out.innerHTML = pon + " pon = " + formatAngkaJS(pon * 0.453592) + " kg";
  return true;
}
if (lower.startsWith("kg ke pon")) {
  var kg = parseFloat(q.replace(/^kg ke pon\s*/i, "").trim().replace(",", "."));
  if (isNaN(kg)) { out.innerHTML = "Format: kg ke pon <kg>"; return true; }
  out.innerHTML = kg + " kg = " + formatAngkaJS(kg / 0.453592) + " pon";
  return true;
}
if (lower.startsWith("ons ke gram")) {
  var ons = parseFloat(q.replace(/^ons ke gram\s*/i, "").trim().replace(",", "."));
  if (isNaN(ons)) { out.innerHTML = "Format: ons ke gram <ons>"; return true; }
  out.innerHTML = ons + " ons = " + formatAngkaJS(ons * 100) + " g";
  return true;
}

// --- D. WAKTU ---
if (lower.startsWith("jam ke menit")) {
  var jam = parseFloat(q.replace(/^jam ke menit\s*/i, "").trim().replace(",", "."));
  if (isNaN(jam)) { out.innerHTML = "Format: jam ke menit <jam>"; return true; }
  out.innerHTML = jam + " jam = " + formatAngkaJS(jam * 60) + " menit";
  return true;
}
if (lower.startsWith("jam ke detik")) {
  var jam = parseFloat(q.replace(/^jam ke detik\s*/i, "").trim().replace(",", "."));
  if (isNaN(jam)) { out.innerHTML = "Format: jam ke detik <jam>"; return true; }
  out.innerHTML = jam + " jam = " + formatAngkaJS(jam * 3600) + " detik";
  return true;
}
if (lower.startsWith("menit ke detik")) {
  var menit = parseFloat(q.replace(/^menit ke detik\s*/i, "").trim().replace(",", "."));
  if (isNaN(menit)) { out.innerHTML = "Format: menit ke detik <menit>"; return true; }
  out.innerHTML = menit + " menit = " + formatAngkaJS(menit * 60) + " detik";
  return true;
}
if (lower.startsWith("menit ke jam")) {
  var menit = parseFloat(q.replace(/^menit ke jam\s*/i, "").trim().replace(",", "."));
  if (isNaN(menit)) { out.innerHTML = "Format: menit ke jam <menit>"; return true; }
  out.innerHTML = menit + " menit = " + formatAngkaJS(menit / 60) + " jam";
  return true;
}
if (lower.startsWith("detik ke menit")) {
  var detik = parseFloat(q.replace(/^detik ke menit\s*/i, "").trim().replace(",", "."));
  if (isNaN(detik)) { out.innerHTML = "Format: detik ke menit <detik>"; return true; }
  out.innerHTML = detik + " detik = " + formatAngkaJS(detik / 60) + " menit";
  return true;
}
if (lower.startsWith("detik ke jam")) {
  var detik = parseFloat(q.replace(/^detik ke jam\s*/i, "").trim().replace(",", "."));
  if (isNaN(detik)) { out.innerHTML = "Format: detik ke jam <detik>"; return true; }
  out.innerHTML = detik + " detik = " + formatAngkaJS(detik / 3600) + " jam";
  return true;
}
if (lower.startsWith("hari ke jam")) {
  var hari = parseFloat(q.replace(/^hari ke jam\s*/i, "").trim().replace(",", "."));
  if (isNaN(hari)) { out.innerHTML = "Format: hari ke jam <hari>"; return true; }
  out.innerHTML = hari + " hari = " + formatAngkaJS(hari * 24) + " jam";
  return true;
}
if (lower.startsWith("hari ke menit")) {
  var hari = parseFloat(q.replace(/^hari ke menit\s*/i, "").trim().replace(",", "."));
  if (isNaN(hari)) { out.innerHTML = "Format: hari ke menit <hari>"; return true; }
  out.innerHTML = hari + " hari = " + formatAngkaJS(hari * 1440) + " menit";
  return true;
}
if (lower.startsWith("minggu ke hari")) {
  var minggu = parseFloat(q.replace(/^minggu ke hari\s*/i, "").trim().replace(",", "."));
  if (isNaN(minggu)) { out.innerHTML = "Format: minggu ke hari <minggu>"; return true; }
  out.innerHTML = minggu + " minggu = " + formatAngkaJS(minggu * 7) + " hari";
  return true;
}
if (lower.startsWith("tahun ke hari")) {
  var tahun = parseFloat(q.replace(/^tahun ke hari\s*/i, "").trim().replace(",", "."));
  if (isNaN(tahun)) { out.innerHTML = "Format: tahun ke hari <tahun>"; return true; }
  out.innerHTML = tahun + " tahun = " + formatAngkaJS(tahun * 365) + " hari";
  return true;
}
if (lower.startsWith("tahun ke bulan")) {
  var tahun = parseFloat(q.replace(/^tahun ke bulan\s*/i, "").trim().replace(",", "."));
  if (isNaN(tahun)) { out.innerHTML = "Format: tahun ke bulan <tahun>"; return true; }
  out.innerHTML = tahun + " tahun = " + formatAngkaJS(tahun * 12) + " bulan";
  return true;
}

// --- E. LUAS ---
if (lower.startsWith("m2 ke cm2")) {
  var m2 = parseFloat(q.replace(/^m2 ke cm2\s*/i, "").trim().replace(",", "."));
  if (isNaN(m2)) { out.innerHTML = "Format: m2 ke cm2 <m2>"; return true; }
  out.innerHTML = m2 + " m² = " + formatAngkaJS(m2 * 10000) + " cm²";
  return true;
}
if (lower.startsWith("cm2 ke m2")) {
  var cm2 = parseFloat(q.replace(/^cm2 ke m2\s*/i, "").trim().replace(",", "."));
  if (isNaN(cm2)) { out.innerHTML = "Format: cm2 ke m2 <cm2>"; return true; }
  out.innerHTML = cm2 + " cm² = " + formatAngkaJS(cm2 / 10000) + " m²";
  return true;
}
if (lower.startsWith("hektar ke m2")) {
  var ha = parseFloat(q.replace(/^hektar ke m2\s*/i, "").trim().replace(",", "."));
  if (isNaN(ha)) { out.innerHTML = "Format: hektar ke m2 <ha>"; return true; }
  out.innerHTML = ha + " hektar = " + formatAngkaJS(ha * 10000) + " m²";
  return true;
}
if (lower.startsWith("are ke m2")) {
  var are = parseFloat(q.replace(/^are ke m2\s*/i, "").trim().replace(",", "."));
  if (isNaN(are)) { out.innerHTML = "Format: are ke m2 <are>"; return true; }
  out.innerHTML = are + " are = " + formatAngkaJS(are * 100) + " m²";
  return true;
}
if (lower.startsWith("acre ke m2")) {
  var acre = parseFloat(q.replace(/^acre ke m2\s*/i, "").trim().replace(",", "."));
  if (isNaN(acre)) { out.innerHTML = "Format: acre ke m2 <acre>"; return true; }
  out.innerHTML = acre + " acre = " + formatAngkaJS(acre * 4046.86) + " m²";
  return true;
}

// --- F. VOLUME ---
if (lower.startsWith("liter ke ml")) {
  var l = parseFloat(q.replace(/^liter ke ml\s*/i, "").trim().replace(",", "."));
  if (isNaN(l)) { out.innerHTML = "Format: liter ke ml <l>"; return true; }
  out.innerHTML = l + " liter = " + formatAngkaJS(l * 1000) + " ml";
  return true;
}
if (lower.startsWith("ml ke liter")) {
  var ml = parseFloat(q.replace(/^ml ke liter\s*/i, "").trim().replace(",", "."));
  if (isNaN(ml)) { out.innerHTML = "Format: ml ke liter <ml>"; return true; }
  out.innerHTML = ml + " ml = " + formatAngkaJS(ml / 1000) + " liter";
  return true;
}
if (lower.startsWith("liter ke m3")) {
  var l = parseFloat(q.replace(/^liter ke m3\s*/i, "").trim().replace(",", "."));
  if (isNaN(l)) { out.innerHTML = "Format: liter ke m3 <l>"; return true; }
  out.innerHTML = l + " liter = " + formatAngkaJS(l / 1000) + " m³";
  return true;
}
if (lower.startsWith("m3 ke liter")) {
  var m3 = parseFloat(q.replace(/^m3 ke liter\s*/i, "").trim().replace(",", "."));
  if (isNaN(m3)) { out.innerHTML = "Format: m3 ke liter <m3>"; return true; }
  out.innerHTML = m3 + " m³ = " + formatAngkaJS(m3 * 1000) + " liter";
  return true;
}
if (lower.startsWith("galon ke liter")) {
  var galon = parseFloat(q.replace(/^galon ke liter\s*/i, "").trim().replace(",", "."));
  if (isNaN(galon)) { out.innerHTML = "Format: galon ke liter <galon>"; return true; }
  out.innerHTML = galon + " galon = " + formatAngkaJS(galon * 3.78541) + " liter";
  return true;
}
if (lower.startsWith("liter ke galon")) {
  var l = parseFloat(q.replace(/^liter ke galon\s*/i, "").trim().replace(",", "."));
  if (isNaN(l)) { out.innerHTML = "Format: liter ke galon <l>"; return true; }
  out.innerHTML = l + " liter = " + formatAngkaJS(l / 3.78541) + " galon";
  return true;
}

// --- G. KECEPATAN ---
if (lower.startsWith("km/jam ke m/detik")) {
  var kmjam = parseFloat(q.replace(/^km\/jam ke m\/detik\s*/i, "").trim().replace(",", "."));
  if (isNaN(kmjam)) { out.innerHTML = "Format: km/jam ke m/detik <kmjam>"; return true; }
  out.innerHTML = kmjam + " km/jam = " + formatAngkaJS(kmjam * 5 / 18) + " m/detik";
  return true;
}
if (lower.startsWith("m/detik ke km/jam")) {
  var mdetik = parseFloat(q.replace(/^m\/detik ke km\/jam\s*/i, "").trim().replace(",", "."));
  if (isNaN(mdetik)) { out.innerHTML = "Format: m/detik ke km/jam <mdetik>"; return true; }
  out.innerHTML = mdetik + " m/detik = " + formatAngkaJS(mdetik * 18 / 5) + " km/jam";
  return true;
}
if (lower.startsWith("mil/jam ke km/jam")) {
  var mph = parseFloat(q.replace(/^mil\/jam ke km\/jam\s*/i, "").trim().replace(",", "."));
  if (isNaN(mph)) { out.innerHTML = "Format: mil/jam ke km/jam <mph>"; return true; }
  out.innerHTML = mph + " mil/jam = " + formatAngkaJS(mph * 1.60934) + " km/jam";
  return true;
}
if (lower.startsWith("knot ke km/jam")) {
  var knot = parseFloat(q.replace(/^knot ke km\/jam\s*/i, "").trim().replace(",", "."));
  if (isNaN(knot)) { out.innerHTML = "Format: knot ke km/jam <knot>"; return true; }
  out.innerHTML = knot + " knot = " + formatAngkaJS(knot * 1.852) + " km/jam";
  return true;
}

// --- H. DATA DIGITAL ---
if (lower.startsWith("byte ke bit")) {
  var byte = parseFloat(q.replace(/^byte ke bit\s*/i, "").trim().replace(",", "."));
  if (isNaN(byte)) { out.innerHTML = "Format: byte ke bit <byte>"; return true; }
  out.innerHTML = byte + " byte = " + formatAngkaJS(byte * 8) + " bit";
  return true;
}
if (lower.startsWith("bit ke byte")) {
  var bit = parseFloat(q.replace(/^bit ke byte\s*/i, "").trim().replace(",", "."));
  if (isNaN(bit)) { out.innerHTML = "Format: bit ke byte <bit>"; return true; }
  out.innerHTML = bit + " bit = " + formatAngkaJS(bit / 8) + " byte";
  return true;
}
if (lower.startsWith("kb ke byte")) {
  var kb = parseFloat(q.replace(/^kb ke byte\s*/i, "").trim().replace(",", "."));
  if (isNaN(kb)) { out.innerHTML = "Format: kb ke byte <kb>"; return true; }
  out.innerHTML = kb + " KB = " + formatAngkaJS(kb * 1024) + " byte";
  return true;
}
if (lower.startsWith("mb ke kb")) {
  var mb = parseFloat(q.replace(/^mb ke kb\s*/i, "").trim().replace(",", "."));
  if (isNaN(mb)) { out.innerHTML = "Format: mb ke kb <mb>"; return true; }
  out.innerHTML = mb + " MB = " + formatAngkaJS(mb * 1024) + " KB";
  return true;
}
if (lower.startsWith("gb ke mb")) {
  var gb = parseFloat(q.replace(/^gb ke mb\s*/i, "").trim().replace(",", "."));
  if (isNaN(gb)) { out.innerHTML = "Format: gb ke mb <gb>"; return true; }
  out.innerHTML = gb + " GB = " + formatAngkaJS(gb * 1024) + " MB";
  return true;
}
if (lower.startsWith("tb ke gb")) {
  var tb = parseFloat(q.replace(/^tb ke gb\s*/i, "").trim().replace(",", "."));
  if (isNaN(tb)) { out.innerHTML = "Format: tb ke gb <tb>"; return true; }
  out.innerHTML = tb + " TB = " + formatAngkaJS(tb * 1024) + " GB";
  return true;
}

// --- I. SUDUT ---
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

// --- J. ENERGI ---
if (lower.startsWith("kalori ke joule")) {
  var kal = parseFloat(q.replace(/^kalori ke joule\s*/i, "").trim().replace(",", "."));
  if (isNaN(kal)) { out.innerHTML = "Format: kalori ke joule <kal>"; return true; }
  out.innerHTML = kal + " kal = " + formatAngkaJS(kal * 4.184) + " J";
  return true;
}
if (lower.startsWith("joule ke kalori")) {
  var joule = parseFloat(q.replace(/^joule ke kalori\s*/i, "").trim().replace(",", "."));
  if (isNaN(joule)) { out.innerHTML = "Format: joule ke kalori <joule>"; return true; }
  out.innerHTML = joule + " J = " + formatAngkaJS(joule / 4.184) + " kal";
  return true;
}
if (lower.startsWith("kwh ke joule")) {
  var kwh = parseFloat(q.replace(/^kwh ke joule\s*/i, "").trim().replace(",", "."));
  if (isNaN(kwh)) { out.innerHTML = "Format: kwh ke joule <kwh>"; return true; }
  out.innerHTML = kwh + " kWh = " + formatAngkaJS(kwh * 3.6e6) + " J";
  return true;
}

// --- K. TEKANAN ---
if (lower.startsWith("atm ke pascal")) {
  var atm = parseFloat(q.replace(/^atm ke pascal\s*/i, "").trim().replace(",", "."));
  if (isNaN(atm)) { out.innerHTML = "Format: atm ke pascal <atm>"; return true; }
  out.innerHTML = atm + " atm = " + formatAngkaJS(atm * 101325) + " Pa";
  return true;
}
if (lower.startsWith("bar ke pascal")) {
  var bar = parseFloat(q.replace(/^bar ke pascal\s*/i, "").trim().replace(",", "."));
  if (isNaN(bar)) { out.innerHTML = "Format: bar ke pascal <bar>"; return true; }
  out.innerHTML = bar + " bar = " + formatAngkaJS(bar * 100000) + " Pa";
  return true;
}
if (lower.startsWith("psi ke pascal")) {
  var psi = parseFloat(q.replace(/^psi ke pascal\s*/i, "").trim().replace(",", "."));
  if (isNaN(psi)) { out.innerHTML = "Format: psi ke pascal <psi>"; return true; }
  out.innerHTML = psi + " psi = " + formatAngkaJS(psi * 6894.76) + " Pa";
  return true;
}

  return false;
}
