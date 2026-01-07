/* ==============================================
   GLOBAL NEWS NETWORK - ADVERTISE PAGE JAVASCRIPT
   Advertising page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== ADVERTISE PAGE INITIALIZATION ==========
    initAdvertisePage();

    /**
     * Initialize all advertising page components
     */
    function initAdvertisePage() {
        // Package Selection
        initPackageSelection();

        // Contact Form
        initContactForm();

        // Budget Calculator
        initBudgetCalculator();

        // FAQ Accordion
        initFAQAccordion();

        // Testimonial Carousel
        initTestimonialCarousel();

        // Form Validation
        initFormValidation();

        // Lead Tracking
        initLeadTracking();

        // Scroll Animations
        initScrollAnimations();

        // Performance Tracking
        initPerformanceTracking();
    }

    // ========== PACKAGE SELECTION ==========

    /**
     * Initialize package selection functionality
     */
    function initPackageSelection() {
        const $packageCards = $('.package-card');
        const $selectButtons = $('.select-package');

        // Package click handlers
        $packageCards.each(function () {
            const $card = $(this);

            $card.on('click', function (e) {
                if (!$(e.target).closest('.select-package').length) {
                    // Select package on card click (except button)
                    const packageType = $card.find('.select-package').data('package');
                    selectPackage(packageType);
                }
            });

            // Hover effects
            $card.hover(
                function () {
                    $(this).addClass('hover');
                },
                function () {
                    $(this).removeClass('hover');
                }
            );
        });

        // Button click handlers
        $selectButtons.on('click', function (e) {
            e.stopPropagation();
            const packageType = $(this).data('package');
            selectPackage(packageType);

            // Scroll to contact form
            $('html, body').animate({
                scrollTop: $('#contact-form').offset().top - 80
            }, 800);

            // Pre-fill package selection in form
            prefillPackageSelection(packageType);
        });
    }

    /**
     * Select a package with visual feedback
     */
    function selectPackage(packageType) {
        const packages = {
            'starter': {
                name: 'Starter',
                price: '$2,500',
                features: ['Display Advertising', '500K Impressions', '2 Ad Placements', 'Basic Analytics']
            },
            'professional': {
                name: 'Professional',
                price: '$7,500',
                features: ['Display Advertising', '2M Impressions', '5 Ad Placements', 'Advanced Analytics', 'Sponsored Content', 'Video Pre-roll']
            },
            'enterprise': {
                name: 'Enterprise',
                price: '$15,000',
                features: ['Display Advertising', '5M+ Impressions', '10+ Ad Placements', 'Premium Analytics', 'Sponsored Content', 'Video Pre-roll', 'Newsletter Placement']
            }
        };

        const packageData = packages[packageType];
        if (!packageData) return;

        // Highlight selected package
        $('.package-card').removeClass('selected');
        $('.package-card').find('.select-package').removeClass('btn-primary').addClass('btn-outline-primary');

        const $selectedCard = $(`.select-package[data-package="${packageType}"]`).closest('.package-card');
        $selectedCard.addClass('selected');
        $selectedCard.find('.select-package').removeClass('btn-outline-primary').addClass('btn-primary');

        // Visual feedback
        $selectedCard.css('transform', 'scale(1.02)');
        setTimeout(() => {
            $selectedCard.css('transform', '');
        }, 300);

        // Announce selection
        announceToScreenReader(`Selected ${packageData.name} package for ${packageData.price} per month`);

        // Track selection
        trackPackageSelection(packageType);
    }

    /**
     * Pre-fill package selection in contact form
     */
    function prefillPackageSelection(packageType) {
        // Uncheck all package checkboxes
        $('#packageStarter, #packageProfessional, #packageEnterprise, #packageCustom').prop('checked', false);

        // Check the selected package
        switch (packageType) {
            case 'starter':
                $('#packageStarter').prop('checked', true);
                break;
            case 'professional':
                $('#packageProfessional').prop('checked', true);
                break;
            case 'enterprise':
                $('#packageEnterprise').prop('checked', true);
                break;
        }

        // Focus on budget field
        $('#budget').focus();
    }

    // ========== CONTACT FORM ==========

    /**
     * Initialize contact form functionality
     */
    function initContactForm() {
        const $form = $('#advertisingForm');

        $form.on('submit', function (e) {
            e.preventDefault();

            if (validateAdForm()) {
                submitAdForm($form);
            }
        });

        // Real-time validation
        $form.find('input, select, textarea').on('blur', function () {
            validateField($(this));
        });

        // Budget range visualization
        $('#budget').on('change', function () {
            updateBudgetVisualization($(this).val());
        });
    }

    /**
     * Validate advertising form
     */
    function validateAdForm() {
        let isValid = true;
        const $form = $('#advertisingForm');

        // Required fields
        const requiredFields = ['#firstName', '#lastName', '#email', '#company', '#industry', '#budget', '#message'];

        requiredFields.forEach(field => {
            const $field = $(field);
            if (!$field.val().trim()) {
                markFieldError($field, 'This field is required');
                isValid = false;
            } else {
                markFieldSuccess($field);
            }
        });

        // Email validation
        const email = $('#email').val().trim();
        if (email && !validateEmail(email)) {
            markFieldError($('#email'), 'Please enter a valid email address');
            isValid = false;
        }

        // At least one package selected
        const packageSelected = $('#packageStarter').is(':checked') ||
            $('#packageProfessional').is(':checked') ||
            $('#packageEnterprise').is(':checked') ||
            $('#packageCustom').is(':checked');

        if (!packageSelected) {
            showFormError($form, 'Please select at least one package option');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Validate individual field
     */
    function validateField($field) {
        const fieldId = $field.attr('id');
        const value = $field.val().trim();

        switch (fieldId) {
            case 'email':
                if (value && !validateEmail(value)) {
                    markFieldError($field, 'Invalid email format');
                    return false;
                }
                break;
            case 'phone':
                if (value && !validatePhone(value)) {
                    markFieldError($field, 'Invalid phone number');
                    return false;
                }
                break;
        }

        if ($field.prop('required') && !value) {
            markFieldError($field, 'This field is required');
            return false;
        }

        markFieldSuccess($field);
        return true;
    }

    /**
     * Submit advertising form
     */
    function submitAdForm($form) {
        // Show loading state
        $form.addClass('loading');
        const $submitBtn = $form.find('button[type="submit"]');
        const originalText = $submitBtn.html();
        $submitBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Processing...');
        $submitBtn.prop('disabled', true);

        // Collect form data
        const formData = {
            firstName: $('#firstName').val().trim(),
            lastName: $('#lastName').val().trim(),
            email: $('#email').val().trim(),
            phone: $('#phone').val().trim(),
            company: $('#company').val().trim(),
            industry: $('#industry').val(),
            packages: [],
            budget: $('#budget').val(),
            message: $('#message').val().trim(),
            newsletter: $('#newsletter').is(':checked'),
            timestamp: new Date().toISOString(),
            source: 'advertise_page'
        };

        // Add selected packages
        if ($('#packageStarter').is(':checked')) formData.packages.push('starter');
        if ($('#packageProfessional').is(':checked')) formData.packages.push('professional');
        if ($('#packageEnterprise').is(':checked')) formData.packages.push('enterprise');
        if ($('#packageCustom').is(':checked')) formData.packages.push('custom');

        // Simulate API call (in real implementation, use AJAX)
        setTimeout(() => {
            // Mock successful submission
            $form.removeClass('loading');
            $submitBtn.html(originalText);
            $submitBtn.prop('disabled', false);

            // Show success modal
            $('#successModal').modal('show');

            // Reset form
            $form[0].reset();

            // Track submission
            trackFormSubmission(formData);

            // Send confirmation email (simulated)
            sendConfirmationEmail(formData);

            // Announce success
            announceToScreenReader('Advertising inquiry submitted successfully');

        }, 2000);
    }

    // ========== BUDGET CALCULATOR ==========

    /**
     * Initialize budget calculator
     */
    function initBudgetCalculator() {
        const $budgetSlider = $('<input/>', {
            type: 'range',
            id: 'budgetSlider',
            class: 'form-range',
            min: '1000',
            max: '100000',
            step: '1000',
            value: '5000'
        });

        const $budgetDisplay = $('<div/>', {
            class: 'budget-display mt-3'
        });

        // Insert after budget select
        $('#budget').after($budgetSlider).after($budgetDisplay);

        // Update display on slider change
        $budgetSlider.on('input', function () {
            updateBudgetDisplay($(this).val());
            updateRecommendedPackage($(this).val());
        });

        // Update slider on select change
        $('#budget').on('change', function () {
            const value = getBudgetValue($(this).val());
            $budgetSlider.val(value);
            updateBudgetDisplay(value);
            updateRecommendedPackage(value);
        });

        // Initialize display
        updateBudgetDisplay($budgetSlider.val());
        updateRecommendedPackage($budgetSlider.val());
    }

    /**
     * Update budget display
     */
    function updateBudgetDisplay(value) {
        const formattedValue = formatCurrency(value);
        const $display = $('.budget-display');

        $display.html(`
            <div class="budget-visualization">
                <div class="budget-bar">
                    <div class="budget-fill" style="width: ${(value / 100000) * 100}%"></div>
                </div>
                <div class="d-flex justify-content-between mt-2">
                    <small>$1,000</small>
                    <strong>${formattedValue}</strong>
                    <small>$100,000+</small>
                </div>
            </div>
        `);
    }

    /**
     * Update recommended package based on budget
     */
    function updateRecommendedPackage(budget) {
        const numBudget = parseInt(budget);

        // Remove previous recommendations
        $('.package-card').removeClass('recommended');
        $('.package-card').find('.select-package').removeClass('btn-success').addClass(function () {
            return $(this).hasClass('btn-primary') ? 'btn-primary' : 'btn-outline-primary';
        });

        let recommendedPackage = '';

        if (numBudget < 5000) {
            recommendedPackage = 'starter';
        } else if (numBudget < 15000) {
            recommendedPackage = 'professional';
        } else {
            recommendedPackage = 'enterprise';
        }

        // Highlight recommended package
        const $recommendedCard = $(`.select-package[data-package="${recommendedPackage}"]`).closest('.package-card');
        $recommendedCard.addClass('recommended');
        $recommendedCard.find('.select-package').removeClass('btn-outline-primary btn-primary').addClass('btn-success');

        // Add tooltip
        $recommendedCard.find('.select-package').attr('title', 'Recommended for your budget');
    }

    /**
     * Get numeric value from budget range
     */
    function getBudgetValue(range) {
        const ranges = {
            'under-5k': 2500,
            '5k-10k': 7500,
            '10k-25k': 17500,
            '25k-50k': 37500,
            '50k-plus': 75000
        };

        return ranges[range] || 5000;
    }

    /**
     * Update budget visualization
     */
    function updateBudgetVisualization(range) {
        const value = getBudgetValue(range);
        $('.budget-display').remove();
        $('.budget-visualization').remove();

        const $visualization = $(`
            <div class="budget-visualization mt-2">
                <div class="budget-bar">
                    <div class="budget-fill" style="width: ${(value / 100000) * 100}%"></div>
                </div>
                <div class="d-flex justify-content-between mt-1">
                    <small class="text-muted">$1,000</small>
                    <small class="text-primary fw-bold">${formatCurrency(value)}</small>
                    <small class="text-muted">$100,000+</small>
                </div>
            </div>
        `);

        $('#budget').after($visualization);
    }

    // ========== FAQ ACCORDION ==========

    /**
     * Initialize FAQ accordion with enhanced features
     */
    function initFAQAccordion() {
        const $accordionItems = $('.accordion-item');

        $accordionItems.each(function (index) {
            const $item = $(this);
            const $button = $item.find('.accordion-button');

            // Add click tracking
            $button.on('click', function () {
                const isExpanding = !$(this).hasClass('collapsed');
                const question = $(this).text().trim();

                trackFAQInteraction(question, isExpanding ? 'expanded' : 'collapsed');

                // Add visual feedback
                if (isExpanding) {
                    $item.addClass('active');
                } else {
                    $item.removeClass('active');
                }
            });

            // Add keyboard navigation
            $button.on('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    $(this).trigger('click');
                }

                // Arrow key navigation
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const $next = $accordionItems.eq(index + 1);
                    if ($next.length) {
                        $next.find('.accordion-button').focus().trigger('click');
                    }
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const $prev = $accordionItems.eq(index - 1);
                    if ($prev.length) {
                        $prev.find('.accordion-button').focus().trigger('click');
                    }
                }
            });
        });

        // Auto-expand first item
        $accordionItems.first().find('.accordion-button').trigger('click');
    }

    // ========== TESTIMONIAL CAROUSEL ==========

    /**
     * Initialize testimonial carousel
     */
    function initTestimonialCarousel() {
        const $testimonialCards = $('.testimonial-card');

        if ($testimonialCards.length > 1) {
            let currentIndex = 0;

            // Create navigation dots
            const $dotsContainer = $('<div/>', {
                class: 'testimonial-dots d-flex justify-content-center gap-2 mt-4'
            });

            $testimonialCards.each(function (index) {
                const $dot = $('<button/>', {
                    class: 'testimonial-dot',
                    'aria-label': `View testimonial ${index + 1}`,
                    'data-index': index
                });

                if (index === 0) $dot.addClass('active');

                $dot.on('click', function () {
                    showTestimonial(index);
                });

                $dotsContainer.append($dot);
            });

            $('.success-stories .container').append($dotsContainer);

            // Auto-rotate testimonials
            let rotationInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % $testimonialCards.length;
                showTestimonial(currentIndex);
            }, 8000);

            // Pause on hover
            $('.testimonial-card, .testimonial-dot').hover(
                function () {
                    clearInterval(rotationInterval);
                },
                function () {
                    rotationInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % $testimonialCards.length;
                        showTestimonial(currentIndex);
                    }, 8000);
                }
            );
        }
    }

    /**
     * Show specific testimonial
     */
    function showTestimonial(index) {
        const $testimonialCards = $('.testimonial-card');
        const $dots = $('.testimonial-dot');

        // Hide all testimonials
        $testimonialCards.removeClass('active').addClass('d-none');

        // Show selected testimonial
        $testimonialCards.eq(index).removeClass('d-none').addClass('active');

        // Update dots
        $dots.removeClass('active');
        $dots.eq(index).addClass('active');

        // Announce to screen readers
        const companyName = $testimonialCards.eq(index).find('.company-info h5').text();
        announceToScreenReader(`Now viewing testimonial from ${companyName}`);
    }

    // ========== FORM VALIDATION ==========

    /**
     * Initialize form validation helpers
     */
    function initFormValidation() {
        // Character counter for message field
        $('#message').on('input', function () {
            const maxLength = 1000;
            const currentLength = $(this).val().length;
            const $counter = $(this).next('.char-counter');

            if (!$counter.length) {
                $(this).after(`<div class="char-counter text-end small mt-1"></div>`);
            }

            const $newCounter = $(this).next('.char-counter');
            $newCounter.text(`${currentLength}/${maxLength} characters`);

            if (currentLength > maxLength * 0.9) {
                $newCounter.addClass('text-warning');
            } else {
                $newCounter.removeClass('text-warning');
            }

            if (currentLength > maxLength) {
                $newCounter.addClass('text-danger');
                markFieldError($(this), `Maximum ${maxLength} characters allowed`);
            } else {
                $newCounter.removeClass('text-danger');
                markFieldSuccess($(this));
            }
        });

        // Industry-specific guidance
        $('#industry').on('change', function () {
            const industry = $(this).val();
            showIndustryGuidance(industry);
        });
    }

    /**
     * Show industry-specific guidance
     */
    function showIndustryGuidance(industry) {
        const guidance = {
            'technology': 'Technology advertisers typically see best results with sponsored content and video ads.',
            'finance': 'Financial services perform well with display ads in business sections and newsletter placements.',
            'healthcare': 'Healthcare campaigns work best with sponsored health articles and targeted display ads.',
            'retail': 'Retail advertisers benefit from seasonal campaigns and product-focused sponsored content.',
            'automotive': 'Automotive brands see success with video ads and special feature sponsorships.',
            'travel': 'Travel companies perform well with visually-rich display ads and destination guides.',
            'education': 'Educational institutions benefit from sponsored content and targeted newsletter ads.'
        };

        const $guidance = $('#industryGuidance');

        if (!$guidance.length) {
            $('#industry').after('<div id="industryGuidance" class="form-text mt-1 small"></div>');
        }

        if (guidance[industry]) {
            $('#industryGuidance').text(guidance[industry]).addClass('text-info');
        } else {
            $('#industryGuidance').text('').removeClass('text-info');
        }
    }

    // ========== LEAD TRACKING ==========

    /**
     * Initialize lead tracking
     */
    function initLeadTracking() {
        // Track form field interactions
        $('#advertisingForm input, #advertisingForm select, #advertisingForm textarea').on('focus', function () {
            const fieldName = $(this).attr('id') || $(this).attr('name');
            trackFieldInteraction(fieldName, 'focus');
        });

        // Track time spent on page
        let pageEnterTime = Date.now();

        $(window).on('beforeunload', function () {
            const timeSpent = Math.round((Date.now() - pageEnterTime) / 1000);
            trackTimeSpent(timeSpent);
        });

        // Track scroll depth
        let maxScrollDepth = 0;

        $(window).on('scroll', throttle(function () {
            const scrollPercent = Math.round(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            if (scrollPercent > maxScrollDepth) {
                maxScrollDepth = scrollPercent;
                trackScrollDepth(maxScrollDepth);
            }
        }, 1000));
    }

    // ========== SCROLL ANIMATIONS ==========

    /**
     * Initialize scroll animations for advertising page
     */
    function initScrollAnimations() {
        const $animatedElements = $('.feature-card, .package-card, .format-card, .testimonial-card');

        function checkScroll() {
            const windowHeight = $(window).height();
            const scrollTop = $(window).scrollTop();

            $animatedElements.each(function () {
                const $element = $(this);
                const elementTop = $element.offset().top;
                const elementVisible = 150;

                if (scrollTop + windowHeight - elementVisible > elementTop) {
                    $element.addClass('animated');
                }
            });
        }

        // Initial check
        checkScroll();

        // Check on scroll
        $(window).on('scroll', throttle(checkScroll, 100));
    }

    // ========== PERFORMANCE TRACKING ==========

    /**
     * Initialize performance tracking for advertising page
     */
    function initPerformanceTracking() {
        // Track page load time
        const loadTime = performance.now();

        // Log performance metrics
        console.log(`Advertising page loaded in ${loadTime}ms`);

        // Monitor resource loading
        const resources = performance.getEntriesByType("resource");
        let slowResources = [];

        resources.forEach(resource => {
            if (resource.duration > 1000) {
                slowResources.push({
                    name: resource.name,
                    duration: Math.round(resource.duration)
                });
            }
        });

        if (slowResources.length > 0) {
            console.warn('Slow resources detected:', slowResources);
        }

        // Track memory usage
        if (performance.memory) {
            setInterval(() => {
                const usedMB = Math.round(performance.memory.usedJSHeapSize / 1048576);
                const totalMB = Math.round(performance.memory.totalJSHeapSize / 1048576);

                if (usedMB > totalMB * 0.8) {
                    console.warn(`High memory usage: ${usedMB}MB of ${totalMB}MB`);
                }
            }, 30000);
        }
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Mark field as having error
     */
    function markFieldError($field, message) {
        $field.addClass('is-invalid');
        $field.removeClass('is-valid');

        // Remove existing feedback
        $field.next('.invalid-feedback').remove();

        // Add error message
        $field.after(`<div class="invalid-feedback">${message}</div>`);
    }

    /**
     * Mark field as successful
     */
    function markFieldSuccess($field) {
        $field.removeClass('is-invalid');
        $field.addClass('is-valid');
        $field.next('.invalid-feedback').remove();
    }

    /**
     * Show form error message
     */
    function showFormError($form, message) {
        // Remove existing alerts
        $form.find('.alert').remove();

        // Add error alert
        const $alert = $(`
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `);

        $form.prepend($alert);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            $alert.alert('close');
        }, 5000);
    }

    /**
     * Validate email address
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate phone number (basic validation)
     */
    function validatePhone(phone) {
        const re = /^[\d\s\-\+\(\)]{10,}$/;
        return re.test(phone);
    }

    /**
     * Format currency
     */
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Throttle function for performance
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

    // ========== ANALYTICS FUNCTIONS ==========

    /**
     * Track package selection
     */
    function trackPackageSelection(packageType) {
        console.log('Package selected:', packageType);
        // In real implementation:
        // gtag('event', 'package_selection', {
        //     'event_category': 'advertising',
        //     'event_label': packageType
        // });
    }

    /**
     * Track form submission
     */
    function trackFormSubmission(formData) {
        console.log('Form submitted:', {
            company: formData.company,
            industry: formData.industry,
            budget: formData.budget,
            packages: formData.packages.length
        });

        // In real implementation:
        // gtag('event', 'form_submission', {
        //     'event_category': 'advertising',
        //     'event_label': 'inquiry',
        //     'value': formData.budget ? getBudgetValue(formData.budget) : 0
        // });
    }

    /**
     * Track FAQ interaction
     */
    function trackFAQInteraction(question, action) {
        console.log('FAQ interaction:', { question, action });
        // In real implementation:
        // gtag('event', 'faq_interaction', {
        //     'event_category': 'advertising',
        //     'event_label': question,
        //     'event_action': action
        // });
    }

    /**
     * Track field interaction
     */
    function trackFieldInteraction(fieldName, action) {
        // In real implementation:
        // gtag('event', 'field_interaction', {
        //     'event_category': 'advertising_form',
        //     'event_label': fieldName,
        //     'event_action': action
        // });
    }

    /**
     * Track time spent on page
     */
    function trackTimeSpent(seconds) {
        console.log('Time spent on page:', seconds + ' seconds');
        // In real implementation:
        // gtag('event', 'time_spent', {
        //     'event_category': 'engagement',
        //     'event_label': 'advertising_page',
        //     'value': seconds
        // });
    }

    /**
     * Track scroll depth
     */
    function trackScrollDepth(percent) {
        // Track at 25%, 50%, 75%, 100%
        if ([25, 50, 75, 100].includes(percent)) {
            console.log('Scroll depth reached:', percent + '%');
            // In real implementation:
            // gtag('event', 'scroll_depth', {
            //     'event_category': 'engagement',
            //     'event_label': 'advertising_page',
            //     'value': percent
            // });
        }
    }

    /**
     * Send confirmation email (simulated)
     */
    function sendConfirmationEmail(formData) {
        console.log('Confirmation email sent to:', formData.email);
        // In real implementation, this would be an AJAX call to your backend
    }

    // ========== PAGE UNLOAD HANDLING ==========

    /**
     * Clean up resources before page unload
     */
    function cleanupBeforeUnload() {
        // Stop all intervals
        const highestTimeoutId = setTimeout(() => { }, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
            clearTimeout(i);
        }

        // Remove event listeners
        $(window).off('scroll resize beforeunload');
        $('form').off();
        $('.package-card, .select-package, .accordion-button').off();

        // Clean up modals
        $('.modal').modal('hide');
        $('.modal-backdrop').remove();
    }

    // Listen for page unload
    $(window).on('beforeunload', cleanupBeforeUnload);

    // ========== PUBLIC API ==========

    // Expose advertising page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.advertise = {
        selectPackage: selectPackage,
        validateAdForm: validateAdForm,
        submitAdForm: submitAdForm,
        updateBudgetDisplay: updateBudgetDisplay,
        showTestimonial: showTestimonial
    };

    // Log initialization
    console.log('Advertising page JavaScript initialized');
});