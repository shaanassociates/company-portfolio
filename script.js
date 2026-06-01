document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Sticky Header with Glassmorphism
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for sticky header height
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Service Modals
    const serviceCards = document.querySelectorAll('.service-card');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    const serviceDetails = {
        'pf': { title: 'Employees Provident Fund (PF)', text: '<p>Our comprehensive PF services include initial registration, monthly remittance calculations, processing of withdrawals and transfers, handling inspections, and complete compliance management.</p>' },
        'esi': { title: 'Employee State Insurance (ESI)', text: '<p>We handle ESI registration, employee enrollments (TIC/PIC generation), monthly contribution filing, half-yearly returns, and assist with employee claims and accident reports.</p>' },
        'pt': { title: 'Professional Tax (PT)', text: '<p>Services include employer registration, accurate slab-based calculation, monthly/half-yearly remittance, and liaisoning with the Commercial Tax Department.</p>' },
        'lwf': { title: 'Labour Welfare Fund (LWF)', text: '<p>We ensure compliance with the Tamil Nadu LWF Act, including calculation of employer and employee contributions and timely annual remittance.</p>' },
        'se': { title: 'Shops & Establishment Act', text: '<p>We manage new registrations, renewals, display of statutory notices, maintenance of required registers, and compliance with working hour regulations.</p>' },
        'nfsh': { title: 'TN-NFSH Act', text: '<p>End-to-end management of National and Festival Holidays compliance, including filing of Form V and drafting holiday lists for approval.</p>' },
        'clra': { title: 'Contract Labour (CLRA)', text: '<p>Expert assistance with obtaining Principal Employer Registration, contractor licenses, filing of annual returns, and maintaining contractor registers.</p>' }
    };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.getAttribute('data-service');
            if (serviceDetails[serviceId]) {
                modalTitle.textContent = serviceDetails[serviceId].title;
                modalBody.innerHTML = serviceDetails[serviceId].text;
                modalOverlay.classList.add('active');
            }
        });
    });

    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // 6. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 7. Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtnText = document.getElementById('submitBtnText');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            formStatus.style.display = 'block';
            formStatus.style.color = 'var(--text-muted)';
            formStatus.textContent = 'Sending message...';
            
            const originalText = submitBtnText.textContent;
            submitBtnText.textContent = 'Sending...';

            const formData = new FormData(this);



            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formStatus.style.color = '#28a745'; // Green color for success
                    formStatus.textContent = data.message;
                    contactForm.reset();
                } else {
                    formStatus.style.color = '#dc3545'; // Red color for error
                    formStatus.textContent = data.message;
                }
            })
            .catch(error => {
                formStatus.style.color = '#dc3545';
                formStatus.textContent = 'An error occurred while sending the message. Please try again later.';
                console.error('Error:', error);
            })
            .finally(() => {
                submitBtnText.textContent = originalText;
            });
        });
    }
});
