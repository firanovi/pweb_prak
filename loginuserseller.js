const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");

function loginFunction() {
  loginForm.style.left = "50%";
  loginForm.style.opacity = 1;
  registerForm.style.left = "150%";
  registerForm.style.opacity = 0;
  wrapper.style.height = "500px";
  loginTitle.style.top = "50%";
  loginTitle.style.opacity = 1;
  registerTitle.style.top = "50px";
  registerTitle.style.opacity = 0;
}

function registerFunction() {
  loginForm.style.left = "-50%";
  loginForm.style.opacity = 0;
  registerForm.style.left = "50%";
  registerForm.style.opacity = 1;
  wrapper.style.height = "580px";
  loginTitle.style.top = "-60%";
  loginTitle.style.opacity = 0;
  registerTitle.style.top = "50%";
  registerTitle.style.opacity = 1;
}

// ── TOGGLE PASSWORD ───────────────────────────────────────────
document.querySelectorAll('.toggle-pass').forEach(icon => {
  icon.addEventListener('click', () => {
    const targetId = icon.getAttribute('data-target');
    const input = document.getElementById(targetId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      icon.classList.remove('bx-hide');
      icon.classList.add('bx-show');
    } else {
      input.type = 'password';
      icon.classList.remove('bx-show');
      icon.classList.add('bx-hide');
    }
  });
});

// ── LOGIN ─────────────────────────────────────────────────────
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const email    = document.getElementById("log-email").value.trim();
  const password = document.getElementById("log-pass").value;

  try {
    const sellerRes = await fetch("/api/seller/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (sellerRes.ok) {
      const data = await sellerRes.json();
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("sellerId", data.sellerId);
      localStorage.setItem("nama", data.nama);
      localStorage.setItem("namaToko", data.namaToko);
      localStorage.setItem("role", "seller");
      alert("Login Seller Berhasil! Selamat datang, " + data.nama);
      window.location.href = "dashboardseller.html";
      return;
    }
  } catch (err) {
    console.warn("Seller login gagal, coba user biasa...");
  }

  try {
    const userRes = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const userData = await userRes.json();

    if (userRes.ok) {
      localStorage.setItem("userId", userData.userId);
      localStorage.setItem("nama", userData.nama);
      localStorage.setItem("role", "user");
      alert("Login Berhasil! Selamat datang, " + userData.nama);
      window.location.href = "dashboarduser.html";
    } else {
      alert(userData.message || "Email atau Password salah!");
    }
  } catch (err) {
    alert("Gagal terhubung ke server. Pastikan server berjalan.");
  }
});

// ── REGISTER ──────────────────────────────────────────────────
if (registerForm) {
  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nama     = document.getElementById("reg-name").value.trim();
    const email    = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-pass").value;

    if (!nama || !email || !password) {
      alert("Semua field wajib diisi!");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi Berhasil! Silakan login.");
        loginFunction();
      } else {
        alert(data.message || "Registrasi gagal!");
      }
    } catch (err) {
      alert("Gagal terhubung ke server. Pastikan server berjalan.");
    }
  });
}