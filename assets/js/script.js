/* ==============================================
   GLOBAL NEWS NETWORK - MAIN JAVASCRIPT
   Common functionality for all webpages
   ============================================== */

$(document).ready(function () {
    // ========== GLOBAL INITIALIZATION ==========
    initGlobalComponents();
    initEventListeners();

    // ========== CORE FUNCTIONALITIES ==========

    /**
     * Initialize all global components
     */
    function initGlobalComponents() {
        // Sticky Navigation
        initStickyNav();

        // Breaking News Ticker
        initBreakingNewsTicker();

        // Mobile Menu
        initMobileMenu();

        // Search Functionality
        initSearch();

        // News Card Interactions
        initNewsCards();

        // Video Player
        initVideoPlayer();

        // Newsletter Form
        initNewsletter();

        // Lazy Loading
        initLazyLoading();

        // Smooth Scrolling
        initSmoothScrolling();

        // Tooltips
        initTooltips();

        // Back to Top Button
        initBackToTop();

        // Theme Toggle
        initThemeToggle();

        // Initialize page-specific features
        initPageSpecific();
    }

    /**
     * Initialize event listeners
     */
    function initEventListeners() {
        // Window resize handling
        $(window).on('resize', debounce(handleResize, 250));

        // Scroll handling
        $(window).on('scroll', throttle(handleScroll, 100));

        // Click outside handlers
        $(document).on('click', handleClickOutside);

        // Form submissions
        $('form').on('submit', handleFormSubmit);

        // Keyboard shortcuts
        $(document).on('keydown', handleKeyboardShortcuts);
    }

    // ========== NAVIGATION & HEADER ==========

    /**
     * Sticky Navigation
     */
    function initStickyNav() {
        const $navbar = $('.navbar');
        const scrollThreshold = 100;

        function updateNavbar() {
            if ($(window).scrollTop() > scrollThreshold) {
                $navbar.addClass('scrolled');
            } else {
                $navbar.removeClass('scrolled');
            }
        }

        // Initial check
        updateNavbar();

        // Listen to scroll
        $(window).on('scroll', throttle(updateNavbar, 100));
    }

    /**
     * Mobile Menu with animations
     */
    function initMobileMenu() {
        const $navbarToggler = $('.navbar-toggler');
        const $navbarCollapse = $('.navbar-collapse');

        if (!$navbarToggler.length || !$navbarCollapse.length) return;

        $navbarToggler.on('click', function (e) {
            e.preventDefault();
            const $this = $(this);
            const isExpanded = $this.attr('aria-expanded') === 'true';

            // Toggle menu
            $navbarCollapse.collapse('toggle');

            // Animate hamburger icon
            $this.toggleClass('collapsed');

            // Update aria attribute
            $this.attr('aria-expanded', !isExpanded);

            // Add/remove body scroll lock
            $('body').toggleClass('menu-open', !isExpanded);

            // Announce to screen readers
            announceToScreenReader(!isExpanded ? 'Menu opened' : 'Menu closed');
        });

        // Close mobile menu when clicking a link
        $('.navbar-nav .nav-link').on('click', function () {
            if ($navbarCollapse.hasClass('show') && $(window).width() < 992) {
                $navbarToggler.trigger('click');
            }
        });
    }

    /**
     * Search functionality
     */
    function initSearch() {
        const $searchIcon = $('.search-icon');
        const $searchModal = $('#searchModal');

        if (!$searchIcon.length) return;

        // Open search modal
        $searchIcon.on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            if (!$searchModal.length) {
                createSearchModal();
            } else {
                $searchModal.modal('show');
            }

            // Focus on search input
            setTimeout(() => {
                $('#searchInput').focus();
            }, 300);
        });

        // Search form submission
        $(document).on('submit', '#searchForm', function (e) {
            e.preventDefault();
            performSearch($(this));
        });

        // Clear search
        $(document).on('click', '.clear-search', function () {
            $('#searchInput').val('').focus();
            $('.search-results').empty().hide();
        });
    }

    // ========== CONTENT INTERACTIONS ==========

    /**
     * News Cards hover effects
     */
    function initNewsCards() {
        const $newsCards = $('.news-card');

        $newsCards.each(function () {
            const $card = $(this);
            const $image = $card.find('.news-image img');

            // Click handling for touch devices
            $card.on('click', function (e) {
                if (!$(e.target).is('a') && !$(e.target).parents('a').length) {
                    const $link = $card.find('.news-title a');
                    if ($link.length && $link.attr('href')) {
                        window.location.href = $link.attr('href');
                    }
                }
            });
        });
    }

    /**
     * Video Player with modal
     */
    function initVideoPlayer() {
        const $playButtons = $('.play-button, .play-button-sm');

        $playButtons.on('click', function () {
            const $button = $(this);
            const videoUrl = $button.data('video') || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
            const videoTitle = $button.data('title') || 'News Video';

            createVideoModal(videoUrl, videoTitle);
        });
    }

    /**
     * Create video modal
     */
    function createVideoModal(videoUrl, videoTitle) {
        // Remove existing modal
        $('#videoModal').remove();

        const modalHtml = `
            <div class="modal fade" id="videoModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${videoTitle}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <div class="ratio ratio-16x9">
                                <iframe src="${videoUrl}?autoplay=1&rel=0" 
                                        title="${videoTitle}" 
                                        frameborder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowfullscreen
                                        loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHtml);

        const $modal = $('#videoModal');
        $modal.modal('show');

        // Clean up on close
        $modal.on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }

    // ========== FORMS & SUBMISSIONS ==========

    /**
     * Newsletter subscription
     */
    function initNewsletter() {
        const $newsletterForm = $('.newsletter-form');

        if (!$newsletterForm.length) return;

        $newsletterForm.on('submit', function (e) {
            e.preventDefault();
            const $form = $(this);
            const $input = $form.find('input[type="email"]');
            const email = $input.val().trim();

            if (validateEmail(email)) {
                submitNewsletter($form, email);
            } else {
                showFormError($form, 'Please enter a valid email address.');
            }
        });
    }

    /**
     * Handle all form submissions
     */
    function handleFormSubmit(e) {
        const $form = $(this);

        // Prevent default for AJAX forms
        if ($form.hasClass('ajax-form')) {
            e.preventDefault();
            submitAjaxForm($form);
        }

        // Add loading state
        $form.addClass('loading');
    }

    // ========== UI COMPONENTS ==========

    /**
     * Breaking News Ticker
     */
    function initBreakingNewsTicker() {
        const $ticker = $('.breaking-news-ticker');
        if (!$ticker.length) return;

        const tickerItems = [
            "• Global leaders reach historic climate agreement at emergency summit •",
            "• Stock markets hit record high amid tech rally and positive economic indicators •",
            "• National sports team advances to championship finals after stunning victory •",
            "• Breakthrough in quantum computing announced by leading research institute •",
            "• New vaccine shows 95% effectiveness in latest clinical trials •"
        ];

        let currentIndex = 0;
        const $tickerContent = $ticker.find('marquee span');

        // Update ticker every 15 seconds
        const tickerInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % tickerItems.length;

            // Fade out, update, fade in
            $tickerContent.fadeOut(300, function () {
                $(this).text(tickerItems[currentIndex]).fadeIn(300);
            });
        }, 15000);

        // Pause on hover
        $ticker.on('mouseenter', function () {
            $tickerContent.parent().attr('scrollamount', '0');
        }).on('mouseleave', function () {
            $tickerContent.parent().attr('scrollamount', '3');
        });

        // Cleanup
        $(window).on('beforeunload', function () {
            clearInterval(tickerInterval);
        });
    }

    /**
     * Smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function (e) {
            const $link = $(this);
            const targetId = $link.attr('href');

            if (targetId === '#') return;

            const $target = $(targetId);
            if ($target.length) {
                e.preventDefault();

                const offset = 80;
                const targetPosition = $target.offset().top - offset;

                $('html, body').animate({
                    scrollTop: targetPosition
                }, 800, 'swing');

                // Update URL hash without scrolling
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    location.hash = targetId;
                }
            }
        });
    }

    /**
     * Tooltips initialization
     */
    function initTooltips() {
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl, {
                    trigger: 'hover focus',
                    delay: { show: 300, hide: 100 }
                });
            });
        }
    }

    /**
     * Back to Top button
     */
    function initBackToTop() {
        const $backToTop = $('<button/>', {
            id: 'backToTop',
            class: 'btn btn-primary',
            html: '<i class="fas fa-chevron-up"></i>',
            'aria-label': 'Back to top',
            title: 'Back to top'
        }).hide().appendTo('body');

        // Show/hide based on scroll position
        $(window).on('scroll', throttle(function () {
            if ($(this).scrollTop() > 300) {
                $backToTop.fadeIn(300);
            } else {
                $backToTop.fadeOut(300);
            }
        }, 100));

        // Scroll to top on click
        $backToTop.on('click', function () {
            $('html, body').animate({ scrollTop: 0 }, 800);
            $(this).blur();
        });

        // Style the button
        $backToTop.css({
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: '1000',
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        });
    }

    /**
     * Theme Toggle (Light/Dark mode)
     */
    function initThemeToggle() {
        // Check for saved theme preference or respect OS preference
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const savedTheme = localStorage.getItem('theme');

        // Apply theme
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
            document.body.classList.add('dark-theme');
        }

        // Create theme toggle button if not exists
        if (!$('#themeToggle').length) {
            const $themeToggle = $('<button/>', {
                id: 'themeToggle',
                class: 'btn btn-outline-secondary btn-sm theme-toggle',
                html: document.body.classList.contains('dark-theme') ?
                    '<i class="fas fa-sun"></i>' :
                    '<i class="fas fa-moon"></i>',
                'aria-label': 'Toggle dark mode',
                title: 'Toggle dark mode'
            });

            // Insert in navbar
            $('.navbar .d-flex').prepend($themeToggle);
        }

        // Update icon based on current theme
        updateThemeIcon(document.body.classList.contains('dark-theme'));

        // Toggle theme
        $(document).on('click', '#themeToggle', function () {
            const isDark = document.body.classList.toggle('dark-theme');

            // Update icon
            updateThemeIcon(isDark);

            // Save preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');

            // Announce change
            announceToScreenReader(`${isDark ? 'Dark' : 'Light'} mode activated`);
        });

        // Listen for system theme changes
        prefersDarkScheme.addEventListener('change', function (e) {
            if (!localStorage.getItem('theme')) {
                const isDark = e.matches;
                document.body.classList.toggle('dark-theme', isDark);
                updateThemeIcon(isDark);
            }
        });

        // Update icon based on theme
        function updateThemeIcon(isDark) {
            const $themeToggle = $('#themeToggle');
            if ($themeToggle.length) {
                const $icon = $themeToggle.find('i');
                $icon.toggleClass('fa-moon fa-sun');
                $themeToggle.attr('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
                $themeToggle.attr('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            }
        }
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Debounce function for performance
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for performance
     */
    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Validate email address
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Show form error message
     */
    function showFormError($form, message) {
        // Remove existing errors
        $form.find('.alert').remove();

        // Create error alert
        const $alert = $(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        // Insert before form
        $form.before($alert);

        // Auto-dismiss after 5 seconds
        const dismissTimeout = setTimeout(() => {
            $alert.alert('close');
        }, 5000);

        // Cleanup
        $alert.on('closed.bs.alert', function () {
            clearTimeout(dismissTimeout);
        });
    }

    /**
     * Show form success message
     */
    function showFormSuccess($form, message) {
        // Remove existing messages
        $form.find('.alert').remove();

        // Create success alert
        const $alert = $(`
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        // Insert before form
        $form.before($alert);

        // Reset form
        $form[0].reset();
        $form.removeClass('loading');

        // Auto-dismiss after 5 seconds
        const dismissTimeout = setTimeout(() => {
            $alert.alert('close');
        }, 5000);

        // Cleanup
        $alert.on('closed.bs.alert', function () {
            clearTimeout(dismissTimeout);
        });
    }

    /**
     * Announce to screen readers
     */
    function announceToScreenReader(message) {
        let $announcer = $('#screen-reader-announcer');

        if (!$announcer.length) {
            $announcer = $('<div/>', {
                id: 'screen-reader-announcer',
                class: 'sr-only',
                'aria-live': 'polite',
                'aria-atomic': 'true'
            }).appendTo('body');
        }

        // Update message
        $announcer.text(message);

        // Clear after a delay
        setTimeout(() => {
            $announcer.text('');
        }, 1000);
    }

    /**
     * Handle click outside of elements
     */
    function handleClickOutside(e) {
        // Close dropdowns when clicking outside
        if (!$(e.target).closest('.dropdown').length) {
            $('.dropdown-menu.show').removeClass('show');
        }

        // Close mobile menu when clicking outside
        if ($('.navbar-collapse').hasClass('show') &&
            !$(e.target).closest('.navbar').length &&
            $(window).width() < 992) {
            $('.navbar-toggler').trigger('click');
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    function handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('.search-icon').trigger('click');
        }

        // Escape key closes modals/dropdowns
        if (e.key === 'Escape') {
            // Close open modals
            $('.modal.show').modal('hide');

            // Close dropdowns
            $('.dropdown-menu.show').removeClass('show');
        }

        // Tab key handling for accessibility
        if (e.key === 'Tab') {
            // Ensure focus is visible
            $(':focus').addClass('focus-visible');
        }
    }

    /**
     * Create search modal
     */
    function createSearchModal() {
        const modalHtml = `
            <div class="modal fade" id="searchModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Search News</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form id="searchForm" class="mb-4">
                                <div class="input-group">
                                    <input type="text" 
                                           id="searchInput" 
                                           class="form-control form-control-lg" 
                                           placeholder="Search for news, topics, or keywords..." 
                                           autocomplete="off"
                                           aria-label="Search input">
                                    <button class="btn btn-primary btn-lg" type="submit">
                                        <i class="fas fa-search"></i> Search
                                    </button>
                                </div>
                            </form>
                            <div class="search-results" style="display: none;">
                                <div class="search-results-header d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="mb-0">Search Results</h6>
                                    <button class="btn btn-sm btn-outline-secondary clear-search">
                                        <i class="fas fa-times"></i> Clear
                                    </button>
                                </div>
                                <div class="search-results-list"></div>
                            </div>
                            <div class="search-suggestions">
                                <h6 class="text-muted mb-2">Popular Searches:</h6>
                                <div class="d-flex flex-wrap gap-2">
                                    <a href="category.html?cat=politics" class="badge bg-light text-dark">Politics</a>
                                    <a href="category.html?cat=technology" class="badge bg-light text-dark">Technology</a>
                                    <a href="category.html?cat=sports" class="badge bg-light text-dark">Sports</a>
                                    <a href="category.html?cat=business" class="badge bg-light text-dark">Business</a>
                                    <a href="category.html?cat=health" class="badge bg-light text-dark">Health</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHtml);
        $('#searchModal').modal('show');
    }

    /**
     * Perform search
     */
    function performSearch($form) {
        const query = $('#searchInput').val().trim();

        if (query.length < 2) {
            showFormError($form, 'Please enter at least 2 characters to search.');
            return;
        }

        // Show loading
        $('.search-results-list').html('<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Searching...</p></div>');
        $('.search-results').show();

        // Simulate search
        setTimeout(() => {
            const mockResults = [
                {
                    title: 'Global Climate Summit Reaches Historic Agreement',
                    excerpt: 'World leaders announce unprecedented climate action plan with measurable targets for 2030.',
                    category: 'Politics',
                    date: '2 hours ago',
                    url: 'news.html'
                },
                {
                    title: 'Tech Stocks Surge on AI Breakthrough',
                    excerpt: 'Major technology companies see stock price increases following AI research announcement.',
                    category: 'Business',
                    date: '4 hours ago',
                    url: 'news.html'
                },
                {
                    title: 'New Vaccine Shows 95% Effectiveness in Trials',
                    excerpt: 'Clinical trials show promising results for new vaccine development.',
                    category: 'Health',
                    date: '6 hours ago',
                    url: 'news.html'
                }
            ];

            // Display results
            const resultsHtml = mockResults.map(result => `
                <div class="search-result-item mb-3 p-3 border rounded">
                    <div class="d-flex align-items-start">
                        <div class="flex-grow-1">
                            <span class="badge bg-primary mb-1">${result.category}</span>
                            <h6 class="mb-1"><a href="${result.url}" class="text-decoration-none">${result.title}</a></h6>
                            <p class="small text-muted mb-1">${result.excerpt}</p>
                            <small class="text-muted">${result.date}</small>
                        </div>
                        <div class="ms-3">
                            <a href="${result.url}" class="btn btn-sm btn-outline-primary">Read</a>
                        </div>
                    </div>
                </div>
            `).join('');

            $('.search-results-list').html(resultsHtml || '<div class="text-center py-5"><p class="text-muted">No results found. Try different keywords.</p></div>');
        }, 800);
    }

    /**
     * Submit newsletter form
     */
    function submitNewsletter($form, email) {
        // Show loading
        $form.addClass('loading');

        // Simulate API call
        setTimeout(() => {
            // Mock success for demo
            showFormSuccess($form, 'Thank you for subscribing to our newsletter!');
        }, 1000);
    }

    /**
     * Submit AJAX form
     */
    function submitAjaxForm($form) {
        const formData = new FormData($form[0]);

        // Show loading
        $form.addClass('loading');

        // Simulate API call
        setTimeout(() => {
            // Mock success for demo
            showFormSuccess($form, 'Form submitted successfully!');
        }, 1500);
    }

    /**
     * Initialize lazy loading
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');

                        if (src) {
                            img.src = src;
                            img.classList.add('loaded');
                            img.removeAttribute('data-src');
                        }

                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            // Observe all lazy images
            $('img[data-src]').each(function () {
                imageObserver.observe(this);
            });
        } else {
            // Fallback for older browsers
            $('img[data-src]').each(function () {
                $(this).attr('src', $(this).data('src')).removeAttr('data-src');
            });
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Update any layout-dependent calculations
        const viewportWidth = $(window).width();

        // Add/remove classes based on viewport
        if (viewportWidth < 768) {
            $('body').addClass('is-mobile').removeClass('is-desktop');
        } else {
            $('body').addClass('is-desktop').removeClass('is-mobile');
        }

        // Re-initialize any components that need it
        if (viewportWidth >= 992) {
            // Ensure mobile menu is closed on desktop
            if ($('.navbar-collapse').hasClass('show')) {
                $('.navbar-toggler').trigger('click');
            }
        }
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        // Implement scroll-based effects here
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();

        // Fade in elements on scroll
        $('.fade-in').each(function () {
            const $element = $(this);
            const elementTop = $element.offset().top;
            const elementVisible = 150;

            if (scrollTop + windowHeight - elementVisible > elementTop) {
                $element.addClass('animated');
            }
        });
    }

    // ========== PAGE-SPECIFIC INITIALIZATIONS ==========

    /**
     * Initialize page-specific functionality
     */
    function initPageSpecific() {
        const $body = $('body');
        const pageClass = $body.attr('class')?.split(' ').find(c => c.startsWith('page-'));

        switch (pageClass) {
            case 'page-home':
                initHomePage();
                break;
            case 'page-category':
                initCategoryPage();
                break;
            case 'page-news':
                initNewsPage();
                break;
            case 'page-live':
                initLivePage();
                break;
            case 'page-video':
                initVideoPage();
                break;
            case 'page-gallery':
                initGalleryPage();
                break;
            case 'page-search':
                // Search page has its own initialization
                break;
            case 'page-contact':
                initContactPage();
                break;
        }
    }

    // Stub functions for page-specific initializations
    function initHomePage() {
        // Home page specific initialization
    }

    function initCategoryPage() {
        // Category page specific initialization
    }

    function initNewsPage() {
        // News page specific initialization
    }

    function initLivePage() {
        // Live page specific initialization
    }

    function initVideoPage() {
        // Video page specific initialization
    }

    function initGalleryPage() {
        // Gallery page specific initialization
    }

    function initContactPage() {
        // Contact page specific initialization
    }

    // ========== PUBLIC API ==========

    // Expose some functions globally if needed
    window.GNN = window.GNN || {};
    window.GNN.utils = {
        debounce: debounce,
        throttle: throttle,
        validateEmail: validateEmail,
        announceToScreenReader: announceToScreenReader
    };

    // Log initialization
    console.log('Global News Network - JavaScript initialized successfully');
});

// ========== GLOBAL EVENT HANDLERS ==========

// Handle images that fail to load
$(document).on('error', 'img', function () {
    const $img = $(this);
    const fallbackSrc = 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

    if ($img.attr('src') !== fallbackSrc) {
        $img.attr('src', fallbackSrc);
    }
});

// Handle external links
$(document).on('click', 'a[href^="http"]', function (e) {
    const $link = $(this);
    const isExternal = !$link.attr('href').includes(window.location.hostname);

    if (isExternal) {
        // Add analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'external_link_click', {
                'event_category': 'engagement',
                'event_label': $link.attr('href')
            });
        }
    }
});

// Handle print button
$(document).on('click', '.btn-print', function () {
    window.print();
});

// Handle focus-visible for accessibility
$(document).on('keydown', function (e) {
    if (e.key === 'Tab') {
        $('body').addClass('using-keyboard');
    }
});

$(document).on('mousedown', function () {
    $('body').removeClass('using-keyboard');
});

// ========== PERFORMANCE MONITORING ==========

// Log page load performance
window.addEventListener('load', function () {
    // Check if page is loaded within performance budget
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;

        if (loadTime > 3000) {
            console.warn(`Page loaded in ${loadTime}ms - Consider optimizing performance`);
        }
    }

    // Remove loading class from body
    $('body').removeClass('page-loading');
});

// Log any JavaScript errors
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('JavaScript Error:', {
        message: msg,
        url: url,
        line: lineNo,
        column: columnNo,
        error: error
    });

    return false;
};

// Handle page visibility changes
document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
        // Page is hidden
        console.log('Page became hidden');
    } else {
        // Page is visible
        console.log('Page became visible');
    }
});

// Initialize when DOM is fully loaded
$(window).on('load', function () {
    // Any final initialization after all resources are loaded
});