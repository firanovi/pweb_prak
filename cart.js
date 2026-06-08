const SHIPPING_COST = 30000;

const userId = localStorage.getItem('userId');

function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(amount);
}

async function fetchCart() {
    if (!userId) {
        return getLocalCart();
    }
    try {
        const res = await fetch(`/api/cart/${userId}`);
        if (!res.ok) throw new Error('server error');
        const cart = await res.json();
        const serverItems = cart.items || [];
        const localItems = getLocalCart();
        return mergeCartItems(serverItems, localItems);
    } catch (err) {
        console.warn('Server tidak tersedia, pakai localStorage:', err);
        return getLocalCart();
    }
}

function getLocalCart() {
    return JSON.parse(localStorage.getItem('sakamadura_cart_local') || '[]');
}

function mergeCartItems(serverItems, localItems) {
    const serverFormatted = serverItems.map(item => ({
        _id: item.produk?._id || item.produk,
        nama: item.produk?.nama || 'Produk',
        gambar: item.produk?.gambar || './img/default.jpg',
        harga: item.harga,
        jumlah: item.jumlah,
        sumber: 'server'
    }));
    const localFormatted = localItems.map(item => ({
        _id: null,
        nama: item.nama,
        gambar: item.gambar || './img/default.jpg',
        harga: item.harga,
        jumlah: item.jumlah,
        sumber: 'local'
    }));
    const serverNames = serverFormatted.map(i => i.nama.toLowerCase());
    const uniqueLocal = localFormatted.filter(i => !serverNames.includes(i.nama.toLowerCase()));
    return [...serverFormatted, ...uniqueLocal];
}

async function removeItem(itemNama, itemId) {
    if (userId && itemId) {
        try {
            await fetch('/api/cart/remove', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, produkId: itemId })
            });
        } catch (err) {
            console.warn('Gagal hapus dari server:', err);
        }
    }
    let localCart = getLocalCart();
    localCart = localCart.filter(i => i.nama !== itemNama);
    localStorage.setItem('sakamadura_cart_local', JSON.stringify(localCart));

    renderCartItems();
}

async function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    container.innerHTML = '<p style="padding:20px;color:#888;">Memuat cart...</p>';

    const items = await fetchCart();

    container.innerHTML = '';

    if (!userId) {
        container.innerHTML = `
            <div style="padding:30px;text-align:center;">
                <p style="margin-bottom:12px;">Kamu belum login.</p>
                <a href="./loginuser.html" style="color:#8B4513;font-weight:600;">Login sekarang →</a>
            </div>`;
        updateSummary(0);
        return;
    }

    if (items.length === 0) {
        container.innerHTML = '<p style="padding:20px;color:#888;">Cart kamu kosong!</p>';
        updateSummary(0);
        return;
    }

    let subtotal = 0;
    items.forEach(item => {
        const harga = item.harga || 0;
        const jumlah = item.jumlah || 1;
        subtotal += harga * jumlah;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="col-product">
                <img src="${item.gambar}" 
                     alt="${item.nama}" class="product-image"
                     onerror="this.src='./img/default.jpg'">
                <span>${item.nama}</span>
            </div>
            <span class="col-price">${formatIDR(harga)}</span>
            <span class="col-qty">${jumlah}</span>
            <span class="col-subtotal">${formatIDR(harga * jumlah)}</span>
            <button onclick="removeItem('${item.nama}', '${item._id || ''}')" 
                    style="background:none;border:none;color:red;cursor:pointer;font-size:16px;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(itemDiv);
    });

    updateSummary(subtotal);
}

function updateSummary(subtotal) {
    const finalTotal = subtotal + SHIPPING_COST;
    const subtotalElem = document.getElementById('subtotalDisplay');
    const totalElem = document.getElementById('totalDisplay');
    const shippingSpan = document.getElementById('shippingCost');

    if (subtotalElem) subtotalElem.innerHTML = formatIDR(subtotal);
    if (totalElem) totalElem.innerHTML = formatIDR(finalTotal);
    if (shippingSpan) shippingSpan.innerHTML = formatIDR(SHIPPING_COST);
}

// ================= CHECKOUT =================
document.addEventListener('DOMContentLoaded', () => {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (!userId) {
                alert('Kamu harus login dulu!');
                window.location.href = './loginuser.html';
                return;
            }

            // Simpan cart ke localStorage sebelum pindah ke payment
            const items = await fetchCart();
            if (items.length === 0) {
                alert('Cart kamu kosong!');
                return;
            }

            const cartToSave = items.map(i => ({
                nama: i.nama,
                harga: i.harga,
                jumlah: i.jumlah,
                gambar: i.gambar
            }));
            localStorage.setItem('sakamadura_cart_local', JSON.stringify(cartToSave));

            window.location.href = './payment.html';
        });
    }

    renderCartItems();
});