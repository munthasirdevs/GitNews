/* ==============================================
   GLOBAL NEWS NETWORK - CATEGORY PAGE JAVASCRIPT
   Category page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== CATEGORY PAGE INITIALIZATION ==========
    initCategoryPage();

    /**
     * Initialize all category page components
     */
    function initCategoryPage() {
        // Get category from URL
        const category = getCategoryFromURL();

        // Update page for category
        updateCategoryPage(category);

        // Filter functionality
        initCategoryFilter();

        // Sort functionality
        initCategorySort();

        // Load more articles
        initLoadMoreArticles();

        // Infinite scroll
        initInfiniteScroll();

        // Update view counts
        initViewCounts();

        // Bookmark functionality
        initBookmarkArticles();

        // Share functionality
        initShareArticles();

        // Related categories
        initRelatedCategories();

        // Performance monitoring
        initCategoryPerformance();
    }

    // ========== CATEGORY DETECTION ==========

    /**
     * Get category from URL parameters
     */
    function getCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('cat') || 'politics';

        // Validate category
        const validCategories = [
            'politics', 'business', 'technology', 'sports',
            'entertainment', 'health', 'science'
        ];

        return validCategories.includes(category) ? category : 'politics';
    }

    /**
     * Update page for specific category
     */
    function updateCategoryPage(category) {
        const categoryData = {
            politics: {
                title: 'Politics News',
                description: 'Stay informed with the latest political developments, government policies, election updates, and international relations.',
                icon: 'landmark',
                color: 'primary',
                stats: { articles: 1245, reporters: 156, countries: 89 }
            },
            business: {
                title: 'Business News',
                description: 'Latest market updates, financial news, corporate developments, and economic analysis from around the world.',
                icon: 'chart-line',
                color: 'secondary',
                stats: { articles: 987, reporters: 132, countries: 76 }
            },
            technology: {
                title: 'Technology News',
                description: 'Breaking tech news, innovation updates, gadget reviews, and digital transformation insights.',
                icon: 'microchip',
                color: 'info',
                stats: { articles: 856, reporters: 98, countries: 45 }
            },
            sports: {
                title: 'Sports News',
                description: 'Live scores, match reports, athlete news, and sports business developments from all major sports.',
                icon: 'futbol',
                color: 'warning',
                stats: { articles: 723, reporters: 87, countries: 67 }
            },
            entertainment: {
                title: 'Entertainment News',
                description: 'Movie reviews, celebrity news, music releases, and entertainment industry updates.',
                icon: 'film',
                color: 'danger',
                stats: { articles: 654, reporters: 76, countries: 34 }
            },
            health: {
                title: 'Health News',
                description: 'Medical breakthroughs, wellness advice, healthcare policy, and public health updates.',
                icon: 'heartbeat',
                color: 'success',
                stats: { articles: 543, reporters: 65, countries: 56 }
            },
            science: {
                title: 'Science News',
                description: 'Scientific discoveries, research updates, space exploration, and environmental science.',
                icon: 'flask',
                color: 'dark',
                stats: { articles: 432, reporters: 54, countries: 38 }
            }
        };

        const data = categoryData[category];
        if (!data) return;

        // Update page title
        document.title = `${data.title} - Global News Network`;

        // Update category header
        updateCategoryHeader(data);

        // Update breadcrumb
        updateBreadcrumb(data.title);

        // Update filter buttons
        updateFilterButtons(category);

        // Update meta tags
        updateMetaTags(category, data);

        // Announce to screen readers
        announceToScreenReader(`Loaded ${category} news category`);
    }

    /**
     * Update category header
     */
    function updateCategoryHeader(data) {
        const $header = $('.category-header');
        const $title = $('.category-title');
        const $description = $('.category-description');
        const $icon = $('.category-icon-large i');
        const $stats = $('.stat-item');

        // Update title and description
        $title.text(data.title);
        $description.text(data.description);

        // Update icon
        $icon.removeClass().addClass(`fas fa-${data.icon}`);

        // Update stats
        $stats.eq(0).find('.stat-number').text(data.stats.articles.toLocaleString());
        $stats.eq(1).find('.stat-number').text(data.stats.reporters.toLocaleString());
        $stats.eq(2).find('.stat-number').text(data.stats.countries.toLocaleString());

        // Update color scheme
        updateCategoryColor(data.color);
    }

    /**
     * Update category color scheme
     */
    function updateCategoryColor(color) {
        const $header = $('.category-header');
        const $badges = $('.category-badge');

        // Remove existing color classes
        $header.removeClass('politics business technology sports entertainment health science');
        $badges.removeClass('politics business technology sports entertainment health science');

        // Add new color class
        $header.addClass(color);
        $badges.addClass(color);

        // Update filter buttons
        $('.filter-btn.active').removeClass('btn-primary btn-secondary btn-info btn-warning btn-danger btn-success')
            .addClass(`btn-${color}`);
    }

    /**
     * Update breadcrumb
     */
    function updateBreadcrumb(categoryName) {
        $('.breadcrumb-item:last-child').text(categoryName);
    }

    /**
     * Update filter buttons for category
     */
    function updateFilterButtons(category) {
        const filterData = {
            politics: ['Elections', 'Foreign Policy', 'Local Government'],
            business: ['Markets', 'Finance', 'Entrepreneurship'],
            technology: ['Innovation', 'Startups', 'Gadgets'],
            sports: ['Matches', 'Tournaments', 'Athletes'],
            entertainment: ['Movies', 'Music', 'Celebrities'],
            health: ['Medical', 'Wellness', 'Policy'],
            science: ['Discoveries', 'Research', 'Environment']
        };

        const filters = filterData[category] || [];
        const $filterContainer = $('.filter-options');

        // Clear existing filters (except "All")
        $filterContainer.find('.filter-btn:not([data-filter="all"])').remove();

        // Add new filters
        filters.forEach((filter, index) => {
            const filterSlug = filter.toLowerCase().replace(' ', '-');
            const iconClass = getFilterIcon(filterSlug);

            const $button = $(`
                <button class="btn btn-outline-secondary btn-sm filter-btn" data-filter="${filterSlug}">
                    <i class="fas ${iconClass} me-1"></i> ${filter}
                </button>
            `);

            $filterContainer.append($button);
        });

        // Re-initialize filter functionality
        initCategoryFilter();
    }

    /**
     * Get icon class for filter
     */
    function getFilterIcon(filter) {
        const icons = {
            'elections': 'fa-vote-yea',
            'foreign-policy': 'fa-globe-americas',
            'local-government': 'fa-city',
            'markets': 'fa-chart-bar',
            'finance': 'fa-money-bill-wave',
            'entrepreneurship': 'fa-lightbulb',
            'innovation': 'fa-rocket',
            'startups': 'fa-seedling',
            'gadgets': 'fa-mobile-alt',
            'matches': 'fa-trophy',
            'tournaments': 'fa-flag',
            'athletes': 'fa-running',
            'movies': 'fa-film',
            'music': 'fa-music',
            'celebrities': 'fa-star',
            'medical': 'fa-stethoscope',
            'wellness': 'fa-spa',
            'policy': 'fa-file-contract',
            'discoveries': 'fa-atom',
            'research': 'fa-microscope',
            'environment': 'fa-leaf'
        };

        return icons[filter] || 'fa-tag';
    }

    /**
     * Update meta tags for SEO
     */
    function updateMetaTags(category, data) {
        // Update meta description
        $('meta[name="description"]').attr('content', data.description);

        // Update Open Graph tags
        $('meta[property="og:title"]').attr('content', data.title);
        $('meta[property="og:description"]').attr('content', data.description);
        $('meta[property="og:url"]').attr('content', window.location.href);

        // Update structured data
        updateStructuredData(category, data);
    }

    /**
     * Update structured data for SEO
     */
    function updateStructuredData(category, data) {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": data.title,
            "description": data.description,
            "url": window.location.href,
            "publisher": {
                "@type": "NewsMediaOrganization",
                "name": "Global News Network"
            },
            "about": {
                "@type": "Thing",
                "name": category.charAt(0).toUpperCase() + category.slice(1)
            },
            "mainEntity": {
                "@type": "ItemList",
                "numberOfItems": data.stats.articles,
                "itemListElement": []
            }
        };

        // Update script tag
        $('script[type="application/ld+json"]').text(JSON.stringify(structuredData, null, 2));
    }

    // ========== FILTER FUNCTIONALITY ==========

    /**
     * Initialize category filter functionality
     */
    function initCategoryFilter() {
        const $filterButtons = $('.filter-btn');
        const $newsCards = $('#newsGrid .news-card');

        $filterButtons.on('click', function (e) {
            e.preventDefault();

            const $button = $(this);
            const filter = $button.data('filter');

            // Update active button
            $filterButtons.removeClass('active btn-primary');
            $button.addClass('active');

            // Add color class based on category
            const category = getCategoryFromURL();
            const color = getCategoryColor(category);
            $button.addClass(`btn-${color}`);

            // Filter news cards
            filterNewsCards(filter);

            // Update results count
            updateResultsCount(filter);

            // Announce filter change
            announceToScreenReader(`Filtered by ${filter === 'all' ? 'all categories' : filter}`);
        });
    }

    /**
     * Get category color
     */
    function getCategoryColor(category) {
        const colors = {
            politics: 'primary',
            business: 'secondary',
            technology: 'info',
            sports: 'warning',
            entertainment: 'danger',
            health: 'success',
            science: 'dark'
        };

        return colors[category] || 'primary';
    }

    /**
     * Filter news cards
     */
    function filterNewsCards(filter) {
        const $newsCards = $('#newsGrid .news-card');

        if (filter === 'all') {
            // Show all cards with fade in effect
            $newsCards.hide().fadeIn(300);
            return;
        }

        // Filter cards
        $newsCards.each(function () {
            const $card = $(this);
            const cardCategory = $card.data('category');

            if (cardCategory === filter) {
                $card.fadeIn(300);
            } else {
                $card.fadeOut(300);
            }
        });
    }

    /**
     * Update results count
     */
    function updateResultsCount(filter) {
        const $newsCards = $('#newsGrid .news-card:visible');
        const totalArticles = 1245; // This would come from backend in real implementation

        let countText;
        if (filter === 'all') {
            countText = `1-${$newsCards.length} of ${totalArticles} articles`;
        } else {
            const filteredCount = Math.floor(totalArticles * 0.3); // Simulated filtered count
            countText = `1-${$newsCards.length} of ${filteredCount} articles`;
        }

        $('.news-count .badge').text(countText);
    }

    // ========== SORT FUNCTIONALITY ==========

    /**
     * Initialize category sort functionality
     */
    function initCategorySort() {
        const $sortButtons = $('.sort-btn');

        $sortButtons.on('click', function (e) {
            e.preventDefault();

            const $button = $(this);
            const sortType = $button.data('sort');

            // Update active button
            $sortButtons.removeClass('active btn-primary');
            $button.addClass('active');

            // Add color class
            const category = getCategoryFromURL();
            const color = getCategoryColor(category);
            $button.addClass(`btn-${color}`);

            // Sort news cards
            sortNewsCards(sortType);

            // Announce sort change
            announceToScreenReader(`Sorted by ${sortType}`);
        });
    }

    /**
     * Sort news cards
     */
    function sortNewsCards(sortType) {
        const $newsGrid = $('#newsGrid');
        const $newsCards = $newsGrid.find('.news-card');

        // Convert to array for sorting
        const cardsArray = $newsCards.toArray();

        cardsArray.sort((a, b) => {
            const $cardA = $(a);
            const $cardB = $(b);

            switch (sortType) {
                case 'latest':
                    // Sort by time (simulated with data attributes)
                    const timeA = parseInt($cardA.data('time') || 0);
                    const timeB = parseInt($cardB.data('time') || 0);
                    return timeB - timeA;

                case 'popular':
                    // Sort by views/popularity
                    const popularityA = $cardA.data('popularity') || 'low';
                    const popularityB = $cardB.data('popularity') || 'low';
                    const popularityOrder = { high: 3, medium: 2, low: 1 };
                    return popularityOrder[popularityB] - popularityOrder[popularityA];

                case 'trending':
                    // Sort by trending status
                    const trendingA = $cardA.find('.trending-badge, .breaking-badge-sm').length > 0;
                    const trendingB = $cardB.find('.trending-badge, .breaking-badge-sm').length > 0;
                    return trendingB - trendingA;

                default:
                    return 0;
            }
        });

        // Reorder the grid
        $newsGrid.empty().append(cardsArray);

        // Re-initialize card interactions
        initNewsCardInteractions();
    }

    // ========== LOAD MORE ARTICLES ==========

    /**
     * Initialize load more articles functionality
     */
    function initLoadMoreArticles() {
        const $loadMoreBtn = $('#loadMoreArticles');
        let isLoading = false;
        let currentPage = 1;

        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();

            if (isLoading) return;

            isLoading = true;
            loadMoreArticles(currentPage + 1);
        });
    }

    /**
     * Load more articles
     */
    function loadMoreArticles(nextPage) {
        const $loadMoreBtn = $('#loadMoreArticles');
        const $newsGrid = $('#newsGrid');

        // Show loading state
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API call delay
        setTimeout(() => {
            const category = getCategoryFromURL();
            const mockArticles = generateMockArticles(category, 6);

            // Append new articles
            mockArticles.forEach((article, index) => {
                const articleHtml = createArticleHTML(article, index);
                $newsGrid.append(articleHtml);
            });

            // Update page counter
            currentPage = nextPage;

            // Reset button state
            $loadMoreBtn.html('<i class="fas fa-plus-circle me-2"></i> Load More Articles');
            $loadMoreBtn.prop('disabled', false);
            isLoading = false;

            // Re-initialize card interactions
            initNewsCardInteractions();

            // Update results count
            updateResultsCount($('.filter-btn.active').data('filter'));

            // Announce to screen readers
            announceToScreenReader(`Loaded ${mockArticles.length} more articles`);

            // Hide button if we've loaded enough (demo)
            if (currentPage >= 3) {
                $loadMoreBtn.hide();
                $('.pagination').show();
            }
        }, 1500);
    }

    /**
     * Generate mock articles for category
     */
    function generateMockArticles(category, count) {
        const categories = {
            politics: ['elections', 'foreign', 'local'],
            business: ['markets', 'finance', 'entrepreneurship'],
            technology: ['innovation', 'startups', 'gadgets'],
            sports: ['matches', 'tournaments', 'athletes'],
            entertainment: ['movies', 'music', 'celebrities'],
            health: ['medical', 'wellness', 'policy'],
            science: ['discoveries', 'research', 'environment']
        };

        const subcategories = categories[category] || ['general'];
        const images = [
            'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1551836026-d5c2c26b5c6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        ];

        const articles = [];

        for (let i = 0; i < count; i++) {
            const subcategory = subcategories[i % subcategories.length];
            const popularity = ['high', 'medium', 'low'][i % 3];
            const timeAgo = `${(i + 1) * 2} hours ago`;

            articles.push({
                image: images[i % images.length],
                category: subcategory,
                title: `New ${category} development in ${subcategory} sector ${i + 1}`,
                excerpt: `Latest updates and analysis on ${category} developments affecting the ${subcategory} industry and broader implications.`,
                time: timeAgo,
                views: Math.floor(Math.random() * 50000) + 5000,
                popularity: popularity,
                isTrending: i % 4 === 0,
                isBreaking: i % 5 === 0,
                isNew: i % 3 === 0
            });
        }

        return articles;
    }

    /**
     * Create article HTML
     */
    function createArticleHTML(article, index) {
        const badge = article.isTrending ?
            '<span class="trending-badge"><i class="fas fa-fire me-1"></i> Trending</span>' :
            article.isBreaking ?
                '<span class="breaking-badge-sm">BREAKING</span>' :
                article.isNew ?
                    '<span class="new-badge"><i class="fas fa-star me-1"></i> New</span>' :
                    '';

        return `
            <div class="col-md-6 col-lg-6" data-category="${article.category}" data-popularity="${article.popularity}" data-time="${index}">
                <article class="news-card" style="animation-delay: ${index * 0.1}s">
                    <div class="news-image">
                        <img src="${article.image}" alt="${article.title}" class="w-100" loading="lazy">
                    </div>
                    <div class="news-content">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="category-badge ${getCategoryFromURL()}">${article.category.charAt(0).toUpperCase() + article.category.slice(1)}</span>
                            ${badge}
                        </div>
                        <h3 class="news-title">
                            <a href="news.html">${article.title}</a>
                        </h3>
                        <p class="news-excerpt">${article.excerpt}</p>
                        <div class="news-meta">
                            <span><i class="fas fa-clock me-1"></i> ${article.time}</span>
                            <span><i class="fas fa-eye me-1"></i> ${article.views.toLocaleString()}</span>
                        </div>
                    </div>
                </article>
            </div>
        `;
    }

    // ========== INFINITE SCROLL ==========

    /**
     * Initialize infinite scroll
     */
    function initInfiniteScroll() {
        let isLoading = false;
        let currentPage = 1;

        // Only enable on desktop
        if ($(window).width() > 768) {
            $(window).on('scroll', function () {
                if (isLoading) return;

                const scrollTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                const documentHeight = $(document).height();
                const $loadMoreBtn = $('#loadMoreArticles');

                if (!$loadMoreBtn.is(':visible')) return;

                const btnOffset = $loadMoreBtn.offset().top;

                if (scrollTop + windowHeight >= btnOffset - 500) {
                    isLoading = true;
                    loadMoreArticles(currentPage + 1);
                }
            });
        }
    }

    // ========== NEWS CARD INTERACTIONS ==========

    /**
     * Initialize news card interactions
     */
    function initNewsCardInteractions() {
        const $newsCards = $('.news-card');

        $newsCards.each(function () {
            const $card = $(this);
            const $image = $card.find('.news-image img');

            // Hover effects
            $card.hover(
                function () {
                    $card.addClass('hover');
                    if ($image.length) {
                        $image.css('transform', 'scale(1.05)');
                    }
                },
                function () {
                    $card.removeClass('hover');
                    if ($image.length) {
                        $image.css('transform', 'scale(1)');
                    }
                }
            );

            // Click handling
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

    // ========== VIEW COUNTS ==========

    /**
     * Initialize view counts
     */
    function initViewCounts() {
        // Simulate updating view counts
        setInterval(() => {
            $('.news-meta span:nth-child(2)').each(function () {
                const $views = $(this);
                const text = $views.text();
                const match = text.match(/([\d,]+)/);

                if (match) {
                    let count = parseInt(match[1].replace(/,/g, ''));
                    // Add random increment (1-5% of current count)
                    const increment = Math.floor(count * (Math.random() * 0.05 + 0.01));
                    count += increment;

                    $views.html(`<i class="fas fa-eye me-1"></i> ${count.toLocaleString()}`);
                }
            });
        }, 30000); // Update every 30 seconds
    }

    // ========== BOOKMARK FUNCTIONALITY ==========

    /**
     * Initialize bookmark functionality
     */
    function initBookmarkArticles() {
        // Add bookmark buttons to news cards
        $('.news-card .news-content').each(function () {
            const $content = $(this);
            const $bookmarkBtn = $(`
                <button class="bookmark-btn" aria-label="Bookmark article">
                    <i class="far fa-bookmark"></i>
                </button>
            `);

            $content.append($bookmarkBtn);
        });

        // Bookmark click handler
        $(document).on('click', '.bookmark-btn', function (e) {
            e.stopPropagation();

            const $btn = $(this);
            const $icon = $btn.find('i');
            const isBookmarked = $icon.hasClass('fas');

            // Toggle bookmark state
            $icon.toggleClass('far fas');
            $btn.toggleClass('bookmarked');

            // Show feedback
            if (isBookmarked) {
                showNotification('Article removed from bookmarks');
            } else {
                showNotification('Article added to bookmarks');
            }

            // Save to localStorage
            saveBookmark($btn);
        });
    }

    /**
     * Save bookmark to localStorage
     */
    function saveBookmark($btn) {
        const articleTitle = $btn.closest('.news-card').find('.news-title a').text();
        const bookmarks = JSON.parse(localStorage.getItem('gnn_bookmarks') || '[]');
        const isBookmarked = $btn.hasClass('bookmarked');

        if (isBookmarked) {
            // Add to bookmarks
            if (!bookmarks.includes(articleTitle)) {
                bookmarks.push(articleTitle);
            }
        } else {
            // Remove from bookmarks
            const index = bookmarks.indexOf(articleTitle);
            if (index > -1) {
                bookmarks.splice(index, 1);
            }
        }

        localStorage.setItem('gnn_bookmarks', JSON.stringify(bookmarks));
    }

    // ========== SHARE FUNCTIONALITY ==========

    /**
     * Initialize share functionality
     */
    function initShareArticles() {
        // Add share buttons to news cards
        $('.news-card').each(function () {
            const $card = $(this);
            const title = $card.find('.news-title a').text();
            const url = window.location.origin + '/news.html'; // In real app, actual article URL

            const $shareMenu = $(`
                <div class="share-menu">
                    <button class="btn btn-sm btn-light me-1" data-platform="twitter" data-title="${title}" data-url="${url}">
                        <i class="fab fa-twitter"></i>
                    </button>
                    <button class="btn btn-sm btn-light me-1" data-platform="facebook" data-title="${title}" data-url="${url}">
                        <i class="fab fa-facebook-f"></i>
                    </button>
                    <button class="btn btn-sm btn-light" data-platform="linkedin" data-title="${title}" data-url="${url}">
                        <i class="fab fa-linkedin-in"></i>
                    </button>
                </div>
            `);

            $card.find('.news-content').append($shareMenu);
        });

        // Share button handlers
        $(document).on('click', '.share-menu button', function () {
            const platform = $(this).data('platform');
            const title = $(this).data('title');
            const url = $(this).data('url');

            shareArticle(platform, title, url);
        });
    }

    /**
     * Share article
     */
    function shareArticle(platform, title, url) {
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            showNotification(`Shared on ${platform}`);
        }
    }

    // ========== RELATED CATEGORIES ==========

    /**
     * Initialize related categories
     */
    function initRelatedCategories() {
        const $relatedCategories = $('.related-category');

        $relatedCategories.on('click', function (e) {
            e.preventDefault();

            const $link = $(this);
            const category = $link.attr('href').split('cat=')[1];

            // Show loading state
            showLoadingState();

            // Update URL and reload page
            setTimeout(() => {
                window.location.href = `category.html?cat=${category}`;
            }, 500);
        });
    }

    /**
     * Show loading state
     */
    function showLoadingState() {
        const $loadingOverlay = $(`
            <div class="loading-overlay">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Loading category...</p>
            </div>
        `);

        $('body').append($loadingOverlay);
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize category page performance monitoring
     */
    function initCategoryPerformance() {
        // Track page load time
        const loadTime = performance.now();
        console.log(`Category page loaded in ${loadTime}ms`);

        // Monitor image loading
        const $images = $('img');
        let imagesLoaded = 0;

        $images.on('load', function () {
            imagesLoaded++;

            if (imagesLoaded === $images.length) {
                console.log('All category images loaded');
            }
        });

        // Monitor scroll performance
        let scrollFrameCount = 0;
        let lastScrollTime = Date.now();

        $(window).on('scroll', function () {
            scrollFrameCount++;

            const currentTime = Date.now();
            if (currentTime - lastScrollTime >= 1000) {
                const fps = scrollFrameCount;
                scrollFrameCount = 0;
                lastScrollTime = currentTime;

                if (fps < 30) {
                    console.warn(`Low scroll performance: ${fps} FPS`);
                }
            }
        });
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Announce to screen readers
     */
    function announceToScreenReader(message) {
        const $announcer = $('#screen-reader-announcer');
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
     * Show notification
     */
    function showNotification(message) {
        const $notification = $(`
            <div class="notification">
                <div class="notification-content">
                    <i class="fas fa-check-circle me-2"></i>
                    <span>${message}</span>
                </div>
            </div>
        `);

        $('body').append($notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            $notification.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

    // ========== PAGE UNLOAD HANDLING ==========

    /**
     * Clean up before page unload
     */
    function cleanupBeforeUnload() {
        // Stop intervals
        const highestTimeoutId = setTimeout(() => { }, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        // Remove event listeners
        $(window).off('scroll resize');
        $('.filter-btn, .sort-btn, .bookmark-btn, .share-menu button').off('click');
    }

    // Listen for page unload
    $(window).on('beforeunload', cleanupBeforeUnload);
    $(window).on('pagehide', cleanupBeforeUnload);

    // ========== PUBLIC API ==========

    // Expose category functions if needed
    window.GNN = window.GNN || {};
    window.GNN.category = {
        getCurrentCategory: getCategoryFromURL,
        filterBy: filterNewsCards,
        sortBy: sortNewsCards,
        loadMore: loadMoreArticles
    };

    // Log initialization
    console.log('Category page JavaScript initialized');
});