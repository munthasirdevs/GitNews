/* ==============================================
   GLOBAL NEWS NETWORK - SEARCH PAGE JAVASCRIPT
   Search page specific functionality
   ============================================== */

$(document).ready(function () {
    // ========== SEARCH PAGE INITIALIZATION ==========
    initSearchPage();

    // Global variables
    let currentPage = 1;
    const resultsPerPage = 10;
    let currentResults = [];

    /**
     * Initialize all search page components
     */
    function initSearchPage() {
        // Main search functionality
        initMainSearch();

        // Search filters
        initSearchFilters();

        // Recent searches
        initRecentSearches();

        // Quick search tags
        initQuickSearch();

        // Popular search tags
        initPopularSearch();

        // Pagination
        initPagination();

        // Advanced filters
        initAdvancedFilters();

        // Search history
        initSearchHistory();

        // URL parameter handling
        initURLParameters();

        // Performance monitoring
        initSearchPerformance();

        // Error handling
        initSearchErrorHandling();

        // Focus management for accessibility
        initFocusManagement();
    }

    // ========== MAIN SEARCH FUNCTIONALITY ==========

    /**
     * Initialize main search form
     */
    function initMainSearch() {
        const $searchForm = $('#mainSearchForm');
        const $searchInput = $('#searchQuery');
        let isSearching = false;

        // Form submission
        $searchForm.on('submit', function (e) {
            e.preventDefault();
            performSearch();
        });

        // Search button click
        $('#searchButton').on('click', function (e) {
            e.preventDefault();
            performSearch();
        });

        // Enter key in search input
        $searchInput.on('keyup', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }

            // Show suggestions on typing
            if ($searchInput.val().length >= 2) {
                showSearchSuggestions($searchInput.val());
            } else {
                hideSearchSuggestions();
            }
        });

        // Clear search button
        $(document).on('click', '.clear-search', function () {
            clearSearch();
        });

        // Auto-focus on search input
        if ($searchInput.length && !$searchInput.val()) {
            setTimeout(() => {
                $searchInput.focus();
            }, 300);
        }
    }

    /**
     * Perform search operation
     */
    function performSearch() {
        const query = $('#searchQuery').val().trim();
        const category = $('#categoryFilter').val();
        const dateFilter = $('#dateFilter').val();
        const sortBy = $('#sortFilter').val();

        // Validate query
        if (!query) {
            showSearchError('Please enter a search term');
            $('#searchQuery').focus();
            return;
        }

        if (query.length < 2) {
            showSearchError('Please enter at least 2 characters');
            $('#searchQuery').focus();
            return;
        }

        // Reset to first page
        currentPage = 1;

        // Save to recent searches
        saveToRecentSearches(query);

        // Update URL
        updateSearchURL(query, category, dateFilter, sortBy);

        // Show loading state
        showSearchLoading();

        // Simulate API call
        setTimeout(() => {
            try {
                // In real implementation, this would be an AJAX call to your backend
                // $.ajax({
                //     url: '/api/search',
                //     method: 'GET',
                //     data: {
                //         q: query,
                //         category: category,
                //         date: dateFilter,
                //         sort: sortBy,
                //         page: currentPage
                //     },
                //     success: function(response) {
                //         displaySearchResults(response);
                //     },
                //     error: function() {
                //         showSearchError('Search failed. Please try again.');
                //     }
                // });

                // Mock search results for demonstration
                currentResults = generateMockResults(query, category, dateFilter, sortBy);
                displaySearchResults(currentResults);

                // Track search in analytics
                trackSearchEvent(query, category, dateFilter, sortBy);

                // Dispatch custom event for performance monitoring
                window.dispatchEvent(new CustomEvent('searchComplete', {
                    detail: { query, resultsCount: currentResults.length }
                }));
            } catch (error) {
                console.error('Search error:', error);
                showSearchError('An error occurred during search. Please try again.');
            }
        }, 800);
    }

    // ========== SEARCH FILTERS ==========

    /**
     * Initialize search filters
     */
    function initSearchFilters() {
        // Category filter change
        $('#categoryFilter').on('change', function () {
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        });

        // Date filter change
        $('#dateFilter').on('change', function () {
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        });

        // Sort filter change
        $('#sortFilter').on('change', function () {
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        });
    }

    // ========== RECENT SEARCHES ==========

    /**
     * Initialize recent searches functionality
     */
    function initRecentSearches() {
        loadRecentSearches();
        renderRecentSearches();
    }

    /**
     * Load recent searches from localStorage
     */
    function loadRecentSearches() {
        try {
            const recentSearches = localStorage.getItem('gnn_recent_searches');
            return recentSearches ? JSON.parse(recentSearches) : [];
        } catch (error) {
            console.error('Error loading recent searches:', error);
            return [];
        }
    }

    /**
     * Save search to recent searches
     */
    function saveToRecentSearches(query) {
        try {
            let recentSearches = loadRecentSearches();

            // Remove if already exists
            recentSearches = recentSearches.filter(item => item.query !== query);

            // Add new search at beginning
            recentSearches.unshift({
                query: query,
                timestamp: new Date().toISOString(),
                count: 1
            });

            // Keep only last 10 searches
            recentSearches = recentSearches.slice(0, 10);

            // Save to localStorage
            localStorage.setItem('gnn_recent_searches', JSON.stringify(recentSearches));

            // Update UI
            renderRecentSearches();
        } catch (error) {
            console.error('Error saving recent search:', error);
        }
    }

    /**
     * Render recent searches in sidebar
     */
    function renderRecentSearches() {
        const recentSearches = loadRecentSearches();
        const $recentSearchesContainer = $('#recentSearches');
        const $noRecentSearches = $('#noRecentSearches');

        if (recentSearches.length === 0) {
            $noRecentSearches.show();
            $recentSearchesContainer.html('');
            return;
        }

        $noRecentSearches.hide();

        const recentSearchesHtml = recentSearches.map((search, index) => {
            const timeAgo = getTimeAgo(search.timestamp);
            return `
                <a href="#" class="recent-search-item" data-query="${search.query}" tabindex="0">
                    <div class="recent-search-query">${search.query}</div>
                    <div class="recent-search-time">${timeAgo}</div>
                    <button class="recent-search-remove" data-index="${index}" aria-label="Remove search">
                        <i class="fas fa-times"></i>
                    </button>
                </a>
            `;
        }).join('');

        $recentSearchesContainer.html(recentSearchesHtml);

        // Add click handlers
        $('.recent-search-item').on('click', function (e) {
            e.preventDefault();
            const query = $(this).data('query');
            $('#searchQuery').val(query);
            performSearch();
        });

        // Add keyboard support
        $('.recent-search-item').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const query = $(this).data('query');
                $('#searchQuery').val(query);
                performSearch();
            }
        });

        // Add remove handlers
        $('.recent-search-remove').on('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const index = $(this).data('index');
            removeRecentSearch(index);
        });
    }

    /**
     * Remove search from recent searches
     */
    function removeRecentSearch(index) {
        try {
            let recentSearches = loadRecentSearches();
            recentSearches.splice(index, 1);
            localStorage.setItem('gnn_recent_searches', JSON.stringify(recentSearches));
            renderRecentSearches();
        } catch (error) {
            console.error('Error removing recent search:', error);
        }
    }

    // ========== QUICK SEARCH ==========

    /**
     * Initialize quick search tags
     */
    function initQuickSearch() {
        $('.quick-search-tag').on('click', function (e) {
            e.preventDefault();
            const query = $(this).data('query');
            $('#searchQuery').val(query);
            performSearch();
        });

        // Keyboard accessibility
        $('.quick-search-tag').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const query = $(this).data('query');
                $('#searchQuery').val(query);
                performSearch();
            }
        });
    }

    // ========== POPULAR SEARCH ==========

    /**
     * Initialize popular search tags
     */
    function initPopularSearch() {
        $('.popular-search-tag').on('click', function (e) {
            e.preventDefault();
            const query = $(this).data('query');
            $('#searchQuery').val(query);
            performSearch();
        });

        // Keyboard accessibility
        $('.popular-search-tag').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const query = $(this).data('query');
                $('#searchQuery').val(query);
                performSearch();
            }
        });
    }

    // ========== PAGINATION ==========

    /**
     * Initialize pagination
     */
    function initPagination() {
        // Handle page click
        $(document).on('click', '.page-link:not(.disabled)', function (e) {
            e.preventDefault();
            const page = $(this).data('page');
            if (page) {
                currentPage = page;
                updatePagination();
                scrollToResults();
                displayCurrentPageResults();
            }
        });
    }

    /**
     * Update pagination UI
     */
    function updatePagination(totalResults = 0, page = 1) {
        const totalPages = Math.ceil(totalResults / resultsPerPage);
        const $paginationContainer = $('#paginationContainer');
        const $pagination = $('#pagination');

        if (totalPages <= 1) {
            $paginationContainer.hide();
            return;
        }

        $paginationContainer.show();

        let paginationHtml = '';

        // Previous button
        paginationHtml += `
            <li class="page-item ${page === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${page - 1}" aria-label="Previous" tabindex="${page === 1 ? '-1' : '0'}">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHtml += `
                <li class="page-item ${i === page ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}" tabindex="0">${i}</a>
                </li>
            `;
        }

        // Next button
        paginationHtml += `
            <li class="page-item ${page === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${page + 1}" aria-label="Next" tabindex="${page === totalPages ? '-1' : '0'}">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `;

        $pagination.html(paginationHtml);
    }

    /**
     * Display current page results
     */
    function displayCurrentPageResults() {
        const startIndex = (currentPage - 1) * resultsPerPage;
        const endIndex = startIndex + resultsPerPage;
        const pageResults = currentResults.slice(startIndex, endIndex);

        displaySearchResults(pageResults, currentResults.length);
    }

    // ========== ADVANCED FILTERS ==========

    /**
     * Initialize advanced filters
     */
    function initAdvancedFilters() {
        $('#applyFilters').on('click', function (e) {
            e.preventDefault();
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        });

        // Content type filters
        $('#filterArticles, #filterVideos, #filterGallery').on('change', function () {
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        });

        // Author filter
        $('#authorFilter').on('keyup', debounce(function () {
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        }, 500));

        // Views filter
        $('#viewsFilter').on('keyup', debounce(function () {
            const query = $('#searchQuery').val().trim();
            if (query) {
                currentPage = 1;
                performSearch();
            }
        }, 500));
    }

    // ========== SEARCH HISTORY ==========

    /**
     * Initialize search history tracking
     */
    function initSearchHistory() {
        // Load search history from localStorage
        try {
            const searchHistory = localStorage.getItem('gnn_search_history') || '[]';
            window.searchHistory = JSON.parse(searchHistory);
        } catch (error) {
            console.error('Error loading search history:', error);
            window.searchHistory = [];
        }
    }

    /**
     * Save search to history
     */
    function saveSearchToHistory(query, resultsCount) {
        try {
            if (!window.searchHistory) {
                window.searchHistory = [];
            }

            const searchEntry = {
                query: query,
                timestamp: new Date().toISOString(),
                resultsCount: resultsCount,
                filters: {
                    category: $('#categoryFilter').val(),
                    date: $('#dateFilter').val(),
                    sort: $('#sortFilter').val()
                }
            };

            window.searchHistory.push(searchEntry);

            // Keep only last 50 searches
            if (window.searchHistory.length > 50) {
                window.searchHistory = window.searchHistory.slice(-50);
            }

            localStorage.setItem('gnn_search_history', JSON.stringify(window.searchHistory));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }

    // ========== URL PARAMETERS ==========

    /**
     * Initialize URL parameter handling
     */
    function initURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const category = urlParams.get('category');
        const date = urlParams.get('date');
        const sort = urlParams.get('sort');
        const page = urlParams.get('page');

        if (query) {
            $('#searchQuery').val(query);
            if (category) $('#categoryFilter').val(category);
            if (date) $('#dateFilter').val(date);
            if (sort) $('#sortFilter').val(sort);
            if (page) currentPage = parseInt(page);

            // Perform search after a short delay to ensure DOM is ready
            setTimeout(() => {
                performSearch();
            }, 300);
        }
    }

    /**
     * Update URL with search parameters
     */
    function updateSearchURL(query, category, dateFilter, sortBy, page = 1) {
        try {
            const params = new URLSearchParams();
            params.set('q', query);
            if (category) params.set('category', category);
            if (dateFilter) params.set('date', dateFilter);
            if (sortBy) params.set('sort', sortBy);
            if (page > 1) params.set('page', page);

            const newURL = `${window.location.pathname}?${params.toString()}`;
            window.history.pushState({ path: newURL }, '', newURL);
        } catch (error) {
            console.error('Error updating URL:', error);
        }
    }

    // ========== SEARCH RESULTS DISPLAY ==========

    /**
     * Display search results
     */
    function displaySearchResults(results, totalResults = null) {
        const $resultsContainer = $('#searchResults');
        const $resultsCount = $('#resultsCount');
        const $searchInfo = $('#searchInfo');
        const query = $('#searchQuery').val().trim();

        // Use provided totalResults or calculate from results array
        const actualTotalResults = totalResults !== null ? totalResults : results.length;

        if (results.length === 0) {
            displayNoResults(query);
            return;
        }

        // Update counts and info
        $resultsCount.text(actualTotalResults);
        $searchInfo.html(`Showing results for "<strong>${query}</strong>"`);

        // Generate results HTML
        const resultsHtml = results.map((result, index) => {
            const resultNumber = (currentPage - 1) * resultsPerPage + index + 1;
            return `
                <div class="search-result-item ${resultNumber <= 3 ? 'featured' : ''}" data-id="${result.id}">
                    ${result.image ? `
                        <div class="search-result-image">
                            <img src="${result.image}" alt="${result.title}" loading="lazy">
                        </div>
                    ` : ''}
                    <div class="search-result-content">
                        <span class="search-result-category">${result.category}</span>
                        <h3 class="search-result-title">
                            <a href="${result.url}">${result.title}</a>
                        </h3>
                        <p class="search-result-excerpt">${result.excerpt}</p>
                        <div class="search-result-meta">
                            <div class="search-result-author">
                                <i class="fas fa-user me-1"></i> ${result.author}
                            </div>
                            <div class="search-result-date">
                                <i class="fas fa-clock me-1"></i> ${result.date}
                            </div>
                            <div class="search-result-views">
                                <i class="fas fa-eye me-1"></i> ${result.views}
                            </div>
                            <span class="search-result-type ${result.type}">${result.type}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        $resultsContainer.html(resultsHtml);

        // Add click handlers to result items
        $('.search-result-item').on('click', function (e) {
            if (!$(e.target).is('a') && !$(e.target).parents('a').length) {
                const url = $(this).find('.search-result-title a').attr('href');
                if (url) {
                    window.location.href = url;
                }
            }
        });

        // Update pagination
        updatePagination(actualTotalResults, currentPage);

        // Save to search history
        saveSearchToHistory(query, actualTotalResults);

        // Announce results to screen readers
        announceToScreenReader(`Found ${actualTotalResults} results for ${query}`);
    }

    /**
     * Display no results state
     */
    function displayNoResults(query) {
        const $resultsContainer = $('#searchResults');
        const $resultsCount = $('#resultsCount');
        const $searchInfo = $('#searchInfo');

        $resultsCount.text('0');
        $searchInfo.html(`No results found for "<strong>${query}</strong>"`);

        const noResultsHtml = `
            <div class="no-results">
                <div class="no-results-icon">
                    <i class="fas fa-search fa-3x"></i>
                </div>
                <h3 class="no-results-title">No Results Found</h3>
                <p class="text-muted mb-4">We couldn't find any matches for "${query}".</p>
                <div class="no-results-suggestions">
                    <h4>Suggestions:</h4>
                    <ul class="list-unstyled text-start mx-auto" style="max-width: 500px;">
                        <li class="mb-2"><i class="fas fa-check-circle text-primary me-2"></i> Check your spelling</li>
                        <li class="mb-2"><i class="fas fa-check-circle text-primary me-2"></i> Try different keywords</li>
                        <li class="mb-2"><i class="fas fa-check-circle text-primary me-2"></i> Use more general terms</li>
                        <li><i class="fas fa-check-circle text-primary me-2"></i> Try removing filters</li>
                    </ul>
                </div>
            </div>
        `;

        $resultsContainer.html(noResultsHtml);
        $('#paginationContainer').hide();

        // Announce to screen readers
        announceToScreenReader(`No results found for ${query}`);
    }

    // ========== SEARCH SUGGESTIONS ==========

    /**
     * Show search suggestions
     */
    function showSearchSuggestions(query) {
        // In a real implementation, this would fetch suggestions from an API
        const mockSuggestions = [
            `${query} news`,
            `${query} latest`,
            `${query} update`,
            `${query} 2023`,
            `${query} today`
        ];

        // // Remove existing suggestions
        // $('.search-suggestions-dropdown').remove();

        // // Create suggestions dropdown
        // const suggestionsHtml = `
        //     <div class="search-suggestions-dropdown">
        //         <div class="suggestions-list">
        //             ${mockSuggestions.map(suggestion => `
        //                 <div class="suggestion-item" data-suggestion="${suggestion}" tabindex="0">
        //                     <i class="fas fa-search me-2"></i> ${suggestion}
        //                 </div>
        //             `).join('')}
        //         </div>
        //     </div>
        // `;

        $('#searchQuery').after(suggestionsHtml);

        // Add click handlers
        $('.suggestion-item').on('click', function () {
            const suggestion = $(this).data('suggestion');
            $('#searchQuery').val(suggestion);
            hideSearchSuggestions();
            performSearch();
        });

        // Add keyboard support
        $('.suggestion-item').on('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const suggestion = $(this).data('suggestion');
                $('#searchQuery').val(suggestion);
                hideSearchSuggestions();
                performSearch();
            }
        });
    }

    /**
     * Hide search suggestions
     */
    function hideSearchSuggestions() {
        $('.search-suggestions-dropdown').remove();
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Show search loading state
     */
    function showSearchLoading() {
        const $resultsContainer = $('#searchResults');
        const loadingHtml = `
            <div class="search-loading">
                <div class="sr-only">Loading search results...</div>
            </div>
        `;
        $resultsContainer.html(loadingHtml);
    }

    /**
     * Show search error
     */
    function showSearchError(message) {
        const $resultsContainer = $('#searchResults');
        const errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $resultsContainer.html(errorHtml);
    }

    /**
     * Clear search
     */
    function clearSearch() {
        $('#searchQuery').val('');
        $('#searchResults').html(`
            <div class="search-initial-state text-center py-5">
                <div class="initial-state-icon mb-4">
                    <i class="fas fa-search fa-3x text-muted"></i>
                </div>
                <h3 class="h4 mb-3">Start Your Search</h3>
                <p class="text-muted mb-4">Enter keywords above to search through thousands of news articles, videos, and stories.</p>
            </div>
        `);
        $('#resultsCount').text('0');
        $('#searchInfo').text('Enter a search term to find news articles');
        $('#paginationContainer').hide();

        // Update URL
        window.history.pushState({}, '', 'search.html');

        // Focus back to search input
        $('#searchQuery').focus();
    }

    /**
     * Get time ago string
     */
    function getTimeAgo(timestamp) {
        try {
            const now = new Date();
            const past = new Date(timestamp);
            const diffMs = now - past;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            return past.toLocaleDateString();
        } catch (error) {
            return 'Recently';
        }
    }

    /**
     * Scroll to results section
     */
    function scrollToResults() {
        $('html, body').animate({
            scrollTop: $('.search-results-section').offset().top - 80
        }, 500);
    }

    /**
     * Debounce function
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

    // ========== MOCK DATA GENERATION ==========

    /**
     * Generate mock search results for demonstration
     */
    function generateMockResults(query, category, dateFilter, sortBy) {
        const mockData = [
            {
                id: 1,
                title: `Global Leaders Discuss ${query.charAt(0).toUpperCase() + query.slice(1)} at Emergency Summit`,
                excerpt: `World leaders gather to address pressing issues related to ${query}, announcing new initiatives and collaborations.`,
                category: 'Politics',
                author: 'Sarah Johnson',
                date: '2 hours ago',
                views: '45.2K',
                type: 'article',
                url: 'news.html',
                image: 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 2,
                title: `New ${query.charAt(0).toUpperCase() + query.slice(1)} Technology Breakthrough Announced`,
                excerpt: `Scientists reveal groundbreaking advancements in ${query} technology that could revolutionize multiple industries.`,
                category: 'Technology',
                author: 'Michael Chen',
                date: '4 hours ago',
                views: '32.8K',
                type: 'video',
                url: 'video.html',
                image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 3,
                title: `${query.charAt(0).toUpperCase() + query.slice(1)} Market Sees Unprecedented Growth in Q3`,
                excerpt: `Financial analysts report remarkable expansion in the ${query} sector, driving economic recovery and job creation.`,
                category: 'Business',
                author: 'Robert Williams',
                date: '6 hours ago',
                views: '28.5K',
                type: 'article',
                url: 'news.html',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 4,
                title: `Major ${query.charAt(0).toUpperCase() + query.slice(1)} Discovery in Scientific Research`,
                excerpt: `Researchers announce significant findings in ${query} study, opening new possibilities for future developments.`,
                category: 'Science',
                author: 'Dr. Lisa Wang',
                date: '8 hours ago',
                views: '24.1K',
                type: 'article',
                url: 'news.html',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 5,
                title: `${query.charAt(0).toUpperCase() + query.slice(1)} Policy Changes Announced by Government`,
                excerpt: `New regulations and policies related to ${query} take effect, impacting businesses and consumers nationwide.`,
                category: 'Politics',
                author: 'David Miller',
                date: '10 hours ago',
                views: '21.7K',
                type: 'article',
                url: 'news.html',
                image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 6,
                title: `Exclusive Interview: ${query.charAt(0).toUpperCase() + query.slice(1)} Expert Shares Insights`,
                excerpt: `Leading expert discusses the future of ${query} and its implications for society in exclusive interview.`,
                category: 'Interview',
                author: 'Jennifer Lee',
                date: '12 hours ago',
                views: '19.3K',
                type: 'video',
                url: 'video.html',
                image: 'https://images.unsplash.com/photo-1574269860368-c1b6eab3a71e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 7,
                title: `${query.charAt(0).toUpperCase() + query.slice(1)} Trends: What to Expect in 2024`,
                excerpt: `Industry analysts predict major trends and developments in ${query} for the coming year.`,
                category: 'Analysis',
                author: 'Thomas Brown',
                date: '1 day ago',
                views: '17.6K',
                type: 'article',
                url: 'news.html',
                image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: 8,
                title: `Photo Gallery: ${query.charAt(0).toUpperCase() + query.slice(1)} Around the World`,
                excerpt: `Stunning visual journey showcasing ${query} from different perspectives across the globe.`,
                category: 'Gallery',
                author: 'Photo Team',
                date: '2 days ago',
                views: '15.8K',
                type: 'gallery',
                url: 'photo-gallery.html',
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ];

        // Filter by category if specified
        let filteredResults = mockData;
        if (category) {
            filteredResults = mockData.filter(item =>
                item.category.toLowerCase() === category.toLowerCase()
            );
        }

        // Filter by content type
        const showArticles = $('#filterArticles').is(':checked');
        const showVideos = $('#filterVideos').is(':checked');
        const showGallery = $('#filterGallery').is(':checked');

        filteredResults = filteredResults.filter(item => {
            if (item.type === 'article' && !showArticles) return false;
            if (item.type === 'video' && !showVideos) return false;
            if (item.type === 'gallery' && !showGallery) return false;
            return true;
        });

        // Filter by author if specified
        const authorFilter = $('#authorFilter').val();
        if (authorFilter) {
            filteredResults = filteredResults.filter(item =>
                item.author.toLowerCase().includes(authorFilter.toLowerCase())
            );
        }

        // Filter by minimum views if specified
        const viewsFilter = $('#viewsFilter').val();
        if (viewsFilter) {
            filteredResults = filteredResults.filter(item => {
                const views = parseInt(item.views.replace('K', '000').replace('.', ''));
                return views >= parseInt(viewsFilter);
            });
        }

        // Sort results
        switch (sortBy) {
            case 'newest':
                filteredResults.sort((a, b) => {
                    const timeA = getTimeValue(a.date);
                    const timeB = getTimeValue(b.date);
                    return timeB - timeA;
                });
                break;
            case 'oldest':
                filteredResults.sort((a, b) => {
                    const timeA = getTimeValue(a.date);
                    const timeB = getTimeValue(b.date);
                    return timeA - timeB;
                });
                break;
            case 'popular':
                filteredResults.sort((a, b) => {
                    const viewsA = parseInt(a.views.replace('K', '000').replace('.', ''));
                    const viewsB = parseInt(b.views.replace('K', '000').replace('.', ''));
                    return viewsB - viewsA;
                });
                break;
            // relevance is default
        }

        return filteredResults;
    }

    /**
     * Get time value for sorting
     */
    function getTimeValue(timeString) {
        const now = new Date();
        if (timeString.includes('hour')) {
            const hours = parseInt(timeString);
            return now.getTime() - (hours * 60 * 60 * 1000);
        } else if (timeString.includes('day')) {
            const days = parseInt(timeString);
            return now.getTime() - (days * 24 * 60 * 60 * 1000);
        }
        return now.getTime();
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize search performance monitoring
     */
    function initSearchPerformance() {
        // Track search performance
        let searchStartTime;

        $(document).on('submit', '#mainSearchForm', function () {
            searchStartTime = performance.now();
        });

        // Monitor search completion time
        window.addEventListener('searchComplete', function (e) {
            if (searchStartTime) {
                const searchTime = performance.now() - searchStartTime;
                console.log(`Search completed in ${searchTime.toFixed(2)}ms`);

                if (searchTime > 2000) {
                    console.warn('Search performance warning: Consider optimizing search algorithm');
                }
            }
        });

        // Monitor memory usage during search
        if (performance && performance.memory) {
            setInterval(() => {
                try {
                    const usedMemory = performance.memory.usedJSHeapSize;
                    const totalMemory = performance.memory.totalJSHeapSize;
                    const memoryPercentage = (usedMemory / totalMemory) * 100;

                    if (memoryPercentage > 80) {
                        console.warn('High memory usage detected during search operations');
                    }
                } catch (error) {
                    // Memory API might not be available in all browsers
                }
            }, 30000);
        }
    }

    // ========== ANALYTICS TRACKING ==========

    /**
     * Track search event for analytics
     */
    function trackSearchEvent(query, category, dateFilter, sortBy) {
        const searchData = {
            query: query,
            category: category || 'all',
            date_filter: dateFilter || 'any',
            sort_by: sortBy || 'relevance',
            timestamp: new Date().toISOString()
        };

        console.log('Search tracked:', searchData);

        // In real implementation, send to analytics service
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'search', {
        //         'search_term': query,
        //         'category': category,
        //         'date_filter': dateFilter,
        //         'sort_by': sortBy
        //     });
        // }
    }

    // ========== ERROR HANDLING ==========

    /**
     * Initialize error handling for search page
     */
    function initSearchErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Search page error:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });

            // Show user-friendly error message
            if (e.message.includes('search') || e.message.includes('Search')) {
                showSearchError('An error occurred during search. Please try again.');
            }

            return false;
        });

        // Handle promise rejections
        window.addEventListener('unhandledrejection', function (e) {
            console.error('Unhandled promise rejection in search:', e.reason);
        });
    }

    // ========== FOCUS MANAGEMENT ==========

    /**
     * Initialize focus management for accessibility
     */
    function initFocusManagement() {
        // Trap focus within modal when open
        $(document).on('shown.bs.modal', function () {
            const $modal = $(this);
            const $focusable = $modal.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const $firstFocusable = $focusable.first();
            const $lastFocusable = $focusable.last();

            $firstFocusable.focus();

            $modal.on('keydown', function (e) {
                if (e.key === 'Tab') {
                    if (e.shiftKey) {
                        if ($(e.target).is($firstFocusable)) {
                            e.preventDefault();
                            $lastFocusable.focus();
                        }
                    } else {
                        if ($(e.target).is($lastFocusable)) {
                            e.preventDefault();
                            $firstFocusable.focus();
                        }
                    }
                }
                if (e.key === 'Escape') {
                    $modal.modal('hide');
                }
            });
        });

        // Remove event listeners when modal is hidden
        $(document).on('hidden.bs.modal', function () {
            $(this).off('keydown');
        });
    }

    // ========== PUBLIC API ==========

    // Expose search functions if needed
    window.GNN = window.GNN || {};
    window.GNN.search = {
        performSearch: performSearch,
        clearSearch: clearSearch,
        saveToRecentSearches: saveToRecentSearches,
        getRecentSearches: loadRecentSearches
    };

    // Log initialization
    console.log('Search page JavaScript initialized');
});