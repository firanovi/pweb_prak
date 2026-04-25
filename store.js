// ================= DATA PRODUK =================
const productsSection1 = [
    { name: "Batik Sumenep",         price: 500000, img: "./gambar/batik sumenep.jpg" },
    { name: "Kue Macho",             price: 20000,  img: "./gambar/kue macho.png" },
    { name: "Kacang Otok",           price: 15000,  img: "./gambar/kacangotok.jpeg" },
    { name: "Buah Siwalan",          price: 35000,  img: "./gambar/buahsiwalan.jpg" },
    { name: "Odheng",                price: 25000,  img: "./gambar/odheng.png" },
    { name: "Miniatur Karapan Sapi", price: 400000, img: "./gambar/karapan sapi.jpg" },
];

const productsSection2 = [
    { name: "Batik Sumenep",         price: 500000, img: "./gambar/batik sumenep.jpg" },
    { name: "Kacang Otok",           price: 15000,  img: "./gambar/kacangotok.jpeg" },
    { name: "Kue Macho",             price: 20000,  img: "./gambar/kue macho.png" },
    { name: "Buah Siwalan",          price: 35000,  img: "./gambar/buahsiwalan.jpg" },
    { name: "Odheng",                price: 25000,  img: "./gambar/odheng.png" },
    { name: "Kaos Sakera",           price: 40000,  img: "./gambar/kaos sakera.jpeg" },
];

// ================= RENDER PRODUK =================
function renderProducts(products, grids) {
    // Bagi produk jadi 2 baris (3 per baris)
    const row1 = products.slice(0, 3);
    const row2 = products.slice(3, 6);

    [row1, row2].forEach((row, i) => {
        if (!grids[i]) return;
        grids[i].innerHTML = row.map(product => `
            <div class="product-card">
                <div class="img-box">
                    <img src="${product.img}" alt="${product.name}">
                </div>
                <h3>${product.name}</h3>
                <p>Rp ${product.price.toLocaleString('id-ID')}</p>
            </div>
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