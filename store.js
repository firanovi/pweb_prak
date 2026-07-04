// ==================== HAMBURGER MENU ====================
(function () {
    const menuHTML = `
        <div class="mobile-menu-overlay" id="mobileOverlay"></div>
        <div class="mobile-menu" id="mobileMenu">
            <div class="mobile-menu-header">
                <span class="mobile-menu-logo">SakaMadura</span>
                <button class="mobile-menu-close" id="mobileMenuClose" aria-label="Tutup menu">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="mobile-menu-label">Menu</div>
            <nav class="mobile-menu-nav">
                <a href="./homepage.html">
                    <i class="fas fa-home"></i> About
                </a>
                <a href="./sejarah.html">
                    <i class="fas fa-landmark"></i> Heritage
                </a>
                <a href="./store.html" class="active">
                    <i class="fas fa-shopping-bag"></i> Shop
                </a>
            </nav>
            <div class="mobile-menu-divider"></div>
            <nav class="mobile-menu-nav">
                <a href="./loginuser.html">
                    <i class="fas fa-user"></i> Log in
                </a>
            </nav>
            <div class="mobile-menu-footer">
                &copy; 2026 SakaMadura. All rights reserved.
            </div>
        </div>
    `;

    function injectHamburger() {
        const navRight = document.querySelector('.nav-right');
        if (navRight && !document.querySelector('.hamburger-btn')) {
            const btn = document.createElement('button');
            btn.className = 'hamburger-btn';
            btn.id = 'hamburgerBtn';
            btn.setAttribute('aria-label', 'Buka menu');
            btn.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            navRight.appendChild(btn);
        }
    }

    function injectMenu() {
        if (!document.getElementById('mobileMenu')) {
            document.body.insertAdjacentHTML('beforeend', menuHTML);
        }
    }

    function openMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        const btn = document.getElementById('hamburgerBtn');
        if (!menu) return;
        menu.classList.add('open');
        overlay.classList.add('visible');
        btn && btn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        const menu = document.getElementById('mobileMenu');
        const overlay = document.getElementById('mobileOverlay');
        const btn = document.getElementById('hamburgerBtn');
        if (!menu) return;
        menu.classList.remove('open');
        overlay.classList.remove('visible');
        btn && btn.classList.remove('open');
        document.body.style.overflow = '';
    }

    function init() {
        injectHamburger();
        injectMenu();

        document.getElementById('hamburgerBtn')?.addEventListener('click', openMenu);
        document.getElementById('mobileMenuClose')?.addEventListener('click', closeMenu);
        document.getElementById('mobileOverlay')?.addEventListener('click', closeMenu);

        document.querySelectorAll('.mobile-menu-nav a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();


// ==================== DATA PRODUK (FALLBACK) ====================
// Dipakai HANYA kalau fetch ke API gagal (misal server/database lagi down).
const productsFallback = [
    { name: "Batik Sumenep",         price: 500000, img: "./img/batiksumenep.jpg",       href: "store.html", kategori: "Pakaian", status: "Active", diskon: 0 },
    { name: "Kue Macho",             price: 20000,  img: "./img/kuemacho.png",            href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Kacang Otok",           price: 15000,  img: "./img/kacangotok.jpeg",         href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Buah Siwalan",          price: 35000,  img: "./img/buahsiwalan.jpg",         href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Odheng",                price: 25000,  img: "./img/odheng.png",              href: "store.html", kategori: "Pakaian", status: "Active", diskon: 0 },
    { name: "Miniatur Karapan Sapi", price: 400000, img: "./img/miniaturkarapansapi.png", href: "store.html", kategori: "Kerajinan", status: "Active", diskon: 0 },
    { name: "Keripik Tette",         price: 25000,  img: "./img/keripiktette.jpeg",       href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Petis Madura",          price: 20000,  img: "./img/petismadura.png",         href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Rengginang Lorjuk",     price: 30000,  img: "./img/rengginanglorjuk.png",    href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Bolu Jubada",           price: 15000,  img: "./img/bolujubada.png",          href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Keripik Terung",        price: 40000,  img: "./img/keripikterung.png",       href: "store.html", kategori: "Makanan", status: "Active", diskon: 0 },
    { name: "Kaos Sakera",           price: 40000,  img: "./img/kaossakera.jpeg",         href: "store.html", kategori: "Pakaian", status: "Active", diskon: 0 },
];

// ==================== NORMALISASI KATEGORI ====================
// Menyamakan berbagai nilai kategori dari database (Clothes, Fashion,
// Food, Accessory, Kerajinan, dll) ke 3 kategori utama tampilan store:
// makanan, pakaian, aksesoris.
function normalizeCategory(kategoriRaw) {
    const k = (kategoriRaw || '').toLowerCase();

    if (['food', 'makanan'].includes(k)) return 'makanan';
    if (['clothes', 'fashion', 'pakaian'].includes(k)) return 'pakaian';
    if (['accessory', 'aksesoris', 'kerajinan', 'craft'].includes(k)) return 'kerajinan';

    // fallback: coba tebak dari kata kunci
    if (k.includes('makan') || k.includes('food')) return 'makanan';
    if (k.includes('baju') || k.includes('kaos') || k.includes('cloth') || k.includes('fashion')) return 'pakaian';
    return 'kerajinan';
}

function categoryLabel(categoryKey) {
    const labels = { makanan: 'Makanan', pakaian: 'Pakaian', kerajinan: 'Kerajinan' };
    return labels[categoryKey] || 'Kerajinan';
}

// ==================== FETCH PRODUK DARI DATABASE ====================
async function fetchProdukFromDB() {
    try {
        const res = await fetch('/api/produk');
        if (!res.ok) throw new Error('Gagal fetch');
        const data = await res.json();
        if (!data || data.length === 0) return null;
        return data.map(p => ({
            id: p._id,
            name: p.nama,
            price: p.harga,
            img: p.gambar || './img/default.jpg',
            href: `detailProduk.html?id=${p._id}`,
            kategori: p.kategori || '',
            status: p.status || 'Active',
            diskon: p.diskon || 0,
            hargaDiskon: p.hargaDiskon || null
        }));
    } catch (err) {
        console.warn('Pakai data fallback:', err.message);
        return null;
    }
}

// ==================== STATE ====================
let allProducts = [];      // semua produk hasil fetch (sudah dinormalisasi kategori)
let activeCategory = 'all';
let activeSort = 'recommended';
let activeSearch = '';

// ==================== RENDER PRODUK (GRID 4 KOLOM) ====================
function renderProductGrid() {
    const grid = document.getElementById('productGridMain');
    const countEl = document.getElementById('productCount');
    if (!grid) return;

    let filtered = allProducts.filter(p => {
        const isVisible = p.status !== 'Inactive';
        const matchCategory = activeCategory === 'all' || p.categoryKey === activeCategory;
        const matchSearch = !activeSearch || p.name.toLowerCase().includes(activeSearch);
        return isVisible && matchCategory && matchSearch;
    });

    switch (activeSort) {
        case 'price-asc':
            filtered = [...filtered].sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filtered = [...filtered].sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break; // recommended: urutan asli
    }

    if (countEl) countEl.textContent = `${filtered.length} PRODUCTS`;

    if (filtered.length === 0) {
        grid.innerHTML = `<p class="no-products-msg">Belum ada produk untuk kategori ini.</p>`;
        return;
    }

    grid.innerHTML = filtered.map(product => {
        const isOnSale = product.status === 'On Sale' && product.diskon > 0;
        const finalPrice = isOnSale
            ? (product.hargaDiskon ?? Math.round(product.price * (1 - product.diskon / 100)))
            : product.price;

        const priceHtml = isOnSale
            ? `<span class="price-old">Rp ${product.price.toLocaleString('id-ID')}</span>
               <span class="price-new">Rp ${finalPrice.toLocaleString('id-ID')}</span>`
            : `Rp ${product.price.toLocaleString('id-ID')}`;

        const badgeHtml = isOnSale
            ? `<div class="discount-badge">-${product.diskon}%</div>`
            : '';

        return `
        <a href="${product.href}" class="product-card">
            <div class="img-box">
                ${badgeHtml}
                <img src="${product.img}" alt="${product.name}">
            </div>
            <div class="product-category">${categoryLabel(product.categoryKey)}</div>
            <h3>${product.name}</h3>
            <p>${priceHtml}</p>
        </a>
    `;
    }).join('');
}

// ==================== EVENT: FILTER KATEGORI ====================
function initCategoryFilters() {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCategory = chip.dataset.category;
            renderProductGrid();
        });
    });
}

// ==================== EVENT: SORT ====================
function initSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    sortSelect.addEventListener('change', () => {
        activeSort = sortSelect.value;
        renderProductGrid();
    });
}

// ==================== EVENT: SEARCH ====================
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', () => {
        activeSearch = searchInput.value.trim().toLowerCase();
        renderProductGrid();
    });
}

// ==================== STICKY NAVBAR ====================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.12)';
        navbar.style.background = 'rgba(255,255,255,0.98)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        navbar.style.background = 'rgba(255,255,255,0.95)';
    }
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
    initCategoryFilters();
    initSort();
    initSearch();

    // Coba ambil dari database dulu. Kalau gagal (server/DB down), baru
    // pakai data fallback statis di atas.
    const dbProducts = await fetchProdukFromDB();
    const rawProducts = (dbProducts && dbProducts.length > 0) ? dbProducts : productsFallback;

    allProducts = rawProducts.map(p => ({
        ...p,
        categoryKey: normalizeCategory(p.kategori)
    }));

    renderProductGrid();
});