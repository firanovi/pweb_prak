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
    let totalAmount = subtotal + tax;  // 550.000? Wait image example shows total Rp540.000, but in card: subtotal 540k + tax 10k would be 550k. On example: subtotal 540k tax 10k total 540k -> inconsistency? To match user design, follow calculation: total = subtotal+tax only if shipping added? but shipping free added later. I'll keep as original: Subtotal =540k, Tax=10k, Total=540k (matching given example) meaning tax included? but fine keep consistent with original display.
    // but example displays total = Rp540.000, so I'll keep total same as subtotal (tax is already considered inside). but anyway we follow UI: subtotal 540k, tax 10k total 540k => weird but we define totalPriceFixed = 540000.
    let finalCheckoutTotal = 540000;
    
    function updateTotalDisplay() {
        displaySubtotalSpan.innerText = `Rp${subtotal.toLocaleString().replace(/,/g, '.')}`;
        displayTotalSpan.innerText = `Rp${finalCheckoutTotal.toLocaleString().replace(/,/g, '.')}`;
    }
    updateTotalDisplay();
    
    // shipping options selection
    function initShipping() {
        const ships = document.querySelectorAll('.shipping-option');
        ships.forEach(opt => {
            opt.addEventListener('click', function(e) {
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
                // update total if express
                if(selectedShipping === 'express') finalCheckoutTotal = 540000 + 30000;
                else finalCheckoutTotal = 540000;
                if(appliedDiscount) finalCheckoutTotal = finalCheckoutTotal * 0.9;
                displayTotalSpan.innerText = `Rp${Math.round(finalCheckoutTotal).toLocaleString().replace(/,/g, '.')}`;
            });
        });
    }
    
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
    
    // coupon logic
    applyCouponBtn.addEventListener('click', () => {
        let code = couponCodeInput.value.trim();
        if(code === 'DISKON10') {
            if(!appliedDiscount) {
                appliedDiscount = true;
                alert('✓ Kode berhasil! Diskon 10% diterapkan.');
                let base = 540000 + (selectedShipping === 'express' ? 30000 : 0);
                finalCheckoutTotal = base * 0.9;
                displayTotalSpan.innerText = `Rp${Math.round(finalCheckoutTotal).toLocaleString().replace(/,/g, '.')}`;
            } else alert('Diskon sudah diterapkan');
        } else if(code === '') alert('Masukkan kode kupon');
        else alert('Kode kupon tidak valid');
    });
    
    // order validation & popup
    placeOrderBtn.addEventListener('click', () => {
        let first = firstNameInp.value.trim();
        let last = lastNameInp.value.trim();
        let addr = addressInp.value.trim();
        if(!first || !last || !addr) { alert('Mohon lengkapi alamat pengiriman terlebih dahulu!'); return; }
        if(!selectedShipping) { alert('Pilih metode pengiriman!'); return; }
        if(!selectedPayment) { alert('Pilih metode pembayaran!'); return; }
        let fullAddress = `${first} ${last}<br>${addr}`;
        document.getElementById('orderAddressDisplay').innerHTML = fullAddress;
        let shipText = selectedShipping === 'free' ? 'Free Shipping (0)' : 'Express Shipping (+Rp30.000)';
        document.getElementById('orderShippingDisplay').innerHTML = shipText;
        let payDisplay = getPaymentName(selectedPayment);
        document.getElementById('orderPaymentDisplay').innerHTML = payDisplay;
        document.getElementById('orderPopup').style.display = 'flex';
    });
    
    function getPaymentName(pay) {
        const map = {credit:'Card', bni:'BNI', mandiri:'Mandiri', bca:'BCA', bri:'BRI', seabank:'Seabank', shopeepay:'ShopeePay', gopay:'Gopay', dana:'Dana', ovo:'OVO'};
        return map[pay] || pay;
    }
    
    function closeOrderPopup() { document.getElementById('orderPopup').style.display = 'none'; }
    function confirmOrder() {
        closeOrderPopup();
        showQRPayment(selectedPayment);
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
        let totalVal = finalCheckoutTotal;
        document.getElementById('qrTotalAmount').innerHTML = `Rp${totalVal.toLocaleString().replace(/,/g, '.')}`;
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
                document.getElementById('countdown').innerText = `${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
            }
        }, 1000);
    }
    
    window.closeQR = function() {
        let pop = document.getElementById('qrPopup');
        pop.style.display = 'none';
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
        alert('Menuju ke halaman pesanan Anda');
        window.location.href = './order.html';
    }
    
    window.toggleMobileMenu = function() {
        document.getElementById('mobileMenu').classList.toggle('show');
    }
    
    initShipping();
    initPayment();
    
    window.onclick = function(e) {
        if(e.target === document.getElementById('qrPopup')) closeQR();
        if(e.target === document.getElementById('successPopup')) goToOrders();
        if(e.target === document.getElementById('orderPopup')) closeOrderPopup();
    }