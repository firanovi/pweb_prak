// ================= STATE =================
let selectedShipping = null;
let selectedPayment  = null;
let countdownInterval = null;
let timeLeft = 900;
let appliedDiscount = false;

let subtotal = 0;
let tax = 10000;
let finalCheckoutTotal = 0;
let cartItems = [];

// Mode halaman: 'buynow' (dari tombol Buy it now di detail produk) atau 'cart' (checkout dari cart biasa)
const urlParams = new URLSearchParams(window.location.search);
const isBuyNowMode = urlParams.get('mode') === 'buynow';

// ================= MAPPING GAMBAR LOKAL =================
const gambarProdukMap = {
    'Batik Sumenep':         './img/batiksumenep.jpg',
    'Kue Macho':             './img/kuemacho.png',
    'Kacang Otok':           './img/kacangotok.jpeg',
    'Buah Siwalan':          './img/buahsiwalan.jpg',
    'Odheng':                './img/odheng.png',
    'Miniatur Karapan Sapi': './img/miniaturkarapansapi.png',
    'Keripik Tette':         './img/keripiktette.jpeg',
    'Petis Madura':          './img/petismadura.png',
    'Rengginang Lorjuk':     './img/rengginanglorjuk.png',
    'Bolu Jubada':           './img/bolujubada.png',
    'Keripik Terung':        './img/keripikterung.png',
    'Kaos Sakera':           './img/kaossakera.jpeg',
};

function getGambar(item) {
    const nama = item.produk?.nama || item.nama || '';
    return gambarProdukMap[nama] || item.produk?.gambar || item.gambar || './img/batiksumenep.jpg';
}

// ================= LOAD CART =================
async function loadCartData() {
    const cartContainer = document.querySelector('.cart-items');
    const itemCountEl   = document.querySelector('.item-count');

    try {
        let sourceItems;

        if (isBuyNowMode) {
            // Mode "Buy it now": tampilkan HANYA 1 produk yang disimpan dari halaman detail produk
            const buyNowRaw = localStorage.getItem('sakamadura_buynow_item');
            sourceItems = JSON.parse(buyNowRaw || '[]');
        } else {
            // Mode checkout dari cart biasa
            const localRaw = localStorage.getItem('sakamadura_cart_local');
            sourceItems = JSON.parse(localRaw || '[]');
        }

        cartItems = sourceItems.map(i => ({
            produk: { nama: i.nama, gambar: i.gambar },
            harga:  i.harga,
            jumlah: i.jumlah
        }));

        subtotal           = cartItems.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
        finalCheckoutTotal = subtotal + tax;

        if (cartContainer) {
            if (cartItems.length > 0) {
                cartContainer.innerHTML = '';
                cartItems.forEach(item => {
                    const nama   = item.produk?.nama || '-';
                    const harga  = item.harga  || 0;
                    const jumlah = item.jumlah || 1;
                    cartContainer.innerHTML += `
                        <div class="cart-item">
                            <div class="item-left">
                                <img
                                    src="${getGambar(item)}"
                                    alt="${nama}"
                                    class="cart-item-image"
                                    onerror="this.src='./img/batiksumenep.jpg'"
                                >
                                <div class="item-info">
                                    <div class="item-name"><strong>${nama}</strong></div>
                                    <div class="item-quantity">Quantity: ${jumlah}</div>
                                </div>
                            </div>
                            <div class="item-price">Rp${harga.toLocaleString('id-ID')}</div>
                        </div>
                    `;
                });
                if (itemCountEl) itemCountEl.textContent = `${cartItems.length} items`;
            } else {
                cartContainer.innerHTML = '<p style="text-align:center; color:#999;">Keranjang kosong</p>';
                if (itemCountEl) itemCountEl.textContent = '0 items';
            }
        }
    } catch (err) {
        console.error('Error load cart:', err);
        if (cartContainer) {
            cartContainer.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat cart.</p>';
        }
    }

    updateTotalDisplay();
}

// ================= LOAD USER =================
async function loadUserData() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const firstNameInp = document.getElementById('firstName');
    const lastNameInp  = document.getElementById('lastName');
    const addressInp   = document.getElementById('address');

    try {
        const res  = await fetch(`/api/auth/user/${userId}`);
        const user = await res.json();
        if (res.ok) {
            const namaParts    = (user.nama || '').split(' ');
            firstNameInp.value = namaParts[0] || '';
            lastNameInp.value  = namaParts.slice(1).join(' ') || '';
            addressInp.value   = user.alamat || '';
        }
    } catch (err) {
        console.error('Error load user:', err);
    }
}

// ================= UPDATE TOTAL =================
function updateTotalDisplay() {
    const displaySubtotalSpan = document.getElementById('displaySubtotal');
    const displayTotalSpan    = document.getElementById('displayTotal');
    if (displaySubtotalSpan) displaySubtotalSpan.innerText = `Rp${subtotal.toLocaleString('id-ID')}`;
    if (displayTotalSpan)    displayTotalSpan.innerText    = `Rp${Math.round(finalCheckoutTotal).toLocaleString('id-ID')}`;
}

// ================= SHIPPING =================
function initShipping() {
    const ships = document.querySelectorAll('.shipping-option');
    ships.forEach(opt => {
        opt.addEventListener('click', function () {
            ships.forEach(s => {
                s.style.background = 'transparent';
                const un = s.querySelector('.radio-unchecked');
                const ch = s.querySelector('.radio-checked');
                if (un) un.style.display = 'inline-block';
                if (ch) ch.style.display = 'none';
            });
            this.style.background = '#faf3ec';
            const uncheck = this.querySelector('.radio-unchecked');
            const check   = this.querySelector('.radio-checked');
            if (uncheck) uncheck.style.display = 'none';
            if (check)   check.style.display   = 'inline-block';

            selectedShipping = this.getAttribute('data-shipping');
            let base = subtotal + tax + (selectedShipping === 'express' ? 30000 : 0);
            finalCheckoutTotal = appliedDiscount ? base * 0.9 : base;
            updateTotalDisplay();
        });
    });
}

// ================= PAYMENT =================
function initPayment() {
    const payments = document.querySelectorAll('.payment-item');
    payments.forEach(pay => {
        pay.addEventListener('click', function () {
            payments.forEach(p => {
                p.style.background  = 'transparent';
                p.style.borderColor = '#e0cfc2';
                const un = p.querySelector('.radio-unchecked');
                const ch = p.querySelector('.radio-checked');
                if (un) un.style.display = 'inline-block';
                if (ch) ch.style.display = 'none';
            });
            this.style.background  = '#faf3ec';
            this.style.borderColor = '#b87c4f';
            const un = this.querySelector('.radio-unchecked');
            const ch = this.querySelector('.radio-checked');
            if (un) un.style.display = 'none';
            if (ch) ch.style.display = 'inline-block';
            selectedPayment = this.getAttribute('data-payment');
        });
    });
}

// ================= COUPON =================
function initCoupon() {
    const applyCouponBtn  = document.getElementById('applyCouponBtn');
    const couponCodeInput = document.getElementById('couponCode');

    applyCouponBtn.addEventListener('click', () => {
        const code = couponCodeInput.value.trim();
        if (code === 'DISKON10') {
            if (!appliedDiscount) {
                appliedDiscount = true;
                alert('✓ Kode berhasil! Diskon 10% diterapkan.');
                let base = subtotal + tax + (selectedShipping === 'express' ? 30000 : 0);
                finalCheckoutTotal = base * 0.9;
                updateTotalDisplay();
            } else {
                alert('Diskon sudah diterapkan');
            }
        } else if (code === '') {
            alert('Masukkan kode kupon');
        } else {
            alert('Kode kupon tidak valid');
        }
    });
}

// ================= PLACE ORDER =================
function initPlaceOrder() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    placeOrderBtn.addEventListener('click', () => {
        const firstNameInp = document.getElementById('firstName');
        const lastNameInp  = document.getElementById('lastName');
        const addressInp   = document.getElementById('address');

        const first = firstNameInp.value.trim();
        const last  = lastNameInp.value.trim();
        const addr  = addressInp.value.trim();

        if (!first || !last || !addr) { alert('Mohon lengkapi alamat pengiriman!'); return; }
        if (!selectedShipping)        { alert('Pilih metode pengiriman!');           return; }
        if (!selectedPayment)         { alert('Pilih metode pembayaran!');           return; }

        const orderItemsDisplay = document.getElementById('orderItemsDisplay');
        if (orderItemsDisplay) {
            orderItemsDisplay.innerHTML = cartItems.map(item => `
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <span>${item.produk?.nama || item.nama || '-'} x${item.jumlah}</span>
                    <span>Rp${(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                </div>
            `).join('');
        }

        document.getElementById('orderSubtotalDisplay').innerText = `Rp${subtotal.toLocaleString('id-ID')}`;
        document.getElementById('orderTotalDisplay').innerText    = `Rp${Math.round(finalCheckoutTotal).toLocaleString('id-ID')}`;
        document.getElementById('orderAddressDisplay').innerHTML  = `${first} ${last}<br>${addr}`;
        document.getElementById('orderShippingDisplay').innerText =
            selectedShipping === 'free' ? 'Free Shipping' : 'Express Shipping (+Rp30.000)';
        document.getElementById('orderPaymentDisplay').innerText  = getPaymentName(selectedPayment);

        document.getElementById('orderPopup').style.display = 'flex';
    });
}

// ================= HELPERS =================
function getPaymentName(pay) {
    const map = {
        credit: 'Credit/Debit Card', bni: 'BNI', mandiri: 'Mandiri',
        bca: 'BCA', bri: 'BRI', seabank: 'Seabank', shopeepay: 'ShopeePay',
        gopay: 'Gopay', dana: 'Dana', ovo: 'OVO'
    };
    return map[pay] || pay;
}

window.closeOrderPopup = function () {
    document.getElementById('orderPopup').style.display = 'none';
};

// ================= CONFIRM ORDER =================
window.confirmOrder = async function () {
    window.closeOrderPopup();

    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('Silakan login terlebih dahulu!');
        window.location.href = './loginuser.html';
        return;
    }

    const firstName = document.getElementById('firstName').value.trim();
    const lastName  = document.getElementById('lastName').value.trim();
    const address   = document.getElementById('address').value.trim();
    const alamatPengiriman = `${firstName} ${lastName}, ${address}`;

    try {
        // Fetch semua produk untuk mapping nama → _id & seller
        const produkRes   = await fetch('/api/produk');
        const semuaProduk = await produkRes.json();

        // ── Buat items dengan seller, TANPA filter produk null ──
        const items = cartItems.map(item => {
            const nama            = item.produk?.nama || item.nama;
            const produkDitemukan = semuaProduk.find(p => p.nama === nama);
            return {
                produk: produkDitemukan?._id    || null,
                seller: produkDitemukan?.seller || null,  // ← seller ikut disimpan
                jumlah: item.jumlah,
                harga:  item.harga
            };
        });
        // ↑ TIDAK ada .filter() — semua item tetap masuk walau produk tidak ketemu

        if (items.length === 0) {
            alert('Keranjang kosong!');
            return;
        }

        const res = await fetch('/api/order', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                items,
                totalHarga:       finalCheckoutTotal,
                alamatPengiriman,
                metodePembayaran: getPaymentName(selectedPayment)
            })
        });

        const order = await res.json();
        if (res.ok) {
            if (isBuyNowMode) {
                // Mode Buy it now: hapus HANYA item buy-now, cart biasa (kalau ada) dibiarkan utuh
                localStorage.removeItem('sakamadura_buynow_item');
            } else {
                // Mode checkout dari cart: kosongkan cart seperti biasa
                localStorage.removeItem('sakamadura_cart');
                localStorage.removeItem('sakamadura_cart_local');
            }
            showQRPayment(selectedPayment);
        } else {
            alert('Gagal membuat order: ' + (order.message || 'Unknown error'));
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan, coba lagi!');
    }
};

// ================= QR PAYMENT =================
function showQRPayment(method) {
    const popup        = document.getElementById('qrPopup');
    const methodSpan   = document.getElementById('methodName');
    const titleSpan    = document.getElementById('paymentMethodName');
    const orderNumSpan = document.getElementById('orderNumber');
    const qrImg        = document.getElementById('qrImage');

    const displayPay     = getPaymentName(method);
    titleSpan.innerText  = `Pembayaran ${displayPay}`;
    methodSpan.innerText = displayPay;

    const orderNum         = '#ORD-' + Date.now().toString().slice(-8);
    orderNumSpan.innerText = orderNum;
    document.getElementById('qrTotalAmount').innerText =
        `Rp${Math.round(finalCheckoutTotal).toLocaleString('id-ID')}`;

    const qrData  = `${method}-${orderNum}-${Date.now()}`;
    qrImg.src     = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    qrImg.style.display = 'block';

    popup.style.display = 'flex';
    startCountdown();
}

function startCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);
    timeLeft = 900;
    document.getElementById('countdown').innerText = '15:00';
    countdownInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            alert('Waktu pembayaran habis!');
            window.closeQR();
        } else {
            timeLeft--;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            document.getElementById('countdown').innerText =
                `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// ================= WINDOW FUNCTIONS =================
window.closeQR = function () {
    document.getElementById('qrPopup').style.display = 'none';
    if (countdownInterval) clearInterval(countdownInterval);
    timeLeft = 900;
};

window.checkPaymentStatus = function () {
    window.closeQR();
    document.getElementById('successPopup').style.display = 'flex';
};

window.goToOrders = function () {
    document.getElementById('successPopup').style.display = 'none';
    window.location.href = './order.html';
};

window.toggleMobileMenu = function () {
    document.getElementById('mobileMenu').classList.toggle('show');
};

window.onclick = function (e) {
    if (e.target === document.getElementById('qrPopup'))      window.closeQR();
    if (e.target === document.getElementById('successPopup')) window.goToOrders();
    if (e.target === document.getElementById('orderPopup'))   window.closeOrderPopup();
};

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    initShipping();
    initPayment();
    initCoupon();
    initPlaceOrder();
    loadCartData();
    loadUserData();
});