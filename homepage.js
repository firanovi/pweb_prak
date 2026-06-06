// Load produk tertentu untuk ditampilkan di homepage
async function loadFeaturedProducts() {
    try {
        const res = await fetch('/api/produk');
        const produk = await res.json();

        const grid = document.querySelector('.products-grid');
        if (!grid || produk.length === 0) return;

        // Produk yang ingin ditampilkan di homepage
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
        // Kalau gagal, biarkan tampilan statis tetap muncul
    }
}

loadFeaturedProducts();