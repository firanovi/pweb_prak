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
        'pending': 'shipped',
        'diproses': 'shipped',
        'dikirim': 'shipped',
        'selesai': 'delivered',
        'dibatalkan': 'cancelled'
    };
    return map[status] || 'shipped';
}

function getStatusLabel(status) {
    const map = {
        'pending': 'Pending',
        'diproses': 'Diproses',
        'dikirim': 'Shipped',
        'selesai': 'Delivered',
        'dibatalkan': 'Cancelled'
    };
    return map[status] || status;
}

async function loadOrders() {
    try {
        const res = await fetch(`/api/order/aktif/${userId}`);
        const orders = await res.json();

        const container = document.querySelector('.orders-content');
        container.innerHTML = '<h1 class="page-title">Order</h1>';

        if (orders.length === 0) {
            container.innerHTML += '<p style="padding:20px">Tidak ada order aktif!</p>';
            return;
        }

        orders.forEach(order => {
            const itemsHTML = order.items.map(item => `
                <div class="item">
                    <img src="${item.produk?.gambar || './img/default.jpg'}" 
                         alt="${item.produk?.nama}">
                    <div class="item-info">
                        <h4>${item.produk?.nama || 'Produk'}</h4>
                        <p class="qty">Qty: ${item.jumlah}</p>
                    </div>
                    <span class="price">${formatIDR(item.harga)}</span>
                </div>
            `).join('');

            const actionBtn = order.status === 'dikirim'
                ? `<a href="#" class="track-btn">Track Order</a>`
                : `<a href="#" class="download-btn">Download Invoice</a>`;

            const orderCard = `
                <div class="order-card">
                    <div class="order-status ${getStatusClass(order.status)}">
                        ${getStatusLabel(order.status)}
                    </div>
                    <div class="order-details">
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">Order Number</span>
                                <span class="value">${order._id}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">Order Date</span>
                                <span class="value">${formatDate(order.createdAt)}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">Ship To</span>
                                <span class="value">${order.alamatPengiriman}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Payment Method</span>
                                <span class="value">${order.metodePembayaran || '-'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="order-items">
                        ${itemsHTML}
                    </div>
                    <div class="order-footer">
                        <div class="total">
                            <span class="label">Total Amount:</span>
                            <span class="amount">${formatIDR(order.totalHarga)}</span>
                        </div>
                        <div class="actions">
                            ${actionBtn}
                        </div>
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