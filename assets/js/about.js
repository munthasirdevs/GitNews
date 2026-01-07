/* ==============================================
   GLOBAL NEWS NETWORK - ABOUT PAGE JAVASCRIPT
   About page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== ABOUT PAGE INITIALIZATION ==========
    initAboutPage();

    /**
     * Initialize all about page components
     */
    function initAboutPage() {
        // Animated Stats Counter
        initAnimatedStats();

        // Interactive Timeline
        initTimeline();

        // Value Cards Hover Effects
        initValueCards();

        // Scroll Animations
        initScrollAnimations();

        // Page Performance Tracking
        initAboutPerformance();

        // Print Page Functionality
        initPrintFunctionality();

        // Share About Page
        initShareAboutPage();
    }

    // ========== ANIMATED STATS COUNTER ==========

    /**
     * Initialize animated statistics counter
     */
    function initAnimatedStats() {
        const $statNumbers = $('.stat-number');
        if (!$statNumbers.length) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const $stat = $(entry.target);
                    const text = $stat.text();
                    const targetValue = parseInt(text.replace('+', '')) || 0;
                    if (targetValue > 0) {
                        animateCounter($stat, targetValue);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        $statNumbers.each(function () {
            observer.observe(this);
        });
    }

    /**
     * Animate counter from 0 to target value
     */
    function animateCounter($element, targetValue) {
        let currentValue = 0;
        const increment = Math.ceil(targetValue / 50); // Adjust speed
        const duration = 2000; // 2 seconds
        const interval = Math.max(10, duration / (targetValue / increment));

        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                clearInterval(timer);
            }
            $element.text(currentValue + '+');
        }, interval);
    }

    // ========== INTERACTIVE TIMELINE ==========

    /**
     * Initialize interactive timeline (if exists on page)
     */
    function initTimeline() {
        const $timelineItems = $('.timeline-item');
        if (!$timelineItems.length) return;

        // Set up timeline interactions
        $timelineItems.each(function (index) {
            const $item = $(this);
            const year = $item.data('year') || '199' + (index + 5);
            const title = $item.data('title') || 'Milestone ' + (index + 1);
            const description = $item.data('description') || 'Description of this important milestone.';

            // Add click handler
            $item.on('click', function () {
                showTimelineDetail(year, title, description, index);
            });

            // Add hover effect
            $item.on('mouseenter', function () {
                $(this).addClass('timeline-item-hover');
                highlightTimelineYear(year);
            }).on('mouseleave', function () {
                $(this).removeClass('timeline-item-hover');
                resetTimelineYears();
            });
        });

        // Initialize first timeline item
        if ($timelineItems.length > 0) {
            $timelineItems.first().trigger('click');
        }
    }

    /**
     * Show timeline detail
     */
    function showTimelineDetail(year, title, description, index) {
        // Check if detail elements exist
        if (!$('#detail-title').length) {
            createTimelineDetailSection();
        }

        // Update detail section
        $('#detail-title').text(title);
        $('#detail-year').text(year);
        $('#detail-description').text(description);

        // Show detail section
        $('.timeline-detail').slideDown();

        // Update active item
        $('.timeline-item').removeClass('active');
        $('.timeline-item').eq(index).addClass('active');

        // Announce to screen readers
        announceToScreenReader(`${year}: ${title}. ${description}`);
    }

    /**
     * Create timeline detail section if not exists
     */
    function createTimelineDetailSection() {
        const detailHtml = `
            <div class="timeline-detail mt-5" style="display: none;">
                <div class="card">
                    <div class="card-body">
                        <h3 id="detail-title"></h3>
                        <p id="detail-year" class="text-muted"></p>
                        <p id="detail-description"></p>
                    </div>
                </div>
            </div>
        `;
        $('.timeline-container').after(detailHtml);
    }

    // ========== VALUE CARDS ==========

    /**
     * Initialize value cards interactions
     */
    function initValueCards() {
        const $valueCards = $('.value-card');

        $valueCards.each(function (index) {
            const $card = $(this);

            // Add sequential animation delay
            $card.css('animation-delay', (index * 0.1) + 's');

            // Add click to expand functionality
            $card.on('click', function () {
                expandValueCard($(this));
            });

            // Keyboard navigation
            $card.on('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    expandValueCard($(this));
                }
            });
        });
    }

    /**
     * Expand value card to show more details
     */
    function expandValueCard($card) {
        if ($card.hasClass('expanded')) {
            // Collapse
            $card.removeClass('expanded');
            $card.find('.value-details').slideUp(300);
            announceToScreenReader('Collapsed ' + $card.find('h4').text() + ' details');
        } else {
            // Expand
            $card.addClass('expanded');

            // Create details if not exists
            if (!$card.find('.value-details').length) {
                const valueType = $card.find('h4').text();
                const details = getValueDetails(valueType);
                const $details = $(`
                    <div class="value-details" style="display: none;">
                        <div class="value-examples">
                            <h5>How We Practice This:</h5>
                            <ul>
                                ${details.examples.map(example => `<li>${example}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="value-metrics">
                            <h5>Our Commitment:</h5>
                            <p>${details.commitment}</p>
                        </div>
                    </div>
                `);
                $card.append($details);
            }

            $card.find('.value-details').slideDown(300);

            // Announce expansion to screen readers
            announceToScreenReader('Expanded ' + $card.find('h4').text() + ' details');
        }
    }

    // ========== SCROLL ANIMATIONS ==========

    /**
     * Initialize scroll-triggered animations
     */
    function initScrollAnimations() {
        const $sections = $('section');
        if (!$sections.length) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    $(entry.target).addClass('in-view');

                    // Trigger specific animations based on section
                    const sectionClass = $(entry.target).attr('class');
                    if (sectionClass && sectionClass.includes('section-our-story')) {
                        animateStorySection();
                    } else if (sectionClass && sectionClass.includes('section-our-mission')) {
                        animateMissionSection();
                    } else if (sectionClass && sectionClass.includes('section-coverage')) {
                        animateCoverageSection();
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        $sections.each(function () {
            observer.observe(this);
        });
    }

    /**
     * Animate story section
     */
    function animateStorySection() {
        $('.story-image').addClass('animated');
        $('.signature').addClass('animated');
    }

    /**
     * Animate mission section
     */
    function animateMissionSection() {
        $('.value-card').each(function (index) {
            const $card = $(this);
            setTimeout(() => {
                $card.addClass('animated');
            }, index * 100);
        });
    }

    /**
     * Animate coverage section
     */
    function animateCoverageSection() {
        $('.coverage-card').each(function (index) {
            const $card = $(this);
            setTimeout(() => {
                $card.addClass('animated');
            }, index * 100);
        });
    }

    // ========== PERFORMANCE TRACKING ==========

    /**
     * Initialize about page performance tracking
     */
    function initAboutPerformance() {
        // Track page load time
        const pageLoadTime = performance.now();
        console.log(`About page loaded in ${Math.round(pageLoadTime)}ms`);

        // Track user engagement
        let timeOnPage = 0;
        const engagementInterval = setInterval(() => {
            timeOnPage += 1;

            // Log engagement milestones
            if (timeOnPage === 10) {
                console.log('User spent 10 seconds on about page');
            } else if (timeOnPage === 30) {
                console.log('User spent 30 seconds on about page - high engagement');
            }
        }, 1000);

        // Clean up on page leave
        $(window).on('beforeunload', function () {
            clearInterval(engagementInterval);
            console.log(`User spent ${timeOnPage} seconds on about page`);
        });
    }

    // ========== PRINT FUNCTIONALITY ==========

    /**
     * Initialize print page functionality
     */
    function initPrintFunctionality() {
        // Add print button if not exists
        if (!$('#printAboutPage').length && $('.section-cta .container').length) {
            const $printButton = $(`
                <button id="printAboutPage" class="btn btn-outline-secondary btn-sm print-button mt-3">
                    <i class="fas fa-print me-1"></i> Print Page
                </button>
            `);

            // Insert after CTA section
            $('.section-cta .container').append($printButton);

            // Add click handler
            $printButton.on('click', function () {
                printAboutPage();
            });
        }
    }

    /**
     * Print about page with optimized formatting
     */
    function printAboutPage() {
        // Add print-specific classes
        $('body').addClass('printing');

        // Trigger print dialog
        window.print();

        // Remove print classes after delay
        setTimeout(() => {
            $('body').removeClass('printing');
        }, 1000);

        // Track print event
        trackPrintEvent();
    }

    // ========== SHARE ABOUT PAGE ==========

    /**
     * Initialize share about page functionality
     */
    function initShareAboutPage() {
        // Add share buttons if not exists
        if (!$('#shareAboutPage').length && $('.section-cta .col-lg-8').length) {
            const shareButtons = `
                <div class="share-about-buttons mt-4">
                    <h6 class="mb-2">Share Our Story:</h6>
                    <div class="d-flex gap-2 flex-wrap">
                        <button class="btn btn-sm btn-outline-primary share-twitter">
                            <i class="fab fa-twitter"></i> Twitter
                        </button>
                        <button class="btn btn-sm btn-outline-primary share-linkedin">
                            <i class="fab fa-linkedin-in"></i> LinkedIn
                        </button>
                        <button class="btn btn-sm btn-outline-primary share-facebook">
                            <i class="fab fa-facebook-f"></i> Facebook
                        </button>
                    </div>
                </div>
            `;

            // Insert in CTA section
            $('.section-cta .col-lg-8').append(shareButtons);

            // Add click handlers
            $('.share-twitter').on('click', () => shareOnTwitter());
            $('.share-linkedin').on('click', () => shareOnLinkedIn());
            $('.share-facebook').on('click', () => shareOnFacebook());
        }
    }

    // ========== UTILITY FUNCTIONS ==========

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
        $announcer.text(message);
        setTimeout(() => $announcer.text(''), 1000);
    }

    /**
     * Get value details for expansion
     */
    function getValueDetails(valueType) {
        const details = {
            'Accuracy First': {
                examples: [
                    'Three-source verification rule',
                    'Automated fact-checking systems',
                    'Expert review for complex topics',
                    'Historical data cross-referencing'
                ],
                commitment: 'We maintain a dedicated fact-checking team of 25 specialists who verify every story before publication.'
            },
            'Independence': {
                examples: [
                    'No corporate or political funding',
                    'Transparent funding sources',
                    'Editorial board independence',
                    'Whistleblower protection'
                ],
                commitment: '100% reader-funded model ensures complete editorial independence from commercial or political influence.'
            },
            'Diversity & Inclusion': {
                examples: [
                    'Global correspondent network',
                    'Multilingual reporting teams',
                    'Inclusive hiring practices',
                    'Cultural sensitivity training'
                ],
                commitment: 'Our newsroom represents 65 nationalities and reports in 28 languages to ensure diverse perspectives.'
            },
            'Accountability': {
                examples: [
                    'Public correction policy',
                    'Ombudsman office',
                    'Source transparency',
                    'Ethics committee oversight'
                ],
                commitment: 'We publish corrections prominently and maintain an independent ethics committee for accountability.'
            }
        };

        return details[valueType] || {
            examples: ['Details coming soon'],
            commitment: 'Commitment information will be updated regularly.'
        };
    }

    /**
     * Track print event
     */
    function trackPrintEvent() {
        console.log('About page printed');
        // In real implementation:
        // gtag('event', 'print_page', {
        //     'event_category': 'engagement',
        //     'event_label': 'about_page'
        // });
    }

    /**
     * Share on Twitter
     */
    function shareOnTwitter() {
        const text = 'Learn about Global News Network - 28 years of trusted journalism worldwide.';
        const url = window.location.href;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }

    /**
     * Share on LinkedIn
     */
    function shareOnLinkedIn() {
        const url = window.location.href;
        const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedinUrl, '_blank', 'width=600,height=400');
    }

    /**
     * Share on Facebook
     */
    function shareOnFacebook() {
        const url = window.location.href;
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    }

    // ========== HELPER FUNCTIONS ==========

    /**
     * Highlight timeline year
     */
    function highlightTimelineYear(year) {
        // Implementation would depend on timeline structure
        console.log('Highlighting year:', year);
    }

    /**
     * Reset timeline years
     */
    function resetTimelineYears() {
        // Implementation would depend on timeline structure
        console.log('Resetting timeline highlights');
    }

    // ========== PUBLIC API ==========

    // Expose about page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.about = {
        printPage: printAboutPage,
        shareOnTwitter: shareOnTwitter,
        shareOnLinkedIn: shareOnLinkedIn,
        shareOnFacebook: shareOnFacebook,
        animateStats: initAnimatedStats
    };

    // Log initialization
    console.log('About page JavaScript initialized');
});