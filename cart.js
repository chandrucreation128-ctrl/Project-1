// Shopping Cart System
let cart = [];

// Initialize cart
function initCart() {
    loadCart();
}

// Load cart from localStorage
function loadCart() {
    const user = getCurrentUser();
    if (!user) return;
    
    const cartKey = `cart_${user.id}`;
    cart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    displayCart();
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    const user = getCurrentUser();
    if (!user) return;
    
    const cartKey = `cart_${user.id}`;
    localStorage.setItem(cartKey, JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

// Add product to cart
function addToCart(productId) {
    if (!isAuthenticated()) {
        showToast('Please login to add items to cart', 'error');
        return;
    }

    const product = getProductById(productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: generateId(),
            productId: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    showToast('Product added to cart');
}

// Remove item from cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    showToast('Item removed from cart');
}

// Update item quantity
function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(itemId);
        return;
    }

    item.quantity = newQuantity;
    saveCart();
}

// Display cart
function displayCart() {
    const cartContainer = document.getElementById('cart-items');
    const cartSummary = document.getElementById('cart-summary');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        cartSummary.style.display = 'none';
        return;
    }

    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${parseFloat(item.price).toFixed(2)} per unit</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                <span class="quantity-value">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
            </div>
            <div class="cart-item-total">₹${(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
            <button class="btn-danger cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
        </div>
    `).join('');

    // Calculate totals
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    document.getElementById('cart-total').textContent = `₹${total.toFixed(2)}`;

    cartSummary.style.display = 'block';
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cart-count');
    if (count > 0) {
        countEl.textContent = count;
        countEl.style.display = 'inline';
    } else {
        countEl.style.display = 'none';
    }
}

// Process payment
function processPayment() {
    if (cart.length === 0) {
        showToast('Cart is empty', 'error');
        return;
    }

    if (!confirm('Confirm payment and generate invoice?')) return;

    const user = getCurrentUser();
    if (!user) return;

    // Calculate totals
    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);

    // Create transaction
    const transaction = {
        id: generateId(),
        invoiceNumber: 'INV-' + Date.now(),
        date: new Date().toISOString(),
        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: parseFloat(item.price) * item.quantity
        })),
        total: total,
        userId: user.id
    };

    // Save transaction
    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Clear cart
    cart = [];
    saveCart();

    showToast('Payment processed successfully! Invoice generated.');
    
    // Show invoice
    setTimeout(() => {
        showSection('invoices');
        loadInvoices();
        viewInvoice(transaction.id);
    }, 1000);
}

// Get cart items
function getCartItems() {
    return cart;
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
}

// Initialize on load
if (typeof loadCart === 'undefined') {
    document.addEventListener('DOMContentLoaded', initCart);
}

