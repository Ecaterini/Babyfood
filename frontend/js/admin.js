window.goToCatalogAdmin = function () {
    window.location.href = "catalog.html";
};

window.goToCategories = function () {
    window.location.href = "categories.html";
};

window.goToBrands = function () {
    window.location.href = "brands.html";
};

window.goToUsers = function () {
    window.location.href = "users.html";
};
// ===== ADMIN CATALOG =====
document.addEventListener("DOMContentLoaded", () => {
    loadProductsAdmin();
    initCategoriesPage();
    initBrandsPage();
    initUsersPage();
});

async function loadProductsAdmin() {
    const container = document.getElementById("products");
    if (!container) return;

    const res = await fetch("http://localhost:3000/api/products");
    const products = await res.json();

   container.innerHTML = products.map(p => `
    <div class="card admin-card">
        
        <div class="admin-image-wrapper">
            <img src="../../assets/images/${p.image_url}" 
                 onerror="this.src='https://via.placeholder.com/150'" />

            <span class="change-photo">Змінити фото</span>
        </div>

        <h3>${p.product_name}</h3>
        <p>${p.price} грн</p>

       <div class="admin-actions">
    <button onclick="editProduct(${p.product_id})">✏️ Редагувати</button>
    <button onclick="deleteProduct(${p.product_id})">🗑 Видалити</button>
    <button onclick="viewProduct(${p.product_id})">Детальніше</button>
</div>
    </div>
`).join('');
}
window.deleteProduct = function(id) {
    console.log("delete", id);
};

window.editProduct = function(id) {
    console.log("edit", id);
};
// ===== ADD PRODUCT MODAL =====

window.openAddProduct = async function() {
    document.getElementById("addProductModal").classList.remove("hidden");
    await loadCategoriesToSelect();
};

window.closeModal = function() {
    document.getElementById("addProductModal").classList.add("hidden");
};

// load categories for select
async function loadCategoriesToSelect() {
    const select = document.getElementById("newCategory");
    if (!select) return;

    const res = await fetch("http://localhost:3000/api/categories");
    const categories = await res.json();

    select.innerHTML = `
        <option value="">Оберіть категорію</option>
        ${categories.map(c => `
            <option value="${c.category_id}">
                ${c.category_name}
            </option>
        `).join('')}
    `;
}

// add product
window.addProduct = function() {
    const name = document.getElementById("newName").value;
    const price = document.getElementById("newPrice").value;
    const category = document.getElementById("newCategory").value;

    if (!name || !price || !category) {
        alert("Заповніть всі поля");
        return;
    }

    alert("Товар додано");

    closeModal();
};
// ===== LOCAL CATEGORIES =====
let localCategories = [
    { category_name: "Дитячі суміші" },
    { category_name: "Дитячий прикорм" },
    { category_name: "Лікувальне харчування" }
];

function renderCategories() {
    const container = document.getElementById("categoriesList");
    if (!container) return;

   container.innerHTML = localCategories.map((c, index) => `
    <div class="admin-category-card">
        <span>${c.category_name}</span>

        <button class="admin-delete-btn" onclick="fakeDeleteCategory(${index})">
            🗑
        </button>
    </div>
`).join('');
}

function initCategoriesPage() {
    const container = document.getElementById("categoriesList");
    if (!container) return;

    renderCategories();

    const btn = document.getElementById("saveCategoryBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {
        const input = document.getElementById("newCategoryName");
        const name = input.value.trim();

        if (!name) {
            alert("Введіть назву категорії");
            return;
        }

        localCategories.push({ category_name: name });

        alert("Категорію додано");

        input.value = "";

        renderCategories();
    });
}
window.openAddCategory = function () {
    const form = document.getElementById("addCategoryForm");
    if (form) {
        form.style.display = "block";
    }
};
// ===== BRANDS =====
let localBrands = [
    { brand_name: "Nestle" },
    { brand_name: "Hipp" },
    { brand_name: "Gerber" }
];

function renderBrands() {
    const container = document.getElementById("brandsList");
    if (!container) return;

    container.innerHTML = localBrands.map((b, index) => `
        <div class="admin-category-card">
            <span>${b.brand_name}</span>

            <button onclick="fakeDeleteBrand(${index})">
                🗑
            </button>
        </div>
    `).join('');
}

function initBrandsPage() {
    const container = document.getElementById("brandsList");
    if (!container) return;

    renderBrands();

    const btn = document.getElementById("saveBrandBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {
        const input = document.getElementById("newBrandName");
        const name = input.value.trim();

        if (!name) {
            alert("Введіть назву бренду");
            return;
        }

        localBrands.push({ brand_name: name });

        alert("Бренд додано");

        input.value = "";

        renderBrands();
    });
}

// open add brand form
window.openAddBrand = function () {
    document.getElementById("addBrandForm").style.display = "block";
};
// ===== USERS (локально) =====
let localUsers = [
    {
        name: "Іван Петренко",
        email: "ivan@gmail.com",
        role: "admin"
    },
    {
        name: "Марія Іваненко",
        email: "maria@gmail.com",
        role: "manager"
    }
];

function renderUsers() {
    const container = document.getElementById("usersList");
    if (!container) return;

    container.innerHTML = localUsers.map((u, index) => `
        <div class="admin-category-card">
            <div>
                <strong>${u.name}</strong><br>
                ${u.email} — ${u.role}
            </div>

            <button onclick="fakeDeleteUser(${index})">
                🗑
            </button>
        </div>
    `).join('');
}

function initUsersPage() {
    const container = document.getElementById("usersList");
    if (!container) return;

    renderUsers();

    const btn = document.getElementById("saveUserBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {
        const name = document.getElementById("userName").value.trim();
        const email = document.getElementById("userEmail").value.trim();
        const password = document.getElementById("userPassword").value.trim();
        const role = document.getElementById("userRole").value;

        if (!name || !email || !password || !role) {
            alert("Заповніть всі поля");
            return;
        }

        localUsers.push({ name, email, role });

        alert("Користувача додано");

        document.getElementById("userName").value = "";
        document.getElementById("userEmail").value = "";
        document.getElementById("userPassword").value = "";
        document.getElementById("userRole").value = "";

        renderUsers();
    });
}