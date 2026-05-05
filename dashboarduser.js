const userId = localStorage.getItem('userId');

// Kalau belum login, redirect ke halaman login
if (!userId) {
    window.location.href = './loginuser.html';
}

async function loadProfile() {
    try {
        const res = await fetch(`/api/auth/user/${userId}`);
        const user = await res.json();

        if (!res.ok) {
            alert('Gagal memuat profil!');
            return;
        }

        // Isi data profil
        const values = document.querySelectorAll('.info-value');
        values[0].textContent = user.nama;      // Username
        values[1].textContent = user.nama;      // Nama
        values[2].textContent = user.noHp;      // Nomor HP
        values[3].textContent = user.email;     // Email
        values[4].textContent = user.alamat;    // Alamat

        // Foto profil
        if (user.foto) {
            document.querySelector('.avatar').src = user.foto;
        }

    } catch (err) {
        console.error('Error:', err);
    }
}

// Logout
document.querySelector('a[href="./homepage.html"].setting-item')
    .addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('userId');
        window.location.href = './homepage.html';
    });

loadProfile();