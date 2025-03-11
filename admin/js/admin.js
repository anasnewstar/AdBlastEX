/**
 * AdBlast Admin Panel JavaScript
 * This file contains shared functionality used across the admin panel pages
 */

// Check if the user is logged in
function checkAuth() {
    const adminToken = localStorage.getItem('adblast_admin_token');
    if (!adminToken && !window.location.href.includes('login.html')) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('adblast_admin_token');
    window.location.href = 'login.html';
}

// Apply settings to the ad delivery system
function applyAdSettings(settings) {
    if (window.parent && window.parent.adDelivery) {
        window.parent.adDelivery.updateConfig(settings);
        return true;
    }
    return false;
}

// Format date for display
function formatDate(date) {
    if (!date) return '';

    const d = new Date(date);
    return d.toISOString().split('T')[0];
}

// Show a notification message
function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('admin-notification');

    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'admin-notification';
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '1010';
        notification.style.transition = 'transform 0.3s, opacity 0.3s';
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
        document.body.appendChild(notification);
    }

    // Set notification type
    if (type === 'success') {
        notification.style.backgroundColor = '#4e54c8';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#d73a49';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#f0ad4e';
        notification.style.color = 'white';
    }

    // Set message
    notification.innerHTML = message;

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateY(0)';
        notification.style.opacity = '1';
    }, 10);

    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateY(-100px)';
        notification.style.opacity = '0';
    }, 3000);
}

// Confirm dialog
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// Load existing settings from localStorage
function loadAdSettings() {
    const savedSettings = localStorage.getItem('adblast_ad_settings');

    if (savedSettings) {
        return JSON.parse(savedSettings);
    }

    // Default settings
    return {
        initialDelay: 3000, // 3 seconds
        repeatInterval: 35000, // 35 seconds
        maxTabs: 20,
        adUrl: 'https://www.effectiveratecpm.com/mfq9ehgs?key=5dda470b0999d934423e0757a8bee5bd'
    };
}

// Load UI settings from localStorage
function loadUiSettings() {
    const savedSettings = localStorage.getItem('adblast_ui_settings');

    if (savedSettings) {
        return JSON.parse(savedSettings);
    }

    // Default settings
    return {
        showFloatingAd: true,
        showCountdown: true,
        showPopups: true,
        showSocialProof: true
    };
}

// Save ad settings to localStorage
function saveAdSettings(settings) {
    localStorage.setItem('adblast_ad_settings', JSON.stringify(settings));

    // Try to update live settings if we're in an iframe or have access to the parent
    applyAdSettings(settings);

    return true;
}

// Save UI settings to localStorage
function saveUiSettings(settings) {
    localStorage.setItem('adblast_ui_settings', JSON.stringify(settings));
    return true;
}

// Create a sample ad (for demo purposes)
function createSampleAd(name, type, position, status) {
    const now = new Date();

    return {
        id: Date.now(), // Use timestamp as a simple ID
        name: name || 'New Ad',
        type: type || 'url',
        position: position || 'new-tab',
        status: status || 'active',
        created: formatDate(now),
        updated: formatDate(now),
        content: type === 'url' ? 'https://www.example.com' :
            type === 'image' ? 'https://via.placeholder.com/300x250' :
                type === 'video' ? 'https://www.example.com/video.mp4' :
                    '<div>Sample HTML Ad</div>'
    };
}

// Load ads from localStorage
function loadAds() {
    const savedAds = localStorage.getItem('adblast_ads');

    if (savedAds) {
        return JSON.parse(savedAds);
    }

    // Sample ads for demo
    const sampleAds = [
        createSampleAd('Main Tab Ad', 'url', 'new-tab', 'active'),
        createSampleAd('Floating Banner', 'image', 'bottom-right', 'active'),
        createSampleAd('Popup Offer', 'html', 'center', 'inactive')
    ];

    // Save sample ads
    localStorage.setItem('adblast_ads', JSON.stringify(sampleAds));

    return sampleAds;
}

// Save ad to localStorage
function saveAd(ad) {
    const ads = loadAds();

    // Check if ad exists
    const existingAdIndex = ads.findIndex(a => a.id === ad.id);

    if (existingAdIndex >= 0) {
        // Update existing ad
        ads[existingAdIndex] = ad;
    } else {
        // Add new ad
        ad.id = Date.now(); // Use timestamp as a simple ID
        ad.created = formatDate(new Date());
        ads.push(ad);
    }

    // Update updated date
    ad.updated = formatDate(new Date());

    // Save ads
    localStorage.setItem('adblast_ads', JSON.stringify(ads));

    return ad;
}

// Delete ad from localStorage
function deleteAd(adId) {
    const ads = loadAds();

    // Filter out the ad with the given ID
    const updatedAds = ads.filter(ad => ad.id !== adId);

    // Save updated ads
    localStorage.setItem('adblast_ads', JSON.stringify(updatedAds));

    return true;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function () {
    checkAuth();

    // Add logout event listener to all logout buttons
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }
}); 