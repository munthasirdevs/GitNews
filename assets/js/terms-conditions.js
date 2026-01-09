/* ==============================================
   GLOBAL NEWS NETWORK - TERMS & CONDITIONS PAGE
   Specific functionality for terms and conditions page
   ============================================== */

$(document).ready(function () {

    // ========== PAGE INITIALIZATION ==========
    initTermsPage();

    /**
     * Initialize all terms page components
     */
    function initTermsPage() {
        // Initialize scroll spy for navigation
        initScrollSpy();

        // Initialize print functionality
        initPrintFunctionality();

        // Initialize mobile navigation
        initMobileNavigation();

        // Initialize acceptance functionality
        initAcceptanceFunctionality();

        // Initialize PDF download
        initPDFDownload();

        // Initialize last updated date
        initLastUpdatedDate();

        // Initialize table of contents
        initTableOfContents();

        // Initialize smooth scrolling
        initSmoothScrolling();

        // Initialize accessibility features
        initAccessibilityFeatures();

        // Initialize legal document tracking
        initLegalDocumentTracking();
    }

    // ========== SCROLL SPY ==========

    /**
     * Initialize scroll spy for navigation highlighting
     */
    function initScrollSpy() {
        const sections = $('.terms-section');
        const navLinks = $('.legal-sidebar .nav-link');

        // Highlight active section on scroll
        $(window).on('scroll', function () {
            const scrollPosition = $(window).scrollTop() + 100; // Offset for fixed header

            let currentSection = '';

            sections.each(function () {
                const sectionTop = $(this).offset().top;
                const sectionHeight = $(this).outerHeight();
                const sectionId = $(this).attr('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    currentSection = sectionId;
                    return false; // Break loop
                }
            });

            // Update active link
            navLinks.removeClass('active');
            if (currentSection) {
                $(`.legal-sidebar .nav-link[href="#${currentSection}"]`).addClass('active');
            }
        });

        // Trigger scroll event on load
        $(window).trigger('scroll');
    }

    // ========== PRINT FUNCTIONALITY ==========

    /**
     * Initialize print terms functionality
     */
    function initPrintFunctionality() {
        $('#printTerms').on('click', function (e) {
            e.preventDefault();

            // Store original state
            const originalTitle = document.title;
            const originalBodyClasses = $('body').attr('class');

            // Update for printing
            document.title = 'Terms & Conditions - Global News Network';
            $('body').addClass('printing');

            // Show print dialog
            window.print();

            // Restore original state
            setTimeout(() => {
                document.title = originalTitle;
                $('body').removeClass('printing').attr('class', originalBodyClasses);

                // Show success message
                showToast('Terms document sent to printer.', 'success');
            }, 100);
        });

        // Listen for print dialog close
        window.addEventListener('afterprint', function () {
            console.log('Print dialog closed');
            trackPrintEvent();
        });
    }

    /**
     * Track print event
     */
    function trackPrintEvent() {
        console.log('Terms & Conditions printed');
        // In real implementation:
        // gtag('event', 'print_terms', {
        //     'event_category': 'engagement',
        //     'event_label': 'Terms & Conditions'
        // });
    }

    // ========== MOBILE NAVIGATION ==========

    /**
     * Initialize mobile navigation
     */
    function initMobileNavigation() {
        // Create mobile navigation button
        if ($(window).width() < 992) {
            createMobileNavButton();
        }

        // Generate mobile navigation list
        generateMobileNavList();

        // Handle window resize
        $(window).on('resize', function () {
            if ($(window).width() < 992) {
                if (!$('#mobileNavButton').length) {
                    createMobileNavButton();
                }
            } else {
                $('#mobileNavButton').remove();
            }
        });
    }

    /**
     * Create mobile navigation button
     */
    function createMobileNavButton() {
        const mobileButton = $('<button/>', {
            id: 'mobileNavButton',
            class: 'btn btn-primary mobile-nav-btn',
            html: '<i class="fas fa-bars"></i>',
            'aria-label': 'Open terms navigation',
            'data-bs-toggle': 'modal',
            'data-bs-target': '#mobileTermsNav'
        });

        $('body').append(mobileButton);

        // Add click handler
        mobileButton.on('click', function () {
            trackMobileNavOpen();
        });
    }

    /**
     * Generate mobile navigation list
     */
    function generateMobileNavList() {
        const sections = $('.terms-section');
        const $navList = $('#mobileTermsNavList');

        if (sections.length && $navList.length) {
            sections.each(function () {
                const $section = $(this);
                const sectionId = $section.attr('id');
                const sectionTitle = $section.find('.section-title').text();

                const navItem = `
                    <a class="nav-link" href="#${sectionId}" data-bs-dismiss="modal">
                        ${sectionTitle}
                    </a>
                `;

                $navList.append(navItem);
            });

            // Add click handlers
            $navList.find('.nav-link').on('click', function () {
                const targetId = $(this).attr('href');
                const $target = $(targetId);

                if ($target.length) {
                    // Close modal
                    $('#mobileTermsNav').modal('hide');

                    // Scroll to section
                    setTimeout(() => {
                        $('html, body').animate({
                            scrollTop: $target.offset().top - 80
                        }, 800);
                    }, 300);

                    trackMobileNavClick(sectionTitle);
                }
            });
        }
    }

    // ========== ACCEPTANCE FUNCTIONALITY ==========

    /**
     * Initialize terms acceptance functionality
     */
    function initAcceptanceFunctionality() {
        const $agreeCheckbox = $('#agreeTerms');
        const $acceptButton = $('#acceptTerms');
        const $declineButton = $('#declineTerms');

        // Handle checkbox change
        $agreeCheckbox.on('change', function () {
            $acceptButton.prop('disabled', !$(this).prop('checked'));
        });

        // Handle accept button click
        $acceptButton.on('click', function () {
            acceptTerms();
        });

        // Handle decline button click
        $declineButton.on('click', function () {
            declineTerms();
        });

        // Check for existing acceptance
        checkExistingAcceptance();
    }

    /**
     * Accept terms and conditions
     */
    function acceptTerms() {
        const $acceptButton = $('#acceptTerms');
        const $agreeCheckbox = $('#agreeTerms');

        // Show loading state
        $acceptButton.html('<i class="fas fa-spinner fa-spin me-2"></i> Accepting...');
        $acceptButton.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // Store acceptance in localStorage
            localStorage.setItem('gnn_terms_accepted', 'true');
            localStorage.setItem('gnn_terms_version', '3.2');
            localStorage.setItem('gnn_terms_accepted_date', new Date().toISOString());

            // Show success message
            showToast('Terms & Conditions accepted successfully!', 'success');

            // Update UI
            $acceptButton.html('<i class="fas fa-check-circle me-2"></i> Accepted');
            $acceptButton.removeClass('btn-primary').addClass('btn-success');
            $agreeCheckbox.prop('disabled', true);

            // Track acceptance
            trackTermsAcceptance();

            // Redirect after delay
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }, 1500);
    }

    /**
     * Decline terms and conditions
     */
    function declineTerms() {
        if (confirm('Declining our Terms & Conditions will restrict your access to certain features. Are you sure you want to decline?')) {
            // Store decline in localStorage
            localStorage.setItem('gnn_terms_accepted', 'false');

            // Show message
            showToast('You have declined the Terms & Conditions. Some features may be limited.', 'warning');

            // Track decline
            trackTermsDecline();

            // Redirect to home
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    /**
     * Check for existing acceptance
     */
    function checkExistingAcceptance() {
        const isAccepted = localStorage.getItem('gnn_terms_accepted');
        const acceptedVersion = localStorage.getItem('gnn_terms_version');

        if (isAccepted === 'true' && acceptedVersion === '3.2') {
            // Terms already accepted for this version
            $('#agreeTerms').prop('checked', true).prop('disabled', true);
            $('#acceptTerms').prop('disabled', false).html('<i class="fas fa-check-circle me-2"></i> Already Accepted');

            // Add read-only note
            const note = $('<div/>', {
                class: 'alert alert-info mt-3',
                html: '<i class="fas fa-info-circle me-2"></i>You have already accepted these Terms & Conditions on ' +
                    new Date(localStorage.getItem('gnn_terms_accepted_date')).toLocaleDateString()
            });

            $('.acceptance-actions').after(note);
        }
    }

    // ========== PDF DOWNLOAD ==========

    /**
     * Initialize PDF download functionality
     */
    function initPDFDownload() {
        $('#downloadPDF').on('click', function (e) {
            e.preventDefault();
            downloadTermsPDF();
        });
    }

    /**
     * Download terms as PDF
     */
    function downloadTermsPDF() {
        const $button = $('#downloadPDF');
        const originalText = $button.html();

        // Show loading state
        $button.html('<i class="fas fa-spinner fa-spin me-2"></i> Preparing PDF...');
        $button.prop('disabled', true);

        // Simulate PDF generation
        setTimeout(() => {
            // In real implementation, this would generate and download a PDF
            // For demo, we'll simulate the download

            // Create download link
            const pdfContent = generatePDFContent();
            const blob = new Blob([pdfContent], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);

            // Create temporary link
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Global_News_Network_Terms_Conditions.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up
            URL.revokeObjectURL(url);

            // Restore button
            $button.html(originalText);
            $button.prop('disabled', false);

            // Show success message
            showToast('Terms PDF downloaded successfully!', 'success');

            // Track download
            trackPDFDownload();
        }, 2000);
    }

    /**
     * Generate PDF content (simulated)
     */
    function generatePDFContent() {
        const sections = $('.terms-section');
        let content = 'Global News Network - Terms & Conditions\n';
        content += 'Version 3.2 | Effective: November 15, 2023\n\n';

        sections.each(function (index) {
            const title = $(this).find('.section-title').text();
            const text = $(this).find('.section-content').text();
            content += `${index + 1}. ${title}\n${text}\n\n`;
        });

        content += '\n\n--- END OF DOCUMENT ---';
        return content;
    }

    // ========== LAST UPDATED DATE ==========

    /**
     * Initialize last updated date display
     */
    function initLastUpdatedDate() {
        const lastUpdated = new Date('2023-11-15');
        const formattedDate = lastUpdated.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        $('#lastUpdatedDate').text(formattedDate);

        // Add tooltip with exact time
        $('#lastUpdatedDate').attr('title', `Last updated: ${lastUpdated.toLocaleString()}`);
        $('#lastUpdatedDate').tooltip();
    }

    // ========== TABLE OF CONTENTS ==========

    /**
     * Initialize dynamic table of contents
     */
    // function initTableOfContents() {
    //     const sections = $('.terms-section');
    //     const tocContainer = $('<div/>', {
    //         class: 'toc-container d-none d-lg-block'
    //     });

    //     if (sections.length) {
    //         let tocHTML = '<h5 class="toc-title">Table of Contents</h5><ul class="toc-list">';

    //         sections.each(function (index) {
    //             const sectionId = $(this).attr('id');
    //             const sectionTitle = $(this).find('.section-title').text();

    //             tocHTML += `
    //                 <li class="toc-item">
    //                     <a href="#${sectionId}" class="toc-link">
    //                         <span class="toc-number">${index + 1}.</span>
    //                         <span class="toc-text">${sectionTitle}</span>
    //                     </a>
    //                 </li>
    //             `;
    //         });

    //         tocHTML += '</ul>';
    //         tocContainer.html(tocHTML);

    //         // Insert after sidebar actions
    //         $('.sidebar-actions').after(tocContainer);

    //         // Add click handlers
    //         tocContainer.find('.toc-link').on('click', function (e) {
    //             e.preventDefault();
    //             const targetId = $(this).attr('href');
    //             const $target = $(targetId);

    //             if ($target.length) {
    //                 $('html, body').animate({
    //                     scrollTop: $target.offset().top - 80
    //                 }, 800);

    //                 trackTOCClick(targetId);
    //             }
    //         });
    //     }
    // }

    // ========== SMOOTH SCROLLING ==========

    /**
     * Initialize enhanced smooth scrolling
     */
    function initSmoothScrolling() {
        $('a[href^="#"]').on('click', function (e) {
            const $link = $(this);
            const targetId = $link.attr('href');

            if (targetId === '#') return;

            const $target = $(targetId);
            if ($target.length) {
                e.preventDefault();

                const offset = 80; // Account for fixed header
                const targetPosition = $target.offset().top - offset;

                $('html, body').animate({
                    scrollTop: targetPosition
                }, 800, 'swing');

                // Update URL without page reload
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }

                // Announce to screen readers
                announceToScreenReader(`Navigated to ${$target.find('.section-title').text()}`);
            }
        });
    }

    // ========== ACCESSIBILITY FEATURES ==========

    /**
     * Initialize accessibility features
     */
    function initAccessibilityFeatures() {
        // Add skip to content link
        addSkipToContentLink();

        // Add keyboard navigation
        initKeyboardNavigation();

        // Add high contrast mode detection
        initHighContrastMode();

        // Add screen reader announcements
        initScreenReaderAnnouncements();
    }

    /**
     * Add skip to content link
     */
    // function addSkipToContentLink() {
    //     const skipLink = $('<a/>', {
    //         href: '#main-content',
    //         class: 'skip-to-content',
    //         text: 'Skip to main content'
    //     });

    //     $('body').prepend(skipLink);

    //     skipLink.on('click', function () {
    //         $('main').attr('tabindex', '-1').focus();
    //     });
    // }

    /**
     * Initialize keyboard navigation
     */
    function initKeyboardNavigation() {
        $(document).on('keydown', function (e) {
            // Ctrl/Cmd + P for print
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                $('#printTerms').trigger('click');
            }

            // Ctrl/Cmd + D for download
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                $('#downloadPDF').trigger('click');
            }

            // Escape key closes modals
            if (e.key === 'Escape') {
                $('.modal.show').modal('hide');
            }
        });

        // Focus trap for modals
        $('.modal').on('shown.bs.modal', function () {
            $(this).find('[autofocus]').focus();
        });
    }

    /**
     * Initialize high contrast mode detection
     */
    function initHighContrastMode() {
        const prefersContrast = window.matchMedia('(prefers-contrast: high)');

        function updateContrastMode(e) {
            if (e.matches) {
                $('body').addClass('high-contrast');
                announceToScreenReader('High contrast mode activated');
            } else {
                $('body').removeClass('high-contrast');
            }
        }

        // Initial check
        updateContrastMode(prefersContrast);

        // Listen for changes
        prefersContrast.addEventListener('change', updateContrastMode);
    }

    /**
     * Initialize screen reader announcements
     */
    function initScreenReaderAnnouncements() {
        // Announce page load
        setTimeout(() => {
            announceToScreenReader('Terms and Conditions page loaded. Use headings navigation to browse sections.');
        }, 1000);

        // Announce section visibility
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionTitle = $(entry.target).find('.section-title').text();
                    announceToScreenReader(`Now viewing: ${sectionTitle}`);
                }
            });
        }, observerOptions);

        $('.terms-section').each(function () {
            observer.observe(this);
        });
    }

    // ========== LEGAL DOCUMENT TRACKING ==========

    /**
     * Initialize legal document tracking
     */
    function initLegalDocumentTracking() {
        // Track page view
        trackTermsView();

        // Track time spent on page
        initTimeTracking();

        // Track scroll depth
        initScrollDepthTracking();

        // Track user engagement
        initEngagementTracking();
    }

    /**
     * Track terms page view
     */
    function trackTermsView() {
        console.log('Terms & Conditions page viewed');
        // In real implementation:
        // gtag('event', 'view_terms', {
        //     'event_category': 'legal',
        //     'event_label': 'Terms & Conditions'
        // });
    }

    /**
     * Initialize time spent tracking
     */
    function initTimeTracking() {
        let startTime = Date.now();
        let maxTime = 0;

        // Update every 30 seconds
        const timeInterval = setInterval(() => {
            const currentTime = Math.floor((Date.now() - startTime) / 1000);
            maxTime = Math.max(maxTime, currentTime);

            // Track at specific intervals
            if (currentTime === 30 || currentTime === 60 || currentTime === 120) {
                trackTimeSpent(currentTime);
            }
        }, 1000);

        // Clean up on page unload
        $(window).on('beforeunload', function () {
            clearInterval(timeInterval);
            trackTimeSpent(maxTime);
        });
    }

    /**
     * Initialize scroll depth tracking
     */
    function initScrollDepthTracking() {
        const sections = $('.terms-section');
        const totalSections = sections.length;
        let sectionsViewed = new Set();

        $(window).on('scroll', function () {
            sections.each(function () {
                const sectionId = $(this).attr('id');
                const sectionTop = $(this).offset().top;
                const sectionHeight = $(this).outerHeight();
                const scrollPosition = $(window).scrollTop() + $(window).height();

                if (scrollPosition > sectionTop + sectionHeight * 0.5) {
                    if (!sectionsViewed.has(sectionId)) {
                        sectionsViewed.add(sectionId);
                        trackScrollDepth(sectionsViewed.size, totalSections);
                    }
                }
            });
        });
    }

    /**
     * Initialize engagement tracking
     */
    function initEngagementTracking() {
        // Track checkbox interaction
        $('#agreeTerms').on('change', function () {
            trackEngagement('checkbox_interaction', $(this).prop('checked'));
        });

        // Track button clicks
        $('.btn').on('click', function () {
            const buttonText = $(this).text().trim();
            trackEngagement('button_click', buttonText);
        });

        // Track link clicks
        $('.nav-link').on('click', function () {
            const linkText = $(this).text().trim();
            trackEngagement('nav_link_click', linkText);
        });
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        // Remove existing toasts
        $('.toast').remove();

        const toast = $(`
            <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `);

        $('body').append(toast);

        const toastInstance = new bootstrap.Toast(toast[0], {
            delay: 3000
        });

        toastInstance.show();

        // Remove after hiding
        toast.on('hidden.bs.toast', function () {
            $(this).remove();
        });
    }

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

    // ========== TRACKING FUNCTIONS ==========

    /**
     * Track mobile navigation open
     */
    function trackMobileNavOpen() {
        console.log('Mobile navigation opened');
        // gtag('event', 'mobile_nav_open', { 'event_category': 'navigation' });
    }

    /**
     * Track mobile navigation click
     */
    function trackMobileNavClick(section) {
        console.log(`Mobile navigation clicked: ${section}`);
        // gtag('event', 'mobile_nav_click', { 'event_category': 'navigation', 'event_label': section });
    }

    /**
     * Track terms acceptance
     */
    function trackTermsAcceptance() {
        console.log('Terms accepted');
        // gtag('event', 'terms_accepted', { 'event_category': 'legal', 'event_label': 'Version 3.2' });
    }

    /**
     * Track terms decline
     */
    function trackTermsDecline() {
        console.log('Terms declined');
        // gtag('event', 'terms_declined', { 'event_category': 'legal' });
    }

    /**
     * Track PDF download
     */
    function trackPDFDownload() {
        console.log('PDF downloaded');
        // gtag('event', 'pdf_download', { 'event_category': 'legal' });
    }

    /**
     * Track TOC click
     */
    function trackTOCClick(section) {
        console.log(`TOC clicked: ${section}`);
        // gtag('event', 'toc_click', { 'event_category': 'navigation', 'event_label': section });
    }

    /**
     * Track time spent
     */
    function trackTimeSpent(seconds) {
        console.log(`Time spent: ${seconds} seconds`);
        // gtag('event', 'time_spent', { 'event_category': 'engagement', 'event_label': seconds + 's' });
    }

    /**
     * Track scroll depth
     */
    function trackScrollDepth(viewed, total) {
        const percentage = Math.round((viewed / total) * 100);
        console.log(`Scroll depth: ${percentage}%`);

        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(percentage)) {
            // gtag('event', 'scroll_depth', { 'event_category': 'engagement', 'event_label': `${percentage}%` });
        }
    }

    /**
     * Track user engagement
     */
    function trackEngagement(action, value) {
        console.log(`Engagement: ${action} - ${value}`);
        // gtag('event', 'engagement', { 'event_category': 'user_interaction', 'event_label': action, 'value': value });
    }

    // ========== ERROR HANDLING ==========

    /**
     * Initialize error handling
     */
    function initErrorHandling() {
        window.addEventListener('error', function (e) {
            console.error('Terms page error:', e.error);

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

    // Expose functions if needed
    window.GNN = window.GNN || {};
    window.GNN.terms = {
        acceptTerms: acceptTerms,
        declineTerms: declineTerms,
        downloadTermsPDF: downloadTermsPDF,
        printTerms: function () { $('#printTerms').trigger('click'); }
    };

    // Log initialization
    console.log('Terms & Conditions page JavaScript initialized');
});