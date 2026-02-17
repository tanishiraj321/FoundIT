// Report Found Item JavaScript

$(document).ready(function() {
    // Set max date to today
    const today = new Date().toISOString().split('T')[0];
    $('#foundDate').attr('max', today);
    
    // Image preview
    $('#itemImage').on('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size should not exceed 5MB');
                $(this).val('');
                return;
            }
            
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                alert('Please upload a valid image file (JPG, PNG, or GIF)');
                $(this).val('');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#imagePreview').html(`
                    <div class="position-relative d-inline-block">
                        <img src="${e.target.result}" class="img-thumbnail" style="max-height: 200px;">
                        <button type="button" class="btn btn-danger btn-sm position-absolute top-0 end-0 m-2" id="removeImage">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `);
                
                // Remove image handler
                $('#removeImage').on('click', function() {
                    $('#itemImage').val('');
                    $('#imagePreview').empty();
                });
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Form submission
    $('#foundItemForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Submitting...').prop('disabled', true);
        
        // Simulate API call delay
        setTimeout(() => {
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
                    foundDate: $('#foundDate').val(),
                    foundTime: $('#foundTime').val()
                },
                currentStatus: $('#currentStatus').val(),
                additionalInfo: $('#additionalInfo').val(),
                timestamp: new Date().toISOString()
            };
            
            // Save to localStorage
            saveFoundItem(formData);
            
            // Generate reference ID
            const referenceId = generateReferenceId();
            
            // Check for potential matches
            checkForMatches(formData);
            
            // Show success modal
            $('#referenceId').text(referenceId);
            const modal = new bootstrap.Modal(document.getElementById('successModal'));
            modal.show();
            
            // Reset form
            this.reset();
            $('#imagePreview').empty();
            submitBtn.html(originalText).prop('disabled', false);
        }, 1500);
    });
    
    // Form reset
    $('button[type="reset"]').on('click', function() {
        $('#imagePreview').empty();
    });
});

function validateForm() {
    let isValid = true;
    const errors = [];
    
    // Remove previous validation styles
    $('.is-invalid').removeClass('is-invalid');
    
    // Validate full name
    const fullName = $('#fullName').val();
    if (fullName.length < 3 || fullName.length > 50) {
        errors.push('Full name must be 3-50 characters');
        $('#fullName').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate registration number format
    const regNo = $('#registrationNo').val();
    const regNoPattern = /^\d{2}[A-Z]{3}\d{4}$/;
    if (!regNoPattern.test(regNo)) {
        errors.push('Registration number format: 24BIT0531');
        $('#registrationNo').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate email
    const email = $('#email').val();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        errors.push('Please enter a valid email address');
        $('#email').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate phone number
    const phone = $('#phone').val();
    const phonePattern = /^[+]?[0-9\s\-()]{10,15}$/;
    if (!phonePattern.test(phone)) {
        errors.push('Phone number must be 10-15 digits');
        $('#phone').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate item name
    const itemName = $('#itemName').val();
    if (itemName.length < 3 || itemName.length > 50) {
        errors.push('Item name must be 3-50 characters');
        $('#itemName').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate description
    const description = $('#description').val();
    if (description.length < 10 || description.length > 500) {
        errors.push('Description must be 10-500 characters');
        $('#description').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate date is not in future
    const foundDate = new Date($('#foundDate').val());
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (foundDate > today) {
        errors.push('Found date cannot be in the future');
        $('#foundDate').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate image is uploaded
    if (!$('#itemImage').val()) {
        errors.push('Please upload an image of the found item');
        $('#itemImage').addClass('is-invalid');
        isValid = false;
    }
    
    // Validate current status is selected
    if (!$('#currentStatus').val()) {
        errors.push('Please select the current status of the item');
        $('#currentStatus').addClass('is-invalid');
        isValid = false;
    }
    
    // Check if terms are agreed
    if (!$('#agreeTerms').is(':checked')) {
        errors.push('Please agree to the terms and conditions');
        isValid = false;
    }
    
    // Show errors
    if (errors.length > 0) {
        const errorMessage = errors.join('<br>');
        showAlert(`<strong><i class="fas fa-exclamation-circle"></i> Validation Errors:</strong><br>${errorMessage}`, 'danger');
    }
    
    return isValid;
}

function saveFoundItem(data) {
    // Get existing found items from localStorage
    let foundItems = JSON.parse(localStorage.getItem('foundItems') || '[]');
    
    // Add new item
    foundItems.push(data);
    
    // Save back to localStorage
    localStorage.setItem('foundItems', JSON.stringify(foundItems));
    
    console.log('Found item saved:', data);
}

function generateReferenceId() {
    // Generate a unique reference ID
    const prefix = 'FOUND';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${timestamp}-${random}`;
}

function checkForMatches(foundItem) {
    // Get lost items from localStorage
    const lostItems = JSON.parse(localStorage.getItem('lostItems') || '[]');
    
    // Simple matching algorithm (in real app, this would be more sophisticated)
    const matches = lostItems.filter(lostItem => {
        const categoryMatch = lostItem.itemInfo.category === foundItem.itemInfo.category;
        const locationMatch = lostItem.locationDate.location === foundItem.locationDate.location;
        const dateMatch = Math.abs(new Date(lostItem.locationDate.lostDate) - new Date(foundItem.locationDate.foundDate)) <= 7 * 24 * 60 * 60 * 1000; // Within 7 days
        
        return categoryMatch && locationMatch && dateMatch;
    });
    
    if (matches.length > 0) {
        console.log(`Found ${matches.length} potential matches!`);
        // In real app, would notify the lost item reporters
    }
}

function showAlert(message, type = 'info') {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Insert alert at the top of the form
    $('.form-card form').prepend(alertHtml);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        $('.alert').alert('close');
    }, 5000);
    
    // Scroll to alert
    $('html, body').animate({
        scrollTop: $('.alert').offset().top - 100
    }, 500);
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
        $(this).after(`<small class="char-counter text-muted d-block mt-1"></small>`);
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
        $('#specificLocation').closest('.col-md-6').find('label').html('Specific Location Details *');
    } else {
        $('#specificLocation').attr('required', false);
        $('#specificLocation').closest('.col-md-6').find('label').html('Specific Location Details');
    }
});

// Highlight current status field
$('#currentStatus').on('change', function() {
    if ($(this).val()) {
        $(this).addClass('border-success');
    } else {
        $(this).removeClass('border-success');
    }
});

// Form field validation feedback
$('input[required], select[required], textarea[required]').on('blur', function() {
    if ($(this).val()) {
        $(this).removeClass('is-invalid').addClass('is-valid');
    } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
    }
});

// Remove validation classes on input
$('input, select, textarea').on('input', function() {
    $(this).removeClass('is-valid is-invalid');
});
