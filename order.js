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

// ================= MAPPING GAMBAR LOKAL =================
const gambarProdukMap = {
    'Batik Sumenep':         './img/batiksumenep.jpg',
    'Kue Macho':             './img/kuemacho.png',
    'Kacang Otok':           './img/kacangotok.jpeg',
    'Buah Siwalan':          './img/buahsiwalan.jpg',
    'Odheng':                './img/odheng.png',
    'Miniatur Karapan Sapi': './img/miniaturkarapansapi.png',
    'Keripik Tette':         './img/keripiktette.jpeg',
    'Petis Madura':          './img/petismadura.png',
    'Rengginang Lorjuk':     './img/rengginanglorjuk.png',
    'Bolu Jubada':           './img/bolujubada.png',
    'Keripik Terung':        './img/keripikterung.png',
    'Kaos Sakera':           './img/kaossakera.jpeg',
};

function fixGambar(item) {
    const nama = item.produk?.nama || '';
    if (gambarProdukMap[nama]) return gambarProdukMap[nama];
    const gambar = item.produk?.gambar || '';
    if (!gambar) return 'https://placehold.co/60x60?text=?';
    if (gambar.startsWith('http') || gambar.startsWith('./') || gambar.startsWith('/')) return gambar;
    return './' + gambar;
}

function getNamaProduk(item) {
    return item.produk?.nama || `Produk (Rp${item.harga?.toLocaleString('id-ID') || '0'})`;
}

// ================= DOWNLOAD INVOICE =================
function downloadInvoice(order) {
    const itemsHTML = order.items.map(item => `
        <tr>
            <td>${getNamaProduk(item)}</td>
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
                .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #2c3e50; }
                .brand-name { font-size: 32px; font-weight: bold; color: #2c3e50; letter-spacing: 1px; }
                .brand-sub { font-size: 12px; color: #888; margin-top: 4px; }
                .invoice-title { text-align: right; }
                .invoice-title h2 { font-size: 28px; color: #2c3e50; text-transform: uppercase; letter-spacing: 3px; }
                .invoice-title p { font-size: 13px; color: #888; margin-top: 4px; }
                .invoice-info { display: flex; justify-content: space-between; margin-bottom: 32px; gap: 20px; }
                .info-block h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 6px; }
                .info-block p { font-size: 14px; color: #333; line-height: 1.6; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
                thead tr { background: #2c3e50; color: white; }
                thead th { padding: 12px 16px; font-size: 12px; text-transform: uppercase; }
                thead th:not(:first-child) { text-align: center; }
                thead th:last-child { text-align: right; }
                tbody tr { border-bottom: 1px solid #eee; }
                tbody td { padding: 12px 16px; font-size: 14px; }
                .total-section { display: flex; justify-content: flex-end; margin-bottom: 40px; }
                .total-box { width: 280px; }
                .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #eee; }
                .total-row.grand { font-size: 16px; font-weight: bold; color: #2c3e50; border-top: 2px solid #2c3e50; border-bottom: none; padding-top: 12px; margin-top: 4px; }
                .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; background: #e8f5e9; color: #2e7d32; }
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
                <div class="info-block"><h4>No. Order</h4><p>${order._id}</p></div>
                <div class="info-block"><h4>Dikirim Ke</h4><p>${order.alamatPengiriman}</p></div>
                <div class="info-block"><h4>Metode Pembayaran</h4><p>${order.metodePembayaran || '-'}</p></div>
                <div class="info-block"><h4>Tanggal Order</h4><p>${formatDate(order.createdAt)}</p></div>
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

// ================= LOAD ORDERS =================
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
                    <img src="${fixGambar(item)}" 
                         alt="${getNamaProduk(item)}"
                         onerror="this.onerror=null; this.src='https://placehold.co/60x60?text=?'">
                    <div class="item-info">
                        <h4>${getNamaProduk(item)}</h4>
                        <p class="qty">Qty: ${item.jumlah}</p>
                    </div>
                    <span class="price">${formatIDR(item.harga)}</span>
                </div>
            `).join('');

            const actionBtn = order.status === 'dikirim'
                ? `<a href="#" class="track-btn">Track Order</a>`
                : `<a href="#" class="download-btn" onclick="downloadInvoice(${JSON.stringify(order).replace(/"/g, '&quot;')})">Download Invoice</a>`;

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