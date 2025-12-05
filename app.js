var API_URL = 'http://localhost:3000';

// hàm lấy giỏ hàng từ localStorage
function getCart() {
    let cart = localStorage.getItem('cart');
    if (cart) {
        return JSON.parse(cart);
    }
    return [];
}

// lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// thêm sản phẩm vào giỏ hàng
function addToCart(product) {
    let cart = getCart();
    let found = false;
    
    // kiểm tra xem sản phẩm đã có trong giỏ chưa
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === product.id) {
            cart[i].quantity += 1;
            found = true;
            break;
        }
    }
    
    // nếu chưa có thì thêm mới
    if (!found) {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1
        });
    }
    
    saveCart(cart);
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}

// cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    let cart = getCart();
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].quantity;
    }
    
    let badges = document.querySelectorAll('#cart-count');
    for (let i = 0; i < badges.length; i++) {
        badges[i].textContent = total;
    }
}

// format giá tiền
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// hiển thị thông báo
function showNotification(message) {
    let noti = document.createElement('div');
    noti.style.position = 'fixed';
    noti.style.top = '100px';
    noti.style.right = '20px';
    noti.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    noti.style.color = 'white';
    noti.style.padding = '20px 30px';
    noti.style.borderRadius = '12px';
    noti.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.2)';
    noti.style.zIndex = '1000';
    noti.style.fontWeight = '600';
    noti.textContent = message;
    document.body.appendChild(noti);

    setTimeout(function() {
        noti.style.opacity = '0';
        noti.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            noti.remove();
        }, 300);
    }, 2000);
}

// thêm vào giỏ hàng bằng id
async function addToCartById(productId) {
    try {
        let response = await fetch(API_URL + '/products/' + productId);
        let product = await response.json();
        addToCart(product);
    } catch (error) {
        console.log('Lỗi:', error);
        alert('Không thể thêm sản phẩm vào giỏ hàng');
    }
}

// khi trang load xong
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
});

