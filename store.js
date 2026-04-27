// ================= DATA PRODUK =================
const productsSection1 = [
    { name: "Batik Sumenep",         price: 500000, img: "./gambar/batik sumenep.jpg",          href: "detailBatikSumenep.html" },
    { name: "Kue Macho",             price: 20000,  img: "./img/kue macho.png",                 href: "detailKueMacho.html" },
    { name: "Kacang Otok",           price: 15000,  img: "./gambar/kacangotok.jpeg",             href: "detailKacangOtok.html" },
    { name: "Buah Siwalan",          price: 35000,  img: "./gambar/buahsiwalan.jpg",             href: "detailBuahSiwalan.html" },
    { name: "Odheng",                price: 25000,  img: "./gambar/odheng.png",                  href: "detailOdheng.html" },
    { name: "Miniatur Karapan Sapi", price: 400000, img: "./img/miniatur karapan sapi.png",      href: "detailMiniaturKarapanSapi.html" },
];

const productsSection2 = [
    { name: "Keripik Tette",         price: 25000,  img: "./img/keripik tette.jpeg",             href: "detailKeripikTette.html" },
    { name: "Petis Madura",          price: 20000,  img: "./img/petis madura.png",               href: "detailPetisMadura.html" },
    { name: "Rengginang Lorjuk",     price: 30000,  img: "./img/rengginang lorjuk.png",          href: "detailRengginangLorjuk.html" },
    { name: "Bolu Jubada",           price: 15000,  img: "./img/bolu jubada.png",                href: "detailBoluJubada.html" },
    { name: "Keripik Terung",        price: 40000,  img: "./img/keripik terung.png",             href: "detailKeripikTerung.html" },
    { name: "Kaos Sakera",           price: 40000,  img: "./gambar/kaos sakera.jpeg",            href: "detailKausSakera.html" },
];

// ================= RENDER PRODUK =================
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

// ================= STICKY NAVBAR =================
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

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    const allWrappers = document.querySelectorAll('.product-grid-wrapper');

    // Section 1 — wrapper pertama
    const grids1 = allWrappers[0].querySelectorAll('.product-grid');
    renderProducts(productsSection1, grids1);

    // Section 2 — wrapper kedua
    const grids2 = allWrappers[1].querySelectorAll('.product-grid');
    renderProducts(productsSection2, grids2);
});