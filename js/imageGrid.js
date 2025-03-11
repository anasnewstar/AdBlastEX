/**
 * AdBlast Image Grid Gallery
 * This file handles the image grid gallery functionality on the landing page.
 * It loads images from admin gallery and displays them in a grid with pagination.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Configuration
    const config = {
        imagesPerPage: 20,
        defaultPlaceholderCount: 20,
        placeholderCategories: [
            'anime', 'manga', 'animation', 'cartoon', 'illustration',
            'digital-art', 'fantasy', 'sci-fi', 'character', 'cosplay'
        ]
    };

    // State variables
    let currentPage = 1;
    let totalPages = 1;
    let allImages = [];

    // DOM elements
    const gridContainer = document.getElementById('image-grid-container');
    const paginationContainer = document.getElementById('gallery-pagination');
    const loadingSpinner = document.getElementById('grid-loading');

    // Initialize the gallery
    initializeGallery();

    /**
     * Initialize the gallery by loading images and setting up event listeners
     */
    function initializeGallery() {
        // Load images from localStorage (admin gallery)
        loadImagesFromStorage();

        // Set up event delegation for image clicks
        gridContainer.addEventListener('click', function (e) {
            const imageItem = e.target.closest('.grid-image-item');
            if (imageItem) {
                const imgSrc = imageItem.querySelector('img').src;
                showEnlargedImage(imgSrc);

                // Notify ad delivery system of gallery interaction
                if (window.adDelivery && window.adDelivery.setGalleryViewStatus) {
                    window.adDelivery.setGalleryViewStatus(true);
                }
            }
        });

        // Set up event delegation for pagination
        paginationContainer.addEventListener('click', function (e) {
            const pageNumber = e.target.closest('.page-number');
            const paginationArrow = e.target.closest('.pagination-arrow');

            if (pageNumber) {
                const page = parseInt(pageNumber.getAttribute('data-page'));
                if (page !== currentPage) {
                    goToPage(page);
                }
            } else if (paginationArrow) {
                if (paginationArrow.classList.contains('prev-page') && !paginationArrow.classList.contains('disabled')) {
                    goToPage(currentPage - 1);
                } else if (paginationArrow.classList.contains('next-page') && !paginationArrow.classList.contains('disabled')) {
                    goToPage(currentPage + 1);
                }
            }
        });
    }

    /**
     * Load images from localStorage (admin gallery)
     */
    function loadImagesFromStorage() {
        showLoading(true);

        try {
            // Try to get images from localStorage
            const storedImages = localStorage.getItem('adblast_gallery_images');

            if (storedImages) {
                allImages = JSON.parse(storedImages);

                if (allImages.length === 0) {
                    // If no images in storage, load placeholders
                    loadPlaceholderImages();
                } else {
                    // Calculate total pages and render the first page
                    totalPages = Math.ceil(allImages.length / config.imagesPerPage);
                    renderPage(1);
                }
            } else {
                // If no images in storage, load placeholders
                loadPlaceholderImages();
            }
        } catch (error) {
            console.error('Error loading gallery images:', error);
            loadPlaceholderImages();
        }
    }

    /**
     * Load placeholder images when no admin images are available
     */
    function loadPlaceholderImages() {
        allImages = [];

        // Create placeholder images using Unsplash API
        for (let i = 0; i < config.defaultPlaceholderCount; i++) {
            const category = config.placeholderCategories[Math.floor(Math.random() * config.placeholderCategories.length)];
            const width = 600 + Math.floor(Math.random() * 400);
            const height = 800 + Math.floor(Math.random() * 400);

            allImages.push({
                id: `placeholder-${i}`,
                url: `https://source.unsplash.com/${width}x${height}/?${category}`,
                name: `Placeholder Image ${i + 1}`,
                type: 'image/jpeg',
                isPlaceholder: true
            });
        }

        // Calculate total pages and render the first page
        totalPages = Math.ceil(allImages.length / config.imagesPerPage);
        renderPage(1);
    }

    /**
     * Render a specific page of images
     * @param {number} page - The page number to render
     */
    function renderPage(page) {
        showLoading(true);
        currentPage = page;

        // Calculate start and end indices for the current page
        const startIndex = (page - 1) * config.imagesPerPage;
        const endIndex = Math.min(startIndex + config.imagesPerPage, allImages.length);

        // Clear the grid container
        gridContainer.innerHTML = '';

        // Add images for the current page
        for (let i = startIndex; i < endIndex; i++) {
            const image = allImages[i];
            addImageToGrid(image, i);
        }

        // Update pagination
        updatePagination();

        // Hide loading spinner
        showLoading(false);
    }

    /**
     * Add a single image to the grid
     * @param {Object} image - The image object to add
     * @param {number} index - The index of the image
     */
    function addImageToGrid(image, index) {
        const imageItem = document.createElement('div');
        imageItem.className = 'grid-image-item';
        imageItem.setAttribute('data-index', index);

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.name || `Image ${index + 1}`;

        // Add error handling for images
        img.onerror = function () {
            // If image fails to load, replace with a placeholder
            this.src = `https://source.unsplash.com/300x400/?anime`;
            this.alt = 'Placeholder Image';
        };

        imageItem.appendChild(img);
        gridContainer.appendChild(imageItem);
    }

    /**
     * Update the pagination controls
     */
    function updatePagination() {
        paginationContainer.innerHTML = '';

        // Don't show pagination if there's only one page
        if (totalPages <= 1) {
            return;
        }

        // Add previous arrow
        const prevArrow = document.createElement('div');
        prevArrow.className = 'pagination-arrow prev-page';
        prevArrow.innerHTML = '<i class="fas fa-chevron-left"></i>';

        if (currentPage === 1) {
            prevArrow.classList.add('disabled');
        }

        paginationContainer.appendChild(prevArrow);

        // Determine which page numbers to show
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Adjust if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
            const pageNumber = document.createElement('div');
            pageNumber.className = 'page-number';
            pageNumber.textContent = i;
            pageNumber.setAttribute('data-page', i);

            if (i === currentPage) {
                pageNumber.classList.add('active');
            }

            paginationContainer.appendChild(pageNumber);
        }

        // Add next arrow
        const nextArrow = document.createElement('div');
        nextArrow.className = 'pagination-arrow next-page';
        nextArrow.innerHTML = '<i class="fas fa-chevron-right"></i>';

        if (currentPage === totalPages) {
            nextArrow.classList.add('disabled');
        }

        paginationContainer.appendChild(nextArrow);
    }

    /**
     * Navigate to a specific page
     * @param {number} page - The page number to go to
     */
    function goToPage(page) {
        if (page < 1 || page > totalPages) {
            return;
        }

        renderPage(page);

        // Scroll to the top of the gallery
        const gallerySection = document.querySelector('.image-grid-gallery');
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * Show or hide the loading spinner
     * @param {boolean} show - Whether to show or hide the spinner
     */
    function showLoading(show) {
        if (!loadingSpinner) return;

        loadingSpinner.style.display = show ? 'block' : 'none';
    }

    /**
     * Show an enlarged version of the clicked image
     * @param {string} imgSrc - The source URL of the image to enlarge
     */
    function showEnlargedImage(imgSrc) {
        // Check if container already exists
        let container = document.getElementById('enlarged-image-container');

        if (!container) {
            // Create container if it doesn't exist
            container = document.createElement('div');
            container.id = 'enlarged-image-container';
            container.className = 'enlarged-image-container';

            // Add close button
            const closeBtn = document.createElement('div');
            closeBtn.className = 'close-enlarged';
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', function () {
                container.classList.remove('active');
                setTimeout(() => {
                    container.remove();
                }, 300);
            });

            // Add image element
            const img = document.createElement('img');
            img.className = 'enlarged-image';
            img.src = imgSrc;

            // Add error handling
            img.onerror = function () {
                this.src = 'https://source.unsplash.com/800x600/?anime';
                this.alt = 'Placeholder Image';
            };

            // Append elements
            container.appendChild(closeBtn);
            container.appendChild(img);
            document.body.appendChild(container);

            // Close on click outside image
            container.addEventListener('click', function (e) {
                if (e.target === container) {
                    container.classList.remove('active');
                    setTimeout(() => {
                        container.remove();
                    }, 300);
                }
            });

            // Show container with animation
            setTimeout(() => {
                container.classList.add('active');
            }, 10);
        } else {
            // Update existing container
            const img = container.querySelector('.enlarged-image');
            img.src = imgSrc;
            container.classList.add('active');
        }
    }

    // Get images from local storage or use placeholder images
    function getImages() {
        try {
            // Try shared admin gallery first (most reliable)
            const storedSharedImages = localStorage.getItem('adblast_shared_gallery_images');
            if (storedSharedImages) {
                const parsedImages = JSON.parse(storedSharedImages);
                if (parsedImages && parsedImages.length > 0) {
                    console.log('Loaded shared admin gallery images:', parsedImages.length);
                    return parsedImages;
                }
            }

            // Try regular admin gallery as fallback
            const storedImages = localStorage.getItem('adblast_gallery_images');
            if (storedImages) {
                const parsedImages = JSON.parse(storedImages);
                if (parsedImages && parsedImages.length > 0) {
                    console.log('Loaded admin gallery images:', parsedImages.length);
                    return parsedImages;
                }
            }
        } catch (error) {
            console.error('Error loading gallery images:', error);
        }

        // If no images found or error occurred, use placeholders
        console.log('No gallery images found, using placeholders');
        return generatePlaceholderImages(20);
    }

    // Public API
    window.imageGrid = {
        refresh: loadImagesFromStorage,
        goToPage: goToPage
    };
}); 