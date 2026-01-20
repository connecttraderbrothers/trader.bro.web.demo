// ===== Wait for DOM to be fully loaded =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== DOM Elements =====
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('nav a');

    // ===== Mobile Navigation =====
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !hamburger.contains(e.target) && nav.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ===== Smooth Scrolling =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (!target) return;
            
            const headerHeight = header ? header.offsetHeight : 0;
            // Add extra offset so section headers appear properly at top
            const extraOffset = 40;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;
            
            // Use smooth easing animation
            smoothScrollTo(targetPosition, 1200);
        });
    });

    // Custom smooth scroll function with easing
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function easeInOutCubic(t) {
            return t < 0.5 
                ? 4 * t * t * t 
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + distance * easedProgress);
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // ===== Header Scroll Effect =====
    if (header) {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScroll = currentScroll;
        });
    }

    // ===== Image Slider =====
    const slider = document.querySelector('.slider');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const currentDisplay = document.querySelector('.slider-progress .current');
    const progressFill = document.querySelector('.progress-fill');

    if (slider && slides.length > 0) {
        let currentSlide = 0;
        const totalSlides = slides.length;
        let autoSlideInterval;
        let isTransitioning = false;

        function updateSlider(animate = true) {
            if (animate) {
                slider.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            } else {
                slider.style.transition = 'none';
            }
            
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            // Update counter
            if (currentDisplay) {
                currentDisplay.textContent = String(currentSlide + 1).padStart(2, '0');
            }
            
            // Update progress bar
            if (progressFill) {
                const progressWidth = ((currentSlide + 1) / totalSlides) * 100;
                progressFill.style.width = `${progressWidth}%`;
            }
        }

        function nextSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
            
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }

        function prevSlide() {
            if (isTransitioning) return;
            isTransitioning = true;
            
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
            
            setTimeout(() => {
                isTransitioning = false;
            }, 800);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 6000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Touch/Swipe Support
        let touchStartX = 0;
        let touchEndX = 0;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                resetAutoSlide();
            }
        }

        // Initialize slider
        updateSlider(false);
        startAutoSlide();
    }

    // ===== Form Handling =====
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const phoneInput = this.querySelector('#phone');
            const messageInput = this.querySelector('#message');
            
            const name = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const phone = phoneInput ? phoneInput.value : '';
            const message = messageInput ? messageInput.value : '';
            
            const formData = {
                name: name,
                email: email,
                phone: phone,
                message: message,
                timestamp: new Date().toISOString()
            };
            
            const submitBtn = this.querySelector('.submit-btn');
            if (!submitBtn) return;
            
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('https://hook.eu2.make.com/p1fsaraq9wbclc2cvqtasoq8btj9e133', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                if (response.ok) {
                    submitBtn.innerHTML = '<span>Message Sent!</span>';
                    submitBtn.style.background = '#27ae60';
                    this.reset();
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.innerHTML = '<span>Error - Try Again</span>';
                submitBtn.style.background = '#e74c3c';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }
        });
    }

    // ===== Intersection Observer for Animations =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .review-card, .stat').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });

    // Add in-view styles
    const style = document.createElement('style');
    style.textContent = `
        .in-view {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Stagger animation for grid items
    document.querySelectorAll('.about-grid, .reviews-grid, .stats-row').forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.15}s`;
        });
    });

    // ===== Prevent iOS zoom on form inputs =====
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('focus', () => {
                if (window.innerWidth <= 768) {
                    viewportMeta.setAttribute(
                        'content',
                        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
                    );
                }
            });
            
            input.addEventListener('blur', () => {
                viewportMeta.setAttribute(
                    'content',
                    'width=device-width, initial-scale=1.0'
                );
            });
        });
    }

});
