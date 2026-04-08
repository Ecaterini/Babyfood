// ===== AUTH =====
function getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
}

function updateAuthButton() {
    const btn = document.getElementById("authBtn");
    if (!btn) return;

    const user = getCurrentUser();

    if (user) {
        btn.innerText = "Вийти";
        btn.onclick = logout;
    } else {
        btn.innerText = "Увійти";
        btn.onclick = () => {
            window.location.href = "/frontend/pages/auth/login.html";
        };
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "/frontend/index.html";
}