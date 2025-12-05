let categories = [];
let products = [];

// load danh mục
async function loadCategories() {
    try {
        let response = await fetch(API_URL + '/categories');
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.log('Lỗi:', error);
        let grid = document.getElementById('categories-grid');
        if (grid) {
            grid.innerHTML = '<div class="loading">Không thể tải danh mục. Vui lòng kiểm tra API server.</div>';
        }
    }
}

// hiển thị danh mục
function renderCategories() {
    let grid = document.getElementById('categories-grid');
    if (!grid) return;

    let html = '';
    for (let i = 0; i < categories.length; i++) {
        let cat = categories[i];
        html += `
            <div class="category-card" onclick="showProductsByCategory(${cat.id}, '${cat.name}')">
                <h3>${cat.name}</h3>
                <p>Xem tất cả sản phẩm</p>
            </div>
        `;
    }
    grid.innerHTML = html;
}

// hiển thị sản phẩm theo danh mục
async function showProductsByCategory(categoryId, categoryName) {
    try {
        let response = await fetch(API_URL + '/products?categoryId=' + categoryId);
        products = await response.json();
        
        // ẩn danh mục, hiện sản phẩm
        document.getElementById('categories-grid').parentElement.style.display = 'none';
        document.getElementById('products-by-category').style.display = 'block';
        document.getElementById('category-products-title').textContent = 'Sản phẩm: ' + categoryName;
        
        renderProductsByCategory(products);
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể tải sản phẩm');
    }
}

// hiển thị sản phẩm
function renderProductsByCategory(products) {
    let grid = document.getElementById('category-products-grid');
    if (!grid) return;

    if (products.length === 0) {
        grid.innerHTML = '<div class="loading">Không có sản phẩm nào trong danh mục này</div>';
        return;
    }

    let html = '';
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        html += `
            <div class="product-card" onclick="window.location.href='product-detail.html?id=${p.id}'">
                <img src="${p.image}" alt="${p.name}" class="product-image" 
                     onerror="this.src='https://via.placeholder.com/280x250?text=No+Image'">
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <div class="product-price">${formatPrice(p.price)}</div>
                    <p class="product-description">${p.description}</p>
                    <button class="btn btn-primary" onclick="event.stopPropagation(); addToCartById(${p.id})">
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        `;
    }
    grid.innerHTML = html;
}

// quay lại hiển thị tất cả danh mục
function showAllCategories() {
    document.getElementById('categories-grid').parentElement.style.display = 'block';
    document.getElementById('products-by-category').style.display = 'none';
}

// khi trang load xong
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
});

