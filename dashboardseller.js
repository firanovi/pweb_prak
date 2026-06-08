// ============================================
// DASHBOARD SELLER - SAKA MADURA
// ============================================

// ============================================
// CONFIG
// ============================================
const userId   = localStorage.getItem("userId");
const sellerId = localStorage.getItem("sellerId");

// ============================================
// MAPPING GAMBAR LOKAL
// ============================================
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

// ============================================
// DATA PRODUCTS - FETCH DARI DATABASE
// ============================================
let productsData = [];

async function loadProducts() {
    try {
        const res  = await fetch(`/api/produk?seller=${sellerId}`);
        const data = await res.json();
        productsData = data.map(p => ({
            id:     p._id,
            name:   p.nama,
            price:  p.harga,
            stock:  p.stok,
            type:   p.kategori,
            status: p.status || 'Active',
            image:  gambarProdukMap[p.nama] || p.gambar || 'https://via.placeholder.com/40'
        }));
        renderProductsTable();
    } catch (err) {
        console.error('Gagal load produk:', err);
        showToast('Gagal memuat produk', 'error');
    }
}

// ============================================
// DATA ORDERS - FETCH DARI DATABASE
// ============================================
let ordersData         = [];
let originalOrdersData = [];

async function loadOrders() {
    try {
        const res  = await fetch(`/api/order?seller=${sellerId}`);
        const data = await res.json();
        ordersData = data.map(o => ({
            id: o._id,
            customer: {
                name:    o.user?.nama           || 'Unknown',
                email:   o.user?.email          || '-',
                phone:   o.user?.noHp           || '-',
                address: o.alamatPengiriman     || '-'
            },
            date:  new Date(o.createdAt).toLocaleDateString('id-ID'),
            items: o.items.map(i => ({
                name:     i.produk?.nama || '-',
                quantity: i.jumlah,
                price:    i.harga
            })),
            shipping: {
                courier:  o.kurir  || 'JNE',
                tracking: o.noResi || '-',
                cost:     o.ongkir || 0
            },
            payment: {
                method: o.metodePembayaran || '-',
                status: o.statusPembayaran || 'Menunggu'
            },
            status: o.status || 'Pending'
        }));
        originalOrdersData = [...ordersData];
        renderOrdersTable();
    } catch (err) {
        console.error('Gagal load orders:', err);
        showToast('Gagal memuat orders', 'error');
    }
}

// ============================================
// VIEWS TEMPLATES
// ============================================
const views = {
    dashboard: `
    <div class="stats-grid">
        <div class="stat-card"><h3>Total Earning</h3><p>Rp 5.000.000,00</p></div>
        <div class="stat-card"><h3>Total Orders</h3><p>500 pcs</p></div>
        <div class="stat-card"><h3>Avg Earning</h3><p>Rp 450.000,00</p></div>
    </div>
    <div class="main-card">
        <div class="title-row">
            <h2>Weekly Financial</h2>
            <div style="display: flex; gap: 10px;">
                <select class="custom-select" id="weekSelect">
                    <option>Week 1</option><option>Week 2</option><option>Week 3</option><option>Week 4</option>
                </select>
                <select class="custom-select" id="monthSelect">
                    <option>January</option><option>February</option><option>March</option>
                    <option>April</option><option>May</option><option>June</option>
                    <option>July</option><option>August</option><option>September</option>
                    <option>Oktober</option><option>November</option><option>December</option>
                </select>
            </div>
        </div>
        <canvas id="mainChart" style="max-height: 350px;"></canvas>
    </div>
    `,

    product: `
    <div class="title-row" style="margin-bottom:20px;">
        <h2>Product</h2>
        <div>
            <button class="btn-white" onclick="exportProducts()">📤 Export</button>
            <button class="btn-blue" onclick="openModal()">＋ Update Product</button>
        </div>
    </div>
    <div class="main-card">
        <table class="product-table">
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Product ID</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="productTableBody"></tbody>
        </table>
        <div class="pagination-orders" id="products-pagination">
            <button class="page-btn" id="prevProductBtn" onclick="changeProductPage(-1)">Previous</button>
            <span class="page-info" id="product-page-info">01 / 01</span>
            <button class="page-btn" id="nextProductBtn" onclick="changeProductPage(1)">Next</button>
        </div>
    </div>
    `,

    orders: `
        <div class="title-row" style="margin-bottom:20px;">
            <h2>Orders</h2>
            <div>
                <button class="btn-white" onclick="exportOrders()">📤 Export</button>
                <button class="btn-blue" onclick="filterOrders()">All Orders ▾</button>
            </div>
        </div>
        <div class="main-card">
            <div style="overflow-x: auto;">
                <table class="product-table" id="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer Name</th>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody id="orders-tbody"></tbody>
                </table>
            </div>
            <div class="pagination-orders" id="orders-pagination">
                <button class="page-btn" id="prevPageBtn" onclick="changePage(-1)">Previous</button>
                <span class="page-info" id="page-info">01 / 02</span>
                <button class="page-btn" id="nextPageBtn" onclick="changePage(1)">Next</button>
            </div>
        </div>

        <div id="detailModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Detail Order</h3>
                    <button class="modal-close" onclick="closeDetailModal()">&times;</button>
                </div>
                <div class="modal-body" id="detail-body"></div>
            </div>
        </div>
    `,

    analytics: `
    <div class="analytics-grid">
        <div class="main-card full-width">
            <div class="title-row">
                <h2>Weekly Financial</h2>
                <div style="display: flex; gap: 10px;">
                    <select class="custom-select"><option>Week 1</option><option>Week 2</option><option>Week 3</option><option>Week 4</option></select>
                    <select class="custom-select">
                        <option>January</option><option>February</option><option>March</option>
                        <option>April</option><option>May</option><option>June</option>
                        <option>July</option><option>August</option><option>September</option>
                        <option>Oktober</option><option>November</option><option>December</option>
                    </select>
                </div>
            </div>
            <canvas id="financialChart" style="max-height: 300px; width: 100%;"></canvas>
        </div>

        <div class="main-card" style="padding: 20px;">
            <h3 style="margin-bottom: 20px;">Sales By Location</h3>
            <div style="position: relative; height: 320px; width: 100%;">
                <canvas id="locationChart" style="max-height: 300px; width: 100%;"></canvas>
            </div>
        </div>

        <div class="main-card target-card">
            <h3>Monthly Target</h3>
            <div class="chart-box">
                <canvas id="targetChart"></canvas>
                <div class="percentage">66%</div>
            </div>
            <div class="target-stats">
                <div><small>Target</small><p style="font-weight:bold;">10.000.000</p></div>
                <div><small>Revenue</small><p style="font-weight:bold;">5.000.000</p></div>
                <div><small>Today</small><p style="font-weight:bold;">1.000.000</p></div>
            </div>
        </div>

        <div class="main-card full-width">
            <h3>Total Sales</h3>
            <div class="sales-content">
                <div class="donut-box"><canvas id="salesDonut"></canvas></div>
                <div class="sales-legend">
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #6BCB77;"></span><span>Miniatur Karapan Sapi</span></div><strong>1.200.000</strong></div>
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #4ECDC4;"></span><span>Kaos Sakera</span></div><strong>300.000</strong></div>
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #FF6B6B;"></span><span>Odheng</span></div><strong>500.000</strong></div>
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #FF8E72;"></span><span>Buah Siwalan</span></div><strong>600.000</strong></div>
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #FFCC5C;"></span><span>Kue Macho</span></div><strong>700.000</strong></div>
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #A29BFE;"></span><span>Kacang Otok</span></div><strong>1.000.000</strong></div>
                    <div class="legend-item"><div class="item-info"><span class="dot" style="background-color: #4D96FF;"></span><span>Batik Sumenep</span></div><strong>3.000.000</strong></div>
                </div>
            </div>
        </div>
    </div>
    `,
};

// ============================================
// PRODUCT STATUS CONFIG
// ============================================
const productStatusOptions = ["Active", "Inactive", "Pending", "On Sale"];

const productStatusConfig = {
    "Active":   { bg: "#D4F8E2", color: "#27AE60", border: "#27AE60" },
    "Inactive": { bg: "#FFD6D6", color: "#EB5757", border: "#EB5757" },
    "Pending":  { bg: "#FEF9C3", color: "#854D0E", border: "#CA8A04" },
    "On Sale":  { bg: "#DBEAFE", color: "#1E40AF", border: "#3B82F6" },
};

function getProductStatusDropdownStyle(status) {
    const cfg = productStatusConfig[status] || productStatusConfig["Pending"];
    return `background:${cfg.bg}; color:${cfg.color}; border:1.5px solid ${cfg.border};`;
}

// ============================================
// PAGINATION VARIABLES
// ============================================
let currentPageProducts = 0;
const productsPerPage   = 4;
let currentPageOrders   = 0;
const ordersPerPage     = 5;
const statusOptions     = ["Pending", "Processing", "Shipping", "Completed", "Cancelled"];

// ============================================
// RENDER PRODUCTS TABLE (WITH PAGINATION)
// ============================================
function renderProductsTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;

    const totalPages   = Math.ceil(productsData.length / productsPerPage);
    const start        = currentPageProducts * productsPerPage;
    const pageProducts = productsData.slice(start, start + productsPerPage);

    tbody.innerHTML = '';

    pageProducts.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${product.image}" class="prod-thumb"
                         onerror="this.src='https://via.placeholder.com/40'">
                    <strong>${product.name}</strong>
                </div>
            </td>
            <td>${product.id}</td>
            <td>${product.price.toLocaleString('id-ID')},00</td>
            <td>${product.stock} pcs</td>
            <td>${product.type}</td>
            <td>
                <select
                    class="product-status-dropdown"
                    style="${getProductStatusDropdownStyle(product.status)}"
                    onchange="updateProductStatus('${product.id}', this)"
                >
                    ${productStatusOptions.map(opt => `
                        <option value="${opt}" ${product.status === opt ? 'selected' : ''}>${opt}</option>
                    `).join('')}
                </select>
            </td>
            <td>
                <button class="btn-small btn-edit" onclick="openEditModal('${product.id}')">✏️ Edit</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updateProductPaginationButtons();
}

function updateProductPaginationButtons() {
    const totalPages = Math.ceil(productsData.length / productsPerPage);
    const prevBtn    = document.getElementById('prevProductBtn');
    const nextBtn    = document.getElementById('nextProductBtn');
    const pageInfo   = document.getElementById('product-page-info');

    if (prevBtn)  prevBtn.disabled  = currentPageProducts === 0;
    if (nextBtn)  nextBtn.disabled  = currentPageProducts >= totalPages - 1 || totalPages === 0;
    if (pageInfo) pageInfo.textContent = `${(currentPageProducts + 1).toString().padStart(2, '0')} / ${Math.max(totalPages, 1).toString().padStart(2, '0')}`;
}

function changeProductPage(direction) {
    const totalPages = Math.ceil(productsData.length / productsPerPage);
    const newPage    = currentPageProducts + direction;
    if (newPage >= 0 && newPage < totalPages) {
        currentPageProducts = newPage;
        renderProductsTable();
    }
}

// ============================================
// UPDATE PRODUCT STATUS (WITH API)
// ============================================
async function updateProductStatus(productId, selectEl) {
    const newStatus = selectEl.value;
    try {
        const res = await fetch(`/api/produk/${productId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ status: newStatus })
        });

        if (!res.ok) throw new Error('Gagal update status');

        const product = productsData.find(p => p.id === productId);
        if (product) product.status = newStatus;

        selectEl.style.cssText = getProductStatusDropdownStyle(newStatus);
        showToast(`Status "${product?.name}" diubah menjadi ${newStatus}`, 'success');
    } catch (err) {
        console.error(err);
        showToast('Gagal mengubah status', 'error');
        const product = productsData.find(p => p.id === productId);
        if (product) selectEl.value = product.status;
    }
}

// ============================================
// EDIT PRODUCT MODAL & FUNCTIONS
// ============================================
function openEditModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('edit-p-id-display').value = product.id;
    document.getElementById('edit-p-name').value        = product.name;
    document.getElementById('edit-p-price').value       = product.price;
    document.getElementById('edit-p-stock').value       = product.stock;
    document.getElementById('edit-p-type').value        = product.type;
    document.getElementById('edit-p-status').value      = product.status;
    document.getElementById('edit-p-id-hidden').value   = product.id;
    document.getElementById('edit-p-image').value       = '';

    document.getElementById('editProductModal').style.display = 'flex';
}

function closeEditModal() {
    document.getElementById('editProductModal').style.display = 'none';
}

async function saveEditProduct(e) {
    e.preventDefault();
    const productId = document.getElementById('edit-p-id-hidden').value;

    const data = {
        nama:     document.getElementById('edit-p-name').value,
        harga:    parseInt(document.getElementById('edit-p-price').value),
        stok:     parseInt(document.getElementById('edit-p-stock').value),
        kategori: document.getElementById('edit-p-type').value,
        status:   document.getElementById('edit-p-status').value
    };

    const fileInput = document.getElementById('edit-p-image');
    if (fileInput.files && fileInput.files[0]) {
        data.gambar = URL.createObjectURL(fileInput.files[0]);
    }

    try {
        const res = await fetch(`/api/produk/${productId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(data)
        });

        if (!res.ok) throw new Error('Gagal update produk');

        showToast('Produk berhasil diperbarui', 'success');
        closeEditModal();
        await loadProducts();
    } catch (err) {
        console.error(err);
        showToast('Gagal memperbarui produk', 'error');
    }
}

// ============================================
// RENDER ORDERS TABLE
// ============================================
function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    const start      = currentPageOrders * ordersPerPage;
    const pageOrders = ordersData.slice(start, start + ordersPerPage);

    tbody.innerHTML = '';
    pageOrders.forEach(order => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer.name}</td>
            <td>${order.date}</td>
            <td>${formatRupiah(calculateTotalAmount(order))}</td>
            <td>
                <select class="status-dropdown ${getStatusClassForDropdown(order.status)}"
                        onchange="updateOrderStatus('${order.id}', this.value)">
                    ${statusOptions.map(opt => `<option value="${opt}" ${order.status === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                </select>
            </td>
            <td>
                <button class="btn-small btn-detail" onclick="showDetail('${order.id}')">Detail</button>
                <button class="btn-small btn-delete" onclick="deleteOrder('${order.id}')">Hapus</button>
            </td>
        `;
    });

    updateOrderPaginationButtons();
}

function updateOrderPaginationButtons() {
    const totalPages = Math.ceil(ordersData.length / ordersPerPage);
    const prevBtn    = document.getElementById('prevPageBtn');
    const nextBtn    = document.getElementById('nextPageBtn');
    const pageInfo   = document.getElementById('page-info');
    if (prevBtn)  prevBtn.disabled  = currentPageOrders === 0;
    if (nextBtn)  nextBtn.disabled  = currentPageOrders >= totalPages - 1 || totalPages === 0;
    if (pageInfo) pageInfo.textContent = `${(currentPageOrders + 1).toString().padStart(2, '0')} / ${Math.max(totalPages, 1).toString().padStart(2, '0')}`;
}

// ============================================
// ORDER MANAGEMENT (WITH API)
// ============================================
async function updateOrderStatus(orderId, newStatus) {
    try {
        const res = await fetch(`/api/order/${orderId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ status: newStatus })
        });

        if (!res.ok) throw new Error('Gagal update status');

        showToast(`Status order diubah menjadi ${newStatus}`, 'success');
        await loadOrders();
    } catch (err) {
        console.error(err);
        showToast('Gagal mengubah status order', 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm(`Hapus order ${orderId}?`)) return;
    try {
        const res = await fetch(`/api/order/${orderId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal hapus order');

        showToast('Order berhasil dihapus', 'success');
        await loadOrders();
    } catch (err) {
        console.error(err);
        showToast('Gagal menghapus order', 'error');
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(ordersData.length / ordersPerPage);
    const newPage    = currentPageOrders + direction;
    if (newPage >= 0 && newPage < totalPages) {
        currentPageOrders = newPage;
        renderOrdersTable();
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function calculateSubtotal(item)      { return item.quantity * item.price; }
function calculateTotalProduct(items) { return items.reduce((t, i) => t + calculateSubtotal(i), 0); }
function calculateTotalAmount(order)  { return calculateTotalProduct(order.items) + order.shipping.cost; }
function formatRupiah(amount)         { return 'Rp ' + amount.toLocaleString('id-ID'); }

function getStatusBadge(status) {
    const cls = { 'Pending': 'pending', 'Processing': 'processing', 'Shipping': 'shipping', 'Completed': 'active', 'Cancelled': 'inactive' };
    return `<span class="status ${cls[status] || 'pending'}">${status}</span>`;
}

function getStatusClassForDropdown(status) {
    const cls = { 'Pending': 'status-pending', 'Processing': 'status-processing', 'Shipping': 'status-shipping', 'Completed': 'status-success', 'Cancelled': 'status-cancelled' };
    return cls[status] || 'status-pending';
}

// ============================================
// DETAIL ORDER MODAL
// ============================================
function showDetail(orderId) {
    const order = ordersData.find(o => o.id === orderId);
    if (!order) return;

    const totalProduct = calculateTotalProduct(order.items);
    const shippingCost = order.shipping.cost;
    const totalAmount  = totalProduct + shippingCost;

    const itemsHtml = order.items.map(item => `
        <tr>
            <td>${item.name}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${formatRupiah(item.price)}</td>
            <td style="text-align:right;">${formatRupiah(calculateSubtotal(item))}</td>
        </tr>
    `).join('');

    document.getElementById('detail-body').innerHTML = `
        <div class="detail-section">
            <p class="section-title">Informasi Order</p>
            <div class="info-grid">
                <div><span class="label">Order ID</span><span class="value">${order.id}</span></div>
                <div><span class="label">Tanggal Order</span><span class="value">${order.date}</span></div>
                <div><span class="label">Status Order</span><span class="value">${getStatusBadge(order.status)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <p class="section-title">Data Customer</p>
            <div class="info-grid">
                <div><span class="label">Nama Lengkap</span><span class="value">${order.customer.name}</span></div>
                <div><span class="label">Email</span><span class="value">${order.customer.email}</span></div>
                <div><span class="label">No. Telepon</span><span class="value">${order.customer.phone}</span></div>
                <div><span class="label">Alamat</span><span class="value">${order.customer.address}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <p class="section-title">Daftar Produk</p>
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th style="text-align:center">Qty</th>
                        <th style="text-align:right">Harga</th>
                        <th style="text-align:right">Subtotal</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
        </div>
        <div class="detail-section">
            <p class="section-title">Informasi Pengiriman</p>
            <div class="info-grid">
                <div><span class="label">Kurir</span><span class="value">${order.shipping.courier}</span></div>
                <div><span class="label">No. Resi</span><span class="value">${order.shipping.tracking}</span></div>
                <div><span class="label">Biaya Ongkir</span><span class="value">${formatRupiah(shippingCost)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <p class="section-title">Informasi Pembayaran</p>
            <div class="info-grid">
                <div><span class="label">Metode Pembayaran</span><span class="value">${order.payment.method}</span></div>
                <div><span class="label">Status Pembayaran</span>
                    <span class="value">
                        <span class="payment-status ${order.payment.status === 'Lunas' ? 'paid' : 'unpaid'}">${order.payment.status}</span>
                    </span>
                </div>
            </div>
        </div>
        <div class="detail-section summary-section">
            <p class="section-title">Ringkasan Total</p>
            <div class="summary-row"><span>Total Produk</span><span>${formatRupiah(totalProduct)}</span></div>
            <div class="summary-row"><span>Biaya Pengiriman</span><span>${formatRupiah(shippingCost)}</span></div>
            <div class="summary-row total-row"><span>Total Akhir</span><span>${formatRupiah(totalAmount)}</span></div>
        </div>
    `;

    document.getElementById('detailModal').style.display = 'flex';
}

// ============================================
// FILTER & EXPORT ORDERS
// ============================================
function filterOrders() {
    const searchTerm = prompt("Cari berdasarkan Order ID atau Nama Customer:");
    if (searchTerm === null) return;
    if (searchTerm.trim()) {
        const filtered = originalOrdersData.filter(o =>
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            ordersData        = filtered;
            currentPageOrders = 0;
            renderOrdersTable();
            showToast(`Menampilkan ${filtered.length} hasil`, 'info');
        } else {
            showToast("Order tidak ditemukan", 'error');
        }
    } else {
        ordersData        = [...originalOrdersData];
        currentPageOrders = 0;
        renderOrdersTable();
        showToast("Menampilkan semua order", 'info');
    }
}

function exportOrders() {
    let csv = "Order ID,Customer Name,Email,Phone,Date,Total Amount,Status,Payment Method,Payment Status,Courier,Tracking Number\n";
    ordersData.forEach(order => {
        csv += `"${order.id}","${order.customer.name}","${order.customer.email}","${order.customer.phone}","${order.date}","${calculateTotalAmount(order)}","${order.status}","${order.payment.method}","${order.payment.status}","${order.shipping.courier}","${order.shipping.tracking}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href     = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Export berhasil!", 'success');
}

function exportProducts() {
    showToast("Fitur export produk sedang dikembangkan", 'info');
}

// ============================================
// ADD NEW PRODUCT
// ============================================
function openModal() {
    const modal = document.getElementById('productModal');
    if (!modal) {
        console.error('Modal dengan id="productModal" tidak ditemukan di HTML');
        return;
    }
    const productForm = document.getElementById('productForm');
    if (productForm) productForm.reset();
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

async function addNewProduct() {
    const nameEl  = document.getElementById('p-name');
    const priceEl = document.getElementById('p-price');
    const stockEl = document.getElementById('p-stock');
    const typeEl  = document.getElementById('p-type');
    const fileEl  = document.getElementById('p-image');

    if (!nameEl || !priceEl || !stockEl || !typeEl) {
        showToast('Form tidak lengkap, cek id elemen HTML', 'error');
        return;
    }

    const name  = nameEl.value.trim();
    const price = parseInt(priceEl.value);
    const stock = parseInt(stockEl.value);
    const type  = typeEl.value;

    if (!name || isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
        showToast('Semua field harus diisi dengan benar', 'error');
        return;
    }

    // Pakai mapping lokal kalau nama cocok, fallback ke placeholder
    let image = gambarProdukMap[name] || 'https://via.placeholder.com/40';
    if (fileEl && fileEl.files && fileEl.files[0]) {
        image = URL.createObjectURL(fileEl.files[0]);
    }

    try {
        const res = await fetch('/api/produk', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                seller:   userId,
                nama:     name,
                harga:    price,
                stok:     stock,
                kategori: type,
                gambar:   image,
            })
        });

        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.message || 'Gagal tambah produk');
        }

        showToast(`Produk "${name}" berhasil ditambahkan`, 'success');
        closeModal();
        await loadProducts();

        currentPageProducts = Math.max(0, Math.ceil(productsData.length / productsPerPage) - 1);
        renderProductsTable();
    } catch (err) {
        console.error('addNewProduct error:', err);
        showToast(err.message || 'Gagal menambah produk', 'error');
    }
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// NAVIGATION & CHARTS
// ============================================
function navigate(viewName, element) {
    document.getElementById('render-target').innerHTML = views[viewName];
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    if (element) element.classList.add('active');

    if (viewName === 'analytics') {
        initAnalyticsCharts();
    } else if (viewName === 'dashboard') {
        renderDashboardChart();
    } else if (viewName === 'orders') {
        currentPageOrders = 0;
        loadOrders();
    } else if (viewName === 'product') {
        currentPageProducts = 0;
        loadProducts();
    }
}

function renderDashboardChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ label: 'Revenue', data: [5, 10, 6, 11, 13, 2, 8], backgroundColor: '#99D5FF', borderRadius: 10 }]
        }
    });
}

function initAnalyticsCharts() {
    const financialChart = document.getElementById('financialChart');
    const locationChart  = document.getElementById('locationChart');
    const targetChart    = document.getElementById('targetChart');
    const salesDonut     = document.getElementById('salesDonut');

    if (financialChart) new Chart(financialChart, {
        type: 'bar',
        data: {
            labels:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ label: 'Revenue (Rp)', data: [5000000, 10000000, 6500000, 11000000, 13500000, 2500000, 8000000], backgroundColor: '#99D5FF', borderRadius: 10, barPercentage: 0.6 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales:  { y: { beginAtZero: true, ticks: { callback: v => 'Rp ' + (v / 1000000) + 'M' } } }
        }
    });

    if (locationChart) new Chart(locationChart, {
        type: 'bar',
        data: {
            labels:   ['Surabaya', 'Banyuwangi', 'Jogja', 'Malang', 'Semarang', 'Bandung'],
            datasets: [{ label: 'Jumlah Penjualan (pcs)', data: [400, 50, 50, 120, 80, 200], backgroundColor: '#4D96FF', borderRadius: 8 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } }
        }
    });

    if (targetChart) new Chart(targetChart, {
        type: 'doughnut',
        data: {
            datasets: [{
                data:            [66, 34],
                backgroundColor: ['#4D96FF', '#D9E9FF'],
                borderWidth:     0,
                circumference:   180,
                rotation:        270
            }]
        },
        options: {
            cutout:  '85%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } }
        }
    });

    if (salesDonut) new Chart(salesDonut, {
        type: 'doughnut',
        data: {
            labels:   ['Miniatur Karapan Sapi', 'Kaos Sakera', 'Odheng', 'Buah Siwalan', 'Kue Macho', 'Kacang Otok', 'Batik Sumenep'],
            datasets: [{
                data:            [1200000, 300000, 500000, 600000, 700000, 1000000, 3000000],
                backgroundColor: ['#6BCB77', '#4ECDC4', '#FF6B6B', '#FF8E72', '#FFCC5C', '#A29BFE', '#4D96FF'],
                borderWidth:     2
            }]
        },
        options: {
            cutout:  '65%',
            plugins: { legend: { display: false } }
        }
    });
}