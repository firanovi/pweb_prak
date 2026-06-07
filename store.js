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
const productsSection1Fallback = [
    { name: "Batik Sumenep",         price: 500000, img: "./img/batiksumenep.jpg",       href: "detailBatikSumenep.html" },
    { name: "Kue Macho",             price: 20000,  img: "./img/kuemacho.png",            href: "detailKueMacho.html" },
    { name: "Kacang Otok",           price: 15000,  img: "./img/kacangotok.jpeg",         href: "detailKacangOtok.html" },
    { name: "Buah Siwalan",          price: 35000,  img: "./img/buahsiwalan.jpg",         href: "detailBuahSiwalan.html" },
    { name: "Odheng",                price: 25000,  img: "./img/odheng.png",              href: "detailOdheng.html" },
    { name: "Miniatur Karapan Sapi", price: 400000, img: "./img/miniaturkarapansapi.png", href: "detailMiniaturKarapanSapi.html" },
];

const productsSection2Fallback = [
    { name: "Keripik Tette",     price: 25000, img: "./img/keripiktette.jpeg",    href: "detailKeripikTette.html" },
    { name: "Petis Madura",      price: 20000, img: "./img/petismadura.png",      href: "detailPetisMadura.html" },
    { name: "Rengginang Lorjuk", price: 30000, img: "./img/rengginanglorjuk.png", href: "detailRengginangLorjuk.html" },
    { name: "Bolu Jubada",       price: 15000, img: "./img/bolujubada.png",       href: "detailBoluJubada.html" },
    { name: "Keripik Terung",    price: 40000, img: "./img/keripikterung.png",    href: "detailKeripikTerung.html" },
    { name: "Kaos Sakera",       price: 40000, img: "./img/kaossakera.jpeg",      href: "detailKausSakera.html" },
];

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
            href: `detailProduk.html?id=${p._id}`
        }));
    } catch (err) {
        console.warn('Pakai data fallback:', err.message);
        return null;
    }
}

// ==================== RENDER PRODUK ====================
function renderProducts(products, grids) {
    const row1 = products.slice(0, 3);
    const row2 = products.slice(3, 6);

    [row1, row2].forEach((row, i) => {
        if (!grids[i]) return;
        grids[i].innerHTML = row.map(product => `
            <a href="${product.href}" class="product-card">
                <div class="img-box">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
            </a>
        `).join('');
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
    const allWrappers = document.querySelectorAll('.product-grid-wrapper');

    if (allWrappers.length < 2) {
        console.error('Wrapper produk tidak ditemukan!');
        return;
    }

    const grids1 = allWrappers[0].querySelectorAll('.product-grid');
    const grids2 = allWrappers[1].querySelectorAll('.product-grid');

    // Langsung pakai fallback, tidak fetch DB
    renderProducts(productsSection1Fallback, grids1);
    renderProducts(productsSection2Fallback, grids2);
});