(function() {
    'use strict';

    const nameElement = document.getElementById('typewriter-target');
    const fullName = 'Zyrus Batoy';

    function typewriter(element, text, speed = 100, delay = 500) {
        return new Promise(resolve => {
            setTimeout(() => {
                let i = 0;
                element.textContent = '';

                function type() {
                    if (i < text.length) {
                        element.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, speed);
                    } else {
                        resolve();
                    }
                }
                type();
            }, delay);
        });
    }

    function eraseWriter(element, speed = 50) {
        return new Promise(resolve => {
            const text = element.textContent;
            let i = text.length;

            function erase() {
                if (i > 0) {
                    element.textContent = text.slice(0, i - 1);
                    i--;
                    setTimeout(erase, speed);
                } else {
                    resolve();
                }
            }
            erase();
        });
    }

    async function runTypewriterLoop() {
        while (true) {
            await typewriter(nameElement, fullName, 120, 800);
            await new Promise(r => setTimeout(r, 2000));
            await eraseWriter(nameElement, 60);
            await new Promise(r => setTimeout(r, 500));
        }
    }

    if (nameElement && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        runTypewriterLoop();
    } else if (nameElement) {
        nameElement.textContent = fullName;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.glass-card, .learning__item, .contact__link, .project-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(event) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                event.preventDefault();
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                target.focus({ preventScroll: true });
            }
        });
    });

    let ticking = false;
    const hero = document.querySelector('.hero');
    const scrollIndicator = document.querySelector('.hero__scroll-indicator');

    function handleScroll() {
        if (!hero || !scrollIndicator) return;

        const heroBottom = hero.getBoundingClientRect().bottom;
        const viewportHeight = window.innerHeight;

        if (heroBottom < viewportHeight * 0.5) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
        } else {
            scrollIndicator.style.opacity = '0.6';
            scrollIndicator.style.pointerEvents = 'auto';
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });
})();
