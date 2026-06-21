/**
 * Shankar Travel Agency - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initTestimonialCarousel();
  initBookingTabs();
  initContactForms();
  initWhatsAppWidget();
});

/**
 * 1. Navigation & Sticky Header Behavior
 */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change header appearance on scroll
  const handleScroll = () => {
    const isLightPage = document.body.dataset.headerTheme === 'light';
    
    if (window.scrollY > 30) {
      if (isLightPage) {
        header.classList.add('scrolled-light');
      } else {
        header.classList.add('scrolled');
      }
    } else {
      header.classList.remove('scrolled', 'scrolled-light');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      const spans = navToggle.querySelectorAll('span');
      if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'translateY(8px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) {
        navToggle.click();
      }
    });
  });
}

/**
 * 2. Testimonial Carousel Behavior
 */
function initTestimonialCarousel() {
  const scroller = document.querySelector('.testimonials-scroller');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.carousel-nav-btn.prev');
  const nextBtn = document.querySelector('.carousel-nav-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!scroller || slides.length === 0) return;

  let currentIdx = 0;
  const totalSlides = slides.length;

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (i === 0) dot.classList.add('active');
    dot.dataset.slideIdx = i;
    dot.addEventListener('click', () => scrollToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.carousel-dot');

  const updateActiveState = (idx) => {
    currentIdx = idx;
    dots.forEach((dot, index) => {
      if (index === idx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const scrollToSlide = (idx) => {
    if (idx < 0 || idx >= totalSlides) return;
    
    const slideWidth = scroller.clientWidth;
    scroller.scrollTo({
      left: slideWidth * idx,
      behavior: 'smooth'
    });
    updateActiveState(idx);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let target = currentIdx - 1;
      if (target < 0) target = totalSlides - 1;
      scrollToSlide(target);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let target = currentIdx + 1;
      if (target >= totalSlides) target = 0;
      scrollToSlide(target);
    });
  }

  let scrollTimeout;
  scroller.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const slideWidth = scroller.clientWidth;
      const computedIndex = Math.round(scroller.scrollLeft / slideWidth);
      if (computedIndex !== currentIdx && computedIndex >= 0 && computedIndex < totalSlides) {
        updateActiveState(computedIndex);
      }
    }, 100);
  });

  let autoPlayTimer = setInterval(() => {
    let next = (currentIdx + 1) % totalSlides;
    scrollToSlide(next);
  }, 6000);

  scroller.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
  scroller.parentElement.addEventListener('mouseleave', () => {
    autoPlayTimer = setInterval(() => {
      let next = (currentIdx + 1) % totalSlides;
      scrollToSlide(next);
    }, 6000);
  });
}

/**
 * 3. Booking Tabs UI Widget
 */
function initBookingTabs() {
  const tabs = document.querySelectorAll('.booking-tab');
  const panes = document.querySelectorAll('.booking-pane');

  if (tabs.length === 0 || panes.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPaneId = tab.dataset.targetTab;
      const targetPane = document.getElementById(targetPaneId);
      
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/**
 * 4. Travel Lead Capture Forms
 */
function initContactForms() {
  const contactForm = document.getElementById('sos-contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());
      
      showFormSubmitSuccess(contactForm, data);
    });
  }

  const inquiryForms = document.querySelectorAll('.package-inquiry-form');
  inquiryForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const parentCard = form.closest('.package-card');
      const title = parentCard ? parentCard.querySelector('.package-title').innerText : 'Tour Package';
      
      alert(`Thank you for your inquiry about "${title}"! Our travel specialists will contact you shortly.`);
      form.reset();
    });
  });
}

function showFormSubmitSuccess(form, data) {
  const leads = JSON.parse(localStorage.getItem('sos_travel_leads') || '[]');
  data.timestamp = new Date().toISOString();
  leads.push(data);
  localStorage.setItem('sos_travel_leads', JSON.stringify(leads));

  const originalHTML = form.innerHTML;
  
  form.style.opacity = '0';
  setTimeout(() => {
    form.innerHTML = `
      <div class="text-center" style="padding: 40px 20px; animation: fadeIn 0.5s forwards;">
        <div style="font-size: 4rem; color: #25D366; margin-bottom: 20px;">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3 style="font-size: 1.5rem; margin-bottom: 12px; color: #0B192C;">Consultation Requested!</h3>
        <p style="color: #64748B; margin-bottom: 30px; max-width: 400px; margin-left: auto; margin-right: auto;">
          Thank you for choosing <strong>Shankar Travel Agency</strong>. We have received your inquiry. A travel specialist will contact you shortly to plan your custom trip.
        </p>
        <button type="button" class="btn btn-outline-dark" id="btn-reset-form">Send Another Inquiry</button>
      </div>
    `;
    form.style.opacity = '1';
    
    document.getElementById('btn-reset-form').addEventListener('click', () => {
      form.innerHTML = originalHTML;
      initContactForms();
    });
  }, 300);
}

/**
 * 5. Floating WhatsApp Widget
 */
function initWhatsAppWidget() {
  const widget = document.getElementById('whatsapp-widget');
  if (!widget) return;

  widget.addEventListener('click', () => {
    const phoneNumber = '919999999999'; 
    const message = encodeURIComponent("Hello Shankar Travel Agency! I'd like to plan a custom vacation package.");
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  });
}
