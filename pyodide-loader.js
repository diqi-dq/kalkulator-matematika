/* ========================================================
   PYODIDE LOADER - VERSI LENGKAP & STABIL
   ======================================================== */

var py = null;
var siap = false;
var sedangMemuat = false;
var _pyodidePromise = null;

function muatPyodide() {
  if (siap && py) {
    return Promise.resolve();
  }

  if (_pyodidePromise) {
    return _pyodidePromise;
  }

  _pyodidePromise = new Promise(function(resolve, reject) {
    var statusEl = document.getElementById('km-status');

    function setStatus(teks, warna) {
      if (statusEl) {
        statusEl.innerText = teks;
        if (warna) statusEl.style.color = warna;
      }
    }

    sedangMemuat = true;
    setStatus("Memuat mesin matematika...", "#e67e22");

    var s = document.createElement('script');
    s.src = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js";

    s.onload = function() {
      setStatus("Menginisialisasi Python...");

      window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/"
      }).then(function(p) {
        py = p;
        setStatus("Memuat SymPy...");
        return p.loadPackage(["sympy"]);

      }).then(function() {
        setStatus("Menyiapkan fungsi...");

        return py.runPythonAsync(`
import sympy as sp
import base64
from sympy import symbols, integrate, diff, solve, factor, expand, simplify, latex, Matrix, oo, sin, cos, tan, cot, sec, csc, asin, acos, atan, sinh, cosh, tanh, exp, log, sqrt, pi, Eq, N, summation, Abs, binomial, factorial
from sympy import solveset, S, Interval, Union, Intersection, FiniteSet, EmptySet
from sympy import Function, Symbol, denom, together
from sympy.calculus.util import continuous_domain

x, y, z, t, n, m, k, i = symbols('x y z t n m k i')

BS = chr(92)

def sederhanakan_penuh(expr):
    try:
        bentuk_simplify = sp.simplify(expr)
        bentuk_factor = sp.factor(expr)
        def hitung_operasi(e):
            try:
                return sp.count_ops(e)
            except Exception:
                return 9999
        terbaik = bentuk_simplify
        min_ops = hitung_operasi(bentuk_simplify)
        ops_factor = hitung_operasi(bentuk_factor)
        if ops_factor < min_ops:
            terbaik = bentuk_factor
            min_ops = ops_factor
        return terbaik
    except Exception:
        try:
            return sp.simplify(expr)
        except Exception:
            return expr

def ganti_titik_koma(s):
    hasil = []
    for i, c in enumerate(s):
        if c == '.':
            if i > 0 and i < len(s) - 1 and s[i-1].isdigit() and s[i+1].isdigit():
                hasil.append(',')
            else:
                hasil.append(c)
        else:
            hasil.append(c)
    return ''.join(hasil)

def tampil_matriks(M):
    try:
        n_baris = M.rows
        n_kolom = M.cols
        baris = []
        for i in range(n_baris):
            sel = []
            for j in range(n_kolom):
                sel.append(latex(M[i, j]))
            baris.append(" & ".join(sel))
        pemisah_baris = " " + BS + BS + " "
        isi = pemisah_baris.join(baris)
        return BS + "begin{bmatrix} " + isi + " " + BS + "end{bmatrix}"
    except Exception:
        return latex(M)

def tampil(expr):
    try:
        from sympy import Set, Interval, Union, Intersection, FiniteSet, EmptySet, Matrix

        # Matrix
        if isinstance(expr, Matrix):
            return tampil_matriks(expr)

        # Set/Interval
        if isinstance(expr, (Set, Interval, Union, Intersection, FiniteSet, EmptySet)):
            return ganti_titik_koma(latex(expr))

        # Simbolik (ada variabel)
        if hasattr(expr, 'free_symbols') and len(expr.free_symbols) > 0:
            return latex(expr)

        # Eksak
        eksak = latex(expr)

        # Integer/Rational → return eksak
        if getattr(expr, 'is_Integer', False) or getattr(expr, 'is_Rational', False):
            return eksak

        # ✅ FIX: Float → langsung konversi
        if getattr(expr, 'is_Float', False):
            return eksak.replace('.', ',')

        # ✅ FIX: Selain itu → coba desimal
        try:
            desimal = N(expr, 10)
            desimal_latex = latex(desimal).replace('.', ',')
            if desimal_latex != eksak:
                return eksak + " " + BS + "approx " + desimal_latex
            return eksak
        except Exception:
            return eksak

    except Exception:
        try:
            return latex(expr)
        except Exception:
            return str(expr)

def tampil_double(expr):
    try:
        asli = latex(expr)
        expanded = sp.expand(expr)
        exp_latex = latex(expanded)
        if asli == exp_latex:
            return asli
        return asli + " = " + exp_latex
    except Exception:
        try:
            return latex(expr)
        except Exception:
            return str(expr)

def tampil_deret(expr):
    try:
        hasil = latex(expr)
        return ganti_titik_koma(hasil)
    except Exception:
        return str(expr)

def analisis_kekontinuan(expr, var):
    try:
        expr = sp.together(expr)
        sing_list = []

        try:
            d = denom(expr)
            if d != 1:
                sol = solveset(d, var, domain=S.Reals)
                if sol is S.EmptySet:
                    sing_list = []
                elif isinstance(sol, sp.FiniteSet):
                    sing_list = list(sol)
                else:
                    sing_list = [sol]
        except Exception:
            pass

        dom_latex = None
        try:
            dom = continuous_domain(expr, var, S.Reals)
            dom_latex = latex(dom)
        except Exception:
            dom_latex = None

        if dom_latex is None or dom_latex == BS + "mathbb{R}":
            if len(sing_list) == 0:
                dom_latex = BS + "mathbb{R}"
            else:
                if len(sing_list) == 1 and not isinstance(sing_list[0], sp.FiniteSet):
                    dom_latex = BS + "mathbb{R} " + BS + "setminus " + BS + "{" + latex(sing_list[0]) + BS + "}"
                else:
                    dom_latex = BS + "mathbb{R} " + BS + "setminus " + BS + "{" + ", ".join([latex(s) for s in sing_list]) + BS + "}"

        if len(sing_list) == 0:
            kontinu_R = BS + "text{kontinu di } " + BS + "mathbb{R}"
        else:
            kontinu_R = BS + "text{TIDAK kontinu di } " + BS + "mathbb{R}"

        if len(sing_list) == 0:
            sing_latex = BS + "text{tidak ada}"
        elif len(sing_list) == 1 and not isinstance(sing_list[0], sp.FiniteSet):
            sing_latex = latex(sing_list[0])
        else:
            sing_latex = ", ".join([latex(s) for s in sing_list])

        baris = []
        baris.append(BS + "textbf{Analisis Kekontinuan}")
        baris.append(BS + "text{Fungsi: } y = " + latex(expr))
        baris.append(BS + "textbf{Status Kekontinuan:}")
        baris.append(BS + "bullet" + BS + "; " + kontinu_R)
        baris.append(BS + "textbf{Titik Diskontinu:}")

        if len(sing_list) == 0:
            baris.append(BS + "text{Tidak ada titik diskontinu.}")
        else:
            baris.append(sing_latex)

        baris.append(BS + "textbf{Domain:}")
        baris.append(dom_latex)

        hasil_latex = BS + "begin{gathered} " + (" " + BS + BS + " ").join(baris) + " " + BS + "end{gathered}"
        return "B64:" + base64.b64encode(hasil_latex.encode('utf-8')).decode('ascii')

    except Exception as e:
        pesan = BS + "text{Gagal menganalisis: " + str(e).replace("_", BS + "_") + "}"
        return "B64:" + base64.b64encode(pesan.encode('utf-8')).decode('ascii')

def tabel_nilai(expr, var, a, b, langkah=1):
    try:
        a = float(N(sp.sympify(a)))
        b = float(N(sp.sympify(b)))
        langkah = float(N(sp.sympify(langkah)))
    except Exception:
        raise ValueError("Nilai a, b, atau langkah tidak valid")
    if langkah <= 0:
        langkah = 1
    hasil = []
    x_val = a
    max_iter = 1000
    iter_count = 0
    while x_val <= b + 1e-9 and iter_count < max_iter:
        try:
            nilai = expr.subs(var, x_val)
            nilai_simplified = sp.simplify(nilai)
            hasil.append((x_val, nilai_simplified))
        except Exception:
            hasil.append((x_val, "Error"))
        x_val = round(x_val + langkah, 10)
        iter_count += 1
    return hasil

def tabel_nilai_desimal(expr, var, a, b, langkah=1):
    try:
        a = float(N(sp.sympify(a)))
        b = float(N(sp.sympify(b)))
        langkah = float(N(sp.sympify(langkah)))
    except Exception:
        raise ValueError("Nilai a, b, atau langkah tidak valid")
    if langkah <= 0:
        langkah = 1
    hasil = []
    x_val = a
    max_iter = 1000
    iter_count = 0
    while x_val <= b + 1e-9 and iter_count < max_iter:
        try:
            nilai = expr.subs(var, x_val)
            nilai_desimal = N(nilai, 6)
            hasil.append((x_val, nilai_desimal))
        except Exception:
            hasil.append((x_val, "Error"))
        x_val = round(x_val + langkah, 10)
        iter_count += 1
    return hasil

def tampil_tabel(data, var_name="x"):
    try:
        baris = []
        for x_val, y_val in data:
            x_str = str(x_val)
            if x_str.endswith('.0'):
                x_str = x_str[:-2]
            x_str = ganti_titik_koma(x_str)
            try:
                y_latex = latex(y_val)
                y_latex = ganti_titik_koma(y_latex)
            except Exception:
                y_latex = str(y_val)
            baris.append(x_str + " & " + y_latex)
        header = BS + "text{" + var_name + "} & " + BS + "text{f(" + var_name + ")}"
        isi = (" " + BS + BS + " ").join(baris)
        return BS + "begin{array}{cc} " + header + " " + BS + BS + " " + BS + "hline " + isi + " " + BS + "end{array}"
    except Exception:
        return str(data)

def matriks_gell_mann(n):
    n = int(n)
    if n < 1 or n > 8:
        raise ValueError("n harus 1 sampai 8")
    if n == 1: return sp.Matrix([[0,1,0],[1,0,0],[0,0,0]])
    if n == 2: return sp.Matrix([[0,-sp.I,0],[sp.I,0,0],[0,0,0]])
    if n == 3: return sp.Matrix([[1,0,0],[0,-1,0],[0,0,0]])
    if n == 4: return sp.Matrix([[0,0,1],[0,0,0],[1,0,0]])
    if n == 5: return sp.Matrix([[0,0,-sp.I],[0,0,0],[sp.I,0,0]])
    if n == 6: return sp.Matrix([[0,0,0],[0,0,1],[0,1,0]])
    if n == 7: return sp.Matrix([[0,0,0],[0,0,-sp.I],[0,sp.I,0]])
    if n == 8: return sp.Matrix([[1,0,0],[0,1,0],[0,0,-2]]) / sp.sqrt(3)
    return sp.Matrix([[0]])
        `);

      }).then(function() {
        setStatus("✓ Siap", "green");
        siap = true;
        sedangMemuat = false;
        resolve();

      }).catch(function(err) {
        console.error("Error loading Pyodide:", err);
        setStatus("❌ Gagal: " + err.message, "red");
        siap = false;
        sedangMemuat = false;
        _pyodidePromise = null;
        reject(err);
      });
    };

    s.onerror = function() {
      setStatus("❌ Gagal mengunduh Pyodide", "red");
      siap = false;
      sedangMemuat = false;
      _pyodidePromise = null;
      reject(new Error("Gagal mengunduh skrip Pyodide dari CDN"));
    };

    document.head.appendChild(s);
  });

  return _pyodidePromise;
}

function decodeB64(str) {
  if (typeof str === 'string' && str.startsWith("B64:")) {
    try {
      return atob(str.substring(4));
    } catch (e) {
      return str;
    }
  }
  return str;
}

function jalankanPython(kode) {
  if (!py || !siap) {
    return Promise.reject(new Error("Pyodide belum siap"));
  }
  return py.runPythonAsync(kode);
}

function panggilFungsiPython(namaFungsi, ekspresiString) {
  if (!py || !siap) {
    return Promise.reject(new Error("Pyodide belum siap dipanggil"));
  }

  var kode = namaFungsi + "(" + ekspresiString + ")";
  return py.runPythonAsync(kode).then(function(hasil) {
    return decodeB64(String(hasil));
  });
}