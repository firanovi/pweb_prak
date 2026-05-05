// Load 3 produk terbaru untuk ditampilkan di homepage
async function loadFeaturedProducts() {
    try {
        const res = await fetch('/api/produk?limit=3');
        const produk = await res.json();

        const grid = document.querySelector('.products-grid');
        if (!grid || produk.length === 0) return;

        grid.innerHTML = '';

        produk.forEach(item => {
            grid.innerHTML += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${item.gambar || './img/default.jpg'}" alt="${item.nama}">
                    </div>
                    <h3>${item.nama}</h3>
                    <p class="price">${new Intl.NumberFormat('id-ID').format(item.harga)},00</p>
                </div>
            `;
        });

    } catch (err) {
        console.error('Error load produk:', err);
        // Kalau gagal, biarkan tampilan statis tetap muncul
    }
}

loadFeaturedProducts();