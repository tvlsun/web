// ============================================
// PARTICLES BACKGROUND
// ============================================
function createParticles() {
    const container = document.getElementById('particles-container');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            opacity: ${Math.random() * 0.5 + 0.2};
            animation: floatParticle ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        container.appendChild(particle);
    }
    
    // Add CSS animation for particles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(90deg);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 + 50}px) rotate(180deg);
            }
            75% {
                transform: translate(${Math.random() * 100 + 50}px, ${Math.random() * 100 - 50}px) rotate(270deg);
            }
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// QUOTE CAROUSEL
// ============================================
let currentQuote = 0;
let quoteInterval;

function showQuote(index) {
    const quotes = document.querySelectorAll('.quote-card');
    const indicators = document.querySelectorAll('.indicator');
    
    // Remove active class from all
    quotes.forEach(quote => quote.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Add active class to current
    quotes[index].classList.add('active');
    indicators[index].classList.add('active');
}

function nextQuote() {
    const quotes = document.querySelectorAll('.quote-card');
    currentQuote = (currentQuote + 1) % quotes.length;
    showQuote(currentQuote);
}

function startQuoteCarousel() {
    quoteInterval = setInterval(nextQuote, 5000); // Change every 5 seconds
}

function stopQuoteCarousel() {
    clearInterval(quoteInterval);
}

// Manual quote navigation
function initQuoteIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopQuoteCarousel();
            currentQuote = index;
            showQuote(currentQuote);
            startQuoteCarousel();
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const words = ['Metaverse', 'Blockchain', 'Web3', 'GameFi', 'NFTs'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }
        
        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
    }
    
    type();
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function initStatsCounter() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const finalNumber = parseInt(statNumber.textContent);
                let currentNumber = 0;
                const increment = finalNumber / 50;
                
                const counter = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        statNumber.textContent = finalNumber + '+';
                        clearInterval(counter);
                    } else {
                        statNumber.textContent = Math.floor(currentNumber) + '+';
                    }
                }, 30);
                
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat-item').forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ============================================
// 3D TILT EFFECT FOR CARDS
// ============================================
function init3DTilt() {
    const cards = document.querySelectorAll('.social-card, .profile-card, .stat-item');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// INITIALIZE ALL
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initTypingEffect();
    initStatsCounter();
    init3DTilt();
    
    // Start quote carousel
    showQuote(0);
    startQuoteCarousel();
    initQuoteIndicators();
    
    // Pause carousel when user hovers over quotes
    const quotesSection = document.querySelector('.quotes-carousel');
    if (quotesSection) {
        quotesSection.addEventListener('mouseenter', stopQuoteCarousel);
        quotesSection.addEventListener('mouseleave', startQuoteCarousel);
    }
});

// ============================================
// EASTER EGG: Console Message
// ============================================
console.log('%c🎮 Welcome to the Web3 Gaming Revolution! 🚀', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with passion for the decentralized future.', 'color: #764ba2; font-size: 14px;');
