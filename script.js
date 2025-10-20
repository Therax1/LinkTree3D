// Animation au chargement
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter une classe pour indiquer que le chargement est terminé
    document.body.classList.add('loaded');

    // Effet de parallaxe au survol de la carte
    const card = document.querySelector('.card');
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });

    // Smooth transition pour la carte
    card.style.transition = 'transform 0.3s ease-out';

    // Animation des liens au clic
    const socialLinks = document.querySelectorAll('.card__social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Effet de ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            link.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Compteur animé pour les statistiques
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (target === 500 ? '+' : target === 50 ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (target >= 50 ? '+' : '');
            }
        }, 16);
    };

    // Observer pour détecter quand les stats sont visibles
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = document.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    const target = parseInt(stat.textContent);
                    setTimeout(() => {
                        animateCounter(stat, target, 1500);
                    }, index * 100);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const stats = document.querySelector('.stats');
    if (stats) {
        statsObserver.observe(stats);
    }

    // Effet de typing pour le badge de disponibilité (optionnel)
    const badge = document.querySelector('.availability-badge');
    if (badge) {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'scale(1.05) translateY(-2px)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'scale(1) translateY(0)';
        });
        
        badge.style.transition = 'transform 0.3s ease';
    }

    // Ajout de particules au survol de l'image
    const imageContainer = document.querySelector('.card__image-container');
    
    imageContainer.addEventListener('click', () => {
        // Créer des particules qui s'échappent
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--primary);
                border-radius: 50%;
                pointer-events: none;
                animation: particleBurst 0.8s ease-out forwards;
            `;
            
            const angle = (360 / 8) * i;
            particle.style.setProperty('--angle', `${angle}deg`);
            
            imageContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 800);
        }
    });

    // Ajouter l'animation CSS pour les particules
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes particleBurst {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(
                        calc(cos(var(--angle)) * 50px),
                        calc(sin(var(--angle)) * 50px)
                    ) scale(0);
                    opacity: 0;
                }
            }
            
            .ripple {
                position: absolute;
                width: 20px;
                height: 20px;
                background: rgba(255, 255, 255, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: rippleEffect 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes rippleEffect {
                0% {
                    transform: translate(-50%, -50%) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(10);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Easter egg : Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
    
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);
        
        if (konamiCode.join(',') === konamiSequence.join(',')) {
            activateEasterEgg();
        }
    });

    function activateEasterEgg() {
        card.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            card.style.animation = '';
        }, 2000);
        
        // Ajouter l'animation rainbow
        if (!document.getElementById('rainbow-animation')) {
            const style = document.createElement('style');
            style.id = 'rainbow-animation';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Performance : réduire les animations si demandé
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }

    console.log('🚀 Linktree amélioré chargé avec succès!');
    console.log('💡 Astuce: Essayez le Konami Code! ↑↑↓↓←→←→BA');
});
