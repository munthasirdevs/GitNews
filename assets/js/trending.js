/* ==============================================
   GLOBAL NEWS NETWORK - TRENDING PAGE JAVASCRIPT
   Trending page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== TRENDING PAGE INITIALIZATION ==========
    initTrendingPage();

    /**
     * Initialize all trending page components
     */
    function initTrendingPage() {
        // Trending Charts
        initTrendingCharts();

        // Filtering
        initTrendingFilters();

        // Sorting
        initTrendingSorting();

        // Load More
        initLoadMoreTrending();

        // Category Navigation
        initCategoryNavigation();

        // Trending Updates
        initRealTimeUpdates();

        // Share Tracking
        initTrendingShareTracking();

        // View Count Updates
        initTrendingViewCounts();

        // Performance Monitoring
        initTrendingPerformance();
    }

    // ========== TRENDING CHARTS ==========

    /**
     * Initialize trending charts using Chart.js (CDN loaded in HTML)
     */
    function initTrendingCharts() {
        // Main Trending Chart
        initMainTrendingChart();

        // Timeline Chart
        initTimelineChart();
    }

    /**
     * Initialize main trending chart
     */
    function initMainTrendingChart() {
        const ctx = document.getElementById('trendingChart');
        if (!ctx) return;

        // Create gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
        gradient.addColorStop(0, 'rgba(255, 107, 53, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0.2)');

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Politics', 'Technology', 'Business', 'Sports', 'Entertainment', 'Health'],
                datasets: [{
                    data: [25, 20, 18, 15, 12, 10],
                    backgroundColor: [
                        '#4285f4',
                        '#34a853',
                        '#ea4335',
                        '#fbbc05',
                        '#ab47bc',
                        '#009688'
                    ],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.parsed}% of trending`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    /**
     * Initialize timeline chart
     */
    function initTimelineChart() {
        const ctx = document.getElementById('timelineChart');
        if (!ctx) return;

        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'Politics',
                        data: [65, 78, 90, 85, 95, 70, 80],
                        borderColor: '#4285f4',
                        backgroundColor: 'rgba(66, 133, 244, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Technology',
                        data: [45, 60, 75, 70, 85, 65, 55],
                        borderColor: '#34a853',
                        backgroundColor: 'rgba(52, 168, 83, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Business',
                        data: [35, 50, 65, 60, 75, 55, 45],
                        borderColor: '#ea4335',
                        backgroundColor: 'rgba(234, 67, 53, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function (value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            display: true,
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                elements: {
                    point: {
                        radius: 4,
                        hoverRadius: 6
                    }
                }
            }
        });
    }

    // ========== FILTERING FUNCTIONALITY ==========

    /**
     * Initialize trending filters
     */
    function initTrendingFilters() {
        const $filterButtons = $('.btn-filter');
        const $trendingItems = $('.trending-item');

        $filterButtons.on('click', function (e) {
            e.preventDefault();
            const $button = $(this);
            const filter = $button.data('filter');

            // Update active button
            $filterButtons.removeClass('active');
            $button.addClass('active');

            // Filter trending items
            filterTrendingItems(filter);

            // Update URL
            updateFilterURL(filter);

            // Announce filter change
            announceToScreenReader(`Showing ${getFilterLabel(filter)} trending`);
        });

        // Check for filter in URL
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            $(`.btn-filter[data-filter="${filterParam}"]`).click();
        }
    }

    /**
     * Filter trending items based on time filter
     */
    function filterTrendingItems(filter) {
        const $trendingItems = $('.trending-item');
        const now = new Date();

        $trendingItems.each(function () {
            const $item = $(this);
            const timeText = $item.data('time');
            const itemTime = parseTimeText(timeText);

            let shouldShow = true;

            switch (filter) {
                case 'today':
                    shouldShow = isToday(itemTime);
                    break;
                case 'week':
                    shouldShow = isThisWeek(itemTime);
                    break;
                case 'month':
                    shouldShow = isThisMonth(itemTime);
                    break;
                default:
                    shouldShow = true;
            }

            if (shouldShow) {
                $item.slideDown(300);
            } else {
                $item.slideUp(300);
            }
        });
    }

    /**
     * Parse time text to Date object
     */
    function parseTimeText(timeText) {
        const now = new Date();
        const match = timeText.match(/(\d+)\s+(hour|minute|second)s?\s+ago/);

        if (match) {
            const amount = parseInt(match[1]);
            const unit = match[2];

            switch (unit) {
                case 'hour':
                    now.setHours(now.getHours() - amount);
                    break;
                case 'minute':
                    now.setMinutes(now.getMinutes() - amount);
                    break;
                case 'second':
                    now.setSeconds(now.getSeconds() - amount);
                    break;
            }
        }

        return now;
    }

    /**
     * Check if date is today
     */
    function isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    /**
     * Check if date is this week
     */
    function isThisWeek(date) {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        return date >= startOfWeek;
    }

    /**
     * Check if date is this month
     */
    function isThisMonth(date) {
        const today = new Date();
        return date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    /**
     * Get filter label for screen readers
     */
    function getFilterLabel(filter) {
        const labels = {
            'all': 'all',
            'today': 'today\'s',
            'week': 'this week\'s',
            'month': 'this month\'s'
        };
        return labels[filter] || 'all';
    }

    /**
     * Update URL with filter parameter
     */
    function updateFilterURL(filter) {
        if (history.pushState) {
            const newURL = filter === 'all' ?
                window.location.pathname :
                `${window.location.pathname}?filter=${filter}`;

            history.pushState(null, '', newURL);
        }
    }

    // ========== SORTING FUNCTIONALITY ==========

    /**
     * Initialize trending sorting
     */
    function initTrendingSorting() {
        const $sortDropdown = $('#sortDropdown');
        const $sortItems = $('.dropdown-item[data-sort]');
        const $trendingList = $('.trending-list');

        $sortItems.on('click', function (e) {
            e.preventDefault();
            const $item = $(this);
            const sortBy = $item.data('sort');

            // Update dropdown text
            $sortDropdown.text(`Sort by: ${getSortLabel(sortBy)}`);

            // Sort trending items
            sortTrendingItems(sortBy);

            // Announce sort
            announceToScreenReader(`Sorted by ${getSortLabel(sortBy)}`);
        });
    }

    /**
     * Sort trending items
     */
    function sortTrendingItems(sortBy) {
        const $trendingItems = $('.trending-item');
        const $trendingList = $('.trending-list');

        // Convert to array for sorting
        const itemsArray = $trendingItems.toArray();

        itemsArray.sort(function (a, b) {
            const $a = $(a);
            const $b = $(b);

            switch (sortBy) {
                case 'views':
                    return compareTrendingStats($a.data('views'), $b.data('views'));
                case 'shares':
                    return compareTrendingStats($a.data('shares'), $b.data('shares'));
                case 'comments':
                    // Extract comments from stats
                    const aComments = extractComments($a.find('.trending-stats').text());
                    const bComments = extractComments($b.find('.trending-stats').text());
                    return bComments - aComments;
                case 'recent':
                    return compareTime($a.data('time'), $b.data('time'));
                default:
                    return 0;
            }
        });

        // Reorder DOM
        $trendingList.empty();
        itemsArray.forEach(function (item) {
            $trendingList.append(item);
        });

        // Update rank numbers
        updateRankNumbers();
    }

    /**
     * Compare trending stats
     */
    function compareTrendingStats(statA, statB) {
        const valueA = parseStatValue(statA);
        const valueB = parseStatValue(statB);
        return valueB - valueA;
    }

    /**
     * Parse stat value (handles K, M suffixes)
     */
    function parseStatValue(stat) {
        if (typeof stat === 'string') {
            if (stat.includes('M')) {
                return parseFloat(stat) * 1000000;
            } else if (stat.includes('K')) {
                return parseFloat(stat) * 1000;
            }
            return parseFloat(stat);
        }
        return stat;
    }

    /**
     * Extract comments count from text
     */
    function extractComments(text) {
        const match = text.match(/([\d.]+)([KM]?)\s+comments/);
        if (match) {
            return parseStatValue(match[1] + (match[2] || ''));
        }
        return 0;
    }

    /**
     * Compare time values
     */
    function compareTime(timeA, timeB) {
        const dateA = parseTimeText(timeA);
        const dateB = parseTimeText(timeB);
        return dateB - dateA;
    }

    /**
     * Get sort label
     */
    function getSortLabel(sortBy) {
        const labels = {
            'views': 'Most Viewed',
            'shares': 'Most Shared',
            'comments': 'Most Comments',
            'recent': 'Most Recent'
        };
        return labels[sortBy] || 'Most Viewed';
    }

    /**
     * Update rank numbers after sorting
     */
    function updateRankNumbers() {
        $('.trending-item').each(function (index) {
            const $item = $(this);
            const $rankNumber = $item.find('.rank-number');
            $rankNumber.text(index + 1);

            // Update rank change indicator
            const oldRank = parseInt($item.data('original-rank') || (index + 1));
            const $rankChange = $item.find('.rank-change');

            if (oldRank !== (index + 1)) {
                const change = oldRank - (index + 1);
                if (change > 0) {
                    $rankChange.html(`<i class="fas fa-arrow-up"></i> ${change}`);
                    $rankChange.removeClass('down new').addClass('up');
                } else if (change < 0) {
                    $rankChange.html(`<i class="fas fa-arrow-down"></i> ${Math.abs(change)}`);
                    $rankChange.removeClass('up new').addClass('down');
                }
            }
        });
    }

    // ========== LOAD MORE FUNCTIONALITY ==========

    /**
     * Initialize load more functionality
     */
    function initLoadMoreTrending() {
        const $loadMoreBtn = $('#loadMoreTrending');
        let isLoading = false;
        let page = 1;

        // Store original items
        storeOriginalRanks();

        $loadMoreBtn.on('click', function () {
            if (isLoading) return;

            isLoading = true;
            loadMoreTrendingStories(page + 1);
        });

        // Infinite scroll for mobile
        if ($(window).width() < 768) {
            $(window).on('scroll', function () {
                if (isLoading || !$loadMoreBtn.is(':visible')) return;

                const scrollTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                const btnOffset = $loadMoreBtn.offset().top;

                if (scrollTop + windowHeight >= btnOffset - 200) {
                    isLoading = true;
                    loadMoreTrendingStories(page + 1);
                }
            });
        }
    }

    /**
     * Store original ranks of trending items
     */
    function storeOriginalRanks() {
        $('.trending-item').each(function (index) {
            $(this).data('original-rank', index + 1);
        });
    }

    /**
     * Load more trending stories
     */
    function loadMoreTrendingStories(nextPage) {
        const $loadMoreBtn = $('#loadMoreTrending');
        const $trendingList = $('.trending-list');

        // Show loading state
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // Mock data for demonstration
            const mockStories = [
                {
                    rank: 6,
                    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    category: 'business',
                    title: 'Major Retail Chain Announces Nationwide Expansion Plan',
                    excerpt: 'New stores and distribution centers planned across the country, creating thousands of jobs and boosting local economies.',
                    views: '540K',
                    shares: '18K',
                    comments: '2.8K',
                    time: '1 day ago'
                },
                {
                    rank: 7,
                    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    category: 'science',
                    title: 'New Deep Sea Species Discovered in Mariana Trench',
                    excerpt: 'Scientists identify previously unknown marine life forms in the deepest parts of the ocean, challenging our understanding of marine biology.',
                    views: '480K',
                    shares: '15K',
                    comments: '3.1K',
                    time: '2 days ago'
                },
                {
                    rank: 8,
                    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                    category: 'entertainment',
                    title: 'Streaming Platform Announces Major Content Partnership Deals',
                    excerpt: 'Exclusive agreements signed with major studios to bring premium content to subscribers worldwide.',
                    views: '420K',
                    shares: '12K',
                    comments: '1.9K',
                    time: '2 days ago'
                }
            ];

            // Add new stories
            mockStories.forEach((story, index) => {
                const trendingItemHtml = `
                    <div class="trending-item" data-category="${story.category}" data-views="${story.views}" data-shares="${story.shares}" data-time="${story.time}" data-original-rank="${story.rank}" style="animation-delay: ${(index * 0.1) + 0.6}s">
                        <div class="trending-rank">
                            <span class="rank-number">${story.rank}</span>
                            <div class="rank-change new">
                                <span class="new-badge">NEW</span>
                            </div>
                        </div>
                        <div class="trending-content">
                            <div class="trending-image">
                                <img src="${story.image}" alt="${story.title}" loading="lazy">
                            </div>
                            <div class="trending-details">
                                <span class="category-badge ${story.category}">${story.category.charAt(0).toUpperCase() + story.category.slice(1)}</span>
                                <h3 class="trending-title">
                                    <a href="news.html">${story.title}</a>
                                </h3>
                                <p class="trending-excerpt">${story.excerpt}</p>
                                <div class="trending-meta">
                                    <span class="trending-stats">
                                        <i class="fas fa-eye"></i> ${story.views} views
                                        <i class="fas fa-share-alt ms-3"></i> ${story.shares} shares
                                        <i class="fas fa-comment ms-3"></i> ${story.comments} comments
                                    </span>
                                    <span class="trending-time">
                                        <i class="fas fa-clock"></i> ${story.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $trendingList.append(trendingItemHtml);
            });

            // Update page counter
            page = nextPage;

            // Reset button state
            $loadMoreBtn.html('<i class="fas fa-sync-alt me-2"></i> Load More Trending Stories');
            $loadMoreBtn.prop('disabled', false);
            isLoading = false;

            // Update stats
            updateTrendingStats();

            // Announce to screen readers
            announceToScreenReader('Loaded more trending stories');

            // Hide button if we've loaded enough stories
            if (page >= 3) {
                $loadMoreBtn.fadeOut(300);
                announceToScreenReader('All trending stories loaded');
            }
        }, 1500);
    }

    // ========== CATEGORY NAVIGATION ==========

    /**
     * Initialize category navigation
     */
    function initCategoryNavigation() {
        const $categoryTrends = $('.category-trend');

        $categoryTrends.on('click', function (e) {
            e.preventDefault();
            const $trend = $(this);
            const category = $trend.data('category');

            // Highlight active category
            $categoryTrends.removeClass('active');
            $trend.addClass('active');

            // Filter by category
            filterByCategory(category);

            // Announce filter
            announceToScreenReader(`Filtering trending stories by ${category}`);
        });

        // Category filter from URL
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        if (categoryParam) {
            $(`.category-trend[data-category="${categoryParam}"]`).click();
        }
    }

    /**
     * Filter trending items by category
     */
    function filterByCategory(category) {
        const $trendingItems = $('.trending-item');

        $trendingItems.each(function () {
            const $item = $(this);
            const itemCategory = $item.data('category');

            if (category === 'all' || itemCategory === category) {
                $item.slideDown(300);
            } else {
                $item.slideUp(300);
            }
        });
    }

    // ========== REAL-TIME UPDATES ==========

    /**
     * Initialize real-time trending updates
     */
    function initRealTimeUpdates() {
        // Update trending stats every minute
        setInterval(updateTrendingStats, 60000);

        // Simulate real-time rank changes
        setInterval(simulateRankChanges, 30000);

        // Update time labels
        setInterval(updateTimeLabels, 60000);
    }

    /**
     * Update trending stats
     */
    function updateTrendingStats() {
        // Update view counts
        $('.trending-item').each(function () {
            const $item = $(this);
            const currentViews = parseStatValue($item.data('views'));
            const increment = Math.random() * 0.05 * currentViews; // 0-5% increase

            const newViews = currentViews + increment;
            $item.data('views', formatStatValue(newViews));

            // Update display if visible
            const $viewsElement = $item.find('.trending-stats').contents().filter(function () {
                return this.nodeType === 3 && this.textContent.includes('views');
            }).prev('i').parent();

            if ($viewsElement.length) {
                $viewsElement.html(`<i class="fas fa-eye"></i> ${formatStatValue(newViews)} views`);
            }
        });

        // Update overall stats
        updateOverallStats();
    }

    /**
     * Format stat value with K/M suffix
     */
    function formatStatValue(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        }
        return Math.round(value).toString();
    }

    /**
     * Update overall stats in hero
     */
    function updateOverallStats() {
        // Calculate total views
        let totalViews = 0;
        $('.trending-item').each(function () {
            totalViews += parseStatValue($(this).data('views'));
        });

        // Update display
        $('.trending-stats .stat-item:first-child strong').text(formatStatValue(totalViews));

        // Update time
        $('.trending-stats .stat-item:last-child strong').text('just now');
    }

    /**
     * Simulate rank changes
     */
    function simulateRankChanges() {
        const $trendingItems = $('.trending-item');

        // Only simulate if not currently sorting
        if ($('#sortDropdown').text().includes('Most Viewed')) {
            $trendingItems.each(function (index) {
                const $item = $(this);
                const currentRank = index + 1;

                // Small chance to change rank
                if (Math.random() > 0.7) {
                    const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
                    if (change !== 0) {
                        const newRank = Math.max(1, Math.min($trendingItems.length, currentRank + change));

                        // Move item in DOM
                        if (newRank !== currentRank) {
                            $item.detach();
                            if (newRank < currentRank) {
                                $item.insertBefore($trendingItems.eq(newRank - 1));
                            } else {
                                $item.insertAfter($trendingItems.eq(newRank - 1));
                            }

                            // Update rank display
                            updateRankChangeIndicator($item, currentRank, newRank);
                        }
                    }
                }
            });

            // Re-select items after DOM changes
            updateRankNumbers();
        }
    }

    /**
     * Update rank change indicator
     */
    function updateRankChangeIndicator($item, oldRank, newRank) {
        const $rankChange = $item.find('.rank-change');
        const change = oldRank - newRank;

        if (change > 0) {
            $rankChange.html(`<i class="fas fa-arrow-up"></i> ${change}`);
            $rankChange.removeClass('down new').addClass('up');
        } else if (change < 0) {
            $rankChange.html(`<i class="fas fa-arrow-down"></i> ${Math.abs(change)}`);
            $rankChange.removeClass('up new').addClass('down');
        }

        // Highlight change
        $item.addClass('rank-updated');
        setTimeout(() => {
            $item.removeClass('rank-updated');
        }, 2000);
    }

    /**
     * Update time labels
     */
    function updateTimeLabels() {
        $('.trending-item').each(function () {
            const $item = $(this);
            const timeText = $item.data('time');
            const $timeElement = $item.find('.trending-time');

            if ($timeElement.length && timeText) {
                const newTime = updateTimeText(timeText);
                $timeElement.html(`<i class="fas fa-clock"></i> ${newTime}`);
            }
        });
    }

    /**
     * Update time text
     */
    function updateTimeText(timeText) {
        const match = timeText.match(/(\d+)\s+(hour|minute|second)s?\s+ago/);
        if (match) {
            const amount = parseInt(match[1]);
            const unit = match[2];

            // Increment time
            const newAmount = amount + 1;
            if (unit === 'second' && newAmount >= 60) {
                return '1 minute ago';
            } else if (unit === 'minute' && newAmount >= 60) {
                return '1 hour ago';
            } else if (unit === 'hour' && newAmount >= 24) {
                return '1 day ago';
            }
            return `${newAmount} ${unit}${newAmount > 1 ? 's' : ''} ago`;
        }
        return timeText;
    }

    // ========== SHARE TRACKING ==========

    /**
     * Initialize share tracking
     */
    function initTrendingShareTracking() {
        // Add share buttons to trending items
        addShareButtons();

        // Track clicks on trending items
        trackTrendingClicks();
    }

    /**
     * Add share buttons to trending items
     */
    function addShareButtons() {
        $('.trending-item').each(function () {
            const $item = $(this);
            const title = $item.find('.trending-title a').text();
            const url = window.location.origin + '/news.html';

            const shareHtml = `
                <div class="trending-share">
                    <button class="btn btn-sm btn-outline-secondary share-btn" data-platform="twitter" data-title="${title}" data-url="${url}">
                        <i class="fab fa-twitter"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary share-btn" data-platform="facebook" data-title="${title}" data-url="${url}">
                        <i class="fab fa-facebook-f"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary share-btn" data-platform="linkedin" data-title="${title}" data-url="${url}">
                        <i class="fab fa-linkedin-in"></i>
                    </button>
                </div>
            `;

            $item.find('.trending-meta').append(shareHtml);
        });

        // Share button click handlers
        $(document).on('click', '.share-btn', function () {
            const platform = $(this).data('platform');
            const title = $(this).data('title');
            const url = $(this).data('url');

            shareTrendingStory(platform, title, url);
        });
    }

    /**
     * Share trending story
     */
    function shareTrendingStory(platform, title, url) {
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent('Trending: ' + title)}&url=${encodeURIComponent(url)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            trackShare(platform, title);
        }
    }

    /**
     * Track trending clicks
     */
    function trackTrendingClicks() {
        $('.trending-title a').on('click', function (e) {
            const $link = $(this);
            const title = $link.text();
            const rank = $link.closest('.trending-item').find('.rank-number').text();

            // Track click for analytics
            trackTrendingClick(title, rank);
        });
    }

    // ========== VIEW COUNT UPDATES ==========

    /**
     * Initialize view count updates
     */
    function initTrendingViewCounts() {
        // Simulate view count increases
        setInterval(incrementViewCounts, 30000);
    }

    /**
     * Increment view counts
     */
    function incrementViewCounts() {
        $('.trending-item').each(function () {
            const $item = $(this);
            const currentViews = parseStatValue($item.data('views'));
            const increment = Math.random() * 0.01 * currentViews; // 0-1% increase

            const newViews = currentViews + increment;
            $item.data('views', formatStatValue(newViews));

            // Update display
            const $viewsElement = $item.find('.trending-stats').contents().filter(function () {
                return this.nodeType === 3 && this.textContent.includes('views');
            }).prev('i').parent();

            if ($viewsElement.length) {
                $viewsElement.html(`<i class="fas fa-eye"></i> ${formatStatValue(newViews)} views`);
            }
        });
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize trending performance monitoring
     */
    function initTrendingPerformance() {
        // Monitor chart rendering performance
        const chartLoadStart = performance.now();

        $(window).on('load', function () {
            const chartLoadTime = performance.now() - chartLoadStart;
            if (chartLoadTime > 1000) {
                console.warn(`Charts loaded in ${chartLoadTime}ms - Consider optimizing`);
            }
        });

        // Monitor scroll performance
        let lastScrollTime = Date.now();
        $(window).on('scroll', function () {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTime;

            if (timeDiff < 16) { // 60fps threshold
                console.warn('Scroll performance issue on trending page');
            }

            lastScrollTime = currentTime;
        });
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Announce message to screen readers
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
     * Track trending click for analytics
     */
    function trackTrendingClick(title, rank) {
        console.log(`Trending story clicked: "${title}" (Rank: ${rank})`);
        // In real implementation:
        // gtag('event', 'trending_click', {
        //     'event_category': 'engagement',
        //     'event_label': title,
        //     'value': rank
        // });
    }

    /**
     * Track share for analytics
     */
    function trackShare(platform, title) {
        console.log(`Trending story shared on ${platform}: "${title}"`);
        // In real implementation:
        // gtag('event', 'trending_share', {
        //     'event_category': platform,
        //     'event_label': title
        // });
    }

    // ========== ERROR HANDLING ==========

    /**
     * Handle trending page errors
     */
    function initTrendingErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Trending page error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });

            // Fallback for chart errors
            if (e.filename && e.filename.includes('chart')) {
                $('.chart-container').html('<p class="text-muted">Chart unavailable. Displaying trending data in list format.</p>');
            }

            return false;
        });

        // Handle failed image loads
        $(document).on('error', '.trending-image img', function () {
            $(this).attr('src', 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80');
        });
    }

    // Initialize error handling
    initTrendingErrorHandling();

    // ========== PUBLIC API ==========

    // Expose trending page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.trending = {
        filterTrendingItems: filterTrendingItems,
        sortTrendingItems: sortTrendingItems,
        loadMoreTrendingStories: loadMoreTrendingStories,
        updateTrendingStats: updateTrendingStats
    };

    // Log initialization
    console.log('Trending page JavaScript initialized');
});