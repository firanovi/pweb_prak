// ============================================================
// DETAIL PRODUK - SakaMadura
// ============================================================

const produkData = {
  "Batik Sumenep":          { harga: 500000, id: "batik-sumenep" },
  "Kue Macho":              { harga: 20000,  id: "kue-macho" },
  "Kacang Otok":            { harga: 15000,  id: "kacang-otok" },
  "Buah Siwalan":           { harga: 35000,  id: "buah-siwalan" },
  "Odheng":                 { harga: 25000,  id: "odheng" },
  "Miniatur Karapan Sapi":  { harga: 400000, id: "miniatur-karapan-sapi" },
  "Keripik Tette":          { harga: 25000,  id: "keripik-tette" },
  "Petis Madura":           { harga: 20000,  id: "petis-madura" },
  "Rengginang Lorjuk":      { harga: 30000,  id: "rengginang-lorjuk" },
  "Bolu Jubada":            { harga: 15000,  id: "bolu-jubada" },
  "Keripik Terung":         { harga: 40000,  id: "keripik-terung" },
  "Kaos Sakera":            { harga: 40000,  id: "kaos-sakera" },
};

let jumlah = 1;

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount);
}

function getNamaProduk() {
  const h2 = document.querySelector('.product-right h2');
  return h2 ? h2.textContent.trim() : null;
}

function getHargaProduk() {
  const priceEl = document.querySelector('.product-right .price');
  if (!priceEl) return 0;
  const angka = priceEl.textContent.replace(/[^0-9]/g, '');
  return parseInt(angka) || 0;
}

// ── QUANTITY ──────────────────────────────────────────────────
function initQty() {
  const qtySpan  = document.querySelector('.qty span');
  const btnMinus = document.querySelector('.qty button:first-child');
  const btnPlus  = document.querySelector('.qty button:last-child');
  if (!qtySpan || !btnMinus || !btnPlus) return;

  qtySpan.textContent = jumlah;
  btnMinus.addEventListener('click', () => {
    if (jumlah > 1) { jumlah--; qtySpan.textContent = jumlah; }
  });
  btnPlus.addEventListener('click', () => {
    jumlah++; qtySpan.textContent = jumlah;
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

  const nama  = getNamaProduk();
  const harga = getHargaProduk();

  try {
    const res = await fetch('/api/produk');
    const semuaProduk = await res.json();
    const produkDB = semuaProduk.find(p => p.nama.toLowerCase() === nama.toLowerCase());

    if (produkDB) {
      const cartRes = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, produkId: produkDB._id, jumlah, harga: produkDB.harga })
      });
      if (cartRes.ok) {
        alert(`✅ ${jumlah}x ${nama} berhasil ditambahkan ke cart!`);
      } else {
        const err = await cartRes.json();
        alert(err.message || 'Gagal menambahkan ke cart.');
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem('sakamadura_cart_local') || '[]');
      const existing = localCart.find(i => i.nama === nama);
      if (existing) {
        existing.jumlah += jumlah;
      } else {
        localCart.push({ nama, harga, jumlah, gambar: document.querySelector('.main-img')?.src || '' });
      }
      localStorage.setItem('sakamadura_cart_local', JSON.stringify(localCart));
      alert(`✅ ${jumlah}x ${nama} ditambahkan ke cart!`);
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

  const nama = getNamaProduk();

  try {
    const res = await fetch('/api/produk');
    const semuaProduk = await res.json();
    const produkDB = semuaProduk.find(p => p.nama.toLowerCase() === nama.toLowerCase());

    if (produkDB) {
      const wRes = await fetch('/api/wishlist/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, produkId: produkDB._id })
      });
      const data = await wRes.json();
      if (wRes.ok) {
        alert(`❤️ ${nama} ditambahkan ke wishlist!`);
      } else {
        alert(data.message || 'Gagal menambahkan ke wishlist.');
      }
    } else {
      let localWish = JSON.parse(localStorage.getItem('sakamadura_wishlist_local') || '[]');
      const sudahAda = localWish.find(i => i.nama === nama);
      if (sudahAda) {
        alert('Produk sudah ada di wishlist!');
      } else {
        localWish.push({ nama, harga: getHargaProduk(), gambar: document.querySelector('.main-img')?.src || '' });
        localStorage.setItem('sakamadura_wishlist_local', JSON.stringify(localWish));
        alert(`❤️ ${nama} ditambahkan ke wishlist!`);
      }
    }
  } catch (err) {
    alert('Gagal terhubung ke server.');
  }
}

// ── BUY NOW ───────────────────────────────────────────────────
async function buyNow() {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    alert('Kamu harus login dulu untuk melakukan pembelian!');
    window.location.href = './loginuser.html';
    return;
  }

  const nama   = getNamaProduk();
  const harga  = getHargaProduk();
  const gambar = document.querySelector('.main-img')?.src || '';

  try {
    const res = await fetch('/api/produk');
    const semuaProduk = await res.json();
    const produkDB = semuaProduk.find(p => p.nama.toLowerCase() === nama.toLowerCase());

    if (produkDB) {
      // Tambah ke server cart
      await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, produkId: produkDB._id, jumlah, harga: produkDB.harga })
      });
    }

    // Simpan ke localStorage sebelum redirect ke payment
    const cartToSave = [{
      nama:   produkDB?.nama  || nama,
      harga:  produkDB?.harga || harga,
      jumlah,
      gambar
    }];
    localStorage.setItem('sakamadura_cart_local', JSON.stringify(cartToSave));

    window.location.href = './payment.html';

  } catch (err) {
    console.error('Error buy now:', err);
    alert('Gagal terhubung ke server.');
  }
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initQty();

  const buttons = document.querySelectorAll('.buttons button');
  buttons.forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (text.includes('cart')) {
      btn.addEventListener('click', addToCart);
    } else if (text.includes('wishlist')) {
      btn.addEventListener('click', addToWishlist);
    }
  });

  const buyBtn = document.querySelector('.buy');
  if (buyBtn) {
    buyBtn.addEventListener('click', buyNow);
  }
});