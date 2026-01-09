/* ==============================================
   GLOBAL NEWS NETWORK - PRIVACY POLICY JAVASCRIPT
   Privacy policy page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== PRIVACY POLICY INITIALIZATION ==========
    initPrivacyPolicy();

    /**
     * Initialize all privacy policy components
     */
    function initPrivacyPolicy() {
        // Table of Contents Navigation
        initTableOfContents();

        // Print Functionality
        initPrintFunctionality();

        // Policy Acceptance
        initPolicyAcceptance();

        // Cookie Management
        initCookieManagement();

        // Rights Requests
        initRightsRequests();

        // Version History
        initVersionHistory();

        // Section Tracking
        initSectionTracking();

        // Progress Indicator
        initProgressIndicator();

        // Accessibility Features
        initAccessibilityFeatures();

        // Analytics Tracking
        initAnalyticsTracking();
    }

    // ========== TABLE OF CONTENTS ==========

    /**
     * Initialize table of contents navigation
     */
    function initTableOfContents() {
        const $tocLinks = $('#privacyToc .nav-link');
        const $sections = $('.privacy-section');
        let currentSection = '';

        // Highlight current section in TOC
        function updateTOC() {
            const scrollPosition = $(window).scrollTop() + 100;

            $sections.each(function () {
                const $section = $(this);
                const sectionTop = $section.offset().top;
                const sectionHeight = $section.outerHeight();
                const sectionId = $section.attr('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    if (currentSection !== sectionId) {
                        currentSection = sectionId;

                        // Update TOC
                        $tocLinks.removeClass('active');
                        $(`#privacyToc .nav-link[href="#${sectionId}"]`).addClass('active');

                        // Update URL hash without scrolling
                        if (history.replaceState) {
                            history.replaceState(null, null, `#${sectionId}`);
                        }
                    }
                }
            });
        }

        // Smooth scroll to section
        $tocLinks.on('click', function (e) {
            e.preventDefault();

            const targetId = $(this).attr('href');
            const $target = $(targetId);

            if ($target.length) {
                const offset = 80;
                const targetPosition = $target.offset().top - offset;

                $('html, body').animate({
                    scrollTop: targetPosition
                }, 800, 'swing');

                // Update active link
                $tocLinks.removeClass('active');
                $(this).addClass('active');

                // Announce to screen readers
                const sectionTitle = $target.find('h2').text();
                announceToScreenReader(`Navigated to ${sectionTitle}`);
            }
        });

        // Update TOC on scroll
        $(window).on('scroll', throttle(updateTOC, 100));

        // Initial update
        updateTOC();
    }

    // ========== PRINT FUNCTIONALITY ==========

    /**
     * Initialize print functionality
     */
    function initPrintFunctionality() {
        $('#printPolicy').on('click', function () {
            // Store original title
            const originalTitle = document.title;

            // Update title for print
            document.title = `Privacy Policy - Global News Network - ${new Date().toLocaleDateString()}`;

            // Trigger print
            window.print();

            // Restore original title
            document.title = originalTitle;

            // Track print event
            trackEvent('privacy_policy', 'print', 'printed_policy');
        });

        // Add print styles dynamically
        function addPrintStyles() {
            const printStyles = `
                @media print {
                    .no-print { display: none !important; }
                    body { font-size: 12pt; }
                    .container { max-width: 100% !important; }
                    a { color: #000 !important; text-decoration: underline !important; }
                    .data-card, .security-card { break-inside: avoid; }
                }
            `;

            $('<style>')
                .attr('type', 'text/css')
                .attr('media', 'print')
                .html(printStyles)
                .appendTo('head');
        }

        addPrintStyles();
    }

    // ========== POLICY ACCEPTANCE ==========

    /**
     * Initialize policy acceptance functionality
     */
    function initPolicyAcceptance() {
        const $readCheckbox = $('#policyRead');
        const $acceptCheckbox = $('#policyAccept');
        const $confirmButton = $('#confirmAcceptance');

        // Enable/disable confirm button based on checkboxes
        function updateConfirmButton() {
            const isRead = $readCheckbox.is(':checked');
            const isAccepted = $acceptCheckbox.is(':checked');

            $confirmButton.prop('disabled', !(isRead && isAccepted));
        }

        // Checkbox change handlers
        $readCheckbox.add($acceptCheckbox).on('change', updateConfirmButton);

        // Confirm button click handler
        $confirmButton.on('click', function () {
            if (!$confirmButton.prop('disabled')) {
                acceptPrivacyPolicy();
            }
        });

        // Auto-scroll to acceptance section when checkboxes are checked
        $readCheckbox.add($acceptCheckbox).on('change', function () {
            if ($readCheckbox.is(':checked') && $acceptCheckbox.is(':checked')) {
                const $acceptanceSection = $('.policy-acceptance');
                const isInViewport = isElementInViewport($acceptanceSection[0]);

                if (!isInViewport) {
                    $('html, body').animate({
                        scrollTop: $acceptanceSection.offset().top - 100
                    }, 600);
                }
            }
        });
    }

    /**
     * Handle privacy policy acceptance
     */
    function acceptPrivacyPolicy() {
        const $confirmButton = $('#confirmAcceptance');

        // Show loading state
        $confirmButton.html('<i class="fas fa-spinner fa-spin me-2"></i> Processing...');
        $confirmButton.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // In real implementation, this would be an AJAX call
            // $.ajax({
            //     url: '/api/privacy/accept',
            //     method: 'POST',
            //     data: {
            //         accepted: true,
            //         timestamp: new Date().toISOString(),
            //         version: '2.1'
            //     },
            //     success: function(response) {
            //         showAcceptanceSuccess();
            //     },
            //     error: function() {
            //         showAcceptanceError();
            //     }
            // });

            // Mock success for demo
            showAcceptanceSuccess();
        }, 1500);
    }

    /**
     * Show acceptance success message
     */
    function showAcceptanceSuccess() {
        const $confirmButton = $('#confirmAcceptance');

        // Update button
        $confirmButton.html('<i class="fas fa-check-circle me-2"></i> Accepted');
        $confirmButton.removeClass('btn-success').addClass('btn-outline-success');

        // Show success message
        const $successAlert = $(`
            <div class="alert alert-success alert-dismissible fade show mt-3" role="alert">
                <div class="d-flex">
                    <i class="fas fa-check-circle fa-2x me-3"></i>
                    <div>
                        <h5 class="alert-heading">Privacy Policy Accepted</h5>
                        <p class="mb-0">Thank you for accepting our Privacy Policy. Your acceptance has been recorded.</p>
                    </div>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        $('.policy-acceptance').after($successAlert);

        // Track acceptance
        trackEvent('privacy_policy', 'acceptance', 'accepted_v2.1');

        // Store acceptance in localStorage
        localStorage.setItem('privacy_policy_accepted', JSON.stringify({
            version: '2.1',
            timestamp: new Date().toISOString(),
            accepted: true
        }));

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            $successAlert.alert('close');
        }, 10000);
    }

    // ========== COOKIE MANAGEMENT ==========

    /**
     * Initialize cookie management functionality
     */
    function initCookieManagement() {
        $('#manageCookies').on('click', function (e) {
            e.preventDefault();
            showCookiePreferences();
        });

        // Check for existing cookie preferences
        checkExistingPreferences();
    }

    /**
     * Show cookie preferences modal
     */
    function showCookiePreferences() {
        // Create modal content
        const modalContent = `
            <div class="cookie-preferences">
                <h6 class="mb-3">Cookie Preferences</h6>
                
                <div class="cookie-category mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="mb-0">Essential Cookies</h6>
                            <p class="small text-muted mb-0">Required for basic functionality</p>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="essentialCookies" checked disabled>
                            <label class="form-check-label" for="essentialCookies">Always On</label>
                        </div>
                    </div>
                </div>
                
                <div class="cookie-category mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="mb-0">Analytics Cookies</h6>
                            <p class="small text-muted mb-0">Help us improve our services</p>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="analyticsCookies" checked>
                            <label class="form-check-label" for="analyticsCookies">Enable</label>
                        </div>
                    </div>
                    <p class="small text-muted">These cookies collect information about how you use our website.</p>
                </div>
                
                <div class="cookie-category mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <h6 class="mb-0">Marketing Cookies</h6>
                            <p class="small text-muted mb-0">Personalize advertising</p>
                        </div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="marketingCookies">
                            <label class="form-check-label" for="marketingCookies">Enable</label>
                        </div>
                    </div>
                    <p class="small text-muted">These cookies track your browsing habits to show relevant ads.</p>
                </div>
                
                <div class="d-flex justify-content-between mt-4">
                    <button class="btn btn-outline-secondary" id="rejectAllCookies">Reject All Optional</button>
                    <button class="btn btn-primary" id="saveCookiePreferences">Save Preferences</button>
                </div>
            </div>
        `;

        // Set modal content
        $('#cookieModal .modal-body').html(modalContent);

        // Show modal
        $('#cookieModal').modal('show');

        // Load existing preferences
        loadCookiePreferences();

        // Event handlers
        $('#cookieModal').on('click', '#rejectAllCookies', function () {
            $('#analyticsCookies').prop('checked', false);
            $('#marketingCookies').prop('checked', false);
        });

        $('#cookieModal').on('click', '#saveCookiePreferences', saveCookiePreferences);
    }

    /**
     * Load existing cookie preferences
     */
    function loadCookiePreferences() {
        const preferences = getCookiePreferences();

        if (preferences) {
            $('#analyticsCookies').prop('checked', preferences.analytics);
            $('#marketingCookies').prop('checked', preferences.marketing);
        }
    }

    /**
     * Save cookie preferences
     */
    function saveCookiePreferences() {
        const preferences = {
            essential: true, // Always required
            analytics: $('#analyticsCookies').is(':checked'),
            marketing: $('#marketingCookies').is(':checked'),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        // Save to localStorage
        localStorage.setItem('cookie_preferences', JSON.stringify(preferences));

        // Set cookie (in real implementation)
        document.cookie = `cookie_prefs=${JSON.stringify(preferences)}; path=/; max-age=31536000; SameSite=Lax`;

        // Show success message
        showToast('Cookie preferences saved successfully!', 'success');

        // Close modal
        $('#cookieModal').modal('hide');

        // Track preference update
        trackEvent('cookies', 'preferences_updated', JSON.stringify(preferences));
    }

    /**
     * Get current cookie preferences
     */
    function getCookiePreferences() {
        // Try to get from localStorage first
        const stored = localStorage.getItem('cookie_preferences');

        if (stored) {
            return JSON.parse(stored);
        }

        // Default preferences
        return {
            essential: true,
            analytics: true,
            marketing: false,
            timestamp: null,
            version: '1.0'
        };
    }

    /**
     * Check existing preferences
     */
    function checkExistingPreferences() {
        const preferences = getCookiePreferences();

        if (!preferences.timestamp) {
            // First visit - show cookie banner (in real implementation)
            console.log('First visit - would show cookie banner');
        }
    }

    // ========== RIGHTS REQUESTS ==========

    /**
     * Initialize rights request functionality
     */
    function initRightsRequests() {
        // Request Data button
        $('#requestData').on('click', function () {
            showRightsRequestModal('access');
        });

        // Delete Data button
        $('#deleteData').on('click', function () {
            showRightsRequestModal('deletion');
        });

        // Update Preferences button
        $('#updatePreferences').on('click', function () {
            showRightsRequestModal('preferences');
        });
    }

    /**
     * Show rights request modal
     */
    function showRightsRequestModal(type) {
        const modalConfigs = {
            access: {
                title: 'Request Your Data',
                description: 'Request a copy of the personal data we hold about you.',
                fields: [
                    { type: 'email', label: 'Email Address', required: true },
                    { type: 'text', label: 'Full Name', required: true },
                    { type: 'textarea', label: 'Additional Information', required: false }
                ],
                submitText: 'Submit Data Request'
            },
            deletion: {
                title: 'Request Data Deletion',
                description: 'Request deletion of your personal data from our systems.',
                warning: 'This action cannot be undone and may affect your ability to use our services.',
                fields: [
                    { type: 'email', label: 'Email Address', required: true },
                    { type: 'text', label: 'Reason for Deletion', required: false }
                ],
                submitText: 'Request Deletion'
            },
            preferences: {
                title: 'Update Preferences',
                description: 'Update your communication and data processing preferences.',
                fields: [
                    { type: 'email', label: 'Email Address', required: true },
                    { type: 'checkbox', label: 'Email Notifications', checked: true },
                    { type: 'checkbox', label: 'Personalized Content', checked: true },
                    { type: 'checkbox', label: 'Third-Party Sharing', checked: false }
                ],
                submitText: 'Update Preferences'
            }
        };

        const config = modalConfigs[type];
        if (!config) return;

        // Build form fields
        let fieldsHtml = '';
        config.fields.forEach((field, index) => {
            if (field.type === 'textarea') {
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="field${index}" class="form-label">${field.label}</label>
                        <textarea class="form-control" id="field${index}" rows="3" ${field.required ? 'required' : ''}></textarea>
                    </div>
                `;
            } else if (field.type === 'checkbox') {
                fieldsHtml += `
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="field${index}" ${field.checked ? 'checked' : ''}>
                        <label class="form-check-label" for="field${index}">${field.label}</label>
                    </div>
                `;
            } else {
                fieldsHtml += `
                    <div class="mb-3">
                        <label for="field${index}" class="form-label">${field.label}</label>
                        <input type="${field.type}" class="form-control" id="field${index}" ${field.required ? 'required' : ''}>
                    </div>
                `;
            }
        });

        // Build modal HTML
        const modalHtml = `
            <div class="modal fade" id="rightsRequestModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${config.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p>${config.description}</p>
                            ${config.warning ? `<div class="alert alert-warning">${config.warning}</div>` : ''}
                            <form id="rightsRequestForm">
                                ${fieldsHtml}
                                <div class="form-check mb-3">
                                    <input class="form-check-input" type="checkbox" id="verifyIdentity" required>
                                    <label class="form-check-label" for="verifyIdentity">
                                        I verify that I am the owner of this data
                                    </label>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="submitRightsRequest">${config.submitText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        $('#rightsRequestModal').remove();

        // Add modal to page
        $('body').append(modalHtml);

        // Show modal
        const $modal = $('#rightsRequestModal');
        $modal.modal('show');

        // Submit handler
        $modal.on('click', '#submitRightsRequest', function () {
            submitRightsRequest(type, $modal);
        });

        // Clean up on close
        $modal.on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }

    /**
     * Submit rights request
     */
    function submitRightsRequest(type, $modal) {
        const $form = $modal.find('#rightsRequestForm');

        if (!$form[0].checkValidity()) {
            $form[0].reportValidity();
            return;
        }

        const $submitButton = $modal.find('#submitRightsRequest');

        // Show loading state
        $submitButton.html('<i class="fas fa-spinner fa-spin me-2"></i> Processing...');
        $submitButton.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // Mock success
            $modal.modal('hide');

            showToast(`Your ${type} request has been submitted successfully!`, 'success');

            // Track request
            trackEvent('privacy_rights', type + '_request', 'submitted');

            // Send confirmation email (in real implementation)
            console.log(`Would send ${type} request confirmation email`);
        }, 2000);
    }

    // ========== VERSION HISTORY ==========

    /**
     * Initialize version history functionality
     */
    function initVersionHistory() {
        $('#viewHistory').on('click', function (e) {
            e.preventDefault();
            showVersionHistory();
        });

        // Check for policy updates
        checkForUpdates();
    }

    /**
     * Show version history modal
     */
    function showVersionHistory() {
        const versions = [
            {
                version: '2.1',
                date: 'October 15, 2023',
                changes: [
                    'Updated data sharing practices',
                    'Added new cookie categories',
                    'Enhanced security measures',
                    'Compliance with new regulations'
                ]
            },
            {
                version: '2.0',
                date: 'January 1, 2023',
                changes: [
                    'Major policy restructuring',
                    'Added data portability rights',
                    'Updated international transfer mechanisms',
                    'Enhanced transparency reporting'
                ]
            },
            {
                version: '1.2',
                date: 'June 30, 2022',
                changes: [
                    'Clarified data retention periods',
                    'Added children\'s privacy section',
                    'Updated contact information',
                    'Minor language improvements'
                ]
            }
        ];

        // Build modal content
        let historyHtml = '<div class="version-history">';

        versions.forEach(version => {
            historyHtml += `
                <div class="version-item mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h6 class="mb-0">Version ${version.version}</h6>
                        <span class="badge bg-secondary">${version.date}</span>
                    </div>
                    <ul class="small">
                        ${version.changes.map(change => `<li>${change}</li>`).join('')}
                    </ul>
                </div>
            `;
        });

        historyHtml += '</div>';

        // Create modal
        const modalHtml = `
            <div class="modal fade" id="versionHistoryModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Privacy Policy Version History</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ${historyHtml}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal
        $('#versionHistoryModal').remove();

        // Add modal to page
        $('body').append(modalHtml);

        // Show modal
        $('#versionHistoryModal').modal('show');

        // Clean up on close
        $('#versionHistoryModal').on('hidden.bs.modal', function () {
            $(this).remove();
        });
    }

    /**
     * Check for policy updates
     */
    function checkForUpdates() {
        const lastAccepted = localStorage.getItem('privacy_policy_accepted');
        const currentVersion = '2.1';

        if (lastAccepted) {
            const acceptedData = JSON.parse(lastAccepted);

            if (acceptedData.version !== currentVersion) {
                // Show update notification
                showUpdateNotification(acceptedData.version, currentVersion);
            }
        }
    }

    /**
     * Show update notification
     */
    function showUpdateNotification(oldVersion, newVersion) {
        const $notification = $(`
            <div class="alert alert-info alert-dismissible fade show fixed-top m-3" role="alert" style="z-index: 2000;">
                <div class="d-flex align-items-center">
                    <i class="fas fa-info-circle fa-2x me-3"></i>
                    <div>
                        <h6 class="alert-heading mb-1">Privacy Policy Updated</h6>
                        <p class="mb-0">Our Privacy Policy has been updated from v${oldVersion} to v${newVersion}. Please review the changes.</p>
                    </div>
                </div>
                <div class="mt-2">
                    <a href="#changes" class="btn btn-sm btn-outline-info me-2">View Changes</a>
                    <button type="button" class="btn btn-sm btn-info" id="acknowledgeUpdate">Acknowledge</button>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        $('body').append($notification);

        // Acknowledge button
        $notification.on('click', '#acknowledgeUpdate', function () {
            localStorage.setItem('privacy_update_acknowledged', newVersion);
            $notification.alert('close');
        });

        // Auto-dismiss after 30 seconds
        setTimeout(() => {
            $notification.alert('close');
        }, 30000);
    }

    // ========== SECTION TRACKING ==========

    /**
     * Initialize section tracking
     */
    function initSectionTracking() {
        const $sections = $('.privacy-section');
        const viewedSections = new Set();

        function trackSectionView(sectionId) {
            if (!viewedSections.has(sectionId)) {
                viewedSections.add(sectionId);

                // Track in analytics
                trackEvent('privacy_policy', 'section_view', sectionId);

                // Update progress indicator
                updateProgressIndicator();
            }
        }

        // Intersection Observer for section tracking
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        trackSectionView(sectionId);
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -50% 0px'
            });

            $sections.each(function () {
                observer.observe(this);
            });
        }
    }

    // ========== PROGRESS INDICATOR ==========

    /**
     * Initialize progress indicator
     */
    function initProgressIndicator() {
        // Add progress bar to DOM
        $('body').append('<div class="progress-indicator"><div class="progress-bar"></div></div>');

        // Update progress on scroll
        $(window).on('scroll', throttle(updateProgressIndicator, 100));
    }

    /**
     * Update progress indicator
     */
    function updateProgressIndicator() {
        const $window = $(window);
        const $document = $(document);
        const $progressBar = $('.progress-bar');

        const windowHeight = $window.height();
        const documentHeight = $document.height();
        const scrollTop = $window.scrollTop();

        const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
        $progressBar.css('width', progress + '%');
    }

    // ========== ACCESSIBILITY FEATURES ==========

    /**
     * Initialize accessibility features
     */
    function initAccessibilityFeatures() {
        // Add skip to content link
        $('body').prepend(`
            <a href="#main-content" class="skip-to-content">Skip to main content</a>
        `);

        // Add aria labels to interactive elements
        $('[data-bs-toggle]').each(function () {
            const $element = $(this);
            const target = $element.data('bs-target') || $element.attr('href');
            const label = $element.attr('aria-label') || $element.text();

            if (target) {
                $element.attr('aria-controls', target.substring(1));
            }

            if (!label.includes('button') && !label.includes('link')) {
                $element.attr('aria-label', `${label} button`);
            }
        });

        // Keyboard navigation for TOC
        $('#privacyToc .nav-link').on('keydown', function (e) {
            const $current = $(this);
            const $links = $('#privacyToc .nav-link');
            const currentIndex = $links.index($current);

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    if (currentIndex < $links.length - 1) {
                        $links.eq(currentIndex + 1).focus();
                    }
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    if (currentIndex > 0) {
                        $links.eq(currentIndex - 1).focus();
                    }
                    break;
                case 'Home':
                    e.preventDefault();
                    $links.first().focus();
                    break;
                case 'End':
                    e.preventDefault();
                    $links.last().focus();
                    break;
            }
        });
    }

    // ========== ANALYTICS TRACKING ==========

    /**
     * Initialize analytics tracking
     */
    function initAnalyticsTracking() {
        // Track page view
        trackEvent('page_view', 'privacy_policy', window.location.pathname);

        // Track time spent on page
        let startTime = Date.now();

        $(window).on('beforeunload', function () {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            trackEvent('time_spent', 'privacy_policy', timeSpent + 's');
        });

        // Track scroll depth
        let maxScrollDepth = 0;

        $(window).on('scroll', throttle(function () {
            const scrollPercent = Math.round(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);

            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;

                // Track at 25%, 50%, 75%, 100%
                if ([25, 50, 75, 100].includes(Math.floor(scrollPercent / 25) * 25)) {
                    trackEvent('scroll_depth', 'privacy_policy', scrollPercent + '%');
                }
            }
        }, 1000));
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Show toast notification
     */
    function showToast(message, type = 'info') {
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="d-flex">
                    <div class="toast-body">
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        // Create toast container if it doesn't exist
        if (!$('.toast-container').length) {
            $('body').append('<div class="toast-container position-fixed bottom-0 end-0 p-3"></div>');
        }

        // Add toast to container
        $('.toast-container').append(toastHtml);

        // Show toast
        const toast = new bootstrap.Toast($('#' + toastId)[0], {
            autohide: true,
            delay: 5000
        });
        toast.show();

        // Remove toast after hiding
        $('#' + toastId).on('hidden.bs.toast', function () {
            $(this).remove();
        });
    }

    /**
     * Check if element is in viewport
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
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
     * Track event for analytics
     */
    function trackEvent(category, action, label) {
        console.log('Event tracked:', { category, action, label });

        // In real implementation:
        // gtag('event', action, {
        //     'event_category': category,
        //     'event_label': label
        // });
    }

    // ========== PUBLIC API ==========

    // Expose privacy policy functions if needed
    window.GNN = window.GNN || {};
    window.GNN.privacy = {
        acceptPolicy: acceptPrivacyPolicy,
        showCookiePreferences: showCookiePreferences,
        showRightsRequest: showRightsRequestModal,
        getCookiePreferences: getCookiePreferences
    };

    // Log initialization
    console.log('Privacy Policy JavaScript initialized');
});