/* ==============================================
   GLOBAL NEWS NETWORK - PHOTO GALLERY JAVASCRIPT
   Photo gallery page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== PHOTO GALLERY INITIALIZATION ==========
    initPhotoGallery();

    /**
     * Initialize all photo gallery components
     */
    function initPhotoGallery() {
        // Filtering functionality
        initGalleryFiltering();

        // View toggle (Grid/List)
        initViewToggle();

        // Sorting functionality
        initGallerySorting();

        // Load more photos
        initLoadMorePhotos();

        // Lightbox customization
        initLightboxCustomization();

        // Photo info modal
        initPhotoInfoModal();

        // Photo sharing
        initPhotoSharing();

        // Infinite scroll for mobile
        initInfiniteScroll();

        // Photo counter
        initPhotoCounter();

        // Photo download tracking
        initDownloadTracking();

        // Performance monitoring
        initGalleryPerformance();

        // Initialize theme toggle for gallery page
        initGalleryThemeToggle();
    }

    // ========== GALLERY FILTERING ==========

    /**
     * Initialize gallery filtering functionality
     */
    function initGalleryFiltering() {
        const $filterButtons = $('.filter-btn');
        const $galleryItems = $('.gallery-item');
        const $emptyState = $('#emptyState');
        const $galleryGrid = $('#galleryGrid');
        const $loadMoreBtn = $('#loadMorePhotos');

        let activeFilter = 'all';

        $filterButtons.on('click', function () {
            const $button = $(this);
            const filter = $button.data('filter');

            // Update active button
            $filterButtons.removeClass('active');
            $button.addClass('active');

            // Shake animation for feedback
            $button.addClass('shake');
            setTimeout(() => $button.removeClass('shake'), 500);

            // Apply filter
            applyFilter(filter);
            activeFilter = filter;

            // Announce to screen readers
            announceToScreenReader(`Filtered by ${filter === 'all' ? 'all categories' : filter}`);
        });

        /**
         * Apply filter to gallery items
         */
        function applyFilter(filter) {
            let visibleCount = 0;

            $galleryItems.each(function () {
                const $item = $(this);
                const categories = $item.data('category').split(' ');

                if (filter === 'all' || categories.includes(filter)) {
                    $item.show();
                    visibleCount++;
                } else {
                    $item.hide();
                }
            });

            // Show/hide empty state
            if (visibleCount === 0) {
                $galleryGrid.hide();
                $emptyState.show();
                $loadMoreBtn.hide();
            } else {
                $galleryGrid.show();
                $emptyState.hide();
                $loadMoreBtn.show();
            }

            // Update photo counter
            updatePhotoCounter(visibleCount);
        }

        // Clear all filters
        $('#clearFilters').on('click', function () {
            $filterButtons.removeClass('active');
            $('.filter-btn[data-filter="all"]').addClass('active');
            applyFilter('all');
            announceToScreenReader('All filters cleared');
        });

        // Expose applyFilter function
        window.applyFilter = applyFilter;
    }

    // ========== VIEW TOGGLE ==========

    /**
     * Initialize grid/list view toggle
     */
    function initViewToggle() {
        const $gridViewBtn = $('#gridViewBtn');
        const $listViewBtn = $('#listViewBtn');
        const $galleryGrid = $('#galleryGrid');
        const $galleryItems = $('.gallery-item');

        let currentView = 'grid';

        // Grid view button
        $gridViewBtn.on('click', function () {
            if (currentView !== 'grid') {
                $galleryGrid.removeClass('list-view').addClass('grid-view');
                $gridViewBtn.addClass('active').removeClass('btn-outline-primary').addClass('btn-primary');
                $listViewBtn.removeClass('active').addClass('btn-outline-primary').removeClass('btn-primary');
                currentView = 'grid';

                // Recalculate heights for grid view
                setTimeout(equalizeHeights, 100);

                announceToScreenReader('Switched to grid view');
            }
        });

        // List view button
        $listViewBtn.on('click', function () {
            if (currentView !== 'list') {
                $galleryGrid.removeClass('grid-view').addClass('list-view');
                $listViewBtn.addClass('active').removeClass('btn-outline-primary').addClass('btn-primary');
                $gridViewBtn.removeClass('active').addClass('btn-outline-primary').removeClass('btn-primary');
                currentView = 'list';

                // Remove height constraints for list view
                $galleryItems.css('height', '');

                announceToScreenReader('Switched to list view');
            }
        });

        // Initialize grid view as active
        $gridViewBtn.addClass('active').removeClass('btn-outline-primary').addClass('btn-primary');

        /**
         * Equalize heights of gallery items in grid view
         */
        function equalizeHeights() {
            if (currentView === 'grid') {
                let maxHeight = 0;

                // Find maximum height
                $galleryItems.each(function () {
                    const height = $(this).height();
                    if (height > maxHeight) {
                        maxHeight = height;
                    }
                });

                // Apply maximum height
                $galleryItems.height(maxHeight);
            }
        }

        // Equalize heights on load and resize
        $(window).on('load resize', debounce(equalizeHeights, 250));
    }

    // ========== GALLERY SORTING ==========

    /**
     * Initialize gallery sorting functionality
     */
    function initGallerySorting() {
        const $sortSelect = $('#sortGallery');
        const $galleryGrid = $('#galleryGrid');
        const $galleryItems = $('.gallery-item');

        $sortSelect.on('change', function () {
            const sortBy = $(this).val();
            sortGallery(sortBy);
        });

        /**
         * Sort gallery items
         */
        function sortGallery(sortBy) {
            const items = $galleryItems.get();

            items.sort(function (a, b) {
                const $a = $(a);
                const $b = $(b);

                switch (sortBy) {
                    case 'newest':
                        return new Date($b.data('date')) - new Date($a.data('date'));

                    case 'oldest':
                        return new Date($a.data('date')) - new Date($b.data('date'));

                    case 'popular':
                        return $b.data('views') - $a.data('views');

                    case 'featured':
                        const aFeatured = $a.data('category').includes('featured');
                        const bFeatured = $b.data('category').includes('featured');
                        if (aFeatured && !bFeatured) return -1;
                        if (!aFeatured && bFeatured) return 1;
                        return 0;

                    default:
                        return 0;
                }
            });

            // Reorder items in DOM
            $.each(items, function (idx, item) {
                $galleryGrid.append(item);
            });

            // Add animation to reordered items
            $galleryItems.removeClass('sorted');
            setTimeout(() => {
                $galleryItems.addClass('sorted');
            }, 10);

            // Announce sort
            announceToScreenReader(`Sorted by ${sortBy}`);
        }

        // Expose sortGallery function
        window.sortGallery = sortGallery;
    }

    // ========== LOAD MORE PHOTOS ==========

    /**
     * Initialize load more photos functionality
     */
    function initLoadMorePhotos() {
        const $loadMoreBtn = $('#loadMorePhotos');
        let isLoading = false;
        let page = 1;
        const photosPerLoad = 6;

        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();

            if (isLoading) return;

            isLoading = true;
            loadMorePhotos();
        });

        /**
         * Load more photos via AJAX (simulated)
         */
        function loadMorePhotos() {
            const $galleryGrid = $('#galleryGrid');

            // Show loading state
            $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
            $loadMoreBtn.prop('disabled', true);

            // Simulate API delay
            setTimeout(() => {
                // Mock data for demonstration
                const mockPhotos = [
                    {
                        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        category: 'featured breaking',
                        title: 'Natural Disaster Response',
                        description: 'Emergency teams responding to natural disaster',
                        date: '2023-11-03',
                        views: 14200
                    },
                    {
                        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        category: 'sports events',
                        title: 'Cycling Championship',
                        description: 'Professional cycling competition finals',
                        date: '2023-11-02',
                        views: 11800
                    },
                    {
                        image: 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        category: 'politics featured',
                        title: 'Diplomatic Reception',
                        description: 'Annual diplomatic reception at embassy',
                        date: '2023-11-01',
                        views: 9200
                    },
                    {
                        image: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        category: 'technology events',
                        title: 'Tech Conference',
                        description: 'Major technology conference keynote',
                        date: '2023-10-31',
                        views: 15600
                    },
                    {
                        image: 'https://images.unsplash.com/photo-1544656376-ffe19d4b7353?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        category: 'breaking sports',
                        title: 'Olympic Trials',
                        description: 'National Olympic team selection trials',
                        date: '2023-10-30',
                        views: 23400
                    },
                    {
                        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        category: 'events featured',
                        title: 'Cultural Festival',
                        description: 'Annual cultural festival celebrations',
                        date: '2023-10-29',
                        views: 8100
                    }
                ];

                // Create and append new photo cards
                mockPhotos.forEach((photo, index) => {
                    const photoCardHtml = `
                        <div class="gallery-item" data-category="${photo.category}" data-date="${photo.date}" data-views="${photo.views}">
                            <div class="photo-card">
                                <a href="${photo.image}" 
                                   data-lightbox="gallery" 
                                   data-title="${photo.title} - ${photo.description}"
                                   data-alt="${photo.title}">
                                    <img src="${photo.image}" 
                                         alt="${photo.title}" 
                                         class="photo-img"
                                         loading="lazy">
                                    <div class="photo-overlay">
                                        <div class="photo-info">
                                            <span class="photo-category">${photo.category.split(' ')[0].charAt(0).toUpperCase() + photo.category.split(' ')[0].slice(1)}</span>
                                            <h4 class="photo-title">${photo.title}</h4>
                                            <p class="photo-description">${photo.description}</p>
                                            <div class="photo-meta">
                                                <span><i class="fas fa-calendar me-1"></i> ${formatDate(photo.date)}</span>
                                                <span><i class="fas fa-eye me-1"></i> ${formatNumber(photo.views)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    `;

                    $galleryGrid.append(photoCardHtml);
                });

                // Update page counter
                page++;

                // Reset button state
                $loadMoreBtn.html('<i class="fas fa-plus-circle me-2"></i> Load More Photos');
                $loadMoreBtn.prop('disabled', false);
                isLoading = false;

                // Re-initialize lightbox for new photos
                initLightboxCustomization();

                // Update photo counter
                updatePhotoCounter($('.gallery-item:visible').length);

                // Announce to screen readers
                announceToScreenReader('Loaded more photos');

                // Update button text if this is the last page (demo)
                if (page >= 3) {
                    $loadMoreBtn.html('<i class="fas fa-check-circle me-2"></i> All Photos Loaded');
                    $loadMoreBtn.prop('disabled', true);
                    $loadMoreBtn.removeClass('btn-primary').addClass('btn-outline-secondary');
                }
            }, 1500);
        }

        /**
         * Format date for display
         */
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        /**
         * Format number with commas
         */
        function formatNumber(num) {
            if (num >= 1000) {
                return (num / 1000).toFixed(1) + 'K';
            }
            return num.toString();
        }

        // Expose loadMorePhotos function
        window.loadMorePhotos = loadMorePhotos;
    }

    // ========== LIGHTBOX CUSTOMIZATION ==========

    /**
     * Initialize lightbox with custom behavior
     */
    function initLightboxCustomization() {
        // Configure lightbox
        if (typeof lightbox !== 'undefined') {
            lightbox.option({
                'resizeDuration': 300,
                'wrapAround': true,
                'showImageNumberLabel': true,
                'fadeDuration': 300,
                'imageFadeDuration': 300,
                'disableScrolling': true,
                'albumLabel': 'Photo %1 of %2'
            });
        }

        // Add custom class to lightbox container
        $(document).on('click', '[data-lightbox="gallery"]', function () {
            setTimeout(() => {
                $('.lb-outerContainer').addClass('zooming');
                setTimeout(() => {
                    $('.lb-outerContainer').removeClass('zooming');
                }, 300);
            }, 100);

            // Track photo view
            const photoTitle = $(this).data('title');
            trackPhotoView(photoTitle);
        });

        // Keyboard navigation enhancements
        $(document).on('keydown', function (e) {
            if ($('#lightbox').is(':visible')) {
                switch (e.key) {
                    case 'ArrowLeft':
                        $('.lb-prev').click();
                        break;
                    case 'ArrowRight':
                        $('.lb-next').click();
                        break;
                    case 'Escape':
                        if (typeof lightbox !== 'undefined') {
                            lightbox.close();
                        }
                        break;
                }
            }
        });

        // Touch gestures for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        $(document).on('touchstart', '#lightbox', function (e) {
            touchStartX = e.originalEvent.touches[0].clientX;
        });

        $(document).on('touchend', '#lightbox', function (e) {
            touchEndX = e.originalEvent.changedTouches[0].clientX;
            handleLightboxSwipe();
        });

        /**
         * Handle swipe gestures for lightbox navigation
         */
        function handleLightboxSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;

            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    // Swipe right - previous photo
                    $('.lb-prev').click();
                } else {
                    // Swipe left - next photo
                    $('.lb-next').click();
                }
            }
        }
    }

    // ========== PHOTO INFO MODAL ==========

    /**
     * Initialize photo information modal
     */
    function initPhotoInfoModal() {
        const $photoInfoModal = $('#photoInfoModal');

        // Show photo info on double click or long press
        $('.photo-card').on('dblclick contextmenu', function (e) {
            e.preventDefault();

            const $card = $(this);
            const $img = $card.find('img');
            const $link = $card.find('a');

            // Populate modal with photo info
            $('#modalPhoto').attr('src', $img.attr('src')).attr('alt', $img.attr('alt'));
            $('#modalTitle').text($card.find('.photo-title').text());
            $('#modalDescription').text($card.find('.photo-description').text());

            // Set categories
            const categories = $card.closest('.gallery-item').data('category').split(' ');
            $('#modalCategories').text(categories.map(cat =>
                cat.charAt(0).toUpperCase() + cat.slice(1)
            ).join(', '));

            // Set date
            const date = new Date($card.closest('.gallery-item').data('date'));
            $('#modalDate').text(date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }));

            // Set views
            const views = $card.closest('.gallery-item').data('views');
            $('#modalViews').text(views.toLocaleString());

            // Show modal
            $photoInfoModal.modal('show');
        });

        // Download button
        $('#downloadPhoto').on('click', function () {
            const photoUrl = $('#modalPhoto').attr('src');
            const photoTitle = $('#modalTitle').text();

            triggerPhotoDownload(photoUrl, photoTitle);
        });
    }

    // ========== PHOTO SHARING ==========

    /**
     * Initialize photo sharing functionality
     */
    function initPhotoSharing() {
        $('#sharePhoto').on('click', function () {
            const photoUrl = $('#modalPhoto').attr('src');
            const photoTitle = $('#modalTitle').text();
            const photoDescription = $('#modalDescription').text();

            sharePhoto(photoUrl, photoTitle, photoDescription);
        });

        // Share buttons on photo cards
        $('.photo-card').each(function () {
            const $card = $(this);
            const photoUrl = $card.find('img').attr('src');
            const photoTitle = $card.find('.photo-title').text();

            // Add share overlay on hover
            $card.hover(
                function () {
                    if (!$card.find('.share-overlay').length) {
                        const shareOverlay = `
                            <div class="share-overlay">
                                <button class="share-btn" data-platform="twitter" data-url="${photoUrl}" data-title="${photoTitle}">
                                    <i class="fab fa-twitter"></i>
                                </button>
                                <button class="share-btn" data-platform="facebook" data-url="${photoUrl}" data-title="${photoTitle}">
                                    <i class="fab fa-facebook-f"></i>
                                </button>
                                <button class="share-btn" data-platform="pinterest" data-url="${photoUrl}" data-title="${photoTitle}">
                                    <i class="fab fa-pinterest"></i>
                                </button>
                            </div>
                        `;

                        $card.append(shareOverlay);
                    }
                },
                function () {
                    // Keep share overlay for a moment
                    setTimeout(() => {
                        if (!$card.is(':hover')) {
                            $card.find('.share-overlay').remove();
                        }
                    }, 500);
                }
            );
        });

        // Share button click handlers
        $(document).on('click', '.share-btn', function () {
            const platform = $(this).data('platform');
            const photoUrl = $(this).data('url');
            const photoTitle = $(this).data('title');

            shareOnPlatform(platform, photoUrl, photoTitle);
        });
    }

    /**
     * Share photo on specific platform
     */
    function shareOnPlatform(platform, photoUrl, photoTitle) {
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(photoTitle)}&url=${encodeURIComponent(window.location.href)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(photoUrl)}&description=${encodeURIComponent(photoTitle)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            trackPhotoShare(platform, photoTitle);
        }
    }

    /**
     * Share photo via native share API or fallback
     */
    function sharePhoto(photoUrl, photoTitle, photoDescription) {
        if (navigator.share) {
            // Use native share API on mobile
            navigator.share({
                title: photoTitle,
                text: photoDescription,
                url: window.location.href
            })
                .then(() => trackPhotoShare('native', photoTitle))
                .catch(console.error);
        } else {
            // Fallback to copy link
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(window.location.href)
                    .then(() => {
                        alert('Link copied to clipboard!');
                        trackPhotoShare('clipboard', photoTitle);
                    })
                    .catch(console.error);
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = window.location.href;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Link copied to clipboard!');
                trackPhotoShare('clipboard', photoTitle);
            }
        }
    }

    // ========== INFINITE SCROLL ==========

    /**
     * Initialize infinite scroll for mobile
     */
    function initInfiniteScroll() {
        if ($(window).width() < 768) {
            let isLoading = false;

            $(window).on('scroll', function () {
                if (isLoading || !$('#loadMorePhotos').is(':visible')) return;

                const scrollTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                const documentHeight = $(document).height();
                const btnOffset = $('#loadMorePhotos').offset().top;

                if (scrollTop + windowHeight >= btnOffset - 200) {
                    isLoading = true;
                    $('#loadMorePhotos').trigger('click');

                    // Reset loading state after a delay
                    setTimeout(() => {
                        isLoading = false;
                    }, 2000);
                }
            });
        }
    }

    // ========== PHOTO COUNTER ==========

    /**
     * Initialize photo counter display
     */
    function initPhotoCounter() {
        const $photoCounter = $('<div/>', {
            id: 'photoCounter',
            class: 'photo-counter',
            text: '0 photos'
        }).appendTo('body');

        // Initial count
        updatePhotoCounter($('.gallery-item:visible').length);

        // Show/hide based on scroll
        $(window).on('scroll', function () {
            if ($(this).scrollTop() > 300) {
                $photoCounter.fadeIn(300);
            } else {
                $photoCounter.fadeOut(300);
            }
        });
    }

    /**
     * Update photo counter
     */
    function updatePhotoCounter(count) {
        const $photoCounter = $('#photoCounter');
        if ($photoCounter.length) {
            $photoCounter.text(`${count} photo${count !== 1 ? 's' : ''}`);
        }
    }

    // ========== DOWNLOAD TRACKING ==========

    /**
     * Initialize photo download tracking
     */
    function initDownloadTracking() {
        // Track when lightbox is opened (potential download)
        $(document).on('click', '[data-lightbox]', function () {
            const photoTitle = $(this).data('title');
            sessionStorage.setItem('lastViewedPhoto', photoTitle);
        });

        // Track right-click downloads
        $(document).on('contextmenu', '.photo-img', function (e) {
            e.preventDefault();
            const photoTitle = $(this).attr('alt');
            trackPhotoDownload(photoTitle, 'context_menu');
        });
    }

    /**
     * Trigger photo download with tracking
     */
    function triggerPhotoDownload(photoUrl, photoTitle) {
        // Create temporary link for download
        const link = document.createElement('a');
        link.href = photoUrl;
        link.download = `GNN_${photoTitle.replace(/\s+/g, '_')}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Track download
        trackPhotoDownload(photoTitle, 'modal_button');

        // Show confirmation
        alert('Photo download started!');
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize gallery performance monitoring
     */
    function initGalleryPerformance() {
        // Monitor image loading performance
        const $images = $('.photo-img');
        let imagesLoaded = 0;
        const totalImages = $images.length;

        if (totalImages === 0) return;

        $images.on('load', function () {
            imagesLoaded++;

            // Update progress
            const progress = (imagesLoaded / totalImages) * 100;
            console.log(`Images loaded: ${progress.toFixed(1)}%`);

            // Remove loading skeletons
            if ($('.gallery-item.loading').length) {
                $('.gallery-item.loading').removeClass('loading');
            }

            // All images loaded
            if (imagesLoaded === totalImages) {
                console.log('All gallery images loaded');

                // Trigger lazy loading for off-screen images
                initLazyLoading();
            }
        });

        $images.on('error', function () {
            $(this).attr('src', 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');
            imagesLoaded++;
        });

        // Monitor scroll performance
        let lastScrollTime = Date.now();
        $(window).on('scroll', function () {
            const currentTime = Date.now();
            const timeDiff = currentTime - lastScrollTime;

            if (timeDiff < 16) { // 60fps threshold
                console.warn('Gallery scroll performance issue detected');
            }

            lastScrollTime = currentTime;
        });
    }

    // ========== GALLERY THEME TOGGLE ==========

    /**
     * Initialize theme toggle for gallery page
     */
    function initGalleryThemeToggle() {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Apply theme if not already applied by main script
        if ((savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) &&
            !document.body.classList.contains('dark-theme')) {
            document.body.classList.add('dark-theme');
            updateThemeIcon(true);
        }

        // Update theme toggle button if it exists
        if ($('#themeToggle').length) {
            const isDark = document.body.classList.contains('dark-theme');
            updateThemeIcon(isDark);
        }
    }

    /**
     * Update theme toggle icon
     */
    function updateThemeIcon(isDark) {
        const $themeToggle = $('#themeToggle');
        if ($themeToggle.length) {
            const $icon = $themeToggle.find('i');
            $icon.toggleClass('fa-moon fa-sun', isDark);
            $themeToggle.attr('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
            $themeToggle.attr('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
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
     * Track photo view for analytics
     */
    function trackPhotoView(photoTitle) {
        console.log('Photo viewed:', photoTitle);
        // In real implementation:
        // gtag('event', 'photo_view', {
        //     'event_category': 'engagement',
        //     'event_label': photoTitle
        // });
    }

    /**
     * Track photo share for analytics
     */
    function trackPhotoShare(platform, photoTitle) {
        console.log('Photo shared on', platform + ':', photoTitle);
        // In real implementation:
        // gtag('event', 'photo_share', {
        //     'event_category': platform,
        //     'event_label': photoTitle
        // });
    }

    /**
     * Track photo download for analytics
     */
    function trackPhotoDownload(photoTitle, method) {
        console.log('Photo downloaded:', photoTitle, 'via', method);
        // In real implementation:
        // gtag('event', 'photo_download', {
        //     'event_category': method,
        //     'event_label': photoTitle
        // });
    }

    /**
     * Initialize lazy loading for images
     */
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src attribute
            $('img[data-src]').each(function () {
                imageObserver.observe(this);
            });
        }
    }

    // ========== ERROR HANDLING ==========

    /**
     * Initialize error handling for gallery
     */
    function initErrorHandling() {
        // Handle image loading errors
        $(document).on('error', '.photo-img', function () {
            const $img = $(this);
            const fallbackSrc = 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';

            if ($img.attr('src') !== fallbackSrc) {
                $img.attr('src', fallbackSrc);
                $img.attr('alt', 'Image not available');
            }
        });

        // Handle JavaScript errors
        window.addEventListener('error', function (e) {
            console.error('Gallery error:', {
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

        // Handle promise rejections
        window.addEventListener('unhandledrejection', function (e) {
            console.error('Unhandled promise rejection in gallery:', e.reason);
            // Sentry.captureException(e.reason);
        });
    }

    // Initialize error handling
    initErrorHandling();

    // ========== PUBLIC API ==========

    // Expose gallery functions if needed
    window.GNN = window.GNN || {};
    window.GNN.gallery = {
        applyFilter: window.applyFilter,
        sortGallery: window.sortGallery,
        loadMorePhotos: window.loadMorePhotos,
        sharePhoto: sharePhoto,
        updatePhotoCounter: updatePhotoCounter
    };

    // Log initialization
    console.log('Photo gallery JavaScript initialized');
});