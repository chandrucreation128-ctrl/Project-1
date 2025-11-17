// Product Management System
let products = [];
let filteredProducts = [];

// Initialize products
function initProducts() {
    loadProducts();
}

// Load products from localStorage
function loadProducts() {
    products = JSON.parse(localStorage.getItem('products') || '[]');
    filteredProducts = [...products];
    displayProducts();
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
}

// Display products in grid
function displayProducts() {
    const grid = document.getElementById('products-grid');
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<div class="empty-cart">No products found. Add your first product!</div>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="addToCart('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/300x200?text=No+Image'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₹${parseFloat(product.price).toFixed(2)}</div>
                <div class="product-actions" onclick="event.stopPropagation()">
                    <button class="btn-secondary" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="btn-danger" onclick="deleteProduct('${product.id}')">Delete</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('search-products').value.toLowerCase();

    filteredProducts = products.filter(product => {
        const matchesCategory = !categoryFilter || product.category === categoryFilter;
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    displayProducts();
}

// Open product modal for adding
function openProductModal() {
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-modal').classList.add('show');
}

// Close product modal
function closeProductModal() {
    document.getElementById('product-modal').classList.remove('show');
}

// Edit product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-modal').classList.add('show');
}

// Delete product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    products = products.filter(p => p.id !== id);
    saveProducts();
    showToast('Product deleted successfully');
}

// Save product (create or update)
function saveProduct(event) {
    event.preventDefault();

    const id = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();
    const category = document.getElementById('product-category').value;
    const description = document.getElementById('product-description').value.trim();

    if (!name || !price || !image || !category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                price,
                image,
                category,
                description
            };
            showToast('Product updated successfully');
        }
    } else {
        // Create new product
        const newProduct = {
            id: generateId(),
            name,
            price,
            image,
            category,
            description,
            createdAt: new Date().toISOString()
        };
        products.push(newProduct);
        showToast('Product added successfully');
    }

    saveProducts();
    closeProductModal();
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Initialize on load
if (typeof loadProducts === 'undefined') {
    document.addEventListener('DOMContentLoaded', initProducts);
}

