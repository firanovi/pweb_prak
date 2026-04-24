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
                            <img src="./img/batik sumenep.jpg" class="prod-thumb">
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
                            <img src="./img/Kacang otok.jpeg" class="prod-thumb">
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
                            <img src="./img/Kacang otok.jpeg" class="prod-thumb">
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
                            <img src="./img/Kacang otok.jpeg" class="prod-thumb">
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
            <canvas id="financialChart" style="max-height: 300px; width: 100%;"></canvas>
        </div>

        <!-- SALES BY LOCATION - BAR CHART -->
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
    </div>
`,
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
                label: 'Revenue (Rp)',
                data: [5000000, 10000000, 6500000, 11000000, 13500000, 2500000, 8000000],
                backgroundColor: '#99D5FF',
                borderRadius: 10,
                barPercentage: 0.6,
                categoryPercentage: 0.8
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: true,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Rp ' + context.raw.toLocaleString('id-ID');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Nominal (Rp)',
                        font: { size: 12 }
                    },
                    ticks: {
                        callback: function(value) {
                            return 'Rp ' + (value / 1000000) + 'M';
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Hari',
                        font: { size: 12 }
                    }
                }
            }
        }
    });

    // 2. SALES BY LOCATION - BAR CHART (DIPERBAIKI)
    new Chart(document.getElementById('locationChart'), {
        type: 'bar',
        data: {
            labels: ['Surabaya', 'Banyuwangi', 'Jogja', 'Malang', 'Semarang', 'Bandung'],
            datasets: [{
                label: 'Jumlah Penjualan (pcs)',
                data: [400, 50, 50, 120, 80, 200],
                backgroundColor: '#4D96FF',
                borderRadius: 8,
                barPercentage: 0.65,
                categoryPercentage: 0.8,
                hoverBackgroundColor: '#6BAEFF'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: { size: 12, weight: 'bold' },
                        usePointStyle: true,
                        boxWidth: 10
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.raw + ' pcs';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Penjualan (pcs)',
                        font: { size: 12, weight: 'bold' },
                        color: '#4B5563'
                    },
                    ticks: {
                        stepSize: 100,
                        font: { size: 11 },
                        callback: function(value) {
                            return value + ' pcs';
                        }
                    },
                    grid: {
                        color: '#E5E7EB',
                        drawBorder: true
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Lokasi',
                        font: { size: 12, weight: 'bold' },
                        color: '#4B5563'
                    },
                    ticks: {
                        font: { size: 11, weight: '500' },
                        rotation: 0
                    },
                    grid: {
                        display: false
                    }
                }
            },
            layout: {
                padding: {
                    left: 10,
                    right: 10,
                    top: 20,
                    bottom: 10
                }
            }
        }
    });

    // 3. Monthly Target (Gauge)
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

    // 4. Total Sales (Donut Warna Warni)
    new Chart(document.getElementById('salesDonut'), {
        type: 'doughnut',
        data: {
            labels: ['Karapan', 'Kaos', 'Odheng', 'Siwalan', 'Kue', 'Kacang', 'Batik'],
            datasets: [{
                data: [12, 5, 8, 10, 15, 20, 30],
                backgroundColor: [
                    '#6BCB77',
                    '#4ECDC4',
                    '#FF6B6B',
                    '#FF8E72',
                    '#FFCC5C',
                    '#A29BFE',
                    '#4D96FF'
                ],
                hoverOffset: 4,
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true,
            maintainAspectRatio: true,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }, 
            cutout: '60%' 
        }
    });
}

// FUNGSI MODAL
function openModal() { document.getElementById('productModal').style.display = 'block'; }
function closeModal() { document.getElementById('productModal').style.display = 'none'; }
window.onclick = function(e) { if (e.target.id == 'productModal') closeModal(); }

// INITIAL START
window.onload = () => navigate('dashboard', document.querySelector('.nav-item'));