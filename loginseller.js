const form = document.querySelector(".login-form");

form.addEventListener("submit", function(e){
    e.preventDefault(); // biar ga reload

    const email = document.getElementById("log-email").value;
    const password = document.getElementById("log-pass").value;

    const sellerEmail = "seller@maduraweb.com";
    const sellerPassword = "123456";

    if(email === sellerEmail && password === sellerPassword){
        alert("Login Seller Berhasil!");
        // redirect ke dashboard seller
        window.location.href = "dashboard-seller.html";
    } else {
        alert("Email atau Password Seller salah!");
    }
});