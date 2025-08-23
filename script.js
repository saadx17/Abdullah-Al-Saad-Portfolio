// Hamburger Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    
    if (hamburgerMenu && navLinks) {
        hamburgerMenu.addEventListener('click', function() {
            hamburgerMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinkElements = document.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', function() {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburgerMenu.contains(event.target) && !navLinks.contains(event.target)) {
                hamburgerMenu.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
    
    // Intro Animation Functionality
    const introElements = document.querySelectorAll(`
        .intro-fade-up
    `);
    
    // Trigger intro animations for hero section on page load
    introElements.forEach(element => {
        setTimeout(() => {
            element.classList.add('animate');
        }, 100);
    });
    
    // Scroll Animation Functionality
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements with scroll animation classes
    const scrollElements = document.querySelectorAll(`
        .fade-up,
        .slide-left,
        .slide-right,
        .scale-in
    `);
    
    scrollElements.forEach(element => {
        observer.observe(element);
    });
});

// Minimalist Lightbox Functionality

let isLightboxOpen = false;

function openLightbox(imageSrc, title) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxQuote = document.getElementById('lightbox-quote');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    if (!lightbox || !lightboxImage) {
        console.warn('Lightbox elements not found');
        return;
    }
    
    // Set the image source
    lightboxImage.src = imageSrc;
    
    // Handle title and quote display
    if (lightboxTitle && title) {
        lightboxTitle.textContent = title;
    } else if (lightboxTitle) {
        lightboxTitle.textContent = '';
    }
    
    // Set quote if element exists
    if (lightboxQuote) {
        lightboxQuote.textContent = '';
    }
    
    // Show lightbox
    lightbox.style.display = 'flex';
    lightbox.classList.add('show');
    
    isLightboxOpen = true;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox && isLightboxOpen) {
        lightbox.classList.remove('show');
        lightbox.style.display = 'none';
        isLightboxOpen = false;
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }
}

// Navigation functions removed - simplified lightbox without gallery navigation

// Basic keyboard navigation
document.addEventListener('keydown', function(event) {
    if (!isLightboxOpen) return;
    
    switch(event.key) {
        case 'Escape':
            closeLightbox();
            break;
    }
});

// Click outside to close
document.addEventListener('click', function(event) {
    const lightbox = document.getElementById('lightbox');
    if (isLightboxOpen && event.target === lightbox) {
        closeLightbox();
    }
});

// Image Modal Functions
function openImageModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    
    if (modal && modalImage) {
        modalImage.src = imageSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Add touch event listeners for mobile devices
        addModalTouchListeners();
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
        
        // Remove touch event listeners
        removeModalTouchListeners();
    }
}

// Add touch event listeners for mobile modal
function addModalTouchListeners() {
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('div');
    
    if (!modal || !modalContent) return;
    
    // Store original event handlers
    modal._originalOnClick = modal.onclick;
    modalContent._originalOnClick = modalContent.onclick;
    
    // Enhanced touch event handling for mobile
    let touchStartY = 0;
    let touchStartX = 0;
    let touchEndY = 0;
    let touchEndX = 0;
    let touchStartTime = 0;
    
    // Touch start event
    modal.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
    }, { passive: true });
    
    // Touch end event
    modal.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].clientY;
        touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        
        // Calculate touch distance and duration
        const deltaY = Math.abs(touchEndY - touchStartY);
        const deltaX = Math.abs(touchEndX - touchStartX);
        const touchDuration = touchEndTime - touchStartTime;
        
        // If touch is on the background (not on the image content) and is a quick tap, close modal
        if (e.target === modal && deltaY < 15 && deltaX < 15 && touchDuration < 300) {
            closeImageModal();
        }
    }, { passive: true });
    
    // Enhanced click handling for mobile
    modal.addEventListener('click', function(e) {
        // Close modal when clicking on the background
        if (e.target === modal) {
            closeImageModal();
        }
    });
    
    // Prevent modal content clicks from closing the modal
    modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Add swipe down gesture to close modal (common mobile pattern)
    let initialTouchY = 0;
    let currentTouchY = 0;
    
    modal.addEventListener('touchstart', function(e) {
        initialTouchY = e.touches[0].clientY;
    }, { passive: true });
    
    modal.addEventListener('touchmove', function(e) {
        currentTouchY = e.touches[0].clientY;
    }, { passive: true });
    
    modal.addEventListener('touchend', function(e) {
        const swipeDistance = currentTouchY - initialTouchY;
        const swipeThreshold = 100; // Minimum swipe distance to trigger close
        
        // If swiping down significantly, close the modal
        if (swipeDistance > swipeThreshold && currentTouchY > 0) {
            closeImageModal();
        }
    }, { passive: true });
    
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        // Small delay to let orientation change complete
        setTimeout(function() {
            if (modal.style.display !== 'none') {
                // Re-center the modal content
                modal.style.display = 'none';
                setTimeout(function() {
                    modal.style.display = 'flex';
                }, 50);
            }
        }, 100);
    });
}

// Remove touch event listeners
function removeModalTouchListeners() {
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('div');
    
    if (!modal || !modalContent) return;
    
    // Remove all event listeners by cloning and replacing
    const newModal = modal.cloneNode(true);
    const newModalContent = newModal.querySelector('div');
    
    // Restore original content
    if (modalContent) {
        newModalContent.innerHTML = modalContent.innerHTML;
    }
    
    // Replace the modal
    modal.parentNode.replaceChild(newModal, modal);
    
    // Restore the modal reference
    window.imageModal = newModal;
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});
