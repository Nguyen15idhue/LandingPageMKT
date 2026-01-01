document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.main-header');
    const mobileNav = document.getElementById('mobile-nav');
    const toggleBtn = document.getElementById('mobile-toggle');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;

    // 1. XỬ LÝ HEADER KHI CUỘN TRANG
    function handleScroll() {
        if (mobileNav && mobileNav.classList.contains('active')) {
            header.style.background = '#ffffff';
            return;
        }
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
            header.style.height = '75px';
        } else {
            header.style.background = 'transparent';
            header.style.boxShadow = 'none';
            header.style.height = '85px';
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // 2. XỬ LÝ MENU MOBILE
    if (toggleBtn && mobileNav) {
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('active');
            if (isActive) {
                toggleIcon.classList.replace('fa-bars', 'fa-xmark');
                header.style.background = '#ffffff';
            } else {
                toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                handleScroll();
            }
        });
    }

    // 3. SMOOTH SCROLL
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                if (mobileNav && mobileNav.classList.contains('active')) {
                    mobileNav.classList.remove('active');
                    if (toggleIcon) toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                    handleScroll();
                }
                const offset = 80;
                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. KHỞI TẠO SWIPER
    if (typeof Swiper !== 'undefined' && document.querySelector('.rs10-app-swiper')) {
        new Swiper('.rs10-app-swiper', {
            loop: true,
            speed: 800,
            autoplay: { delay: 4000, disableOnInteraction: false },
            lazy: { loadPrevNext: true },
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
            },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }

    // 5. FIX LỖI ẨN/HIỆN: SCROLL REVEAL (INTERSECTION OBSERVER)
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Thêm class active để CSS thực hiện việc hiện ra
                entry.target.classList.add('active');
                // Đã hiện rồi thì không cần theo dõi nữa (giúp phần tử ở lại mãi mãi)
                revealObserver.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    // Áp dụng class reveal-element cho các thành phần
    const items = document.querySelectorAll('section, .problem-card, .feature-item, .app-card');
    items.forEach(el => {
        el.classList.add('reveal-element');
        revealObserver.observe(el);
    });
});