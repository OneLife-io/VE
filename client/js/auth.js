/**
 * Authentication Page Logic
 */

let isLoginMode = true;

document.addEventListener('DOMContentLoaded', () => {
    // If already logged in, redirect to home
    if (api.isAuthenticated()) {
        window.location.href = 'index.html';
        return;
    }

    setupEventListeners();
});

function setupEventListeners() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const toggleLink = document.getElementById('toggle-link');

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    toggleLink.addEventListener('click', toggleAuthMode);
}

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const data = await api.login(email, password);

        // Store user info
        localStorage.setItem('user', JSON.stringify(data.user));

        showSuccess('Login successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        showError(error.message);
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const userData = {
        firstName: document.getElementById('register-firstname').value,
        lastName: document.getElementById('register-lastname').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value
    };

    // Basic validation
    if (userData.password.length < 8) {
        showError('Password must be at least 8 characters long');
        return;
    }

    try {
        const data = await api.register(userData);

        // Store user info
        localStorage.setItem('user', JSON.stringify(data.user));

        showSuccess('Registration successful! Redirecting...');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } catch (error) {
        showError(error.message);
    }
}

function toggleAuthMode(e) {
    e.preventDefault();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.getElementById('auth-title');
    const toggleText = document.getElementById('toggle-text');
    const toggleLink = document.getElementById('toggle-link');

    isLoginMode = !isLoginMode;

    if (isLoginMode) {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.textContent = 'Login';
        toggleText.innerHTML = "Don't have an account? ";
        toggleLink.textContent = 'Register';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = 'Register';
        toggleText.innerHTML = 'Already have an account? ';
        toggleLink.textContent = 'Login';
    }

    // Clear messages
    hideMessages();
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    const successDiv = document.getElementById('success-message');
    successDiv.style.display = 'none';
}

function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';

    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
}

function hideMessages() {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('success-message').style.display = 'none';
}
