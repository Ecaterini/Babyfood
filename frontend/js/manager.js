
// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
    loadOrders();
    generateReport();
    loadProductsManager();
});

// ===== LOAD ORDERS =====
function loadOrders(statusFilter = "all") {
    const container = document.getElementById("orders");
    if (!container) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (!orders.length) {
        container.innerHTML = "<p>Немає замовлень</p>";
        return;
    }

    let filtered = orders;

    if (statusFilter !== "all") {
        filtered = orders.filter(o => (o.status || "new") === statusFilter);
    }

    if (!filtered.length) {
        container.innerHTML = "<p>Немає замовлень з таким статусом</p>";
        return;
    }

    container.innerHTML = filtered.map(order => {

        const items = order.items || [];

        const itemsHtml = items.length
            ? items.map(i => {
                const product = products.find(p => p.product_id == i.product_id);

                return `<li>
                    ${product ? product.product_name : "Товар"} 
                    (${i.quantity} шт)
                </li>`;
            }).join('')
            : "<li>Немає товарів</li>";

        return `
        <div class="card">
            <div class="card-content">
                <h3>Замовлення #${order.id}</h3>

                <p><strong>Клієнт:</strong> ${order.userName || "Гість"}</p>

                <p><strong>Товари:</strong></p>
                <ul>${itemsHtml}</ul>

                <p><strong>Статус:</strong> ${
                    (order.status || "new") === "new" ? "Нове" :
                    (order.status === "processing") ? "В обробці" :
                    (order.status === "done") ? "Завершене" : "Невідомо"
                }</p>

                <div style="margin-top:10px;">
                    <button onclick="changeStatus('${order.id}', 'processing')">В обробку</button>
                    <button onclick="changeStatus('${order.id}', 'done')">Завершити</button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

// ===== FILTER =====
function applyFilter() {
    const status = document.getElementById("statusFilter").value;
    loadOrders(status);
}

// ===== CHANGE STATUS =====
window.changeStatus = function (orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const updated = orders.map(o => {
        if (o.id == orderId) {
            return { ...o, status: newStatus };
        }
        return o;
    });

    localStorage.setItem("orders", JSON.stringify(updated));

    loadOrders();
    generateReport();
}

// ===== REPORT =====
function generateReport() {
    const reportDiv = document.getElementById("report");
    if (!reportDiv) return;

    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    const totalOrders = orders.length;
    const processing = orders.filter(o => o.status === "processing").length;
    const done = orders.filter(o => o.status === "done").length;

    let totalItems = 0;

    orders.forEach(o => {
        (o.items || []).forEach(i => {
            totalItems += i.quantity || 0;
        });
    });

    reportDiv.innerHTML = `
        <p><strong>Всього замовлень:</strong> ${totalOrders}</p>
        <p><strong>В обробці:</strong> ${processing}</p>
        <p><strong>Завершені:</strong> ${done}</p>
        <p><strong>Продано товарів:</strong> ${totalItems}</p>
    `;
}

// ===== PRODUCTS (MANAGER) =====
async function loadProductsManager() {
    const container = document.getElementById("productsList");
    if (!container) return;

    const res = await fetch("http://localhost:3000/api/products");
    const products = await res.json();

    container.innerHTML = products.map(p => `
        <div class="manager-card">
            <h3>${p.product_name}</h3>
            <p>На складі: ${p.stock_quantity}</p>

            <div class="manager-buttons">
                <button onclick="changeStock(${p.product_id}, 1)">+1</button>
                <button onclick="changeStock(${p.product_id}, -1)">-1</button>
            </div>
        </div>
    `).join('');
}

// ===== CHANGE STOCK (FIXED) =====
window.changeStock = async function(id, delta) {
    const res = await fetch("http://localhost:3000/api/products");
    const products = await res.json();

    const product = products.find(p => p.product_id == id);
    if (!product) return;

    const newStock = Number(product.stock_quantity) + delta;

    if (newStock < 0) return;

    await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ stock_quantity: newStock })
    });

    loadProductsManager();
};

// ===== NAVIGATION =====
window.goToOrders = function () {
    window.location.href = "orders.html";
};
window.goToProducts = function () {
    window.location.href = "products.html";
};