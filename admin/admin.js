var API_URL = 'http://localhost:3000';

let categories = [];
let products = [];
let currentCategoryId = null;
let currentProductId = null;

// khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', function() {
    setupNavigation();
    setupModals();
    loadCategories();
    loadProducts();
});

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.admin-section');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            
            navButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`${page}-section`).classList.add('active');
        });
    });
}

// Modals
function setupModals() {
    // Category Modal
    const categoryModal = document.getElementById('category-modal');
    const addCategoryBtn = document.getElementById('add-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    const categoryForm = document.getElementById('category-form');
    const categoryClose = categoryModal.querySelector('.modal-close');

    addCategoryBtn.addEventListener('click', () => {
        currentCategoryId = null;
        document.getElementById('category-modal-title').textContent = 'Thêm danh mục';
        categoryForm.reset();
        categoryModal.classList.add('active');
    });

    cancelCategoryBtn.addEventListener('click', () => {
        categoryModal.classList.remove('active');
    });

    categoryClose.addEventListener('click', () => {
        categoryModal.classList.remove('active');
    });

    categoryForm.addEventListener('submit', handleCategorySubmit);

    // Product Modal
    const productModal = document.getElementById('product-modal');
    const addProductBtn = document.getElementById('add-product-btn');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    const productForm = document.getElementById('product-form');
    const productClose = productModal.querySelector('.modal-close');

    addProductBtn.addEventListener('click', () => {
        currentProductId = null;
        document.getElementById('product-modal-title').textContent = 'Thêm sản phẩm';
        productForm.reset();
        loadCategoriesForSelect();
        productModal.classList.add('active');
    });

    cancelProductBtn.addEventListener('click', () => {
        productModal.classList.remove('active');
    });

    productClose.addEventListener('click', () => {
        productModal.classList.remove('active');
    });

    productForm.addEventListener('submit', handleProductSubmit);

    // Close modal on outside click
    [categoryModal, productModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// load danh mục
async function loadCategories() {
    try {
        let response = await fetch(API_URL + '/categories');
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể tải danh mục. Vui lòng kiểm tra API server.');
    }
}

// hiển thị danh mục
function renderCategories() {
    let tbody = document.getElementById('categories-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.name}</td>
            <td>
                <button class="btn btn-edit" onclick="editCategory(${cat.id})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteCategory(${cat.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// xử lý submit form danh mục
async function handleCategorySubmit(e) {
    e.preventDefault();
    let name = document.getElementById('category-name').value.trim();

    if (!name) {
        alert('Vui lòng nhập tên danh mục');
        return;
    }

    try {
        if (currentCategoryId) {
            // sửa
            await fetch(API_URL + '/categories/' + currentCategoryId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: currentCategoryId, name: name })
            });
        } else {
            // thêm mới
            await fetch(API_URL + '/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name })
            });
        }

        document.getElementById('category-modal').classList.remove('active');
        loadCategories();
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể lưu danh mục');
    }
}

// sửa danh mục
function editCategory(id) {
    // tìm danh mục
    let category = null;
    for (let i = 0; i < categories.length; i++) {
        if (categories[i].id === id) {
            category = categories[i];
            break;
        }
    }
    if (!category) return;

    currentCategoryId = id;
    document.getElementById('category-modal-title').textContent = 'Sửa danh mục';
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-modal').classList.add('active');
}

// xóa danh mục
async function deleteCategory(id) {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
        await fetch(API_URL + '/categories/' + id, {
            method: 'DELETE'
        });
        loadCategories();
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể xóa danh mục');
    }
}

// load sản phẩm
async function loadProducts() {
    try {
        let response = await fetch(API_URL + '/products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể tải sản phẩm. Vui lòng kiểm tra API server.');
    }
}

// hiển thị sản phẩm
function renderProducts() {
    let tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        // tìm danh mục
        let catName = 'N/A';
        for (let j = 0; j < categories.length; j++) {
            if (categories[j].id === p.categoryId) {
                catName = categories[j].name;
                break;
            }
        }
        
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${p.id}</td>
            <td><img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60'"></td>
            <td>${p.name}</td>
            <td>${catName}</td>
            <td class="price">${formatPrice(p.price)}</td>
            <td>
                <button class="btn btn-edit" onclick="editProduct(${p.id})">Sửa</button>
                <button class="btn btn-danger" onclick="deleteProduct(${p.id})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    }
}

// load danh mục vào dropdown
async function loadCategoriesForSelect() {
    try {
        let response = await fetch(API_URL + '/categories');
        let cats = await response.json();
        let select = document.getElementById('product-category');
        if (!select) return;
        
        select.innerHTML = '<option value="">Chọn danh mục</option>';
        
        for (let i = 0; i < cats.length; i++) {
            let option = document.createElement('option');
            option.value = cats[i].id;
            option.textContent = cats[i].name;
            select.appendChild(option);
        }

        // nếu đang sửa thì chọn danh mục hiện tại
        if (currentProductId) {
            for (let i = 0; i < products.length; i++) {
                if (products[i].id === currentProductId) {
                    select.value = products[i].categoryId;
                    break;
                }
            }
        }
    } catch (error) {
        console.log('Lỗi:', error);
    }
}

// xử lý submit form sản phẩm
async function handleProductSubmit(e) {
    e.preventDefault();
    let name = document.getElementById('product-name').value.trim();
    let categoryId = parseInt(document.getElementById('product-category').value);
    let image = document.getElementById('product-image').value.trim();
    let price = parseInt(document.getElementById('product-price').value);
    let description = document.getElementById('product-description').value.trim();

    if (!name || !categoryId || !image || !price || !description) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }

    try {
        let productData = {
            name: name,
            categoryId: categoryId,
            image: image,
            price: price,
            description: description
        };

        if (currentProductId) {
            // sửa
            productData.id = currentProductId;
            await fetch(API_URL + '/products/' + currentProductId, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // thêm mới
            await fetch(API_URL + '/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        document.getElementById('product-modal').classList.remove('active');
        loadProducts();
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể lưu sản phẩm');
    }
}

// sửa sản phẩm
function editProduct(id) {
    // tìm sản phẩm
    let product = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            product = products[i];
            break;
        }
    }
    if (!product) return;

    currentProductId = id;
    document.getElementById('product-modal-title').textContent = 'Sửa sản phẩm';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    
    loadCategoriesForSelect().then(function() {
        document.getElementById('product-category').value = product.categoryId;
    });
    
    document.getElementById('product-modal').classList.add('active');
}

// xóa sản phẩm
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    try {
        await fetch(API_URL + '/products/' + id, {
            method: 'DELETE'
        });
        loadProducts();
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể xóa sản phẩm');
    }
}

// format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

