// Authentication JavaScript

const API_BASE_URL = 'http://localhost:3000/api/auth';

// Helper function to show messages in alerts
function showMessage(message, type = 'error') {
    if (type === 'success') {
        alert(message);
    } else {
        alert(message);
    }
}

// Helper function to handle API calls
async function apiCall(endpoint, method, data) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        // Add token if available
        const token = localStorage.getItem('token');
        if (token) {
            options.headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Request failed');
        }

        return result;
    } catch (error) {
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        // Verify token is still valid
        apiCall('/verify', 'GET')
            .then(data => {
                if (data.success) {
                    // User is logged in, redirect if on login/signup pages
                    if (window.location.pathname.includes('login.html') || 
                        window.location.pathname.includes('signup.html')) {
                        window.location.href = 'main.html';
                    }
                }
            })
            .catch(() => {
                // Token is invalid, remove it
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            });
    }

    // Login Form Handler
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!username || !password) {
                showMessage('Please fill in all fields');
                return;
            }

            // Disable submit button during request
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Logging in...';

            try {
                const data = await apiCall('/login', 'POST', { username, password });
                
                if (data.success) {
                    // Store token and user info
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    
                    showMessage('Login successful!', 'success');
                    // Redirect to home page
                    window.location.href = 'profile.html';
                } else {
                    showMessage(data.message || 'Login failed');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Login';
                }
            } catch (error) {
                showMessage(error.message || 'An error occurred. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = 'Login';
            }
        });
    }
    
    // Signup Form Handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const confirmPassword = document.getElementById('confirmPassword').value.trim();
            
            if (!fullName || !email || !username || !password || !confirmPassword) {
                showMessage('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match');
                return;
            }
            
            if (password.length < 6) {
                showMessage('Password must be at least 6 characters long');
                return;
            }

            // Disable submit button during request
            const submitButton = signupForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            submitButton.textContent = 'Creating account...';

            try {
                const data = await apiCall('/signup', 'POST', {
                    fullName,
                    email,
                    username,
                    password,
                });
                
                if (data.success) {
                    showMessage('Account created successfully! Please login.', 'success');
                    // Redirect to login page
                    window.location.href = 'login.html';
                } else {
                    showMessage(data.message || 'Signup failed');
                    submitButton.disabled = false;
                    submitButton.textContent = 'Sign Up';
                }
            } catch (error) {
                showMessage(error.message || 'An error occurred. Please try again.');
                submitButton.disabled = false;
                submitButton.textContent = 'Sign Up';
            }
        });
    }
});

// Logout function (can be used in other pages)
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}