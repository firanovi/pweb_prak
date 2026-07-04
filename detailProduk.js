let produkAktif = null; // simpan data produk yang lagi dibuka
let jumlah = 1;

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount || 0);
}

function getProdukId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function showState(state) {
  // state: 'loading' | 'notfound' | 'ready'
  document.getElementById('loadingState').classList.toggle('hidden', state !== 'loading');
  document.getElementById('notFoundState').classList.toggle('hidden', state !== 'notfound');
  document.getElementById('productSection').classList.toggle('hidden', state !== 'ready');
  document.getElementById('recommendSection').classList.toggle('hidden', state !== 'ready');
}

// ── RENDER PRODUK KE HALAMAN ────────────────────────────────
function renderProduk(produk) {
  produkAktif = produk;

  document.title = `${produk.nama} - SakaMadura`;

  const gambar = produk.gambar || './img/default.jpg';
  document.getElementById('mainImg').src = gambar;
  document.getElementById('mainImg').alt = produk.nama;
  document.getElementById('subImg').src = gambar;
  document.getElementById('subImg').alt = produk.nama;

  document.getElementById('produkNama').textContent = produk.nama;
  document.getElementById('produkHarga').textContent = formatIDR(produk.harga);

  const descEl = document.getElementById('produkDesc');
  descEl.textContent = produk.deskripsi || 'Belum ada deskripsi untuk produk ini.';

  jumlah = 1;
  document.getElementById('qtySpan').textContent = jumlah;

  showState('ready');
}

// ── QUANTITY ──────────────────────────────────────────────────
function initQty() {
  const qtySpan = document.getElementById('qtySpan');
  const btnMinus = document.getElementById('qtyMinus');
  const btnPlus  = document.getElementById('qtyPlus');

  btnMinus.addEventListener('click', () => {
    if (jumlah > 1) {
      jumlah--;
      qtySpan.textContent = jumlah;
    }
  });

  btnPlus.addEventListener('click', () => {
    if (produkAktif && jumlah >= produkAktif.stok) {
      alert('Jumlah melebihi stok yang tersedia.');
      return;
    }
    jumlah++;
    qtySpan.textContent = jumlah;
  });
}

// ── ADD TO CART ───────────────────────────────────────────────
async function addToCart() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert('Kamu harus login dulu untuk menambahkan ke cart!');
    window.location.href = './loginuser.html';
    return;
  }

  if (!produkAktif) return;

  try {
    const cartRes = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        produkId: produkAktif._id,
        jumlah,
        harga: produkAktif.harga
      })
    });

    if (cartRes.ok) {
      alert(`✅ ${jumlah}x ${produkAktif.nama} berhasil ditambahkan ke cart!`);
    } else {
      const err = await cartRes.json();
      alert(err.message || 'Gagal menambahkan ke cart.');
    }
  } catch (err) {
    console.error('Error add to cart:', err);
    alert('Gagal terhubung ke server. Pastikan server berjalan.');
  }
}

// ── ADD TO WISHLIST ───────────────────────────────────────────
async function addToWishlist() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert('Kamu harus login dulu untuk menambahkan ke wishlist!');
    window.location.href = './loginuser.html';
    return;
  }

  if (!produkAktif) return;

  try {
    const wRes = await fetch('/api/wishlist/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, produkId: produkAktif._id })
    });

    const data = await wRes.json();
    if (wRes.ok) {
      alert(`❤️ ${produkAktif.nama} ditambahkan ke wishlist!`);
    } else {
      alert(data.message || 'Gagal menambahkan ke wishlist.');
    }
  } catch (err) {
    console.error('Error add to wishlist:', err);
    alert('Gagal terhubung ke server.');
  }
}

// ── BUY NOW (langsung ke payment, tanpa masuk cart, tanpa popup) ──
async function buyNow() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    alert('Kamu harus login dulu untuk melakukan pembelian!');
    window.location.href = './loginuser.html';
    return;
  }

  if (!produkAktif) return;

  // Simpan HANYA produk ini (bukan seluruh cart) untuk ditampilkan di payment.html
  const buyNowItem = [{
    nama:   produkAktif.nama,
    harga:  produkAktif.harga,
    jumlah: jumlah,
    gambar: produkAktif.gambar || ''
  }];
  localStorage.setItem('sakamadura_buynow_item', JSON.stringify(buyNowItem));

  // Tandai mode "buynow" lewat query param supaya payment.js tahu
  // harus tampilkan produk ini saja, bukan isi cart biasa
  window.location.href = './payment.html?mode=buynow';
}

// ── REKOMENDASI PRODUK LAIN ─────────────────────────────────
async function loadRekomendasi(idSaatIni) {
  const grid = document.getElementById('recommendGrid');
  try {
    const res = await fetch('/api/produk');
    if (!res.ok) throw new Error('Gagal fetch produk');
    const semuaProduk = await res.json();

    const lainnya = semuaProduk
      .filter(p => p._id !== idSaatIni)
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);

    if (lainnya.length === 0) {
      grid.innerHTML = '<p>Belum ada produk lain.</p>';
      return;
    }

    grid.innerHTML = lainnya.map(p => `
      <a href="detailProduk.html?id=${p._id}" class="card">
        <img src="${p.gambar || './img/default.jpg'}" alt="${p.nama}">
        <p>${p.nama}</p>
        <span>${formatIDR(p.harga)}</span>
      </a>
    `).join('');
  } catch (err) {
    console.error('Error load rekomendasi:', err);
    grid.innerHTML = '';
  }
}

// ── INIT ─────────────────────────────────────────────────────
async function initDetailProduk() {
  const id = getProdukId();

  if (!id) {
    showState('notfound');
    return;
  }

  showState('loading');

  try {
    const res = await fetch(`/api/produk/${id}`);
    if (!res.ok) {
      showState('notfound');
      return;
    }
    const produk = await res.json();
    renderProduk(produk);
    loadRekomendasi(produk._id);
  } catch (err) {
    console.error('Error load produk:', err);
    showState('notfound');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initQty();

  document.getElementById('btnCart').addEventListener('click', addToCart);
  document.getElementById('btnWishlist').addEventListener('click', addToWishlist);
  document.getElementById('btnBuy').addEventListener('click', buyNow);

  initDetailProduk();
});