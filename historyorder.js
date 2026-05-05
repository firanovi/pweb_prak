const userId = localStorage.getItem('userId');

if (!userId) {
    window.location.href = './loginuser.html';
}

function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

function getStatusClass(status) {
    const map = {
        'pending': 'pending',
        'diproses': 'pending',
        'dikirim': 'pending',
        'selesai': 'delivered',
        'dibatalkan': 'cancelled'
    };
    return map[status] || 'pending';
}

function getStatusLabel(status) {
    const map = {
        'pending': 'Pending',
        'diproses': 'Diproses',
        'dikirim': 'Dikirim',
        'selesai': 'Delivered',
        'dibatalkan': 'Cancelled'
    };
    return map[status] || status;
}

async function loadOrders() {
    try {
        const res = await fetch(`/api/order/${userId}`);
        const orders = await res.json();

        const container = document.querySelector('.orders-content');
        // Hapus order hardcode, sisakan judul
        container.innerHTML = '<h1 class="page-title">History Order</h1>';

        if (orders.length === 0) {
            container.innerHTML += '<p style="padding:20px">Belum ada order!</p>';
            return;
        }

        orders.forEach(order => {
            const itemsHTML = order.items.map(item => `
                <div class="item">
                    <img src="${item.produk?.gambar || './img/default.jpg'}" 
                         alt="${item.produk?.nama}">
                    <div class="item-info">
                        <h4>${item.produk?.nama || 'Produk'}</h4>
                        <p class="qty">Qty : ${item.jumlah}</p>
                    </div>
                    <div class="item-actions">
                        <span class="price">${formatIDR(item.harga)}</span>
                        <div class="action-links">
                            <a href="./store.html">View Product</a> | 
                            <a href="./store.html">Buy it again</a>
                        </div>
                    </div>
                </div>
            `).join('');

            const orderCard = `
                <div class="order-card">
                    <div class="order-header">
                        <div class="order-info-row">
                            <div class="info-group">
                                <span class="label">Order Number :</span>
                                <span class="value">${order._id}</span>
                            </div>
                            <div class="info-group">
                                <span class="label">Order Date:</span>
                                <span class="value">${formatDate(order.createdAt)}</span>
                            </div>
                            <div class="info-group">
                                <span class="label">Total Amount:</span>
                                <span class="value">${formatIDR(order.totalHarga)}</span>
                            </div>
                            <div class="info-group">
                                <span class="label">Status:</span>
                                <span class="status ${getStatusClass(order.status)}">
                                    ${getStatusLabel(order.status)}
                                </span>
                            </div>
                            <div class="info-group buttons">
                                <button class="btn-outline">View Invoice</button>
                                <button class="btn-primary">View Order</button>
                            </div>
                        </div>
                    </div>
                    <div class="order-items">
                        ${itemsHTML}
                    </div>
                </div>
            `;
            container.innerHTML += orderCard;
        });

    } catch (err) {
        console.error('Error:', err);
    }
}

loadOrders();