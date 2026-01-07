/* ==============================================
   GLOBAL NEWS NETWORK - CONTACT PAGE JAVASCRIPT
   Contact page specific functionality
   ============================================== */

$(document).ready(function() {

    // ========== CONTACT PAGE INITIALIZATION ==========
    initContactPage();

    /**
     * Initialize all contact page components
     */
    function initContactPage() {
        // Contact Form
        initContactForm();

        // Interactive Map
        initInteractiveMap();

        // FAQ Accordion
        initFAQAccordion();

        // Contact Information Cards
        initContactCards();

        // File Upload
        initFileUpload();

        // Form Validation
        initFormValidation();

        // Phone Number Formatting
        initPhoneFormatting();

        // Department Select Effects
        initDepartmentSelect();

        // Form Character Counter
        initCharacterCounter();

        // Contact Page Analytics
        initContactAnalytics();
    }

    // ========== CONTACT FORM ==========

    /**
     * Initialize contact form functionality
     */
    function initContactForm() {
        const $contactForm = $('#contactForm');
        const $submitBtn = $contactForm.find('button[type="submit"]');
        const $submitText = $submitBtn.find('.submit-text');
        const $loadingSpinner = $submitBtn.find('.loading-spinner');

        // Form submission handler
        $contactForm.on('submit', function(e) {
            e.preventDefault();

            if (validateContactForm()) {
                submitContactForm($(this));
            }
        });

        // Real-time validation
        $contactForm.find('input, select, textarea').on('blur', function() {
            validateField($(this));
        });

        // Input validation on change
        $contactForm.find('input, select, textarea').on('input change', function() {
            clearFieldError($(this));
        });

        // Terms checkbox validation
        $('#terms').on('change', function() {
            validateField($(this));
        });

        // Department change effect
        $('#department').on('change', function() {
            updateFormBasedOnDepartment($(this).val());
        });
    }

    /**
     * Validate the entire contact form
     */
    function validateContactForm() {
        let isValid = true;
        const $form = $('#contactForm');

        // Validate required fields
        $form.find('[required]').each(function() {
            if (!validateField($(this))) {
                isValid = false;
            }
        });

        // Validate email format
        const $email = $('#email');
        if ($email.val() && !isValidEmail($email.val())) {
            showFieldError($email, 'Please enter a valid email address.');
            isValid = false;
        }

        // Validate message length
        const $message = $('#message');
        if ($message.val().length > 2000) {
            showFieldError($message, 'Message must be less than 2000 characters.');
            isValid = false;
        }

        // Validate file size
        const $file = $('#attachment')[0];
        if ($file && $file.files[0]) {
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if ($file.files[0].size > maxSize) {
                showFieldError($('#attachment'), 'File size must be less than 5MB.');
                isValid = false;
            }
        }

        return isValid;
    }

    /**
     * Validate individual form field
     */
    function validateField($field) {
        const value = $field.val();
        const isRequired = $field.prop('required');
        const type = $field.attr('type');
        const name = $field.attr('name');

        // Clear previous errors
        clearFieldError($field);

        // Check required fields
        if (isRequired && !value.trim()) {
            showFieldError($field, 'This field is required.');
            return false;
        }

        // Email validation
        if (name === 'email' && value && !isValidEmail(value)) {
            showFieldError($field, 'Please enter a valid email address.');
            return false;
        }

        // Phone validation (optional)
        if (name === 'phone' && value && !isValidPhone(value)) {
            showFieldError($field, 'Please enter a valid phone number.');
            return false;
        }

        // Message length validation
        if (name === 'message' && value.length > 2000) {
            showFieldError($field, 'Message must be less than 2000 characters.');
            return false;
        }

        // Terms agreement validation
        if (name === 'terms' && !$field.prop('checked')) {
            showFieldError($field, 'You must agree to the terms before submitting.');
            return false;
        }

        return true;
    }

    /**
     * Show error message for a field
     */
    function showFieldError($field, message) {
        const $formGroup = $field.closest('.form-group');
        $field.addClass('is-invalid');
        
        // Add or update error message
        let $feedback = $formGroup.find('.invalid-feedback');
        if (!$feedback.length) {
            $feedback = $('<div class="invalid-feedback"></div>');
            $field.after($feedback);
        }
        $feedback.text(message).show();
    }

    /**
     * Clear error message from a field
     */
    function clearFieldError($field) {
        $field.removeClass('is-invalid').removeClass('is-valid');
        $field.closest('.form-group').find('.invalid-feedback').hide();
    }

    /**
     * Submit contact form via AJAX
     */
    function submitContactForm($form) {
        const $submitBtn = $form.find('button[type="submit"]');
        const $submitText = $submitBtn.find('.submit-text');
        const $loadingSpinner = $submitBtn.find('.loading-spinner');

        // Show loading state
        $submitBtn.prop('disabled', true);
        $submitText.hide();
        $loadingSpinner.show();

        // Get form data
        const formData = new FormData($form[0]);

        // Simulate API call (in production, this would be a real AJAX call)
        setTimeout(() => {
            // Mock success response
            const success = Math.random() > 0.1; // 90% success rate for demo

            if (success) {
                showFormSuccess($form);
                trackFormSubmission('success');
            } else {
                showFormError($form, 'Sorry, there was an error submitting your message. Please try again.');
                trackFormSubmission('error');
            }

            // Reset button state
            $submitBtn.prop('disabled', false);
            $submitText.show();
            $loadingSpinner.hide();
        }, 2000);
    }

    /**
     * Show form success message
     */
    function showFormSuccess($form) {
        // Create success message HTML
        const successHtml = `
            <div class="form-success">
                <i class="fas fa-check-circle"></i>
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for contacting Global News Network. We've received your message and will respond within 1-2 business days.</p>
                <p class="text-muted">A confirmation email has been sent to your inbox.</p>
                <button class="btn btn-primary mt-3" id="sendAnotherMessage">
                    <i class="fas fa-envelope me-2"></i> Send Another Message
                </button>
            </div>
        `;

        // Hide form, show success message
        $form.hide();
        $form.before(successHtml);

        // Reset button handler
        $('#sendAnotherMessage').on('click', function() {
            $('.form-success').remove();
            $form.show().trigger('reset');
            $form.find('.is-invalid').removeClass('is-invalid');
            $form.find('.invalid-feedback').hide();
        });

        // Announce to screen readers
        announceToScreenReader('Contact form submitted successfully');
    }

    /**
     * Show form error message
     */
    function showFormError($form, message) {
        // Create error message HTML
        const errorHtml = `
            <div class="form-error">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${message}
            </div>
        `;

        // Remove existing error messages
        $form.find('.form-error').remove();

        // Add error message
        $form.prepend(errorHtml);

        // Announce to screen readers
        announceToScreenReader('Error submitting contact form: ' + message);
    }

    // ========== INTERACTIVE MAP ==========

    /**
     * Initialize interactive map functionality
     */
    function initInteractiveMap() {
        const $loadMapBtn = $('#loadMapBtn');
        const $mapPlaceholder = $('#mapPlaceholder');

        $loadMapBtn.on('click', function(e) {
            e.preventDefault();
            loadInteractiveMap();
        });

        // Map link in contact info
        $('.map-link').on('click', function(e) {
            e.preventDefault();
            const lat = $(this).data('lat');
            const lng = $(this).data('lng');
            loadInteractiveMap(lat, lng);
        });
    }

    /**
     * Load Google Maps interactively
     */
    function loadInteractiveMap(lat = 40.7128, lng = -74.0060) {
        const $loadMapBtn = $('#loadMapBtn');
        const $mapPlaceholder = $('#mapPlaceholder');

        // Show loading state
        $loadMapBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading Map...');
        $loadMapBtn.prop('disabled', true);

        // Check if Google Maps API is available
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            // Load Google Maps API dynamically
            loadGoogleMapsAPI()
                .then(() => {
                    initializeMap(lat, lng);
                })
                .catch(() => {
                    showMapError();
                });
        } else {
            initializeMap(lat, lng);
        }
    }

    /**
     * Load Google Maps API dynamically
     */
    function loadGoogleMapsAPI() {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            // Create script element
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=DEMO_KEY&callback=initGNNMap`;
            script.async = true;
            script.defer = true;

            // Set up callback
            window.initGNNMap = function() {
                resolve();
            };

            script.onerror = function() {
                reject(new Error('Failed to load Google Maps'));
            };

            // Add script to document
            document.head.appendChild(script);
        });
    }

    /**
     * Initialize Google Map
     */
    function initializeMap(lat, lng) {
        const $mapPlaceholder = $('#mapPlaceholder');
        
        // Create map container
        $mapPlaceholder.html('<div id="map" style="width:100%;height:100%;"></div>');

        // Initialize map
        const mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: 'all',
                    elementType: 'labels.text.fill',
                    stylers: [{ color: '#000000' }]
                },
                {
                    featureType: 'poi',
                    elementType: 'all',
                    stylers: [{ visibility: 'off' }]
                }
            ]
        };

        const map = new google.maps.Map(document.getElementById('map'), mapOptions);

        // Add marker
        const marker = new google.maps.Marker({
            position: { lat: lat, lng: lng },
            map: map,
            title: 'Global News Network Headquarters',
            animation: google.maps.Animation.DROP
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px;">
                    <h3 style="margin: 0 0 10px 0;">Global News Network</h3>
                    <p style="margin: 0;">123 News Street, Media City, MC 10101</p>
                    <p style="margin: 10px 0 0 0;">
                        <a href="tel:+15551234567" style="color: #1a73e8;">+1 (555) 123-4567</a>
                    </p>
                </div>
            `
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });

        // Open info window by default
        infoWindow.open(map, marker);

        // Track map load
        trackMapInteraction('loaded');
    }

    /**
     * Show map loading error
     */
    function showMapError() {
        const $loadMapBtn = $('#loadMapBtn');
        $loadMapBtn.html('<i class="fas fa-exclamation-triangle me-2"></i> Map Unavailable');
        
        // Show error message
        const errorHtml = `
            <div class="form-error mt-3">
                <i class="fas fa-exclamation-circle me-2"></i>
                Unable to load map. Please check your internet connection.
            </div>
        `;
        
        $loadMapBtn.after(errorHtml);
        
        // Track error
        trackMapInteraction('error');
    }

    // ========== FAQ ACCORDION ==========

    /**
     * Initialize FAQ accordion functionality
     */
    function initFAQAccordion() {
        const $accordion = $('#faqAccordion');
        
        // Open first item by default
        $accordion.find('.accordion-collapse').first().addClass('show');
        
        // Add click tracking
        $accordion.find('.accordion-button').on('click', function() {
            const question = $(this).text().trim();
            trackFAQInteraction(question);
        });

        // Add keyboard navigation
        $accordion.find('.accordion-button').on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).trigger('click');
            }
        });
    }

    // ========== CONTACT CARDS ==========

    /**
     * Initialize contact information cards
     */
    function initContactCards() {
        // Email click tracking
        $('.contact-channels span').on('click', function(e) {
            if ($(this).text().includes('@')) {
                e.preventDefault();
                const email = $(this).text().trim();
                trackEmailClick(email);
                
                // Copy email to clipboard
                copyToClipboard(email);
                
                // Show notification
                showNotification('Email address copied to clipboard: ' + email);
            }
        });

        // Phone click tracking
        $('.contact-channels span, .office-card p').on('click', function(e) {
            const text = $(this).text();
            if (text.includes('+') || text.includes('(')) {
                const phoneMatch = text.match(/[\d\s+()\-]+/);
                if (phoneMatch) {
                    trackPhoneClick(phoneMatch[0]);
                }
            }
        });

        // Emergency contact button
        $('.emergency-contact .btn').on('click', function(e) {
            e.preventDefault();
            trackEmergencyContactClick();
            
            // Show confirmation
            if (confirm('Call our 24/7 News Desk? This is for urgent breaking news only.')) {
                window.location.href = 'tel:+15551234567';
            }
        });
    }

    // ========== FILE UPLOAD ==========

    /**
     * Initialize file upload functionality
     */
    function initFileUpload() {
        const $fileInput = $('#attachment');
        
        $fileInput.on('change', function() {
            const file = this.files[0];
            if (file) {
                validateFile(file);
                updateFilePreview(file);
            }
        });

        // Drag and drop support
        const $formGroup = $fileInput.closest('.form-group');
        
        $formGroup.on('dragover', function(e) {
            e.preventDefault();
            $(this).addClass('dragover');
        });
        
        $formGroup.on('dragleave', function() {
            $(this).removeClass('dragover');
        });
        
        $formGroup.on('drop', function(e) {
            e.preventDefault();
            $(this).removeClass('dragover');
            
            const files = e.originalEvent.dataTransfer.files;
            if (files.length > 0) {
                $fileInput[0].files = files;
                $fileInput.trigger('change');
            }
        });
    }

    /**
     * Validate uploaded file
     */
    function validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'application/msword', 
                             'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                             'image/jpeg', 'image/jpg', 'image/png'];
        
        if (file.size > maxSize) {
            showFieldError($('#attachment'), 'File size must be less than 5MB.');
            return false;
        }
        
        if (!allowedTypes.includes(file.type)) {
            showFieldError($('#attachment'), 'File type not allowed. Please upload PDF, DOC, JPG, or PNG files.');
            return false;
        }
        
        return true;
    }

    /**
     * Update file preview
     */
    function updateFilePreview(file) {
        const $formGroup = $('#attachment').closest('.form-group');
        
        // Remove existing preview
        $formGroup.find('.file-preview').remove();
        
        // Create preview
        const previewHtml = `
            <div class="file-preview mt-2 p-2 border rounded">
                <div class="d-flex align-items-center">
                    <i class="fas fa-file me-2 text-primary"></i>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${formatFileSize(file.size)}</span>
                        </div>
                        <div class="progress mt-1" style="height: 4px;">
                            <div class="progress-bar" role="progressbar" style="width: 100%"></div>
                        </div>
                    </div>
                    <button class="btn btn-sm btn-link text-danger ms-2 remove-file" type="button">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        $formGroup.append(previewHtml);
        
        // Add remove file handler
        $formGroup.find('.remove-file').on('click', function() {
            $('#attachment').val('');
            $formGroup.find('.file-preview').remove();
            clearFieldError($('#attachment'));
        });
    }

    /**
     * Format file size
     */
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ========== FORM VALIDATION UTILITIES ==========

    /**
     * Initialize form validation
     */
    function initFormValidation() {
        // Add input masking for phone
        $('#phone').on('input', function() {
            formatPhoneNumber($(this));
        });
    }

    /**
     * Initialize phone number formatting
     */
    function initPhoneFormatting() {
        $('#phone').on('blur', function() {
            const $phone = $(this);
            const value = $phone.val().replace(/\D/g, '');
            
            if (value.length === 10) {
                const formatted = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
                $phone.val(formatted);
            }
        });
    }

    /**
     * Format phone number as user types
     */
    function formatPhoneNumber($input) {
        let value = $input.val().replace(/\D/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value.replace(/(\d{1,3})/, '($1');
            } else if (value.length <= 6) {
                value = value.replace(/(\d{3})(\d{1,3})/, '($1) $2');
            } else {
                value = value.replace(/(\d{3})(\d{3})(\d{1,4})/, '($1) $2-$3');
            }
        }
        
        $input.val(value);
    }

    /**
     * Initialize department select effects
     */
    function initDepartmentSelect() {
        $('#department').on('change', function() {
            updateFormBasedOnDepartment($(this).val());
        });
    }

    /**
     * Update form based on selected department
     */
    function updateFormBasedOnDepartment(department) {
        const $subject = $('#subject');
        const $message = $('#message');
        
        // Set default subject based on department
        const subjectDefaults = {
            'general': 'General Inquiry',
            'editorial': 'News Tip/Editorial Inquiry',
            'advertising': 'Advertising Inquiry',
            'press': 'Press/Media Inquiry',
            'technical': 'Technical Support Request',
            'careers': 'Career/Employment Inquiry',
            'feedback': 'Feedback/Suggestion'
        };
        
        if (subjectDefaults[department] && !$subject.val()) {
            $subject.val(subjectDefaults[department]);
        }
        
        // Set placeholder text for message
        const messagePlaceholders = {
            'editorial': 'Please provide details about your news tip, including sources, evidence, and timeline...',
            'advertising': 'Please describe your advertising needs, target audience, and budget...',
            'technical': 'Please describe the technical issue you\'re experiencing in detail...'
        };
        
        if (messagePlaceholders[department] && !$message.val()) {
            $message.attr('placeholder', messagePlaceholders[department]);
        }
    }

    /**
     * Initialize character counter for message field
     */
    function initCharacterCounter() {
        const $message = $('#message');
        const $charCount = $('<div class="char-count text-end small text-muted mt-1"></div>');
        
        $message.after($charCount);
        updateCharacterCount();
        
        $message.on('input', updateCharacterCount);
        
        function updateCharacterCount() {
            const length = $message.val().length;
            const maxLength = 2000;
            $charCount.text(`${length}/${maxLength} characters`);
            
            if (length > maxLength * 0.9) {
                $charCount.addClass('text-warning');
                $charCount.removeClass('text-danger');
            } else if (length > maxLength) {
                $charCount.addClass('text-danger');
                $charCount.removeClass('text-warning');
            } else {
                $charCount.removeClass('text-warning text-danger');
            }
        }
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Validate email address
     */
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    /**
     * Validate phone number
     */
    function isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 10;
    }

    /**
     * Copy text to clipboard
     */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        
        try {
            document.execCommand('copy');
            return true;
        } catch (err) {
            console.error('Failed to copy text:', err);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    /**
     * Show notification message
     */
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        $('.contact-notification').remove();
        
        // Create notification
        const notificationClass = type === 'success' ? 'alert-success' : 'alert-danger';
        const notificationHtml = `
            <div class="contact-notification alert ${notificationClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        
        // Add notification to page
        $('.contact-content').prepend(notificationHtml);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            $('.contact-notification').alert('close');
        }, 5000);
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

    // ========== ANALYTICS & TRACKING ==========

    /**
     * Initialize contact page analytics
     */
    function initContactAnalytics() {
        // Track page view
        trackPageView();
        
        // Track form interactions
        trackFormInteractions();
        
        // Track map interactions
        trackMapInteractions();
    }

    /**
     * Track page view
     */
    function trackPageView() {
        console.log('Contact page viewed');
        // In production:
        // gtag('event', 'page_view', {
        //     'page_title': 'Contact Us',
        //     'page_location': window.location.href
        // });
    }

    /**
     * Track form submission
     */
    function trackFormSubmission(status) {
        const department = $('#department').val();
        console.log(`Form submitted - Status: ${status}, Department: ${department}`);
        // In production:
        // gtag('event', 'form_submission', {
        //     'event_category': 'contact',
        //     'event_label': department,
        //     'value': status === 'success' ? 1 : 0
        // });
    }

    /**
     * Track form interactions
     */
    function trackFormInteractions() {
        // Track field focus
        $('#contactForm input, #contactForm textarea, #contactForm select').on('focus', function() {
            const fieldName = $(this).attr('name') || $(this).attr('id');
            console.log(`Form field focused: ${fieldName}`);
        });
    }

    /**
     * Track map interaction
     */
    function trackMapInteraction(action) {
        console.log(`Map interaction: ${action}`);
        // In production:
        // gtag('event', 'map_interaction', {
        //     'event_category': 'contact',
        //     'event_label': action
        // });
    }

    /**
     * Track FAQ interaction
     */
    function trackFAQInteraction(question) {
        console.log(`FAQ viewed: ${question}`);
        // In production:
        // gtag('event', 'faq_view', {
        //     'event_category': 'contact',
        //     'event_label': question
        // });
    }

    /**
     * Track email click
     */
    function trackEmailClick(email) {
        console.log(`Email clicked: ${email}`);
        // In production:
        // gtag('event', 'email_copy', {
        //     'event_category': 'contact',
        //     'event_label': email
        // });
    }

    /**
     * Track phone click
     */
    function trackPhoneClick(phone) {
        console.log(`Phone number clicked: ${phone}`);
        // In production:
        // gtag('event', 'phone_click', {
        //     'event_category': 'contact',
        //     'event_label': phone
        // });
    }

    /**
     * Track emergency contact click
     */
    function trackEmergencyContactClick() {
        console.log('Emergency contact clicked');
        // In production:
        // gtag('event', 'emergency_contact', {
        //     'event_category': 'contact'
        // });
    }

    // ========== ERROR HANDLING ==========

    /**
     * Handle JavaScript errors on contact page
     */
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('Contact page error:', e.error);
            // Send to error tracking service
            // Sentry.captureException(e.error);
        });

        // Handle form submission errors
        $(document).ajaxError(function(event, jqxhr, settings, thrownError) {
            console.error('AJAX error:', thrownError);
            showFormError($('#contactForm'), 'Network error. Please check your connection and try again.');
        });
    }

    // Initialize error handling
    initErrorHandling();

    // ========== PUBLIC API ==========

    // Expose contact page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.contact = {
        validateContactForm: validateContactForm,
        submitContactForm: submitContactForm,
        loadInteractiveMap: loadInteractiveMap,
        copyToClipboard: copyToClipboard,
        showNotification: showNotification
    };

    // Log initialization
    console.log('Contact page JavaScript initialized');
});