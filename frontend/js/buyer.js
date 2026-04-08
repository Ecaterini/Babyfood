// INIT
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    updateAuthButton();

    if (document.getElementById("categories")) loadCategories();
    if (document.getElementById("products")) loadProducts();
    if (document.getElementById("product")) loadProduct();
    if (document.getElementById("cart")) loadCart();
    if (document.getElementById("orderItems")) loadCheckout();
    if (document.getElementById("orders")) loadOrders();
});

// ================= CATEGORIES =================
async function loadCategories() {
    const res = await fetch(`${API_URL}/api/categories`);
    const data = await res.json();

    const container = document.getElementById("categories");

    container.innerHTML = data.map(cat => `
        <div class="card" onclick="openCategory('${cat.category_name}')">
            <img src="/frontend/assets/images/${cat.image_url}" />
            <div class="card-content">
                <h3>${cat.category_name}</h3>
                <p>${cat.description || ''}</p>
            </div>
        </div>
    `).join('');
}

function openCategory(name) {
    window.location.href = `pages/buyer/catalog.html?category=${encodeURIComponent(name)}`;
}

// ================= PRODUCTS =================
async function loadProducts() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
const search = params.get("search");
    let url = `${API_URL}/api/products`;

if (category) {
    url += `?category=${encodeURIComponent(category)}`;
}

if (search) {
    url += category
        ? `&search=${encodeURIComponent(search)}`
        : `?search=${encodeURIComponent(search)}`;
}

    const res = await fetch(url);
    const data = await res.json();

    const container = document.getElementById("products");

    container.innerHTML = data.map(p => `
        <div class="card">
            <img src="../../assets/images/${p.image_url}" />

            <div class="card-content">
                <h3>${p.product_name}</h3>
                <p>${p.price} грн</p>

                <button onclick="openProduct(${p.product_id})">
                    Детальніше
                </button>
            </div>
        </div>
    `).join('');
}

function openProduct(id) {
    window.location.href = `product.html?id=${id}`;
}

// ================= PRODUCT =================
async function loadProduct() {
    const id = new URLSearchParams(window.location.search).get("id");

    const res = await fetch(`${API_URL}/api/products/${id}`);
    const p = await res.json();

    const container = document.getElementById("product");

    container.innerHTML = `
        <div class="card" style="max-width:600px;">
            <img src="../../assets/images/${p.image_url}" />

            <div class="card-content">
                <h2>${p.product_name}</h2>
                <p><b>Ціна:</b> ${p.price} грн</p>
                <p>${p.description || ''}</p>

                <button onclick="addToCart(${p.product_id})">
                    Додати в кошик
                </button>
            </div>
        </div>
    `;
}

// ================= CART =================
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(i => i.product_id === productId);

    if (existing) {
        alert("Товар вже у кошику");
        return;
    }

    cart.push({ product_id: productId, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert("Товар додано в кошик ✅");
}

async function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart");

    if (!cart.length) {
        container.innerHTML = "Кошик порожній";
        document.getElementById("total").innerText = "Разом: 0 грн";
        return;
    }

    let total = 0;

    const items = await Promise.all(cart.map(async item => {
        const res = await fetch(`${API_URL}/api/products/${item.product_id}`);
        const p = await res.json();

        total += p.price * item.quantity;

        return `
        <div class="card">
            <div class="card-content">
                <h3>${p.product_name}</h3>

                <div style="display:flex; gap:10px; align-items:center;">
                    <button onclick="changeQty(${p.product_id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQty(${p.product_id}, 1)">+</button>
                </div>

                <p>${item.quantity} × ${p.price} грн</p>

                <button onclick="removeFromCart(${p.product_id})">
                    Видалити
                </button>
            </div>
        </div>
        `;
    }));

    container.innerHTML = items.join('');
    document.getElementById("total").innerText = `Разом: ${total} грн`;
}

function changeQty(id, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(i => i.product_id === id);

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.product_id !== id);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(i => i.product_id !== id);

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

function goToCheckout() {
    window.location.href = "checkout.html";
}

// ================= CHECKOUT =================
async function loadCheckout() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("orderItems");

    if (!cart.length) {
        container.innerHTML = "Кошик порожній";
        document.getElementById("total").innerText = "Разом: 0 грн";
        return;
    }

    let total = 0;

    const items = await Promise.all(cart.map(async item => {
        const res = await fetch(`${API_URL}/api/products/${item.product_id}`);
        const p = await res.json();

        total += p.price * item.quantity;

        return `
            <p>${p.product_name} — ${item.quantity} × ${p.price} грн</p>
        `;
    }));

    container.innerHTML = items.join('');
    document.getElementById("total").innerText = `Разом: ${total} грн`;
}

function submitOrder(e) {
    e.preventDefault();

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart.length) {
        alert("Кошик порожній");
        return;
    }

    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    orders.push({
        id: Date.now(),
        items: cart
    });

    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.removeItem("cart");

    alert("Замовлення оформлено ✅");

    window.location.href = "orders.html";
}
function clearCart() {
    localStorage.removeItem("cart");
    updateCartCount();
    loadCart();
}
// ================= ORDERS =================
async function loadOrders() {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    const container = document.getElementById("orders");

    if (!orders.length) {
        container.innerHTML = "<p>Немає замовлень</p>";
        return;
    }

    const html = await Promise.all(orders.map(async order => {
        const items = await Promise.all(order.items.map(async item => {
            const res = await fetch(`${API_URL}/api/products/${item.product_id}`);
            const p = await res.json();
            return `<li>${p.product_name}</li>`;
        }));

       return `
<div class="card">
    <div class="card-content">
        <h3>Замовлення #${order.id}</h3>
        <ul>${items.join('')}</ul>

        <button onclick="repeatOrder(${order.id})">
            Повторити
        </button>
    </div>
</div>
`;
    }));

    container.innerHTML = html.join('');
}
function repeatOrder(id) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    const order = orders.find(o => o.id === id);
    if (!order) return;

    localStorage.setItem("cart", JSON.stringify(order.items));

    alert("Замовлення додано в кошик");

    window.location.href = "cart.html";
}
// ================= UI =================
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const el = document.getElementById("cart-count");
    if (el) el.innerText = cart.length;
}
function searchProducts() {
    const value = document.getElementById("searchInput").value;

    if (!value) {
        alert("Введіть текст");
        return;
    }

   window.location.href = `/frontend/pages/buyer/catalog.html?search=${encodeURIComponent(value)}`;
}
function applyFilter() {
    const category = document.getElementById("categoryFilter").value;

    if (!category) {
        window.location.href = "catalog.html";
        return;
    }

    window.location.href = `catalog.html?category=${encodeURIComponent(category)}`;
}