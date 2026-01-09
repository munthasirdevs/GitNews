/* ==============================================
   GLOBAL NEWS NETWORK - LIVE TV PAGE JAVASCRIPT
   Live TV page specific functionality
   ============================================== */

$(document).ready(function () {

    // ========== LIVE PAGE INITIALIZATION ==========
    initLivePage();

    /**
     * Initialize all live page components
     */
    function initLivePage() {
        // Live Stream Player
        initLiveStreamPlayer();

        // Channel Switching
        initChannelSwitching();

        // Live Updates Feed
        initLiveUpdates();

        // Live Chat
        initLiveChat();

        // Schedule
        initSchedule();

        // Stats & Analytics
        initLiveStats();

        // Quality Selection
        initQualitySelection();

        // Viewer Counter
        initViewerCounter();

        // Social Sharing
        initLiveSharing();

        // Performance Monitoring
        initLivePerformance();
    }

    // ========== LIVE STREAM PLAYER ==========

    /**
     * Initialize live stream player functionality
     */
    function initLiveStreamPlayer() {
        const $playPauseBtn = $('#playPauseBtn');
        const $volumeBtn = $('#volumeBtn');
        const $volumeSlider = $('.volume-slider input');
        const $fullscreenBtn = $('#fullscreenBtn');
        const $theaterModeBtn = $('#theaterModeBtn');
        const $shareBtn = $('#shareBtn');
        const $timeDisplay = $('.time-display');
        const $iframe = $('#mainLiveStream');

        let isPlaying = true;
        let volume = 80;
        let isFullscreen = false;
        let isTheaterMode = false;

        // Play/Pause functionality
        $playPauseBtn.on('click', function () {
            isPlaying = !isPlaying;
            const $icon = $playPauseBtn.find('i');

            if (isPlaying) {
                $icon.removeClass('fa-play').addClass('fa-pause');
                $('.play-pause-btn i').removeClass('fa-play').addClass('fa-pause');
                announceToScreenReader('Live stream playing');
            } else {
                $icon.removeClass('fa-pause').addClass('fa-play');
                $('.play-pause-btn i').removeClass('fa-pause').addClass('fa-play');
                announceToScreenReader('Live stream paused');
            }
        });

        // Volume control
        $volumeBtn.on('click', function () {
            $volumeSlider.parent().toggle();
        });

        $volumeSlider.on('input', function () {
            volume = $(this).val();
            updateVolumeIcon();
        });

        function updateVolumeIcon() {
            const $icon = $volumeBtn.find('i');
            if (volume == 0) {
                $icon.removeClass('fa-volume-up fa-volume-down').addClass('fa-volume-mute');
            } else if (volume < 50) {
                $icon.removeClass('fa-volume-up fa-volume-mute').addClass('fa-volume-down');
            } else {
                $icon.removeClass('fa-volume-down fa-volume-mute').addClass('fa-volume-up');
            }
        }

        // Fullscreen functionality
        $fullscreenBtn.on('click', function () {
            const $playerContainer = $('.live-video-player');

            if (!isFullscreen) {
                if ($playerContainer[0].requestFullscreen) {
                    $playerContainer[0].requestFullscreen();
                } else if ($playerContainer[0].webkitRequestFullscreen) {
                    $playerContainer[0].webkitRequestFullscreen();
                } else if ($playerContainer[0].mozRequestFullScreen) {
                    $playerContainer[0].mozRequestFullScreen();
                } else if ($playerContainer[0].msRequestFullscreen) {
                    $playerContainer[0].msRequestFullscreen();
                }
                isFullscreen = true;
                announceToScreenReader('Entered fullscreen mode');
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                isFullscreen = false;
                announceToScreenReader('Exited fullscreen mode');
            }
        });

        // Theater mode
        $theaterModeBtn.on('click', function () {
            const $container = $('.live-player-wrapper');
            isTheaterMode = !isTheaterMode;

            if (isTheaterMode) {
                $container.addClass('theater-mode');
                $('body').addClass('theater-mode-active');
                announceToScreenReader('Entered theater mode');
            } else {
                $container.removeClass('theater-mode');
                $('body').removeClass('theater-mode-active');
                announceToScreenReader('Exited theater mode');
            }
        });

        // Share functionality
        $shareBtn.on('click', function () {
            $('#shareModal').modal('show');
        });

        // Update time display (simulated for live stream)
        function updateTimeDisplay() {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            $timeDisplay.find('.current-time').text(`${hours}:${minutes}`);
        }

        // Update time every minute
        setInterval(updateTimeDisplay, 60000);
        updateTimeDisplay();

        // Keyboard shortcuts
        $(document).on('keydown', function (e) {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            switch (e.key.toLowerCase()) {
                case ' ':
                case 'k':
                    e.preventDefault();
                    $playPauseBtn.trigger('click');
                    break;
                case 'f':
                    e.preventDefault();
                    $fullscreenBtn.trigger('click');
                    break;
                case 't':
                    e.preventDefault();
                    $theaterModeBtn.trigger('click');
                    break;
                case 'm':
                    e.preventDefault();
                    $volumeBtn.trigger('click');
                    break;
                case 'arrowup':
                    e.preventDefault();
                    volume = Math.min(100, volume + 10);
                    $volumeSlider.val(volume).trigger('input');
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    volume = Math.max(0, volume - 10);
                    $volumeSlider.val(volume).trigger('input');
                    break;
            }
        });
    }

    // ========== CHANNEL SWITCHING ==========

    /**
     * Initialize channel switching functionality
     */
    function initChannelSwitching() {
        const $channelItems = $('.channel-item');
        const $mainIframe = $('#mainLiveStream');

        // Live channels data
        const channels = {
            'gnn-prime': {
                id: 'gnn-prime',
                title: 'GNN Prime',
                description: 'Global Climate Summit Coverage',
                streamUrl: 'https://www.youtube.com/embed/21X5lGlDOfg?autoplay=1&rel=0',
                viewers: 12458,
                likes: 2100
            },
            'gnn-business': {
                id: 'gnn-business',
                title: 'GNN Business',
                description: 'Market Opening Bell & Analysis',
                streamUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
                viewers: 8700,
                likes: 1500
            },
            'gnn-sports': {
                id: 'gnn-sports',
                title: 'GNN Sports',
                description: 'Championship Finals Live',
                streamUrl: 'https://www.youtube.com/embed/L_jWHffIx5E?autoplay=1&rel=0',
                viewers: 15200,
                likes: 3800
            },
            'gnn-international': {
                id: 'gnn-international',
                title: 'GNN International',
                description: 'World News Roundup',
                streamUrl: 'https://www.youtube.com/embed/9bZkp7q19f0?autoplay=1&rel=0',
                viewers: 6300,
                likes: 1200
            },
            'gnn-tech': {
                id: 'gnn-tech',
                title: 'GNN Tech',
                description: 'Tech Conference Live',
                streamUrl: 'https://www.youtube.com/embed/8UVNT4wvIGY?autoplay=1&rel=0',
                viewers: 9400,
                likes: 2300
            }
        };

        $channelItems.each(function () {
            const $channel = $(this);
            const channelTitle = $channel.find('h5').text().toLowerCase().replace(/\s+/g, '-');
            const channelId = Object.keys(channels).find(key => channels[key].title.toLowerCase().replace(/\s+/g, '-') === channelTitle);

            if (channelId && channels[channelId]) {
                $channel.data('channel', channelId);

                $channel.on('click', function (e) {
                    e.preventDefault();

                    // Remove active class from all channels
                    $channelItems.removeClass('active');

                    // Add active class to clicked channel
                    $channel.addClass('active');

                    // Switch to selected channel
                    switchChannel(channels[channelId]);
                });
            }
        });

        // Refresh channels button
        $('.refresh-btn').on('click', function () {
            refreshChannels();
        });
    }

    /**
     * Switch to selected channel
     */
    function switchChannel(channel) {
        const $iframe = $('#mainLiveStream');
        const $streamTitle = $('.live-stream-title');
        const $programDesc = $('.current-program');
        const $viewersCount = $('#liveViewers');

        // Update iframe source
        $iframe.attr('src', channel.streamUrl);

        // Update UI
        $streamTitle.text(channel.title);
        $programDesc.text(channel.description);
        $viewersCount.text(formatNumber(channel.viewers));

        // Update page title
        document.title = `${channel.title} - Live Now - Global News Network`;

        // Announce channel switch
        announceToScreenReader(`Switched to ${channel.title}`);

        // Track channel switch
        trackChannelSwitch(channel.id, channel.title);
    }

    /**
     * Refresh channels list
     */
    function refreshChannels() {
        const $refreshBtn = $('.refresh-btn');
        const $channelsList = $('.channels-list');

        // Show loading state
        $refreshBtn.addClass('loading');
        $refreshBtn.find('i').addClass('fa-spin');

        // Simulate API call
        setTimeout(() => {
            // Update viewer counts
            $('.channel-item').each(function () {
                const $channel = $(this);
                const $viewers = $channel.find('.channel-meta span:first-child');
                const currentCount = parseInt($viewers.text().replace(/[^0-9]/g, ''));
                const newCount = currentCount + Math.floor(Math.random() * 100);

                $viewers.html(`<i class="fas fa-users me-1"></i> ${formatNumber(newCount)}`);
            });

            // Remove loading state
            $refreshBtn.removeClass('loading');
            $refreshBtn.find('i').removeClass('fa-spin');

            // Show success message
            showToast('Channels refreshed successfully');

            announceToScreenReader('Channels list refreshed');
        }, 1000);
    }

    // ========== LIVE UPDATES ==========

    /**
     * Initialize live updates feed
     */
    function initLiveUpdates() {
        const $updatesFeed = $('#updatesFeed');
        const $pauseBtn = $('#pauseUpdates');
        const $refreshBtn = $('#refreshUpdates');
        const $loadMoreBtn = $('#loadMoreUpdates');

        let isPaused = false;
        let updateInterval;
        let loadedUpdates = 0;

        // Mock updates data
        const mockUpdates = [
            {
                time: '14:50',
                title: 'Closing Statements Begin',
                content: 'World leaders begin their closing statements at the climate summit.',
                author: 'Emma Wilson',
                location: 'Summit Hall'
            },
            {
                time: '14:48',
                title: 'Market Update: Tech Stocks Surge',
                content: 'Technology sector leads market gains with 3.2% increase.',
                author: 'Michael Chen',
                location: 'Trading Floor'
            },
            {
                time: '14:45',
                title: 'Final Match Schedule Announced',
                content: 'Championship final scheduled for Sunday at 15:00 local time.',
                author: 'David Wilson',
                location: 'Sports Arena'
            },
            {
                time: '14:42',
                title: 'New Research Funding Announced',
                content: 'Government announces $500M funding for climate research.',
                author: 'Dr. Sarah Johnson',
                location: 'Press Room'
            }
        ];

        // Start auto-updates
        startAutoUpdates();

        // Pause/Resume updates
        $pauseBtn.on('click', function () {
            isPaused = !isPaused;
            const $icon = $pauseBtn.find('i');
            const $text = $pauseBtn.contents().filter(function () {
                return this.nodeType === 3;
            })[0];

            if (isPaused) {
                $icon.removeClass('fa-pause').addClass('fa-play');
                $text.nodeValue = ' Resume';
                clearInterval(updateInterval);
                announceToScreenReader('Updates paused');
            } else {
                $icon.removeClass('fa-play').addClass('fa-pause');
                $text.nodeValue = ' Pause';
                startAutoUpdates();
                announceToScreenReader('Updates resumed');
            }
        });

        // Refresh updates
        $refreshBtn.on('click', function () {
            if (isPaused) return;

            $refreshBtn.addClass('loading');
            $refreshBtn.find('i').addClass('fa-spin');

            setTimeout(() => {
                addNewUpdate();
                $refreshBtn.removeClass('loading');
                $refreshBtn.find('i').removeClass('fa-spin');
                showToast('Updates refreshed');
            }, 500);
        });

        // Load more updates
        $loadMoreBtn.on('click', function () {
            loadMoreUpdates();
        });

        function startAutoUpdates() {
            updateInterval = setInterval(() => {
                if (!isPaused) {
                    addNewUpdate();
                }
            }, 30000); // Every 30 seconds
        }

        function addNewUpdate() {
            if (mockUpdates.length === 0) return;

            const update = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
            const updateHtml = `
                <div class="update-item new">
                    <div class="update-time">${update.time}</div>
                    <div class="update-content">
                        <h5>${update.title}</h5>
                        <p>${update.content}</p>
                        <div class="update-meta">
                            <span><i class="fas fa-user me-1"></i> ${update.author}</span>
                            <span><i class="fas fa-map-marker-alt me-1"></i> ${update.location}</span>
                        </div>
                    </div>
                </div>
            `;

            $updatesFeed.prepend(updateHtml);

            // Limit number of updates shown
            if ($updatesFeed.children().length > 20) {
                $updatesFeed.children().last().remove();
            }

            // Auto-scroll to top if not paused
            if (!isPaused) {
                $updatesFeed.scrollTop(0);
            }
        }

        function loadMoreUpdates() {
            $loadMoreBtn.addClass('loading');
            $loadMoreBtn.html('<i class="fas fa-spinner fa-spin me-2"></i> Loading...');

            setTimeout(() => {
                for (let i = 0; i < 3; i++) {
                    const update = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
                    const updateHtml = `
                        <div class="update-item">
                            <div class="update-time">${update.time}</div>
                            <div class="update-content">
                                <h5>${update.title}</h5>
                                <p>${update.content}</p>
                                <div class="update-meta">
                                    <span><i class="fas fa-user me-1"></i> ${update.author}</span>
                                    <span><i class="fas fa-map-marker-alt me-1"></i> ${update.location}</span>
                                </div>
                            </div>
                        </div>
                    `;
                    $updatesFeed.append(updateHtml);
                }

                loadedUpdates += 3;
                $loadMoreBtn.removeClass('loading');
                $loadMoreBtn.html('<i class="fas fa-plus-circle me-2"></i> Load More Updates');

                if (loadedUpdates >= 9) {
                    $loadMoreBtn.hide();
                }

                announceToScreenReader('More updates loaded');
            }, 1000);
        }
    }

    // ========== LIVE CHAT ==========

    /**
     * Initialize live chat functionality
     */
    function initLiveChat() {
        const $chatForm = $('#chatForm');
        const $chatInput = $('#chatInput');
        const $chatMessages = $('#chatMessages');
        const $clearChatBtn = $('#clearChat');
        const $autoScroll = $('#autoScroll');

        let chatInterval;
        let messageCount = 0;

        // Mock chat messages
        const mockMessages = [
            "This is incredible progress!",
            "What about developing countries?",
            "Will there be enforcement mechanisms?",
            "The economic impact will be significant.",
            "Finally, some real action!",
            "This gives me hope for the future.",
            "What's the timeline for implementation?",
            "The technology already exists.",
            "This could create millions of jobs.",
            "Historic moment indeed!"
        ];

        const mockUsers = [
            { name: "ClimateActivist", avatar: "https://i.pravatar.cc/40?img=5" },
            { name: "FutureThinker", avatar: "https://i.pravatar.cc/40?img=6" },
            { name: "EcoWarrior", avatar: "https://i.pravatar.cc/40?img=7" },
            { name: "GreenInnovator", avatar: "https://i.pravatar.cc/40?img=8" },
            { name: "SustainableFuture", avatar: "https://i.pravatar.cc/40?img=9" }
        ];

        // Start simulated chat
        startChatSimulation();

        // Chat form submission
        $chatForm.on('submit', function (e) {
            e.preventDefault();
            const message = $chatInput.val().trim();

            if (message) {
                sendMessage(message);
                $chatInput.val('');
            }
        });

        // Clear chat
        $clearChatBtn.on('click', function () {
            if (confirm('Are you sure you want to clear all chat messages?')) {
                $chatMessages.empty();
                messageCount = 0;
                showToast('Chat cleared');
                announceToScreenReader('Chat cleared');
            }
        });

        function startChatSimulation() {
            chatInterval = setInterval(() => {
                if (messageCount < 50) { // Limit simulated messages
                    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
                    const message = mockMessages[Math.floor(Math.random() * mockMessages.length)];
                    addMessage(user.name, user.avatar, message, false);
                    messageCount++;
                }
            }, 5000); // Every 5 seconds
        }

        function sendMessage(message) {
            const username = $('#anonymousChat').is(':checked') ? 'Anonymous' : 'You';
            const avatar = 'https://i.pravatar.cc/40?img=10';

            addMessage(username, avatar, message, true);
            messageCount++;

            // Simulate response
            setTimeout(() => {
                const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
                const response = getResponseToMessage(message);
                addMessage(user.name, user.avatar, response, false);
                messageCount++;
            }, 1000);

            // Track message
            trackChatMessage(message);
        }

        function addMessage(username, avatar, message, isUser) {
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const messageClass = isUser ? 'user' : '';

            const messageHtml = `
                <div class="message-item ${messageClass}">
                    <div class="message-avatar">
                        <img src="${avatar}" alt="${username}">
                    </div>
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-user">${username}</span>
                            <span class="message-time">${time}</span>
                        </div>
                        <p class="message-text">${message}</p>
                    </div>
                </div>
            `;

            $chatMessages.append(messageHtml);

            // Auto-scroll to bottom
            if ($autoScroll.is(':checked')) {
                $chatMessages.scrollTop($chatMessages[0].scrollHeight);
            }

            // Limit messages
            if ($chatMessages.children().length > 100) {
                $chatMessages.children().first().remove();
            }
        }

        function getResponseToMessage(message) {
            const responses = [
                "Great point!",
                "I agree with that.",
                "Interesting perspective.",
                "That's an important question.",
                "Thanks for sharing!",
                "What do others think?",
                "Let's discuss this further.",
                "Good observation.",
                "That's worth considering.",
                "Thanks for bringing that up."
            ];

            return responses[Math.floor(Math.random() * responses.length)];
        }

        // Clean up interval on page unload
        $(window).on('beforeunload', function () {
            clearInterval(chatInterval);
        });
    }

    // ========== SCHEDULE ==========

    /**
     * Initialize schedule functionality
     */
    function initSchedule() {
        // Tab switching
        $('#scheduleTab button').on('click', function () {
            const tabId = $(this).attr('id').replace('-tab', '');
            loadScheduleForTab(tabId);
        });

        // Load initial schedule
        loadScheduleForTab('today');
    }

    /**
     * Load schedule for specific tab
     */
    function loadScheduleForTab(tabId) {
        const $tabContent = $(`#${tabId} .schedule-table`);

        // Show loading
        $tabContent.html('<div class="text-center py-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2">Loading schedule...</p></div>');

        // Simulate API call
        setTimeout(() => {
            let scheduleHtml = '';
            const schedules = {
                today: [
                    { time: '15:30 - 16:30', title: 'Market Analysis & Closing Bell', desc: 'Daily market wrap-up and analysis', status: 'upcoming' },
                    { time: '16:30 - 17:30', title: 'Evening News Bulletin', desc: 'Comprehensive news roundup', status: '' },
                    { time: '18:00 - 19:00', title: 'Press Conference: Economic Policy', desc: 'Live coverage of government announcement', status: '' },
                    { time: '20:00 - 21:00', title: 'Prime Time News Special', desc: 'In-depth analysis of today\'s events', status: '' }
                ],
                tomorrow: [
                    { time: '09:00 - 10:00', title: 'Morning Briefing', desc: 'Start your day with the latest news', status: '' },
                    { time: '12:00 - 13:00', title: 'Midday News Update', desc: 'Breaking news and updates', status: '' },
                    { time: '15:00 - 16:00', title: 'Technology Roundtable', desc: 'Discussion on latest tech trends', status: '' },
                    { time: '19:00 - 20:00', title: 'Documentary Premiere', desc: 'Climate Change: The Facts', status: '' }
                ],
                week: [
                    { time: 'Mon 14:00', title: 'Weekly Economic Review', desc: 'Analysis of economic indicators', status: '' },
                    { time: 'Tue 15:00', title: 'Science & Technology Special', desc: 'Latest discoveries and innovations', status: '' },
                    { time: 'Wed 16:00', title: 'Global Affairs Roundtable', desc: 'International relations discussion', status: '' },
                    { time: 'Thu 17:00', title: 'Health & Wellness Hour', desc: 'Medical breakthroughs and advice', status: '' },
                    { time: 'Fri 18:00', title: 'Week in Review', desc: 'Summary of the week\'s top stories', status: '' }
                ]
            };

            const scheduleData = schedules[tabId] || [];

            scheduleData.forEach(item => {
                let badge = '';
                let buttonClass = 'btn-outline-secondary';
                let buttonText = 'Add to Calendar';

                if (item.status === 'live') {
                    badge = '<span class="badge bg-danger">LIVE NOW</span>';
                    buttonClass = 'btn-danger';
                    buttonText = 'Watch Live';
                } else if (item.status === 'upcoming') {
                    badge = '<span class="badge bg-warning">UPCOMING</span>';
                    buttonClass = 'btn-outline-primary';
                    buttonText = 'Set Reminder';
                }

                scheduleHtml += `
                    <div class="schedule-item ${item.status}">
                        <div class="schedule-time">${item.time}</div>
                        <div class="schedule-info">
                            <h5>${item.title}</h5>
                            <p>${item.desc}</p>
                            ${badge}
                        </div>
                        <div class="schedule-actions">
                            <button class="btn btn-sm ${buttonClass}">${buttonText}</button>
                        </div>
                    </div>
                `;
            });

            $tabContent.html(scheduleHtml || '<div class="text-center py-5"><p class="text-muted">No schedule available.</p></div>');

            // Add event listeners to buttons
            $tabContent.find('.schedule-actions .btn').on('click', function () {
                const $btn = $(this);
                const $scheduleItem = $btn.closest('.schedule-item');
                const title = $scheduleItem.find('h5').text();

                if ($btn.text().includes('Watch Live')) {
                    showToast(`Watching: ${title}`);
                    announceToScreenReader(`Started watching ${title}`);
                } else if ($btn.text().includes('Set Reminder')) {
                    showToast(`Reminder set for: ${title}`);
                    $btn.text('Reminder Set').removeClass('btn-outline-primary').addClass('btn-outline-success');
                    announceToScreenReader(`Reminder set for ${title}`);
                } else if ($btn.text().includes('Add to Calendar')) {
                    showToast(`Added to calendar: ${title}`);
                    $btn.text('Added').removeClass('btn-outline-secondary').addClass('btn-outline-success');
                    announceToScreenReader(`Added ${title} to calendar`);
                }
            });
        }, 800);
    }

    // ========== STATS & ANALYTICS ==========

    /**
     * Initialize live stats functionality
     */
    function initLiveStats() {
        // Update stats periodically
        setInterval(updateLiveStats, 30000);
        updateLiveStats();
    }

    /**
     * Update live statistics
     */
    function updateLiveStats() {
        // Update viewer count
        const $viewerCount = $('#viewerCount');
        const currentViewers = parseInt($viewerCount.text().replace(/[^0-9]/g, ''));
        const newViewers = currentViewers + Math.floor(Math.random() * 100) - 50;
        $viewerCount.text(Math.max(1000, newViewers).toLocaleString());

        // Update total viewers
        const $totalViewers = $('#totalViewers');
        const currentTotal = parseInt($totalViewers.text().replace(/[^0-9]/g, ''));
        $totalViewers.text((currentTotal + Math.floor(Math.random() * 10)).toLocaleString());

        // Update likes
        const $likes = $('#likes');
        const currentLikes = parseInt($likes.text().replace(/[^0-9]/g, ''));
        $likes.text((currentLikes + Math.floor(Math.random() * 5)).toLocaleString());

        // Update comments
        const $comments = $('#comments');
        const currentComments = parseInt($comments.text().replace(/[^0-9]/g, ''));
        $comments.text((currentComments + Math.floor(Math.random() * 3)).toLocaleString());
    }

    // ========== QUALITY SELECTION ==========

    /**
     * Initialize video quality selection
     */
    function initQualitySelection() {
        const $qualityDropdown = $('#qualityDropdown');
        const $qualityOptions = $('.dropdown-menu a[data-quality]');

        $qualityOptions.on('click', function (e) {
            e.preventDefault();
            const quality = $(this).data('quality');
            const qualityText = $(this).text().trim();

            // Update dropdown text
            $qualityDropdown.html(`<i class="fas fa-cog me-1"></i> Quality: ${qualityText.split('(')[0].trim()}`);

            // Change quality (in real implementation, this would change the stream quality)
            changeStreamQuality(quality);

            // Show confirmation
            showToast(`Video quality changed to ${qualityText}`);
            announceToScreenReader(`Video quality changed to ${qualityText}`);
        });
    }

    /**
     * Change stream quality (simulated)
     */
    function changeStreamQuality(quality) {
        const qualities = {
            'auto': 'Auto quality selected',
            '1080': '1080p HD quality selected',
            '720': '720p quality selected',
            '480': '480p quality selected',
            '360': '360p quality selected'
        };

        console.log(qualities[quality] || 'Quality changed');
    }

    // ========== VIEWER COUNTER ==========

    /**
     * Initialize dynamic viewer counter
     */
    function initViewerCounter() {
        // Simulate viewer count changes
        setInterval(simulateViewerChanges, 15000);
    }

    /**
     * Simulate viewer count changes
     */
    function simulateViewerChanges() {
        const $viewerElements = $('.live-audience-count span, #liveViewers');

        $viewerElements.each(function () {
            const $element = $(this);
            const currentText = $element.text();
            const match = currentText.match(/([\d,]+)/);

            if (match) {
                const currentCount = parseInt(match[1].replace(/,/g, ''));
                const change = Math.floor(Math.random() * 200) - 100; // -100 to +100
                const newCount = Math.max(1000, currentCount + change);

                $element.text(newCount.toLocaleString());

                // Add visual feedback
                if (change > 0) {
                    $element.addClass('text-success');
                    setTimeout(() => $element.removeClass('text-success'), 1000);
                } else if (change < 0) {
                    $element.addClass('text-danger');
                    setTimeout(() => $element.removeClass('text-danger'), 1000);
                }
            }
        });
    }

    // ========== SOCIAL SHARING ==========

    /**
     * Initialize live sharing functionality
     */
    function initLiveSharing() {
        const $shareOptions = $('.share-option');

        $shareOptions.on('click', function () {
            const platform = $(this).find('i').attr('class').split(' ')[1].replace('fa-', '');
            shareLiveStream(platform);
        });
    }

    /**
     * Share live stream
     */
    function shareLiveStream(platform) {
        const url = window.location.href;
        const title = document.title;
        const text = 'Watch live news coverage on Global News Network!';

        const shareUrls = {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
            whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        };

        if (shareUrls[platform]) {
            window.open(shareUrls[platform], '_blank', 'width=600,height=400');
            showToast(`Shared on ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
            trackShare(platform);
        }
    }

    /**
     * Copy share URL to clipboard
     */
    window.copyShareUrl = function () {
        const $shareUrl = $('#shareUrl');
        $shareUrl.select();
        document.execCommand('copy');

        showToast('Link copied to clipboard!');
        announceToScreenReader('Share link copied to clipboard');
    }

    // ========== PERFORMANCE MONITORING ==========

    /**
     * Initialize live page performance monitoring
     */
    function initLivePerformance() {
        // Monitor stream quality
        monitorStreamQuality();

        // Monitor connection
        monitorConnection();

        // Log performance
        console.log('Live page loaded. Performance monitoring active.');
    }

    /**
     * Monitor stream quality
     */
    function monitorStreamQuality() {
        let bufferEvents = 0;
        let lastBufferTime = 0;

        // Simulate buffer monitoring
        setInterval(() => {
            const now = Date.now();
            const timeSinceLastBuffer = now - lastBufferTime;

            // Random buffer event simulation
            if (Math.random() < 0.05 && timeSinceLastBuffer > 30000) { // 5% chance, min 30s apart
                bufferEvents++;
                lastBufferTime = now;

                if (bufferEvents > 3) {
                    console.warn('Multiple buffer events detected. Consider lowering quality.');
                    showToast('Poor connection detected. Try lowering video quality.', 'warning');
                }
            }
        }, 5000);
    }

    /**
     * Monitor connection quality
     */
    function monitorConnection() {
        let lastUpdate = Date.now();

        // Check for connection issues
        setInterval(() => {
            const now = Date.now();
            const timeSinceUpdate = now - lastUpdate;

            if (timeSinceUpdate > 10000) { // No updates for 10 seconds
                console.warn('Possible connection issue detected');
                // In real implementation, check actual connection status
            }

            lastUpdate = now;
        }, 5000);
    }

    // ========== UTILITY FUNCTIONS ==========

    /**
     * Format large numbers with K/M suffix
     */
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    /**
     * Show toast notification
     */
    function showToast(message, type = 'success') {
        // Remove existing toasts
        $('.live-toast').remove();

        const toastHtml = `
            <div class="live-toast toast align-items-center text-white bg-${type === 'warning' ? 'warning' : 'success'} border-0 position-fixed"
                 role="alert" aria-live="assertive" aria-atomic="true" style="bottom: 20px; right: 20px; z-index: 2000;">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
        `;

        $('body').append(toastHtml);
        const $toast = $('.live-toast');

        // Initialize and show toast
        const toast = new bootstrap.Toast($toast[0], { delay: 3000 });
        toast.show();

        // Remove after hide
        $toast.on('hidden.bs.toast', function () {
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

    /**
     * Track channel switch
     */
    function trackChannelSwitch(channelId, channelName) {
        console.log(`Channel switched to: ${channelName} (${channelId})`);
        // In real implementation:
        // gtag('event', 'channel_switch', {
        //     'event_category': 'engagement',
        //     'event_label': channelName,
        //     'value': channelId
        // });
    }

    /**
     * Track chat message
     */
    function trackChatMessage(message) {
        console.log('Chat message sent:', message.substring(0, 50) + '...');
        // In real implementation:
        // gtag('event', 'chat_message', {
        //     'event_category': 'engagement',
        //     'event_label': 'live_chat',
        //     'value': message.length
        // });
    }

    /**
     * Track share
     */
    function trackShare(platform) {
        console.log(`Shared on ${platform}`);
        // In real implementation:
        // gtag('event', 'share', {
        //     'event_category': 'social',
        //     'event_label': platform,
        //     'transport_type': 'beacon'
        // });
    }

    // ========== ERROR HANDLING ==========

    /**
     * Initialize error handling
     */
    function initErrorHandling() {
        // Stream error handling
        $('#mainLiveStream').on('error', function () {
            showToast('Stream error. Attempting to reconnect...', 'warning');
            setTimeout(() => {
                // Attempt to reload stream
                const currentSrc = $(this).attr('src');
                $(this).attr('src', currentSrc);
            }, 3000);
        });

        // Network error handling
        $(window).on('online offline', function () {
            if (navigator.onLine) {
                showToast('Connection restored', 'success');
            } else {
                showToast('Connection lost. Attempting to reconnect...', 'warning');
            }
        });

        // Global error handler
        window.addEventListener('error', function (e) {
            console.error('Live page error:', e);
            // Send to error tracking service
        });
    }

    // Initialize error handling
    initErrorHandling();

    // ========== PUBLIC API ==========

    // Expose live page functions if needed
    window.GNN = window.GNN || {};
    window.GNN.live = {
        switchChannel: switchChannel,
        sendChatMessage: function (message) {
            if (message && message.trim()) {
                $('#chatInput').val(message);
                $('#chatForm').submit();
            }
        },
        setQuality: function (quality) {
            changeStreamQuality(quality);
        },
        getViewerCount: function () {
            return parseInt($('#viewerCount').text().replace(/[^0-9]/g, ''));
        }
    };

    // Log initialization
    console.log('Live TV page JavaScript initialized');
});