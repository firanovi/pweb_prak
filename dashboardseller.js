// ============================================
// DASHBOARD SELLER - SAKA MADURA
// ============================================

// ============================================
// CONFIG
// ============================================
const userId   = localStorage.getItem("userId");
const sellerId = localStorage.getItem("sellerId");

// ============================================
// LOAD USER PROFILE
// ============================================
async function loadUserProfile() {
    try {
        const nama  = localStorage.getItem("userName")  || "Seller";
        const email = localStorage.getItem("userEmail") || "-";
        setProfileDisplay(nama, email);

        // Uncomment kalau sudah ada API user:
        // const res  = await fetch(`/api/user/${userId}`);
        // const data = await res.json();
        // setProfileDisplay(data.nama, data.email);
        // localStorage.setItem("userName",  data.nama);
        // localStorage.setItem("userEmail", data.email);

    } catch (err) {
        console.error('Gagal load profil:', err);
    }
}

function setProfileDisplay(nama, email) {
    const initials = nama
        .split(" ")
        .map(w => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const elName    = document.getElementById("header-user-name");
    const elEmail   = document.getElementById("header-user-email");
    const elInitial = document.getElementById("header-user-initial");
    const elDdName  = document.getElementById("dropdown-user-name");
    const elDdEmail = document.getElementById("dropdown-user-email");

    if (elName)    elName.textContent    = nama;
    if (elEmail)   elEmail.textContent   = email;
    if (elInitial) elInitial.textContent = initials;
    if (elDdName)  elDdName.textContent  = nama;
    if (elDdEmail) elDdEmail.textContent = email;
}

// ============================================
// TOGGLE DROPDOWN PROFIL
// ============================================
function toggleProfileDropdown() {
    const dd = document.getElementById("profile-dropdown");
    const ch = document.getElementById("profile-chevron");
    if (!dd) return;
    const isOpen = dd.classList.toggle("show");
    if (ch) ch.classList.toggle("open", isOpen);
}

document.addEventListener("click", function(e) {
    const trigger = document.getElementById("profile-trigger");
    const dd      = document.getElementById("profile-dropdown");
    if (trigger && dd && !trigger.contains(e.target)) {
        dd.classList.remove("show");
        const ch = document.getElementById("profile-chevron");
        if (ch) ch.classList.remove("open");
    }
});

// ============================================
// NAVIGASI DARI DROPDOWN
// ============================================
function goToProfile() {
    window.location.href = "./profilseller.html";
}

function goToSettings() {
    window.location.href = "./settingsseller.html";
}

// ============================================
// LOGOUT
// ============================================
function logout() {
    if (!confirm("Yakin ingin keluar?")) return;

    localStorage.removeItem("userId");
    localStorage.removeItem("sellerId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    showToast("Berhasil keluar. Mengalihkan...", "success");

    setTimeout(() => {
        window.location.href = "./loginseller.html";
    }, 1500);
}

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
// DATA PRODUCTS
// ============================================
let productsData = [];

async function loadProducts() {
    try {
        const res  = await fetch(`/api/produk?seller=${sellerId}`);
        const data = await res.json();
        productsData = data.map(p => ({
            id:          p._id,
            name:        p.nama,
            price:       p.harga,
            stock:       p.stok,
            type:        p.kategori,
            status:      p.status || 'Active',
            deskripsi:   p.deskripsi || '',
            diskon:      p.diskon || 0,
            hargaDiskon: p.hargaDiskon || null,
            image:       gambarProdukMap[p.nama] || p.gambar || 'https://via.placeholder.com/40'
        }));
        renderProductsTable();
    } catch (err) {
        console.error('Gagal load produk:', err);
        showToast('Gagal memuat produk', 'error');
    }
}

// ============================================
// DATA ORDERS (untuk tabel Orders)
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
                name:    o.user?.nama       || 'Unknown',
                email:   o.user?.email      || '-',
                phone:   o.user?.noHp       || '-',
                address: o.alamatPengiriman || '-'
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
// DATA ORDERS UNTUK CHART & ANALYTICS
// ============================================
let allOrdersForChart = [];

async function loadAllOrdersForChart() {
    try {
        const res  = await fetch(`/api/order?seller=${sellerId}`);
        const data = await res.json();
        allOrdersForChart = data.map(o => ({
            date:   new Date(o.createdAt),
            total:  (o.items || []).reduce((s, i) => s + ((i.harga || 0) * (i.jumlah || 0)), 0) + (o.ongkir || 0),
            alamat: o.alamatPengiriman || '',
            status: o.status || 'Pending',
            items:  (o.items || []).map(i => ({
                nama:     i.produk?.nama || '-',
                subtotal: (i.harga || 0) * (i.jumlah || 0)
            }))
        }));
    } catch (err) {
        console.error('Gagal load order untuk chart:', err);
        allOrdersForChart = [];
    }
}

// ============================================
// HELPER: REVENUE PER HARI DALAM 1 MINGGU
// ============================================
function getWeeklyRevenueData(month, weekIndex) {
    const startDay = weekIndex * 7 + 1;
    const endDay   = startDay + 6;

    // Hitung semua order (bukan hanya Completed) supaya data tidak kosong
    const filtered = allOrdersForChart.filter(o => {
        return o.date.getMonth() === month &&
               o.date.getDate()  >= startDay &&
               o.date.getDate()  <= endDay;
    });

    const days          = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenuePerDay = [0, 0, 0, 0, 0, 0, 0];
    filtered.forEach(o => {
        revenuePerDay[o.date.getDay()] += o.total;
    });

    return { labels: days, data: revenuePerDay };
}

// ============================================
// HELPER: JUMLAH ORDER PER KOTA
// ============================================
function getLocationData() {
    const cityMap = {};
    allOrdersForChart.forEach(o => {
        if (!o.alamat) return;
        // Ambil bagian terakhir dari alamat sebagai nama kota
        const parts = o.alamat.split(/[,.\n]/);
        const kota  = (parts[parts.length - 1] || parts[0] || '').trim();
        if (!kota) return;
        cityMap[kota] = (cityMap[kota] || 0) + 1;
    });

    const sorted = Object.entries(cityMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    return {
        labels: sorted.map(e => e[0]),
        data:   sorted.map(e => e[1])
    };
}

// ============================================
// HELPER: HITUNG STAT CARDS
// ============================================
function calcDashboardStats() {
    // Hitung semua order yang masuk (bukan hanya Completed)
    const allOrders    = allOrdersForChart;
    const totalEarning = allOrders.reduce((s, o) => s + o.total, 0);
    const totalOrders  = allOrders.length;
    const avgEarning   = totalOrders > 0 ? Math.round(totalEarning / totalOrders) : 0;
    return { totalEarning, totalOrders, avgEarning };
}

// ============================================
// HELPER: PENJUALAN PER PRODUK UNTUK DONUT
// ============================================
function getSalesPerProduct() {
    const prodMap = {};
    allOrdersForChart.forEach(o => {
        o.items.forEach(i => {
            if (!i.nama || i.nama === '-') return;
            prodMap[i.nama] = (prodMap[i.nama] || 0) + i.subtotal;
        });
    });

    const sorted = Object.entries(prodMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7);

    const colors = ['#6BCB77','#4ECDC4','#FF6B6B','#FF8E72','#FFCC5C','#A29BFE','#4D96FF'];
    return {
        labels: sorted.map(e => e[0]),
        data:   sorted.map(e => e[1]),
        colors: sorted.map((_, i) => colors[i % colors.length])
    };
}

// ============================================
// VIEWS TEMPLATES
// ============================================
const views = {
    dashboard: `
    <div class="stats-grid">
        <div class="stat-card">
            <h3>Total Earning</h3>
            <p id="stat-total-earning">Memuat...</p>
        </div>
        <div class="stat-card">
            <h3>Total Orders</h3>
            <p id="stat-total-orders">Memuat...</p>
        </div>
        <div class="stat-card">
            <h3>Avg Earning</h3>
            <p id="stat-avg-earning">Memuat...</p>
        </div>
    </div>
    <div class="main-card">
        <div class="title-row">
            <h2>Weekly Financial</h2>
            <div style="display: flex; gap: 10px;">
                <select class="custom-select" id="weekSelect" onchange="filterWeeklyChart()">
                    <option value="0">Week 1</option>
                    <option value="1">Week 2</option>
                    <option value="2">Week 3</option>
                    <option value="3">Week 4</option>
                </select>
                <select class="custom-select" id="monthSelect" onchange="filterWeeklyChart()">
                    <option value="0">January</option><option value="1">February</option>
                    <option value="2">March</option><option value="3">April</option>
                    <option value="4">May</option><option value="5">June</option>
                    <option value="6">July</option><option value="7">August</option>
                    <option value="8">September</option><option value="9">Oktober</option>
                    <option value="10">November</option><option value="11">December</option>
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
                    <th>Kategori</th>
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
                    <select class="custom-select" id="an-weekSelect" onchange="filterAnalyticsWeekly()">
                        <option value="0">Week 1</option><option value="1">Week 2</option>
                        <option value="2">Week 3</option><option value="3">Week 4</option>
                    </select>
                    <select class="custom-select" id="an-monthSelect" onchange="filterAnalyticsWeekly()">
                        <option value="0">January</option><option value="1">February</option>
                        <option value="2">March</option><option value="3">April</option>
                        <option value="4">May</option><option value="5">June</option>
                        <option value="6">July</option><option value="7">August</option>
                        <option value="8">September</option><option value="9">Oktober</option>
                        <option value="10">November</option><option value="11">December</option>
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
                <div class="percentage" id="target-percentage">0%</div>
            </div>
            <div class="target-stats">
                <div><small>Target</small><p style="font-weight:bold;" id="target-nilai">-</p></div>
                <div><small>Revenue</small><p style="font-weight:bold;" id="target-revenue">-</p></div>
                <div><small>Today</small><p style="font-weight:bold;" id="target-today">-</p></div>
            </div>
        </div>

        <div class="main-card full-width">
            <h3>Total Sales</h3>
            <div class="sales-content">
                <div class="donut-box"><canvas id="salesDonut"></canvas></div>
                <div class="sales-legend" id="sales-legend-list"></div>
            </div>
        </div>
    </div>
    `,
};

// ============================================
// INSTANCE CHART (supaya bisa di-destroy)
// ============================================
let mainChartInstance      = null;
let financialChartInstance = null;
let locationChartInstance  = null;
let targetChartInstance    = null;
let salesDonutInstance     = null;

// ============================================
// RENDER DASHBOARD: STAT CARDS + CHART
// ============================================
async function renderDashboardChart() {
    if (allOrdersForChart.length === 0) await loadAllOrdersForChart();

    // ── Stat cards ──
    const stats  = calcDashboardStats();
    const elEarn = document.getElementById('stat-total-earning');
    const elOrd  = document.getElementById('stat-total-orders');
    const elAvg  = document.getElementById('stat-avg-earning');

    if (elEarn) elEarn.textContent = 'Rp ' + stats.totalEarning.toLocaleString('id-ID') + ',00';
    if (elOrd)  elOrd.textContent  = stats.totalOrders + ' orders';
    if (elAvg)  elAvg.textContent  = 'Rp ' + stats.avgEarning.toLocaleString('id-ID') + ',00';

    // ── Set dropdown ke bulan sekarang ──
    const now      = new Date();
    const monthSel = document.getElementById('monthSelect');
    const weekSel  = document.getElementById('weekSelect');
    if (monthSel) monthSel.value = String(now.getMonth());
    if (weekSel)  weekSel.value  = '0';

    drawMainChart(now.getMonth(), 0);
}

function drawMainChart(month, weekIndex) {
    const ctx = document.getElementById('mainChart');
    if (!ctx) return;

    const { labels, data } = getWeeklyRevenueData(month, weekIndex);

    if (mainChartInstance) mainChartInstance.destroy();
    mainChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label:           'Revenue (Rp)',
                data,
                backgroundColor: '#99D5FF',
                borderRadius:    10,
                barPercentage:   0.6
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: v => {
                            if (v >= 1000000) return 'Rp ' + (v / 1000000).toFixed(1) + 'M';
                            if (v >= 1000)    return 'Rp ' + (v / 1000).toFixed(0) + 'K';
                            return 'Rp ' + v;
                        }
                    }
                }
            }
        }
    });
}

function filterWeeklyChart() {
    const month     = parseInt(document.getElementById('monthSelect').value);
    const weekIndex = parseInt(document.getElementById('weekSelect').value);
    drawMainChart(month, weekIndex);
}

// ============================================
// INIT ANALYTICS (SEMUA DARI ORDER)
// ============================================
async function initAnalyticsCharts() {
    if (allOrdersForChart.length === 0) await loadAllOrdersForChart();

    const now = new Date();

    // Set dropdown ke bulan sekarang
    const anMonth = document.getElementById('an-monthSelect');
    const anWeek  = document.getElementById('an-weekSelect');
    if (anMonth) anMonth.value = String(now.getMonth());
    if (anWeek)  anWeek.value  = '0';

    drawFinancialChart(now.getMonth(), 0);
    drawLocationChart();
    drawTargetChart();
    drawSalesDonut();
}

// ── Weekly Financial (Analytics) ──
function drawFinancialChart(month, weekIndex) {
    const ctx = document.getElementById('financialChart');
    if (!ctx) return;

    const { labels, data } = getWeeklyRevenueData(month, weekIndex);

    if (financialChartInstance) financialChartInstance.destroy();
    financialChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label:           'Revenue (Rp)',
                data,
                backgroundColor: '#99D5FF',
                borderRadius:    10,
                barPercentage:   0.6
            }]
        },
        options: {
            responsive:          true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: v => {
                            if (v >= 1000000) return 'Rp ' + (v / 1000000).toFixed(1) + 'M';
                            if (v >= 1000)    return 'Rp ' + (v / 1000).toFixed(0) + 'K';
                            return 'Rp ' + v;
                        }
                    }
                }
            }
        }
    });
}

function filterAnalyticsWeekly() {
    const month     = parseInt(document.getElementById('an-monthSelect').value);
    const weekIndex = parseInt(document.getElementById('an-weekSelect').value);
    drawFinancialChart(month, weekIndex);
}

// ── Sales By Location ──
function drawLocationChart() {
    const ctx = document.getElementById('locationChart');
    if (!ctx) return;

    const { labels, data } = getLocationData();
    const finalLabels = labels.length > 0 ? labels : ['Belum ada data'];
    const finalData   = data.length   > 0 ? data   : [0];

    if (locationChartInstance) locationChartInstance.destroy();
    locationChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: finalLabels,
            datasets: [{
                label:           'Jumlah Order',
                data:            finalData,
                backgroundColor: '#4D96FF',
                borderRadius:    8
            }]
        },
        options: {
            responsive:          true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

// ── Monthly Target ──
function drawTargetChart() {
    const ctx = document.getElementById('targetChart');
    if (!ctx) return;

    const now = new Date();

    // Revenue bulan ini (semua order)
    const revenueMonthly = allOrdersForChart
        .filter(o =>
            o.date.getMonth()    === now.getMonth() &&
            o.date.getFullYear() === now.getFullYear()
        )
        .reduce((s, o) => s + o.total, 0);

    // Revenue hari ini
    const revenueToday = allOrdersForChart
        .filter(o =>
            o.date.getDate()     === now.getDate()  &&
            o.date.getMonth()    === now.getMonth() &&
            o.date.getFullYear() === now.getFullYear()
        )
        .reduce((s, o) => s + o.total, 0);

    // Target = 2x revenue bulan ini, minimal Rp 10 juta
    const target     = Math.max(revenueMonthly * 2, 10000000);
    const percentage = Math.min(Math.round((revenueMonthly / target) * 100), 100);

    // Update teks
    const elPct     = document.getElementById('target-percentage');
    const elTarget  = document.getElementById('target-nilai');
    const elRevenue = document.getElementById('target-revenue');
    const elToday   = document.getElementById('target-today');

    if (elPct)     elPct.textContent     = percentage + '%';
    if (elTarget)  elTarget.textContent  = formatRupiah(target);
    if (elRevenue) elRevenue.textContent = formatRupiah(revenueMonthly);
    if (elToday)   elToday.textContent   = formatRupiah(revenueToday);

    if (targetChartInstance) targetChartInstance.destroy();
    targetChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data:            [percentage, 100 - percentage],
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
}

// ── Total Sales Donut ──
function drawSalesDonut() {
    const ctx = document.getElementById('salesDonut');
    if (!ctx) return;

    const { labels, data, colors } = getSalesPerProduct();
    const legendEl = document.getElementById('sales-legend-list');

    const finalLabels = labels.length > 0 ? labels : ['Belum ada data'];
    const finalData   = data.length   > 0 ? data   : [1];
    const finalColors = colors.length > 0 ? colors : ['#ddd'];

    // Render legend dinamis
    if (legendEl) {
        legendEl.innerHTML = finalLabels.map((label, i) => `
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color:${finalColors[i]};"></span>
                    <span>${label}</span>
                </div>
                <strong>${finalData[i] ? formatRupiah(finalData[i]) : '-'}</strong>
            </div>
        `).join('');
    }

    if (salesDonutInstance) salesDonutInstance.destroy();
    salesDonutInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: finalLabels,
            datasets: [{
                data:            finalData,
                backgroundColor: finalColors,
                borderWidth:     2
            }]
        },
        options: {
            cutout:  '65%',
            plugins: { legend: { display: false } }
        }
    });
}

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
// RENDER PRODUCTS TABLE
// ============================================
function renderProductsTable() {
    const tbody = document.getElementById('productTableBody');
    if (!tbody) return;

    const start        = currentPageProducts * productsPerPage;
    const pageProducts = productsData.slice(start, start + productsPerPage);

    tbody.innerHTML = '';
    pageProducts.forEach(product => {
        const tr = document.createElement('tr');
        const isOnSale = product.status === 'On Sale' && product.diskon > 0;
        const priceCell = isOnSale
            ? `<span style="text-decoration:line-through;color:#aaa;font-size:12px;">${product.price.toLocaleString('id-ID')}</span><br>
               <strong style="color:#EB5757;">${(product.hargaDiskon ?? Math.round(product.price * (1 - product.diskon / 100))).toLocaleString('id-ID')}</strong>
               <span style="background:#FFD6D6;color:#EB5757;font-size:11px;font-weight:700;padding:2px 6px;border-radius:8px;margin-left:4px;">-${product.diskon}%</span>`
            : `${product.price.toLocaleString('id-ID')},00`;

        tr.innerHTML = `
            <td>
                <div class="product-info">
                    <img src="${product.image}" class="prod-thumb"
                         onerror="this.src='https://via.placeholder.com/40'">
                    <strong>${product.name}</strong>
                </div>
            </td>
            <td>${product.id}</td>
            <td>${priceCell}</td>
            <td>${product.stock} pcs</td>
            <td>${product.type}</td>
            <td>
                <select class="product-status-dropdown"
                        style="${getProductStatusDropdownStyle(product.status)}"
                        onchange="updateProductStatus('${product.id}', this)">
                    ${productStatusOptions.map(opt => `
                        <option value="${opt}" ${product.status === opt ? 'selected' : ''}>${opt}</option>
                    `).join('')}
                </select>
            </td>
            <td>
                <button class="btn-small btn-edit" onclick="openEditModal('${product.id}')">✏️ Edit</button>
                <button class="btn-small btn-delete" style="padding:6px 9px;font-size:13px;" onclick="deleteProduct('${product.id}')" title="Hapus produk">🗑️</button>
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
// UPDATE PRODUCT STATUS
// ============================================
async function updateProductStatus(productId, selectEl) {
    const newStatus = selectEl.value;
    const product = productsData.find(p => p.id === productId);

    // Kalau dipilih "On Sale", buka modal diskon dulu (belum langsung disimpan)
    if (newStatus === 'On Sale') {
        openDiscountModal(productId, selectEl);
        return;
    }

    try {
        const body = { status: newStatus };
        // Kalau pindah keluar dari "On Sale", reset diskon supaya tidak nyangkut
        if (product && product.status === 'On Sale' && newStatus !== 'On Sale') {
            body.diskon = 0;
            body.hargaDiskon = null;
        }

        const res = await fetch(`/api/produk/${productId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body)
        });
        if (!res.ok) throw new Error('Gagal update status');

        if (product) {
            product.status = newStatus;
            if (body.diskon === 0) { product.diskon = 0; product.hargaDiskon = null; }
        }
        selectEl.style.cssText = getProductStatusDropdownStyle(newStatus);
        showToast(`Status "${product?.name}" diubah menjadi ${newStatus}`, 'success');
        renderProductsTable();
    } catch (err) {
        console.error(err);
        showToast('Gagal mengubah status', 'error');
        if (product) selectEl.value = product.status;
    }
}

// ============================================
// MODAL DISKON (ON SALE)
// ============================================
let discountContext = { productId: null, selectEl: null, previousStatus: null };

function openDiscountModal(productId, selectEl) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    discountContext = { productId, selectEl, previousStatus: product.status };

    document.getElementById('discount-product-name').value    = product.name;
    document.getElementById('discount-original-price').value  = 'Rp ' + product.price.toLocaleString('id-ID');
    document.getElementById('discount-percent').value         = product.diskon > 0 ? product.diskon : '';
    document.getElementById('discount-final-price').value     = '';
    previewDiscountPrice();

    document.getElementById('discountModal').style.display = 'flex';
}

function previewDiscountPrice() {
    const product = productsData.find(p => p.id === discountContext.productId);
    if (!product) return;

    const percentInput = document.getElementById('discount-percent');
    const percent = parseFloat(percentInput.value);
    const finalEl = document.getElementById('discount-final-price');

    if (isNaN(percent) || percent <= 0 || percent >= 100) {
        finalEl.value = '';
        return;
    }

    const finalPrice = Math.round(product.price * (1 - percent / 100));
    finalEl.value = 'Rp ' + finalPrice.toLocaleString('id-ID');
}

function cancelDiscountModal() {
    // Kembalikan dropdown ke status sebelumnya karena diskon dibatalkan
    if (discountContext.selectEl && discountContext.previousStatus) {
        discountContext.selectEl.value = discountContext.previousStatus;
    }
    document.getElementById('discountModal').style.display = 'none';
    discountContext = { productId: null, selectEl: null, previousStatus: null };
}

async function saveDiscount() {
    const product = productsData.find(p => p.id === discountContext.productId);
    if (!product) return;

    const percent = parseFloat(document.getElementById('discount-percent').value);
    if (isNaN(percent) || percent <= 0 || percent >= 100) {
        showToast('Masukkan persentase diskon yang valid (1-99)', 'error');
        return;
    }

    const finalPrice = Math.round(product.price * (1 - percent / 100));

    try {
        const res = await fetch(`/api/produk/${discountContext.productId}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ status: 'On Sale', diskon: percent, hargaDiskon: finalPrice })
        });
        if (!res.ok) throw new Error('Gagal menyimpan diskon');

        product.status      = 'On Sale';
        product.diskon      = percent;
        product.hargaDiskon = finalPrice;

        if (discountContext.selectEl) {
            discountContext.selectEl.value = 'On Sale';
            discountContext.selectEl.style.cssText = getProductStatusDropdownStyle('On Sale');
        }

        showToast(`Diskon ${percent}% untuk "${product.name}" berhasil disimpan`, 'success');
        document.getElementById('discountModal').style.display = 'none';
        discountContext = { productId: null, selectEl: null, previousStatus: null };
        renderProductsTable();
    } catch (err) {
        console.error(err);
        showToast('Gagal menyimpan diskon', 'error');
    }
}

// ============================================
// HAPUS PRODUK
// ============================================
async function deleteProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!confirm(`Hapus produk "${product?.name || ''}"? Tindakan ini tidak bisa dibatalkan.`)) return;

    try {
        const res = await fetch(`/api/produk/${productId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Gagal menghapus produk');

        showToast(`Produk "${product?.name || ''}" berhasil dihapus`, 'success');
        await loadProducts();

        // Sesuaikan halaman pagination kalau halaman terakhir jadi kosong
        const totalPages = Math.ceil(productsData.length / productsPerPage);
        if (currentPageProducts >= totalPages) {
            currentPageProducts = Math.max(0, totalPages - 1);
        }
        renderProductsTable();
    } catch (err) {
        console.error(err);
        showToast('Gagal menghapus produk', 'error');
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
    document.getElementById('edit-p-desc').value        = product.deskripsi || '';
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
    const descEl     = document.getElementById('edit-p-desc');
    const data = {
        nama:      document.getElementById('edit-p-name').value,
        harga:     parseInt(document.getElementById('edit-p-price').value),
        stok:      parseInt(document.getElementById('edit-p-stock').value),
        kategori:  document.getElementById('edit-p-type').value,
        status:    document.getElementById('edit-p-status').value,
        deskripsi: descEl ? descEl.value.trim() : ''
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
// ORDER MANAGEMENT
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

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
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
    if (!modal) { console.error('Modal productModal tidak ditemukan'); return; }
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
    const descEl  = document.getElementById('p-desc');
    const fileEl  = document.getElementById('p-image');

    if (!nameEl || !priceEl || !stockEl || !typeEl) {
        showToast('Form tidak lengkap', 'error');
        return;
    }

    const name      = nameEl.value.trim();
    const price     = parseInt(priceEl.value);
    const stock     = parseInt(stockEl.value);
    const type      = typeEl.value;
    const deskripsi = descEl ? descEl.value.trim() : '';

    if (!name || isNaN(price) || isNaN(stock) || price < 0 || stock < 0) {
        showToast('Semua field harus diisi dengan benar', 'error');
        return;
    }

    let image = gambarProdukMap[name] || 'https://via.placeholder.com/40';
    if (fileEl && fileEl.files && fileEl.files[0]) {
        image = URL.createObjectURL(fileEl.files[0]);
    }

    try {
        const res = await fetch('/api/produk', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
                seller:    sellerId,
                nama:      name,
                harga:     price,
                stok:      stock,
                kategori:  type,
                gambar:    image,
                deskripsi: deskripsi
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
// NAVIGATION
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

// ============================================
// INIT
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    loadUserProfile();
    navigate('dashboard', document.querySelector('.nav-item'));
});