document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide-section');
    const navItems = document.querySelectorAll('.nav-item');
    const totalSlides = slides.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentSlideNum = document.getElementById('currentSlideNum');
    const totalSlideNum = document.getElementById('totalSlideNum');
    const progressFill = document.getElementById('progressFill');
    const slidesContainer = document.getElementById('slidesContainer');

    // Init UI
    totalSlideNum.textContent = totalSlides;
    updateProgress();

    // Helper functions for staggering dynamic lists in electrical, civil, mechanical sectors
    function prepareListStyles() {
        const lists = document.querySelectorAll('.styled-services-list');
        lists.forEach(list => {
            const items = list.querySelectorAll('li');
            items.forEach((item, index) => {
                item.style.setProperty('--n', index + 1);
            });
        });
    }
    prepareListStyles();

    function updateProgress() {
        const percent = ((currentSlide + 1) / totalSlides) * 100;
        progressFill.style.width = `${percent}%`;
        currentSlideNum.textContent = currentSlide + 1;
    }

    function goToSlide(index, direction = 'next') {
        if (index === currentSlide) return;
        
        const oldSlide = slides[currentSlide];
        const newSlide = slides[index];

        // Slide Transition classes
        oldSlide.classList.remove('active');
        if (direction === 'next') {
            oldSlide.classList.add('slide-out-prev');
            newSlide.classList.add('slide-in-right');
        } else {
            oldSlide.classList.add('slide-out-next');
            newSlide.classList.add('slide-in-left');
        }

        // Activate new slide after a brief moment
        newSlide.classList.add('active');

        // Cleanup transition animation classes
        setTimeout(() => {
            oldSlide.classList.remove('slide-out-prev', 'slide-out-next');
            newSlide.classList.remove('slide-in-right', 'slide-in-left');
        }, 800);

        // Update nav items active state
        navItems.forEach(item => item.classList.remove('active'));
        const activeNavItem = document.querySelector(`.nav-item[data-slide="${index}"]`);
        if (activeNavItem) activeNavItem.classList.add('active');

        currentSlide = index;
        updateProgress();
    }

    function next() {
        if (currentSlide < totalSlides - 1) {
            goToSlide(currentSlide + 1, 'next');
        } else {
            // Loop back to start
            goToSlide(0, 'next');
        }
    }

    function prev() {
        if (currentSlide > 0) {
            goToSlide(currentSlide - 1, 'prev');
        } else {
            // Loop back to end
            goToSlide(totalSlides - 1, 'prev');
        }
    }

    // Button event listeners
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    // Sidebar navigation click handler
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.getAttribute('data-slide'));
            const direction = index > currentSlide ? 'next' : 'prev';
            goToSlide(index, direction);
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') {
            e.preventDefault(); // Prevent standard page space scroll
            next();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        }
    });

    // Slide Swiping for mobile touch screens
    let startX = 0;
    let endX = 0;

    slidesContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    slidesContainer.addEventListener('touchmove', (e) => {
        endX = e.touches[0].clientX;
    }, { passive: true });

    slidesContainer.addEventListener('touchend', () => {
        const threshold = 50; // swipe threshold in px
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped Left -> go to next slide
                next();
            } else {
                // Swiped Right -> go to prev slide
                prev();
            }
        }
        startX = 0;
        endX = 0;
    });

    // Scroll wheel support
    let lastWheelTime = 0;
    const wheelCooldown = 1200; // ms between mouse-wheel transitions to prevent jumping fast

    window.addEventListener('wheel', (e) => {
        const currentTime = new Date().getTime();
        if (currentTime - lastWheelTime < wheelCooldown) return;

        if (e.deltaY > 50) {
            next();
            lastWheelTime = currentTime;
        } else if (e.deltaY < -50) {
            prev();
            lastWheelTime = currentTime;
        }
    }, { passive: true });
});
