/* ==============================================
   GLOBAL NEWS NETWORK - VIDEO PAGE JAVASCRIPT
   Video page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== VIDEO PAGE INITIALIZATION ==========
    initVideoPage();

    /**
     * Initialize all video page components
     */
    function initVideoPage() {
        // Video Player
        initVideoPlayer();

        // Video Grid
        initVideoGrid();

        // Video Filtering
        initVideoFilters();

        // Featured Video Navigation
        initFeaturedVideoNav();

        // Category Cards
        initCategoryCards();

        // Playlists
        initPlaylists();

        // Trending Videos
        initTrendingVideos();

        // Load More Videos
        initLoadMoreVideos();

        // Video Search
        initVideoSearch();

        // Video Analytics
        initVideoAnalytics();
    }

    // ========== VIDEO PLAYER ==========

    /**
     * Initialize video player functionality
     */
    function initVideoPlayer() {
        // Featured video play button
        $('.play-button-large, .watch-now-btn').on('click', function (e) {
            e.preventDefault();
            const $featuredVideo = $('#currentFeatured .video-thumbnail-large');
            const videoUrl = $featuredVideo.data('video');
            const videoTitle = $featuredVideo.data('title');
            const category = $featuredVideo.closest('.featured-video-container').find('.category-badge').text();
            const duration = $featuredVideo.find('.video-duration').text();

            playVideo(videoUrl, videoTitle, category, duration);
        });

        // Video card play buttons
        $(document).on('click', '.video-card, .video-card-play', function (e) {
            e.preventDefault();
            const $card = $(this).closest('.video-card');
            const videoUrl = $card.data('video');
            const videoTitle = $card.find('.video-card-title').text();
            const category = $card.find('.video-card-category').text();
            const duration = $card.find('.video-card-duration').text();

            playVideo(videoUrl, videoTitle, category, duration);

            // Track video play
            trackVideoPlay(videoTitle, category);
        });

        // Share video button
        $(document).on('click', '#shareVideoBtn', function () {
            const videoUrl = $('#videoPlayerContainer iframe').attr('src');
            const videoTitle = $('#videoModalTitle').text();

            shareVideo(videoUrl, videoTitle);
        });

        // Save video button
        $(document).on('click', '#saveVideoBtn', function () {
            const videoTitle = $('#videoModalTitle').text();
            saveVideo(videoTitle);
        });
    }

    /**
     * Play video in modal
     */
    function playVideo(videoUrl, videoTitle, category, duration) {
        // Update modal title
        $('#videoModalTitle').text(videoTitle);
        $('#videoCategory').text(category);
        $('#videoDuration').text(duration);

        // Clear previous iframe
        $('#videoPlayerContainer').empty();

        // Create new iframe
        const iframe = document.createElement('iframe');
        iframe.src = videoUrl + '?autoplay=1&rel=0';
        iframe.title = videoTitle;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        $('#videoPlayerContainer').append(iframe);

        // Show modal
        $('#videoPlayerModal').modal('show');

        // Track video play
        trackVideoPlay(videoTitle, category);
    }

    // ========== VIDEO GRID ==========

    /**
     * Initialize video grid
     */
    function initVideoGrid() {
        // Load initial videos
        loadVideos('newest', 'all');

        // Video card hover effects
        $('.video-card').hover(
            function () {
                $(this).addClass('hover');
                $(this).find('.video-card-play').css('opacity', '1');
            },
            function () {
                $(this).removeClass('hover');
                $(this).find('.video-card-play').css('opacity', '0');
            }
        );
    }

    /**
     * Load videos based on filters
     */
    function loadVideos(sortBy, category) {
        const mockVideos = [
            {
                id: 1,
                title: "Breaking News: Emergency Press Conference",
                category: "politics",
                duration: "8:45",
                views: "850K",
                date: "2 hours ago",
                image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example1"
            },
            {
                id: 2,
                title: "Market Analysis: Tech Stocks Surge",
                category: "business",
                duration: "12:30",
                views: "520K",
                date: "5 hours ago",
                image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example2"
            },
            {
                id: 3,
                title: "New AI Model Explained",
                category: "technology",
                duration: "15:20",
                views: "1.2M",
                date: "8 hours ago",
                image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example3"
            },
            {
                id: 4,
                title: "Championship Game Highlights",
                category: "sports",
                duration: "6:15",
                views: "2.3M",
                date: "12 hours ago",
                image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example4"
            },
            {
                id: 5,
                title: "Film Festival Red Carpet",
                category: "entertainment",
                duration: "9:40",
                views: "780K",
                date: "1 day ago",
                image: "https://images.unsplash.com/photo-1574269860368-c1b6eab3a71e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example5"
            },
            {
                id: 6,
                title: "New Cancer Treatment Research",
                category: "health",
                duration: "18:25",
                views: "950K",
                date: "1 day ago",
                image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example6"
            },
            {
                id: 7,
                title: "Mars Rover New Discovery",
                category: "science",
                duration: "14:10",
                views: "1.5M",
                date: "2 days ago",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example7"
            },
            {
                id: 8,
                title: "Climate Change Documentary",
                category: "politics",
                duration: "32:45",
                views: "3.2M",
                date: "2 days ago",
                image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example8"
            }
        ];

        // Filter videos by category
        let filteredVideos = mockVideos;
        if (category !== 'all') {
            filteredVideos = mockVideos.filter(video => video.category === category);
        }

        // Sort videos
        switch (sortBy) {
            case 'newest':
                filteredVideos.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'popular':
                filteredVideos.sort((a, b) => parseViews(b.views) - parseViews(a.views));
                break;
            case 'trending':
                // Simulated trending algorithm
                filteredVideos.sort((a, b) => (parseViews(b.views) / getHoursSince(b.date)) - (parseViews(a.views) / getHoursSince(a.date)));
                break;
        }

        // Generate video cards HTML
        const videoCardsHtml = filteredVideos.map(video => `
            <div class="col-md-6 col-lg-3">
                <div class="video-card" data-video="${video.video}" data-category="${video.category}">
                    <div class="video-card-thumbnail" style="background-image: url('${video.image}')">
                        <div class="video-card-play">
                            <i class="fas fa-play"></i>
                        </div>
                        <span class="video-card-duration">${video.duration}</span>
                    </div>
                    <div class="video-card-content">
                        <span class="video-card-category ${video.category}">${video.category.charAt(0).toUpperCase() + video.category.slice(1)}</span>
                        <h3 class="video-card-title">${video.title}</h3>
                        <div class="video-card-meta">
                            <span class="video-card-views">
                                <i class="fas fa-eye"></i> ${video.views}
                            </span>
                            <span class="video-card-date">${video.date}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Insert into grid
        $('#videoGrid').html(videoCardsHtml);

        // Announce to screen readers
        announceToScreenReader(`Loaded ${filteredVideos.length} videos`);
    }

    /**
     * Parse view count string to number
     */
    function parseViews(viewString) {
        const num = parseFloat(viewString);
        if (viewString.includes('M')) return num * 1000000;
        if (viewString.includes('K')) return num * 1000;
        return num;
    }

    /**
     * Get hours since date string
     */
    function getHoursSince(dateString) {
        // Simplified implementation
        if (dateString.includes('hour')) return parseInt(dateString);
        if (dateString.includes('day')) return parseInt(dateString) * 24;
        return 1;
    }

    // ========== VIDEO FILTERS ==========

    /**
     * Initialize video filters
     */
    function initVideoFilters() {
        // Toggle filter panel
        $('#filterToggle').on('click', function () {
            $('#filterPanel').slideToggle(300);
            $(this).toggleClass('active');
        });

        // Apply filters
        $('#applyFilters').on('click', function () {
            const category = $('#categoryFilter').val();
            const duration = $('#durationFilter').val();
            const sortBy = $('#sortFilter').val();

            // Apply filters (simulated)
            applyVideoFilters(category, duration, sortBy);

            // Close filter panel on mobile
            if ($(window).width() < 768) {
                $('#filterPanel').slideUp(300);
                $('#filterToggle').removeClass('active');
            }
        });

        // Reset filters
        $('#resetFilters').on('click', function () {
            $('#categoryFilter').val('all');
            $('#durationFilter').val('all');
            $('#sortFilter').val('newest');

            // Reload videos
            loadVideos('newest', 'all');

            // Announce reset
            announceToScreenReader('Filters reset to default');
        });
    }

    /**
     * Apply video filters
     */
    function applyVideoFilters(category, duration, sortBy) {
        // Show loading state
        $('#videoGrid').html('<div class="col-12 text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Applying filters...</p></div>');

        // Simulate API delay
        setTimeout(() => {
            loadVideos(sortBy, category);
            announceToScreenReader(`Applied filters: ${category}, ${duration}, ${sortBy}`);
        }, 800);
    }

    // ========== FEATURED VIDEO NAVIGATION ==========

    /**
     * Initialize featured video navigation
     */
    function initFeaturedVideoNav() {
        const featuredVideos = [
            {
                image: 'https://images.unsplash.com/photo-1574269860368-c1b6eab3a71e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                video: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                title: 'Inside the Global Climate Summit: Exclusive Coverage',
                category: 'politics',
                duration: '24:18',
                description: 'An exclusive look behind the scenes of the historic climate summit.',
                author: 'Sarah Johnson',
                date: 'Dec 10, 2023',
                views: '1.2M'
            },
            {
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                video: 'https://www.youtube.com/embed/example9',
                title: 'AI Revolution in Healthcare',
                category: 'technology',
                duration: '18:45',
                description: 'How artificial intelligence is transforming medical diagnostics.',
                author: 'Michael Chen',
                date: 'Dec 9, 2023',
                views: '980K'
            },
            {
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
                video: 'https://www.youtube.com/embed/example10',
                title: 'Mars Exploration: Latest Discoveries',
                category: 'science',
                duration: '22:30',
                description: 'New findings from the Mars Rover mission revealed.',
                author: 'David Wilson',
                date: 'Dec 8, 2023',
                views: '1.5M'
            }
        ];

        let currentIndex = 0;

        // Next button
        $('#nextFeatured').on('click', function () {
            currentIndex = (currentIndex + 1) % featuredVideos.length;
            updateFeaturedVideo(featuredVideos[currentIndex]);
        });

        // Previous button
        $('#prevFeatured').on('click', function () {
            currentIndex = (currentIndex - 1 + featuredVideos.length) % featuredVideos.length;
            updateFeaturedVideo(featuredVideos[currentIndex]);
        });

        // Auto-rotate every 15 seconds
        setInterval(() => {
            currentIndex = (currentIndex + 1) % featuredVideos.length;
            updateFeaturedVideo(featuredVideos[currentIndex]);
        }, 15000);
    }

    /**
     * Update featured video display
     */
    function updateFeaturedVideo(video) {
        const $featuredContainer = $('#currentFeatured');

        // Fade out
        $featuredContainer.css('opacity', '0.7');

        setTimeout(() => {
            // Update thumbnail
            $featuredContainer.find('.video-thumbnail-large')
                .css('background-image', `url('${video.image}')`)
                .data('video', video.video)
                .data('title', video.title);

            // Update content
            $featuredContainer.find('.category-badge')
                .removeClass()
                .addClass('category-badge ' + video.category)
                .text(video.category.charAt(0).toUpperCase() + video.category.slice(1));

            $featuredContainer.find('.featured-video-title').text(video.title);
            $featuredContainer.find('.featured-video-description').text(video.description);
            $featuredContainer.find('.video-duration').text(video.duration);
            $featuredContainer.find('.meta-item:nth-child(1) span').html(`Published: ${video.date}`);
            $featuredContainer.find('.meta-item:nth-child(2) span').html(`${video.views} Views`);
            $featuredContainer.find('.meta-item:nth-child(3) span').html(`Duration: ${video.duration}`);

            // Fade in
            $featuredContainer.css('opacity', '1');

            // Announce to screen readers
            announceToScreenReader(`Featured video updated: ${video.title}`);
        }, 300);
    }

    // ========== CATEGORY CARDS ==========

    /**
     * Initialize category card interactions
     */
    function initCategoryCards() {
        $('.video-category-card').on('click', function () {
            const $card = $(this);
            const category = $card.data('category') || $card.find('h3').text().toLowerCase();

            // Highlight selected category
            $('.video-category-card').removeClass('selected');
            $card.addClass('selected');

            // Filter videos by category
            $('#categoryFilter').val(category);
            $('#applyFilters').trigger('click');

            // Scroll to video grid
            $('html, body').animate({
                scrollTop: $('#videoGrid').offset().top - 100
            }, 800);

            // Announce filter
            announceToScreenReader(`Filtering videos by ${category}`);
        });
    }

    // ========== PLAYLISTS ==========

    /**
     * Initialize playlist functionality
     */
    function initPlaylists() {
        $('.playlist-card').on('click', function () {
            const $card = $(this);
            const playlistTitle = $card.find('h4').text();

            // In a real implementation, this would load the playlist
            alert(`Opening playlist: ${playlistTitle}`);

            // Track playlist click
            trackPlaylistClick(playlistTitle);
        });

        // Play all button
        $('.play-all-btn').on('click', function (e) {
            e.stopPropagation();
            const $card = $(this).closest('.playlist-card');
            const playlistTitle = $card.find('h4').text();

            alert(`Playing all videos in: ${playlistTitle}`);

            // Track play all
            trackPlayAll(playlistTitle);
        });
    }

    // ========== TRENDING VIDEOS ==========

    /**
     * Initialize trending videos
     */
    function initTrendingVideos() {
        // Load trending videos
        loadTrendingVideos('week');

        // Time filter change
        $('#trendingTimeFilter').on('change', function () {
            const timePeriod = $(this).val();
            loadTrendingVideos(timePeriod);
        });
    }

    /**
     * Load trending videos
     */
    function loadTrendingVideos(timePeriod) {
        const mockTrendingVideos = [
            {
                id: 1,
                title: "Emergency Press Conference Live",
                category: "politics",
                views: "5.2M",
                rank: 1,
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example11"
            },
            {
                id: 2,
                title: "Stock Market Crash Analysis",
                category: "business",
                views: "3.8M",
                rank: 2,
                image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example12"
            },
            {
                id: 3,
                title: "New Smartphone Launch Event",
                category: "technology",
                views: "3.2M",
                rank: 3,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example13"
            },
            {
                id: 4,
                title: "Championship Final Highlights",
                category: "sports",
                views: "7.1M",
                rank: 4,
                image: "https://images.unsplash.com/photo-1574269860368-c1b6eab3a71e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                video: "https://www.youtube.com/embed/example14"
            }
        ];

        // Generate trending videos HTML
        const trendingHtml = mockTrendingVideos.map(video => `
            <div class="col-md-6 col-lg-3">
                <div class="trending-video-card video-card" data-video="${video.video}">
                    <div class="video-card-thumbnail" style="background-image: url('${video.image}')">
                        <div class="trending-video-number">${video.rank}</div>
                        <div class="video-card-play">
                            <i class="fas fa-play"></i>
                        </div>
                        <span class="video-card-duration">${video.duration || '10:45'}</span>
                    </div>
                    <div class="video-card-content">
                        <span class="video-card-category ${video.category}">${video.category.charAt(0).toUpperCase() + video.category.slice(1)}</span>
                        <h3 class="video-card-title">${video.title}</h3>
                        <div class="video-card-meta">
                            <span class="video-card-views">
                                <i class="fas fa-fire"></i> ${video.views} views
                            </span>
                            <span class="video-card-date">Trending</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // Insert into trending section
        $('#trendingVideos').html(trendingHtml);
    }

    // ========== LOAD MORE VIDEOS ==========

    /**
     * Initialize load more videos functionality
     */
    function initLoadMoreVideos() {
        let isLoading = false;
        let currentPage = 1;

        $('#loadMoreVideos').on('click', function (e) {
            e.preventDefault();

            if (isLoading) return;

            isLoading = true;
            currentPage++;
            loadMoreVideos(currentPage);
        });

        // Infinite scroll for desktop
        if ($(window).width() >= 768) {
            $(window).on('scroll', function () {
                if (isLoading || !$('#loadMoreVideos').is(':visible')) return;

                const scrollTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                const btnOffset = $('#loadMoreVideos').offset().top;

                if (scrollTop + windowHeight >= btnOffset - 200) {
                    isLoading = true;
                    currentPage++;
                    loadMoreVideos(currentPage);
                }
            });
        }
    }

    /**
     * Load more videos
     */
    function loadMoreVideos(page) {
        const $loadMoreBtn = $('#loadMoreVideos');
        const $videoGrid = $('#videoGrid');

        // Show loading state
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API delay
        setTimeout(() => {
            // Mock additional videos
            const additionalVideos = [
                {
                    id: page * 8 + 1,
                    title: "International Trade Agreement Signed",
                    category: "politics",
                    duration: "14:20",
                    views: "420K",
                    date: "3 days ago",
                    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    video: "https://www.youtube.com/embed/example15"
                },
                {
                    id: page * 8 + 2,
                    title: "Renewable Energy Breakthrough",
                    category: "technology",
                    duration: "16:45",
                    views: "680K",
                    date: "3 days ago",
                    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    video: "https://www.youtube.com/embed/example16"
                }
            ];

            // Append new video cards
            additionalVideos.forEach(video => {
                const videoCardHtml = `
                    <div class="col-md-6 col-lg-3">
                        <div class="video-card" data-video="${video.video}">
                            <div class="video-card-thumbnail" style="background-image: url('${video.image}')">
                                <div class="video-card-play">
                                    <i class="fas fa-play"></i>
                                </div>
                                <span class="video-card-duration">${video.duration}</span>
                            </div>
                            <div class="video-card-content">
                                <span class="video-card-category ${video.category}">${video.category.charAt(0).toUpperCase() + video.category.slice(1)}</span>
                                <h3 class="video-card-title">${video.title}</h3>
                                <div class="video-card-meta">
                                    <span class="video-card-views">
                                        <i class="fas fa-eye"></i> ${video.views}
                                    </span>
                                    <span class="video-card-date">${video.date}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $videoGrid.append(videoCardHtml);
            });

            // Reset button state
            $loadMoreBtn.html('<i class="fas fa-plus-circle me-2"></i> Load More Videos');
            $loadMoreBtn.prop('disabled', false);
            isLoading = false;

            // Hide button if no more videos (demo)
            if (page >= 3) {
                $loadMoreBtn.hide();
                announceToScreenReader('All videos loaded');
            } else {
                announceToScreenReader('Loaded more videos');
            }
        }, 1500);
    }

    // ========== VIDEO SEARCH ==========

    /**
     * Initialize video search functionality
     */
    function initVideoSearch() {
        // Search form in modal
        $(document).on('submit', '#searchForm', function (e) {
            e.preventDefault();
            const searchQuery = $('#searchInput').val().trim();

            if (searchQuery.length >= 2) {
                searchVideos(searchQuery);
            }
        });

        // Search suggestions
        $(document).on('click', '.search-suggestions a', function (e) {
            e.preventDefault();
            const query = $(this).text();
            $('#searchInput').val(query);
            searchVideos(query);
        });
    }

    /**
     * Search videos
     */
    function searchVideos(query) {
        // Show loading
        $('.search-results-list').html('<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Searching videos...</p></div>');
        $('.search-results').show();

        // Simulate search
        setTimeout(() => {
            // Mock search results
            const resultsHtml = `
                <div class="search-result-item mb-3 p-3 border rounded">
                    <div class="d-flex align-items-start">
                        <div class="flex-shrink-0">
                            <div class="video-thumbnail-sm" style="width: 120px; height: 68px; background-image: url('https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80')"></div>
                        </div>
                        <div class="flex-grow-1 ms-3">
                            <span class="badge bg-primary mb-1">Politics</span>
                            <h6 class="mb-1"><a href="#" class="text-decoration-none">Climate Summit Coverage</a></h6>
                            <p class="small text-muted mb-1">Exclusive coverage of the global climate summit.</p>
                            <small class="text-muted">24:18 • 1.2M views</small>
                        </div>
                    </div>
                </div>
            `;

            $('.search-results-list').html(resultsHtml);

            // Track search
            trackVideoSearch(query);
        }, 1000);
    }

    // ========== VIDEO ANALYTICS ==========

    /**
     * Initialize video analytics tracking
     */
    function initVideoAnalytics() {
        // Track page view
        trackVideoPageView();

        // Track video engagement
        trackVideoEngagement();
    }

    /**
     * Track video page view
     */
    function trackVideoPageView() {
        console.log('Video page viewed');
        // In real implementation:
        // gtag('event', 'page_view', {
        //     'page_title': 'Video Page',
        //     'page_location': window.location.href
        // });
    }

    /**
     * Track video play
     */
    function trackVideoPlay(title, category) {
        console.log(`Video played: ${title} (${category})`);
        // In real implementation:
        // gtag('event', 'video_play', {
        //     'event_category': category,
        //     'event_label': title
        // });
    }

    /**
     * Track video search
     */
    function trackVideoSearch(query) {
        console.log(`Video search: ${query}`);
        // In real implementation:
        // gtag('event', 'search', {
        //     'search_term': query
        // });
    }

    /**
     * Track playlist click
     */
    function trackPlaylistClick(title) {
        console.log(`Playlist clicked: ${title}`);
        // In real implementation:
        // gtag('event', 'playlist_click', {
        //     'event_category': 'engagement',
        //     'event_label': title
        // });
    }

    /**
     * Track play all
     */
    function trackPlayAll(title) {
        console.log(`Play all clicked: ${title}`);
        // In real implementation:
        // gtag('event', 'play_all', {
        //     'event_category': 'engagement',
        //     'event_label': title
        // });
    }

    /**
     * Track video engagement
     */
    function trackVideoEngagement() {
        // Track time spent on page
        let startTime = Date.now();

        $(window).on('beforeunload', function () {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            console.log(`Time spent on video page: ${timeSpent} seconds`);
            // In real implementation:
            // gtag('event', 'time_spent', {
            //     'event_category': 'engagement',
            //     'event_label': 'video_page',
            //     'value': timeSpent
            // });
        });
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Share video on social media
     */
    function shareVideo(videoUrl, title) {
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(videoUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`,
            linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(videoUrl)}&title=${encodeURIComponent(title)}`
        };

        // Show share options
        alert(`Share "${title}"\n\nTwitter: ${shareUrls.twitter}\nFacebook: ${shareUrls.facebook}\nLinkedIn: ${shareUrls.linkedin}`);

        // Track share
        console.log(`Video shared: ${title}`);
    }

    /**
     * Save video for later
     */
    function saveVideo(title) {
        // Get saved videos from localStorage
        let savedVideos = JSON.parse(localStorage.getItem('savedVideos') || '[]');

        // Add current video
        if (!savedVideos.includes(title)) {
            savedVideos.push(title);
            localStorage.setItem('savedVideos', JSON.stringify(savedVideos));

            alert(`"${title}" saved to your collection`);
            console.log(`Video saved: ${title}`);
        } else {
            alert(`"${title}" is already in your collection`);
        }
    }

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

    // ========== ERROR HANDLING ==========

    /**
     * Handle video player errors
     */
    function handleVideoPlayerError() {
        $(document).on('error', '#videoPlayerContainer iframe', function () {
            alert('Error loading video. Please try again later.');
            $('#videoPlayerModal').modal('hide');
        });
    }

    // Initialize error handling
    handleVideoPlayerError();

    // ========== PUBLIC API ==========

    // Expose video page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.video = {
        playVideo: playVideo,
        loadVideos: loadVideos,
        searchVideos: searchVideos,
        shareVideo: shareVideo,
        saveVideo: saveVideo
    };

    // Log initialization
    console.log('Video page JavaScript initialized');
});