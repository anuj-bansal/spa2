import './style.css'

// Dental Practice SPA JavaScript
document.addEventListener('DOMContentLoaded', function() {
  
  // Navigation functionality
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const scrollProgress = document.getElementById('scroll-progress');

  // Mobile menu toggle
  mobileToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      // Also close any open submenus
      document.querySelectorAll('.nav-item-with-submenu').forEach(item => {
        item.classList.remove('active');
      });
    });
  });

  // Enhanced submenu handling for desktop and mobile
  document.querySelectorAll('.nav-item-with-submenu').forEach(item => {
    const submenuLink = item.querySelector('.nav-link');
    const submenu = item.querySelector('.submenu');
    
    // Desktop hover behavior
    item.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) {
        item.classList.add('active');
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        item.classList.remove('active');
      }
    });
    
    // Mobile click behavior
    submenuLink.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close other submenus
        document.querySelectorAll('.nav-item-with-submenu').forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current submenu
        item.classList.toggle('active');
      }
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Update active navigation link based on scroll position
  function updateActiveNavigation() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Update scroll progress indicator
  function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
  }

  // Add scroll event listeners
  window.addEventListener('scroll', () => {
    updateActiveNavigation();
    updateScrollProgress();
  });

  // Patient form submission
  const patientForm = document.getElementById('patient-form');
  if (patientForm) {
    patientForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(this);
      const patientData = {};
      for (let [key, value] of formData.entries()) {
        patientData[key] = value;
      }
      
      // Simulate form submission
      alert('Thank you! Your patient form has been submitted successfully. We will contact you soon to schedule your appointment.');
      
      // Reset form
      this.reset();
      
      console.log('Patient form data:', patientData);
    });
  }

  // Patient referral form submission
  const referralForm = document.getElementById('patient-referral-form');
  if (referralForm) {
    referralForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate CAPTCHA first
      if (!validateReferralCaptcha()) {
        alert('Please solve the math problem correctly to verify you are human.');
        generateReferralCaptcha(); // Generate a new CAPTCHA
        return;
      }
      
      // Get submit button and show submitted state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitted ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = '#27ae60';
      
      // Get form data
      const formData = new FormData(this);
      const referralData = {};
      for (let [key, value] of formData.entries()) {
        referralData[key] = value;
      }
      
      // Create email content
      const emailSubject = encodeURIComponent('Patient Referral - Issaquah Kids Dentistry');
      const emailBody = encodeURIComponent(`
New Patient Referral Submission:

Referring Patient Information:
- Name: ${referralData['referral-patient-name']}
- Phone: ${referralData['referral-phone']}

Patient Being Referred:
- Name: ${referralData['referring-patient-name']}
- Phone: ${referralData['referring-patient-phone']}

Please follow up with both the referring patient and the new patient.

Thank you,
Website Referral System
      `);
      
      // Create mailto link
      const mailtoLink = `mailto:office@IssaquahKidsDentistry.com?subject=${emailSubject}&body=${emailBody}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      alert('Thank you for the referral! Your email client will open to send the referral details to our office.');
      
      // Reset form and button after delay
      setTimeout(() => {
        this.reset();
        generateReferralCaptcha();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 2000);
      
      console.log('Referral form data:', referralData);
    });
  }

  // Records request form submission
  const recordsForm = document.getElementById('records-request-form');
  if (recordsForm) {
    recordsForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate CAPTCHA first
      if (!validateCaptcha()) {
        alert('Please solve the math problem correctly to verify you are human.');
        generateCaptcha(); // Generate a new CAPTCHA
        return;
      }
      
      // Get submit button and show submitted state
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitted ✓';
      submitBtn.disabled = true;
      submitBtn.style.background = '#27ae60';
      
      // Get form data
      const formData = new FormData(this);
      const recordsData = {};
      for (let [key, value] of formData.entries()) {
        recordsData[key] = value;
      }
      
      // Create email content
      const emailSubject = encodeURIComponent('Records Request - Issaquah Kids Dentistry');
      const emailBody = encodeURIComponent(`
Records Request Submission:

Patient Information:
- Patient Name: ${recordsData['records-patient-name']}
- Parent/Guardian: ${recordsData['records-parent-name']}
- Date of Birth: ${recordsData['records-patient-dob']}
- Contact Phone: ${recordsData['records-contact-phone']}
- Email: ${recordsData['records-email']}

Request Details:
- Reason for Request: ${recordsData['records-reason'] || 'Not specified'}

Please process this records request at your earliest convenience.

Thank you,
Website Records Request System
      `);
      
      // Create mailto link
      const mailtoLink = `mailto:office@IssaquahKidsDentistry.com?subject=${emailSubject}&body=${emailBody}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Show success message
      alert('Thank you! Your records request has been submitted. Your email client will open to send the request details to our office. We will process your request and contact you soon.');
      
      // Reset form and button after delay
      setTimeout(() => {
        this.reset();
        generateCaptcha();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 2000);
      
      console.log('Records request data:', recordsData);
    });
  }

  // CAPTCHA functionality
  let currentCaptchaAnswer = 0;

  function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question, answer;
    
    switch(operation) {
      case '+':
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case '-':
        // Ensure positive result
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        question = `${larger} - ${smaller}`;
        answer = larger - smaller;
        break;
      case '*':
        // Use smaller numbers for multiplication
        const smallNum1 = Math.floor(Math.random() * 10) + 1;
        const smallNum2 = Math.floor(Math.random() * 10) + 1;
        question = `${smallNum1} × ${smallNum2}`;
        answer = smallNum1 * smallNum2;
        break;
    }
    
    currentCaptchaAnswer = answer;
    const questionElement = document.getElementById('captcha-question');
    if (questionElement) {
      questionElement.textContent = question;
    }
    
    // Clear the answer field
    const answerElement = document.getElementById('captcha-answer');
    if (answerElement) {
      answerElement.value = '';
    }
  }

  function validateCaptcha() {
    const userAnswer = parseInt(document.getElementById('captcha-answer').value);
    return userAnswer === currentCaptchaAnswer;
  }

  // Referral CAPTCHA functionality
  let currentReferralCaptchaAnswer = 0;

  function generateReferralCaptcha() {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let question, answer;
    
    switch(operation) {
      case '+':
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
        break;
      case '-':
        // Ensure positive result
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        question = `${larger} - ${smaller}`;
        answer = larger - smaller;
        break;
      case '*':
        // Use smaller numbers for multiplication
        const smallNum1 = Math.floor(Math.random() * 10) + 1;
        const smallNum2 = Math.floor(Math.random() * 10) + 1;
        question = `${smallNum1} × ${smallNum2}`;
        answer = smallNum1 * smallNum2;
        break;
    }
    
    currentReferralCaptchaAnswer = answer;
    const questionElement = document.getElementById('referral-captcha-question');
    if (questionElement) {
      questionElement.textContent = question;
    }
    
    // Clear the answer field
    const answerElement = document.getElementById('referral-captcha-answer');
    if (answerElement) {
      answerElement.value = '';
    }
  }

  function validateReferralCaptcha() {
    const userAnswer = parseInt(document.getElementById('referral-captcha-answer').value);
    return userAnswer === currentReferralCaptchaAnswer;
  }

  // Initialize CAPTCHA when page loads
  generateCaptcha();
  generateReferralCaptcha();

  // Refresh CAPTCHA button
  const refreshCaptchaBtn = document.getElementById('refresh-captcha');
  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener('click', generateCaptcha);
  }

  // Refresh referral CAPTCHA button
  const refreshReferralCaptchaBtn = document.getElementById('refresh-referral-captcha');
  if (refreshReferralCaptchaBtn) {
    refreshReferralCaptchaBtn.addEventListener('click', generateReferralCaptcha);
  }

  // Add fade-in animation to elements when they come into view
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
      }
    });
  }, observerOptions);

  // Observe all service cards and team members
  document.querySelectorAll('.service-card, .team-member, .contact-card').forEach(el => {
    observer.observe(el);
  });

  // Initialize scroll progress on page load
  updateScrollProgress();
  updateActiveNavigation();
});
