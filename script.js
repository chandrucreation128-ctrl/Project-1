// Main Application Logic

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Load section data
    switch(sectionName) {
        case 'products':
            if (typeof loadProducts === 'function') loadProducts();
            break;
        case 'cart':
            if (typeof loadCart === 'function') loadCart();
            break;
        case 'invoices':
            if (typeof loadInvoices === 'function') loadInvoices();
            break;
        case 'reports':
            if (typeof generateReport === 'function') generateReport();
            break;
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Set default month for reports
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthInput = document.getElementById('report-month');
    if (monthInput) {
        monthInput.value = month;
    }
    
    // Close modals when clicking outside
    window.onclick = function(event) {
        const productModal = document.getElementById('product-modal');
        const invoiceModal = document.getElementById('invoice-modal');
        
        if (event.target === productModal) {
            closeProductModal();
        }
        if (event.target === invoiceModal) {
            closeInvoiceModal();
        }
    };
    
    // Allow Enter key to submit login/register
    document.getElementById('login-password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleLogin();
    });
    
    document.getElementById('register-password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleRegister();
    });
});

// Make functions globally available
window.showSection = showSection;
window.showToast = showToast;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.saveProduct = saveProduct;
window.filterProducts = filterProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.processPayment = processPayment;
window.viewInvoice = viewInvoice;
window.closeInvoiceModal = closeInvoiceModal;
window.printInvoice = printInvoice;
window.downloadInvoicePDF = downloadInvoicePDF;
window.generateReport = generateReport;
window.exportReportPDF = exportReportPDF;
window.exportReportText = exportReportText;
window.showLogin = showLogin;
window.showRegister = showRegister;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleLogout = handleLogout;

