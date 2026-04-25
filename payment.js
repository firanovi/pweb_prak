let countdownInterval;
let timeLeft = 900; // 15 menit dalam detik

function showQR(method) {
    document.getElementById('paymentMethodName').textContent = 'Pembayaran ' + method;
    document.getElementById('methodName').textContent = method;
    document.getElementById('qrPopup').style.display = 'flex';
    
    // Generate QR code URL (menggunakan API placeholder)
    const qrText = `PAYMENT-${method}-${Date.now()}`;
    document.getElementById('qrImage').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
    document.getElementById('qrImage').style.display = 'block';
    document.querySelector('.qr-placeholder i').style.display = 'none';
    
    startCountdown();
}

function closeQR() {
    document.getElementById('qrPopup').style.display = 'none';
    clearInterval(countdownInterval);
    timeLeft = 900;
    document.getElementById('countdown').textContent = '15:00';
}

function startCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('countdown').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            alert('Waktu pembayaran habis!');
            closeQR();
        }
    }, 1000);
}

function checkPaymentStatus() {
    // Simulasi cek pembayaran
    closeQR();
    document.getElementById('successPopup').style.display = 'flex';
}

function goToOrders() {
    window.location.href = './order.html';
}

// Tutup popup jika klik di luar
window.onclick = function(event) {
    const qrPopup = document.getElementById('qrPopup');
    const successPopup = document.getElementById('successPopup');
    if (event.target === qrPopup) {
        closeQR();
    }
    if (event.target === successPopup) {
        goToOrders();
    }
}