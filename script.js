// ===== Wait for DOM to be fully loaded =====
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== Loading Screen =====
    const loadingScreen = document.getElementById('loadingScreen');
    
    document.body.classList.add('loading');
    
    // Hide loading screen after animation completes
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.classList.remove('loading');
        
        // Trigger hero text reveal after loading
        setTimeout(() => {
            document.querySelectorAll('.hero-content .text-reveal').forEach(el => {
                el.classList.add('revealed');
            });
        }, 300);
    }, 2200);

    // ===== DOM Elements =====
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('nav a');

    // ===== Custom Cursor =====
    const cursor = document.getElementById('customCursor');
    const follower = document.getElementById('cursorFollower');
    
    if (cursor && follower && window.innerWidth > 1024) {
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor animation
        function animateCursor() {
            cursorX = mouseX;
            cursorY = mouseY;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            follower.style.left = followerX + 'px';
            follower.style.top = followerY + 'px';
            
            requestAnimationFrame(animateCursor);
        }
        animateCursor();
        
        // Cursor hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, .slide img, .magnetic-btn');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovering');
                follower.classList.add('hovering');
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovering');
                follower.classList.remove('hovering');
            });
        });
        
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            follower.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            follower.style.opacity = '1';
        });
    }

    // ===== Magnetic Buttons =====
    const magneticButtons = document.querySelectorAll('.magnetic-btn');
    
    if (window.innerWidth > 1024) {
        magneticButtons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ===== Parallax Effect =====
    const heroParallax = document.getElementById('heroParallax');
    
    if (heroParallax) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = document.getElementById('home').offsetHeight;
            
            if (scrolled < heroHeight) {
                heroParallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }

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
            const extraOffset = 40;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - extraOffset;
            
            smoothScrollTo(targetPosition, 1200);
        });
    });

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
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ===== Floating Contact Button =====
    const floatingCta = document.getElementById('floatingCta');
    const homeSection = document.getElementById('home');
    const contactSection = document.getElementById('contact');
    
    if (floatingCta && homeSection && contactSection) {
        window.addEventListener('scroll', () => {
            const homeBottom = homeSection.offsetTop + homeSection.offsetHeight;
            const contactTop = contactSection.offsetTop;
            const scrollPosition = window.pageYOffset + window.innerHeight;
            
            if (window.pageYOffset > homeBottom - 200) {
                floatingCta.classList.add('visible');
            } else {
                floatingCta.classList.remove('visible');
            }
            
            if (scrollPosition > contactTop + 200) {
                floatingCta.classList.add('at-contact');
            } else {
                floatingCta.classList.remove('at-contact');
            }
        });
    }

    // ===== Lightbox =====
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    if (lightbox && lightboxImage && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                lightboxImage.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
        
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
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
            
            if (currentDisplay) {
                currentDisplay.textContent = String(currentSlide + 1).padStart(2, '0');
            }
            
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

    // ===== Text Reveal Animation =====
    const textRevealElements = document.querySelectorAll('.text-reveal:not(.hero-content .text-reveal)');
    
    const textRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                textRevealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    textRevealElements.forEach(el => {
        textRevealObserver.observe(el);
    });

    // ===== Intersection Observer for Card Animations =====
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

    document.querySelectorAll('.about-card, .review-card, .stat, .service-card').forEach(el => {
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
    document.querySelectorAll('.about-grid, .reviews-grid, .stats-row, .services-grid').forEach(grid => {
        const items = grid.children;
        Array.from(items).forEach((item, index) => {
            item.style.transitionDelay = `${index * 0.1}s`;
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
