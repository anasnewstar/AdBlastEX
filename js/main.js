document.addEventListener('DOMContentLoaded', function () {
    // Countdown Timer
    const countdownElement = document.getElementById('countdown');
    let time = 300; // 5 minutes in seconds

    const countdownInterval = setInterval(function () {
        time--;

        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (time <= 0) {
            clearInterval(countdownInterval);
            countdownElement.textContent = "00:00";

            // Show popup when countdown reaches zero
            showPopup();
        }
    }, 1000);

    // CTA Button
    const ctaButton = document.querySelector('.cta-button');
    ctaButton.addEventListener('click', function () {
        showPopup();
    });

    // Floating Ad
    const floatingAd = document.getElementById('floating-ad');
    const closeFloatingAd = document.getElementById('close-floating-ad');

    // Add some animation to the floating ad
    setInterval(function () {
        floatingAd.style.transform = 'translateY(-5px)';
        setTimeout(function () {
            floatingAd.style.transform = 'translateY(0)';
        }, 500);
    }, 3000);

    floatingAd.addEventListener('click', function (e) {
        if (e.target !== closeFloatingAd) {
            window.adDelivery.openAdTab();
        }
    });

    closeFloatingAd.addEventListener('click', function (e) {
        e.stopPropagation();
        floatingAd.style.display = 'none';

        // Show it again after 30 seconds
        setTimeout(function () {
            floatingAd.style.display = 'flex';
        }, 30000);
    });

    // Popup
    const popup = document.getElementById('interactive-popup');
    const closePopup = document.getElementById('close-popup');
    const popupCta = document.querySelector('.popup-cta');

    function showPopup() {
        popup.style.display = 'flex';
    }

    closePopup.addEventListener('click', function () {
        popup.style.display = 'none';
    });

    popupCta.addEventListener('click', function () {
        window.adDelivery.openAdTab();
        popup.style.display = 'none';
    });

    // Show popup based on user behavior
    let scrolled = false;

    window.addEventListener('scroll', function () {
        if (!scrolled && window.scrollY > 300) {
            scrolled = true;
            setTimeout(function () {
                showPopup();
            }, 1000);
        }
    });

    // Add social proof notification
    function createSocialProofNotification() {
        const notification = document.createElement('div');
        notification.className = 'social-proof';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '20px';
        notification.style.backgroundColor = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '10px';
        notification.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        notification.style.zIndex = '998';
        notification.style.maxWidth = '250px';
        notification.style.animation = 'fadeIn 0.5s';

        // Add different types of messages for variety
        const messageTypes = [
            `<p><strong>${Math.floor(Math.random() * 20) + 5} people</strong> clicked this ad in the last hour!</p>`,
            `<p><strong>${Math.floor(Math.random() * 300) + 100} visitors</strong> won prizes today!</p>`,
            `<p><strong>New high score!</strong> Someone just earned ${Math.floor(Math.random() * 1000) + 500} points playing our games</p>`
        ];

        // Select a random message type
        const randomMessage = messageTypes[Math.floor(Math.random() * messageTypes.length)];
        notification.innerHTML = randomMessage;

        document.body.appendChild(notification);

        setTimeout(function () {
            notification.style.animation = 'fadeOut 0.5s';
            setTimeout(function () {
                document.body.removeChild(notification);
            }, 500);
        }, 5000);
    }

    // Create a social proof notification every 45 seconds
    setInterval(createSocialProofNotification, 45000);

    // Create animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(style);

    // Game section enhancements
    const gameCards = document.querySelectorAll('.game-card');

    // Add hover effects to game cards
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            // Random chance to show an ad when hovering over games
            if (Math.random() < 0.1) {
                setTimeout(() => {
                    if (typeof window.adDelivery !== 'undefined' && window.adDelivery.openAdTab) {
                        window.adDelivery.openAdTab();
                    }
                }, 2000);
            }
        });
    });

    // Show a "Popular Game!" badge on one random game
    const randomGameIndex = Math.floor(Math.random() * gameCards.length);
    const popularGame = gameCards[randomGameIndex];

    const popularBadge = document.createElement('div');
    popularBadge.className = 'popular-badge';
    popularBadge.style.position = 'absolute';
    popularBadge.style.top = '10px';
    popularBadge.style.right = '10px';
    popularBadge.style.backgroundColor = '#ff6b6b';
    popularBadge.style.color = 'white';
    popularBadge.style.padding = '5px 10px';
    popularBadge.style.borderRadius = '20px';
    popularBadge.style.fontSize = '0.8rem';
    popularBadge.style.fontWeight = 'bold';
    popularBadge.textContent = 'Popular Game!';

    popularGame.style.position = 'relative';
    popularGame.appendChild(popularBadge);
}); 