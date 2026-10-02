# Kalkulator Matematika

Kalkulator matematika berbasis web yang berjalan **100% di browser** (client-side) menggunakan **Pyodide** + **SymPy** untuk perhitungan simbolik, dan **Vanilla JavaScript** untuk perhitungan instan.

Dapat di-embed ke **Blogspot**, **WordPress**, atau situs statis apa pun melalui **jsDelivr CDN**.

---

## ✨ Fitur

### Perhitungan Instan (Vanilla JS)
- **Aritmetika**: hitung, persen, pangkat, akar, logaritma, trigonometri, faktorial, kombinasi, permutasi
- **Bilangan**: prima, desimal, biner
- **Statistik**: rata-rata, median, modus, jangkauan, varians, standar deviasi, kovarian, kuartil, persentil, IQR, ringkasan lima angka, box plot
- **Distribusi**: normal, binomial, geometri, eksponensial, hipergeometrik
- **Inferensia**: z-score, p-value, interval kepercayaan, ukuran sampel, margin kesalahan
- **Regresi linier** sederhana (OLS)
- **Rata-rata khusus**: geometri, harmonis
- **Konversi**: derajat ↔ radian

### Perhitungan Simbolik (Pyodide + SymPy)
- **Aljabar**: pecahkan persamaan, sistem persamaan, pertidaksamaan, faktorkan, jabarkan, sederhanakan
- **Kalkulus**: integral tak tentu, integral tentu, turunan pertama, turunan kedua, limit, deret Taylor, ekspansi deret
- **Kekontinuan**: analisis domain, titik diskontinu, status kontinu
- **Matriks**: determinan, matriks diagonal, matriks Gell-Mann
- **Barisan & Deret**: barisan, suku ke-k, deret, deret tak hingga
- **Trigonometri lanjutan**: sinus hiperbolik, arcsinus, arckosinus, arcktangen
- **Distribusi Beta**

### UI/UX
- Kategori perintah yang terorganisir
- Pencarian perintah
- Daftar perintah yang bisa diklik
- Output LaTeX dengan **KaTeX** (cepat dan ringan)
- Dukungan **desimal koma** (konvensi Indonesia)
- Pemisah argumen: **titik koma (;)**
- Lazy-load Pyodide (hanya dimuat saat dibutuhkan)

---

## 🚀 Cara Pakai

### 1. Clone Repository

```bash
git clone https://github.com/<username>/kalkulator-matematika.git
cd kalkulator-matematika
