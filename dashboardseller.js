// ============================================
// DASHBOARD SELLER - SAKA MADURA
// ============================================

// ============================================
// DATA PRODUCTS
// ============================================
let productsData = [
    { id: "D123", name: "Batik Sumenep", price: 500000, stock: 80, type: "Clothes", status: "Active", image: "./img/batik sumenep.jpg" },
    { id: "D124", name: "Kacang Otok", price: 15000, stock: 60, type: "Food", status: "Inactive", image: "./img/Kacang otok.jpeg" },
    { id: "D125", name: "Kacang Otok", price: 15000, stock: 60, type: "Food", status: "Pending", image: "./img/Kacang otok.jpeg" },
    { id: "D126", name: "Kacang Otok", price: 15000, stock: 60, type: "Food", status: "On Sale", image: "./img/Kacang otok.jpeg" },
    { id: "D127", name: "Odheng Madura", price: 75000, stock: 40, type: "Accessory", status: "Active", image: "./img/batik sumenep.jpg" },
    { id: "D128", name: "Miniatur Karapan Sapi", price: 1200000, stock: 10, type: "Accessory", status: "Active", image: "./img/batik sumenep.jpg" },
];

let currentPageProducts = 0;
const productsPerPage = 4;

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
            <button class="btn-blue" onclick="openModal()">＋ Add New Product</button>
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
// RENDER PRODUCTS TABLE (WITH PAGINATION)
// ============================================
function renderProductsTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;

    const totalPages = Math.ceil(productsData.length / productsPerPage);
    const start = currentPageProducts * productsPerPage;
    const pageProducts = productsData.slice(start, start + productsPerPage);

    tbody.innerHTML = '';

    pageProducts.forEach(product => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${product.image}" class="prod-thumb" onerror="this.src='https://via.placeholder.com/40'">
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
    const prevBtn  = document.getElementById('prevProductBtn');
    const nextBtn  = document.getElementById('nextProductBtn');
    const pageInfo = document.getElementById('product-page-info');

    if (prevBtn)  prevBtn.disabled  = currentPageProducts === 0;
    if (nextBtn)  nextBtn.disabled  = currentPageProducts >= totalPages - 1 || totalPages === 0;
    if (pageInfo) pageInfo.textContent = `${(currentPageProducts + 1).toString().padStart(2, '0')} / ${Math.max(totalPages, 1).toString().padStart(2, '0')}`;
}

function changeProductPage(direction) {
    const totalPages = Math.ceil(productsData.length / productsPerPage);
    const newPage = currentPageProducts + direction;
    if (newPage >= 0 && newPage < totalPages) {
        currentPageProducts = newPage;
        renderProductsTable();
    }
}

function updateProductStatus(productId, selectEl) {
    const newStatus = selectEl.value;
    const product = productsData.find(p => p.id === productId);
    if (product) {
        product.status = newStatus;
        selectEl.style.cssText = getProductStatusDropdownStyle(newStatus);
        showToast(`Status "${product.name}" diubah menjadi ${newStatus}`, 'success');
    }
}

// ============================================
// EDIT PRODUCT MODAL
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

function saveEditProduct(e) {
    e.preventDefault();
    const productId = document.getElementById('edit-p-id-hidden').value;
    const product   = productsData.find(p => p.id === productId);
    if (!product) return;

    product.name   = document.getElementById('edit-p-name').value;
    product.price  = parseInt(document.getElementById('edit-p-price').value);
    product.stock  = parseInt(document.getElementById('edit-p-stock').value);
    product.type   = document.getElementById('edit-p-type').value;
    product.status = document.getElementById('edit-p-status').value;

    const fileInput = document.getElementById('edit-p-image');
    if (fileInput.files && fileInput.files[0]) {
        product.image = URL.createObjectURL(fileInput.files[0]);
    }

    renderProductsTable();
    closeEditModal();
    showToast(`Produk "${product.name}" berhasil diperbarui`, 'success');
}

// ============================================
// DATA ORDERS
// ============================================
let ordersData = [
    {
        id: "SK2458",
        customer: { name: "Haewon", email: "haewon@example.com", phone: "08123456789", address: "Jl. Merpati No. 12, Surabaya" },
        date: "01/01/2026",
        items: [{ name: "Batik Sumenep", quantity: 2, price: 250000 }, { name: "Kacang Otok", quantity: 3, price: 15000 }],
        shipping: { courier: "JNE Reguler", tracking: "JT1234567890", cost: 25000 },
        payment: { method: "Bank Transfer", status: "Lunas" },
        status: "Completed"
    },
    {
        id: "SK2459",
        customer: { name: "Jiwoo", email: "jiwoo@example.com", phone: "08198765432", address: "Jl. Kenari No. 5, Malang" },
        date: "02/01/2026",
        items: [{ name: "Kaos Sakera", quantity: 1, price: 150000 }, { name: "Odheng", quantity: 2, price: 75000 }, { name: "Kue Macho", quantity: 1, price: 50000 }],
        shipping: { courier: "JNE YES", tracking: "JT0987654321", cost: 35000 },
        payment: { method: "COD", status: "Belum Lunas" },
        status: "Pending"
    },
    {
        id: "SK2460",
        customer: { name: "Karina", email: "karina@example.com", phone: "08111222333", address: "Jl. Mawar No. 8, Sidoarjo" },
        date: "03/01/2026",
        items: [{ name: "Miniatur Karapan Sapi", quantity: 1, price: 1200000 }],
        shipping: { courier: "SiCepat", tracking: "SC55667788", cost: 20000 },
        payment: { method: "Credit Card", status: "Lunas" },
        status: "Completed"
    },
    {
        id: "SK2461",
        customer: { name: "Winter", email: "winter@example.com", phone: "08144556677", address: "Jl. Cempaka No. 3, Gresik" },
        date: "04/01/2026",
        items: [{ name: "Buah Siwalan", quantity: 2, price: 100000 }, { name: "Kacang Otok", quantity: 1, price: 15000 }],
        shipping: { courier: "JNE Reguler", tracking: "JT11223344", cost: 25000 },
        payment: { method: "Bank Transfer", status: "Dibatalkan" },
        status: "Cancelled"
    },
    {
        id: "SK2462",
        customer: { name: "Ningning", email: "ningning@example.com", phone: "08199887766", address: "Jl. Anggrek No. 15, Surabaya" },
        date: "05/01/2026",
        items: [{ name: "Batik Sumenep", quantity: 1, price: 250000 }, { name: "Kaos Sakera", quantity: 2, price: 150000 }],
        shipping: { courier: "JNE Reguler", tracking: "JT55443322", cost: 25000 },
        payment: { method: "Bank Transfer", status: "Lunas" },
        status: "Completed"
    },
    {
        id: "SK2463",
        customer: { name: "Ryujin", email: "ryujin@example.com", phone: "08122334455", address: "Jl. Melati No. 7, Pasuruan" },
        date: "06/01/2026",
        items: [{ name: "Odheng", quantity: 3, price: 75000 }, { name: "Kue Macho", quantity: 2, price: 50000 }],
        shipping: { courier: "SiCepat", tracking: "SC99887766", cost: 20000 },
        payment: { method: "COD", status: "Proses" },
        status: "Processing"
    },
    {
        id: "SK2464",
        customer: { name: "Lia", email: "lia@example.com", phone: "08166778899", address: "Jl. Dahlia No. 22, Mojokerto" },
        date: "07/01/2026",
        items: [{ name: "Miniatur Karapan Sapi", quantity: 1, price: 1200000 }, { name: "Buah Siwalan", quantity: 3, price: 100000 }],
        shipping: { courier: "JNE Reguler", tracking: "JT77665544", cost: 25000 },
        payment: { method: "Bank Transfer", status: "Lunas" },
        status: "Shipping"
    },
    {
        id: "SK2465",
        customer: { name: "Yeji", email: "yeji@example.com", phone: "08133221100", address: "Jl. Teratai No. 9, Lumajang" },
        date: "08/01/2026",
        items: [{ name: "Kacang Otok", quantity: 5, price: 15000 }],
        shipping: { courier: "JNE Reguler", tracking: "JT44332211", cost: 15000 },
        payment: { method: "COD", status: "Menunggu" },
        status: "Pending"
    }
];

let currentPageOrders = 0;
const ordersPerPage = 5;
const statusOptions  = ["Pending", "Processing", "Shipping", "Completed", "Cancelled"];

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
    const prevBtn  = document.getElementById('prevPageBtn');
    const nextBtn  = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('page-info');
    if (prevBtn)  prevBtn.disabled  = currentPageOrders === 0;
    if (nextBtn)  nextBtn.disabled  = currentPageOrders >= totalPages - 1 || totalPages === 0;
    if (pageInfo) pageInfo.textContent = `${(currentPageOrders + 1).toString().padStart(2, '0')} / ${Math.max(totalPages, 1).toString().padStart(2, '0')}`;
}

// ============================================
// ORDER MANAGEMENT
// ============================================
function updateOrderStatus(orderId, newStatus) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        if (newStatus === "Completed") order.payment.status = "Lunas";
        renderOrdersTable();
        showToast(`Status order ${orderId} diubah menjadi ${newStatus}`, 'success');
    }
}

function deleteOrder(orderId) {
    if (confirm(`Hapus order ${orderId}?`)) {
        ordersData = ordersData.filter(o => o.id !== orderId);
        const totalPages = Math.ceil(ordersData.length / ordersPerPage);
        if (currentPageOrders >= totalPages && currentPageOrders > 0) currentPageOrders = totalPages - 1;
        if (currentPageOrders < 0) currentPageOrders = 0;
        renderOrdersTable();
        showToast(`Order ${orderId} berhasil dihapus`, 'success');
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
            <td style="padding:10px 0;">${item.name}</td>
            <td style="padding:10px 0;text-align:center;">${item.quantity}</td>
            <td style="padding:10px 0;text-align:right;">${formatRupiah(item.price)}</td>
            <td style="padding:10px 0;text-align:right;">${formatRupiah(calculateSubtotal(item))}</td>
        </tr>
    `).join('');

    document.getElementById('detail-body').innerHTML = `
        <div class="detail-section">
            <h4 class="section-title">Informasi Order</h4>
            <div class="info-grid">
                <div><span class="label">Order ID</span><span class="value">${order.id}</span></div>
                <div><span class="label">Tanggal Order</span><span class="value">${order.date}</span></div>
                <div><span class="label">Status Order</span><span class="value">${getStatusBadge(order.status)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4 class="section-title">Data Customer</h4>
            <div class="info-grid">
                <div><span class="label">Nama Lengkap</span><span class="value">${order.customer.name}</span></div>
                <div><span class="label">Email</span><span class="value">${order.customer.email}</span></div>
                <div><span class="label">No. Telepon</span><span class="value">${order.customer.phone}</span></div>
                <div><span class="label">Alamat</span><span class="value">${order.customer.address}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4 class="section-title">Daftar Produk</h4>
            <table class="detail-table">
                <thead><tr><th>Produk</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Harga</th><th style="text-align:right;">Subtotal</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
            </table>
        </div>
        <div class="detail-section">
            <h4 class="section-title">Informasi Pengiriman</h4>
            <div class="info-grid">
                <div><span class="label">Kurir</span><span class="value">${order.shipping.courier}</span></div>
                <div><span class="label">No. Resi</span><span class="value">${order.shipping.tracking}</span></div>
                <div><span class="label">Biaya Ongkir</span><span class="value">${formatRupiah(shippingCost)}</span></div>
            </div>
        </div>
        <div class="detail-section">
            <h4 class="section-title">Informasi Pembayaran</h4>
            <div class="info-grid">
                <div><span class="label">Metode Pembayaran</span><span class="value">${order.payment.method}</span></div>
                <div><span class="label">Status Pembayaran</span><span class="value"><span class="payment-status ${order.payment.status === 'Lunas' ? 'paid' : 'unpaid'}">${order.payment.status}</span></span></div>
            </div>
        </div>
        <div class="detail-section summary-section">
            <h4 class="section-title">Ringkasan Total</h4>
            <div class="summary-row"><span>Total Produk</span><span>${formatRupiah(totalProduct)}</span></div>
            <div class="summary-row"><span>Biaya Pengiriman</span><span>${formatRupiah(shippingCost)}</span></div>
            <div class="summary-row total-row"><span>Total Akhir</span><span>${formatRupiah(totalAmount)}</span></div>
        </div>
    `;

    document.getElementById('detailModal').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// ============================================
// FILTER & EXPORT ORDERS
// ============================================
let originalOrdersData = [...ordersData];

function filterOrders() {
    const searchTerm = prompt("Cari berdasarkan Order ID atau Nama Customer:");
    if (searchTerm && searchTerm.trim()) {
        const filtered = originalOrdersData.filter(o =>
            o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (filtered.length > 0) {
            ordersData = filtered;
            currentPageOrders = 0;
            renderOrdersTable();
            showToast(`Menampilkan ${filtered.length} hasil`, 'info');
        } else {
            showToast("Order tidak ditemukan", 'error');
        }
    } else if (searchTerm === "") {
        ordersData = [...originalOrdersData];
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
    link.href = URL.createObjectURL(blob);
    link.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    showToast("Export berhasil!", 'success');
}

function exportProducts() {
    showToast("Fitur export produk sedang dikembangkan", 'info');
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
        renderOrdersTable();
    } else if (viewName === 'product') {
        currentPageProducts = 0;
        renderProductsTable();
        const productForm = document.getElementById('productForm');
        if (productForm) productForm.onsubmit = e => { e.preventDefault(); addNewProduct(); };
    }
}

function renderDashboardChart() {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ label: 'Revenue (Rp)', data: [5000000, 10000000, 6500000, 11000000, 13500000, 2500000, 8000000], backgroundColor: '#99D5FF', borderRadius: 10, barPercentage: 0.6 }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: v => 'Rp ' + (v / 1000000) + 'M' } } } }
    });

    if (locationChart) new Chart(locationChart, {
        type: 'bar',
        data: {
            labels: ['Surabaya', 'Banyuwangi', 'Jogja', 'Malang', 'Semarang', 'Bandung'],
            datasets: [{ label: 'Jumlah Penjualan (pcs)', data: [400, 50, 50, 120, 80, 200], backgroundColor: '#4D96FF', borderRadius: 8 }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } } }
    });

    if (targetChart) new Chart(targetChart, {
        type: 'doughnut',
        data: { datasets: [{ data: [66, 34], backgroundColor: ['#4D96FF', '#D9E9FF'], borderWidth: 0, circumference: 180, rotation: 270 }] },
        options: { cutout: '85%', plugins: { tooltip: { enabled: false } } }
    });

    if (salesDonut) new Chart(salesDonut, {
        type: 'doughnut',
        data: {
            labels: ['Karapan', 'Kaos', 'Odheng', 'Siwalan', 'Kue', 'Kacang', 'Batik'],
            datasets: [{ data: [12, 5, 8, 10, 15, 20, 30], backgroundColor: ['#6BCB77', '#4ECDC4', '#FF6B6B', '#FF8E72', '#FFCC5C', '#A29BFE', '#4D96FF'], borderWidth: 0 }]
        },
        options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, cutout: '60%' }
    });
}

// ============================================
// PRODUCT MODAL (ADD)
// ============================================
function openModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
    const productForm = document.getElementById('productForm');
    if (productForm) productForm.onsubmit = e => { e.preventDefault(); addNewProduct(); };
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

function addNewProduct() {
    const name      = document.getElementById('p-name').value.trim();
    const id        = document.getElementById('p-id').value.trim();
    const price     = parseInt(document.getElementById('p-price').value);
    const stock     = parseInt(document.getElementById('p-stock').value);
    const type      = document.getElementById('p-type').value;
    const statusEl  = document.getElementById('p-status-add');
    const status    = statusEl ? statusEl.value : 'Active';
    const fileInput = document.getElementById('p-image');

    let image = 'https://via.placeholder.com/40';
    if (fileInput.files && fileInput.files[0]) image = URL.createObjectURL(fileInput.files[0]);

    if (productsData.find(p => p.id === id)) { showToast(`Product ID "${id}" sudah ada!`, 'error'); return; }

    productsData.push({ id, name, price, stock, type, status, image });
    currentPageProducts = Math.ceil(productsData.length / productsPerPage) - 1;
    renderProductsTable();
    closeModal();
    document.getElementById('productForm').reset();
    showToast(`Produk "${name}" berhasil ditambahkan`, 'success');
}

// ============================================
// INJECT EDIT PRODUCT MODAL INTO BODY
// ============================================
function injectEditModal() {
    if (document.getElementById('editProductModal')) return;
    const el = document.createElement('div');
    el.id = 'editProductModal';
    el.innerHTML = `
        <div class="edit-modal-content">
            <div class="edit-modal-header">
                <h2>Edit Product</h2>
                <span class="close-modal" onclick="closeEditModal()">&times;</span>
            </div>
            <div class="edit-modal-body">
                <form id="editProductForm" onsubmit="saveEditProduct(event)">
                    <input type="hidden" id="edit-p-id-hidden">
                    <div class="form-group">
                        <label for="edit-p-name">Product Name</label>
                        <input type="text" id="edit-p-name" placeholder="Nama produk" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-p-id-display">Product ID</label>
                            <input type="text" id="edit-p-id-display" disabled style="background:#f5f5f5;color:#888;cursor:not-allowed;">
                        </div>
                        <div class="form-group">
                            <label for="edit-p-price">Price (Rp)</label>
                            <input type="number" id="edit-p-price" placeholder="500000" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="edit-p-stock">Stock</label>
                            <input type="number" id="edit-p-stock" placeholder="10" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-p-type">Type</label>
                            <select id="edit-p-type">
                                <option value="Clothes">Clothes</option>
                                <option value="Food">Food</option>
                                <option value="Accessory">Accessory</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="edit-p-status">Status</label>
                        <select id="edit-p-status">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Pending">Pending</option>
                            <option value="On Sale">On Sale</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-p-image">Product Image <span style="color:#aaa;font-weight:400;">(opsional)</span></label>
                        <input type="file" id="edit-p-image" accept="image/*">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-white" onclick="closeEditModal()">Cancel</button>
                        <button type="submit" class="btn-blue">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.body.appendChild(el);
}

// ============================================
// GLOBAL STYLES
// ============================================
const style = document.createElement('style');
style.textContent = `
    /* ---- Product Status Dropdown ---- */
    .product-status-dropdown {
        appearance: none;
        -webkit-appearance: none;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        outline: none;
        min-width: 90px;
        text-align: center;
    }
    .product-status-dropdown:focus { box-shadow: 0 0 0 3px rgba(0,149,255,0.15); }

    /* ---- Edit Button ---- */
    .btn-edit {
        background: #F0F7FF;
        color: #0095FF;
        border: 1.5px solid #0095FF;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        white-space: nowrap;
    }
    .btn-edit:hover { background: #0095FF; color: white; }

    /* ---- Edit Product Modal Overlay ---- */
    #editProductModal {
        display: none;
        position: fixed;
        z-index: 1001;
        left: 0; top: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.45);
        backdrop-filter: blur(5px);
        align-items: flex-start;   /* allow modal box to sit at top when tall */
        justify-content: center;
        overflow-y: auto;           /* overlay scrolls if needed */
        padding: 30px 0;
    }

    /* ---- Edit Modal Box ---- */
    .edit-modal-content {
        background: white;
        border-radius: 25px;
        width: 500px;
        max-width: 95vw;
        max-height: 88vh;           /* cap height */
        display: flex;
        flex-direction: column;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        animation: modalSlideIn 0.3s ease;
        margin: auto;
    }

    /* ---- Sticky header — never scrolls away ---- */
    .edit-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 22px 28px 18px;
        border-bottom: 1px solid #f0f0f0;
        flex-shrink: 0;
    }
    .edit-modal-header h2 { font-size: 20px; font-weight: 700; margin: 0; }

    /* ---- Scrollable form body ---- */
    .edit-modal-body {
        padding: 24px 28px 28px;
        overflow-y: auto;           /* ← scroll happens here */
        flex: 1;
        overscroll-behavior: contain;
    }

    /* ---- Order Status Dropdown ---- */
    .status-dropdown {
        padding: 6px 12px;
        border-radius: 20px;
        border: 1px solid #ddd;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        background: white;
        transition: all 0.2s;
    }
    .status-dropdown:focus { outline: none; border-color: #4D96FF; }
    .status-dropdown.status-pending    { background:#FFF3E0; color:#FF9800; border-color:#FF9800; }
    .status-dropdown.status-processing { background:#E3F2FD; color:#2196F3; border-color:#2196F3; }
    .status-dropdown.status-shipping   { background:#E8F5E9; color:#4CAF50; border-color:#4CAF50; }
    .status-dropdown.status-success    { background:#E8F5E9; color:#4CAF50; border-color:#4CAF50; }
    .status-dropdown.status-cancelled  { background:#FFEBEE; color:#f44336; border-color:#f44336; }

    /* ---- Small Buttons ---- */
    .btn-small {
        padding: 5px 12px;
        margin: 0 3px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
    }
    .btn-detail { background: #4D96FF; color: white; }
    .btn-detail:hover { background: #3a7ccd; }
    .btn-delete { background: #ff4757; color: white; }
    .btn-delete:hover { background: #e64553; }

    /* ---- Shared Pagination (Products & Orders) ---- */
    .pagination-orders {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 16px;
        margin-top: 24px;
        padding: 12px 0;
    }
    .pagination-orders .page-btn {
        padding: 8px 20px;
        border: 1px solid #ddd;
        background: white;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.2s;
    }
    .pagination-orders .page-btn:hover:not(:disabled) { background: #4D96FF; color: white; border-color: #4D96FF; }
    .pagination-orders .page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .page-info { font-size: 14px; font-weight: 500; color: #666; background: #f5f5f5; padding: 6px 14px; border-radius: 20px; }

    /* ---- Order Detail Modal ---- */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0; top: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.5);
        align-items: center;
        justify-content: center;
    }
    .modal-content {
        background: white;
        border-radius: 20px;
        width: 90%;
        max-width: 700px;
        max-height: 85vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        animation: modalSlideIn 0.3s ease;
    }
    @keyframes modalSlideIn {
        from { transform: translateY(-30px); opacity: 0; }
        to   { transform: translateY(0);     opacity: 1; }
    }
    .modal-header { display:flex; justify-content:space-between; align-items:center; padding:18px 24px; background:linear-gradient(135deg,#4D96FF 0%,#3570c4 100%); color:white; }
    .modal-header h3 { margin:0; font-size:18px; }
    .modal-close { background:rgba(255,255,255,0.2); border:none; font-size:24px; cursor:pointer; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
    .modal-close:hover { background:rgba(255,255,255,0.3); }
    .modal-body { padding:24px; max-height:calc(85vh - 70px); overflow-y:auto; }

    /* ---- Detail Sections ---- */
    .detail-section { margin-bottom:28px; border-bottom:1px solid #eee; padding-bottom:20px; }
    .detail-section:last-child { border-bottom:none; margin-bottom:0; padding-bottom:0; }
    .section-title { font-size:16px; font-weight:600; color:#333; margin-bottom:16px; padding-left:12px; border-left:4px solid #4D96FF; }
    .info-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px 20px; }
    .info-grid div { display:flex; flex-direction:column; }
    .info-grid .label { font-size:12px; color:#888; margin-bottom:4px; }
    .info-grid .value { font-size:14px; font-weight:500; color:#333; }
    .detail-table { width:100%; border-collapse:collapse; font-size:13px; }
    .detail-table th { text-align:left; padding:10px 0; color:#888; font-weight:500; border-bottom:1px solid #eee; }
    .detail-table td { padding:10px 0; border-bottom:1px solid #f0f0f0; }
    .payment-status { display:inline-block; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:500; }
    .payment-status.paid   { background:#E8F5E9; color:#4CAF50; }
    .payment-status.unpaid { background:#FFF3E0; color:#FF9800; }
    .summary-section { background:#F8F9FC; margin-top:8px; padding:16px 20px; border-radius:16px; border-bottom:none; }
    .summary-row { display:flex; justify-content:space-between; padding:8px 0; font-size:14px; }
    .total-row { border-top:2px dashed #ddd; margin-top:8px; padding-top:12px; font-weight:700; font-size:16px; color:#4D96FF; }

    /* ---- Toast ---- */
    .toast { position:fixed; bottom:24px; right:24px; background:#333; color:white; padding:12px 24px; border-radius:12px; display:flex; align-items:center; gap:10px; z-index:10000; animation:toastIn 0.3s ease; box-shadow:0 4px 15px rgba(0,0,0,0.2); font-size:14px; }
    .toast-success { background:#4CAF50; }
    .toast-error   { background:#f44336; }
    .toast-info    { background:#2196F3; }
    .toast-icon { font-weight:bold; font-size:16px; }
    @keyframes toastIn  { from { transform:translateX(100%); opacity:0; } to { transform:translateX(0); opacity:1; } }
    .toast-hide { animation:toastOut 0.3s ease forwards; }
    @keyframes toastOut { to { transform:translateX(100%); opacity:0; } }

    /* ---- Add Product Modal ---- */
    #productModal .modal-content { max-width:500px; }
    #productModal .modal-header  { background:linear-gradient(135deg,#4D96FF 0%,#3570c4 100%); }
`;
document.head.appendChild(style);

// ============================================
// WINDOW CLICK HANDLER
// ============================================
window.onclick = function(e) {
    const modal       = document.getElementById('productModal');
    const detailModal = document.getElementById('detailModal');
    const editModal   = document.getElementById('editProductModal');
    if (e.target === modal)       closeModal();
    if (e.target === detailModal) closeDetailModal();
    if (e.target === editModal)   closeEditModal();
};

// ============================================
// INITIAL START
// ============================================
window.onload = () => {
    injectEditModal();
    navigate('dashboard', document.querySelector('.nav-item'));
};