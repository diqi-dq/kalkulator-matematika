/* ========================================================
   VISUAL OTOMATIS
   Menambahkan grafik otomatis untuk perintah tertentu.
   Bergantung pada:
   - kalkulator.js (fungsi bantu: sisipKaliImplisit, deteksiVariabel, pisahArgumen)
   - function-plot (library eksternal)
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

  var plotDiv = document.createElement('div');
  plotDiv.id = 'km-plot';
  plotDiv.style = 'width:100%; height:400px; margin-top:15px; border:1px solid #e0e0e0; border-radius:6px 6px 0 0; background:#fff;';
  out.appendChild(plotDiv);

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

  var lebar = out.clientWidth > 100 ? out.clientWidth - 42 : 600;
  var tinggi = 400;

  try {
    functionPlot({
      target: '#km-plot',
      width: lebar,
      height: tinggi,
      grid: true,
      xAxis: { domain: [-10, 10] },
      yAxis: { domain: [-10, 10] },
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

function ekstrakEkspresi(q) {
  var lower = q.toLowerCase();
  var hasil = [];

  // Hiperbolik DULU
  if (lower.startsWith("sinus hiperbolik")) {
    var e = q.replace(/^sinus hiperbolik\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'sinh(x)', title: 'sinh(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'sinh(' + sisipKaliImplisit(e) + ')', title: 'sinh(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("kosinus hiperbolik")) {
    var e = q.replace(/^kosinus hiperbolik\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'cosh(x)', title: 'cosh(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'cosh(' + sisipKaliImplisit(e) + ')', title: 'cosh(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("tangen hiperbolik")) {
    var e = q.replace(/^tangen hiperbolik\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'tanh(x)', title: 'tanh(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'tanh(' + sisipKaliImplisit(e) + ')', title: 'tanh(' + e + ')', color: '#1a73e8' });
    }
  }
  // Arc DULU
  else if (lower.startsWith("arcsinus")) {
    var e = q.replace(/^arcsinus\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'asin(x)', title: 'arcsin(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'asin(' + sisipKaliImplisit(e) + ')', title: 'arcsin(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("arckosinus")) {
    var e = q.replace(/^arckosinus\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'acos(x)', title: 'arccos(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'acos(' + sisipKaliImplisit(e) + ')', title: 'arccos(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("arcktangen")) {
    var e = q.replace(/^arcktangen\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'atan(x)', title: 'arctan(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'atan(' + sisipKaliImplisit(e) + ')', title: 'arctan(' + e + ')', color: '#1a73e8' });
    }
  }
  // Trigonometri biasa
  else if (lower.startsWith("sinus")) {
    var e = q.replace(/^sinus\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'sin(x)', title: 'sin(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'sin(' + sisipKaliImplisit(e) + ')', title: 'sin(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("kosinus")) {
    var e = q.replace(/^kosinus\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'cos(x)', title: 'cos(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'cos(' + sisipKaliImplisit(e) + ')', title: 'cos(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("tangen")) {
    var e = q.replace(/^tangen\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: 'tan(x)', title: 'tan(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: 'tan(' + sisipKaliImplisit(e) + ')', title: 'tan(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("kosekan")) {
    var e = q.replace(/^kosekan\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: '1/sin(x)', title: 'csc(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: '1/sin(' + sisipKaliImplisit(e) + ')', title: 'csc(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("sekan")) {
    var e = q.replace(/^sekan\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: '1/cos(x)', title: 'sec(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: '1/cos(' + sisipKaliImplisit(e) + ')', title: 'sec(' + e + ')', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("kotangen")) {
    var e = q.replace(/^kotangen\s*/i, "").trim();
    var eTanpaPi = e.replace(/\bpi\b/gi, "");
    if (!/[a-zA-Z]/.test(eTanpaPi)) {
      hasil.push({ fn: '1/tan(x)', title: 'cot(x)', color: '#1a73e8' });
    } else {
      hasil.push({ fn: '1/tan(' + sisipKaliImplisit(e) + ')', title: 'cot(' + e + ')', color: '#1a73e8' });
    }
  }
  // Kalkulus
  else if (lower.startsWith("integral")) {
    var rest = q.replace(/^integral\s*/i, "").trim();
    var ekspresiPart = rest.split(";")[0].trim();
    hasil.push({ fn: sisipKaliImplisit(ekspresiPart), title: ekspresiPart, color: '#1a73e8' });
  }
  else if (lower.startsWith("turunan2") || lower.startsWith("turunan kedua")) {
    var rest = q.replace(/^(turunan2|turunan kedua)\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  }
  else if (lower.startsWith("turunan")) {
    var rest = q.replace(/^turunan\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  }
  // Aljabar
  else if (lower.startsWith("sederhanakan")) {
    var rest = q.replace(/^sederhanakan\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  }
  else if (lower.startsWith("faktorkan")) {
    var rest = q.replace(/^faktorkan\s*/i, "").trim();
    hasil.push({ fn: sisipKaliImplisit(rest), title: rest, color: '#1a73e8' });
  }
  // Operasi fungsi
  else if (lower.startsWith("jumlah fungsi")) {
    var rest = q.replace(/^jumlah fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var ekspresi = "(" + sisipKaliImplisit(parts[0]) + ")+(" + sisipKaliImplisit(parts[1]) + ")";
      for (var i = 2; i < parts.length; i++) {
        ekspresi += "+(" + sisipKaliImplisit(parts[i]) + ")";
      }
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      hasil.push({ fn: ekspresi, title: '(f₁+...)(x)', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("kurang fungsi")) {
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
  }
  else if (lower.startsWith("kali fungsi")) {
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
  }
  else if (lower.startsWith("bagi fungsi")) {
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
  }
  else if (lower.startsWith("komposisi fungsi")) {
    var rest = q.replace(/^komposisi fungsi\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var xVar = deteksiVariabel(parts.join(" "));
      var output = sisipKaliImplisit(parts[parts.length - 1]);
      for (var i = parts.length - 2; i >= 0; i--) {
        var f = sisipKaliImplisit(parts[i]);
        output = f.replace(new RegExp("\\b" + xVar + "\\b", "g"), "(" + output + ")");
      }
      for (var i = 0; i < parts.length; i++) {
        hasil.push({
          fn: sisipKaliImplisit(parts[i]),
          title: 'f' + (i + 1) + '(x) = ' + parts[i],
          color: ['#ea4335', '#34a853', '#fbbc04'][i % 3]
        });
      }
      hasil.push({ fn: output, title: '(f₁∘...∘fₙ)(x)', color: '#1a73e8' });
    }
  }
  else if (lower.startsWith("komposisi balik")) {
    var rest = q.replace(/^komposisi balik\s*/i, "").trim();
    var parts = pisahArgumen(rest);
    if (parts.length >= 2) {
      var xVar = deteksiVariabel(parts.join(" "));
      var f = sisipKaliImplisit(parts[0]);
      var g = sisipKaliImplisit(parts[1]);
      var output = g.replace(new RegExp("\\b" + xVar + "\\b", "g"), "(" + f + ")");
      hasil.push({ fn: f, title: 'f(x) = ' + parts[0], color: '#ea4335' });
      hasil.push({ fn: g, title: 'g(x) = ' + parts[1], color: '#34a853' });
      hasil.push({ fn: output, title: '(g∘f)(x)', color: '#1a73e8' });
    }
  }
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
    hasil[i].fn = hasil[i].fn.replace(/\bpi\b/gi, String(Math.PI));
    hasil[i].fn = hasil[i].fn.replace(/\boo\b/g, "1e10");
  }

  return hasil.length > 0 ? hasil : null;
}