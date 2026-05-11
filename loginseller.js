const form = document.querySelector(".login-form");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("log-email").value.trim();
  const password = document.getElementById("log-pass").value;

  try {
    const res = await fetch("/api/seller/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("sellerId", data.sellerId);
      localStorage.setItem("nama", data.nama);
      localStorage.setItem("namaToko", data.namaToko);
      localStorage.setItem("role", "seller");
      alert("Login Seller Berhasil! Selamat datang, " + data.nama);
      window.location.href = "dashboardseller.html";
    } else {
      alert(data.message || "Email atau Password Seller salah!");
    }
  } catch (err) {
    alert("Gagal terhubung ke server. Pastikan server berjalan.");
  }
});