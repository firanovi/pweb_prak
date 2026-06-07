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
                <a href="./homepage.html" class="active">
                    <i class="fas fa-home"></i> About
                </a>
                <a href="./sejarah.html">
                    <i class="fas fa-landmark"></i> Heritage
                </a>
                <a href="./store.html">
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


// ==================== LOAD FEATURED PRODUCTS ====================
async function loadFeaturedProducts() {
    try {
        const res = await fetch('/api/produk');
        const produk = await res.json();

        const grid = document.querySelector('.products-grid');
        if (!grid || produk.length === 0) return;

        const featured = ['Batik Sumenep', 'Kacang Otok', 'Keripik Terung'];

        const filtered = featured
            .map(nama => produk.find(p => p.nama === nama))
            .filter(Boolean);

        if (filtered.length === 0) return;

        grid.innerHTML = '';

        filtered.forEach(item => {
            grid.innerHTML += `
                <a href="detail${item.nama.replace(/\s+/g, '')}.html" class="product-card">
                    <div class="product-image">
                        <img src="${item.gambar || './img/default.jpg'}" alt="${item.nama}">
                    </div>
                    <h3>${item.nama}</h3>
                    <p class="price">${new Intl.NumberFormat('id-ID').format(item.harga)},00</p>
                </a>
            `;
        });

    } catch (err) {
        console.error('Error load produk:', err);
        // Kalau gagal, tampilan statis tetap muncul
    }
}

loadFeaturedProducts();