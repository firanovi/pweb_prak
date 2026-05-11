// state 
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

let subtotal = 540000;
let tax = 10000;
let finalCheckoutTotal = 540000;

const userId = localStorage.getItem('userId');
let cartItems = [];

// Load cart dari database
async function loadCartData() {
    try {
        if (userId) {
            const res = await fetch(`/api/cart/${userId}`);
            const cart = await res.json();
            cartItems = cart.items || [];

            subtotal = cartItems.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
            finalCheckoutTotal = subtotal;

            const cartContainer = document.querySelector('.cart-items');
            if (cartContainer && cartItems.length > 0) {
                cartContainer.innerHTML = '';
                cartItems.forEach(item => {
                    cartContainer.innerHTML += `
                        <div class="cart-item">
                            <div class="item-left">
                                <img src="${item.produk?.gambar || './img/default.jpg'}" 
                                     alt="${item.produk?.nama}" class="cart-item-image">
                                <div class="item-info">
                                    <div class="item-name"><strong>${item.produk?.nama}</strong></div>
                                    <div class="item-quantity">Quantity: ${item.jumlah}</div>
                                </div>
                            </div>
                            <div class="item-price">Rp${item.harga.toLocaleString('id-ID')}</div>
                        </div>
                    `;
                });
                document.querySelector('.item-count').textContent = `${cartItems.length} items`;
            }
        } else {
            const cartData = JSON.parse(localStorage.getItem('sakamadura_cart') || '{}');
            cartItems = cartData.items || [];
            subtotal = cartData.subtotal || 540000;
            finalCheckoutTotal = subtotal;
        }
    } catch (err) {
        console.error('Error load cart:', err);
    }
    updateTotalDisplay();
}

// Load data user untuk auto-fill alamat & nama
async function loadUserData() {
    if (!userId) return;
    try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const user = await res.json();
        if (res.ok) {
            const namaParts = user.nama.split(' ');
            firstNameInp.value = namaParts[0] || '';
            lastNameInp.value = namaParts.slice(1).join(' ') || '';
            addressInp.value = user.alamat || '';
        }
    } catch (err) {
        console.error('Error load user:', err);
    }
}

function updateTotalDisplay() {
    displaySubtotalSpan.innerText = `Rp${subtotal.toLocaleString().replace(/,/g, '.')}`;
    displayTotalSpan.innerText = `Rp${finalCheckoutTotal.toLocaleString().replace(/,/g, '.')}`;
}

// Shipping options
function initShipping() {
    const ships = document.querySelectorAll('.shipping-option');
    ships.forEach(opt => {
        opt.addEventListener('click', function() {
            ships.forEach(s => {
                s.style.background = 'transparent';
                let un = s.querySelector('.radio-unchecked');
                let ch = s.querySelector('.radio-checked');
                if(un) un.style.display = 'inline-block';
                if(ch) ch.style.display = 'none';
            });
            this.style.background = '#faf3ec';
            let uncheck = this.querySelector('.radio-unchecked');
            let check = this.querySelector('.radio-checked');
            if(uncheck) uncheck.style.display = 'none';
            if(check) check.style.display = 'inline-block';
            selectedShipping = this.getAttribute('data-shipping');
            if(selectedShipping === 'express') finalCheckoutTotal = subtotal + 30000;
            else finalCheckoutTotal = subtotal;
            if(appliedDiscount) finalCheckoutTotal = finalCheckoutTotal * 0.9;
            displayTotalSpan.innerText = `Rp${Math.round(finalCheckoutTotal).toLocaleString().replace(/,/g, '.')}`;
        });
    });
}

// Payment options
function initPayment() {
    const payments = document.querySelectorAll('.payment-item');
    payments.forEach(pay => {
        pay.addEventListener('click', function() {
            payments.forEach(p => {
                p.style.background = 'transparent';
                p.style.borderColor = '#e0cfc2';
                let un = p.querySelector('.radio-unchecked');
                let ch = p.querySelector('.radio-checked');
                if(un) un.style.display = 'inline-block';
                if(ch) ch.style.display = 'none';
            });
            this.style.background = '#faf3ec';
            this.style.borderColor = '#b87c4f';
            let un = this.querySelector('.radio-unchecked');
            let ch = this.querySelector('.radio-checked');
            if(un) un.style.display = 'none';
            if(ch) ch.style.display = 'inline-block';
            selectedPayment = this.getAttribute('data-payment');
        });
    });
}

// Coupon
applyCouponBtn.addEventListener('click', () => {
    let code = couponCodeInput.value.trim();
    if(code === 'DISKON10') {
        if(!appliedDiscount) {
            appliedDiscount = true;
            alert('✓ Kode berhasil! Diskon 10% diterapkan.');
            let base = subtotal + (selectedShipping === 'express' ? 30000 : 0);
            finalCheckoutTotal = base * 0.9;
            displayTotalSpan.innerText = `Rp${Math.round(finalCheckoutTotal).toLocaleString().replace(/,/g, '.')}`;
        } else alert('Diskon sudah diterapkan');
    } else if(code === '') alert('Masukkan kode kupon');
    else alert('Kode kupon tidak valid');
});

// Place order button
placeOrderBtn.addEventListener('click', () => {
    let first = firstNameInp.value.trim();
    let last = lastNameInp.value.trim();
    let addr = addressInp.value.trim();
    if(!first || !last || !addr) { alert('Mohon lengkapi alamat pengiriman!'); return; }
    if(!selectedShipping) { alert('Pilih metode pengiriman!'); return; }
    if(!selectedPayment) { alert('Pilih metode pembayaran!'); return; }

    let fullAddress = `${first} ${last}<br>${addr}`;
    document.getElementById('orderAddressDisplay').innerHTML = fullAddress;
    let shipText = selectedShipping === 'free' ? 'Free Shipping (0)' : 'Express Shipping (+Rp30.000)';
    document.getElementById('orderShippingDisplay').innerHTML = shipText;
    document.getElementById('orderPaymentDisplay').innerHTML = getPaymentName(selectedPayment);
    document.getElementById('orderPopup').style.display = 'flex';
});

function getPaymentName(pay) {
    const map = {
        credit:'Credit/Debit Card', bni:'BNI', mandiri:'Mandiri',
        bca:'BCA', bri:'BRI', seabank:'Seabank', shopeepay:'ShopeePay',
        gopay:'Gopay', dana:'Dana', ovo:'OVO'
    };
    return map[pay] || pay;
}

function closeOrderPopup() { document.getElementById('orderPopup').style.display = 'none'; }

// Confirm order - simpan ke database
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
            alert('Gagal membuat order: ' + order.message);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan, coba lagi!');
    }
}

function showQRPayment(method) {
    let popup = document.getElementById('qrPopup');
    let methodSpan = document.getElementById('methodName');
    let titleSpan = document.getElementById('paymentMethodName');
    let orderNumSpan = document.getElementById('orderNumber');
    let qrImg = document.getElementById('qrImage');
    let displayPay = getPaymentName(method);
    titleSpan.innerText = `Pembayaran ${displayPay}`;
    methodSpan.innerText = displayPay;
    let orderNum = '#ORD-' + Date.now().toString().slice(-8);
    orderNumSpan.innerText = orderNum;
    document.getElementById('qrTotalAmount').innerHTML = `Rp${finalCheckoutTotal.toLocaleString().replace(/,/g, '.')}`;
    let qrData = `${method}-${orderNum}-${Date.now()}`;
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
    qrImg.style.display = 'block';
    popup.style.display = 'flex';
    startCountdown();
}

function startCountdown() {
    if(countdownInterval) clearInterval(countdownInterval);
    timeLeft = 900;
    document.getElementById('countdown').innerText = '15:00';
    countdownInterval = setInterval(() => {
        if(timeLeft <= 0) {
            clearInterval(countdownInterval);
            alert('Waktu pembayaran habis!');
            closeQR();
        } else {
            timeLeft--;
            let mins = Math.floor(timeLeft/60);
            let secs = timeLeft%60;
            document.getElementById('countdown').innerText = 
                `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
        }
    }, 1000);
}

window.closeQR = function() {
    document.getElementById('qrPopup').style.display = 'none';
    if(countdownInterval) clearInterval(countdownInterval);
    timeLeft = 900;
}

window.checkPaymentStatus = function() {
    closeQR();
    document.getElementById('successPopup').style.display = 'flex';
    if(countdownInterval) clearInterval(countdownInterval);
}

window.goToOrders = function() {
    document.getElementById('successPopup').style.display = 'none';
    window.location.href = './order.html';
}

window.toggleMobileMenu = function() {
    document.getElementById('mobileMenu').classList.toggle('show');
}

window.onclick = function(e) {
    if(e.target === document.getElementById('qrPopup')) closeQR();
    if(e.target === document.getElementById('successPopup')) goToOrders();
    if(e.target === document.getElementById('orderPopup')) closeOrderPopup();
}

// Init
initShipping();
initPayment();
loadCartData();
loadUserData();