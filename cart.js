const products = [
        { id: 1, name: "Buah Lontar", price: 40000, image: "./img/buah siwalan.jpg", qty: 1 },
        { id: 2, name: "Odheng", price: 40000, image: "./img/odheng.jpg", qty: 1 }
    ];

    const SHIPPING_COST = 30000;  // Express shipping tetap

    // Format Rupiah
    function formatIDR(amount) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    }

    // Hitung subtotal
    function calcSubtotal() {
        return products.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    // Render daftar item di keranjang
    function renderCartItems() {
        const container = document.getElementById('cartItemsContainer');
        if (!container) return;
        container.innerHTML = '';
        products.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.innerHTML = `
                <div class="col-product">
                    <img src="${item.image}" alt="${item.name}" class="product-image">
                    <span>${item.name}</span>
                </div>
                <span class="col-price" data-label="Price">${formatIDR(item.price)}</span>
                <span class="col-qty" data-label="Quantity">${item.qty}</span>
                <span class="col-subtotal" data-label="Subtotal">${formatIDR(item.price * item.qty)}</span>
            `;
            container.appendChild(itemDiv);
        });
    }

    // Update total & subtotal (tanpa diskon, kupon sudah dihapus)
    function updateSummary() {
        const subtotal = calcSubtotal();
        const finalTotal = subtotal + SHIPPING_COST;
        
        const subtotalElem = document.getElementById('subtotalDisplay');
        const totalElem = document.getElementById('totalDisplay');
        if (subtotalElem) subtotalElem.innerHTML = formatIDR(subtotal);
        if (totalElem) totalElem.innerHTML = formatIDR(finalTotal);
        
        const shippingSpan = document.getElementById('shippingCost');
        if (shippingSpan) shippingSpan.innerHTML = `Rp${SHIPPING_COST.toLocaleString('id-ID')}`;
    }

    // Gambar produk (placeholder)
    const productImages = {
        "Buah Lontar": "./img/buah siwalan.jpg",
        "Odheng": "./img/odheng.jpg"
    };
    products[0].image = productImages["Buah Lontar"];
    products[1].image = productImages["Odheng"];
    
    // Redirect ke laman checkout / payment (sesuai permintaan: diarahkan ke laman checkout)
    function redirectToCheckout() {
        window.location.href = "./payment.html";
    }

    // Inisialisasi halaman
    function init() {
        renderCartItems();
        updateSummary();
        
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            // ketika tombol checkout ditekan, redirect ke laman checkout (payment.html)
            checkoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // Optional: bisa menyimpan data keranjang ke localStorage jika diperlukan di halaman payment
                const cartData = {
                    items: products,
                    subtotal: calcSubtotal(),
                    shipping: SHIPPING_COST,
                    total: calcSubtotal() + SHIPPING_COST
                };
                localStorage.setItem('sakamadura_cart', JSON.stringify(cartData));
                // Redirect ke laman checkout (payment.html)
                redirectToCheckout();
            });
        }
    }
    
    init();