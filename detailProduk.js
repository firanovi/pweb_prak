// detailProduk.js
// Hubungkan halaman detail produk ke backend MongoDB
// Cara pakai: di setiap HTML, sebelum </body> tambahkan:
//   <script>const PRODUK_NAMA = 'Batik Sumenep';</script>
//   <script src="./detailProduk.js"></script>

const API_BASE = 'http://localhost:3000/api';

let produkData = null;
let qty = 1;

// ── Ambil data produk dari backend ─────────────────────────────────────────
async function getProduk() {
  const res = await fetch(`${API_BASE}/produk`);
  const list = await res.json();
  produkData = list.find(p => p.nama === PRODUK_NAMA);
  if (!produkData) return console.error('Produk tidak ditemukan:', PRODUK_NAMA);

  // Sinkron harga dari DB ke tampilan
  document.querySelector('.price').textContent =
    'Rp' + produkData.harga.toLocaleString('id-ID');
}

// ── Qty counter ─────────────────────────────────────────────────────────────
function initQty() {
  const btns = document.querySelectorAll('.qty button');
  const span = document.querySelector('.qty span');
  btns[0].addEventListener('click', () => { if (qty > 1) span.textContent = --qty; });
  btns[1].addEventListener('click', () => { span.textContent = ++qty; });
}

// ── Toast notifikasi ─────────────────────────────────────────────────────────
function toast(msg) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#333;color:#fff;padding:12px 20px;border-radius:8px;z-index:9999;font-size:14px;transition:opacity .3s';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  setTimeout(() => el.style.opacity = '0', 3000);
}

// ── Add to Cart ──────────────────────────────────────────────────────────────
async function addToCart() {
  const userId = localStorage.getItem('userId');
  if (!userId) return (window.location.href = './loginuser.html');
  if (!produkData) return toast('Produk belum termuat');

  const res = await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, produkId: produkData._id, jumlah: qty, harga: produkData.harga })
  });

  const data = await res.json();
  res.ok ? toast('Berhasil ditambahkan ke keranjang 🛒') : toast('Gagal: ' + data.message);
}

// ── Wishlist ─────────────────────────────────────────────────────────────────
async function toggleWishlist() {
  const userId = localStorage.getItem('userId');
  if (!userId) return (window.location.href = './loginuser.html');
  if (!produkData) return toast('Produk belum termuat');

  const res = await fetch(`${API_BASE}/wishlist/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, produkId: produkData._id })
  });

  const data = await res.json();
  res.ok ? toast('Ditambahkan ke wishlist ❤️') : toast(data.message);
}

// ── Buy Now ──────────────────────────────────────────────────────────────────
async function buyNow() {
  const userId = localStorage.getItem('userId');
  if (!userId) return (window.location.href = './loginuser.html');
  if (!produkData) return toast('Produk belum termuat');

  await fetch(`${API_BASE}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, produkId: produkData._id, jumlah: qty, harga: produkData.harga })
  });

  window.location.href = './order.html';
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await getProduk();
  initQty();

  const buttons = document.querySelectorAll('.buttons .outline');
  buttons[0]?.addEventListener('click', addToCart);
  buttons[1]?.addEventListener('click', toggleWishlist);
  document.querySelector('.buy')?.addEventListener('click', buyNow);
});