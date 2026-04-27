const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

function loginFunction(){
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

function registerFunction(){
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

// LOGIN LOGIC (User Biasa vs Seller)
const form = document.querySelector(".login-form");

form.addEventListener("submit", function(e){
    e.preventDefault(); // biar ga reload

    const email = document.getElementById("log-email").value;
    const password = document.getElementById("log-pass").value;

    // Credentials Seller
    const sellerEmail = "seller@maduraweb.com";
    const sellerPassword = "123456";

    // Credentials User Biasa (contoh - bisa diganti dengan database)
    const userEmail = "user@example.com";
    const userPassword = "user123";

    if(email === sellerEmail && password === sellerPassword){
        alert("Login Seller Berhasil!");
        // redirect ke dashboard seller
        window.location.href = "dashboardseller.html";
    } 
    else if(email === userEmail && password === userPassword){
        alert("Login User Berhasil!");
        // redirect ke dashboard user biasa
        window.location.href = "dashboarduser.html";
    }
    else {
        alert("Email atau Password salah!");
    }
});