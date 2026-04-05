// Pastikan fungsi ini tersedia secara global
window.openTab = function(evt, tabName) {
    // 1. Ambil semua elemen konten
    const contents = document.getElementsByClassName("tab-content");
    
    // 2. Sembunyikan semua konten dengan menghapus class 'active-content'
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active-content");
        contents[i].style.display = "none"; // Paksa sembunyi
    }

    // 3. Hapus class 'active-cat' dari semua tombol navigasi
    const links = document.getElementsByClassName("cat-item");
    for (let i = 0; i < links.length; i++) {
        links[i].classList.remove("active-cat");
    }

    // 4. Tampilkan konten yang dipilih
    const activeSection = document.getElementById(tabName);
    if (activeSection) {
        activeSection.classList.add("active-content");
        activeSection.style.display = "block"; // Paksa tampil
    }
    
    // 5. Tandai tombol yang diklik sebagai aktif
    evt.currentTarget.classList.add("active-cat");

    // 6. Scroll otomatis ke posisi tab agar terlihat
    window.scrollTo({
        top: document.querySelector('.sub-nav').offsetTop - 80,
        behavior: 'smooth'
    });
}