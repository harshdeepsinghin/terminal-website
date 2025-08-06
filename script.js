// Animated Title Effect - Fast Random Font Shuffle
class AnimatedTitle {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        
        this.originalText = this.element.textContent;
        this.fonts = [
            'Press Start 2P',
            'Fira Code',
            'Fira Mono',
            'JetBrains Mono',
            'Source Code Pro',
            'Ubuntu Mono'
        ];
        this.colors = ['#00ff00', '#ffffff', '#64b5f6', '#77befc', '#ccc', '#aaa'];
        this.isAnimating = false;
        this.letterTimers = [];
        this.init();
    }

    init() {
        // Start animation immediately when website loads
        this.startAnimation();
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const letters = this.originalText.split('');
        
        // Initialize each letter with its own container
        this.element.innerHTML = letters.map((letter, index) => {
            if (letter === ' ') return '<span class="letter-space"> </span>';
            return `<span class="letter-block" id="letter-${index}" style="font-family: 'Press Start 2P', cursive; color: var(--accent-green);">${letter}</span>`;
        }).join('');

        // Start individual timers for each letter
        letters.forEach((letter, index) => {
            if (letter === ' ') return;
            
            const animateLetter = () => {
                const letterElement = document.getElementById(`letter-${index}`);
                if (!letterElement) return;
                
                // 30% chance for each letter to change (smooth activity)
                if (Math.random() < 0.3) {
                    const randomFont = this.fonts[Math.floor(Math.random() * this.fonts.length)];
                    const randomColor = this.colors[Math.floor(Math.random() * this.colors.length)];
                    
                    letterElement.style.fontFamily = `'${randomFont}', monospace`;
                    letterElement.style.color = randomColor;
                    letterElement.style.textShadow = `0 0 5px ${randomColor}`;
                } else {
                    // Reset to original style
                    letterElement.style.fontFamily = "'Press Start 2P', cursive";
                    letterElement.style.color = 'var(--accent-green)';
                    letterElement.style.textShadow = 'var(--glow-green)';
                }
                
                // Uniform speed for all letters (300ms - smooth and consistent)
                const uniformSpeed = 300;
                this.letterTimers[index] = setTimeout(animateLetter, uniformSpeed);
            };
            
            // Start each letter with a random initial delay
            const initialDelay = Math.random() * 100;
            setTimeout(animateLetter, initialDelay);
        });
    }

    resetToOriginal() {
        // Smooth transition back to original
        const letters = this.originalText.split('');
        const originalHTML = letters.map(letter => {
            if (letter === ' ') return ' ';
            return `<span style="font-family: 'Press Start 2P', cursive; color: var(--accent-green); text-shadow: var(--glow-green-strong); transition: all 0.3s ease;">${letter}</span>`;
        }).join('');
        
        this.element.innerHTML = originalHTML;
    }

    getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?~/\\';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    destroy() {
        // Clear all individual letter timers
        this.letterTimers.forEach(timer => {
            if (timer) clearTimeout(timer);
        });
        this.letterTimers = [];
        this.isAnimating = false;
    }
}

// Smooth scrolling for navigation links
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Handle any anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 100; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Intersection Observer for section animations
class SectionAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, this.observerOptions);

        // Observe all content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(section);
        });
    }
}

// Performance monitoring for animations
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.init();
    }

    init() {
        // Monitor FPS and adjust animations if needed
        const checkPerformance = () => {
            this.frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = this.frameCount;
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                // If FPS drops below 30, reduce animation frequency
                if (this.fps < 30) {
                    console.warn('Low FPS detected, reducing animation frequency');
                    // Could implement animation throttling here
                }
            }
            
            requestAnimationFrame(checkPerformance);
        };
        
        requestAnimationFrame(checkPerformance);
    }
}

// Accessibility support
class AccessibilitySupport {
    constructor() {
        this.init();
    }

    init() {
        // Respect prefers-reduced-motion
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--animation-duration', '0s');
            
            // Disable the animated title
            const animatedTitle = document.getElementById('animated-title');
            if (animatedTitle) {
                animatedTitle.style.animation = 'none';
            }
        }

        // Add keyboard navigation support
        this.addKeyboardSupport();
    }

    addKeyboardSupport() {
        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            .sidebar-nav a:focus {
                outline: 2px solid var(--accent-green);
                outline-offset: 2px;
            }
            
            .btn:focus {
                outline: 2px solid var(--accent-green);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);

        // Skip link removed as requested
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize animated title
    const animatedTitle = new AnimatedTitle('animated-title');
    
    // Initialize smooth scrolling
    new SmoothScroll();
    
    // Initialize section animations
    new SectionAnimations();
    
    // Initialize performance monitoring
    new PerformanceMonitor();
    
    // Initialize accessibility support
    new AccessibilitySupport();
    
    // Add main content ID for skip link
    const mainSections = document.querySelector('.main-sections');
    if (mainSections) {
        mainSections.id = 'main-sections';
    }
    
    // Console welcome message
    console.log(`
    ╔══════════════════════════════════════╗
    ║          Welcome to LinuxWale!       ║
    ║                                      ║
    ║  🐧 We love penguins                 ║
    ║  🚪 Why windows, when we have doors? ║
    ║                                      ║
    ║  Join our Linux community today!     ║
    ╚══════════════════════════════════════╝
    `);
});