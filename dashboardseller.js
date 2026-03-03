const views = {
    dashboard: `
    <div class="stats-grid">
        <div class="stat-card"><h3>Total Earning</h3><p>Rp 5.000.000,00</p></div>
        <div class="stat-card"><h3>Total Orders</h3><p>500 pcs</p></div>
        <div class="stat-card"><h3>Avg Earning</h3><p>Rp 450.000,00</p></div>
    </div>
    <div class="main-card">
        <div class="title-row">
            <h2>Monthly Financial</h2>
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
        <canvas id="mainChart" style="max-height: 350px;"></canvas>
    </div>
`,
   product: `
    <div class="title-row" style="margin-bottom:20px;">
        <h2>Product</h2>
        <div>
            <button class="btn-white">📤 Export</button>
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
            <tbody>
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="batik sumenep.jpg" class="prod-thumb">
                            <strong>Batik Sumenep</strong>
                        </div>
                    </td>
                    <td>D123</td>
                    <td>500.000,00</td>
                    <td>80 pcs</td>
                    <td>clothes</td>
                    <td><span class="status active">Active</span></td>
                </tr>
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="kacang otok.jpeg" class="prod-thumb">
                            <strong>Kacang Otok</strong>
                        </div>
                    </td>
                    <td>D124</td>
                    <td>15.000,00</td>
                    <td>60 pcs</td>
                    <td>Food</td>
                    <td><span class="status inactive">Inactive</span></td>
                </tr>
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="kacang otok.jpeg" class="prod-thumb">
                            <strong>Kacang Otok</strong>
                        </div>
                    </td>
                    <td>D125</td>
                    <td>15.000,00</td>
                    <td>60 pcs</td>
                    <td>Food</td>
                    <td><span class="status pending">Pending</span></td>
                </tr>
                <tr>
                    <td>
                        <div class="product-info">
                            <img src="kacang otok.jpeg" class="prod-thumb">
                            <strong>Kacang Otok</strong>
                        </div>
                    </td>
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
                <button class="btn-white">Export</button>
                <button class="btn-blue">All Orders ▾</button>
            </div>
        </div>
        <div class="main-card">
            <table>
                <thead>
                    <tr><th>Order ID</th><th>Customer Name</th><th>Date</th><th>Amount</th><th>Status</th></tr>
                </thead>
               

        <tbody>
            <tr>
                <td>SK2458</td>
                <td>Haewon</td>
                <td>01/01/2026</td>
                <td>Rp 500.000</td>
                <td><span class="status active">Completed</span></td>
            </tr>
            <tr>
                <td>SK2459</td>
                <td>Jiwoo</td>
                <td>02/01/2026</td>
                <td>Rp 750.000</td>
                <td><span class="status pending">Pending</span></td>
            </tr>
            <tr>
                <td>SK2460</td>
                <td>Karina</td>
                <td>03/01/2026</td>
                <td>Rp 1.200.000</td>
                <td><span class="status active">Completed</span></td>
            </tr>
            <tr>
                <td>SK2461</td>
                <td>Winter</td>
                <td>04/01/2026</td>
                <td>Rp 300.000</td>
                <td><span class="status inactive">Cancelled</span></td>
            </tr>
            <tr>
                <td>SK2462</td>
                <td>Ningning</td>
                <td>05/01/2026</td>
                <td>Rp 950.000</td>
                <td><span class="status active">Completed</span></td>
            </tr>
            <tr>
                <td>SK2463</td>
                <td>Ryujin</td>
                <td>06/01/2026</td>
                <td>Rp 670.000</td>
                <td><span class="status pending">Processing</span></td>
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
    analytics: `
        <div class="analytics-grid">
            <div class="main-card full-width">
                <div class="title-row">
                    <h2>Monthly Financial</h2>
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
                <canvas id="financialChart" style="max-height: 300px;"></canvas>
            </div>

            <div class="main-card">
                <h3>Sales By Location</h3>
                <div style="padding: 20px; text-align: center;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" style="width:80%; filter: brightness(0) opacity(0.8);">
                </div>
                <div class="location-list">
                    <div class="loc-item"><span>Surabaya</span> <strong>400 pcs</strong></div>
                    <div class="progress-bar blue"><div style="width: 80%"></div></div>
                    <div class="loc-item"><span>Banyuwangi</span> <strong>50 pcs</strong></div>
                    <div class="progress-bar light-blue"><div style="width: 20%"></div></div>
                    <div class="loc-item"><span>Jogja</span> <strong>50 pcs</strong></div>
                    <div class="progress-bar light-blue"><div style="width: 20%"></div></div>
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
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #6BCB77;"></span>
                    <span>Miniatur Karapan Sapi</span>
                </div>
                <strong>1.200.000</strong>
            </div>
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #4ECDC4;"></span>
                    <span>Kaos Sakera</span>
                </div>
                <strong>300.000</strong>
            </div>
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #FF6B6B;"></span>
                    <span>Odheng</span>
                </div>
                <strong>500.000</strong>
            </div>
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #FF8E72;"></span>
                    <span>Buah Siwalan</span>
                </div>
                <strong>600.000</strong>
            </div>
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #FFCC5C;"></span>
                    <span>Kue Macho</span>
                </div>
                <strong>700.000</strong>
            </div>
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #A29BFE;"></span>
                    <span>Kacang Otok</span>
                </div>
                <strong>1.000.000</strong>
            </div>
            <div class="legend-item">
                <div class="item-info">
                    <span class="dot" style="background-color: #4D96FF;"></span>
                    <span>Batik Sumenep</span>
                </div>
                <strong>3.000.000</strong>
                    </div>
                </div>
            </div>
        </div>
    `
};

// --- FUNGSI NAVIGASI & CHART ---

function navigate(viewName, element) {
    document.getElementById('render-target').innerHTML = views[viewName];
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    
    if (viewName === 'analytics') {
        initAnalyticsCharts();
    } else if (viewName === 'dashboard') {
        renderDashboardChart();
    }
}

function renderDashboardChart() {
    const ctx = document.getElementById('mainChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{ label: 'Revenue', data: [5, 10, 6, 11, 13, 2, 8], backgroundColor: '#99D5FF', borderRadius: 10 }]
        }
    });
}

function initAnalyticsCharts() {
    // 1. Monthly Financial (Bar)
    new Chart(document.getElementById('financialChart'), {
        type: 'bar',
        data: {
            labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                data: [5000000, 10000000, 6500000, 11000000, 13500000, 2500000, 8000000],
                backgroundColor: '#99D5FF',
                borderRadius: 10
            }]
        },
        options: { plugins: { legend: { display: false } } }
    });

    // 2. Monthly Target (Gauge)
    new Chart(document.getElementById('targetChart'), {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [66, 34],
                backgroundColor: ['#4D96FF', '#D9E9FF'],
                borderWidth: 0,
                circumference: 180,
                rotation: 270
            }]
        },
        options: { cutout: '85%', plugins: { tooltip: { enabled: false } } }
    });

    // 3. Total Sales (Donut Warna Warni)
    new Chart(document.getElementById('salesDonut'), {
        type: 'doughnut',
        data: {
            labels: ['Karapan', 'Kaos', 'Odheng', 'Siwalan', 'Kue', 'Kacang', 'Batik'],
            datasets: [{
                data: [12, 5, 8, 10, 15, 20, 30],
                backgroundColor: [
                    '#6BCB77', // Hijau
                    '#4ECDC4', // Toska
                    '#FF6B6B', // Pink/Merah
                    '#FF8E72', // Orange
                    '#FFCC5C', // Kuning
                    '#A29BFE', // Ungu
                    '#4D96FF'  // Biru
                ],
                hoverOffset: 4
            }]
        },
        options: { plugins: { legend: { display: false } }, cutout: '60%' }
    });
}

// FUNGSI MODAL
function openModal() { document.getElementById('productModal').style.display = 'block'; }
function closeModal() { document.getElementById('productModal').style.display = 'none'; }
window.onclick = function(e) { if (e.target.id == 'productModal') closeModal(); }

// INITIAL START
window.onload = () => navigate('dashboard', document.querySelector('.nav-item'));