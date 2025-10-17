/**
 * Cart Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
});

async function loadCart() {
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const data = await api.getCart();
        displayCart(data.cart);
    } catch (error) {
        console.error('Error loading cart:', error);
        showError('Error loading cart. Please try again.');
    }
}

function displayCart(cart) {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartSummary = document.getElementById('cart-summary');

    if (!cart || cart.items.length === 0) {
        cartItems.style.display = 'none';
        cartSummary.style.display = 'none';
        cartEmpty.style.display = 'block';
        updateCartCount();
        return;
    }

    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    cartSummary.style.display = 'block';

    // Display items
    cartItems.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">📦</div>
            <div class="cart-item-details">
                <h3>${escapeHtml(item.name)}</h3>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <div>
                <button class="btn btn-danger" onclick="removeItem(${item.productId})">Remove</button>
            </div>
        </div>
    `).join('');

    // Display summary
    document.getElementById('subtotal').textContent = '$' + cart.summary.subtotal;
    document.getElementById('tax').textContent = '$' + cart.summary.tax;
    document.getElementById('total').textContent = '$' + cart.summary.total;

    updateCartCount();
}

async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeItem(productId);
        return;
    }

    try {
        await api.updateCartItem(productId, newQuantity);
        loadCart();
    } catch (error) {
        alert('Error updating quantity: ' + error.message);
    }
}

async function removeItem(productId) {
    if (!confirm('Remove this item from cart?')) {
        return;
    }

    try {
        await api.removeFromCart(productId);
        loadCart();
    } catch (error) {
        alert('Error removing item: ' + error.message);
    }
}

async function checkout() {
    if (!confirm('Proceed to checkout?')) {
        return;
    }

    try {
        const orderData = {
            shippingAddress: '123 Main St, City, State 12345',
            paymentMethod: 'credit_card'
        };

        const response = await api.createOrder(orderData);
        alert('Order placed successfully! Order ID: ' + response.order.id);
        window.location.href = 'index.html';
    } catch (error) {
        alert('Error placing order: ' + error.message);
    }
}

async function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;

    try {
        const data = await api.getCart();
        const count = data.cart?.summary?.itemCount || 0;
        cartCount.textContent = count;
    } catch (error) {
        cartCount.textContent = '0';
    }
}

function showError(message) {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = `<p class="error-message">${escapeHtml(message)}</p>`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
