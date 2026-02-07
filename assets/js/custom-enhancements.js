/**
 * Enhanced JavaScript for Nick Rathfelder Portfolio
 * Add this code to your existing main.js file or create a new custom.js file
 */

(function() {
  "use strict";

  /**
   * Fix for Skills Progress Bar Animation
   * Animates progress bars when they become visible
   */
  function animateProgressBars() {
    const progressBars = document.querySelectorAll('.skills .progress');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const progressBar = entry.target.querySelector('.progress-bar');
          const targetWidth = progressBar.getAttribute('aria-valuenow') + '%';
          
          // Set CSS variable for animation
          entry.target.style.setProperty('--progress-width', targetWidth);
          
          // Trigger animation by adding class
          setTimeout(() => {
            progressBar.style.width = targetWidth;
          }, 100);
          
          // Unobserve after animation
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    progressBars.forEach(bar => observer.observe(bar));
  }

  /**
   * Initialize Typed.js for Hero Section
   * Fixes the incomplete "I'm" text issue
   */
  function initTyped() {
    const typedElement = document.querySelector('.typed');
    
    if (typedElement && typeof Typed !== 'undefined') {
      const typedStrings = typedElement.getAttribute('data-typed-items');
      if (typedStrings) {
        const stringsArray = typedStrings.split(',').map(s => s.trim());
        
        new Typed('.typed', {
          strings: stringsArray,
          loop: true,
          typeSpeed: 100,
          backSpeed: 50,
          backDelay: 2000,
          startDelay: 500
        });
      }
    }
  }

  /**
   * Enhanced Mobile Navigation Toggle
   */
  function initMobileNav() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const header = document.getElementById('header');
    
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('click', function() {
        header.classList.toggle('header-show');
        mobileNavToggle.classList.toggle('bi-list');
        mobileNavToggle.classList.toggle('bi-x');
      });
    }

    // Close mobile nav when clicking on a nav link
    const navLinks = document.querySelectorAll('#navbar a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (header.classList.contains('header-show')) {
          header.classList.remove('header-show');
          mobileNavToggle.classList.add('bi-list');
          mobileNavToggle.classList.remove('bi-x');
        }
      });
    });
  }

  /**
   * Smooth Scroll for Navigation Links
   * Enhanced version with offset for fixed header
   */
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a.scrollto');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        if (targetId.startsWith('#')) {
          e.preventDefault();
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });
  }

  /**
   * Active Navigation Link Highlighting
   */
  function initNavbarLinks() {
    const navbarlinks = document.querySelectorAll('#navbar .scrollto');
    
    function navbarlinksActive() {
      let position = window.scrollY + 200;
      
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return;
        
        let section = document.querySelector(navbarlink.hash);
        if (!section) return;
        
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active');
        } else {
          navbarlink.classList.remove('active');
        }
      });
    }
    
    window.addEventListener('load', navbarlinksActive);
    window.addEventListener('scroll', navbarlinksActive);
  }

  /**
   * Back to Top Button
   */
  function initBackToTop() {
    const backtotop = document.querySelector('.back-to-top');
    
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active');
        } else {
          backtotop.classList.remove('active');
        }
      };
      
      window.addEventListener('load', toggleBacktotop);
      window.addEventListener('scroll', toggleBacktotop);
    }
  }

  /**
   * Portfolio Lightbox Enhancement
   * Adds keyboard navigation support
   */
  function enhanceLightbox() {
    // This assumes GLightbox is being used
    if (typeof GLightbox !== 'undefined') {
      const lightbox = GLightbox({
        selector: '.portfolio-lightbox, .glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: true
      });
    }
  }

  /**
   * Lazy Loading Images
   * Improves page load performance
   */
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Browser supports native lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      // Fallback for browsers that don't support lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.removeAttribute('loading');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }
  }

  /**
   * Add Fade-in Animation to Sections
   */
  function initFadeInAnimations() {
    const sections = document.querySelectorAll('section');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          fadeInObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    sections.forEach(section => {
      section.style.opacity = '0';
      fadeInObserver.observe(section);
    });
  }

  /**
   * Preload Critical Images
   */
  function preloadImages() {
    const criticalImages = [
      'assets/img/profile-img.jpg',
      'assets/img/hero-bg.jpg'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  /**
   * Initialize All Enhancements
   */
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    // Initialize all functions
    preloadImages();
    initTyped();
    animateProgressBars();
    initMobileNav();
    initSmoothScroll();
    initNavbarLinks();
    initBackToTop();
    enhanceLightbox();
    initLazyLoading();
    
    // Optional: Uncomment if you want fade-in animations
    // initFadeInAnimations();

    console.log('Portfolio enhancements initialized successfully!');
  }

  // Start initialization
  init();

})();

/**
 * Additional Utility Functions
 */

// Form Validation Helper (if you add a contact form later)
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Detect if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Accessibility: Skip to main content
function addSkipToMain() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-to-main';
  skipLink.textContent = 'Skip to main content';
  skipLink.setAttribute('tabindex', '1');
  document.body.insertBefore(skipLink, document.body.firstChild);
}

// Call this function on page load
document.addEventListener('DOMContentLoaded', addSkipToMain);
