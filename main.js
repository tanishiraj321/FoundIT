// Main JavaScript for FoundIT Homepage

$(document).ready(function() {
    // Animate statistics on scroll
    animateStats();
    
    // Category card click handler
    setupCategoryCards();
    
    // Smooth scroll for navigation
    setupSmoothScroll();
});

// Animate statistics counter
function animateStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $('.stat-number').each(function() {
                    const $this = $(this);
                    const target = parseInt($this.data('target'));
                    
                    $({ Counter: 0 }).animate({ Counter: target }, {
                        duration: 2000,
                        easing: 'swing',
                        step: function() {
                            $this.text(Math.ceil(this.Counter));
                        },
                        complete: function() {
                            $this.text(target + ($this.parent().find('.stat-label').text().includes('Rate') ? '%' : ''));
                        }
                    });
                });
                observer.disconnect();
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Setup category cards
function setupCategoryCards() {
    $('.category-card').on('click', function() {
        const category = $(this).data('category');
        window.location.href = `browse.html?category=${category}`;
    });
}

// Smooth scroll for navigation
function setupSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        
        if (target.length) {
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });
}

// Add animation on scroll
$(window).on('scroll', function() {
    $('.work-step, .category-card').each(function() {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();
        
        if (elementBottom > viewportTop && elementTop < viewportBottom) {
            $(this).addClass('fade-in-up');
        }
    });
});

// Navbar scroll effect
$(window).on('scroll', function() {
    if ($(window).scrollTop() > 50) {
        $('.navbar').addClass('shadow-lg');
    } else {
        $('.navbar').removeClass('shadow-lg');
    }
});
