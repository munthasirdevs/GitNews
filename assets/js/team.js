/* ==============================================
   GLOBAL NEWS NETWORK - TEAM PAGE JAVASCRIPT
   Team page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== TEAM PAGE INITIALIZATION ==========
    initTeamPage();

    /**
     * Initialize all team page components
     */
    function initTeamPage() {
        // Department Filtering
        initDepartmentFilter();

        // Team Member Cards Interactions
        initTeamMemberCards();

        // Load More Team Members
        initLoadMoreTeam();

        // Team Member Modal
        initTeamMemberModal();

        // Team Stats Animation
        initTeamStats();

        // Department Count Update
        initDepartmentCount();

        // Team Search (if implemented)
        initTeamSearch();

        // Print Team Functionality
        initPrintTeam();
    }

    // ========== DEPARTMENT FILTERING ==========

    /**
     * Initialize department filtering
     */
    function initDepartmentFilter() {
        const $filterButtons = $('.filter-btn');
        const $teamMembers = $('.team-member');
        let activeDepartment = 'all';

        $filterButtons.on('click', function (e) {
            e.preventDefault();

            const $button = $(this);
            const department = $button.data('department');

            // Update active button
            $filterButtons.removeClass('active');
            $button.addClass('active');

            // Update active department
            activeDepartment = department;

            // Filter team members
            filterTeamMembers(department);

            // Announce filter change
            announceToScreenReader(`Showing ${department === 'all' ? 'all departments' : department + ' department'}`);

            // Update URL hash without page reload
            if (history.pushState) {
                history.pushState(null, null, `#${department}`);
            } else {
                window.location.hash = department;
            }
        });

        // Check for hash on page load
        const hash = window.location.hash.substring(1);
        if (hash && $filterButtons.filter(`[data-department="${hash}"]`).length) {
            $filterButtons.filter(`[data-department="${hash}"]`).trigger('click');
        }
    }

    /**
     * Filter team members by department
     */
    function filterTeamMembers(department) {
        const $teamMembers = $('.team-member');
        const $teamGrid = $('.team-grid');

        // Add loading animation
        $teamGrid.addClass('filtering');

        // Reset all to hidden first
        $teamMembers.hide();

        // Show relevant members
        if (department === 'all') {
            $teamMembers.each(function (index) {
                const $member = $(this);
                setTimeout(() => {
                    $member.show().addClass('fade-in');
                }, index * 50);
            });
        } else {
            $teamMembers.each(function (index) {
                const $member = $(this);
                if ($member.data('department') === department) {
                    setTimeout(() => {
                        $member.show().addClass('fade-in');
                    }, index * 50);
                }
            });
        }

        // Remove loading class
        setTimeout(() => {
            $teamGrid.removeClass('filtering');
            updateMemberCount(department);
        }, 300);
    }

    /**
     * Update member count display
     */
    function updateMemberCount(department) {
        const $teamMembers = $('.team-member');
        let count = 0;

        if (department === 'all') {
            count = $teamMembers.length;
        } else {
            count = $teamMembers.filter(`[data-department="${department}"]`).length;
        }

        // Update count display (could add a counter element)
        console.log(`Showing ${count} team members in ${department === 'all' ? 'all departments' : department}`);
    }

    // ========== TEAM MEMBER CARDS ==========

    /**
     * Initialize team member card interactions
     */
    function initTeamMemberCards() {
        const $teamCards = $('.team-card');

        $teamCards.each(function () {
            const $card = $(this);
            const $image = $card.find('.team-image img');

            // Hover effects
            $card.on('mouseenter touchstart', function () {
                $card.addClass('hover-active');

                // Social icons animation
                const $socialIcons = $card.find('.social-icon');
                $socialIcons.each(function (index) {
                    $(this).css('animation-delay', `${index * 0.1}s`);
                });
            });

            $card.on('mouseleave touchend', function () {
                $card.removeClass('hover-active');
            });

            // Click handling
            $card.on('click', function (e) {
                // Don't trigger if clicking social icons
                if (!$(e.target).closest('.team-social').length) {
                    const memberName = $(this).find('.team-name').text();
                    const memberPosition = $(this).find('.team-position').text();
                    openTeamMemberModal(memberName, memberPosition);
                }
            });

            // Keyboard navigation
            $card.on('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const memberName = $(this).find('.team-name').text();
                    const memberPosition = $(this).find('.team-position').text();
                    openTeamMemberModal(memberName, memberPosition);
                }
            });
        });

        // Add tabindex for accessibility
        $teamCards.attr('tabindex', '0').attr('role', 'button');
    }

    // ========== LOAD MORE TEAM MEMBERS ==========

    /**
     * Initialize load more functionality
     */
    function initLoadMoreTeam() {
        const $loadMoreBtn = $('#loadMoreTeam');
        let isLoading = false;
        let currentPage = 1;

        if (!$loadMoreBtn.length) return;

        $loadMoreBtn.on('click', function (e) {
            e.preventDefault();

            if (isLoading) return;

            isLoading = true;
            currentPage++;
            loadMoreTeamMembers(currentPage);
        });

        // Infinite scroll for mobile
        if ($(window).width() < 768) {
            $(window).on('scroll', function () {
                if (isLoading || !$loadMoreBtn.is(':visible')) return;

                const scrollTop = $(window).scrollTop();
                const windowHeight = $(window).height();
                const btnOffset = $loadMoreBtn.offset().top;

                if (scrollTop + windowHeight >= btnOffset - 200) {
                    isLoading = true;
                    currentPage++;
                    loadMoreTeamMembers(currentPage);
                }
            });
        }
    }

    /**
     * Load more team members
     */
    function loadMoreTeamMembers(page) {
        const $loadMoreBtn = $('#loadMoreTeam');
        const $teamGrid = $('.team-grid');

        // Show loading state
        $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');
        $loadMoreBtn.prop('disabled', true);

        // Simulate API call
        setTimeout(() => {
            // Mock data for additional team members
            const mockTeamMembers = [
                {
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    name: 'Chris Morgan',
                    position: 'Sports Reporter',
                    department: 'reporters',
                    bio: 'Covering major sporting events and athlete profiles with 8 years of experience.',
                    expertise: ['Sports', 'Athlete Profiles', 'Event Coverage']
                },
                {
                    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    name: 'Lisa Wang',
                    position: 'Video Producer',
                    department: 'producers',
                    bio: 'Creating compelling visual narratives and managing video production workflows.',
                    expertise: ['Video Production', 'Storytelling', 'Post-production']
                },
                {
                    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                    name: 'Ahmed Hassan',
                    position: 'Data Journalist',
                    department: 'research',
                    bio: 'Specializing in data-driven stories and investigative reporting through data analysis.',
                    expertise: ['Data Analysis', 'Visualization', 'Investigative']
                }
            ];

            // Add new team members
            mockTeamMembers.forEach((member, index) => {
                const memberHtml = `
                    <div class="col-md-6 col-lg-4 team-member" data-department="${member.department}">
                        <div class="team-card" style="animation-delay: ${(index * 0.1) + 0.1}s">
                            <div class="team-image">
                                <img src="${member.image}" alt="${member.name}" class="w-100" loading="lazy">
                                <div class="team-overlay">
                                    <div class="team-social">
                                        <a href="#" class="social-icon" aria-label="Twitter">
                                            <i class="fab fa-twitter"></i>
                                        </a>
                                        <a href="#" class="social-icon" aria-label="LinkedIn">
                                            <i class="fab fa-linkedin-in"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="team-content">
                                <h3 class="team-name">${member.name}</h3>
                                <p class="team-position">${member.position}</p>
                                <p class="team-bio">${member.bio}</p>
                                <div class="team-expertise">
                                    ${member.expertise.map(exp => `<span class="expertise-tag">${exp}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $teamGrid.append(memberHtml);
            });

            // Re-initialize interactions for new cards
            initTeamMemberCards();

            // Reset button state
            $loadMoreBtn.html('<i class="fas fa-plus-circle me-2"></i> Load More Team Members');
            $loadMoreBtn.prop('disabled', false);
            isLoading = false;

            // Announce to screen readers
            announceToScreenReader(`Loaded ${mockTeamMembers.length} more team members`);

            // Hide button if we've loaded enough (for demo)
            if (page >= 3) {
                $loadMoreBtn.html('<i class="fas fa-check-circle me-2"></i> All Team Members Loaded');
                $loadMoreBtn.prop('disabled', true);
                $loadMoreBtn.removeClass('btn-outline-primary').addClass('btn-outline-secondary');
            }
        }, 1500);
    }

    // ========== TEAM MEMBER MODAL ==========

    /**
     * Initialize team member modal
     */
    function initTeamMemberModal() {
        // Modal will be created dynamically when needed
    }

    /**
     * Open team member modal
     */
    function openTeamMemberModal(name, position) {
        // Get member data (in real app, this would be from API or data attributes)
        const memberData = getTeamMemberData(name);

        // Create modal HTML
        const modalHtml = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content team-member-modal">
                    <div class="modal-header">
                        <h5 class="modal-title">Team Member Profile</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="modal-team-content">
                            <div class="modal-team-header">
                                <div class="modal-team-image">
                                    <img src="${memberData.image}" alt="${name}">
                                </div>
                                <div class="modal-team-info">
                                    <h3>${name}</h3>
                                    <p class="position">${position}</p>
                                    <p class="department">${memberData.department}</p>
                                    <div class="modal-team-social">
                                        <a href="#" class="social-icon" aria-label="Twitter">
                                            <i class="fab fa-twitter"></i>
                                        </a>
                                        <a href="#" class="social-icon" aria-label="LinkedIn">
                                            <i class="fab fa-linkedin-in"></i>
                                        </a>
                                        <a href="#" class="social-icon" aria-label="Email">
                                            <i class="fas fa-envelope"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="modal-team-details">
                                <h4>About</h4>
                                <p class="modal-team-bio">${memberData.bio}</p>
                                
                                <div class="modal-team-stats">
                                    <div class="modal-team-stat">
                                        <div class="number">${memberData.stats.years}</div>
                                        <div class="label">Years Experience</div>
                                    </div>
                                    <div class="modal-team-stat">
                                        <div class="number">${memberData.stats.awards}</div>
                                        <div class="label">Awards</div>
                                    </div>
                                    <div class="modal-team-stat">
                                        <div class="number">${memberData.stats.stories}</div>
                                        <div class="label">Stories Published</div>
                                    </div>
                                </div>
                                
                                <h4>Expertise</h4>
                                <div class="modal-team-expertise">
                                    ${memberData.expertise.map(exp => `<span class="expertise-tag">${exp}</span>`).join('')}
                                </div>
                                
                                <h4>Recent Work</h4>
                                <div class="recent-work">
                                    ${memberData.recentWork.map(work => `
                                        <div class="work-item mb-2">
                                            <a href="${work.url}" class="text-decoration-none">${work.title}</a>
                                            <small class="text-muted d-block">${work.date}</small>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                        <a href="contact.html" class="btn btn-primary">Contact ${name.split(' ')[0]}</a>
                    </div>
                </div>
            </div>
        `;

        // Set modal content and show
        $('#teamMemberModal .modal-content').html(modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('teamMemberModal'));
        modal.show();

        // Track modal view
        trackTeamMemberView(name);
    }

    /**
     * Get team member data (mock function)
     */
    function getTeamMemberData(name) {
        // Mock data - in real app this would come from an API
        const mockData = {
            'Robert Chen': {
                image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w-800&q=80',
                department: 'Leadership',
                bio: 'Robert leads GNN with over 25 years of journalism experience. He previously won the Pulitzer Prize for his investigative work on government transparency and has served as bureau chief in three continents.',
                stats: {
                    years: 25,
                    awards: 8,
                    stories: 1500
                },
                expertise: ['Leadership', 'Strategic Planning', 'Investigative Journalism', 'Global Affairs', 'Media Management'],
                recentWork: [
                    { title: 'The Future of Digital Journalism', url: 'news.html', date: '2 weeks ago' },
                    { title: 'Interview with UN Secretary General', url: 'news.html', date: '1 month ago' },
                    { title: 'Annual Media Trends Report 2023', url: 'news.html', date: '2 months ago' }
                ]
            },
            'Sarah Johnson': {
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                department: 'Editorial',
                bio: 'Sarah oversees all editorial content with a focus on maintaining journalistic integrity and excellence. She has edited award-winning investigations and leads our fact-checking team.',
                stats: {
                    years: 18,
                    awards: 12,
                    stories: 2400
                },
                expertise: ['Editing', 'Fact-checking', 'Investigative Reporting', 'Political Analysis', 'Team Management'],
                recentWork: [
                    { title: 'Editorial: The Importance of Independent Journalism', url: 'news.html', date: '1 week ago' },
                    { title: 'Election Coverage 2023 Analysis', url: 'news.html', date: '3 weeks ago' },
                    { title: 'Guide to Source Verification', url: 'news.html', date: '1 month ago' }
                ]
            },
            'Michael Rodriguez': {
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                department: 'Editorial',
                bio: 'Michael manages daily news operations and foreign correspondents. His expertise in international reporting comes from 15 years as a foreign correspondent in conflict zones.',
                stats: {
                    years: 20,
                    awards: 6,
                    stories: 1800
                },
                expertise: ['International Reporting', 'Conflict Journalism', 'Newsroom Management', 'Digital Strategy', 'Team Leadership'],
                recentWork: [
                    { title: 'Managing Breaking News in Digital Age', url: 'news.html', date: '2 weeks ago' },
                    { title: 'Foreign Correspondent Safety Guide', url: 'news.html', date: '1 month ago' },
                    { title: 'Global News Trends Analysis', url: 'news.html', date: '2 months ago' }
                ]
            }
        };

        return mockData[name] || {
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            department: 'Journalism',
            bio: 'Dedicated journalist committed to delivering accurate and impactful news coverage.',
            stats: { years: 10, awards: 3, stories: 500 },
            expertise: ['Reporting', 'Writing', 'Research'],
            recentWork: [
                { title: 'Sample News Article', url: 'news.html', date: 'Recently' }
            ]
        };
    }

    // ========== TEAM STATS ANIMATION ==========

    /**
     * Initialize team stats animation
     */
    function initTeamStats() {
        const $statNumbers = $('.stat-number');

        // Only animate when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        // Observe stats container
        const $statsContainer = $('.stats')[0];
        if ($statsContainer) {
            observer.observe($statsContainer);
        }
    }

    /**
     * Animate stats numbers
     */
    function animateStats() {
        const $statNumbers = $('.stat-number');

        $statNumbers.each(function () {
            const $number = $(this);
            const target = parseInt($number.text());
            const duration = 1500;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            let step = 0;

            const timer = setInterval(() => {
                step++;
                current = Math.min(Math.floor(increment * step), target);

                // Remove + sign temporarily during animation
                const text = $number.text();
                const hasPlus = text.includes('+');
                $number.text(current + (hasPlus && current === target ? '+' : ''));

                if (current >= target) {
                    clearInterval(timer);
                }
            }, duration / steps);
        });
    }

    // ========== DEPARTMENT COUNT ==========

    /**
     * Initialize department count display
     */
    function initDepartmentCount() {
        const $teamMembers = $('.team-member');
        const departmentCounts = {};

        // Count members by department
        $teamMembers.each(function () {
            const department = $(this).data('department');
            departmentCounts[department] = (departmentCounts[department] || 0) + 1;
        });

        // Update filter buttons with counts
        $('.filter-btn').each(function () {
            const $button = $(this);
            const department = $button.data('department');

            if (department === 'all') {
                const total = Object.values(departmentCounts).reduce((a, b) => a + b, 0);
                $button.append(` <span class="badge bg-primary rounded-pill">${total}</span>`);
            } else if (departmentCounts[department]) {
                $button.append(` <span class="badge bg-primary rounded-pill">${departmentCounts[department]}</span>`);
            }
        });
    }

    // ========== TEAM SEARCH ==========

    /**
     * Initialize team search functionality
     */
    function initTeamSearch() {
        // This would integrate with the global search or add specific team search
        // For now, we'll just add search within page functionality
        const $searchInput = $('#teamSearch');

        if ($searchInput.length) {
            $searchInput.on('input', function () {
                const searchTerm = $(this).val().toLowerCase().trim();
                filterTeamBySearch(searchTerm);
            });
        }
    }

    /**
     * Filter team by search term
     */
    function filterTeamBySearch(searchTerm) {
        const $teamMembers = $('.team-member');

        if (!searchTerm) {
            $teamMembers.show();
            return;
        }

        $teamMembers.each(function () {
            const $member = $(this);
            const name = $member.find('.team-name').text().toLowerCase();
            const position = $member.find('.team-position').text().toLowerCase();
            const bio = $member.find('.team-bio').text().toLowerCase();
            const expertise = $member.find('.expertise-tag').text().toLowerCase();

            if (name.includes(searchTerm) ||
                position.includes(searchTerm) ||
                bio.includes(searchTerm) ||
                expertise.includes(searchTerm)) {
                $member.show();
            } else {
                $member.hide();
            }
        });
    }

    // ========== PRINT FUNCTIONALITY ==========

    /**
     * Initialize print team functionality
     */
    function initPrintTeam() {
        // Add print button if needed
        const $printBtn = $('<button/>', {
            class: 'btn btn-outline-secondary btn-print-team',
            html: '<i class="fas fa-print me-2"></i> Print Team Directory'
        }).on('click', function () {
            printTeamDirectory();
        });

        // Add to page if desired location
        // $('.page-header').append($printBtn);
    }

    /**
     * Print team directory
     */
    function printTeamDirectory() {
        // Open print window with team directory
        const printWindow = window.open('', '_blank');
        const $teamCards = $('.team-card');

        let printContent = `
            <html>
            <head>
                <title>GNN Team Directory</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    h1 { color: #333; }
                    .team-member { margin-bottom: 30px; break-inside: avoid; }
                    .team-name { font-weight: bold; font-size: 16px; }
                    .team-position { color: #666; font-size: 14px; }
                    .team-bio { font-size: 12px; line-height: 1.4; }
                    .expertise { font-size: 11px; color: #888; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>Global News Network - Team Directory</h1>
                <p>Printed on ${new Date().toLocaleDateString()}</p>
                <hr>
        `;

        $teamCards.each(function () {
            const name = $(this).find('.team-name').text();
            const position = $(this).find('.team-position').text();
            const bio = $(this).find('.team-bio').text();
            const expertise = $(this).find('.expertise-tag').map(function () {
                return $(this).text();
            }).get().join(', ');

            printContent += `
                <div class="team-member">
                    <div class="team-name">${name}</div>
                    <div class="team-position">${position}</div>
                    <div class="team-bio">${bio}</div>
                    <div class="expertise">Expertise: ${expertise}</div>
                </div>
                <hr>
            `;
        });

        printContent += `
            </body>
            </html>
        `;

        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.print();
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

    /**
     * Track team member view for analytics
     */
    function trackTeamMemberView(name) {
        console.log('Team member viewed:', name);
        // In real implementation:
        // gtag('event', 'team_member_view', {
        //     'event_category': 'engagement',
        //     'event_label': name
        // });
    }

    // ========== ERROR HANDLING ==========

    /**
     * Handle team page specific errors
     */
    function initErrorHandling() {
        // Handle image loading errors
        $('.team-image img').on('error', function () {
            $(this).attr('src', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');
            $(this).attr('alt', 'Team member photo not available');
        });

        // Handle modal errors
        $(document).on('error', '.modal-team-image img', function () {
            $(this).attr('src', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80');
        });
    }

    // Initialize error handling
    initErrorHandling();

    // ========== PUBLIC API ==========

    // Expose team page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.team = {
        filterTeamMembers: filterTeamMembers,
        loadMoreTeamMembers: loadMoreTeamMembers,
        openTeamMemberModal: openTeamMemberModal,
        printTeamDirectory: printTeamDirectory
    };

    // Log initialization
    console.log('Team page JavaScript initialized');
});