/* ========================================================
   PYODIDE LOADER
   Memuat Pyodide + SymPy, dan menyiapkan fungsi Python.
   ======================================================== */

function muatPyodide() {
  return new Promise(function(resolve, reject) {
    var statusEl = document.getElementById('km-status');
    if (siap && py) { resolve(); return; }
    if (sedangMemuat) {
      var cek = setInterval(function() { if (siap) { clearInterval(cek); resolve(); } }, 200);
      return;
    }

    sedangMemuat = true;
    statusEl.innerText = "Memuat mesin matematika, Harap tunggu... ";
    statusEl.style.color = "#e67e22";

    var s = document.createElement('script');
    s.src = "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/pyodide.js";
    s.onload = function() {
      statusEl.innerText = "Menginisialisasi Python...";
      loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.2/full/" }).then(function(p) {
        py = p;
        statusEl.innerText = "Memuat SymPy...";
        return p.loadPackage(["sympy"]);
      }).then(function() {
        statusEl.innerText = "Menyiapkan fungsi...";
        return py.runPythonAsync(`
import sympy as sp
import base64
from sympy import symbols, integrate, diff, solve, factor, expand, simplify, latex, Matrix, oo, sin, cos, tan, cot, sec, csc, asin, acos, atan, sinh, cosh, tanh, exp, log, sqrt, pi, Eq, N, summation, Abs, binomial, factorial
from sympy import solveset, S, Interval, Union, Intersection, FiniteSet, EmptySet
from sympy import Function, Symbol, denom, together
from sympy.calculus.util import continuous_domain
from math import gcd
x, y, z, t, n, m, k, i = symbols('x y z t n m k i')

BS = chr(92)  # backslash character

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

def format_interval_latex(s):
    hasil = []
    i = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c.isdigit() or (c == '-' and i + 1 < n and s[i+1].isdigit()):
            j = i
            if c == '-':
                j += 1
            ada_koma_desimal = False
            while j < n and (s[j].isdigit() or s[j] == ','):
                if s[j] == ',':
                    if j + 1 < n and s[j+1].isdigit():
                        ada_koma_desimal = True
                j += 1
            segmen = s[i:j]
            if ada_koma_desimal:
                k = j
                while k < n and s[k] == ' ':
                    k += 1
                if k < n and s[k] == ',':
                    hasil.append(segmen)
                    hasil.append(" ; ")
                    i = k + 1
                    while i < n and s[i] == ' ':
                        i += 1
                    continue
            hasil.append(segmen)
            i = j
        else:
            hasil.append(c)
            i += 1
    return ''.join(hasil)

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
        from sympy import Set, Interval, Union, Intersection, FiniteSet, EmptySet, Matrix, Number
        # Matriks: tampilkan matriks
        if isinstance(expr, Matrix):
            return tampil_matriks(expr)
        # Himpunan: tampilkan interval
        if isinstance(expr, (Set, Interval, Union, Intersection, FiniteSet, EmptySet)):
            hasil = latex(expr)
            return format_interval_latex(hasil)
        if expr is S.Reals:
            return latex(expr)
        if expr is S.EmptySet:
            return latex(expr)

        # Ekspresi dengan variabel: tampilkan simbolik saja
        if hasattr(expr, 'free_symbols') and len(expr.free_symbols) > 0:
            return latex(expr)

        # Ekspresi tanpa variabel: tampilkan eksak + desimal (jika beda)
        eksak = latex(expr)
        # Jika bilangan bulat atau rasional, tampilkan eksak saja
        if expr.is_Integer or expr.is_Rational:
            return eksak
        # Coba konversi ke desimal
        try:
            desimal = N(expr, 10)
            # Jika hasil desimal berbeda dari eksak, tampilkan keduanya
            if str(expr) != str(desimal):
                desimal_latex = latex(desimal).replace('.', ',')
                return eksak + " " + BS + "approx " + desimal_latex
            return eksak
        except Exception:
            return eksak
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
        baris.append(BS + "bullet" + BS + "; " + kontinu_R + BS + "; " + BS + "text{(asumsi fungsi dari real ke real)}")
        baris.append(BS + "bullet" + BS + "; " + BS + "text{kontinu di domainnya (asumsi fungsi dari real ke real)}")
        baris.append(BS + "textbf{Titik Diskontinu:}")
        if len(sing_list) == 0:
            baris.append(BS + "text{Tidak ada titik diskontinu.}")
        else:
            baris.append(sing_latex)
            baris.append(BS + "text{(diskontinu tak hingga)}")
        baris.append(BS + "textbf{Domain:}")
        baris.append(dom_latex)

        hasil_latex = BS + "begin{gathered} " + (" " + BS + BS + " ").join(baris) + " " + BS + "end{gathered}"
        return "B64:" + base64.b64encode(hasil_latex.encode('utf-8')).decode('ascii')
    except Exception as e:
        pesan = BS + "text{Gagal menganalisis: " + str(e).replace("_", BS + "_") + "}"
        return "B64:" + base64.b64encode(pesan.encode('utf-8')).decode('ascii')

def tabel_nilai(expr, var, a, b, langkah=1):
    a = float(a)
    b = float(b)
    langkah = float(langkah)
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
    a = float(a)
    b = float(b)
    langkah = float(langkah)
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
    except Exception as e:
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
        statusEl.innerText = "Siap";
        statusEl.style.color = "green";
        siap = true;
        sedangMemuat = false;
        resolve();
      }).catch(function(err) {
        statusEl.innerText = "Gagal memuat";
        statusEl.style.color = "red";
        sedangMemuat = false;
        reject(err);
      });
    };
    s.onerror = function() {
      statusEl.innerText = "Gagal mengunduh Pyodide";
      statusEl.style.color = "red";
      sedangMemuat = false;
      reject(new Error("Gagal mengunduh Pyodide"));
    };
    document.head.appendChild(s);
  });
}