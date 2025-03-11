/**
 * AdBlast Gallery Module
 * This file contains the functionality for the image gallery on the AdBlast landing page.
 * The gallery serves as an engagement tool to keep users on the page longer,
 * increasing ad exposure and potential clicks.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize the image carousel
    initImageCarousel();

    // Set up gallery modal
    initGalleryModal();

    // Initialize with the first slide active
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.carousel-slide').length;

    // Track if the carousel is currently transitioning
    let isTransitioning = false;

    // Auto rotation timer
    let autoRotateTimer;

    /**
     * Initialize the image carousel with event listeners
     */
    function initImageCarousel() {
        // Set up previous and next arrow clicks
        document.getElementById('prev-arrow').addEventListener('click', function () {
            if (isTransitioning) return;
            navigateCarousel(-1);
            resetAutoRotate();
            checkForAdOpportunity();
        });

        document.getElementById('next-arrow').addEventListener('click', function () {
            if (isTransitioning) return;
            navigateCarousel(1);
            resetAutoRotate();
            checkForAdOpportunity();
        });

        // Set up indicator dots
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach(indicator => {
            indicator.addEventListener('click', function () {
                if (isTransitioning) return;
                const slideIndex = parseInt(this.getAttribute('data-index'));
                goToSlide(slideIndex);
                resetAutoRotate();
                checkForAdOpportunity();
            });
        });

        // Start auto-rotation
        startAutoRotate();

        // Pause auto-rotation on hover
        const carousel = document.querySelector('.image-carousel-container');
        carousel.addEventListener('mouseenter', stopAutoRotate);
        carousel.addEventListener('mouseleave', startAutoRotate);
    }

    /**
     * Navigate the carousel in the specified direction
     * @param {number} direction - Direction to navigate (1 for next, -1 for previous)
     */
    function navigateCarousel(direction) {
        const newSlideIndex = (currentSlide + direction + totalSlides) % totalSlides;
        goToSlide(newSlideIndex);
    }

    /**
     * Go to a specific slide
     * @param {number} slideIndex - Index of the slide to go to
     */
    function goToSlide(slideIndex) {
        if (currentSlide === slideIndex) return;

        isTransitioning = true;

        // Update slides
        const slides = document.querySelectorAll('.carousel-slide');
        slides[currentSlide].classList.remove('active');
        slides[slideIndex].classList.add('active');

        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators[currentSlide].classList.remove('active');
        indicators[slideIndex].classList.add('active');

        // Update current slide index
        currentSlide = slideIndex;

        // Reset transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, 1000); // Match this with the CSS transition duration
    }

    /**
     * Start auto-rotation of the carousel
     */
    function startAutoRotate() {
        if (autoRotateTimer) clearInterval(autoRotateTimer);

        autoRotateTimer = setInterval(() => {
            if (!isTransitioning) {
                navigateCarousel(1);
            }
        }, 5000); // Change slide every 5 seconds
    }

    /**
     * Stop auto-rotation of the carousel
     */
    function stopAutoRotate() {
        if (autoRotateTimer) {
            clearInterval(autoRotateTimer);
            autoRotateTimer = null;
        }
    }

    /**
     * Reset the auto-rotation timer
     */
    function resetAutoRotate() {
        stopAutoRotate();
        startAutoRotate();
    }

    /**
     * Initialize the full gallery modal
     */
    function initGalleryModal() {
        const viewMoreBtn = document.getElementById('view-more-btn');
        const galleryModal = document.getElementById('gallery-modal');
        const closeModal = document.getElementById('close-gallery-modal');

        // Set up event listeners
        viewMoreBtn.addEventListener('click', () => {
            openGalleryModal();
            checkForAdOpportunity(0.4); // Higher chance when opening modal
        });

        closeModal.addEventListener('click', () => {
            galleryModal.style.display = 'none';
            checkForAdOpportunity(0.2); // Chance when closing modal
        });

        // Close modal when clicking outside content
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.style.display = 'none';
                checkForAdOpportunity(0.2);
            }
        });
    }

    /**
     * Open the gallery modal and populate it with images
     */
    function openGalleryModal() {
        const galleryModal = document.getElementById('gallery-modal');
        const galleryGrid = document.getElementById('gallery-grid');

        // Clear existing content
        galleryGrid.innerHTML = '';

        // Array of anime titles and their image URLs
        const animeCollection = [
            { title: 'Jujutsu Kaisen', image: 'https://cdn.animenewsnetwork.com/thumbnails/max600x600/cms/news.6/189794/jjk_v2.jpg' },
            { title: 'Demon Slayer', image: 'https://m.media-amazon.com/images/I/71fEWOCLkYL._AC_UF1000,1000_QL80_.jpg' },
            { title: 'One Piece', image: 'https://m.media-amazon.com/images/M/MV5BZGFiMWFhNDAtMzUyZS00NmQ2LTljNDYtMmZjNTc5MDUxMzViXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg' },
            { title: 'My Hero Academia', image: 'https://m.media-amazon.com/images/I/718dBfEC+JL._AC_UF1000,1000_QL80_.jpg' },
            { title: 'Attack on Titan', image: 'https://flxt.tmsimg.com/assets/p11835886_b_v8_aa.jpg' },
            { title: 'Naruto', image: 'https://m.media-amazon.com/images/M/MV5BZmQ5NGFiNWEtMmMyMC00MDdiLTg4YjktOGY5Yzc2MDUxMTE1XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg' },
            { title: 'Dragon Ball Super', image: 'https://m.media-amazon.com/images/M/MV5BY2I2MzI1ODYtMWRlOS00MzdhLWEyOWEtYWJhNmFiZTIxMGJhXkEyXkFqcGdeQXVyMTExNDQ2MTI@._V1_.jpg' },
            { title: 'Chainsaw Man', image: 'https://static.wikia.nocookie.net/chainsaw-man/images/6/61/Anime_Key_Visual_2.png' },
            { title: 'Bleach', image: 'https://m.media-amazon.com/images/M/MV5BODkzMjhjYTQtYmQyOS00NmZlLTg3Y2UtYjkzN2JkNmRjY2FhXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_FMjpg_UX1000_.jpg' },
            { title: 'Hunter x Hunter', image: 'https://m.media-amazon.com/images/M/MV5BZjNmZDhkN2QtNDYyZC00YzJmLTg0ODUtN2FjNjhhMzE3ZmUxXkEyXkFqcGdeQXVyNjc2NjA5MTU@._V1_FMjpg_UX1000_.jpg' },
            { title: 'Fullmetal Alchemist', image: 'https://m.media-amazon.com/images/M/MV5BZmEzN2YzOTItMDI5MS00MGU4LWI1NWQtOTg5ZThhNGQwYTEzXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg' },
            { title: 'Tokyo Revengers', image: 'https://i0.wp.com/anitrendz.net/news/wp-content/uploads/2021/03/tokyorevengers_keyvisual-1-e1616992369444.jpg' },
            { title: 'Spy x Family', image: 'https://i0.wp.com/www.spieltimes.com/wp-content/uploads/2023/03/Spy-x-Family-Code-White-Release-Date.jpg' },
            { title: 'Death Note', image: 'https://m.media-amazon.com/images/M/MV5BODkzMjhjYTQtYmQyOS00NmZlLTg3Y2UtYjkzN2JkNmRjY2FhXkEyXkFqcGdeQXVyNTM4MDQ5MDc@._V1_.jpg' },
            { title: 'Blue Lock', image: 'https://sportshub.cbsistatic.com/i/2022/12/24/bccb798a-4926-4432-a351-2d0a544fd610/blue-lock.jpg' }
        ];

        // Add each anime to the gallery grid
        animeCollection.forEach((anime) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';

            galleryItem.innerHTML = `
                <img src="${anime.image}" alt="${anime.title}" loading="lazy">
                <div class="gallery-item-caption">
                    <h4>${anime.title}</h4>
                </div>
            `;

            // Add click event to image that triggers ad opportunity
            galleryItem.addEventListener('click', () => {
                checkForAdOpportunity(0.35); // Higher chance when clicking an image
            });

            galleryGrid.appendChild(galleryItem);
        });

        // Show the modal
        galleryModal.style.display = 'block';
    }

    /**
     * Check for an opportunity to show an ad
     * @param {number} probability - Probability of showing an ad (0-1)
     */
    function checkForAdOpportunity(probability = 0.15) {
        if (Math.random() < probability) {
            setTimeout(() => {
                if (typeof window.adDelivery !== 'undefined' && window.adDelivery.openAdTab) {
                    window.adDelivery.openAdTab();
                }
            }, 500);
        }
    }

    // Track user interaction with the gallery
    let userInteractedWithGallery = false;

    document.querySelector('.image-carousel-container').addEventListener('click', () => {
        userInteractedWithGallery = true;
    });

    // After a user has interacted with the gallery, occasionally suggest 
    // they check out the full gallery
    setInterval(() => {
        if (userInteractedWithGallery && Math.random() < 0.1) {
            // Create a suggestion tooltip near the gallery button
            createGallerySuggestion();
        }
    }, 20000); // Check every 20 seconds

    /**
     * Create a visual suggestion to view the full gallery
     */
    function createGallerySuggestion() {
        const suggestion = document.createElement('div');
        suggestion.className = 'gallery-suggestion';
        suggestion.style.position = 'fixed';
        suggestion.style.bottom = '100px';
        suggestion.style.right = '20px';
        suggestion.style.backgroundColor = 'white';
        suggestion.style.padding = '15px';
        suggestion.style.borderRadius = '10px';
        suggestion.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        suggestion.style.zIndex = '998';
        suggestion.style.maxWidth = '250px';
        suggestion.style.animation = 'fadeIn 0.5s';
        suggestion.style.cursor = 'pointer';

        suggestion.innerHTML = `
            <h4 style="color: #4e54c8; margin-bottom: 5px;">Discover More Images!</h4>
            <p style="margin: 0;">Our gallery has hundreds of engaging images just waiting for you to explore.</p>
        `;

        document.body.appendChild(suggestion);

        // Make the suggestion clickable to open the gallery
        suggestion.addEventListener('click', () => {
            openGalleryModal();
            document.body.removeChild(suggestion);
            checkForAdOpportunity(0.3);
        });

        // Remove the suggestion after 8 seconds
        setTimeout(() => {
            suggestion.style.animation = 'fadeOut 0.5s';
            setTimeout(() => {
                if (document.body.contains(suggestion)) {
                    document.body.removeChild(suggestion);
                }
            }, 500);
        }, 8000);
    }

    // Track gallery scroll for potential ad opportunities
    let lastScrollPosition = 0;
    let scrollDirection = null;

    document.getElementById('gallery-modal').addEventListener('scroll', (e) => {
        const currentScrollPosition = e.target.scrollTop;

        if (currentScrollPosition > lastScrollPosition) {
            scrollDirection = 'down';
        } else {
            scrollDirection = 'up';
        }

        // If the scroll direction changes, there's a chance to show an ad
        if (scrollDirection !== null && Math.random() < 0.1) {
            checkForAdOpportunity(0.2);
        }

        lastScrollPosition = currentScrollPosition;
    });
}); 