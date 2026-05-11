const SHIPPING_COST = 30000;
const userId = localStorage.getItem('userId');

// Format Rupiah
function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0 
    }).format(amount);
}

// Ambil cart dari database
async function fetchCart() {
    try {
        const res = await fetch(`/api/cart/${userId}`);
        const cart = await res.json();
        return cart.items || [];
    } catch (err) {
        console.error('Gagal ambil cart:', err);
        return [];
    }
}

// Render cart items
async function renderCartItems() {
    const items = await fetchCart();
    const container = document.getElementById('cartItemsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p style="padding:20px">Cart kamu kosong!</p>';
        updateSummary(0);
        return;
    }

    let subtotal = 0;
    items.forEach(item => {
        const produk = item.produk;
        const harga = item.harga;
        const jumlah = item.jumlah;
        subtotal += harga * jumlah;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="col-product">
                <img src="${produk.gambar || './img/default.jpg'}" 
                     alt="${produk.nama}" class="product-image">
                <span>${produk.nama}</span>
            </div>
            <span class="col-price">${formatIDR(harga)}</span>
            <span class="col-qty">${jumlah}</span>
            <span class="col-subtotal">${formatIDR(harga * jumlah)}</span>
            <button onclick="removeItem('${produk._id}')" 
                    style="background:none;border:none;color:red;cursor:pointer;">
                <i class="fas fa-trash"></i>
            </button>
        `;
        container.appendChild(itemDiv);
    });

    updateSummary(subtotal);
}

// Update summary
function updateSummary(subtotal) {
    const finalTotal = subtotal + SHIPPING_COST;
    const subtotalElem = document.getElementById('subtotalDisplay');
    const totalElem = document.getElementById('totalDisplay');
    const shippingSpan = document.getElementById('shippingCost');

    if (subtotalElem) subtotalElem.innerHTML = formatIDR(subtotal);
    if (totalElem) totalElem.innerHTML = formatIDR(finalTotal);
    if (shippingSpan) shippingSpan.innerHTML = formatIDR(SHIPPING_COST);
}

// Hapus item dari cart
async function removeItem(produkId) {
    try {
        await fetch('/api/cart/remove', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, produkId })
        });
        renderCartItems(); // Refresh tampilan
    } catch (err) {
        console.error('Gagal hapus item:', err);
    }
}

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', () => {
    window.location.href = './payment.html';
});

// Init
renderCartItems();