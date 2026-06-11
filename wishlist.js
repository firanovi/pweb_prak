// ============================================================
// WISHLIST - SakaMadura
// ============================================================

const userId = localStorage.getItem('userId');

function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount);
}

// Normalisasi path gambar (sama seperti cart.js)
function normalizeImagePath(gambar) {
    if (!gambar) return './img/default.jpg';
    if (gambar.startsWith('http')) return gambar;
    if (gambar.startsWith('./')) return gambar;
    if (gambar.startsWith('/img/')) return '.' + gambar;
    if (gambar.startsWith('img/')) return './' + gambar;
    return `./img/${gambar}`;
}

function getLocalWishlist() {
    return JSON.parse(localStorage.getItem('sakamadura_wishlist_local') || '[]');
}

async function fetchWishlist() {
    if (!userId) return getLocalWishlist().map(i => ({ ...i, sumber: 'local' }));

    try {
        const res = await fetch(`/api/wishlist/${userId}`);
        if (!res.ok) throw new Error('server error');
        const data = await res.json();
        const serverItems = (data.items || []).map(item => ({
            _id: item.produk?._id || item.produk,
            nama: item.produk?.nama || 'Produk',
            gambar: normalizeImagePath(item.produk?.gambar),
            harga: item.produk?.harga || 0,
            sumber: 'server'
        }));

        const localItems = getLocalWishlist().map(i => ({ ...i, sumber: 'local' }));
        const serverNames = serverItems.map(i => i.nama.toLowerCase());
        const uniqueLocal = localItems.filter(i => !serverNames.includes(i.nama.toLowerCase()));
        return [...serverItems, ...uniqueLocal];
    } catch (err) {
        console.warn('Server tidak tersedia, pakai localStorage:', err);
        return getLocalWishlist().map(i => ({ ...i, sumber: 'local' }));
    }
}

async function addToCartFromWishlist(nama, harga, gambar, produkId) {
    if (!userId) {
        alert('Kamu harus login dulu!');
        window.location.href = './loginuser.html';
        return;
    }

    if (produkId && produkId !== 'null') {
        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, produkId, jumlah: 1, harga })
            });
            if (res.ok) {
                alert(`${nama} ditambahkan ke cart!`);
                return;
            }
        } catch (err) {
            console.warn('Gagal tambah ke cart server:', err);
        }
    }

    let localCart = JSON.parse(localStorage.getItem('sakamadura_cart_local') || '[]');
    const existing = localCart.find(i => i.nama === nama);
    if (existing) {
        existing.jumlah += 1;
    } else {
        localCart.push({ nama, harga, jumlah: 1, gambar });
    }
    localStorage.setItem('sakamadura_cart_local', JSON.stringify(localCart));
    alert(`${nama} ditambahkan ke cart!`);
}

async function removeFromWishlist(nama, produkId) {
    if (userId && produkId && produkId !== 'null') {
        try {
            await fetch('/api/wishlist/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, produkId })
            });
        } catch (err) {
            console.warn('Gagal hapus dari server:', err);
        }
    }

    let local = getLocalWishlist();
    local = local.filter(i => i.nama !== nama);
    localStorage.setItem('sakamadura_wishlist_local', JSON.stringify(local));

    renderWishlist();
}

async function renderWishlist() {
    const container = document.getElementById('wishlistContainer');
    const countEl = document.getElementById('wishlistCount');
    if (!container) return;

    container.innerHTML = '<p style="padding:20px;color:#888;">Memuat wishlist...</p>';

    if (!userId) {
        container.innerHTML = `
            <div style="padding:30px;text-align:center;">
                <p style="margin-bottom:12px;">Kamu belum login.</p>
                <a href="./loginuser.html" style="color:#8B4513;font-weight:600;">Login sekarang →</a>
            </div>`;
        if (countEl) countEl.textContent = '0 items';
        return;
    }

    const items = await fetchWishlist();
    if (countEl) countEl.textContent = `${items.length} item${items.length !== 1 ? 's' : ''}`;

    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p class="wishlist-empty">Wishlist kamu kosong! <a href="./store.html">Belanja sekarang →</a></p>';
        return;
    }

    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'wishlist-item';
        div.innerHTML = `
            <img src="${item.gambar}" alt="${item.nama}"
                 onerror="this.src='./img/default.jpg'">
            <div class="wishlist-info">
                <h3>${item.nama}</h3>
                <p>Harga: ${formatIDR(item.harga || 0)}</p>
                <span class="stock">IN STOCK</span>
            </div>
            <div class="wishlist-actions">
                <button class="add-cart"
                    onclick="addToCartFromWishlist('${item.nama}', ${item.harga || 0}, '${item.gambar}', '${item._id || null}')">
                    ADD TO CART
                </button>
                <button class="remove-wishlist"
                    onclick="removeFromWishlist('${item.nama}', '${item._id || null}')"
                    title="Hapus dari wishlist">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', renderWishlist);