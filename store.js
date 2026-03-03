// Data Produk (Bisa ditambah sesuai kebutuhan)
const products = [
    { id: 1, name: "Batik Sumenep", price: 500000, category: "heritage", img: "./gambar/batik sumenep.jpg" },
    { id: 2, name: "Kacang Otok", price: 15000, category: "food", img: "./gambar/kacang otok.jpeg" },
    { id: 3, name: "Kue Macho", price: 20000, category: "food", img: "./gambar/kue macho.png" },
];

let cart = [];

// 1. Fungsi Menampilkan Produk Secara Dinamis
function renderProducts() {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Rp ${product.price.toLocaleString('id-ID')}</p>
        </div>
    `).join('');
}

// 2. Fungsi Tambah ke Keranjang
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    
    // Memberi notifikasi sederhana
    alert(`${product.name} berhasil ditambahkan! Total barang: ${cart.length}`);
    console.log("Isi Keranjang:", cart);
}

// 3. Efek Sticky Header saat Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = 'white';
        header.style.boxShadow = 'none';
    }
});

// Jalankan fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', renderProducts);