// Register
async function register(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
    });

  const data = await res.json();

if (res.status !== 200) {
    alert(data.error);
    return;
}

alert("Реєстрація успішна");
    window.location.href = "login.html";
}

// Login
async function login(e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Вхід виконано ✅");
        window.location.href = "../../index.html";
    } else {
        alert(data.error || "Помилка входу");
    }
}

// Logout
function logout() {
    localStorage.removeItem("user");
    alert("Ви вийшли");
    window.location.href = "../../index.html";
}