// Main JavaScript file for landing page functionality

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS (Animate On Scroll)
  AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-out-cubic',
    offset: 100
  });

  // Cache DOM elements
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const newsletterForm = document.getElementById('newsletter-form');
  const navbar = document.querySelector('nav');
  const emailInput = document.querySelector('input[type="email"]');
  const ctaButton = document.querySelector('.cta-button');
  const pricingButtons = document.querySelectorAll('.pricing-card button');
  const allSections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Helper: Toggle mobile menu icon
  function toggleMobileMenuIcon() {
    const icon = mobileMenuButton.querySelector('i');
    if (mobileMenu.classList.contains('hidden')) {
      icon.classList.replace('fa-times', 'fa-bars');
    } else {
      icon.classList.replace('fa-bars', 'fa-times');
    }
  }

  // Mobile menu toggle
  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    toggleMobileMenuIcon();
  });

  // Smooth scroll with mobile menu close
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();

      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (!mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
          toggleMobileMenuIcon();
        }
      }
    });
  });

  // Navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('bg-white/95');
      navbar.classList.remove('bg-white/90');
    } else {
      navbar.classList.add('bg-white/90');
      navbar.classList.remove('bg-white/95');
    }
  });

  // Update active nav link based on scroll position
  function updateActiveNavLink() {
    let current = '';
    allSections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionHeight = section.clientHeight;
      if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('text-primary-600');
      link.classList.add('text-gray-700');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('text-primary-600');
        link.classList.remove('text-gray-700');
      }
    });
  }

  // Debounce utility for scroll performance
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  // Apply debounced scroll handler
  window.addEventListener('scroll', debounce(updateActiveNavLink, 10));

  // Newsletter form submission with simulated API call
  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = newsletterForm.querySelector('input[type="email"]').value;
    const button = newsletterForm.querySelector('button[type="submit"]');
    const originalText = button.textContent;

    button.textContent = 'Subscribing...';
    button.disabled = true;
    button.classList.add('loading');

    setTimeout(() => {
      button.textContent = 'Subscribed!';
      button.classList.remove('loading', 'bg-yellow-400', 'hover:bg-yellow-300');
      button.classList.add('bg-green-500', 'hover:bg-green-400');
      newsletterForm.reset();

      showNotification('Successfully subscribed to our newsletter!', 'success');

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
        button.classList.remove('bg-green-500', 'hover:bg-green-400');
        button.classList.add('bg-yellow-400', 'hover:bg-yellow-300');
      }, 3000);
    }, 1500);
  });

  // Notification system
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `
      fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg
      transform translate-x-full transition-transform duration-300
      ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
      text-white
    `.trim();

    notification.innerHTML = `
      <div class="flex items-center">
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} mr-2"></i>
        <span>${message}</span>
        <button class="ml-4 text-white hover:text-gray-200" aria-label="Close notification">
          <i class="fas fa-times"></i>
        </button>
      </div>
    `;

    notification.querySelector('button').addEventListener('click', () => {
      notification.remove();
    });

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.remove('translate-x-full'), 100);

    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  // CTA button click handler
  if (ctaButton) {
    ctaButton.addEventListener('click', () => {
      showNotification("Welcome! Let's get started with your journey.", 'success');
      const featuresSection = document.querySelector('#features');
      if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Pricing buttons handlers
  pricingButtons.forEach(button => {
    button.addEventListener('click', () => {
      const planName = button.closest('.pricing-card').querySelector('h3').textContent.trim();
      if (button.textContent.trim() === 'Contact Sales') {
        showNotification(`Thanks for your interest in the ${planName} plan! Our sales team will contact you soon.`, 'success');
      } else {
        showNotification(`Redirecting to ${planName} plan signup...`, 'info');
      }
    });
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('[data-parallax]').forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  });

  // Intersection Observer for animations
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');

        const children = entry.target.querySelectorAll('.feature-card, .pricing-card');
        children.forEach((child, index) => {
          setTimeout(() => {
            child.style.opacity = '1';
            child.style.transform = 'translateY(0)';
          }, index * 100);
        });
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  allSections.forEach(section => observer.observe(section));

  // Keyboard navigation support (ESC closes mobile menu)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      toggleMobileMenuIcon();
    }
  });

  // Email validation helper
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Real-time email validation
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      const email = emailInput.value;
      const submitButton = emailInput.closest('form').querySelector('button[type="submit"]');

      if (email && !validateEmail(email)) {
        emailInput.classList.add('border-red-500');
        submitButton.disabled = true;
        submitButton.classList.add('opacity-50');
      } else {
        emailInput.classList.remove('border-red-500');
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
      }
    });
  }

  // Loading screen cleanup (optional)
  window.addEventListener('load', () => {
    document.querySelectorAll('.loading').forEach(el => el.classList.remove('loading'));
    setTimeout(() => document.body.classList.add('loaded'), 100);
  });

  // Safe querySelector with warning
  function safeQuerySelector(selector) {
    const el = document.querySelector(selector);
    if (!el) console.warn(`Element not found: ${selector}`);
    return el;
  }

  // Analytics event tracker (placeholder)
  function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
  }

  // Track button clicks for analytics
  document.querySelectorAll('button, .cta-button').forEach(button => {
    button.addEventListener('click', () => {
      const buttonText = button.textContent.trim();
      trackEvent('button_click', {
        button_text: buttonText,
        section: button.closest('section')?.id || 'unknown'
      });
    });
  });

  console.log('InnovateTech landing page initialized successfully! 🚀');
});

