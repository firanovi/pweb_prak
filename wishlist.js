// ============================================================
// WISHLIST - SakaMadura
// Menampilkan wishlist dari backend dan menghubungkan tombol
// "ADD TO CART" agar memindahkan produk ke cart
// ============================================================

function toggleMenu() {
  document.querySelector('.mobile-menu').classList.toggle('show');
}

function formatIDR(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount);
}

// ── RENDER WISHLIST ──────────────────────────────────────────
async function loadWishlist() {
  const userId = localStorage.getItem('userId');
  const container = document.querySelector('.wishlist-box');
  if (!container) return;

  if (!userId) {
    container.innerHTML = `
      <div class="wishlist-header"><h2>My Wishlist</h2></div>
      <p class="wishlist-empty">Kamu belum login. <a href="./loginuser.html">Login dulu</a> untuk melihat wishlist.</p>
    `;
    return;
  }

  // Coba ambil dari server
  try {
    const res = await fetch(`/api/wishlist/${userId}`);
    const data = await res.json();

    const items = data.items || [];

    // Gabungkan dengan localStorage fallback
    const localWish = JSON.parse(localStorage.getItem('sakamadura_wishlist_local') || '[]');

    renderWishlist(container, items, localWish, userId);
  } catch (err) {
    console.warn('Server tidak tersedia, pakai localStorage:', err);

    const localWish = JSON.parse(localStorage.getItem('sakamadura_wishlist_local') || '[]');
    renderWishlistLocal(container, localWish);
  }
}

// Render item dari DB (ada produkId)
function renderWishlist(container, dbItems, localItems, userId) {
  const total = dbItems.length + localItems.length;

  let html = `
    <div class="wishlist-header">
      <h2>My Wishlist</h2>
      <span>${total} item${total !== 1 ? 's' : ''}</span>
    </div>
  `;

  if (total === 0) {
    html += `<p class="wishlist-empty">Wishlist kamu masih kosong. <a href="./store.html">Mulai belanja!</a></p>`;
    container.innerHTML = html;
    return;
  }

  // Item dari DB
  dbItems.forEach(item => {
    const p = item.produk;
    if (!p) return;
    const gambar = p.gambar || `img/${p.nama ? p.nama.toLowerCase().replace(/ /g, ' ') : 'default'}.png`;
    html += `
      <div class="wishlist-item" data-produk-id="${p._id}">
        <img src="${gambar}" alt="${p.nama}" onerror="this.src='img/batik sumenep.jpg'">
        <div class="wishlist-info">
          <h3>${p.nama}</h3>
          <p>Harga: ${formatIDR(p.harga)}</p>
          <span class="stock">IN STOCK</span>
        </div>
        <div class="wishlist-actions">
          <button class="add-cart" data-produk-id="${p._id}" data-source="db">ADD TO CART</button>
          <button class="remove-wish" data-produk-id="${p._id}" data-source="db">✕ Hapus</button>
        </div>
      </div>
    `;
  });

  // Item dari localStorage
  localItems.forEach((item, idx) => {
    html += `
      <div class="wishlist-item" data-local-idx="${idx}">
        <img src="${item.gambar || ''}" alt="${item.nama}" onerror="this.src='img/batik sumenep.jpg'">
        <div class="wishlist-info">
          <h3>${item.nama}</h3>
          <p>Harga: ${formatIDR(item.harga)}</p>
          <span class="stock">IN STOCK</span>
        </div>
        <div class="wishlist-actions">
          <button class="add-cart" data-local-idx="${idx}" data-source="local">ADD TO CART</button>
          <button class="remove-wish" data-local-idx="${idx}" data-source="local">✕ Hapus</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  attachEvents(userId);
}

// Render hanya dari localStorage (server offline)
function renderWishlistLocal(container, localItems) {
  const total = localItems.length;

  let html = `
    <div class="wishlist-header">
      <h2>My Wishlist</h2>
      <span>${total} item${total !== 1 ? 's' : ''}</span>
    </div>
  `;

  if (total === 0) {
    html += `<p class="wishlist-empty">Wishlist kamu masih kosong. <a href="./store.html">Mulai belanja!</a></p>`;
    container.innerHTML = html;
    return;
  }

  localItems.forEach((item, idx) => {
    html += `
      <div class="wishlist-item" data-local-idx="${idx}">
        <img src="${item.gambar || ''}" alt="${item.nama}" onerror="this.src='img/batik sumenep.jpg'">
        <div class="wishlist-info">
          <h3>${item.nama}</h3>
          <p>Harga: ${formatIDR(item.harga)}</p>
          <span class="stock">IN STOCK</span>
        </div>
        <div class="wishlist-actions">
          <button class="add-cart" data-local-idx="${idx}" data-source="local">ADD TO CART</button>
          <button class="remove-wish" data-local-idx="${idx}" data-source="local">✕ Hapus</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  attachEventsLocal();
}

// ── EVENT LISTENERS ──────────────────────────────────────────
function attachEvents(userId) {
  // Tombol ADD TO CART
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', async () => {
      const source = btn.dataset.source;

      if (source === 'db') {
        const produkId = btn.dataset.produkId;
        await addToCartFromWishlist(userId, produkId, btn);
      } else {
        const idx = parseInt(btn.dataset.localIdx);
        addToCartLocal(idx, btn);
      }
    });
  });

  // Tombol Hapus
  document.querySelectorAll('.remove-wish').forEach(btn => {
    btn.addEventListener('click', async () => {
      const source = btn.dataset.source;

      if (source === 'db') {
        await removeFromWishlist(userId, btn.dataset.produkId);
      } else {
        removeFromWishlistLocal(parseInt(btn.dataset.localIdx));
      }
      loadWishlist(); // re-render
    });
  });
}

function attachEventsLocal() {
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      addToCartLocal(parseInt(btn.dataset.localIdx), btn);
    });
  });

  document.querySelectorAll('.remove-wish').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFromWishlistLocal(parseInt(btn.dataset.localIdx));
      loadWishlist();
    });
  });
}

// ── ADD TO CART (dari DB item) ────────────────────────────────
async function addToCartFromWishlist(userId, produkId, btn) {
  btn.disabled = true;
  btn.textContent = 'Memproses...';

  try {
    // Coba endpoint move-to-cart (pindah sekaligus hapus dari wishlist)
    const res = await fetch('/api/wishlist/move-to-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, produkId })
    });

    if (res.ok) {
      showToast('✅ Produk berhasil dipindahkan ke cart!');
      // Hapus item dari tampilan
      const item = btn.closest('.wishlist-item');
      item.style.transition = 'opacity 0.3s';
      item.style.opacity = '0';
      setTimeout(() => { loadWishlist(); }, 300);
    } else {
      const err = await res.json();
      showToast(err.message || 'Gagal menambahkan ke cart.', 'error');
      btn.disabled = false;
      btn.textContent = 'ADD TO CART';
    }
  } catch (e) {
    // Server tidak tersedia, fallback localStorage cart
    addToCartLocalFallback({ produkId }, btn);
  }
}

// ── ADD TO CART (dari localStorage item) ─────────────────────
function addToCartLocal(idx, btn) {
  const localWish = JSON.parse(localStorage.getItem('sakamadura_wishlist_local') || '[]');
  const item = localWish[idx];
  if (!item) return;

  let localCart = JSON.parse(localStorage.getItem('sakamadura_cart_local') || '[]');
  const existing = localCart.find(c => c.nama === item.nama);
  if (existing) {
    existing.jumlah += 1;
  } else {
    localCart.push({ ...item, jumlah: 1 });
  }
  localStorage.setItem('sakamadura_cart_local', JSON.stringify(localCart));

  // Hapus dari wishlist local
  localWish.splice(idx, 1);
  localStorage.setItem('sakamadura_wishlist_local', JSON.stringify(localWish));

  showToast('✅ Produk berhasil ditambahkan ke cart!');
  setTimeout(() => loadWishlist(), 500);
}

// ── REMOVE FROM WISHLIST ─────────────────────────────────────
async function removeFromWishlist(userId, produkId) {
  try {
    await fetch('/api/wishlist/remove', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, produkId })
    });
  } catch (e) {
    console.warn('Gagal hapus dari server:', e);
  }
}

function removeFromWishlistLocal(idx) {
  const localWish = JSON.parse(localStorage.getItem('sakamadura_wishlist_local') || '[]');
  localWish.splice(idx, 1);
  localStorage.setItem('sakamadura_wishlist_local', JSON.stringify(localWish));
}

// ── TOAST NOTIFICATION ───────────────────────────────────────
function showToast(msg, type = 'success') {
  let toast = document.getElementById('wl-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'wl-toast';
    toast.style.cssText = `
      position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
      background: ${type === 'error' ? '#c0392b' : '#2d6a4f'};
      color: #fff; padding: 12px 24px; border-radius: 8px;
      font-size: 14px; z-index: 9999; opacity: 0;
      transition: opacity 0.3s; pointer-events: none;
    `;
    document.body.appendChild(toast);
  }
  toast.style.background = type === 'error' ? '#c0392b' : '#2d6a4f';
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ── INIT ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadWishlist();
});