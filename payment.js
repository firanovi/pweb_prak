// ================= STATE =================
let selectedShipping = null;
let selectedPayment = null;
let countdownInterval = null;
let timeLeft = 900;
let appliedDiscount = false;

const firstNameInp = document.getElementById('firstName');
const lastNameInp = document.getElementById('lastName');
const addressInp = document.getElementById('address');
const applyCouponBtn = document.getElementById('applyCouponBtn');
const couponCodeInput = document.getElementById('couponCode');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const displayTotalSpan = document.getElementById('displayTotal');
const displaySubtotalSpan = document.getElementById('displaySubtotal');

let subtotal = 0;
let tax = 10000;
let finalCheckoutTotal = 0;

const userId = localStorage.getItem('userId');
let cartItems = [];

// ================= MAPPING GAMBAR LOKAL =================
const gambarProdukMap = {
    'Batik Sumenep':         './gambar/batiksumenep.jpg',
    'Kue Macho':             './img/kuemacho.png',
    'Kacang Otok':           './gambar/kacangotok.jpeg',
    'Buah Siwalan':          './gambar/buahsiwalan.jpg',
    'Odheng':                './gambar/odheng.png',
    'Miniatur Karapan Sapi': './img/miniaturkarapansapi.png',
    'Keripik Tette':         './img/keripiktette.jpeg',
    'Petis Madura':          './img/petismadura.png',
    'Rengginang Lorjuk':     './img/rengginanglorjuk.png',
    'Bolu Jubada':           './img/bolujubada.png',
    'Keripik Terung':        './img/keripikterung.png',
    'Kaos Sakera':           './gambar/kaossakera.jpeg',
};

function getGambar(item) {
    const nama = item.produk?.nama || '';
    return gambarProdukMap[nama] || item.produk?.gambar || './img/default.jpg';
}

// ================= LOAD CART =================
async function loadCartData() {
    try {
        if (userId) {
            const res = await fetch(`/api/cart/${userId}`);
            const cart = await res.json();
            cartItems = cart.items || [];

            subtotal = cartItems.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
            finalCheckoutTotal = subtotal + tax;

            const cartContainer = document.querySelector('.cart-items');
            if (cartContainer && cartItems.length > 0) {
                cartContainer.innerHTML = '';
                cartItems.forEach(item => {
                    cartContainer.innerHTML += `
                        <div class="cart-item">
                            <div class="item-left">
                                <img 
                                    src="${getGambar(item)}" 
                                    alt="${item.produk?.nama || 'Produk'}" 
                                    class="cart-item-image"
                                    onerror="this.src='./img/default.jpg'"
                                >
                                <div class="item-info">
                                    <div class="item-name"><strong>${item.produk?.nama || '-'}</strong></div>
                                    <div class="item-quantity">Quantity: ${item.jumlah}</div>
                                </div>
                            </div>
                            <div class="item-price">Rp${item.harga.toLocaleString('id-ID')}</div>
                        </div>
                    `;
                });
                document.querySelector('.item-count').textContent = `${cartItems.length} items`;
            } else if (cartContainer) {
                cartContainer.innerHTML = '<p style="text-align:center; color:#999;">Keranjang kosong</p>';
                document.querySelector('.item-count').textContent = '0 items';
            }
        } else {
            const cartData = JSON.parse(localStorage.getItem('sakamadura_cart') || '{}');
            cartItems = cartData.items || [];
            subtotal = cartData.subtotal || 0;
            finalCheckoutTotal = subtotal + tax;
        }
    } catch (err) {
        console.error('Error load cart:', err);
    }
    updateTotalDisplay();
}

// ================= LOAD USER =================
async function loadUserData() {
    if (!userId) return;
    try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const user = await res.json();
        if (res.ok) {
            const namaParts = (user.nama || '').split(' ');
            firstNameInp.value = namaParts[0] || '';
            lastNameInp.value = namaParts.slice(1).join(' ') || '';
            addressInp.value = user.alamat || '';
        }
    } catch (err) {
        console.error('Error load user:', err);
    }
}

// ================= UPDATE TOTAL =================
function updateTotalDisplay() {
    displaySubtotalSpan.innerText = `Rp${subtotal.toLocaleString('id-ID')}`;
    displayTotalSpan.innerText = `Rp${Math.round(finalCheckoutTotal).toLocaleString('id-ID')}`;
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
            const check = this.querySelector('.radio-checked');
            if (uncheck) uncheck.style.display = 'none';
            if (check) check.style.display = 'inline-block';

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
                p.style.background = 'transparent';
                p.style.borderColor = '#e0cfc2';
                const un = p.querySelector('.radio-unchecked');
                const ch = p.querySelector('.radio-checked');
                if (un) un.style.display = 'inline-block';
                if (ch) ch.style.display = 'none';
            });
            this.style.background = '#faf3ec';
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

// ================= PLACE ORDER =================
placeOrderBtn.addEventListener('click', () => {
    const first = firstNameInp.value.trim();
    const last = lastNameInp.value.trim();
    const addr = addressInp.value.trim();
    if (!first || !last || !addr) { alert('Mohon lengkapi alamat pengiriman!'); return; }
    if (!selectedShipping) { alert('Pilih metode pengiriman!'); return; }
    if (!selectedPayment) { alert('Pilih metode pembayaran!'); return; }

    // Isi order summary popup
    const orderItemsDisplay = document.getElementById('orderItemsDisplay');
    if (orderItemsDisplay) {
        orderItemsDisplay.innerHTML = cartItems.map(item => `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>${item.produk?.nama || '-'} x${item.jumlah}</span>
                <span>Rp${(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
            </div>
        `).join('');
    }

    document.getElementById('orderSubtotalDisplay').innerText = `Rp${subtotal.toLocaleString('id-ID')}`;
    document.getElementById('orderTotalDisplay').innerText = `Rp${Math.round(finalCheckoutTotal).toLocaleString('id-ID')}`;
    document.getElementById('orderAddressDisplay').innerHTML = `${first} ${last}<br>${addr}`;
    document.getElementById('orderShippingDisplay').innerText =
        selectedShipping === 'free' ? 'Free Shipping' : 'Express Shipping (+Rp30.000)';
    document.getElementById('orderPaymentDisplay').innerText = getPaymentName(selectedPayment);

    document.getElementById('orderPopup').style.display = 'flex';
});

// ================= HELPERS =================
function getPaymentName(pay) {
    const map = {
        credit: 'Credit/Debit Card', bni: 'BNI', mandiri: 'Mandiri',
        bca: 'BCA', bri: 'BRI', seabank: 'Seabank', shopeepay: 'ShopeePay',
        gopay: 'Gopay', dana: 'Dana', ovo: 'OVO'
    };
    return map[pay] || pay;
}

function closeOrderPopup() {
    document.getElementById('orderPopup').style.display = 'none';
}

// ================= CONFIRM ORDER =================
async function confirmOrder() {
    closeOrderPopup();

    if (!userId) {
        alert('Silakan login terlebih dahulu!');
        window.location.href = './loginuser.html';
        return;
    }

    const firstName = firstNameInp.value.trim();
    const lastName = lastNameInp.value.trim();
    const address = addressInp.value.trim();
    const alamatPengiriman = `${firstName} ${lastName}, ${address}`;

    const items = cartItems.map(item => ({
        produk: item.produk?._id || item.produk,
        jumlah: item.jumlah,
        harga: item.harga
    }));

    try {
        const res = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                items,
                totalHarga: finalCheckoutTotal,
                alamatPengiriman,
                metodePembayaran: getPaymentName(selectedPayment)
            })
        });

        const order = await res.json();

        if (res.ok) {
            localStorage.removeItem('sakamadura_cart');
            showQRPayment(selectedPayment);
        } else {
            alert('Gagal membuat order: ' + (order.message || 'Unknown error'));
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan, coba lagi!');
    }
}

// ================= QR PAYMENT =================
function showQRPayment(method) {
    const popup = document.getElementById('qrPopup');
    const methodSpan = document.getElementById('methodName');
    const titleSpan = document.getElementById('paymentMethodName');
    const orderNumSpan = document.getElementById('orderNumber');
    const qrImg = document.getElementById('qrImage');

    const displayPay = getPaymentName(method);
    titleSpan.innerText = `Pembayaran ${displayPay}`;
    methodSpan.innerText = displayPay;

    const orderNum = '#ORD-' + Date.now().toString().slice(-8);
    orderNumSpan.innerText = orderNum;
    document.getElementById('qrTotalAmount').innerText =
        `Rp${Math.round(finalCheckoutTotal).toLocaleString('id-ID')}`;

    const qrData = `${method}-${orderNum}-${Date.now()}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
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
            closeQR();
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
    closeQR();
    document.getElementById('successPopup').style.display = 'flex';
};

window.goToOrders = function () {
    document.getElementById('successPopup').style.display = 'none';
    window.location.href = './order.html';
};

window.toggleMobileMenu = function () {
    document.getElementById('mobileMenu').classList.toggle('show');
};

window.confirmOrder = confirmOrder;
window.closeOrderPopup = closeOrderPopup;

window.onclick = function (e) {
    if (e.target === document.getElementById('qrPopup')) closeQR();
    if (e.target === document.getElementById('successPopup')) goToOrders();
    if (e.target === document.getElementById('orderPopup')) closeOrderPopup();
};

// ================= INIT =================
initShipping();
initPayment();
loadCartData();
loadUserData();