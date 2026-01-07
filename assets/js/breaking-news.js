/* ==============================================
   GLOBAL NEWS NETWORK - BREAKING NEWS PAGE JAVASCRIPT
   Breaking news page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== BREAKING NEWS INITIALIZATION ==========
    initBreakingNewsPage();

    /**
     * Initialize all breaking news page components
     */
    function initBreakingNewsPage() {
        // Breaking News Ticker
        initBreakingTicker();

        // Filter Functionality
        initBreakingFilters();

        // Live Updates
        initLiveUpdates();

        // Load More Breaking News
        initLoadMoreBreaking();

        // Emergency Alerts
        initEmergencyAlerts();

        // Auto Refresh
        initAutoRefresh();

        // View Counter
        initBreakingViewCounter();

        // Notification System
        initBreakingNotifications();

        // Performance Monitoring
        initBreakingPerformance();
    }

    // ========== BREAKING NEWS TICKER ==========

    /**
     * Initialize breaking news ticker with emergency alerts
     */
    function initBreakingTicker() {
        const $marquee = $('.breaking-news-ticker marquee');
        const $tickerContent = $marquee.find('span');
        const emergencyAlerts = [
            "🚨 BREAKING: Major Earthquake Hits Coastal Region - Emergency Services Responding •",
            "🚨 FLASH: Diplomatic Crisis Escalates Between Major Powers •",
            "🚨 URGENT: Severe Weather Warning Issued for Multiple States •",
            "🚨 ALERT: Major Hospital System Reports Critical Supply Shortage •",
            "🚨 BREAKING: Supreme Court Issues Emergency Ruling •"
        ];

        let currentAlert = 0;

        // Update ticker every 8 seconds
        const tickerInterval = setInterval(() => {
            currentAlert = (currentAlert + 1) % emergencyAlerts.length;
            updateTickerAlert(emergencyAlerts[currentAlert]);
        }, 8000);

        // Update ticker content with animation
        function updateTickerAlert(alertText) {
            // Create fade effect
            $tickerContent.fadeOut(300, function () {
                $(this).text(alertText).fadeIn(300);
            });

            // Play alert sound for critical alerts
            if (alertText.includes('🚨 BREAKING:') || alertText.includes('🚨 URGENT:')) {
                playAlertSound();
            }
        }

        // Pause ticker on hover
        $('.breaking-news-ticker').hover(
            function () {
                $marquee.attr('scrollamount', '0');
                clearInterval(tickerInterval);
            },
            function () {
                $marquee.attr('scrollamount', '4');
                // Restart interval
                setInterval(() => {
                    currentAlert = (currentAlert + 1) % emergencyAlerts.length;
                    updateTickerAlert(emergencyAlerts[currentAlert]);
                }, 8000);
            }
        );
    }

    /**
     * Play alert sound for breaking news
     */
    function playAlertSound() {
        // Create audio context for alert sound
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);

            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (e) {
            console.log('Audio context not supported or permission denied');
        }
    }

    // ========== FILTER FUNCTIONALITY ==========

    /**
     * Initialize breaking news filtering
     */
    function initBreakingFilters() {
        const $filterButtons = $('.filter-btn');
        const $breakingItems = $('.breaking-item');
        const $sortSelect = $('#sortBreaking');

        // Filter button click handlers
        $filterButtons.on('click', function (e) {
            e.preventDefault();
            const $button = $(this);
            const filter = $button.data('filter');

            // Update active button
            $filterButtons.removeClass('active');
            $button.addClass('active');

            // Apply filter
            filterBreakingNews(filter);

            // Announce filter change
            announceToScreenReader(`Filtering breaking news by ${filter}`);
        });

        // Sort select change handler
        $sortSelect.on('change', function () {
            const sortBy = $(this).val();
            sortBreakingNews(sortBy);
        });
    }

    /**
     * Filter breaking news by category
     */
    function filterBreakingNews(filter) {
        const $breakingItems = $('.breaking-item');

        if (filter === 'all') {
            // Show all items with fade animation
            $breakingItems.each(function (index) {
                const $item = $(this);
                setTimeout(() => {
                    $item.css('display', 'block').css('opacity', '0').animate({ opacity: 1 }, 300);
                }, index * 50);
            });
        } else {
            // Hide all items first
            $breakingItems.css('opacity', '0.3');

            // Show filtered items with animation
            $breakingItems.each(function (index) {
                const $item = $(this);
                const category = $item.data('category');

                if (category === filter) {
                    setTimeout(() => {
                        $item.css('display', 'block').css('opacity', '0').animate({ opacity: 1 }, 300);
                    }, index * 50);
                } else {
                    $item.hide();
                }
            });
        }

        // Update count display
        updateFilterCount(filter);
    }

    /**
     * Update filter count display
     */
    function updateFilterCount(filter) {
        let count = 0;
        if (filter === 'all') {
            count = $('.breaking-item').length;
        } else {
            count = $(`.breaking-item[data-category="${filter}"]`).length;
        }

        // Update breaking count
        $('#breakingCount').text(count);
    }

    /**
     * Sort breaking news by criteria
     */
    function sortBreakingNews(sortBy) {
        const $breakingFeed = $('#breakingFeed');
        const $breakingItems = $('.breaking-item');

        let sortedItems = $breakingItems.toArray();

        switch (sortBy) {
            case 'latest':
                sortedItems.sort((a, b) => {
                    const timeA = parseInt($(a).find('.breaking-time').text());
                    const timeB = parseInt($(b).find('.breaking-time').text());
                    return timeA - timeB;
                });
                break;

            case 'important':
                sortedItems.sort((a, b) => {
                    const isCriticalA = $(a).hasClass('critical');
                    const isCriticalB = $(b).hasClass('critical');
                    const isImportantA = $(a).hasClass('important');
                    const isImportantB = $(b).hasClass('important');

                    if (isCriticalA && !isCriticalB) return -1;
                    if (!isCriticalA && isCriticalB) return 1;
                    if (isImportantA && !isImportantB) return -1;
                    if (!isImportantA && isImportantB) return 1;
                    return 0;
                });
                break;

            case 'regional':
                // Sort by region priority (demo)
                sortedItems.sort((a, b) => {
                    const regionA = $(a).find('.fa-map-marker-alt').parent().text().toLowerCase();
                    const regionB = $(b).find('.fa-map-marker-alt').parent().text().toLowerCase();
                    return regionA.localeCompare(regionB);
                });
                break;

            case 'verified':
                sortedItems.sort((a, b) => {
                    const verifiedA = $(a).find('.fa-shield-alt').length > 0;
                    const verifiedB = $(b).find('.fa-shield-alt').length > 0;
                    if (verifiedA && !verifiedB) return -1;
                    if (!verifiedA && verifiedB) return 1;
                    return 0;
                });
                break;
        }

        // Re-append sorted items with animation
        $breakingFeed.empty();
        sortedItems.forEach((item, index) => {
            setTimeout(() => {
                $breakingFeed.append(item);
                $(item).css('opacity', '0').animate({ opacity: 1 }, 300);
            }, index * 100);
        });
    }

    // ========== LIVE UPDATES ==========

    /**
     * Initialize live updates feed
     */
    function initLiveUpdates() {
        const $liveUpdatesFeed = $('#liveUpdatesFeed');
        const $refreshButton = $('#refreshUpdates');
        let updateCount = 0;

        // Refresh button click handler
        $refreshButton.on('click', function () {
            refreshLiveUpdates();
        });

        // Auto-add new updates
        setInterval(() => {
            addLiveUpdate();
        }, 15000); // Every 15 seconds

        // Simulate initial updates
        setTimeout(() => {
            addLiveUpdate();
        }, 5000);
    }

    /**
     * Add a new live update
     */
    function addLiveUpdate() {
        const $liveUpdatesFeed = $('#liveUpdatesFeed');
        const updateTemplates = [
            {
                time: getCurrentTime(),
                content: "Emergency services report progress in wildfire containment efforts.",
                tag: "Wildfire"
            },
            {
                time: getCurrentTime(),
                content: "Additional aid confirmed for earthquake-affected regions.",
                tag: "Earthquake"
            },
            {
                time: getCurrentTime(),
                content: "Diplomatic talks show positive developments at UN session.",
                tag: "Politics"
            },
            {
                time: getCurrentTime(),
                content: "Medical supply chain improving, hospitals report.",
                tag: "Health"
            },
            {
                time: getCurrentTime(),
                content: "Weather system moving out of affected areas.",
                tag: "Weather"
            }
        ];

        const randomUpdate = updateTemplates[Math.floor(Math.random() * updateTemplates.length)];
        const updateId = Date.now();

        const updateHtml = `
            <div class="live-update new" id="update-${updateId}">
                <div class="live-time">${randomUpdate.time}</div>
                <div class="live-content">
                    <p class="mb-1">${randomUpdate.content}</p>
                    <span class="live-tag">${randomUpdate.tag}</span>
                </div>
            </div>
        `;

        // Prepend new update with animation
        $liveUpdatesFeed.prepend(updateHtml);
        const $newUpdate = $(`#update-${updateId}`);

        // Animate in
        $newUpdate.css('opacity', '0').animate({ opacity: 1 }, 300);

        // Remove "new" class after animation
        setTimeout(() => {
            $newUpdate.removeClass('new');
        }, 2000);

        // Update counter
        updateLiveUpdatesCount();

        // Keep only last 10 updates
        const $updates = $('.live-update');
        if ($updates.length > 10) {
            $updates.last().remove();
        }

        // Announce new update to screen readers
        announceToScreenReader(`New update: ${randomUpdate.content}`);
    }

    /**
     * Refresh live updates
     */
    function refreshLiveUpdates() {
        const $refreshButton = $('#refreshUpdates');
        const $liveUpdatesFeed = $('#liveUpdatesFeed');

        // Show loading state
        $refreshButton.html('<i class="fas fa-spinner fa-spin me-1"></i>Refreshing');
        $refreshButton.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // Clear existing updates
            $liveUpdatesFeed.empty();

            // Add fresh updates
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    addLiveUpdate();
                }, i * 200);
            }

            // Reset button
            $refreshButton.html('<i class="fas fa-redo me-1"></i>Refresh Updates');
            $refreshButton.prop('disabled', false);

            // Announce refresh
            announceToScreenReader('Live updates refreshed');
        }, 1500);
    }

    /**
     * Get current time in HH:MM format
     */
    function getCurrentTime() {
        const now = new Date();
        return now.getHours().toString().padStart(2, '0') + ':' +
            now.getMinutes().toString().padStart(2, '0');
    }

    /**
     * Update live updates count
     */
    function updateLiveUpdatesCount() {
        const $liveUpdates = $('.live-update');
        $('#liveUpdates').text($liveUpdates.length);
    }

    // ========== LOAD MORE BREAKING NEWS ==========

    /**
     * Initialize load more functionality
     */
    function initLoadMoreBreaking() {
        const $loadMoreBtn = $('#loadMoreBreaking');
        let isLoading = false;
        let page = 1;

        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();

            if (isLoading) return;

            isLoading = true;
            loadMoreBreakingNews(page + 1);
        });
    }

    /**
     * Load more breaking news
     */
    function loadMoreBreakingNews(nextPage) {
        const $loadMoreBtn = $('#loadMoreBreaking');
        const $breakingFeed = $('#breakingFeed');

        // Show loading state
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // Mock data for additional breaking news
            const mockBreakingNews = [
                {
                    category: 'security',
                    type: 'important',
                    badge: 'SECURITY',
                    time: '3 hours ago',
                    icon: 'fas fa-shield-alt',
                    iconColor: 'text-info',
                    title: 'Cyber Attack Targets Major Financial Institutions',
                    excerpt: 'Coordinated cyber attack hits multiple banks, prompting emergency response from cybersecurity agencies.',
                    location: 'Financial District',
                    author: 'Cyber Security Team',
                    views: '42K',
                    updates: '6 updates'
                },
                {
                    category: 'weather',
                    type: '',
                    badge: 'WEATHER',
                    time: '3.5 hours ago',
                    icon: 'fas fa-tornado',
                    iconColor: 'text-warning',
                    title: 'Tornado Warning Issued for Central Plains',
                    excerpt: 'National Weather Service issues tornado warning as severe storms move across central states.',
                    location: 'Central Plains',
                    author: 'Weather Bureau',
                    views: '38K',
                    updates: ''
                },
                {
                    category: 'health',
                    type: '',
                    badge: 'HEALTH',
                    time: '4 hours ago',
                    icon: 'fas fa-virus',
                    iconColor: 'text-success',
                    title: 'New Virus Strain Identified - Health Alert Issued',
                    excerpt: 'Health authorities identify new virus strain, issue alert for healthcare providers nationwide.',
                    location: 'National',
                    author: 'Health Department',
                    views: '51K',
                    updates: '4 updates'
                }
            ];

            // Create and append new breaking news items
            mockBreakingNews.forEach((news, index) => {
                const breakingItemHtml = `
                    <article class="breaking-item ${news.type}" data-category="${news.category}" style="animation-delay: ${(index * 0.1) + 0.1}s">
                        <div class="breaking-item-header">
                            <span class="breaking-badge ${news.category}">${news.badge}</span>
                            <span class="breaking-time">${news.time}</span>
                        </div>
                        <div class="breaking-item-content">
                            <h3 class="breaking-item-title">
                                <a href="news.html">
                                    <i class="${news.icon} ${news.iconColor} me-2"></i>
                                    ${news.title}
                                </a>
                            </h3>
                            <p class="breaking-item-excerpt">${news.excerpt}</p>
                            <div class="breaking-item-meta">
                                <span><i class="fas fa-map-marker-alt me-1"></i> ${news.location}</span>
                                <span><i class="fas fa-user me-1"></i> ${news.author}</span>
                                <span><i class="fas fa-eye me-1"></i> ${news.views} tracking</span>
                            </div>
                            ${news.updates ? `
                                <div class="breaking-item-updates">
                                    <span class="update-badge">LIVE UPDATES</span>
                                    <span class="update-count">${news.updates} in last hour</span>
                                </div>
                            ` : ''}
                        </div>
                    </article>
                `;

                $breakingFeed.append(breakingItemHtml);
            });

            // Update page counter
            page = nextPage;

            // Reset button state
            $loadMoreBtn.html('<i class="fas fa-sync-alt me-2"></i> Load More Breaking News');
            $loadMoreBtn.prop('disabled', false);
            isLoading = false;

            // Update breaking count
            updateBreakingCount();

            // Announce to screen readers
            announceToScreenReader('Loaded more breaking news');

            // Hide button if we've loaded enough (demo)
            if (page >= 3) {
                $loadMoreBtn.html('<i class="fas fa-check-circle me-2"></i> All Breaking News Loaded');
                $loadMoreBtn.prop('disabled', true);
                $loadMoreBtn.removeClass('btn-outline-danger').addClass('btn-outline-secondary');
            }
        }, 2000);
    }

    /**
     * Update breaking news count
     */
    function updateBreakingCount() {
        const count = $('.breaking-item').length;
        $('#breakingCount').text(count);
    }

    // ========== EMERGENCY ALERTS ==========

    /**
     * Initialize emergency alert system
     */
    function initEmergencyAlerts() {
        const $enableAlertsBtn = $('#enableAlerts');

        $enableAlertsBtn.on('click', function () {
            requestNotificationPermission();
        });

        // Check for existing permission
        checkNotificationPermission();
    }

    /**
     * Request notification permission
     */
    function requestNotificationPermission() {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notifications');
            return;
        }

        if (Notification.permission === 'granted') {
            showAlertEnabled();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showAlertEnabled();
                    // Send test notification
                    sendTestNotification();
                }
            });
        }
    }

    /**
     * Check notification permission status
     */
    function checkNotificationPermission() {
        if (Notification.permission === 'granted') {
            $('#enableAlerts')
                .html('<i class="fas fa-bell-slash me-2"></i>Disable Alerts')
                .removeClass('btn-danger')
                .addClass('btn-secondary');
            $('#emergencyAlerts').text('Active');
        }
    }

    /**
     * Show alert enabled confirmation
     */
    function showAlertEnabled() {
        const $button = $('#enableAlerts');
        $button.html('<i class="fas fa-check-circle me-2"></i>Alerts Enabled');
        $button.removeClass('btn-danger').addClass('btn-success');
        $button.prop('disabled', true);

        // Update emergency alerts count
        $('#emergencyAlerts').text('Active');

        // Show confirmation message
        showAlertMessage('Breaking news alerts enabled! You will now receive notifications for critical updates.', 'success');
    }

    /**
     * Send test notification
     */
    function sendTestNotification() {
        if (Notification.permission === 'granted') {
            const notification = new Notification('GNN Breaking News Alerts', {
                body: 'Breaking news alerts enabled successfully. You will now receive notifications for critical updates.',
                icon: './assets/images/favicon.ico',
                badge: './assets/images/favicon.ico'
            });

            notification.onclick = function () {
                window.focus();
                notification.close();
            };
        }
    }

    /**
     * Show alert message
     */
    function showAlertMessage(message, type) {
        // Remove existing alerts
        $('.alert-message').remove();

        const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show alert-message" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        $('.breaking-header').after(alertHtml);
    }

    // ========== AUTO REFRESH ==========

    /**
     * Initialize auto-refresh functionality
     */
    function initAutoRefresh() {
        let lastRefreshTime = Date.now();
        const refreshInterval = 30000; // 30 seconds

        // Auto-refresh breaking news
        setInterval(() => {
            const now = Date.now();
            if (now - lastRefreshTime >= refreshInterval) {
                refreshBreakingNews();
                lastRefreshTime = now;
            }
        }, refreshInterval);

        // Monitor page visibility
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                // Page became visible, refresh if it's been a while
                const now = Date.now();
                if (now - lastRefreshTime >= refreshInterval * 2) {
                    refreshBreakingNews();
                    lastRefreshTime = now;
                }
            }
        });
    }

    /**
     * Refresh breaking news
     */
    function refreshBreakingNews() {
        // Simulate checking for new breaking news
        const shouldAddNew = Math.random() > 0.5;

        if (shouldAddNew) {
            // Add a new breaking news item at the top
            const newBreakingItem = {
                category: ['emergency', 'politics', 'weather', 'security', 'health'][Math.floor(Math.random() * 5)],
                type: Math.random() > 0.7 ? 'critical' : Math.random() > 0.5 ? 'important' : '',
                badge: ['EMERGENCY', 'POLITICS', 'WEATHER', 'SECURITY', 'HEALTH'][Math.floor(Math.random() * 5)],
                time: 'Just now',
                icon: 'fas fa-exclamation-circle',
                iconColor: 'text-danger',
                title: 'New Breaking News Update - Developing Situation',
                excerpt: 'New information has just been received about an ongoing breaking news situation. Details emerging.',
                location: 'Various Locations',
                author: 'GNN News Desk',
                views: '15K',
                updates: 'Live updates'
            };

            const breakingItemHtml = `
                <article class="breaking-item ${newBreakingItem.type}" data-category="${newBreakingItem.category}">
                    <div class="breaking-item-header">
                        <span class="breaking-badge ${newBreakingItem.category}">${newBreakingItem.badge}</span>
                        <span class="breaking-time">${newBreakingItem.time}</span>
                    </div>
                    <div class="breaking-item-content">
                        <h3 class="breaking-item-title">
                            <a href="news.html">
                                <i class="${newBreakingItem.icon} ${newBreakingItem.iconColor} me-2"></i>
                                ${newBreakingItem.title}
                            </a>
                        </h3>
                        <p class="breaking-item-excerpt">${newBreakingItem.excerpt}</p>
                        <div class="breaking-item-meta">
                            <span><i class="fas fa-map-marker-alt me-1"></i> ${newBreakingItem.location}</span>
                            <span><i class="fas fa-user me-1"></i> ${newBreakingItem.author}</span>
                            <span><i class="fas fa-eye me-1"></i> ${newBreakingItem.views} tracking</span>
                        </div>
                        <div class="breaking-item-updates">
                            <span class="update-badge">BREAKING NOW</span>
                            <span class="update-count">${newBreakingItem.updates}</span>
                        </div>
                    </div>
                </article>
            `;

            $('#breakingFeed').prepend(breakingItemHtml);
            const $newItem = $('#breakingFeed .breaking-item').first();

            // Animate in
            $newItem.css('opacity', '0').animate({ opacity: 1 }, 500);

            // Update counts
            updateBreakingCount();
            updateLiveUpdatesCount();

            // Announce new breaking news
            announceToScreenReader('New breaking news alert: ' + newBreakingItem.title);

            // Show visual indicator
            showNewUpdateIndicator();
        }
    }

    /**
     * Show new update indicator
     */
    function showNewUpdateIndicator() {
        const $indicator = $('<div/>', {
            class: 'new-update-indicator',
            html: '<i class="fas fa-bolt me-1"></i>New Breaking News'
        }).css({
            position: 'fixed',
            top: '70px',
            right: '20px',
            background: 'var(--danger-color)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--shadow-md)',
            zIndex: '9999',
            animation: 'fadeInUp 0.3s ease-out'
        });

        $('body').append($indicator);

        // Remove after 3 seconds
        setTimeout(() => {
            $indicator.fadeOut(300, function () {
                $(this).remove();
            });
        }, 3000);
    }

    // ========== VIEW COUNTER ==========

    /**
     * Initialize view counter for breaking news
     */
    function initBreakingViewCounter() {
        // Update view counts periodically
        setInterval(() => {
            updateBreakingViewCounts();
        }, 60000); // Every minute

        // Initial update
        updateBreakingViewCounts();
    }

    /**
     * Update breaking news view counts
     */
    function updateBreakingViewCounts() {
        $('.breaking-item').each(function () {
            const $item = $(this);
            const $viewsElement = $item.find('.fa-eye').parent();

            if ($viewsElement.length) {
                const currentText = $viewsElement.text();
                const match = currentText.match(/([\d.]+)([KM]?)/);

                if (match) {
                    let num = parseFloat(match[1]);
                    const suffix = match[2];

                    // Random increment based on item importance
                    let increment = 0.1;
                    if ($item.hasClass('critical')) increment = 0.3;
                    if ($item.hasClass('important')) increment = 0.2;

                    num += Math.random() * increment;

                    // Format number
                    let newText;
                    if (num >= 1000 && suffix !== 'K' && suffix !== 'M') {
                        newText = (num / 1000).toFixed(1) + 'K';
                    } else if (num >= 1000000 && suffix !== 'M') {
                        newText = (num / 1000000).toFixed(1) + 'M';
                    } else {
                        newText = Math.round(num).toString();
                    }

                    $viewsElement.html(`<i class="fas fa-eye me-1"></i> ${newText}${suffix ? suffix : ''} tracking`);
                }
            }
        });
    }

    // ========== NOTIFICATION SYSTEM ==========

    /**
     * Initialize breaking news notifications
     */
    function initBreakingNotifications() {
        // Listen for new breaking news items
        $(document).on('DOMNodeInserted', '#breakingFeed', function (e) {
            if ($(e.target).hasClass('breaking-item')) {
                const $newItem = $(e.target);
                const title = $newItem.find('.breaking-item-title').text();
                const category = $newItem.data('category');

                // Send browser notification if permission granted
                sendBreakingNotification(title, category);
            }
        });
    }

    /**
     * Send breaking news notification
     */
    function sendBreakingNotification(title, category) {
        if (Notification.permission === 'granted') {
            const notification = new Notification('GNN Breaking News', {
                body: title,
                icon: './assets/images/favicon.ico',
                badge: './assets/images/favicon.ico',
                tag: 'breaking-news',
                requireInteraction: category === 'emergency'
            });

            notification.onclick = function () {
                window.focus();
                notification.close();
            };
        }
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize performance monitoring for breaking news page
     */
    function initBreakingPerformance() {
        // Track page load time
        const loadTime = performance.now();
        console.log(`Breaking news page loaded in ${loadTime}ms`);

        // Monitor update frequency
        let updateCount = 0;
        const updateInterval = setInterval(() => {
            updateCount++;
            if (updateCount > 100) {
                console.warn('High update frequency detected');
                // Could throttle updates here
            }
        }, 1000);

        // Clean up interval on page unload
        $(window).on('beforeunload', function () {
            clearInterval(updateInterval);
        });

        // Monitor memory usage
        setInterval(() => {
            if (performance.memory) {
                const usedMemory = performance.memory.usedJSHeapSize;
                const totalMemory = performance.memory.totalJSHeapSize;

                if (usedMemory > totalMemory * 0.75) {
                    console.warn('High memory usage on breaking news page');
                    // Could trigger cleanup of old updates
                }
            }
        }, 30000);
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

    // ========== PAGE UNLOAD HANDLING ==========

    /**
     * Clean up before page unload
     */
    function cleanupBeforeUnload() {
        // Stop all intervals
        const highestTimeoutId = setTimeout(() => { }, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        // Close any open notifications
        if ('Notification' in window) {
            Notification.permission === 'granted' && Notification.close();
        }
    }

    // Listen for page unload
    $(window).on('beforeunload', cleanupBeforeUnload);

    // ========== ERROR HANDLING ==========

    /**
     * Initialize error handling for breaking news page
     */
    function initBreakingErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Breaking news page error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });

            // Send to error tracking service
            // Sentry.captureException(e.error);

            return false;
        });

        // Handle AJAX errors
        $(document).ajaxError(function (event, jqxhr, settings, thrownError) {
            console.error('Breaking news AJAX error:', thrownError);
            showAlertMessage('Unable to load breaking news updates. Please try again.', 'danger');
        });
    }

    // Initialize error handling
    initBreakingErrorHandling();

    // ========== PUBLIC API ==========

    // Expose breaking news functions if needed
    window.GNN = window.GNN || {};
    window.GNN.breakingNews = {
        filterBreakingNews: filterBreakingNews,
        sortBreakingNews: sortBreakingNews,
        refreshLiveUpdates: refreshLiveUpdates,
        loadMoreBreakingNews: loadMoreBreakingNews,
        requestNotificationPermission: requestNotificationPermission
    };

    // Log initialization
    console.log('Breaking news page JavaScript initialized');
});