// ============================================
// DASHBOARD SELLER - SAKA MADURA
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
                    <option>Week 1</option>
                    <option>Week 2</option>
                    <option>Week 3</option>
                    <option>Week 4</option>
                </select>
                <select class="custom-select" id="monthSelect">
                    <option>January</option>
                    <option>February</option>
                    <option>March</option>
                    <option>April</option>
                    <option>May</option>
                    <option>June</option>
                    <option>July</option>
                    <option>August</option>
                    <option>September</option>
                    <option>Oktober</option>
                    <option>November</option>
                    <option>December</option>
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
                </tr>
            </thead>
            <tbody id="productTableBody">
                <tr>
                    <td><div class="product-info"><img src="./img/batik sumenep.jpg" class="prod-thumb"><strong>Batik Sumenep</strong></div></td>
                    <td>D123</td>
                    <td>500.000,00</td>
                    <td>80 pcs</td>
                    <td>clothes</td>
                    <td><span class="status active">Active</span></td>
                </tr>
                <tr>
                    <td><div class="product-info"><img src="./img/Kacang otok.jpeg" class="prod-thumb"><strong>Kacang Otok</strong></div></td>
                    <td>D124</td>
                    <td>15.000,00</td>
                    <td>60 pcs</td>
                    <td>Food</td>
                    <td><span class="status inactive">Inactive</span></td>
                </tr>
                <tr>
                    <td><div class="product-info"><img src="./img/Kacang otok.jpeg" class="prod-thumb"><strong>Kacang Otok</strong></div></td>
                    <td>D125</td>
                    <td>15.000,00</td>
                    <td>60 pcs</td>
                    <td>Food</td>
                    <td><span class="status pending">Pending</span></td>
                </tr>
                <tr>
                    <td><div class="product-info"><img src="./img/Kacang otok.jpeg" class="prod-thumb"><strong>Kacang Otok</strong></div></td>
                    <td>D126</td>
                    <td>15.000,00</td>
                    <td>60 pcs</td>
                    <td>Food</td>
                    <td><span class="status onsale">On Sale</span></td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <span class="page-btn">Previous</span>
            <span class="page-num">01</span>
            <span class="page-num">02</span>
            <span class="page-num active">03</span>
            <span class="page-num">04</span>
            <span class="page-btn">Next</span>
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

        <!-- Modal Detail Order -->
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
                    <select class="custom-select">
                        <option>Week 1</option>
                        <option>Week 2</option>
                        <option>Week 3</option>
                        <option>Week 4</option>
                    </select>
                    <select class="custom-select">
                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>Oktober</option>
                        <option>November</option>
                        <option>December</option>
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
                <div class="donut-box">
                    <canvas id="salesDonut"></canvas>
                </div>
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
// DATA ORDERS
// ============================================
let ordersData = [
    {
        id: "SK2458",
        customer: {
            name: "Haewon",
            email: "haewon@example.com",
            phone: "08123456789",
            address: "Jl. Merpati No. 12, Surabaya"
        },
        date: "01/01/2026",
        items: [
            { name: "Batik Sumenep", quantity: 2, price: 250000 },
            { name: "Kacang Otok", quantity: 3, price: 15000 }
        ],
        shipping: {
            courier: "JNE Reguler",
            tracking: "JT1234567890",
            cost: 25000
        },
        payment: {
            method: "Bank Transfer",
            status: "Lunas"
        },
        status: "Completed"
    },
    {
        id: "SK2459",
        customer: {
            name: "Jiwoo",
            email: "jiwoo@example.com",
            phone: "08198765432",
            address: "Jl. Kenari No. 5, Malang"
        },
        date: "02/01/2026",
        items: [
            { name: "Kaos Sakera", quantity: 1, price: 150000 },
            { name: "Odheng", quantity: 2, price: 75000 },
            { name: "Kue Macho", quantity: 1, price: 50000 }
        ],
        shipping: {
            courier: "JNE YES",
            tracking: "JT0987654321",
            cost: 35000
        },
        payment: {
            method: "COD",
            status: "Belum Lunas"
        },
        status: "Pending"
    },
    {
        id: "SK2460",
        customer: {
            name: "Karina",
            email: "karina@example.com",
            phone: "08111222333",
            address: "Jl. Mawar No. 8, Sidoarjo"
        },
        date: "03/01/2026",
        items: [
            { name: "Miniatur Karapan Sapi", quantity: 1, price: 1200000 }
        ],
        shipping: {
            courier: "SiCepat",
            tracking: "SC55667788",
            cost: 20000
        },
        payment: {
            method: "Credit Card",
            status: "Lunas"
        },
        status: "Completed"
    },
    {
        id: "SK2461",
        customer: {
            name: "Winter",
            email: "winter@example.com",
            phone: "08144556677",
            address: "Jl. Cempaka No. 3, Gresik"
        },
        date: "04/01/2026",
        items: [
            { name: "Buah Siwalan", quantity: 2, price: 100000 },
            { name: "Kacang Otok", quantity: 1, price: 15000 }
        ],
        shipping: {
            courier: "JNE Reguler",
            tracking: "JT11223344",
            cost: 25000
        },
        payment: {
            method: "Bank Transfer",
            status: "Dibatalkan"
        },
        status: "Cancelled"
    },
    {
        id: "SK2462",
        customer: {
            name: "Ningning",
            email: "ningning@example.com",
            phone: "08199887766",
            address: "Jl. Anggrek No. 15, Surabaya"
        },
        date: "05/01/2026",
        items: [
            { name: "Batik Sumenep", quantity: 1, price: 250000 },
            { name: "Kaos Sakera", quantity: 2, price: 150000 }
        ],
        shipping: {
            courier: "JNE Reguler",
            tracking: "JT55443322",
            cost: 25000
        },
        payment: {
            method: "Bank Transfer",
            status: "Lunas"
        },
        status: "Completed"
    },
    {
        id: "SK2463",
        customer: {
            name: "Ryujin",
            email: "ryujin@example.com",
            phone: "08122334455",
            address: "Jl. Melati No. 7, Pasuruan"
        },
        date: "06/01/2026",
        items: [
            { name: "Odheng", quantity: 3, price: 75000 },
            { name: "Kue Macho", quantity: 2, price: 50000 }
        ],
        shipping: {
            courier: "SiCepat",
            tracking: "SC99887766",
            cost: 20000
        },
        payment: {
            method: "COD",
            status: "Proses"
        },
        status: "Processing"
    },
    {
        id: "SK2464",
        customer: {
            name: "Lia",
            email: "lia@example.com",
            phone: "08166778899",
            address: "Jl. Dahlia No. 22, Mojokerto"
        },
        date: "07/01/2026",
        items: [
            { name: "Miniatur Karapan Sapi", quantity: 1, price: 1200000 },
            { name: "Buah Siwalan", quantity: 3, price: 100000 }
        ],
        shipping: {
            courier: "JNE Reguler",
            tracking: "JT77665544",
            cost: 25000
        },
        payment: {
            method: "Bank Transfer",
            status: "Lunas"
        },
        status: "Shipping"
    },
    {
        id: "SK2465",
        customer: {
            name: "Yeji",
            email: "yeji@example.com",
            phone: "08133221100",
            address: "Jl. Teratai No. 9, Lumajang"
        },
        date: "08/01/2026",
        items: [
            { name: "Kacang Otok", quantity: 5, price: 15000 }
        ],
        shipping: {
            courier: "JNE Reguler",
            tracking: "JT44332211",
            cost: 15000
        },
        payment: {
            method: "COD",
            status: "Menunggu"
        },
        status: "Pending"
    }
];

let currentPageOrders = 0;
const ordersPerPage = 5;
const statusOptions = ["Pending", "Processing", "Shipping", "Completed", "Cancelled"];

// ============================================
// HELPER FUNCTIONS
// ============================================
function calculateSubtotal(item) {
    return item.quantity * item.price;
}

function calculateTotalProduct(items) {
    return items.reduce((total, item) => total + calculateSubtotal(item), 0);
}

function calculateTotalAmount(order) {
    const totalProduct = calculateTotalProduct(order.items);
    const shippingCost = order.shipping.cost;
    return totalProduct + shippingCost;
}

function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function getStatusBadge(status) {
    const statusClass = {
        'Pending': 'pending',
        'Processing': 'processing',
        'Shipping': 'shipping',
        'Completed': 'active',
        'Cancelled': 'inactive'
    };
    return `<span class="status ${statusClass[status] || 'pending'}">${status}</span>`;
}

function getStatusClassForDropdown(status) {
    const classes = {
        'Pending': 'status-pending',
        'Processing': 'status-processing',
        'Shipping': 'status-shipping',
        'Completed': 'status-success',
        'Cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-pending';
}

// ============================================
// RENDER ORDERS TABLE
// ============================================
function renderOrdersTable() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;
    
    const totalPages = Math.ceil(ordersData.length / ordersPerPage);
    const start = currentPageOrders * ordersPerPage;
    const end = start + ordersPerPage;
    const pageOrders = ordersData.slice(start, end);
    
    tbody.innerHTML = '';
    
    pageOrders.forEach(order => {
        const totalAmount = calculateTotalAmount(order);
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer.name}</td>
            <td>${order.date}</td>
            <td>${formatRupiah(totalAmount)}</td>
            <td>
                <select class="status-dropdown ${getStatusClassForDropdown(order.status)}" 
                        onchange="updateOrderStatus('${order.id}', this.value)">
                    ${statusOptions.map(opt => `
                        <option value="${opt}" ${order.status === opt ? 'selected' : ''}>
                            ${opt}
                        </option>
                    `).join('')}
                </select>
            </td>
            <td>
                <button class="btn-small btn-detail" onclick="showDetail('${order.id}')">Detail</button>
                <button class="btn-small btn-delete" onclick="deleteOrder('${order.id}')">Hapus</button>
            </td>
        `;
    });
    
    updatePaginationButtons();
}

function updatePaginationButtons() {
    const totalPages = Math.ceil(ordersData.length / ordersPerPage);
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('page-info');
    
    if (prevBtn) {
        prevBtn.disabled = currentPageOrders === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPageOrders >= totalPages - 1 || totalPages === 0;
    }
    if (pageInfo) {
        pageInfo.textContent = `${(currentPageOrders + 1).toString().padStart(2, '0')} / ${totalPages.toString().padStart(2, '0')}`;
    }
}

// ============================================
// ORDER MANAGEMENT
// ============================================
function updateOrderStatus(orderId, newStatus) {
    const order = ordersData.find(o => o.id === orderId);
    if (order) {
        order.status = newStatus;
        if (newStatus === "Completed") {
            order.payment.status = "Lunas";
        }
        renderOrdersTable();
        showToast(`Status order ${orderId} diubah menjadi ${newStatus}`, 'success');
    }
}

function deleteOrder(orderId) {
    if (confirm(`Hapus order ${orderId}?`)) {
        ordersData = ordersData.filter(o => o.id !== orderId);
        const totalPages = Math.ceil(ordersData.length / ordersPerPage);
        if (currentPageOrders >= totalPages && currentPageOrders > 0) {
            currentPageOrders = totalPages - 1;
        }
        if (currentPageOrders < 0) currentPageOrders = 0;
        renderOrdersTable();
        showToast(`Order ${orderId} berhasil dihapus`, 'success');
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(ordersData.length / ordersPerPage);
    const newPage = currentPageOrders + direction;
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
    const totalAmount = totalProduct + shippingCost;
    
    // Items table HTML
    const itemsHtml = order.items.map(item => {
        const subtotal = calculateSubtotal(item);
        return `
            <tr>
                <td style="padding: 10px 0;">${item.name}</td>
                <td style="padding: 10px 0; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px 0; text-align: right;">${formatRupiah(item.price)}</td>
                <td style="padding: 10px 0; text-align: right;">${formatRupiah(subtotal)}</td>
            </tr>
        `;
    }).join('');
    
    const detailHtml = `
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
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th style="text-align: center;">Qty</th>
                        <th style="text-align: right;">Harga</th>
                        <th style="text-align: right;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
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
            <div class="summary-row">
                <span>Total Produk</span>
                <span>${formatRupiah(totalProduct)}</span>
            </div>
            <div class="summary-row">
                <span>Biaya Pengiriman</span>
                <span>${formatRupiah(shippingCost)}</span>
            </div>
            <div class="summary-row total-row">
                <span>Total Akhir</span>
                <span>${formatRupiah(totalAmount)}</span>
            </div>
        </div>
    `;
    
    document.getElementById('detail-body').innerHTML = detailHtml;
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
        resetOrdersFilter();
    }
}

function resetOrdersFilter() {
    ordersData = [...originalOrdersData];
    currentPageOrders = 0;
    renderOrdersTable();
    showToast("Menampilkan semua order", 'info');
}

function exportOrders() {
    let csv = "Order ID,Customer Name,Email,Phone,Date,Total Amount,Status,Payment Method,Payment Status,Courier,Tracking Number\n";
    ordersData.forEach(order => {
        const totalAmount = calculateTotalAmount(order);
        csv += `"${order.id}","${order.customer.name}","${order.customer.email}","${order.customer.phone}","${order.date}","${totalAmount}","${order.status}","${order.payment.method}","${order.payment.status}","${order.shipping.courier}","${order.shipping.tracking}"\n`;
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
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
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
    const locationChart = document.getElementById('locationChart');
    const targetChart = document.getElementById('targetChart');
    const salesDonut = document.getElementById('salesDonut');
    
    if (financialChart) {
        new Chart(financialChart, {
            type: 'bar',
            data: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Revenue (Rp)',
                    data: [5000000, 10000000, 6500000, 11000000, 13500000, 2500000, 8000000],
                    backgroundColor: '#99D5FF',
                    borderRadius: 10,
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { callback: v => 'Rp ' + (v / 1000000) + 'M' } }
                }
            }
        });
    }
    
    if (locationChart) {
        new Chart(locationChart, {
            type: 'bar',
            data: {
                labels: ['Surabaya', 'Banyuwangi', 'Jogja', 'Malang', 'Semarang', 'Bandung'],
                datasets: [{
                    label: 'Jumlah Penjualan (pcs)',
                    data: [400, 50, 50, 120, 80, 200],
                    backgroundColor: '#4D96FF',
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } }
            }
        });
    }
    
    if (targetChart) {
        new Chart(targetChart, {
            type: 'doughnut',
            data: { datasets: [{ data: [66, 34], backgroundColor: ['#4D96FF', '#D9E9FF'], borderWidth: 0, circumference: 180, rotation: 270 }] },
            options: { cutout: '85%', plugins: { tooltip: { enabled: false } } }
        });
    }
    
    if (salesDonut) {
        new Chart(salesDonut, {
            type: 'doughnut',
            data: {
                labels: ['Karapan', 'Kaos', 'Odheng', 'Siwalan', 'Kue', 'Kacang', 'Batik'],
                datasets: [{
                    data: [12, 5, 8, 10, 15, 20, 30],
                    backgroundColor: ['#6BCB77', '#4ECDC4', '#FF6B6B', '#FF8E72', '#FFCC5C', '#A29BFE', '#4D96FF'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, maintainAspectRatio: true, plugins: { legend: { display: false } }, cutout: '60%' }
        });
    }
}

// ============================================
// PRODUCT MODAL
// ============================================
function openModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'block';
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if (modal) modal.style.display = 'none';
}

// ============================================
// GLOBAL STYLES
// ============================================
const style = document.createElement('style');
style.textContent = `
    /* Status Dropdown */
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
    .status-dropdown.status-pending { background: #FFF3E0; color: #FF9800; border-color: #FF9800; }
    .status-dropdown.status-processing { background: #E3F2FD; color: #2196F3; border-color: #2196F3; }
    .status-dropdown.status-shipping { background: #E8F5E9; color: #4CAF50; border-color: #4CAF50; }
    .status-dropdown.status-success { background: #E8F5E9; color: #4CAF50; border-color: #4CAF50; }
    .status-dropdown.status-cancelled { background: #FFEBEE; color: #f44336; border-color: #f44336; }
    
    /* Buttons */
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
    
    /* Pagination */
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
        transition: all 0.2s;
    }
    .pagination-orders .page-btn:hover:not(:disabled) {
        background: #4D96FF;
        color: white;
        border-color: #4D96FF;
    }
    .pagination-orders .page-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .page-info {
        font-size: 14px;
        font-weight: 500;
        color: #666;
        background: #f5f5f5;
        padding: 6px 14px;
        border-radius: 20px;
    }
    
    /* Modal */
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
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
        to { transform: translateY(0); opacity: 1; }
    }
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 24px;
        background: linear-gradient(135deg, #4D96FF 0%, #3570c4 100%);
        color: white;
    }
    .modal-header h3 {
        margin: 0;
        font-size: 18px;
    }
    .modal-close {
        background: rgba(255,255,255,0.2);
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }
    .modal-close:hover {
        background: rgba(255,255,255,0.3);
    }
    .modal-body {
        padding: 24px;
        max-height: calc(85vh - 70px);
        overflow-y: auto;
    }
    
    /* Detail Section */
    .detail-section {
        margin-bottom: 28px;
        border-bottom: 1px solid #eee;
        padding-bottom: 20px;
    }
    .detail-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
        padding-bottom: 0;
    }
    .section-title {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin-bottom: 16px;
        padding-left: 12px;
        border-left: 4px solid #4D96FF;
    }
    .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px 20px;
    }
    .info-grid div {
        display: flex;
        flex-direction: column;
    }
    .info-grid .label {
        font-size: 12px;
        color: #888;
        margin-bottom: 4px;
    }
    .info-grid .value {
        font-size: 14px;
        font-weight: 500;
        color: #333;
    }
    .detail-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 13px;
    }
    .detail-table th {
        text-align: left;
        padding: 10px 0;
        color: #888;
        font-weight: 500;
        border-bottom: 1px solid #eee;
    }
    .detail-table td {
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;
    }
    .payment-status {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    .payment-status.paid {
        background: #E8F5E9;
        color: #4CAF50;
    }
    .payment-status.unpaid {
        background: #FFF3E0;
        color: #FF9800;
    }
    .summary-section {
        background: #F8F9FC;
        margin-top: 8px;
        padding: 16px 20px;
        border-radius: 16px;
        border-bottom: none;
    }
    .summary-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 14px;
    }
    .total-row {
        border-top: 2px dashed #ddd;
        margin-top: 8px;
        padding-top: 12px;
        font-weight: 700;
        font-size: 16px;
        color: #4D96FF;
    }
    
    /* Toast */
    .toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: toastIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-size: 14px;
    }
    .toast-success { background: #4CAF50; }
    .toast-error { background: #f44336; }
    .toast-info { background: #2196F3; }
    .toast-icon { font-weight: bold; font-size: 16px; }
    @keyframes toastIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    .toast-hide {
        animation: toastOut 0.3s ease forwards;
    }
    @keyframes toastOut {
        to { transform: translateX(100%); opacity: 0; }
    }
    
    /* Product Modal (existing) */
    #productModal .modal-content { max-width: 500px; }
    #productModal .modal-header { background: linear-gradient(135deg, #4D96FF 0%, #3570c4 100%); }
`;
document.head.appendChild(style);

// ============================================
// WINDOW CLICK HANDLER
// ============================================
window.onclick = function(e) {
    const modal = document.getElementById('productModal');
    const detailModal = document.getElementById('detailModal');
    if (e.target === modal) closeModal();
    if (e.target === detailModal) closeDetailModal();
};

// ============================================
// INITIAL START
// ============================================
window.onload = () => {
    navigate('dashboard', document.querySelector('.nav-item'));
};