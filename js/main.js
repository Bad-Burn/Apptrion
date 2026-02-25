/**
 * Apptrion Website Main JavaScript
 * Dynamically loads HTML sections/partials
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Apptrion website loading...');
    
    // Load all HTML partials
    loadPartials();
    
    // Initialize theme system
    initializeTheme();
});

/**
 * Load HTML partials into their containers
 */
function loadPartials() {
    const partials = [
        { id: 'header-container', file: 'includes/header.html' },
        { id: 'hero-container', file: 'includes/hero.html' },
        { id: 'products-container', file: 'includes/products.html' },
        { id: 'why-apptrion-container', file: 'includes/why-apptrion.html' },
        { id: 'team-container', file: 'includes/team.html' },
        { id: 'contact-container', file: 'includes/contact.html' },
        { id: 'footer-container', file: 'includes/footer.html' }
    ];

    partials.forEach(partial => {
        loadPartial(partial.id, partial.file);
    });
}

/**
 * Load a single HTML partial file
 */
function loadPartial(containerId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            console.log(`Loaded: ${filePath}`);
            
            // Initialize theme toggle button after header is loaded
            if (containerId === 'header-container') {
                initializeThemeToggle();
            }

            // Initialize carousel after hero is loaded
            if (containerId === 'hero-container') {
                setTimeout(initializeCarousel, 100);
            }

            // Initialize projects carousel after products section is loaded
            if (containerId === 'products-container') {
                setTimeout(initializeProjectsCarousel, 100);
            }

            // Initialize contact form after contact section is loaded
            if (containerId === 'contact-container') {
                initializeContactForm();
            }
        })
        .catch(error => {
            console.error(`Error loading ${filePath}:`, error);
        });
}

/**
 * Initialize the theme system
 */
function initializeTheme() {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        updateThemeIcon('light');
    } else {
        document.documentElement.classList.remove('light-theme');
        updateThemeIcon('dark');
    }
}

/**
 * Initialize theme toggle button click handler
 */
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
    const html = document.documentElement;
    const isLightTheme = html.classList.toggle('light-theme');
    
    // Save preference to localStorage
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
    
    console.log(`Theme switched to: ${isLightTheme ? 'light' : 'dark'}`);
}

/**
 * Smooth scroll for navigation links
 */
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

/**
 * Initialize AOS (Animate On Scroll) library
 */
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            offset: 100,
            once: true,
            easing: 'ease-in-out'
        });
    }
}

// Initialize AOS when partials are loaded
setTimeout(initializeAOS, 500);

/**
 * Initialize Contact Form Handler
 */
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }
}

/**
 * Handle Contact Form Submission
 */
async function handleContactFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Get form data
    const formData = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        message: document.getElementById('contact-message').value.trim()
    };

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
        showFormMessage('error', 'Please fill in all fields');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        showFormMessage('error', 'Please enter a valid email address');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        // Send to backend API
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showFormMessage('success', result.message);
            form.reset(); // Clear form
            console.log('✅ Contact form submitted successfully');
        } else {
            showFormMessage('error', result.message || 'Failed to send message');
            console.error('❌ Contact form submission failed:', result);
        }

    } catch (error) {
        console.error('❌ Error submitting contact form:', error);
        
        // Fallback: Try to show error message
        if (error instanceof TypeError && error.message.includes('fetch')) {
            showFormMessage('error', 'Server not available. Please check the connection.');
        } else {
            showFormMessage('error', 'An error occurred. Please try again later.');
        }
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
    }
}

/**
 * Show form status message
 */
function showFormMessage(type, message) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 6px;
        font-weight: 500;
        animation: slideInUp 0.3s ease;
    `;

    if (type === 'success') {
        messageEl.style.backgroundColor = '#d4edda';
        messageEl.style.color = '#155724';
        messageEl.style.border = '1px solid #c3e6cb';
    } else {
        messageEl.style.backgroundColor = '#f8d7da';
        messageEl.style.color = '#721c24';
        messageEl.style.border = '1px solid #f5c6cb';
    }

    // Insert before form
    const form = document.getElementById('contact-form');
    if (form && form.parentElement) {
        form.parentElement.insertBefore(messageEl, form);
        
        // Auto-remove success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageEl.remove();
            }, 5000);
        }
    }
}

/**
 * Initialize Carousel Functionality
 */
function initializeCarousel() {
    console.log('🚀 CAROUSEL INIT STARTING');
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('dotsContainer');
    const carouselContainer = document.querySelector('.carousel-container');

    console.log('📊 DEBUG: Slides found:', slides.length);
    console.log('📊 DEBUG: Dots container:', dotsContainer);
    console.log('📊 DEBUG: Carousel container:', carouselContainer);

    if (slides.length === 0) {
        console.error('❌ CRITICAL: No carousel slides found!');
        return;
    }

    let currentSlide = 0;

    // Show first slide immediately
    if (slides[0]) {
        slides[0].classList.add('active');
        console.log('✅ First slide activated');
    }

    // Create pagination dots
    slides.forEach((slide, index) => {
        console.log('🖼️ Slide', index, ':', slide.style.backgroundImage);
        
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            console.log('📍 Clicked dot', index);
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    console.log('✅ Created', slides.length, 'pagination dots');

    // Navigate to specific slide
    function goToSlide(index) {
        currentSlide = index;
        console.log('🎬 GO TO SLIDE:', index);
        
        slides.forEach((slide, i) => {
            if (i === currentSlide) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
        
        updateDots();
    }

    // Update active dot
    function updateDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        console.log('▶️ NEXT SLIDE:', currentSlide);
        goToSlide(currentSlide);
    }

    // Auto-rotate carousel every 5 seconds
    const autoRotateInterval = setInterval(() => {
        nextSlide();
    }, 5000);

    console.log('✅✅✅ CAROUSEL FULLY INITIALIZED - Auto-rotation started every 5 seconds');
}

/**
 * Initialize Projects Carousel Functionality
 */
function initializeProjectsCarousel() {
    console.log('🚀 PROJECTS CAROUSEL INIT STARTING');
    
    const carousel = document.getElementById('projects-carousel');
    const cards = document.querySelectorAll('.project-card');
    const prevBtn = document.getElementById('projects-prev');
    const nextBtn = document.getElementById('projects-next');

    if (!carousel || cards.length === 0) {
        console.warn('⚠️ Projects carousel elements not found');
        return;
    }

    let currentIndex = 0;

    // Set initial active card
    function updateActiveCard() {
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
        updateCarouselPosition();
    }

    // Update carousel scroll position
    function updateCarouselPosition() {
        const cardWidth = cards[0].offsetWidth;
        const gap = 32; // Gap between cards (2rem)
        const offset = currentIndex * (cardWidth + gap);
        carousel.style.transform = `translateX(-${offset}px)`;
    }

    // Next card
    function nextCard() {
        currentIndex = (currentIndex + 1) % cards.length;
        updateActiveCard();
    }

    // Previous card
    function prevCard() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateActiveCard();
    }

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevCard);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextCard);
    }

    // Handle window resize
    window.addEventListener('resize', updateCarouselPosition);

    // Initialize first card as active
    updateActiveCard();

    console.log('✅ Projects carousel initialized with', cards.length, 'cards');
}
