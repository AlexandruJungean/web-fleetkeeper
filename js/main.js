/**
 * FleetKeeper Website - Main JavaScript
 * Handles navigation, cookie consent, FAQ accordion, language switching, and other interactions
 */

(function() {
    'use strict';

    // ==========================================================================
    // Configuration
    // ==========================================================================
    const SUPPORTED_LANGUAGES = ['en', 'ro', 'de', 'hu', 'pl', 'fr', 'es', 'it', 'pt', 'nl', 'bg', 'cs'];
    const DEFAULT_LANGUAGE = 'en';
    let currentTranslations = {};
    let currentLang = DEFAULT_LANGUAGE;

    // ==========================================================================
    // DOM Ready
    // ==========================================================================
    document.addEventListener('DOMContentLoaded', function() {
        initLanguage();
        initNavigation();
        initCookieConsent();
        initFAQ();
        initSmoothScroll();
        initHeaderScroll();
        initLanguageSelector();
    });

    // ==========================================================================
    // Language System
    // ==========================================================================
    async function initLanguage() {
        // Determine initial language
        const savedLang = localStorage.getItem('fleetkeeper_lang');
        const browserLang = navigator.language?.split('-')[0];
        const urlLang = new URLSearchParams(window.location.search).get('lang');
        
        // Priority: URL > Saved > Browser > Default
        if (urlLang && SUPPORTED_LANGUAGES.includes(urlLang)) {
            currentLang = urlLang;
        } else if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
            currentLang = savedLang;
        } else if (browserLang && SUPPORTED_LANGUAGES.includes(browserLang)) {
            currentLang = browserLang;
        } else {
            currentLang = DEFAULT_LANGUAGE;
        }
        
        await loadTranslations(currentLang);
        applyTranslations();
        updateLanguageSelector();
    }

    async function loadTranslations(lang) {
        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (response.ok) {
                currentTranslations = await response.json();
                localStorage.setItem('fleetkeeper_lang', lang);
                document.documentElement.lang = lang;
            } else {
                // Fallback to English
                if (lang !== DEFAULT_LANGUAGE) {
                    await loadTranslations(DEFAULT_LANGUAGE);
                }
            }
        } catch (error) {
            console.warn('Failed to load translations:', error);
            if (lang !== DEFAULT_LANGUAGE) {
                await loadTranslations(DEFAULT_LANGUAGE);
            }
        }
    }

    async function changeLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) return;
        currentLang = lang;
        await loadTranslations(lang);
        applyTranslations();
        updateLanguageSelector();
    }

    function applyTranslations() {
        if (!currentTranslations || Object.keys(currentTranslations).length === 0) return;
        
        // Apply translations to elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(function(el) {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(key);
            if (translation) {
                el.textContent = translation;
            }
        });
        
        // Apply translations to elements with data-i18n-placeholder
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
            const key = el.getAttribute('data-i18n-placeholder');
            const translation = getNestedTranslation(key);
            if (translation) {
                el.placeholder = translation;
            }
        });
        
        // Apply translations to elements with data-i18n-title
        document.querySelectorAll('[data-i18n-title]').forEach(function(el) {
            const key = el.getAttribute('data-i18n-title');
            const translation = getNestedTranslation(key);
            if (translation) {
                el.title = translation;
            }
        });
        
        // Update page title
        if (currentTranslations.meta?.title) {
            document.title = currentTranslations.meta.title;
        }
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && currentTranslations.meta?.description) {
            metaDesc.content = currentTranslations.meta.description;
        }
    }

    function getNestedTranslation(key) {
        return key.split('.').reduce(function(obj, k) {
            return obj && obj[k];
        }, currentTranslations);
    }

    function initLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (!selector) return;
        
        selector.addEventListener('change', function(e) {
            changeLanguage(e.target.value);
        });
    }

    function updateLanguageSelector() {
        const selector = document.getElementById('language-selector');
        if (selector) {
            selector.value = currentLang;
        }
        
        // Update current language display
        const currentLangDisplay = document.getElementById('current-lang');
        if (currentLangDisplay && currentTranslations.langName) {
            currentLangDisplay.textContent = currentTranslations.langName;
        }
    }

    // Expose for external use
    window.FleetKeeperI18n = {
        changeLanguage: changeLanguage,
        getCurrentLang: function() { return currentLang; },
        getTranslation: getNestedTranslation,
        getSupportedLanguages: function() { return SUPPORTED_LANGUAGES; }
    };

    // ==========================================================================
    // Navigation
    // ==========================================================================
    function initNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (!navToggle || !navMenu) return;

        // Toggle mobile menu
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ==========================================================================
    // Header Scroll Effect
    // ==========================================================================
    function initHeaderScroll() {
        const header = document.getElementById('header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;

            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // ==========================================================================
    // Smooth Scroll
    // ==========================================================================
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');

        links.forEach(function(link) {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==========================================================================
    // Cookie Consent
    // ==========================================================================
    function initCookieConsent() {
        const banner = document.getElementById('cookie-consent');
        const acceptBtn = document.getElementById('cookie-accept');
        const essentialBtn = document.getElementById('cookie-essential');

        if (!banner) return;

        // Check if user has already made a choice
        const consent = getCookie('cookie_consent');
        if (!consent) {
            // Show banner after a short delay
            setTimeout(function() {
                banner.style.display = 'block';
            }, 1000);
        }

        // Accept all cookies
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                setCookie('cookie_consent', 'all', 365);
                banner.style.display = 'none';
                // Initialize analytics here if needed
                // initAnalytics();
            });
        }

        // Accept only essential cookies
        if (essentialBtn) {
            essentialBtn.addEventListener('click', function() {
                setCookie('cookie_consent', 'essential', 365);
                banner.style.display = 'none';
            });
        }
    }

    // Cookie helper functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
    }

    function getCookie(name) {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // ==========================================================================
    // FAQ Accordion
    // ==========================================================================
    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(function(item) {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', function() {
                    // Close other items
                    faqItems.forEach(function(otherItem) {
                        if (otherItem !== item && otherItem.classList.contains('active')) {
                            otherItem.classList.remove('active');
                        }
                    });

                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
    }

    // ==========================================================================
    // Analytics (placeholder - implement when needed)
    // ==========================================================================
    function initAnalytics() {
        // Only initialize if user has accepted all cookies
        const consent = getCookie('cookie_consent');
        if (consent !== 'all') return;

        // Google Analytics initialization would go here
        // Example:
        // window.dataLayer = window.dataLayer || [];
        // function gtag(){dataLayer.push(arguments);}
        // gtag('js', new Date());
        // gtag('config', 'GA_MEASUREMENT_ID');
    }

    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(function() {
                    inThrottle = false;
                }, limit);
            }
        };
    }

})();
