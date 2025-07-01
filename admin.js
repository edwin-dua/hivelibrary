// DOM Elements
        const loginForm = document.getElementById('admin-login-form');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('admin-password');
        const errorMessage = document.getElementById('error-message');

        // Toggle password visibility
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
        });

        // Admin credentials
        const adminCredentials = {
            email: 'admin@library.com',
            password: 'admin123' 
        };

        // Login functionality
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('admin-email').value.trim();
            const password = document.getElementById('admin-password').value;
            
            // Simple validation
            if (email === adminCredentials.email && password === adminCredentials.password) {
                // Successful login
                sessionStorage.setItem('adminAuthenticated', 'true');
                window.location.href = 'admin-dashboard.html';
            } else {
                // Show error
                errorMessage.style.display = 'block';
            }
        });

        // Check if already logged in (for when returning to this page)
        if (sessionStorage.getItem('adminAuthenticated') === 'true') {
            window.location.href = 'admin-dashboard.html';
        }

        function logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html'; 
    }