// load chi tiết sản phẩm
async function loadProductDetail() {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get('id');

    if (!productId) {
        let container = document.getElementById('product-detail-container');
        if (container) {
            container.innerHTML = '<div class="loading">Không tìm thấy sản phẩm</div>';
        }
        return;
    }

    try {
        let response = await fetch(API_URL + '/products/' + productId);
        if (!response.ok) {
            throw new Error('Không tìm thấy sản phẩm');
        }
        let product = await response.json();
        
        // lấy tên danh mục
        let catResponse = await fetch(API_URL + '/categories/' + product.categoryId);
        let category = null;
        if (catResponse.ok) {
            category = await catResponse.json();
        }
        
        renderProductDetail(product, category);
    } catch (error) {
        console.log('Lỗi:', error);
        let container = document.getElementById('product-detail-container');
        if (container) {
            container.innerHTML = '<div class="loading">Không thể tải thông tin sản phẩm</div>';
        }
    }
}

// hiển thị chi tiết sản phẩm
function renderProductDetail(product, category) {
    let container = document.getElementById('product-detail-container');
    if (!container) return;
    
    let categoryHtml = '';
    if (category) {
        categoryHtml = '<span class="product-detail-category">' + category.name + '</span>';
    }
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-content">
                <div>
                    <img src="${product.image}" alt="${product.name}" class="product-detail-image" 
                         onerror="this.src='https://via.placeholder.com/500x500?text=No+Image'">
                </div>
                <div class="product-detail-info">
                    ${categoryHtml}
                    <h1>${product.name}</h1>
                    <div class="product-detail-price">${formatPrice(product.price)}</div>
                    <p class="product-detail-description">${product.description}</p>
                    <button class="btn btn-primary" onclick="addToCartById(${product.id})">
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </div>
        </div>
    `;
}

// khi trang load xong
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetail();
});

