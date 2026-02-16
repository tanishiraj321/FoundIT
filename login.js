// Login Page JavaScript

$(document).ready(function() {
    // Toggle password visibility
    $('#toggleStudentPassword').on('click', function() {
        togglePasswordVisibility('#studentPassword', $(this));
    });
    
    $('#toggleAdminPassword').on('click', function() {
        togglePasswordVisibility('#adminPassword', $(this));
    });
    
    // Student login form submission
    $('#studentLoginForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#studentEmail').val();
        const password = $('#studentPassword').val();
        
        // Validate inputs
        if (!email || !password) {
            showAlert('Please fill in all fields', 'warning');
            return;
        }
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Signing in...').prop('disabled', true);
        
        // Simulate login (in real app, this would be an API call)
        setTimeout(() => {
            // Check credentials (demo purposes)
            const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const user = storedUsers.find(u => 
                (u.email === email || u.registrationNo === email) && u.password === password
            );
            
            if (user || (email === 'demo@vit.edu' && password === 'demo123')) {
                // Store session
                localStorage.setItem('currentUser', JSON.stringify({
                    email: email,
                    name: user ? user.fullName : 'Demo User',
                    type: 'student',
                    loginTime: new Date().toISOString()
                }));
                
                // Show success and redirect
                showAlert('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'browse.html';
                }, 1500);
            } else {
                showAlert('Invalid credentials. Please try again.', 'danger');
                submitBtn.html(originalText).prop('disabled', false);
            }
        }, 1500);
    });
    
    // Admin login form submission
    $('#adminLoginForm').on('submit', function(e) {
        e.preventDefault();
        
        const username = $('#adminUsername').val();
        const password = $('#adminPassword').val();
        
        // Validate inputs
        if (!username || !password) {
            showAlert('Please fill in all fields', 'warning');
            return;
        }
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Authenticating...').prop('disabled', true);
        
        // Simulate admin login
        setTimeout(() => {
            // Check admin credentials (demo purposes)
            if (username === 'admin' && password === 'admin@vit') {
                // Store admin session
                localStorage.setItem('currentUser', JSON.stringify({
                    username: username,
                    name: 'Admin User',
                    type: 'admin',
                    loginTime: new Date().toISOString()
                }));
                
                // Show success and redirect
                showAlert('Admin login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'admin-dashboard.html'; // Would need to create this page
                }, 1500);
            } else {
                showAlert('Invalid admin credentials. Access denied.', 'danger');
                submitBtn.html(originalText).prop('disabled', false);
            }
        }, 1500);
    });
    
    // Forgot password form
    $('#forgotPasswordForm').on('submit', function(e) {
        e.preventDefault();
        
        const email = $('#resetEmail').val();
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        // Show loading
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...').prop('disabled', true);
        
        // Simulate email sending
        setTimeout(() => {
            alert('Password reset link has been sent to your email!');
            $('#forgotPasswordModal').modal('hide');
            this.reset();
            submitBtn.html(originalText).prop('disabled', false);
        }, 1500);
    });
    
    // Registration form
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        $('.is-invalid').removeClass('is-invalid');
        $('.invalid-feedback').remove();
        
        // Validate full name
        const fullName = $('#regFullName').val();
        const namePattern = /^[a-zA-Z\s]{3,50}$/;
        if (!namePattern.test(fullName)) {
            $('#regFullName').addClass('is-invalid');
            showFieldError($('#regFullName'), 'Name must be 3-50 characters, letters only');
            return;
        }
        
        // Validate registration number
        const regNo = $('#regNumber').val();
        const regNoPattern = /^\d{2}[A-Z]{3}\d{4}$/;
        if (!regNoPattern.test(regNo)) {
            $('#regNumber').addClass('is-invalid');
            showFieldError($('#regNumber'), 'Format must be: 24BIT0531');
            return;
        }
        
        // Validate email
        const email = $('#regEmail').val();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            $('#regEmail').addClass('is-invalid');
            showFieldError($('#regEmail'), 'Invalid email address');
            return;
        }
        
        // Validate phone
        const phone = $('#regPhone').val();
        const phonePattern = /^[+]?[0-9\s\-()]{10,15}$/;
        if (!phonePattern.test(phone)) {
            $('#regPhone').addClass('is-invalid');
            showFieldError($('#regPhone'), 'Phone must be 10-15 digits');
            return;
        }
        
        // Validate passwords match
        const password = $('#regPassword').val();
        const confirmPassword = $('#regConfirmPassword').val();
        
        if (password !== confirmPassword) {
            showAlert('Passwords do not match!', 'danger');
            $('#regPassword').addClass('is-invalid');
            $('#regConfirmPassword').addClass('is-invalid');
            return;
        }
        
        // Validate password strength
        if (password.length < 8) {
            showAlert('Password must be at least 8 characters long', 'warning');
            return;
        }
        
        // Validate password complexity
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^a-zA-Z0-9]/.test(password);
        
        if (!hasUpper || !hasLower) {
            showAlert('Password must contain both uppercase and lowercase letters', 'warning');
            return;
        }
        
        if (!hasNumber) {
            showAlert('Password must contain at least one number', 'warning');
            return;
        }
        
        if (!hasSpecial) {
            showAlert('Password must contain at least one special character (!@#$%^&*)', 'warning');
            return;
        }
        
        // Show loading
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Creating Account...').prop('disabled', true);
        
        // Simulate registration
        setTimeout(() => {
            // Collect user data
            const userData = {
                fullName: fullName,
                registrationNo: regNo,
                email: email,
                phone: phone,
                password: password,
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Check if user already exists
            const existingUser = users.find(u => 
                u.email === userData.email || u.registrationNo === userData.registrationNo
            );
            
            if (existingUser) {
                showAlert('User with this email or registration number already exists!', 'warning');
                submitBtn.html(originalText).prop('disabled', false);
                return;
            }
            
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Show success message
            showAlert('Account created successfully! Please login.', 'success');
            
            // Close modal and reset form
            setTimeout(() => {
                $('#registerModal').modal('hide');
                this.reset();
                submitBtn.html(originalText).prop('disabled', false);
                
                // Fill login form with new credentials
                $('#studentEmail').val(userData.email);
            }, 1500);
        }, 1500);
    });
    
    // Check if user is already logged in
    checkLoginStatus();
});

function togglePasswordVisibility(inputId, button) {
    const input = $(inputId);
    const icon = button.find('i');
    
    if (input.attr('type') === 'password') {
        input.attr('type', 'text');
        icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
        input.attr('type', 'password');
        icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
}

function showAlert(message, type = 'info') {
    // Remove existing alerts
    $('.custom-alert').remove();
    
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show custom-alert" role="alert" 
             style="position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    $('body').append(alertHtml);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        $('.custom-alert').alert('close');
    }, 5000);
}

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        // Show logged in message
        const message = `You are already logged in as ${user.name}. `;
        const alertHtml = `
            <div class="alert alert-info alert-dismissible fade show" role="alert" 
                 style="position: fixed; top: 80px; left: 50%; transform: translateX(-50%); z-index: 9999; max-width: 500px;">
                ${message}
                <button type="button" class="btn btn-sm btn-primary ms-2" onclick="logout()">Logout</button>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('body').append(alertHtml);
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    showAlert('Logged out successfully!', 'success');
    setTimeout(() => {
        location.reload();
    }, 1000);
}

// Password strength indicator
$('#regPassword').on('input', function() {
    const password = $(this).val();
    let strength = 0;
    let feedback = [];
    
    if (password.length >= 8) {
        strength++;
    } else {
        feedback.push('At least 8 characters');
    }
    
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength++;
    } else {
        feedback.push('Mix of uppercase and lowercase');
    }
    
    if (password.match(/[0-9]/)) {
        strength++;
    } else {
        feedback.push('At least 1 number');
    }
    
    if (password.match(/[^a-zA-Z0-9]/)) {
        strength++;
    } else {
        feedback.push('At least 1 special character');
    }
    
    let strengthText = '';
    let strengthColor = '';
    
    switch (strength) {
        case 0:
        case 1:
            strengthText = 'Weak';
            strengthColor = 'danger';
            break;
        case 2:
            strengthText = 'Fair';
            strengthColor = 'warning';
            break;
        case 3:
            strengthText = 'Good';
            strengthColor = 'info';
            break;
        case 4:
            strengthText = 'Strong';
            strengthColor = 'success';
            break;
    }
    
    if (!$('.password-strength').length && password.length > 0) {
        $(this).after(`<small class="password-strength d-block mt-1"></small>`);
    }
    
    if (password.length > 0) {
        const strengthHtml = `Password Strength: <span class="text-${strengthColor} fw-bold">${strengthText}</span>`;
        const feedbackHtml = feedback.length > 0 ? `<div class="small text-muted mt-1">Needed: ${feedback.join(', ')}</div>` : '';
        $('.password-strength').html(strengthHtml + feedbackHtml);
    } else {
        $('.password-strength').remove();
    }
});

// Real-time email validation
$('#regEmail, #studentEmail').on('blur', function() {
    const email = $(this).val();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    $(this).removeClass('is-invalid is-valid');
    
    if (email) {
        if (!emailPattern.test(email)) {
            $(this).addClass('is-invalid');
            showFieldError($(this), 'Invalid email format. Use: example@vit.edu');
        } else {
            $(this).addClass('is-valid');
            clearFieldError($(this));
        }
    }
});

// Real-time registration number validation
$('#regNumber, #registrationNo').on('blur', function() {
    const regNo = $(this).val();
    const pattern = /^\d{2}[A-Z]{3}\d{4}$/;
    
    $(this).removeClass('is-invalid is-valid');
    
    if (regNo) {
        if (!pattern.test(regNo)) {
            $(this).addClass('is-invalid');
            showFieldError($(this), 'Format must be: 24BIT0531');
        } else {
            $(this).addClass('is-valid');
            clearFieldError($(this));
        }
    }
});

// Real-time full name validation
$('#regFullName').on('blur', function() {
    const fullName = $(this).val();
    const namePattern = /^[a-zA-Z\s]{3,50}$/;
    
    $(this).removeClass('is-invalid is-valid');
    
    if (fullName) {
        if (!namePattern.test(fullName)) {
            $(this).addClass('is-invalid');
            showFieldError($(this), 'Name must be 3-50 characters, letters only');
        } else {
            $(this).addClass('is-valid');
            clearFieldError($(this));
        }
    }
});

// Real-time phone validation
$('#regPhone').on('blur', function() {
    const phone = $(this).val();
    const phonePattern = /^[+]?[0-9\s\-()]{10,15}$/;
    
    $(this).removeClass('is-invalid is-valid');
    
    if (phone) {
        if (!phonePattern.test(phone)) {
            $(this).addClass('is-invalid');
            showFieldError($(this), 'Phone must be 10-15 digits, use +91 format');
        } else {
            $(this).addClass('is-valid');
            clearFieldError($(this));
        }
    }
});

// Password strength validation and real-time feedback

function showFieldError(element, message) {
    const errorDiv = `<div class="invalid-feedback d-block">${message}</div>`;
    if (!element.next('.invalid-feedback').length) {
        element.after(errorDiv);
    }
}

function clearFieldError(element) {
    element.next('.invalid-feedback').remove();
}

// Make logout function globally available
window.logout = logout;
