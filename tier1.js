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

  return false;
}
