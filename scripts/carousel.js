// carousel.js

document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentIndex = 0;
    const slideInterval = 3000; // 5 seconds

    // Create navigation dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.dataset.index = index;
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Function to switch slides
    function switchSlide(newIndex) {
        slides[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = newIndex;

        slides[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    }

    // Auto-rotate functionality
    function autoRotate() {
        const nextIndex = (currentIndex + 1) % slides.length;
        switchSlide(nextIndex);
    }

    let autoRotateInterval = setInterval(autoRotate, slideInterval);

    // Add click event to dots for manual navigation
    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            clearInterval(autoRotateInterval); // Pause auto-rotation
            const newIndex = parseInt(e.target.dataset.index);
            switchSlide(newIndex);

            // Restart auto-rotation
            autoRotateInterval = setInterval(autoRotate, slideInterval);
        });
    });

    // Pause rotation on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoRotateInterval));
    carousel.addEventListener('mouseleave', () => autoRotateInterval = setInterval(autoRotate, slideInterval));
});
