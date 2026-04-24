/**
 * Products Page Logic
 */

let currentProducts = [];

// Load products on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

async function loadProducts() {
    const loading = document.getElementById('loading');
    const productsGrid = document.getElementById('products-grid');

    try {
        loading.style.display = 'block';
        productsGrid.innerHTML = '';

        const params = {
            search: document.getElementById('search')?.value || '',
            category: document.getElementById('category-filter')?.value || '',
            sortBy: document.getElementById('sort-select')?.value || 'name_asc'
        };

        const data = await api.getProducts(params);
        currentProducts = data.products;

        if (currentProducts.length === 0) {
            productsGrid.innerHTML = '<p class="no-products">No products found</p>';
        } else {
            displayProducts(currentProducts);
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<p class="error-message">Error loading products. Please try again.</p>';
    } finally {
        loading.style.display = 'none';
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">📦</div>
            <div class="product-info">
                <h3 class="product-name">${escapeHtml(product.name)}</h3>
                <p class="product-description">${escapeHtml(product.description)}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="btn btn-primary btn-block" onclick="addToCart(${product.id})">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

async function addToCart(productId) {
    if (!api.isAuthenticated()) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    try {
        await api.addToCart(productId, 1);
        alert('Product added to cart!');
        updateCartCount();
    } catch (error) {
        alert('Error adding product to cart: ' + error.message);
    }
}

async function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (!cartCount) return;

    if (!api.isAuthenticated()) {
        cartCount.textContent = '0';
        return;
    }

    try {
        const data = await api.getCart();
        const count = data.cart?.summary?.itemCount || 0;
        cartCount.textContent = count;
    } catch (error) {
        console.error('Error updating cart count:', error);
        cartCount.textContent = '0';
    }
}

function searchProducts() {
    loadProducts();
}

function filterProducts() {
    loadProducts();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Update cart count on load
document.addEventListener('DOMContentLoaded', updateCartCount);
