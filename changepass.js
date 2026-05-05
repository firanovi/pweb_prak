const userId = localStorage.getItem('userId'); // Dari session login nanti

document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll('.form-input');
    const passwordLama = inputs[0].value;
    const passwordBaru = inputs[1].value;
    const konfirmasi = inputs[2].value;

    // Validasi password baru dan konfirmasi
    if (passwordBaru !== konfirmasi) {
        alert('Password baru dan konfirmasi tidak sama!');
        return;
    }

    try {
        const res = await fetch('/api/auth/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, passwordLama, passwordBaru })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Password berhasil diubah!');
            window.location.href = './dashboarduser.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        alert('Terjadi kesalahan, coba lagi!');
    }
});