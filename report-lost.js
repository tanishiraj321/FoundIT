// Report Lost Item JavaScript

$(document).ready(function() {
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    $('#lostDate').attr('max', today);
    
    // Image preview
    $('#itemImage').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').html(`
                    <img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;">
                `);
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Form submission
    $('#lostItemForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Collect form data
        const formData = {
            personalInfo: {
                fullName: $('#fullName').val(),
                registrationNo: $('#registrationNo').val(),
                email: $('#email').val(),
                phone: $('#phone').val()
            },
            itemInfo: {
                name: $('#itemName').val(),
                category: $('#category').val(),
                color: $('#color').val(),
                description: $('#description').val()
            },
            locationDate: {
                location: $('#location').val(),
                specificLocation: $('#specificLocation').val(),
                lostDate: $('#lostDate').val(),
                lostTime: $('#lostTime').val()
            },
            additionalInfo: $('#additionalInfo').val(),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage (in real app, this would be an API call)
        saveLostItem(formData);
        
        // Generate reference ID
        const referenceId = generateReferenceId();
        
        // Show success modal
        $('#referenceId').text(referenceId);
        const modal = new bootstrap.Modal(document.getElementById('successModal'));
        modal.show();
        
        // Reset form
        this.reset();
        $('#imagePreview').empty();
    });
    
    // Form reset
    $('button[type="reset"]').on('click', function() {
        $('#imagePreview').empty();
    });
});

function validateForm() {
    let isValid = true;
    const errors = [];
    
    // Validate full name
    const fullName = $('#fullName').val();
    if (fullName.length < 3 || fullName.length > 50) {
        errors.push('Full name must be 3-50 characters');
        $('#fullName').addClass('is-invalid');
        isValid = false;
    } else {
        $('#fullName').removeClass('is-invalid');
    }
    
    // Validate registration number format
    const regNo = $('#registrationNo').val();
    const regNoPattern = /^\d{2}[A-Z]{3}\d{4}$/;
    if (!regNoPattern.test(regNo)) {
        errors.push('Registration number format: 24BIT0531');
        $('#registrationNo').addClass('is-invalid');
        isValid = false;
    } else {
        $('#registrationNo').removeClass('is-invalid');
    }
    
    // Validate email
    const email = $('#email').val();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errors.push('Please enter a valid email address');
        $('#email').addClass('is-invalid');
        isValid = false;
    } else {
        $('#email').removeClass('is-invalid');
    }
    
    // Validate phone number
    const phone = $('#phone').val();
    const phonePattern = /^[+]?[0-9\s\-()]{10,15}$/;
    if (!phonePattern.test(phone)) {
        errors.push('Phone number must be 10-15 digits');
        $('#phone').addClass('is-invalid');
        isValid = false;
    } else {
        $('#phone').removeClass('is-invalid');
    }
    
    // Validate item name
    const itemName = $('#itemName').val();
    if (itemName.length < 3 || itemName.length > 50) {
        errors.push('Item name must be 3-50 characters');
        $('#itemName').addClass('is-invalid');
        isValid = false;
    } else {
        $('#itemName').removeClass('is-invalid');
    }
    
    // Validate description
    const description = $('#description').val();
    if (description.length < 10 || description.length > 500) {
        errors.push('Description must be 10-500 characters');
        $('#description').addClass('is-invalid');
        isValid = false;
    } else {
        $('#description').removeClass('is-invalid');
    }
    
    // Validate date is not in future
    const lostDate = new Date($('#lostDate').val());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lostDate > today) {
        errors.push('Lost date cannot be in the future');
        $('#lostDate').addClass('is-invalid');
        isValid = false;
    } else {
        $('#lostDate').removeClass('is-invalid');
    }
    
    // Check if terms are agreed
    if (!$('#agreeTerms').is(':checked')) {
        errors.push('Please agree to the terms and conditions');
        isValid = false;
    }
    
    // Show errors
    if (errors.length > 0) {
        const errorMessage = errors.join('<br>');
        const alertHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 9999; max-width: 400px;">
                <strong><i class="fas fa-exclamation-circle"></i> Validation Errors:</strong><br>
                ${errorMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        $('body').append(alertHtml);
    }
    
    return isValid;
}

function saveLostItem(data) {
    // Get existing lost items from localStorage
    let lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    
    // Add new item
    lostItems.push(data);
    
    // Save back to localStorage
    localStorage.setItem('lostItems', JSON.stringify(lostItems));
    
    console.log('Lost item saved:', data);
}

function generateReferenceId() {
    // Generate a unique reference ID
    const prefix = 'LOST';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

// Auto-capitalize first letter of item name
$('#itemName').on('blur', function() {
    const value = $(this).val();
    if (value) {
        $(this).val(value.charAt(0).toUpperCase() + value.slice(1));
    }
});

// Character counter for description
$('#description').on('input', function() {
    const length = $(this).val().length;
    const maxLength = 500;
    
    if (!$('.char-counter').length) {
        $(this).after(`<small class="char-counter text-muted"></small>`);
    }
    
    $('.char-counter').text(`${length}/${maxLength} characters`);
    
    if (length > maxLength) {
        $(this).val($(this).val().substring(0, maxLength));
        $('.char-counter').text(`${maxLength}/${maxLength} characters`).addClass('text-danger');
    } else {
        $('.char-counter').removeClass('text-danger');
    }
});

// Format phone number as user types
$('#phone').on('input', function() {
    let value = $(this).val().replace(/\D/g, '');
    if (value.length > 0 && !value.startsWith('91')) {
        value = '91' + value;
    }
    if (value.length > 12) {
        value = value.substring(0, 12);
    }
    if (value.length > 2) {
        value = '+' + value.substring(0, 2) + '-' + value.substring(2);
    }
    $(this).val(value);
});

// Show/hide specific location based on location selection
$('#location').on('change', function() {
    if ($(this).val() === 'others') {
        $('#specificLocation').attr('required', true);
        $('#specificLocation').closest('.col-md-6').find('label').append(' *');
    } else {
        $('#specificLocation').attr('required', false);
        $('#specificLocation').closest('.col-md-6').find('label').text('Specific Location Details');
    }
});

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
