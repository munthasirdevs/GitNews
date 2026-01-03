/* ==============================================
   GLOBAL NEWS NETWORK - HOME PAGE JAVASCRIPT
   Home page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== HOME PAGE INITIALIZATION ==========
    initHomePage();

    /**
     * Initialize all home page components
     */
    function initHomePage() {
        // Hero Slider
        initHeroSlider();

        // Load More News
        initLoadMoreNews();

        // Category Filtering
        initCategoryFilter();

        // Video Gallery
        initVideoGallery();

        // Trending Updates
        initTrendingUpdates();

        // News Ticker
        initNewsTicker();

        // View Counter
        initViewCounter();

        // Performance Monitoring
        initHomePerformance();

        // Initialize error handling
        initErrorHandling();
    }

    // ========== HERO SLIDER ==========

    /**
     * Initialize hero news slider
     */
    function initHeroSlider() {
        const $heroMain = $('.hero-main');
        const $heroSideItems = $('.hero-side-item');
        let currentSlide = 0;
        const slides = [
            {
                image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                category: 'politics',
                title: 'Global Leaders Reach Historic Climate Agreement at Emergency Summit',
                excerpt: 'World leaders announce unprecedented climate action plan with measurable targets for 2030.',
                author: 'Sarah Johnson',
                time: '2 hours ago',
                views: '45.2K'
            },
            {
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                category: 'technology',
                title: 'AI Breakthrough Revolutionizes Healthcare Diagnostics',
                excerpt: 'New AI model achieves 98% accuracy in early disease detection.',
                author: 'Michael Chen',
                time: '4 hours ago',
                views: '32.8K'
            },
            {
                image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                category: 'sports',
                title: 'National Team Advances to Championship Finals',
                excerpt: 'Dramatic victory secures championship spot after thrilling match.',
                author: 'David Wilson',
                time: '6 hours ago',
                views: '28.5K'
            }
        ];

        // Auto-rotate slides every 10 seconds
        let slideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateHeroSlide(slides[currentSlide]);
        }, 10000);

        // Click handlers for side items
        $heroSideItems.each(function (index) {
            $(this).on('click', function (e) {
                e.preventDefault();
                if (index < slides.length) {
                    updateHeroSlide(slides[index]);
                    currentSlide = index;

                    // Reset interval
                    clearInterval(slideInterval);
                    slideInterval = setInterval(() => {
                        currentSlide = (currentSlide + 1) % slides.length;
                        updateHeroSlide(slides[currentSlide]);
                    }, 10000);
                }
            });
        });

        // Pause auto-rotation on hover
        $heroMain.hover(
            function () {
                clearInterval(slideInterval);
            },
            function () {
                slideInterval = setInterval(() => {
                    currentSlide = (currentSlide + 1) % slides.length;
                    updateHeroSlide(slides[currentSlide]);
                }, 10000);
            }
        );
    }

    /**
     * Update hero slide content
     */
    function updateHeroSlide(slide) {
        const $heroMain = $('.hero-main');
        const $heroImage = $heroMain.find('img');
        const $heroOverlay = $heroMain.find('.hero-overlay');

        // Fade out current content
        $heroMain.css('opacity', '0.7');

        setTimeout(() => {
            // Update image with crossfade effect
            $heroImage.attr('src', slide.image);
            $heroImage.attr('alt', slide.title);

            // Update content
            $heroOverlay.find('.category-badge')
                .removeClass()
                .addClass('category-badge ' + slide.category)
                .text(slide.category.charAt(0).toUpperCase() + slide.category.slice(1));

            $heroOverlay.find('.hero-title a').text(slide.title);
            $heroOverlay.find('.hero-excerpt').text(slide.excerpt);
            $heroOverlay.find('.hero-meta span:first-child').html('<i class="fas fa-user me-1"></i> ' + slide.author);
            $heroOverlay.find('.hero-meta span:nth-child(2)').html('<i class="fas fa-clock me-1"></i> ' + slide.time);
            $heroOverlay.find('.hero-meta span:last-child').html('<i class="fas fa-eye me-1"></i> ' + slide.views);

            // Fade back in
            $heroMain.css('opacity', '1');

            // Announce to screen readers
            announceToScreenReader('Featured news updated: ' + slide.title);
        }, 300);
    }

    // ========== LOAD MORE NEWS ==========

    /**
     * Initialize load more news functionality
     */
    function initLoadMoreNews() {
        const $loadMoreBtn = $('#loadMoreNews');
        let isLoading = false;
        let page = 1;

        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();

            if (isLoading) return;

            isLoading = true;
            loadMoreNews(page + 1);
        });

        // Infinite scroll on mobile
        if ($(window).width() < 768) {
            $(window).on('scroll', function () {
                if (isLoading || !$loadMoreBtn.is(':visible')) return;

                const scrollTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                const documentHeight = $(document).height();
                const btnOffset = $loadMoreBtn.offset().top;

                if (scrollTop + windowHeight >= btnOffset - 200) {
                    isLoading = true;
                    loadMoreNews(page + 1);
                }
            });
        }
    }

    /**
     * Load more news articles
     */
    function loadMoreNews(nextPage) {
        const $loadMoreBtn = $('#loadMoreNews');
        const $newsGrid = $('.latest-news .row');

        // Show loading state
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API call delay
        setTimeout(() => {
            // Mock data for demonstration
            const mockNews = [
                {
                    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'science',
                    title: 'New Deep Sea Species Discovered in Mariana Trench',
                    excerpt: 'Scientists identify previously unknown marine life forms in the deepest parts of the ocean.',
                    time: '15 hours ago',
                    comments: '76'
                },
                {
                    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'entertainment',
                    title: 'Streaming Platform Announces Major Content Partnership',
                    excerpt: 'Exclusive deals signed with major studios to bring premium content to subscribers.',
                    time: '17 hours ago',
                    comments: '203'
                },
                {
                    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    category: 'business',
                    title: 'Major Retail Chain Announces Nationwide Expansion',
                    excerpt: 'New stores and distribution centers planned across the country, creating thousands of jobs.',
                    time: '19 hours ago',
                    comments: '89'
                }
            ];

            // Create and append new news cards
            mockNews.forEach((news, index) => {
                const newsCardHtml = `
                    <div class="col-md-6 col-lg-4">
                        <article class="news-card" style="animation-delay: ${(index * 0.1) + 0.1}s">
                            <div class="news-image">
                                <img src="${news.image}" alt="${news.title}" class="w-100" loading="lazy">
                            </div>
                            <div class="news-content">
                                <span class="category-badge ${news.category}">${news.category.charAt(0).toUpperCase() + news.category.slice(1)}</span>
                                <h3 class="news-title">
                                    <a href="news.html">${news.title}</a>
                                </h3>
                                <p class="news-excerpt">${news.excerpt}</p>
                                <div class="news-meta">
                                    <span><i class="fas fa-clock me-1"></i> ${news.time}</span>
                                    <span><i class="fas fa-comment me-1"></i> ${news.comments}</span>
                                </div>
                            </div>
                        </article>
                    </div>
                `;

                $newsGrid.append(newsCardHtml);
            });

            // Update page counter
            page = nextPage;

            // Reset button state
            $loadMoreBtn.html('<i class="fas fa-plus-circle me-2"></i> Load More News');
            $loadMoreBtn.prop('disabled', false);
            isLoading = false;

            // Re-initialize news card interactions
            if (window.GNN && window.GNN.utils) {
                // Use existing news card initialization
                $('.news-card').off().on('mouseenter mouseleave', function () {
                    const $card = $(this);
                    const $image = $card.find('.news-image img');

                    if ($card.is(':hover')) {
                        $image.css('transform', 'scale(1.05)');
                    } else {
                        $image.css('transform', 'scale(1)');
                    }
                });
            }

            // Announce to screen readers
            announceToScreenReader('Loaded more news articles');

            // Update button text if this is the last page (demo)
            if (page >= 3) {
                $loadMoreBtn.html('<i class="fas fa-check-circle me-2"></i> All News Loaded');
                $loadMoreBtn.prop('disabled', true);
                $loadMoreBtn.removeClass('btn-outline-primary').addClass('btn-outline-secondary');
            }
        }, 1500);
    }

    // ========== CATEGORY FILTERING ==========

    /**
     * Initialize category filtering for news cards
     */
    function initCategoryFilter() {
        const $categoryCards = $('.category-card');

        $categoryCards.each(function () {
            const $card = $(this);
            const category = $card.find('h3').text().toLowerCase();

            $card.on('click', function (e) {
                e.preventDefault();

                // Highlight selected category
                $categoryCards.removeClass('selected');
                $card.addClass('selected');

                // Filter news cards (simulated)
                filterNewsByCategory(category);

                // Scroll to news section
                $('html, body').animate({
                    scrollTop: $('.latest-news').offset().top - 80
                }, 800);

                // Announce filter
                announceToScreenReader(`Filtering news by ${category}`);
            });
        });
    }

    /**
     * Filter news by category
     */
    function filterNewsByCategory(category) {
        const $newsCards = $('.news-card');
        const $loadMoreBtn = $('#loadMoreNews');

        // Show all if "All" selected
        if (category === 'all') {
            $newsCards.show();
            $loadMoreBtn.show();
            return;
        }

        // Filter animation
        $newsCards.each(function () {
            const $card = $(this);
            const cardCategory = $card.find('.category-badge').text().toLowerCase();

            if (cardCategory === category) {
                $card.show();
            } else {
                $card.hide();
            }
        });

        // Hide load more button if filtered
        $loadMoreBtn.hide();
    }

    // ========== VIDEO GALLERY ==========

    /**
     * Initialize video gallery functionality
     */
    function initVideoGallery() {
        // Main video play button
        $('.play-button').on('click', function () {
            const $button = $(this);
            const $container = $button.closest('.video-container');
            const videoUrl = $container.find('.video-thumbnail').data('video');
            const videoTitle = $container.find('h3').text();

            playVideo(videoUrl, videoTitle);
        });

        // Small video play buttons
        $('.play-button-sm').on('click', function () {
            const $button = $(this);
            const $thumbnail = $button.closest('.video-thumbnail-sm');
            const videoUrl = $thumbnail.data('video');
            const videoTitle = $thumbnail.closest('.video-sidebar-item').find('h6 a').text();

            playVideo(videoUrl, videoTitle);
        });
    }

    /**
     * Play video in modal
     */
    function playVideo(videoUrl, videoTitle) {
        // Create modal HTML
        const modalHtml = `
            <div class="modal fade video-modal" id="videoPlayerModal" tabindex="-1" aria-hidden="true">
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

        // Remove existing modal
        $('.video-modal').remove();

        // Add new modal to body
        $('body').append(modalHtml);

        // Show modal
        const $modal = $('#videoPlayerModal');
        $modal.modal('show');

        // Clean up on close
        $modal.on('hidden.bs.modal', function () {
            $(this).remove();
        });

        // Track video play
        trackVideoPlay(videoTitle);
    }

    // ========== TRENDING UPDATES ==========

    /**
     * Initialize trending news updates
     */
    function initTrendingUpdates() {
        const $trendingItems = $('.trending-item');
        let updateInterval;

        // Auto-update trending every 30 seconds
        function startTrendingUpdates() {
            updateInterval = setInterval(updateTrendingData, 30000);
        }

        // Pause updates on hover
        $trendingItems.hover(
            function () {
                clearInterval(updateInterval);
            },
            function () {
                startTrendingUpdates();
            }
        );

        // Start updates
        startTrendingUpdates();
    }

    /**
     * Update trending data
     */
    function updateTrendingData() {
        // In a real application, this would fetch new trending data
        // For demo, we'll just animate the numbers

        $('.trending-number').each(function () {
            const $number = $(this);
            const current = parseInt($number.text());
            const newNumber = current + Math.floor(Math.random() * 3);

            // Animate number change
            $number.css('color', 'var(--primary-color)');
            setTimeout(() => {
                $number.css('color', '');
            }, 1000);
        });

        // Update view counts
        $('.trending-meta span:nth-child(2)').each(function () {
            const $views = $(this);
            const text = $views.text();
            const match = text.match(/([\d.]+)([KM]?)/);

            if (match) {
                let num = parseFloat(match[1]);
                const suffix = match[2];

                // Add random increment
                const increment = suffix === 'M' ? 0.01 : suffix === 'K' ? 0.5 : 1;
                num += Math.random() * increment;

                // Format number
                let newNum;
                if (num >= 1) {
                    newNum = num.toFixed(1).replace(/\.0$/, '');
                } else {
                    newNum = num.toFixed(2);
                }

                $views.html(`<i class="fas fa-eye me-1"></i> ${newNum}${suffix} views`);
            }
        });
    }

    // ========== NEWS TICKER ==========

    /**
     * Initialize news ticker with dynamic updates
     */
    function initNewsTicker() {
        const $marquee = $('.breaking-news-ticker marquee');
        const tickerItems = [
            "• Global leaders reach historic climate agreement at emergency summit •",
            "• Stock markets hit record high amid tech rally and positive economic indicators •",
            "• National sports team advances to championship finals after stunning victory •",
            "• Breakthrough in quantum computing announced by leading research institute •",
            "• New vaccine shows 95% effectiveness in latest clinical trials •"
        ];

        let currentIndex = 0;

        // Update ticker content periodically
        setInterval(() => {
            currentIndex = (currentIndex + 1) % tickerItems.length;

            // Create new span for smooth transition
            const $newSpan = $('<span>').text(tickerItems[currentIndex]).hide();
            $marquee.empty().append($newSpan);
            $newSpan.fadeIn(500);

        }, 15000);

        // Pause on hover
        $('.breaking-news-ticker').hover(
            function () {
                $marquee.attr('scrollamount', '0');
            },
            function () {
                $marquee.attr('scrollamount', '3');
            }
        );
    }

    // ========== VIEW COUNTER ==========

    /**
     * Initialize view counter for articles
     */
    function initViewCounter() {
        const $newsCards = $('.news-card');
        const $heroMain = $('.hero-main');

        // Simulate view counting
        function updateViewCount($element) {
            const $viewsElement = $element.find('.fa-eye').parent();
            if ($viewsElement.length) {
                const currentText = $viewsElement.text();
                const match = currentText.match(/([\d.]+)([KM]?)/);

                if (match) {
                    let num = parseFloat(match[1]);
                    const suffix = match[2];

                    // Small random increment
                    num += Math.random() * 0.1;

                    // Format based on magnitude
                    let newText;
                    if (num >= 1000 && suffix !== 'K' && suffix !== 'M') {
                        newText = (num / 1000).toFixed(1) + 'K';
                    } else if (num >= 1000000 && suffix !== 'M') {
                        newText = (num / 1000000).toFixed(1) + 'M';
                    } else {
                        newText = Math.round(num).toString();
                    }

                    $viewsElement.html(`<i class="fas fa-eye me-1"></i> ${newText}${suffix ? suffix : ''} views`);
                }
            }
        }

        // Update view counts periodically
        setInterval(() => {
            updateViewCount($heroMain);
            $newsCards.each(function () {
                updateViewCount($(this));
            });
        }, 60000); // Update every minute
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize home page performance monitoring
     */
    function initHomePerformance() {
        // Track page load time
        const loadTime = performance.now();

        // Log performance metrics
        console.log(`Home page loaded in ${loadTime}ms`);

        // Monitor image loading
        const $images = $('img');
        let imagesLoaded = 0;

        $images.on('load', function () {
            imagesLoaded++;

            // All images loaded
            if (imagesLoaded === $images.length) {
                console.log('All images loaded successfully');
            }
        }).on('error', function () {
            // Handle image load errors
            $(this).attr('src', 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');
        });

        // Monitor scroll performance
        let lastScrollTime = Date.now();
        $(window).on('scroll', function () {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTime;

            if (timeDiff < 16) {
                console.warn('Scroll performance issue detected');
            }

            lastScrollTime = currentTime;
        });
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Announce message to screen readers
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
        $announcer.text(message);
        setTimeout(() => $announcer.text(''), 1000);
    }

    /**
     * Track video play for analytics
     */
    function trackVideoPlay(title) {
        console.log('Video played:', title);
        // In real implementation:
        // gtag('event', 'video_play', {
        //     'event_category': 'engagement',
        //     'event_label': title
        // });
    }

    // ========== ERROR HANDLING ==========

    /**
     * Handle JavaScript errors on home page
     */
    function initErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Home page error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });

            return false;
        });

        // Handle promise rejections
        window.addEventListener('unhandledrejection', function (e) {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }

    // ========== PUBLIC API ==========

    // Expose home page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.home = {
        loadMoreNews: loadMoreNews,
        filterNewsByCategory: filterNewsByCategory,
        playVideo: playVideo,
        updateTrendingData: updateTrendingData
    };

    // Log initialization
    console.log('Home page JavaScript initialized');
});