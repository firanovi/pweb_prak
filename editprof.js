const userId = localStorage.getItem('userId');

if (!userId) {
    window.location.href = './loginuser.html';
}

// Load data user ke form
async function loadProfile() {
    try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const user = await res.json();

        const inputs = document.querySelectorAll('.form-input');
        inputs[0].value = user.nama;    // Username
        inputs[1].value = user.nama;    // Nama
        inputs[2].value = user.noHp;    // No. HP
        inputs[3].value = user.email;   // Email
        inputs[4].value = user.alamat;  // Alamat

    } catch (err) {
        console.error('Error:', err);
    }
}

// Submit form update profil
document.querySelector('.btn-primary').addEventListener('click', async (e) => {
    e.preventDefault();

    const inputs = document.querySelectorAll('.form-input');
    const nama = inputs[1].value;
    const noHp = inputs[2].value;
    const email = inputs[3].value;
    const alamat = inputs[4].value;

    try {
        const res = await fetch(`/api/auth/user/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nama, noHp, email, alamat })
        });

        const data = await res.json();

        if (res.ok) {
            alert('Profil berhasil diupdate!');
            window.location.href = './dashboarduser.html';
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Terjadi kesalahan, coba lagi!');
    }
});

loadProfile();