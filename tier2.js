/* ========================================================
   TIER 2: PYODIDE HANDLER
   Handler perintah simbolik menggunakan Pyodide + SymPy.
   Bergantung pada:
   - kalkulator.js (fungsi bantu: escapeHtml, sisipKaliImplisit, dll.)
   - tier1.js (jalankanTier1)
   - statistik.js (jalankanStatistik)
   - pyodide-loader.js (muatPyodide, py, siap, sedangMemuat)
   ======================================================== */

function jalankanPerintah(q, out, inputAsli) {
    out.innerHTML = "<em>Menghitung...</em>";

  q = q.replace(/\^/g, "**");
  var lower = q.toLowerCase();
  var cmd = "import sympy as sp\nfrom sympy import *\nx,y,z,t,n,m,k,i=symbols('x y z t n m k i')\n";
  var expr = "";
  var varName = "x";

  try {
    if (lower.startsWith("tabel desimal")) {
      var rest = q.replace(/^tabel desimal\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 4) { out.innerHTML = 'Format: tabel desimal &lt;ekspresi&gt;; x; a; b [; langkah]'; return; }
      var ekspresi = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var aNum = konversiAngka(parts[2]);
      var bNum = konversiAngka(parts[3]);
      var langkahNum = parts.length >= 5 ? konversiAngka(parts[4]) : 1;
      if (aNum === null || bNum === null || langkahNum === null || langkahNum <= 0) { out.innerHTML = '❌ Nilai a, b, atau langkah tidak valid.'; return; }
      cmd += "ekspresi_tabel = sp.sympify('" + ekspresi + "')\n";
      cmd += "data_tabel = tabel_nilai_desimal(ekspresi_tabel, sp.Symbol('" + varName + "'), " + aNum + ", " + bNum + ", " + langkahNum + ")\n";
      cmd += "print(tampil_tabel(data_tabel, '" + varName + "'))";
    }
    else if (lower.startsWith("tabel")) {
      var rest = q.replace(/^tabel\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 4) { out.innerHTML = 'Format: tabel &lt;ekspresi&gt;; x; a; b [; langkah]'; return; }
      var ekspresi = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var aNum = konversiAngka(parts[2]);
      var bNum = konversiAngka(parts[3]);
      var langkahNum = parts.length >= 5 ? konversiAngka(parts[4]) : 1;
      if (aNum === null || bNum === null || langkahNum === null || langkahNum <= 0) { out.innerHTML = '❌ Nilai a, b, atau langkah tidak valid.'; return; }
      cmd += "ekspresi_tabel = sp.sympify('" + ekspresi + "')\n";
      cmd += "data_tabel = tabel_nilai(ekspresi_tabel, sp.Symbol('" + varName + "'), " + aNum + ", " + bNum + ", " + langkahNum + ")\n";
      cmd += "print(tampil_tabel(data_tabel, '" + varName + "'))";
    }
    else if (lower.startsWith("pecahkan")) {
      expr = q.replace(/^pecahkan\s*/i, "").trim();
      expr = expr.replace(/\^/g, "**");
      if (expr.indexOf(";") !== -1) {
        var pers = expr.split(";").map(function(s){return s.trim();});
        var eqs = [];
        var varsDitemukan = {};
        pers.forEach(function(p) {
          var kiri, kanan;
          if (p.indexOf("=") !== -1) {
            var parts = p.split("=");
            kiri = sisipKaliImplisit(parts[0].trim());
            kanan = sisipKaliImplisit(parts[1].trim());
          } else {
            kiri = sisipKaliImplisit(p);
            kanan = "0";
          }
          [kiri, kanan].forEach(function(sisi) {
            var cocok = sisi.match(/\b([a-zA-Z])\b/g);
            if (cocok) {
              cocok.forEach(function(v) {
                if (["x","y","z","t","n","m","k","i"].indexOf(v) !== -1) {
                  varsDitemukan[v] = true;
                }
              });
            }
          });
          eqs.push("Eq(" + kiri + ", " + kanan + ")");
        });
        var daftarVar = Object.keys(varsDitemukan);
        if (daftarVar.length === 0) { daftarVar = ["x"]; }
        cmd += "print(tampil(sp.solve([" + eqs.join(", ") + "], [" + daftarVar.join(", ") + "], dict=True)))";
      } else {
        if (expr.indexOf("=") !== -1) {
          var parts = expr.split("=");
          var kiri = sisipKaliImplisit(parts[0].trim());
          var kanan = sisipKaliImplisit(parts[1].trim());
          cmd += "print(tampil(sp.solve(Eq(" + kiri + ", " + kanan + "), " + varName + ")))";
        } else {
          cmd += "print(tampil(sp.solve(" + sisipKaliImplisit(expr) + ", " + varName + ")))";
        }
      }
    }
    else if (lower.startsWith("selesaikan pertidaksamaan")) {
      expr = q.replace(/^selesaikan pertidaksamaan\s*/i, "").trim();
      expr = expr.replace(/\^/g, "**");
      if (expr.indexOf(";") !== -1) {
        var pert = expr.split(";").map(function(s){return s.trim();});
        var conds = [];
        pert.forEach(function(p) {
          if (p.indexOf("<=") !== -1) { var parts = p.split("<="); conds.push("sp.sympify('" + parts[0] + "') <= sp.sympify('" + parts[1] + "')"); }
          else if (p.indexOf(">=") !== -1) { var parts = p.split(">="); conds.push("sp.sympify('" + parts[0] + "') >= sp.sympify('" + parts[1] + "')"); }
          else if (p.indexOf("<") !== -1) { var parts = p.split("<"); conds.push("sp.sympify('" + parts[0] + "') < sp.sympify('" + parts[1] + "')"); }
          else if (p.indexOf(">") !== -1) { var parts = p.split(">"); conds.push("sp.sympify('" + parts[0] + "') > sp.sympify('" + parts[1] + "')"); }
        });
        cmd += "print(tampil(sp.solveset(sp.And(*[" + conds.join(", ") + "]), " + varName + ", domain=S.Reals)))";
      } else {
        var pert = expr;
        var tanda = "";
        var parts = [];
        if (pert.indexOf("<=") !== -1) { parts = pert.split("<="); tanda = "<="; }
        else if (pert.indexOf(">=") !== -1) { parts = pert.split(">="); tanda = ">="; }
        else if (pert.indexOf("<") !== -1) { parts = pert.split("<"); tanda = "<"; }
        else if (pert.indexOf(">") !== -1) { parts = pert.split(">"); tanda = ">"; }
        if (parts.length === 2) {
          cmd += "print(tampil(sp.solveset(sp.sympify('" + sisipKaliImplisit(parts[0]) + "') " + tanda + " sp.sympify('" + sisipKaliImplisit(parts[1]) + "'), " + varName + ", domain=S.Reals)))";
        } else {
          out.innerHTML = 'Format: selesaikan pertidaksamaan <pertidaksamaan>';
          return;
        }
      }
    }
    else if (lower.startsWith("limit")) {
      var rest = q.replace(/^limit\s*/i, "").trim();
      var arrowMatch = rest.match(/([a-zA-Z])\s*->\s*([^\s,]+)/);
      if (!arrowMatch) { out.innerHTML = 'Format: limit <ekspresi>; x->nilai'; return; }
      varName = arrowMatch[1];
      var target = arrowMatch[2];
      var exprPart = rest.substring(0, rest.indexOf(arrowMatch[0])).replace(/[;,]\s*$/, "").trim();
      exprPart = sisipKaliImplisit(exprPart);
      target = target.replace(/\binfinity\b/gi, "oo").replace(/\binf\b/gi, "oo").replace(/\btakhingga\b/gi, "oo").replace(/∞/g, "oo").replace(/−∞/g, "-oo").replace(/-∞/g, "-oo");
      cmd += "print(tampil(sp.limit(" + exprPart + ", " + varName + ", " + target + ")))";
    }
    else if (lower.startsWith("deret taylor") || lower.startsWith("ekspansi deret")) {
      var isTaylor = lower.startsWith("deret taylor");
      var prefix = isTaylor ? /^deret taylor\s*/i : /^ekspansi deret\s*/i;
      var rest = q.replace(prefix, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 4) { out.innerHTML = 'Format: ' + (isTaylor ? 'deret taylor' : 'ekspansi deret') + ' <ekspresi>; x; titik; orde'; return; }
      var ekspresi = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var titik = parts[2];
      var orde = parts[3];
      cmd += "print(tampil_deret(sp.series(sp.sympify('" + ekspresi + "'), sp.Symbol('" + varName + "'), " + titik + ", " + orde + ")))";
    }
    else if (lower.startsWith("kekontinuan") || lower.startsWith("kontinu")) {
      var isKekontinuan = lower.startsWith("kekontinuan");
      var prefix = isKekontinuan ? /^kekontinuan\s*/i : /^kontinu\s*/i;
      var e = q.replace(prefix, "").trim();
      if (e.indexOf("=") !== -1) {
        var parts = e.split("=");
        e = parts[1].trim();
      }
      e = sisipKaliImplisit(e);
      varName = deteksiVariabel(e);
      cmd += "print(analisis_kekontinuan(sp.sympify('" + e + "'), sp.Symbol('" + varName + "')))";
    }
    else if (lower.startsWith("turunan2") || lower.startsWith("turunan kedua")) {
      expr = q.replace(/^(turunan2|turunan kedua)\s*/i, "").trim();
      expr = sisipKaliImplisit(expr);
      varName = deteksiVariabel(expr);
      cmd += "print(tampil(sp.diff(" + expr + ", " + varName + ", 2)))";
    }
    else if (lower.startsWith("turunan")) {
      expr = q.replace(/^turunan\s*/i, "").trim();
      expr = sisipKaliImplisit(expr);
      varName = deteksiVariabel(expr);
      cmd += "print(tampil(sp.diff(" + expr + ", " + varName + ")))";
    }
    else if (lower.startsWith("integral") && (q.indexOf(";") !== -1)) {
      var rest = q.replace(/^integral\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 4) { out.innerHTML = 'Format: integral <ekspresi>; x; a; b'; return; }
      expr = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var a = parts[2], b = parts[3];
      cmd += "print(tampil(sp.integrate(" + expr + ", (" + varName + ", " + a + ", " + b + "))))";
    }
    else if (lower.startsWith("integral")) {
      expr = q.replace(/^integral\s*/i, "").trim();
      expr = sisipKaliImplisit(expr);
      varName = deteksiVariabel(expr);
      cmd += "print(tampil(sp.integrate(" + expr + ", " + varName + ")))";
    }
    else if (lower.startsWith("faktorkan")) {
      expr = q.replace(/^faktorkan\s*/i, "").trim();
      expr = sisipKaliImplisit(expr);
      cmd += "print(tampil(sp.factor(" + expr + ")))";
    }
    else if (lower.startsWith("faktor")) {
      var num = q.replace(/^faktor\s*/i, "").trim();
      if (!/^-?\d+$/.test(num)) { out.innerHTML = 'Format: faktor <bilangan bulat>. Contoh: faktor 12'; return; }
      if (Math.abs(parseInt(num)) > 1e12) { out.innerHTML = 'Bilangan terlalu besar (maks 10^12)'; return; }
      cmd += "print(tampil(sp.factorint(" + num + ")))";
    }
    else if (lower.startsWith("jabarkan")) {
      expr = q.replace(/^jabarkan\s*/i, "").trim();
      expr = sisipKaliImplisit(expr);
      cmd += "print(tampil(sp.expand(" + expr + ")))";
    }
    else if (lower.startsWith("jumlah fungsi")) {
      var rest = q.replace(/^jumlah fungsi\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 2) { out.innerHTML = "Format: jumlah fungsi <f> ; <g> [; <h> ...]"; return; }
      var fungsiStr = parts.map(function(p) { return "sp.sympify('" + sisipKaliImplisit(p) + "')"; });
      cmd += "print(tampil(" + fungsiStr.join(" + ") + "))";
    }
    else if (lower.startsWith("kurang fungsi")) {
      var rest = q.replace(/^kurang fungsi\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 2) { out.innerHTML = "Format: kurang fungsi <f> ; <g> [; <h> ...]"; return; }
      var fungsiStr = parts.map(function(p) { return "sp.sympify('" + sisipKaliImplisit(p) + "')"; });
      cmd += "print(tampil(" + fungsiStr.join(" - ") + "))";
    }
    else if (lower.startsWith("kali fungsi")) {
      var rest = q.replace(/^kali fungsi\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 2) { out.innerHTML = "Format: kali fungsi <f> ; <g> [; <h> ...]"; return; }
      var fungsiStr = parts.map(function(p) { return "sp.sympify('" + sisipKaliImplisit(p) + "')"; });
      var expr = fungsiStr.join(" * ");
      cmd += "print(tampil_double(" + expr + "))";
    }
    else if (lower.startsWith("bagi fungsi")) {
      var rest = q.replace(/^bagi fungsi\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 2) { out.innerHTML = "Format: bagi fungsi <f> ; <g> [; <h> ...]"; return; }
      var fungsiStr = parts.map(function(p) { return "sp.sympify('" + sisipKaliImplisit(p) + "')"; });
      cmd += "print(tampil(" + fungsiStr.join(" / ") + "))";
    }
    else if (lower.startsWith("komposisi fungsi")) {
      var rest = q.replace(/^komposisi fungsi\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 2) { out.innerHTML = "Format: komposisi fungsi <f> ; <g> [; <h> ...]"; return; }
      var xVar = deteksiVariabel(parts.join(" "));
  // Mulai dari fungsi terakhir (paling kanan), substitusi ke kiri
      var hasil = "sp.sympify('" + sisipKaliImplisit(parts[parts.length - 1]) + "')";
      for (var i = parts.length - 2; i >= 0; i--) {
      var f = sisipKaliImplisit(parts[i]);
      hasil = "sp.sympify('" + f + "').subs(sp.Symbol('" + xVar + "'), " + hasil + ")";
      }
      cmd += "print(tampil_double(" + hasil + "))";
    }
    else if (lower.startsWith("komposisi balik")) {
      var rest = q.replace(/^komposisi balik\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 2) { out.innerHTML = "Format: komposisi balik <f> ; <g>"; return; }
      var f = sisipKaliImplisit(parts[0]);
      var g = sisipKaliImplisit(parts[1]);
      var xVar = deteksiVariabel(f + " " + g);
      cmd += "print(tampil_double(sp.sympify('" + g + "').subs(sp.Symbol('" + xVar + "'), sp.sympify('" + f + "'))))";
    }
    else if (lower.startsWith("sederhanakan")) {
      expr = q.replace(/^sederhanakan\s*/i, "").trim();
      expr = sisipKaliImplisit(expr);
      cmd += "print(tampil(sederhanakan_penuh(" + expr + ")))";
    }
    else if (lower.startsWith("barisan aritmetika")) {
      var parts = pisahArgumen(q.replace(/^barisan aritmetika\s*/i, ""));
      var a0 = parts[0], b0 = parts[1], n0 = parts[2];
      cmd += "print(tampil([(" + a0 + ") + (" + b0 + ")*i for i in range(int(" + n0 + "))]))";
    }
    else if (lower.startsWith("barisan geometri")) {
      var parts = pisahArgumen(q.replace(/^barisan geometri\s*/i, ""));
      var a0 = parts[0], r0 = parts[1], n0 = parts[2];
      cmd += "print(tampil([(" + a0 + ")*(" + r0 + ")**i for i in range(int(" + n0 + "))]))";
    }
    else if (lower.startsWith("barisan")) {
      var parts = pisahArgumen(q.replace(/^barisan\s*/i, ""));
      if (parts.length < 4) { out.innerHTML = 'Format: barisan <rumus>; n; a; b'; return; }
      expr = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var a = parts[2], b = parts[3];
      cmd += "print(tampil([sp.simplify((" + expr + ").subs(" + varName + ", i)) for i in range(" + a + ", " + b + "+1)]))";
    }
    else if (lower.startsWith("deret takhingga") || lower.startsWith("deret tak-hingga")) {
      var parts = pisahArgumen(q.replace(/^deret\s*(takhingga|tak-hingga)\s*/i, ""));
      if (parts.length < 2) { out.innerHTML = 'Format: deret takhingga <rumus>; n'; return; }
      expr = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      cmd += "print(tampil(sp.summation(" + expr + ", (" + varName + ", 1, sp.oo))))";
    }
    else if (lower.startsWith("deret aritmetika")) {
      var parts = pisahArgumen(q.replace(/^deret aritmetika\s*/i, ""));
      var a0 = parts[0], b0 = parts[1], n0 = parts[2];
      cmd += "print(tampil(sp.summation((" + a0 + ") + (" + b0 + ")*i, (i, 0, int(" + n0 + ")-1))))";
    }
    else if (lower.startsWith("deret geometri")) {
      var parts = pisahArgumen(q.replace(/^deret geometri\s*/i, ""));
      var a0 = parts[0], r0 = parts[1], n0 = parts[2];
      cmd += "print(tampil(sp.summation((" + a0 + ")*(" + r0 + ")**i, (i, 0, int(" + n0 + ")-1))))";
    }
    else if (lower.startsWith("deret")) {
      var parts = pisahArgumen(q.replace(/^deret\s*/i, ""));
      if (parts.length < 4) { out.innerHTML = 'Format: deret <rumus>; n; a; b'; return; }
      expr = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var a = parts[2], b = parts[3];
      cmd += "print(tampil(sp.summation(" + expr + ", (" + varName + ", " + a + ", " + b + "))))";
    }
    else if (lower.startsWith("suku")) {
      var parts = pisahArgumen(q.replace(/^suku\s*/i, ""));
      if (parts.length < 3) { out.innerHTML = 'Format: suku <rumus>; n; k'; return; }
      expr = sisipKaliImplisit(parts[0]);
      varName = parts[1];
      var k = parts[2];
      cmd += "print(tampil(sp.simplify((" + expr + ").subs(" + varName + ", " + k + "))))";
    }
    else if (lower.startsWith("determinan")) {
      var mat = q.replace(/^determinan\s*/i, "").trim();
      mat = mat.replace(/;/g, ',');
      cmd += "print(tampil(sp.Matrix(" + mat + ").det()))";
    }
    else if (lower.startsWith("matriks diagonal")) {
      var arr = q.replace(/^matriks diagonal\s*/i, "").trim();
      arr = arr.replace(/;/g, ',');
      arr = arr.replace(/\s+/g, '');
      cmd += "print(tampil(sp.diag(*" + arr + ")))";
    }
    else if (lower.startsWith("jumlah matriks")) {
      var rest = q.replace(/^jumlah matriks\s*/i, "").trim();
      var match = rest.match(/\[\[.*?\]\]/g);
      if (!match || match.length < 2) { out.innerHTML = "Format: jumlah matriks [[...]] + [[...]] [+ ...]"; return; }
      var matriksStr = match.map(function(m) { return "sp.Matrix(" + m.replace(/;/g, ',') + ")"; });
      cmd += "print(tampil(" + matriksStr.join(" + ") + "))";
    }
    else if (lower.startsWith("kurang matriks")) {
      var rest = q.replace(/^kurang matriks\s*/i, "").trim();
      var match = rest.match(/\[\[.*?\]\]/g);
      if (!match || match.length < 2) { out.innerHTML = "Format: kurang matriks [[...]] - [[...]] [- ...]"; return; }
      var matriksStr = match.map(function(m) { return "sp.Matrix(" + m.replace(/;/g, ',') + ")"; });
      cmd += "print(tampil(" + matriksStr.join(" - ") + "))";
    }
    else if (lower.startsWith("kali matriks")) {
      var rest = q.replace(/^kali matriks\s*/i, "").trim();
      var match = rest.match(/\[\[.*?\]\]/g);
      if (!match || match.length < 2) { out.innerHTML = "Format: kali matriks [[...]] * [[...]] [* ...]"; return; }
      var matriksStr = match.map(function(m) { return "sp.Matrix(" + m.replace(/;/g, ',') + ")"; });
      cmd += "print(tampil(" + matriksStr.join(" * ") + "))";
    }
    else if (lower.startsWith("invers matriks")) {
      var rest = q.replace(/^invers matriks\s*/i, "").trim();
      var match = rest.match(/\[\[.*?\]\]/g);
      if (!match || match.length < 1) { out.innerHTML = "Format: invers matriks [[a;b];[c;d]]"; return; }
      var A = match[0].replace(/;/g, ',');
      cmd += "print(tampil(sp.Matrix(" + A + ").inv()))";
    }
    else if (lower.startsWith("transpos matriks")) {
      var rest = q.replace(/^transpos matriks\s*/i, "").trim();
      var match = rest.match(/\[\[.*?\]\]/g);
      if (!match || match.length < 1) { out.innerHTML = "Format: transpos matriks [[a;b;c];[d;e;f]]"; return; }
      var A = match[0].replace(/;/g, ',');
      cmd += "print(tampil(sp.Matrix(" + A + ").T))";
    }
    else if (lower.startsWith("matriks gell-mann")) {
      var num = q.replace(/^matriks gell-mann\s*/i, "").trim();
      cmd += "print(tampil(matriks_gell_mann(" + num + ")))";
    }
    else if (lower.startsWith("distribusi beta")) {
      var rest = q.replace(/^distribusi beta\s*/i, "").trim();
      var parts = pisahArgumen(rest);
      if (parts.length < 3) { out.innerHTML = "Format: distribusi beta <x>; <alpha>; <beta>"; return; }
      var xVal = parseFloat(parts[0]), aVal = parseFloat(parts[1]), bVal = parseFloat(parts[2]);
      cmd += "from sympy.stats import Beta, density, cdf\n";
      cmd += "from sympy import Symbol, Rational\n";
      cmd += "X = Beta('X', " + aVal + ", " + bVal + ")\n";
      cmd += "x_sym = Symbol('x')\n";
      cmd += "pdf_val = density(X)(x_sym).subs(x_sym, " + xVal + ")\n";
      cmd += "cdf_val = cdf(X)(x_sym).subs(x_sym, " + xVal + ")\n";
      cmd += "print('PDF = ' + latex(N(pdf_val, 6)))\n";
      cmd += "print('CDF = ' + latex(N(cdf_val, 6)))";
    }
    else if (lower.startsWith("sinus hiperbolik")) {
      var e = q.replace(/^sinus hiperbolik\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.sinh(" + e + ")))";
    }
    else if (lower.startsWith("kosinus hiperbolik")) {
      var e = q.replace(/^kosinus hiperbolik\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.cosh(" + e + ")))";
    }
    else if (lower.startsWith("tangen hiperbolik")) {
      var e = q.replace(/^tangen hiperbolik\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.tanh(" + e + ")))";
    }
    else if (lower.startsWith("radian ke derajat")) {
      var e = q.replace(/^radian ke derajat\s*/i, "").trim();
      cmd += "print(tampil(sp.sympify('" + e + "', locals={'pi': sp.pi}) * 180 / sp.pi))";
    }
    else if (lower.startsWith("arcsinus")) {
      var e = q.replace(/^arcsinus\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.asin(" + e + ")))";
    }
    else if (lower.startsWith("arckosinus")) {
      var e = q.replace(/^arckosinus\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.acos(" + e + ")))";
    }
    else if (lower.startsWith("arcktangen")) {
      var e = q.replace(/^arcktangen\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.atan(" + e + ")))";
    }
    else if (lower.startsWith("sinus")) {
      var e = q.replace(/^sinus\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.sin(" + e + ")))";
    }
    else if (lower.startsWith("kosinus")) {
      var e = q.replace(/^kosinus\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.cos(" + e + ")))";
    }
    else if (lower.startsWith("tangen")) {
      var e = q.replace(/^tangen\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(sp.tan(" + e + ")))";
    }
    else if (lower.startsWith("kosekan")) {
      var e = q.replace(/^kosekan\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(1/sp.sin(" + e + ")))";
    }
    else if (lower.startsWith("sekan")) {
      var e = q.replace(/^sekan\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(1/sp.cos(" + e + ")))";
    }
    else if (lower.startsWith("kotangen")) {
      var e = q.replace(/^kotangen\s*/i, "").trim();
      e = sisipKaliImplisit(e);
      cmd += "print(tampil(1/sp.tan(" + e + ")))";
    }
    else if (lower.startsWith("kombinasi")) {
      var parts = pisahArgumen(q.replace(/^kombinasi\s*/i, ""));
      cmd += "print(tampil(sp.binomial(" + parts[0] + ", " + parts[1] + ")))";
    }
    else {
      expr = sisipKaliImplisit(q);
      cmd += "print(tampil(" + expr + "))";
    }
  } catch (parseErr) {
    out.innerHTML = '<span style="color:#ea4335">Kesalahan parsing: ' + escapeHtml(parseErr.message) + '</span>';
    return;
  }

  var res = "";
  py.setStdout({ batched: function(t) { res += t + "\n"; } });

  var timeoutId = setTimeout(function() {
    out.innerHTML = '<span style="color:#ea4335">⏱️ Perhitungan terlalu lama (melebihi 20 detik). Coba ekspresi yang lebih sederhana.</span>';
  }, 20000);

  py.runPythonAsync(cmd).then(function() {
    clearTimeout(timeoutId);
    var hasil = res.trim() || "";
    if (!hasil) { out.innerHTML = '<em>(tidak ada output)</em>'; return; }

    var latex = hasil;
    if (hasil.indexOf("B64:") === 0) {
      try {
        var b64 = hasil.substring(4);
        var binary = atob(b64);
        var bytes = new Uint8Array(binary.length);
        for (var bi = 0; bi < binary.length; bi++) {
          bytes[bi] = binary.charCodeAt(bi);
        }
        latex = new TextDecoder('utf-8').decode(bytes);
      } catch(e) {
        latex = "\\text{Gagal decode output}";
      }
    }

    var cobaRender = function(percobaan) {
      if (window.katex) {
        try {
          out.innerHTML = katex.renderToString(latex, {
            throwOnError: false,
            displayMode: true
          });
        } catch(e) {
          out.innerHTML = '<pre style="white-space:pre-wrap; word-break:break-word;">' + escapeHtml(latex) + '</pre>';
        }
      } else if (percobaan < 25) {
        setTimeout(function() { cobaRender(percobaan + 1); }, 200);
      } else {
        out.innerHTML = '<pre style="white-space:pre-wrap; word-break:break-word;">' + escapeHtml(latex) + '</pre>';
      }
    };
    cobaRender(0);
    // Setelah render, tambahkan visual otomatis
    setTimeout(function() {
      tambahVisualOtomatis(inputAsli || q, out);
    }, 100);
  }).catch(function(e) {
    clearTimeout(timeoutId);
    out.innerHTML = '<span style="color:#ea4335">Kesalahan: ' + escapeHtml(e.message) + '</span>\n\n' +
      '<small style="color:#666">Kode: <code>' + escapeHtml(cmd) + '</code></small>';
  });
}

/* ========================================================
   FUNGSI UTAMA (kmJalankan)
   Entry point yang dipanggil dari tombol "Hitung".
   ======================================================== */
window.kmJalankan = function() {
  var q = document.getElementById('km-input').value.trim();
  var out = document.getElementById('km-output');

  if (!q) { out.innerHTML = "Ketik perintah dulu!"; return; }

  // Konversi koma desimal ke titik (input Indonesia)
  q = konversiKomaDesimal(q);

  // Simpan input asli untuk ekstrak ekspresi
  var inputAsli = q;

  // Tier 1: Vanilla JS (instan)
  if (jalankanTier1(q, out)) {
    tambahVisualOtomatis(inputAsli, out);
    return;
  }

  // Tier 1: Statistik (instan)
  if (typeof jalankanStatistik === 'function' && jalankanStatistik(q, out)) {
    tambahVisualOtomatis(inputAsli, out);
    return;
  }

  // Tier 2: Pyodide (simbolik)
  if (!siap) {
    out.innerHTML = '<em>Memuat mesin matematika.. Mohon tunggu.</em>';
    muatPyodide().then(function() {
      jalankanPerintah(q, out, inputAsli);
    }).catch(function(err) {
      out.innerHTML = '<span style="color:#ea4335">Gagal memuat: ' + escapeHtml(err.message) + '</span>';
    });
    return;
  }
  jalankanPerintah(q, out, inputAsli);
};

/* ========================================================
   VISUAL OTOMATIS
   Menambahkan grafik otomatis untuk perintah tertentu.
   ======================================================== */

function tambahVisualOtomatis(q, out) {
  var lower = q.toLowerCase();

  var perintahVisual = [
    "sinus", "kosinus", "tangen", "kosekan", "sekan", "kotangen",
    "arcsinus", "arckosinus", "arcktangen",
    "sinus hiperbolik", "kosinus hiperbolik", "tangen hiperbolik",
    "integral", "turunan", "turunan2", "turunan kedua",
    "limit",
    "sederhanakan", "faktorkan", "jabarkan",
    "pecahkan",
    "jumlah fungsi", "kurang fungsi", "kali fungsi", "bagi fungsi",
    "komposisi fungsi", "komposisi balik"
  ];

  var layak = false;
  for (var i = 0; i < perintahVisual.length; i++) {
    if (lower.startsWith(perintahVisual[i])) {
      layak = true;
      break;
    }
  }
  if (!layak) return;

  var dataPlot = ekstrakEkspresi(q);
  if (!dataPlot || dataPlot.length === 0) return;

  if (typeof functionPlot === 'undefined') return;

  // Buat container grafik
  var plotDiv = document.createElement('div');
  plotDiv.id = 'km-plot';
  plotDiv.style = 'width:100%; height:400px; margin-top:15px; border:1px solid #e0e0e0; border-radius:6px 6px 0 0; background:#fff;';
  out.appendChild(plotDiv);

  // Buat container legend
  var legendDiv = document.createElement('div');
  legendDiv.style = 'width:100%; padding:10px 15px; background:#f8f9fa; border:1px solid #e0e0e0; border-top:none; border-radius:0 0 6px 6px; font-size:13px; display:flex; flex-wrap:wrap; gap:15px;';
  
  var legendHTML = '';
  dataPlot.forEach(function(d) {
    legendHTML += '<span style="display:inline-flex; align-items:center; gap:6px;">' +
                  '<span style="display:inline-block; width:20px; height:3px; background:' + d.color + '; border-radius:2px;"></span>' +
                  '<span style="color:#333; font-family:Consolas, monospace;">' + (d.title || d.fn) + '</span>' +
                  '</span>';
  });
  legendDiv.innerHTML = legendHTML;
  out.appendChild(legendDiv);

  // Domain default
  var domainX = [-10, 10];
  var domainY = [-10, 10];

  var lebar = out.clientWidth > 100 ? out.clientWidth - 42 : 600;
  var tinggi = 400;

  try {
    functionPlot({
      target: '#km-plot',
      width: lebar,
      height: tinggi,
      grid: true,
      xAxis: { domain: domainX },
      yAxis: { domain: domainY },
      data: dataPlot.map(function(d) {
        return {
          fn: d.fn,
          color: d.color,
          graphType: 'polyline'
        };
      })
    });
  } catch (e) {
    console.error('Gagal render grafik:', e);
    plotDiv.innerHTML = '<div style="padding:10px; color:#666; font-size:13px;">Grafik tidak dapat ditampilkan: ' + e.message + '</div>';
  }
}
/* ========================================================
   TENTUKAN DOMAIN
   ======================================================== */

function tentukanDomain(ekspresi) {
  // Default domain
  var domain = [-10, 10];

  // Deteksi fungsi trigonometri → domain [-2π, 2π]
  if (/\b(sin|cos|tan|cot|sec|csc|sinh|cosh|tanh)\b/.test(ekspresi)) {
    domain = [-6.28, 6.28];
  }
  // Deteksi logaritma → domain [0.1, 10]
  else if (/\blog\b|\bln\b/.test(ekspresi)) {
    domain = [0.1, 10];
  }
  // Deteksi akar → domain [0, 10]
  else if (/\bsqrt\b/.test(ekspresi)) {
    domain = [0, 10];
  }
  // Deteksi eksponensial → domain [-3, 3]
  else if (/\bexp\b/.test(ekspresi)) {
    domain = [-3, 3];
  }
  // Deteksi polinomial pangkat tinggi → domain [-5, 5]
  else if (/\^[3-9]/.test(ekspresi)) {
    domain = [-5, 5];
  }

  return domain;
}

function tentukanDomainY(ekspresi, domainX) {
  // Domain default Y = X (1:1)
  var domainY = [domainX[0], domainX[1]];

  // Deteksi fungsi trigonometri → Y = [-2, 2]
  if (/\b(sin|cos)\b/.test(ekspresi)) {
    domainY = [-2, 2];
  } else if (/\btan\b/.test(ekspresi)) {
    domainY = [-10, 10];
  } else if (/\b(sinh|cosh|tanh)\b/.test(ekspresi)) {
    domainY = [-5, 5];
  }
  // Deteksi logaritma → Y = [-5, 5]
  else if (/\blog\b|\bln\b/.test(ekspresi)) {
    domainY = [-5, 5];
  }
  // Deteksi akar → Y = [-1, 5]
  else if (/\bsqrt\b/.test(ekspresi)) {
    domainY = [-1, 5];
  }
  // Deteksi eksponensial → Y = [-1, 20]
  else if (/\bexp\b/.test(ekspresi)) {
    domainY = [-1, 20];
  }
  // Deteksi polinomial pangkat tinggi → Y = [-100, 100]
  else if (/\^[3-9]/.test(ekspresi)) {
    domainY = [-100, 100];
  }
  // Deteksi pecahan → Y = [-10, 10]
  else if (/\//.test(ekspresi)) {
    domainY = [-10, 10];
  }

  return domainY;
}

function tentukanAspectRatio(ekspresi) {
  // Aspect ratio default 1:1
  var ratio = 1;

  // Trigonometri → 1:3 (lebar 3× tinggi)
  if (/\b(sin|cos)\b/.test(ekspresi)) {
    ratio = 3;
  } else if (/\btan\b/.test(ekspresi)) {
    ratio = 1;
  }
  // Logaritma → 1:1
  else if (/\blog\b|\bln\b/.test(ekspresi)) {
    ratio = 1;
  }
  // Eksponensial → 1:1
  else if (/\bexp\b/.test(ekspresi)) {
    ratio = 1;
  }
  // Polinomial pangkat tinggi → 1:1
  else if (/\^[3-9]/.test(ekspresi)) {
    ratio = 1;
  }

  return ratio;
}

function ekstrakEkspresi(q) {
  var lower = q.toLowerCase();
  var hasil = [];  // Array of { fn, title, color }

  // Trigonometri — hanya output
if (lower.startsWith("sinus")) {
  var e = q.replace(/^sinus\s*/i, "").trim();
  // Cek apakah e mengandung variabel (bukan pi)
  var eTanpaPi = e.replace(/\bpi\b/gi, "");
  if (!/[a-zA-Z]/.test(eTanpaPi)) {
    // Konstanta (pi/6, 30, dll.) → gambar sin(x)
    hasil.push({ fn: 'sin(x)', title: 'sin(x)', color: '#1a73e8' });
  } else {
    // Ada variabel → gambar sin(e)
    hasil.push({ fn: 'sin(' + sisipKaliImplisit(e) + ')', title: 'sin(' + e + ')', color: '#1a73e8' });
  }
} else if (lower.startsWith("kosinus")) {
  var e = q.replace(/^kosinus\s*/i, "").trim();
  var eTanpaPi = e.replace(/\bpi\b/gi, "");
  if (!/[a-zA-Z]/.test(eTanpaPi)) {
    hasil.push({ fn: 'cos(x)', title: 'cos(x)', color: '#1a73e8' });
  } else {
    hasil.push({ fn: 'cos(' + sisipKaliImplisit(e) + ')', title: 'cos(' + e + ')', color: '#1a73e8' });
  }
} else if (lower.startsWith("tangen")) {
  var e = q.replace(/^tangen\s*/i, "").trim();
  var eTanpaPi = e.replace(/\bpi\b/gi, "");
  if (!/[a-zA-Z]/.test(eTanpaPi)) {
    hasil.push({ fn: 'tan(x)', title: 'tan(x)', color: '#1a73e8' });
  } else {
    hasil.push({ fn: 'tan(' + sisipKaliImplisit(e) + ')', title: 'tan(' + e + ')', color: '#1a73e8' });
  }
}
  // Kalkulus — hanya output
  else if (lower.startsWith("integral")) {
    var rest = q.replace(/^integral\s*/i, "").trim();
    var ekspresiPart = rest.split(";")[0].trim();
    hasil.push({ fn: sisipKaliImplisit(ekspresiPart), title: ekspresiPart, color: '#1a73e8' });
  } else if (lower.startsWith("turunan2") || lower.startsWith("turunan kedua")) {
    var rest = q.replace(/^(turunan2|turunan kedua)\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  } else if (lower.startsWith("turunan")) {
    var rest = q.replace(/^turunan\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  }
  // Aljabar — hanya output
  else if (lower.startsWith("sederhanakan")) {
    var rest = q.replace(/^sederhanakan\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  } else if (lower.startsWith("faktorkan")) {
    var rest = q.replace(/^faktorkan\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  }
  // Operasi fungsi — gambar input + output
  else if (lower.startsWith("jumlah fungsi")) {
    var rest = q.replace(/^jumlah fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var ekspresi = "(" + sisipKaliImplisit(parts[0]) + ")+(" + sisipKaliImplisit(parts[1]) + ")";
      for (var i = 2; i < parts.length; i++) {
        ekspresi += "+(" + sisipKaliImplisit(parts[i]) + ")";
      }
      // Input
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      // Output
      hasil.push({ fn: ekspresi, title: '(f₁+...)(x)', color: '#1a73e8' });
    }
  } else if (lower.startsWith("kurang fungsi")) {
    var rest = q.replace(/^kurang fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var ekspresi = "(" + sisipKaliImplisit(parts[0]) + ")-(" + sisipKaliImplisit(parts[1]) + ")";
      for (var i = 2; i < parts.length; i++) {
        ekspresi += "-(" + sisipKaliImplisit(parts[i]) + ")";
      }
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      hasil.push({ fn: ekspresi, title: '(f₁-...)(x)', color: '#1a73e8' });
    }
  } else if (lower.startsWith("kali fungsi")) {
    var rest = q.replace(/^kali fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var ekspresi = "(" + sisipKaliImplisit(parts[0]) + ")*(" + sisipKaliImplisit(parts[1]) + ")";
      for (var i = 2; i < parts.length; i++) {
        ekspresi += "*(" + sisipKaliImplisit(parts[i]) + ")";
      }
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      hasil.push({ fn: ekspresi, title: '(f₁×...)(x)', color: '#1a73e8' });
    }
  } else if (lower.startsWith("bagi fungsi")) {
    var rest = q.replace(/^bagi fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var ekspresi = "(" + sisipKaliImplisit(parts[0]) + ")/(" + sisipKaliImplisit(parts[1]) + ")";
      for (var i = 2; i < parts.length; i++) {
        ekspresi += "/(" + sisipKaliImplisit(parts[i]) + ")";
      }
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      hasil.push({ fn: ekspresi, title: '(f₁÷...)(x)', color: '#1a73e8' });
    }
  } else if (lower.startsWith("komposisi fungsi")) {
    var rest = q.replace(/^komposisi fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var xVar = deteksiVariabel(parts.join(" "));
      // Hitung output
      var output = sisipKaliImplisit(parts[parts.length - 1]);
      for (var i = parts.length - 2; i >= 0; i--) {
        var f = sisipKaliImplisit(parts[i]);
        output = f.replace(new RegExp("\\b" + xVar + "\\b", "g"), "(" + output + ")");
      }
      // Gambar input
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      // Gambar output
      hasil.push({ fn: output, title: '(f₁∘...∘fₙ)(x)', color: '#1a73e8' });
    }
  } else if (lower.startsWith("komposisi balik")) {
    var rest = q.replace(/^komposisi balik\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var xVar = deteksiVariabel(parts.join(" "));
      var f = sisipKaliImplisit(parts[0]);
      var g = sisipKaliImplisit(parts[1]);
      var output = g.replace(new RegExp("\\b" + xVar + "\\b", "g"), "(" + f + ")");
      // Gambar input
      hasil.push({ fn: f, title: 'f(x) = ' + parts[0], color: '#ea4335' });
      hasil.push({ fn: g, title: 'g(x) = ' + parts[1], color: '#34a853' });
      // Gambar output
      hasil.push({ fn: output, title: '(g∘f)(x)', color: '#1a73e8' });
    }
  }
  // Pecahkan — hanya output (persamaan = 0)
  else if (lower.startsWith("pecahkan")) {
    var rest = q.replace(/^pecahkan\s*/i, "").trim();
    var pers = rest.split(";")[0].trim();
    if (pers.indexOf("=") !== -1) {
      var parts = pers.split("=");
      var ekspresi = "(" + sisipKaliImplisit(parts[0]) + ")-(" + sisipKaliImplisit(parts[1]) + ")";
      hasil.push({ fn: ekspresi, title: pers, color: '#1a73e8' });
    }
  }

  // Bersihkan ekspresi untuk Function Plot
  for (var i = 0; i < hasil.length; i++) {
    hasil[i].fn = hasil[i].fn.replace(/\*\*/g, "^");
    hasil[i].fn = hasil[i].fn.replace(/\bE\^/g, "exp(");
    hasil[i].fn = hasil[i].fn.replace(/\bpi\b/gi, "PI");
    hasil[i].fn = hasil[i].fn.replace(/\boo\b/g, "Infinity");
  }

  return hasil.length > 0 ? hasil : null;
}

function tentukanDomain(ekspresi) {
  // Default domain
  var domain = [-10, 10];

  // Deteksi fungsi trigonometri → domain [-2π, 2π]
  if (/\b(sin|cos|tan|cot|sec|csc|sinh|cosh|tanh)\b/.test(ekspresi)) {
    domain = [-6.28, 6.28];
  }
  // Deteksi logaritma → domain [0.1, 10]
  else if (/\blog\b|\bln\b/.test(ekspresi)) {
    domain = [0.1, 10];
  }
  // Deteksi akar → domain [0, 10]
  else if (/\bsqrt\b/.test(ekspresi)) {
    domain = [0, 10];
  }
  // Deteksi eksponensial → domain [-3, 3]
  else if (/\bexp\b/.test(ekspresi)) {
    domain = [-3, 3];
  }
  // Deteksi polinomial pangkat tinggi → domain [-5, 5]
  else if (/\^[3-9]/.test(ekspresi)) {
    domain = [-5, 5];
  }

  return domain;
}