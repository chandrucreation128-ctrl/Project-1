// Authentication System
let currentUser = null;

// Initialize authentication
function initAuth() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showApp();
    } else {
        showAuth();
    }
}

// Show authentication section
function showAuth() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('app-section').style.display = 'none';
}

// Show application section
function showApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    // Initialize other modules
    if (typeof loadProducts === 'function') loadProducts();
    if (typeof loadCart === 'function') loadCart();
    if (typeof loadInvoices === 'function') loadInvoices();
}

// Show login form
function showLogin() {
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('register-form').style.display = 'none';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    clearAuthMessage();
}

// Show register form
function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    clearAuthMessage();
}

// Clear auth message
function clearAuthMessage() {
    const messageEl = document.getElementById('auth-message');
    messageEl.textContent = '';
    messageEl.className = 'message';
}

// Show auth message
function showAuthMessage(message, type) {
    const messageEl = document.getElementById('auth-message');
    messageEl.textContent = message;
    messageEl.className = `message ${type}`;
    setTimeout(() => {
        clearAuthMessage();
    }, 3000);
}

// Handle login
function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        currentUser = {
            id: user.id,
            username: user.username,
            email: user.email
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showAuthMessage('Login successful!', 'success');
        setTimeout(() => {
            showApp();
        }, 500);
    } else {
        showAuthMessage('Invalid username or password', 'error');
    }
}

// Handle registration
function handleRegister() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value.trim();

    if (!username || !password || !email) {
        showAuthMessage('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 4) {
        showAuthMessage('Password must be at least 4 characters', 'error');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if username already exists
    if (users.find(u => u.username === username)) {
        showAuthMessage('Username already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: generateId(),
        username: username,
        password: password,
        email: email,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showAuthMessage('Registration successful! Please login.', 'success');
    setTimeout(() => {
        showLogin();
        document.querySelectorAll('.tab-btn')[0].click();
    }, 1500);
}

// Handle logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuth();
        // Clear forms
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    }
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Check if user is authenticated
function isAuthenticated() {
    return currentUser !== null;
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAuth);

