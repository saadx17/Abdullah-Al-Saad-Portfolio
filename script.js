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

let currentImageIndex = 0;
let currentGallery = 'landscape'; // default
let isLightboxOpen = false;

// Ensure imageGalleries exists
if (typeof imageGalleries === 'undefined') {
    window.imageGalleries = {};
}

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
    if (lightboxTitle) {
        if (title) {
            // If title is provided as parameter, use it
            lightboxTitle.textContent = title;
        } else {
            // Try to find title from imageGalleries data
            let foundTitle = '';
            let foundQuote = '';
            
            for (const [galleryName, gallery] of Object.entries(imageGalleries)) {
                const imageIndex = gallery.findIndex(img => img.src === imageSrc);
                if (imageIndex !== -1) {
                    currentGallery = galleryName;
                    currentImageIndex = imageIndex;
                    const currentImage = gallery[imageIndex];
                    foundTitle = currentImage.title || '';
                    foundQuote = currentImage.quote || '';
                    break;
                }
            }
            
            lightboxTitle.textContent = foundTitle;
            
            // Set quote if element exists
            if (lightboxQuote) {
                lightboxQuote.textContent = foundQuote;
            }
        }
    }
    
    // If no title was found and no title parameter provided, clear the title
    if (lightboxTitle && !title && !lightboxTitle.textContent) {
        lightboxTitle.textContent = '';
    }
    
    // Show lightbox
    lightbox.style.display = 'flex';
    lightbox.classList.add('show');
    
    isLightboxOpen = true;
    
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
    
    // Update navigation buttons state if we have gallery data
    if (currentGallery && imageGalleries[currentGallery]) {
        updateNavigationButtons();
    }
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

function previousImage() {
    if (currentGallery && imageGalleries[currentGallery]) {
        const currentGalleryArray = imageGalleries[currentGallery];
        currentImageIndex = (currentImageIndex - 1 + currentGalleryArray.length) % currentGalleryArray.length;
        updateLightboxImage();
    }
}

function nextImage() {
    if (currentGallery && imageGalleries[currentGallery]) {
        const currentGalleryArray = imageGalleries[currentGallery];
        currentImageIndex = (currentImageIndex + 1) % currentGalleryArray.length;
        updateLightboxImage();
    }
}

function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxQuote = document.getElementById('lightbox-quote');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    if (lightboxImage && currentGallery && imageGalleries[currentGallery]) {
        const currentImage = imageGalleries[currentGallery][currentImageIndex];
        
        if (currentImage) {
            lightboxImage.src = currentImage.src;
            
            // Only set title and quote if elements exist and data is available
            if (lightboxTitle && currentImage.title) {
                lightboxTitle.textContent = currentImage.title;
            } else if (lightboxTitle) {
                lightboxTitle.textContent = '';
            }
            if (lightboxQuote && currentImage.quote) {
                lightboxQuote.textContent = currentImage.quote;
            } else if (lightboxQuote) {
                lightboxQuote.textContent = '';
            }
            
            // Update navigation buttons state
            updateNavigationButtons();
        }
    }
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (prevBtn && nextBtn && currentGallery && imageGalleries[currentGallery]) {
        const currentGalleryArray = imageGalleries[currentGallery];
        // Add/remove disabled state for visual feedback
        prevBtn.classList.toggle('disabled', currentImageIndex === 0);
        nextBtn.classList.toggle('disabled', currentImageIndex === currentGalleryArray.length - 1);
    }
}

// Basic keyboard navigation
document.addEventListener('keydown', function(event) {
    if (!isLightboxOpen) return;
    
    switch(event.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            event.preventDefault();
            previousImage();
            break;
        case 'ArrowRight':
            event.preventDefault();
            nextImage();
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
    }
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore background scrolling
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeImageModal();
    }
});
