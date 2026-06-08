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

// ================= VIEW INVOICE =================
function downloadInvoice(order) {
    const itemsHTML = order.items.map(item => `
        <tr>
            <td>${item.produk?.nama || 'Produk'}</td>
            <td style="text-align:center">${item.jumlah}</td>
            <td style="text-align:right">${formatIDR(item.harga)}</td>
            <td style="text-align:right">${formatIDR(item.harga * item.jumlah)}</td>
        </tr>
    `).join('');

    const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>Invoice - ${order._id}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; color: #333; padding: 40px; }
                .invoice-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 40px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #2c3e50;
                }
                .brand-name { font-size: 32px; font-weight: bold; color: #2c3e50; }
                .brand-sub { font-size: 12px; color: #888; margin-top: 4px; }
                .invoice-title { text-align: right; }
                .invoice-title h2 { font-size: 28px; color: #2c3e50; text-transform: uppercase; letter-spacing: 3px; }
                .invoice-title p { font-size: 13px; color: #888; margin-top: 4px; }
                .invoice-info { display: flex; justify-content: space-between; margin-bottom: 32px; gap: 20px; }
                .info-block h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px; }
                .info-block p { font-size: 14px; color: #333; line-height: 1.6; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                thead tr { background: #2c3e50; color: white; }
                thead th { padding: 12px 16px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                thead th:not(:first-child) { text-align: center; }
                thead th:last-child { text-align: right; }
                tbody tr { border-bottom: 1px solid #eee; }
                tbody td { padding: 12px 16px; font-size: 14px; }
                .total-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
                .total-box { width: 280px; }
                .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; }
                .total-row.grand { font-size: 16px; font-weight: bold; color: #2c3e50; border-top: 2px solid #2c3e50; border-bottom: none; padding-top: 12px; margin-top: 4px; }
                .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #e8f5e9; color: #2e7d32; }
                .invoice-footer { text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #aaa; }
                @media print { body { padding: 20px; } @page { margin: 1cm; } }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <div>
                    <div class="brand-name">SakaMadura</div>
                    <div class="brand-sub">Produk Khas Madura</div>
                </div>
                <div class="invoice-title">
                    <h2>Invoice</h2>
                    <p>Tanggal: ${formatDate(order.createdAt)}</p>
                    <p>Status: <span class="status-badge">${getStatusLabel(order.status)}</span></p>
                </div>
            </div>
            <div class="invoice-info">
                <div class="info-block">
                    <h4>No. Order</h4>
                    <p>${order._id}</p>
                </div>
                <div class="info-block">
                    <h4>Dikirim Ke</h4>
                    <p>${order.alamatPengiriman}</p>
                </div>
                <div class="info-block">
                    <h4>Metode Pembayaran</h4>
                    <p>${order.metodePembayaran || '-'}</p>
                </div>
                <div class="info-block">
                    <h4>Tanggal Order</h4>
                    <p>${formatDate(order.createdAt)}</p>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th style="text-align:center">Qty</th>
                        <th style="text-align:right">Harga Satuan</th>
                        <th style="text-align:right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>${itemsHTML}</tbody>
            </table>
            <div class="total-section">
                <div class="total-box">
                    <div class="total-row grand">
                        <span>Total</span>
                        <span>${formatIDR(order.totalHarga)}</span>
                    </div>
                </div>
            </div>
            <div class="invoice-footer">
                <p>Terima kasih telah berbelanja di SakaMadura!</p>
                <p style="margin-top:4px">sakaMadura@gmail.com • (0123) 15734</p>
            </div>
            <script>window.onload = function() { window.print(); }<\/script>
        </body>
        </html>
    `;

    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ================= VIEW ORDER (popup detail) =================
function viewOrder(order) {
    const existing = document.getElementById('orderDetailPopup');
    if (existing) existing.remove();

    const itemsHTML = order.items.map(item => `
        <div style="display:flex; align-items:center; gap:12px; padding:12px 0; border-bottom:1px solid #eee;">
            <img src="${item.produk?.gambar || './img/default.jpg'}" 
                 alt="${item.produk?.nama}"
                 style="width:56px; height:56px; object-fit:cover; border-radius:8px;"
                 onerror="this.src='./img/default.jpg'">
            <div style="flex:1">
                <div style="font-weight:600; font-size:14px;">${item.produk?.nama || 'Produk'}</div>
                <div style="font-size:13px; color:#888;">Qty: ${item.jumlah}</div>
            </div>
            <div style="font-weight:600; font-size:14px;">${formatIDR(item.harga * item.jumlah)}</div>
        </div>
    `).join('');

    const popup = document.createElement('div');
    popup.id = 'orderDetailPopup';
    popup.style.cssText = `
        position:fixed; inset:0; background:rgba(0,0,0,0.5);
        display:flex; align-items:center; justify-content:center;
        z-index:9999; padding:20px;
    `;
    popup.innerHTML = `
        <div style="background:#fff; border-radius:16px; width:100%; max-width:520px; max-height:90vh; overflow-y:auto; padding:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="font-size:18px; font-weight:700;">Detail Order</h3>
                <button onclick="document.getElementById('orderDetailPopup').remove()"
                    style="background:none; border:none; font-size:22px; cursor:pointer; color:#888;">&times;</button>
            </div>

            <div style="background:#f9f6f2; border-radius:10px; padding:16px; margin-bottom:20px; font-size:13px; line-height:2;">
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#888;">No. Order</span>
                    <span style="font-weight:600; font-size:12px;">${order._id}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#888;">Tanggal</span>
                    <span style="font-weight:600;">${formatDate(order.createdAt)}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#888;">Status</span>
                    <span style="font-weight:600; color:#2e7d32;">${getStatusLabel(order.status)}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#888;">Pembayaran</span>
                    <span style="font-weight:600;">${order.metodePembayaran || '-'}</span>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span style="color:#888;">Dikirim ke</span>
                    <span style="font-weight:600; text-align:right; max-width:240px;">${order.alamatPengiriman}</span>
                </div>
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:14px; font-weight:600; margin-bottom:8px;">Produk</h4>
                ${itemsHTML}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:2px solid #2c3e50;">
                <span style="font-weight:700; font-size:15px;">Total</span>
                <span style="font-weight:700; font-size:16px; color:#2c3e50;">${formatIDR(order.totalHarga)}</span>
            </div>
        </div>
    `;

    popup.addEventListener('click', e => {
        if (e.target === popup) popup.remove();
    });

    document.body.appendChild(popup);
}

// ================= LOAD ORDERS =================
async function loadOrders() {
    try {
        const res = await fetch(`/api/order/${userId}`);
        const orders = await res.json();

        const container = document.querySelector('.orders-content');
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

            // Simpan data order sebagai JSON di data attribute
            const orderJson = JSON.stringify(order).replace(/'/g, "\\'").replace(/"/g, '&quot;');

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
                                <button class="btn-outline" onclick='downloadInvoice(${JSON.stringify(order)})'>View Invoice</button>
                                <button class="btn-primary" onclick='viewOrder(${JSON.stringify(order)})'>View Order</button>
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