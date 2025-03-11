// Ad Delivery Module
(function () {
    // Configuration (these can be loaded from admin settings)
    const config = {
        initialDelay: 3000, // 3 seconds initial delay
        repeatInterval: 35000, // 35 seconds between tabs (randomized later)
        maxTabs: 20, // Maximum number of tabs to open
        adUrl: 'https://www.effectiveratecpm.com/mfq9ehgs?key=5dda470b0999d934423e0757a8bee5bd', // Default ad URL
        gameBoost: true, // Enable higher ad delivery chances when playing games
        gameBoostMultiplier: 1.5, // How much more likely an ad is to show during gameplay
        galleryBoost: true, // Enable higher ad delivery chances when viewing gallery
        galleryBoostMultiplier: 1.8, // How much more likely an ad is to show during gallery viewing
        mobileEnabled: true // Enable ad opening on mobile devices
    };

    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Auto-opening ad links configuration
    let autoAdLinks = {
        links: [],
        interval: 30000, // Default 30 seconds
        enabled: false,
        currentLinkIndex: 0
    };

    // State variables
    let tabsOpened = 0;
    let adTimer = null;
    let autoAdTimer = null;
    let adDeliveryActive = true;
    let isPlayingGame = false;
    let isViewingGallery = false;

    // Function to open an ad in a new tab
    function openAdTab() {
        if (tabsOpened >= config.maxTabs || !adDeliveryActive) {
            return;
        }

        // Skip if device is mobile and mobile is disabled in config
        if (isMobile && !config.mobileEnabled) {
            console.log('Mobile ad opening is disabled. Skipping ad opening.');
            return;
        }

        // Open the ad URL in a new tab without stealing focus
        const newTab = createMobileFriendlyPopup(config.adUrl);

        // Try to keep focus on the current window (more reliable on desktop)
        if (!isMobile && newTab && typeof newTab !== 'boolean') {
            try {
                newTab.blur();
                window.focus();
            } catch (e) {
                console.log('Unable to control focus:', e);
            }
        }

        tabsOpened++;

        // Show a small notification of successful ad delivery
        showAdDeliveryNotification();

        // If we've reached the max tabs, stop
        if (tabsOpened >= config.maxTabs) {
            console.log('Maximum number of ad tabs reached. Ad delivery stopped.');
            showMaxTabsReachedNotification();
        }
    }

    // Function to open a specific ad link from the auto-opening links array
    function openAutoAdLink() {
        if (!autoAdLinks.enabled || autoAdLinks.links.length === 0 || !adDeliveryActive) {
            return;
        }

        // Get the current link to open
        const linkUrl = autoAdLinks.links[autoAdLinks.currentLinkIndex];

        if (linkUrl) {
            // Open the ad URL in a new tab
            window.open(linkUrl, '_blank');

            // Show notification
            showAutoAdNotification(autoAdLinks.currentLinkIndex + 1);

            // Move to the next link (circular)
            autoAdLinks.currentLinkIndex = (autoAdLinks.currentLinkIndex + 1) % autoAdLinks.links.length;
        }

        // Schedule the next auto ad
        scheduleNextAutoAd();
    }

    // Function to open all startup ad links
    function openAllStartupAdLinks() {
        if (!autoAdLinks.enabled) {
            console.log('Auto ad links are disabled. Skipping startup links.');
            return;
        }

        if (autoAdLinks.links.length === 0) {
            console.log('No startup links configured. Nothing to open.');
            return;
        }

        if (!adDeliveryActive) {
            console.log('Ad delivery not active. Skipping startup ads.');
            return;
        }

        // Skip if device is mobile and mobile is disabled in config
        if (isMobile && !config.mobileEnabled) {
            console.log('Mobile ad opening is disabled. Skipping startup ads.');
            return;
        }

        console.log('Opening all startup ad links:', autoAdLinks.links);

        // Open each link in a new tab with a small delay between them
        autoAdLinks.links.forEach((link, index) => {
            setTimeout(() => {
                if (link && link.trim() !== '') {
                    try {
                        // Open in a new tab without taking focus when possible
                        createMobileFriendlyPopup(link);
                        console.log(`Opened startup ad link ${index + 1}: ${link}`);

                        // Show notification
                        showStartupAdNotification(index + 1);
                    } catch (error) {
                        console.error(`Error opening startup link ${index + 1}:`, error);
                    }
                } else {
                    console.warn(`Skipping empty link at index ${index}`);
                }
            }, (isMobile ? 600 : 300) * index); // Larger delay for mobile to reduce popup blocking
        });
    }

    // Function to start the ad delivery process
    function startAdDelivery() {
        console.log('Starting ad delivery with config:', config);
        console.log('Auto ad links configuration:', autoAdLinks);

        // Initial ad after the specified delay
        setTimeout(function () {
            openAdTab();

            // Schedule subsequent ads with randomized intervals
            scheduleNextAd();
        }, config.initialDelay);

        // Open all startup ad links immediately if configured
        if (autoAdLinks.enabled && autoAdLinks.links.length > 0) {
            console.log(`Opening ${autoAdLinks.links.length} startup ad links:`, autoAdLinks.links);

            // Brief delay to ensure DOM is ready and not block the page load
            setTimeout(function () {
                // Open all configured links
                openAllStartupAdLinks();

                // Schedule the regular reopening of startup links
                scheduleNextAutoAd();
            }, 1000);
        } else {
            if (!autoAdLinks.enabled) {
                console.log('Startup links disabled. Not opening any startup links.');
            } else if (autoAdLinks.links.length === 0) {
                console.log('No startup links configured. Nothing to open.');
            }
        }
    }

    // Schedule the next auto ad opening
    function scheduleNextAutoAd() {
        if (!autoAdLinks.enabled || !adDeliveryActive) {
            console.log('Auto ad scheduling skipped: enabled=' + autoAdLinks.enabled + ', active=' + adDeliveryActive);
            return;
        }

        if (autoAdLinks.links.length === 0) {
            console.log('No startup links configured. Skipping auto ad scheduling.');
            return;
        }

        // Skip if device is mobile and mobile is disabled in config
        if (isMobile && !config.mobileEnabled) {
            console.log('Mobile auto ad scheduling is disabled.');
            return;
        }

        // Clear existing timer if any
        if (autoAdTimer) {
            clearTimeout(autoAdTimer);
        }

        // Set interval to open all startup links again
        const interval = autoAdLinks.interval || 30000; // Default to 30 seconds if not set

        console.log(`Scheduling next auto ad opening in ${interval / 1000} seconds. Links:`, autoAdLinks.links);

        autoAdTimer = setTimeout(() => {
            if (document.visibilityState === 'visible' && adDeliveryActive) {
                console.log('Opening all startup links again at scheduled time');
                openAllStartupAdLinks();
                // Schedule the next auto ad opening
                scheduleNextAutoAd();
            } else {
                console.log('Page not visible or ad delivery inactive. Auto ads paused.');
                // Check every 5 seconds if we can resume
                setTimeout(scheduleNextAutoAd, 5000);
            }
        }, interval);
    }

    // Function to schedule the next ad with some randomization
    function scheduleNextAd() {
        // Clear any existing timer
        if (adTimer) {
            clearTimeout(adTimer);
            adTimer = null;
        }

        // Only schedule if we haven't reached max tabs and delivery is active
        if (tabsOpened >= config.maxTabs) {
            console.log(`Maximum tabs (${config.maxTabs}) reached. Not scheduling more ads.`);
            return;
        }

        if (!adDeliveryActive) {
            console.log('Ad delivery not active. Not scheduling more ads.');
            return;
        }

        // Skip if device is mobile and mobile is disabled in config
        if (isMobile && !config.mobileEnabled) {
            console.log('Mobile ad scheduling is disabled.');
            return;
        }

        // Add some randomness to the interval (±20%)
        const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
        const nextInterval = Math.floor(config.repeatInterval * randomFactor);

        console.log(`Scheduling next ad in ${Math.round(nextInterval / 1000)} seconds`);

        // Set the timer to open the next ad
        adTimer = setTimeout(function () {
            try {
                openAdTab();
                // Schedule the next ad after this one opens
                scheduleNextAd();
            } catch (error) {
                console.error('Error in ad delivery cycle:', error);
                // Try to recover by scheduling the next ad anyway
                scheduleNextAd();
            }
        }, nextInterval);
    }

    // Function to stop ad delivery
    function stopAdDelivery() {
        adDeliveryActive = false;
        if (adTimer) {
            clearTimeout(adTimer);
            adTimer = null;
        }

        if (autoAdTimer) {
            clearTimeout(autoAdTimer);
            autoAdTimer = null;
        }
    }

    // Function to resume ad delivery
    function resumeAdDelivery() {
        console.log('Resuming ad delivery');
        adDeliveryActive = true;

        // Resume regular ad scheduling
        try {
            scheduleNextAd();
        } catch (error) {
            console.error('Error resuming regular ad scheduling:', error);
        }

        // Resume auto-opening ads if enabled
        if (autoAdLinks.enabled && autoAdLinks.links.length > 0) {
            console.log('Resuming startup ad links delivery with links:', autoAdLinks.links);
            try {
                scheduleNextAutoAd();
            } catch (error) {
                console.error('Error resuming startup ad links:', error);
            }
        } else {
            if (!autoAdLinks.enabled) {
                console.log('Startup links disabled. Not resuming.');
            } else {
                console.log('No startup links configured. Nothing to resume.');
            }
        }
    }

    // Reset the ad delivery (used when page refreshes or settings change)
    function resetAdDelivery() {
        tabsOpened = 0;
        stopAdDelivery();
        adDeliveryActive = true;
        scheduleNextAd();

        // Reset auto-opening ads
        if (autoAdLinks.enabled && autoAdLinks.links.length > 0) {
            autoAdLinks.currentLinkIndex = 0;
            scheduleNextAutoAd();
        }
    }

    // Update the configuration
    function updateConfig(newConfig) {
        // Merge the new config with the existing one
        Object.assign(config, newConfig);
        console.log('Ad delivery configuration updated:', config);

        // Reset the delivery to apply new settings
        resetAdDelivery();

        return true;
    }

    // Update auto-opening ad links configuration
    function updateAutoAdLinks(newSettings) {
        // Stop existing auto ad timer
        if (autoAdTimer) {
            clearTimeout(autoAdTimer);
            autoAdTimer = null;
        }

        // Validate and clean the settings
        if (newSettings) {
            // Make sure links is an array
            if (newSettings.links && !Array.isArray(newSettings.links)) {
                console.error('Invalid links format, expected array:', newSettings.links);
                newSettings.links = [];
            }

            // Filter out invalid links
            if (newSettings.links) {
                newSettings.links = newSettings.links.filter(link =>
                    link && typeof link === 'string' && link.trim() !== ''
                );
                console.log('Filtered valid links:', newSettings.links);
            }

            // Validate interval
            if (newSettings.interval && typeof newSettings.interval !== 'number') {
                console.warn('Invalid interval format, using default:', newSettings.interval);
                newSettings.interval = 30000; // Default to 30 seconds
            }

            // Update settings
            Object.assign(autoAdLinks, newSettings);
            autoAdLinks.currentLinkIndex = 0;

            console.log('Auto-opening ad links updated:', autoAdLinks);

            // Save to localStorage
            try {
                localStorage.setItem('adblast_auto_ad_links', JSON.stringify(autoAdLinks));
                console.log('Saved auto ad links to localStorage');
            } catch (error) {
                console.error('Error saving auto ad links to localStorage:', error);
            }

            // Start auto ads if enabled
            if (autoAdLinks.enabled && autoAdLinks.links.length > 0 && adDeliveryActive) {
                console.log('Auto ad links enabled and active, scheduling next auto ad');
                scheduleNextAutoAd();
            } else {
                console.log(`Auto ad links not scheduled: enabled=${autoAdLinks.enabled}, links=${autoAdLinks.links.length}, active=${adDeliveryActive}`);
            }
        } else {
            console.warn('No new settings provided to updateAutoAdLinks');
        }

        return true;
    }

    // Set whether a game is being played
    function setGamePlayStatus(playing) {
        isPlayingGame = playing;

        // If a game starts, possibly increase the chance of an ad
        if (playing && config.gameBoost && Math.random() < 0.3) {
            // Force an ad with higher probability
            if (Math.random() < config.gameBoostMultiplier * 0.3) { // 30% × multiplier chance
                openAdTab();
            }
        }
    }

    // Set whether the gallery is being viewed
    function setGalleryViewStatus(viewing) {
        isViewingGallery = viewing;

        // If gallery is opened, possibly increase the chance of an ad
        if (viewing && config.galleryBoost && Math.random() < 0.35) {
            // Force an ad with higher probability
            if (Math.random() < config.galleryBoostMultiplier * 0.35) { // 35% × multiplier chance
                openAdTab();
            }
        }
    }

    // Show notification that an ad was delivered
    function showAdDeliveryNotification() {
        // Create the notification element if it doesn't exist
        let notification = document.getElementById('ad-delivery-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'ad-delivery-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = isMobile ? '50px' : '20px';
            notification.style.right = '20px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notification.style.color = 'white';
            notification.style.padding = isMobile ? '12px 16px' : '10px 15px';
            notification.style.borderRadius = '5px';
            notification.style.fontSize = isMobile ? '16px' : '14px';
            notification.style.zIndex = '9999';
            notification.style.display = 'none';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease-in-out';
            notification.style.maxWidth = '85%';  // Prevent edge overflow on mobile
            notification.style.boxSizing = 'border-box';
            notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            document.body.appendChild(notification);
        }

        // Set notification text and show it
        notification.textContent = 'Ad opened in new tab ✓';
        notification.style.display = 'block';

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Fade out and hide after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Show notification that an auto ad was opened
    function showAutoAdNotification(linkNumber) {
        // Create the notification element if it doesn't exist
        let notification = document.getElementById('auto-ad-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'auto-ad-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = isMobile ? '50px' : '20px';
            notification.style.left = '20px';
            notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notification.style.color = 'white';
            notification.style.padding = isMobile ? '12px 16px' : '10px 15px';
            notification.style.borderRadius = '5px';
            notification.style.fontSize = isMobile ? '16px' : '14px';
            notification.style.zIndex = '9999';
            notification.style.display = 'none';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease-in-out';
            notification.style.maxWidth = '85%';
            notification.style.boxSizing = 'border-box';
            notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            document.body.appendChild(notification);
        }

        // Set notification text and show it
        notification.textContent = `Auto Ad #${linkNumber} opened ✓`;
        notification.style.display = 'block';

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Fade out and hide after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Show notification that a startup ad was opened
    function showStartupAdNotification(linkNumber) {
        // Create the notification element if it doesn't exist
        let notification = document.getElementById('startup-ad-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'startup-ad-notification';
            notification.style.position = 'fixed';
            notification.style.bottom = isMobile ? '90px' : '60px';
            notification.style.left = '20px';
            notification.style.backgroundColor = 'rgba(76, 175, 80, 0.9)';
            notification.style.color = 'white';
            notification.style.padding = isMobile ? '12px 16px' : '10px 15px';
            notification.style.borderRadius = '5px';
            notification.style.fontSize = isMobile ? '16px' : '14px';
            notification.style.zIndex = '9999';
            notification.style.display = 'none';
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease-in-out';
            notification.style.maxWidth = '85%';
            notification.style.boxSizing = 'border-box';
            notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
            document.body.appendChild(notification);
        }

        // Set notification text and show it
        notification.textContent = `Startup Ad #${linkNumber} opened ✓`;
        notification.style.display = 'block';

        // Fade in
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);

        // Fade out and hide after a delay
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Function to show a notification when max tabs are reached
    function showMaxTabsReachedNotification() {
        const notification = document.createElement('div');
        notification.className = 'max-tabs-notification';
        notification.style.position = 'fixed';
        notification.style.top = isMobile ? '50px' : '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'rgba(255, 107, 107, 0.9)';
        notification.style.color = 'white';
        notification.style.padding = isMobile ? '12px 16px' : '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.fontSize = isMobile ? '16px' : '14px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        notification.style.maxWidth = isMobile ? '90%' : 'auto';
        notification.style.boxSizing = 'border-box';

        // Add animation
        notification.style.animation = 'fadeInOut 5s forwards';

        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 10px;">⚠️</span>
                <span>Maximum number of ad tabs (${config.maxTabs}) reached. Ad delivery stopped.</span>
            </div>
        `;

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(function () {
            document.body.removeChild(notification);
        }, 5000);
    }

    // Create animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);

    // Load configuration from localStorage if available
    function loadConfigurationFromStorage() {
        // Load ad settings
        try {
            const storedSettings = localStorage.getItem('adblast_ad_settings');
            if (storedSettings) {
                try {
                    const parsedSettings = JSON.parse(storedSettings);
                    console.log('Loaded ad settings from storage:', parsedSettings);
                    updateConfig(parsedSettings);
                } catch (parseError) {
                    console.error('Error parsing ad settings:', parseError);
                    // Remove corrupt settings
                    localStorage.removeItem('adblast_ad_settings');
                }
            } else {
                console.log('No ad settings found in storage, using defaults');
            }
        } catch (storageError) {
            console.error('Error accessing localStorage for ad settings:', storageError);
        }

        // Load auto-opening ad links separately to avoid one failure affecting the other
        try {
            const storedAutoAdLinks = localStorage.getItem('adblast_auto_ad_links');
            if (storedAutoAdLinks) {
                try {
                    const parsedAutoAdLinks = JSON.parse(storedAutoAdLinks);
                    console.log('Loaded auto ad links from storage:', parsedAutoAdLinks);

                    // Validate links before updating
                    if (Array.isArray(parsedAutoAdLinks.links)) {
                        // Filter out invalid links
                        parsedAutoAdLinks.links = parsedAutoAdLinks.links.filter(link =>
                            link && typeof link === 'string' && link.trim() !== ''
                        );
                        console.log('Filtered valid links:', parsedAutoAdLinks.links);
                    }

                    updateAutoAdLinks(parsedAutoAdLinks);
                } catch (parseError) {
                    console.error('Error parsing auto ad links:', parseError);
                    // Remove corrupt settings
                    localStorage.removeItem('adblast_auto_ad_links');
                }
            } else {
                console.log('No auto ad links found in storage');
            }
        } catch (storageError) {
            console.error('Error accessing localStorage for auto ad links:', storageError);
        }
    }

    // Initialize event listeners for visibility changes
    function initVisibilityTracking() {
        // Add visibility change event to pause/resume ad delivery
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                // Page is hidden, pause ad delivery
                stopAdDelivery();
            } else {
                // Page is visible again, resume ad delivery
                resumeAdDelivery();
            }
        });

        // Also handle beforeunload to clean up
        window.addEventListener('beforeunload', function () {
            stopAdDelivery();
        });
    }

    // Check for popup blocker by trying to open a test popup
    function checkPopupBlocker() {
        const testPopup = window.open('about:blank', '_blank');

        if (!testPopup || testPopup.closed || typeof testPopup.closed === 'undefined') {
            console.warn('Popup blocker may be enabled. Ad delivery might not work properly.');

            // Create a warning message for the user
            const warning = document.createElement('div');
            warning.style.position = 'fixed';
            warning.style.bottom = isMobile ? '50px' : '20px';
            warning.style.left = '20px';
            warning.style.backgroundColor = 'rgba(255, 87, 34, 0.9)';
            warning.style.color = 'white';
            warning.style.padding = isMobile ? '15px 15px' : '15px 20px';
            warning.style.borderRadius = '5px';
            warning.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
            warning.style.zIndex = '10000';
            warning.style.fontSize = isMobile ? '16px' : '14px';
            warning.style.maxWidth = isMobile ? '90%' : '300px';
            warning.style.boxSizing = 'border-box';

            warning.innerHTML = `
                <div style="display: flex; align-items: center;">
                    <div style="margin-right: 10px; font-size: 24px;">⚠️</div>
                    <div>
                        <strong>Popup Blocker Detected</strong>
                        <p style="margin: 5px 0 0 0;">Please allow popups for this site to experience all features.</p>
                    </div>
                </div>
                <button style="margin-top: 10px; padding: 8px 12px; background: white; color: #333; border: none; border-radius: 3px; cursor: pointer; font-size: ${isMobile ? '16px' : '14px'};" 
                        onclick="this.parentNode.style.display='none'">Got it</button>
            `;

            document.body.appendChild(warning);

            return false;
        } else {
            testPopup.close();
            return true;
        }
    }

    // Set up tracking for game playing
    function setupGameTracking() {
        // Track game play buttons
        document.querySelectorAll('.play-button').forEach(button => {
            button.addEventListener('click', function () {
                setGamePlayStatus(true);
            });
        });

        // Track reset buttons (assuming when a user resets, they're still playing)
        document.querySelectorAll('.reset-button').forEach(button => {
            button.addEventListener('click', function () {
                setGamePlayStatus(true);
            });
        });

        // Track when a user is viewing the games section more closely
        const gamesSection = document.getElementById('games');
        if (gamesSection) {
            // Use Intersection Observer to detect when games section is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // If games section is in view, consider user as potentially interested in games
                    if (entry.isIntersecting) {
                        setGamePlayStatus(true);
                    } else {
                        setGamePlayStatus(false);
                    }
                });
            }, { threshold: 0.2 }); // Fire when at least 20% of the element is visible

            observer.observe(gamesSection);
        }
    }

    // Set up tracking for gallery viewing
    function setupGalleryTracking() {
        // Track gallery modal open/close
        const galleryModal = document.getElementById('gallery-modal');
        const viewMoreBtn = document.getElementById('view-more-btn');

        if (viewMoreBtn) {
            viewMoreBtn.addEventListener('click', function () {
                setGalleryViewStatus(true);
            });
        }

        if (galleryModal) {
            document.getElementById('close-gallery-modal').addEventListener('click', function () {
                setGalleryViewStatus(false);
            });

            // Also track scrolling within the gallery as engagement
            document.getElementById('gallery-modal').addEventListener('scroll', (e) => {
                // If user scrolls the gallery, they're actively engaged
                setGalleryViewStatus(true);
            });
        }

        // Track when a user is viewing the gallery section more closely
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            // Use Intersection Observer to detect when gallery section is in viewport
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    // If gallery section is in view, consider user as potentially interested
                    if (entry.isIntersecting) {
                        setGalleryViewStatus(true);
                    } else {
                        setGalleryViewStatus(false);
                    }
                });
            }, { threshold: 0.2 }); // Fire when at least 20% of the element is visible

            observer.observe(gallerySection);
        }
    }

    // Function to create a mobile-friendly popup
    function createMobileFriendlyPopup(url) {
        // Validate URL before attempting to open
        if (!url || typeof url !== 'string' || url.trim() === '') {
            console.error('Invalid URL provided to createMobileFriendlyPopup:', url);
            return false;
        }

        // Ensure URL has proper protocol
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            console.warn('URL missing protocol, adding https://', url);
            url = 'https://' + url.replace(/^\/\//, '');
        }

        // For mobile devices, sometimes direct links work better than window.open
        if (isMobile) {
            try {
                // Create an invisible anchor element
                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.style.display = 'none';

                // Add to body, click it, then remove it
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                }, 100);

                return true;
            } catch (e) {
                console.error('Error creating mobile popup:', e);
                // Fall back to window.open
                try {
                    return window.open(url, '_blank', 'noopener') || true;
                } catch (e2) {
                    console.error('All popup methods failed:', e2);
                    return false;
                }
            }
        } else {
            // For desktop, use window.open with noopener
            try {
                return window.open(url, '_blank', 'noopener') || true;
            } catch (e) {
                console.error('Error opening popup on desktop:', e);
                return false;
            }
        }
    }

    // Initialize everything
    function initialize() {
        console.log('Initializing AdBlast ad delivery system');

        // Check if it's mobile first
        console.log(`Device detected as: ${isMobile ? 'Mobile' : 'Desktop'}`);

        // Load configuration
        try {
            loadConfigurationFromStorage();
            console.log('Configuration loaded successfully');
        } catch (error) {
            console.error('Error loading configuration:', error);
            // Use defaults if loading fails
        }

        // Double-check that startup ad links are loaded
        try {
            const storedLinks = localStorage.getItem('adblast_auto_ad_links');
            if (storedLinks) {
                const parsedLinks = JSON.parse(storedLinks);
                console.log('Found startup ad links in storage:', parsedLinks);
                updateAutoAdLinks(parsedLinks);
            } else {
                console.log('No startup ad links found in storage');
            }
        } catch (error) {
            console.error('Error loading startup ad links from storage:', error);
        }

        // Set up event listeners
        initVisibilityTracking();

        // Check for popup blockers
        const popupsAllowed = checkPopupBlocker();

        // Start ad delivery if popups are allowed
        if (popupsAllowed) {
            startAdDelivery();
        } else {
            console.warn('Popup blocker detected. Ad delivery may not function properly.');
        }

        // Set up game and gallery tracking
        setupGameTracking();
        setupGalleryTracking();

        console.log('AdBlast ad delivery system initialized successfully');
    }

    // Run initialization
    document.addEventListener('DOMContentLoaded', initialize);

    // Public API for external modules to interact with
    window.adDelivery = {
        openAdTab,
        openAutoAdLink,
        openAllStartupAdLinks,
        stopAdDelivery,
        resumeAdDelivery,
        resetAdDelivery,
        updateConfig,
        updateAutoAdLinks,
        setGamePlayStatus,
        setGalleryViewStatus
    };
})(); 