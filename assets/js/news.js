/* ==============================================
   GLOBAL NEWS NETWORK - NEWS PAGE JAVASCRIPT
   News article page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== NEWS PAGE INITIALIZATION ==========
    initNewsPage();

    /**
     * Initialize all news page components
     */
    function initNewsPage() {
        // Article Reading Progress
        initReadingProgress();

        // Social Sharing
        initSocialSharing();

        // Comments System
        initCommentsSystem();

        // Article Actions
        initArticleActions();

        // Related News
        initRelatedNews();

        // Article Rating
        initArticleRating();

        // Print Functionality
        initPrintFunctionality();

        // Save Article
        initSaveArticle();

        // Copy Link
        initCopyLink();

        // Image Zoom
        initImageZoom();

        // Table of Contents
        initTableOfContents();

        // Performance Monitoring
        initNewsPerformance();
    }

    // ========== READING PROGRESS ==========

    /**
     * Initialize reading progress indicator
     */
    function initReadingProgress() {
        const $progressBar = $('<div/>', {
            id: 'readingProgress',
            class: 'reading-progress-bar'
        });

        $('body').prepend($progressBar);

        function updateReadingProgress() {
            const article = $('.article-body');
            if (!article.length) return;

            const articleTop = article.offset().top;
            const articleHeight = article.outerHeight();
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();

            // Calculate progress
            let progress = 0;
            if (scrollTop > articleTop - windowHeight) {
                const scrolled = scrollTop + windowHeight - articleTop;
                progress = Math.min((scrolled / (articleHeight + windowHeight)) * 100, 100);
            }

            // Update progress bar
            $progressBar.css('width', progress + '%');

            // Show/hide based on progress
            if (progress > 2 && progress < 98) {
                $progressBar.fadeIn(200);
            } else {
                $progressBar.fadeOut(200);
            }
        }

        // Style the progress bar
        $progressBar.css({
            position: 'fixed',
            top: 0,
            left: 0,
            height: '3px',
            backgroundColor: 'var(--primary-color)',
            zIndex: 'var(--z-fixed)',
            transition: 'width 0.3s ease',
            display: 'none'
        });

        // Listen to scroll events
        $(window).on('scroll', throttle(updateReadingProgress, 100));

        // Initial update
        updateReadingProgress();
    }

    // ========== SOCIAL SHARING ==========

    /**
     * Initialize social sharing functionality
     */
    function initSocialSharing() {
        const articleUrl = window.location.href;
        const articleTitle = encodeURIComponent($('.article-title').text().trim());
        const articleImage = $('.featured-image img').attr('src');

        // Set up share buttons
        $('.social-icon.facebook').attr('href',
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
        );

        $('.social-icon.twitter').attr('href',
            `https://twitter.com/intent/tweet?text=${articleTitle}&url=${encodeURIComponent(articleUrl)}`
        );

        $('.social-icon.linkedin').attr('href',
            `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${articleTitle}`
        );

        $('.social-icon.whatsapp').attr('href',
            `https://wa.me/?text=${articleTitle}%20${encodeURIComponent(articleUrl)}`
        );

        // Native sharing API for mobile
        if (navigator.share) {
            const $nativeShare = $('<button/>', {
                class: 'social-icon share-native',
                html: '<i class="fas fa-share-alt"></i>',
                'aria-label': 'Share'
            });

            $nativeShare.on('click', function () {
                navigator.share({
                    title: $('.article-title').text().trim(),
                    text: $('.article-body .lead').text().trim(),
                    url: articleUrl
                }).catch(console.error);
            });

            $('.share-buttons').append($nativeShare);
        }
    }

    // ========== COMMENTS SYSTEM ==========

    /**
     * Initialize comments system
     */
    function initCommentsSystem() {
        const $commentFormWrapper = $('.comment-form-wrapper');
        const $showCommentForm = $('#showCommentForm');
        const $cancelComment = $('#cancelComment');
        const $commentForm = $('#commentForm');
        const $loadMoreComments = $('#loadMoreComments');

        // Show/hide comment form
        $showCommentForm.on('click', function () {
            $commentFormWrapper.slideDown(300);
            $showCommentForm.hide();
            $('#commentName').focus();
        });

        $cancelComment.on('click', function () {
            $commentFormWrapper.slideUp(300);
            $showCommentForm.show();
            $commentForm[0].reset();
        });

        // Handle comment form submission
        $commentForm.on('submit', function (e) {
            e.preventDefault();

            const name = $('#commentName').val().trim();
            const email = $('#commentEmail').val().trim();
            const comment = $('#commentText').val().trim();

            if (!name || !email || !comment) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            submitComment(name, email, comment);
        });

        // Load more comments
        $loadMoreComments.on('click', function () {
            loadMoreComments();
        });

        // Like/dislike comments
        $(document).on('click', '.comment-actions .fa-thumbs-up, .comment-actions .fa-thumbs-down', function () {
            const $button = $(this).closest('button');
            const isLike = $button.find('.fa-thumbs-up').length > 0;
            const $count = $button.find('i').next();
            let count = parseInt($count.text()) || 0;

            // Toggle active state
            $button.toggleClass('active');

            if ($button.hasClass('active')) {
                $count.text(count + 1);
            } else {
                $count.text(count - 1);
            }

            // Update UI
            if (isLike) {
                $button.find('i').toggleClass('far fas');
            }

            // In real implementation, send to server
            trackCommentVote($button.closest('.comment-item').find('h6').text(), isLike);
        });

        // Reply to comments
        $(document).on('click', '.comment-item .btn-outline-secondary', function () {
            const $commentItem = $(this).closest('.comment-item');
            const $replyForm = createReplyForm($commentItem.find('h6').text());

            // Remove existing reply form
            $commentItem.find('.reply-form').remove();

            // Add new reply form
            $commentItem.find('.comment-content').append($replyForm);
            $replyForm.find('textarea').focus();
        });
    }

    /**
     * Submit a new comment
     */
    function submitComment(name, email, comment) {
        const $commentForm = $('#commentForm');
        const $commentsList = $('.comments-list .comments-list');

        // Show loading state
        $commentForm.addClass('loading');
        $commentForm.find('button[type="submit"]').html('<i class="fas fa-spinner fa-spin me-1"></i> Posting...');

        // Simulate API call
        setTimeout(() => {
            const commentHtml = `
                <div class="comment-item mb-4">
                    <div class="d-flex align-items-start">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=100" 
                             alt="${name}" class="comment-avatar rounded-circle me-3">
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <div>
                                    <h6 class="mb-0">${name}</h6>
                                    <small class="text-muted">Just now</small>
                                </div>
                                <button class="btn btn-sm btn-outline-secondary">Reply</button>
                            </div>
                            <p class="mb-2">${comment}</p>
                            <div class="comment-actions d-flex align-items-center">
                                <button class="btn btn-sm btn-link text-muted me-2">
                                    <i class="far fa-thumbs-up me-1"></i> 0
                                </button>
                                <button class="btn btn-sm btn-link text-muted me-2">
                                    <i class="far fa-thumbs-down me-1"></i> 0
                                </button>
                                <button class="btn btn-sm btn-link text-muted">
                                    <i class="fas fa-flag"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Prepend new comment
            if ($commentsList.length) {
                $commentsList.prepend(commentHtml);
            } else {
                $('.comments-list').prepend(commentHtml);
            }

            // Reset form
            $commentForm[0].reset();
            $commentForm.removeClass('loading');
            $commentForm.find('button[type="submit"]').html('Post Comment');

            // Hide form
            $('.comment-form-wrapper').slideUp(300);
            $('#showCommentForm').show();

            // Update comment count
            updateCommentCount(1);

            // Show success message
            showNotification('Comment posted successfully!', 'success');

            // Scroll to new comment
            $('html, body').animate({
                scrollTop: $('.comment-item').first().offset().top - 100
            }, 500);
        }, 1000);
    }

    /**
     * Load more comments
     */
    function loadMoreComments() {
        const $loadMoreBtn = $('#loadMoreComments');
        const $commentsList = $('.comments-list');

        // Show loading
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            const mockComments = [
                {
                    name: 'Emma Wilson',
                    time: '4 hours ago',
                    comment: 'This is a step in the right direction, but we need to ensure developing nations have access to clean technology.',
                    likes: 15,
                    dislikes: 1
                },
                {
                    name: 'James Miller',
                    time: '5 hours ago',
                    comment: 'The economic implications are huge. This could spark the next industrial revolution.',
                    likes: 22,
                    dislikes: 3
                },
                {
                    name: 'Lisa Thompson',
                    time: '6 hours ago',
                    comment: 'Finally! After years of negotiations, we have a real agreement with teeth.',
                    likes: 31,
                    dislikes: 0
                }
            ];

            // Add mock comments
            mockComments.forEach(comment => {
                const commentHtml = `
                    <div class="comment-item mb-4">
                        <div class="d-flex align-items-start">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random&color=fff&size=100" 
                                 alt="${comment.name}" class="comment-avatar rounded-circle me-3">
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <h6 class="mb-0">${comment.name}</h6>
                                        <small class="text-muted">${comment.time}</small>
                                    </div>
                                    <button class="btn btn-sm btn-outline-secondary">Reply</button>
                                </div>
                                <p class="mb-2">${comment.comment}</p>
                                <div class="comment-actions d-flex align-items-center">
                                    <button class="btn btn-sm btn-link text-muted me-2">
                                        <i class="far fa-thumbs-up me-1"></i> ${comment.likes}
                                    </button>
                                    <button class="btn btn-sm btn-link text-muted me-2">
                                        <i class="far fa-thumbs-down me-1"></i> ${comment.dislikes}
                                    </button>
                                    <button class="btn btn-sm btn-link text-muted">
                                        <i class="fas fa-flag"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $commentsList.append(commentHtml);
            });

            // Reset button
            $loadMoreBtn.html('<i class="fas fa-chevron-down me-2"></i> Load More Comments');
            $loadMoreBtn.prop('disabled', false);

            // Hide button if enough comments loaded
            const currentCount = $('.comment-item').length;
            if (currentCount >= 10) {
                $loadMoreBtn.hide();
            }
        }, 1500);
    }

    /**
     * Create reply form
     */
    function createReplyForm(toUser) {
        return $(`
            <div class="reply-form mt-3">
                <form class="reply-comment-form">
                    <div class="mb-2">
                        <textarea class="form-control form-control-sm" rows="2" placeholder="Reply to ${toUser}..." required></textarea>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button type="button" class="btn btn-sm btn-outline-secondary me-2 cancel-reply">Cancel</button>
                        <button type="submit" class="btn btn-sm btn-primary">Reply</button>
                    </div>
                </form>
            </div>
        `);
    }

    /**
     * Update comment count
     */
    function updateCommentCount(increment) {
        const $commentCount = $('.article-meta span .fa-comment').parent();
        if ($commentCount.length) {
            const text = $commentCount.text();
            const match = text.match(/(\d+)/);
            if (match) {
                const count = parseInt(match[1]) + increment;
                $commentCount.html(`<i class="fas fa-comment me-1"></i> ${count} comments`);
            }
        }
    }

    // ========== ARTICLE ACTIONS ==========

    /**
     * Initialize article actions
     */
    function initArticleActions() {
        // Handle save info checkbox
        const savedInfo = localStorage.getItem('commenterInfo');
        if (savedInfo) {
            const { name, email } = JSON.parse(savedInfo);
            $('#commentName').val(name);
            $('#commentEmail').val(email);
            $('#saveInfo').prop('checked', true);
        }

        // Save info on form submission
        $('#commentForm').on('submit', function () {
            if ($('#saveInfo').is(':checked')) {
                const info = {
                    name: $('#commentName').val(),
                    email: $('#commentEmail').val()
                };
                localStorage.setItem('commenterInfo', JSON.stringify(info));
            } else {
                localStorage.removeItem('commenterInfo');
            }
        });
    }

    // ========== RELATED NEWS ==========

    /**
     * Initialize related news functionality
     */
    function initRelatedNews() {
        const $relatedNewsItems = $('.related-news-item');

        // Click tracking
        $relatedNewsItems.on('click', function () {
            const title = $(this).find('h6 a').text();
            trackRelatedClick(title);
        });

        // Lazy load related news images
        $relatedNewsItems.find('img').each(function () {
            const $img = $(this);
            const src = $img.attr('src');

            // Add loading attribute
            $img.attr('loading', 'lazy');

            // Set placeholder while loading
            $img.addClass('loading');

            // Load image
            const image = new Image();
            image.src = src;
            image.onload = function () {
                $img.removeClass('loading');
            };
        });
    }

    // ========== ARTICLE RATING ==========

    /**
     * Initialize article rating system
     */
    function initArticleRating() {
        const $starRating = $('.star-rating i');
        let userRating = 0;

        // Load saved rating
        const savedRating = localStorage.getItem('articleRating_' + window.location.pathname);
        if (savedRating) {
            userRating = parseInt(savedRating);
            updateStarDisplay(userRating);
        }

        // Star hover effect
        $starRating.on('mouseenter', function () {
            const rating = $(this).data('rating');
            updateStarDisplay(rating, true);
        });

        $starRating.on('mouseleave', function () {
            updateStarDisplay(userRating);
        });

        // Star click
        $starRating.on('click', function () {
            userRating = $(this).data('rating');
            updateStarDisplay(userRating);

            // Save rating
            localStorage.setItem('articleRating_' + window.location.pathname, userRating);

            // Submit rating (simulated)
            submitRating(userRating);

            // Show thank you message
            showNotification('Thank you for your rating!', 'success');
        });

        // Update overall rating display
        updateOverallRating();
    }

    /**
     * Update star display
     */
    function updateStarDisplay(rating, isHover = false) {
        $('.star-rating i').each(function () {
            const starRating = $(this).data('rating');
            if (starRating <= rating) {
                $(this).removeClass('far').addClass('fas');
            } else {
                $(this).removeClass('fas').addClass('far');
            }

            // Add hover effect
            if (isHover) {
                $(this).css('transform', 'scale(1.1)');
            } else {
                $(this).css('transform', 'scale(1)');
            }
        });
    }

    /**
     * Submit rating to server
     */
    function submitRating(rating) {
        // Simulate API call
        console.log('Rating submitted:', rating);
        // In real implementation:
        // $.post('/api/article/rate', { rating: rating, articleId: getArticleId() });
    }

    /**
     * Update overall rating display
     */
    function updateOverallRating() {
        // In real implementation, fetch from server
        // For demo, use static value
        const overallRating = 4.2;
        const ratingCount = 342;

        $('.rating-count').text(`(${overallRating}/5 from ${ratingCount} ratings)`);
    }

    // ========== PRINT FUNCTIONALITY ==========

    /**
     * Initialize print functionality
     */
    function initPrintFunctionality() {
        $('#printArticle').on('click', function () {
            // Open print dialog
            window.print();

            // Track print event
            trackArticleAction('print');
        });
    }

    // ========== SAVE ARTICLE ==========

    /**
     * Initialize save article functionality
     */
    function initSaveArticle() {
        const $saveBtn = $('#saveArticle');
        const articleId = getArticleId();

        // Check if article is already saved
        const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
        const isSaved = savedArticles.includes(articleId);

        if (isSaved) {
            $saveBtn.html('<i class="fas fa-bookmark me-1"></i> Saved');
            $saveBtn.addClass('saved');
        }

        // Toggle save state
        $saveBtn.on('click', function () {
            const $btn = $(this);
            const savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
            const articleId = getArticleId();

            if ($btn.hasClass('saved')) {
                // Remove from saved
                const index = savedArticles.indexOf(articleId);
                if (index > -1) {
                    savedArticles.splice(index, 1);
                }
                $btn.html('<i class="far fa-bookmark me-1"></i> Save');
                $btn.removeClass('saved');
                showNotification('Article removed from saved items', 'info');
            } else {
                // Add to saved
                savedArticles.push(articleId);
                $btn.html('<i class="fas fa-bookmark me-1"></i> Saved');
                $btn.addClass('saved');
                showNotification('Article saved successfully', 'success');
            }

            // Save to localStorage
            localStorage.setItem('savedArticles', JSON.stringify(savedArticles));

            // Track save action
            trackArticleAction($btn.hasClass('saved') ? 'save' : 'unsave');
        });
    }

    // ========== COPY LINK ==========

    /**
     * Initialize copy link functionality
     */
    function initCopyLink() {
        $('#copyLink').on('click', function (e) {
            e.preventDefault();

            const url = window.location.href;

            // Use Clipboard API if available
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                    trackArticleAction('copy_link');
                }).catch(err => {
                    console.error('Failed to copy:', err);
                    fallbackCopy(url);
                });
            } else {
                fallbackCopy(url);
            }
        });
    }

    /**
     * Fallback copy method
     */
    function fallbackCopy(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();

        try {
            document.execCommand('copy');
            showNotification('Link copied to clipboard!', 'success');
            trackArticleAction('copy_link');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showNotification('Failed to copy link', 'error');
        }

        document.body.removeChild(textarea);
    }

    // ========== IMAGE ZOOM ==========

    /**
     * Initialize image zoom functionality
     */
    function initImageZoom() {
        const $images = $('.featured-image img, .figure-img');

        $images.on('click', function () {
            const $img = $(this);
            const src = $img.attr('src');
            const alt = $img.attr('alt') || 'Image';

            createImageModal(src, alt);
        });

        // Add zoom cursor
        $images.css('cursor', 'zoom-in');
    }

    /**
     * Create image modal
     */
    function createImageModal(src, alt) {
        // Remove existing modal
        $('#imageModal').remove();

        const modalHtml = `
            <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-xl modal-dialog-centered">
                    <div class="modal-content bg-transparent border-0">
                        <div class="modal-header border-0">
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body p-0">
                            <img src="${src}" alt="${alt}" class="img-fluid rounded">
                        </div>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHtml);

        const $modal = $('#imageModal');
        $modal.modal('show');

        // Clean up on close
        $modal.on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }

    // ========== TABLE OF CONTENTS ==========

    /**
     * Initialize table of contents
     */
    function initTableOfContents() {
        const $headings = $('.article-body h2');

        if ($headings.length >= 3) {
            createTableOfContents($headings);
        }
    }

    /**
     * Create table of contents
     */
    function createTableOfContents($headings) {
        const tocHtml = `
            <div class="toc-widget mb-5">
                <div class="toc-header d-flex justify-content-between align-items-center mb-3">
                    <h4><i class="fas fa-list me-2"></i> Table of Contents</h4>
                    <button class="btn btn-sm btn-outline-secondary" id="toggleToc">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                <div class="toc-body">
                    <nav class="toc-nav">
                        ${generateTocItems($headings)}
                    </nav>
                </div>
            </div>
        `;

        // Insert after featured image
        $('.featured-image').after(tocHtml);

        // Toggle functionality
        $('#toggleToc').on('click', function () {
            $('.toc-body').slideToggle(300);
            $(this).find('i').toggleClass('fa-chevron-down fa-chevron-up');
        });

        // Smooth scroll to headings
        $('.toc-nav a').on('click', function (e) {
            e.preventDefault();
            const targetId = $(this).attr('href');
            const $target = $(targetId);

            if ($target.length) {
                const offset = 100;
                const targetPosition = $target.offset().top - offset;

                $('html, body').animate({
                    scrollTop: targetPosition
                }, 800);
            }
        });
    }

    /**
     * Generate table of contents items
     */
    function generateTocItems($headings) {
        let items = '';

        $headings.each(function (index) {
            const text = $(this).text();
            const id = 'section-' + (index + 1);

            // Add ID to heading for anchor
            $(this).attr('id', id);

            items += `
                <div class="toc-item mb-2">
                    <a href="#${id}" class="toc-link d-flex align-items-center">
                        <span class="toc-number me-2">${index + 1}.</span>
                        <span class="toc-text">${text}</span>
                    </a>
                </div>
            `;
        });

        return items;
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize news page performance monitoring
     */
    function initNewsPerformance() {
        // Track article read time
        const wordCount = $('.article-body').text().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200); // 200 words per minute

        // Display read time
        $('.article-meta').append(`<span><i class="fas fa-clock me-1"></i> ${readTime} min read</span>`);

        // Track reading progress for analytics
        let maxScroll = 0;

        $(window).on('scroll', throttle(function () {
            const scrollPercent = Math.round(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                // Track significant reading milestones
                if (scrollPercent >= 25 && scrollPercent < 50) {
                    trackReadingProgress('25%');
                } else if (scrollPercent >= 50 && scrollPercent < 75) {
                    trackReadingProgress('50%');
                } else if (scrollPercent >= 75 && scrollPercent < 90) {
                    trackReadingProgress('75%');
                } else if (scrollPercent >= 90) {
                    trackReadingProgress('90%');
                }
            }
        }, 1000));

        // Monitor image loading performance
        let imagesLoaded = 0;
        const totalImages = $('img').length;

        $('img').on('load', function () {
            imagesLoaded++;

            if (imagesLoaded === totalImages) {
                console.log('All images loaded');
            }
        });

        // Handle broken images
        $('img').on('error', function () {
            const $img = $(this);
            const fallbackSrc = 'https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';

            if ($img.attr('src') !== fallbackSrc) {
                $img.attr('src', fallbackSrc);
            }
        });
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Show notification
     */
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        $('.notification').remove();

        const $notification = $('<div/>', {
            class: `notification notification-${type}`,
            text: message
        });

        // Style the notification
        $notification.css({
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--border-radius)',
            backgroundColor: type === 'success' ? 'var(--success-color)' :
                type === 'error' ? 'var(--danger-color)' : 'var(--info-color)',
            color: 'white',
            zIndex: 'var(--z-modal)',
            boxShadow: 'var(--shadow-lg)',
            animation: 'slideInRight 0.3s ease-out'
        });

        $('body').append($notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            $notification.fadeOut(300, function () {
                $(this).remove();
            });
        }, 5000);

        // Allow manual dismissal
        $notification.on('click', function () {
            $(this).fadeOut(300, function () {
                $(this).remove();
            });
        });
    }

    /**
     * Validate email address
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Get article ID from URL
     */
    function getArticleId() {
        return window.location.pathname.split('/').pop().replace('.html', '');
    }

    /**
     * Track article action
     */
    function trackArticleAction(action) {
        console.log('Article action:', action);
        // In real implementation:
        // gtag('event', 'article_action', {
        //     'event_category': 'engagement',
        //     'event_label': action,
        //     'article_id': getArticleId()
        // });
    }

    /**
     * Track related article click
     */
    function trackRelatedClick(title) {
        console.log('Related article clicked:', title);
        // In real implementation:
        // gtag('event', 'related_click', {
        //     'event_category': 'engagement',
        //     'event_label': title
        // });
    }

    /**
     * Track comment vote
     */
    function trackCommentVote(commentAuthor, isLike) {
        console.log('Comment vote:', commentAuthor, isLike ? 'like' : 'dislike');
        // In real implementation:
        // gtag('event', 'comment_vote', {
        //     'event_category': 'engagement',
        //     'event_label': isLike ? 'like' : 'dislike',
        //     'comment_author': commentAuthor
        // });
    }

    /**
     * Track reading progress
     */
    function trackReadingProgress(milestone) {
        console.log('Reading progress:', milestone);
        // In real implementation:
        // gtag('event', 'reading_progress', {
        //     'event_category': 'engagement',
        //     'event_label': milestone,
        //     'article_id': getArticleId()
        // });
    }

    /**
     * Throttle function
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

    // ========== PAGE UNLOAD HANDLING ==========

    /**
     * Clean up before page unload
     */
    function cleanupBeforeUnload() {
        // Save reading position
        const scrollPosition = $(window).scrollTop();
        localStorage.setItem('lastScrollPosition_' + getArticleId(), scrollPosition);

        // Stop intervals and timeouts
        const highestTimeoutId = setTimeout(() => { }, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }
    }

    // Restore scroll position
    const savedScroll = localStorage.getItem('lastScrollPosition_' + getArticleId());
    if (savedScroll) {
        $(window).on('load', function () {
            setTimeout(() => {
                $(window).scrollTop(parseInt(savedScroll));
                localStorage.removeItem('lastScrollPosition_' + getArticleId());
            }, 100);
        });
    }

    // Listen for page unload
    $(window).on('beforeunload', cleanupBeforeUnload);
    $(window).on('pagehide', cleanupBeforeUnload);

    // ========== ERROR HANDLING ==========

    /**
     * Initialize error handling
     */
    function initErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('News page error:', {
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
            console.error('Unhandled promise rejection:', e.reason);
            // Sentry.captureException(e.reason);
        });
    }

    // Initialize error handling
    initErrorHandling();

    // ========== PUBLIC API ==========

    // Expose news page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.news = {
        submitComment: submitComment,
        submitRating: submitRating,
        saveArticle: function () { $('#saveArticle').trigger('click'); },
        copyLink: function () { $('#copyLink').trigger('click'); }
    };

    // Log initialization
    console.log('News page JavaScript initialized');
});