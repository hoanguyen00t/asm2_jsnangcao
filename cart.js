// load giỏ hàng
function loadCart() {
    let cart = getCart();
    let container = document.getElementById('cart-container');
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <div class="empty-cart-message">Giỏ hàng của bạn đang trống</div>
                <a href="index.html" class="btn btn-primary">Tiếp tục mua sắm</a>
            </div>
        `;
        return;
    }

    // tính tổng tiền
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
        total += cart[i].price * cart[i].quantity;
    }

    // hiển thị các sản phẩm
    let itemsHtml = '';
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        itemsHtml += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" 
                     onerror="this.src='https://via.placeholder.com/120x120?text=No+Image'">
                <div class="cart-item-info">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <div class="cart-item-price">${formatPrice(item.price)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Xóa</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="cart-container">
            ${itemsHtml}
            <div class="cart-total">
                <span class="cart-total-label">Tổng cộng:</span>
                <span class="cart-total-price">${formatPrice(total)}</span>
            </div>
        </div>
    `;
}

// cập nhật số lượng
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    let cart = getCart();
    // tìm sản phẩm trong giỏ
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = newQuantity;
            saveCart(cart);
            loadCart();
            break;
        }
    }
}

// xóa sản phẩm khỏi giỏ hàng
function removeFromCart(productId) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        return;
    }

    let cart = getCart();
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            newCart.push(cart[i]);
        }
    }
    saveCart(newCart);
    loadCart();
}

// khi trang load xong
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

