document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('.main-header');
    const mobileNav = document.getElementById('mobile-nav');
    const toggleBtn = document.getElementById('mobile-toggle');
    const toggleIcon = toggleBtn ? toggleBtn.querySelector('i') : null;
    const form = document.getElementById('google-form');


    // ==========================================
    // 1. XỬ LÝ HEADER KHI CUỘN TRANG
    // ==========================================
    function handleScroll() {
        if (mobileNav && mobileNav.classList.contains('active')) {
            header.style.background = '#ffffff';
            header.style.height = '85px';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
            return;
        }

        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.08)';
            header.style.height = '75px';
            header.style.borderBottom = '1px solid rgba(0,0,0,0.05)';
        } else {
            header.style.background = 'transparent';
            header.style.boxShadow = 'none';
            header.style.height = '85px';
            header.style.borderBottom = '1px solid rgba(0,0,0,0)';
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();


    // ==========================================
    // 2. XỬ LÝ MENU MOBILE (HAMBURGER)
    // ==========================================
    if (toggleBtn && mobileNav) {
        toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isActive = mobileNav.classList.toggle('active');
            
            if (isActive) {
                if (toggleIcon) toggleIcon.classList.replace('fa-bars', 'fa-xmark');
                header.style.background = '#ffffff';
            } else {
                if (toggleIcon) toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                handleScroll();
            }
        });
    }

    document.addEventListener('click', function (e) {
        if (mobileNav && mobileNav.classList.contains('active')) {
            if (!header.contains(e.target)) {
                mobileNav.classList.remove('active');
                if (toggleIcon) toggleIcon.classList.replace('fa-xmark', 'fa-bars');
                handleScroll();
            }
        }
    });


    // ==========================================
    // 3. HIỆU ỨNG SMOOTH SCROLL
    // ==========================================
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

                const headerHeight = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ==========================================
    // 4. KHỞI TẠO SWIPER (ỨNG DỤNG - 4 CỘT)
    // ==========================================
    if (typeof Swiper !== 'undefined' && document.querySelector('.rs10-app-swiper')) {
        new Swiper('.rs10-app-swiper', {
            loop: true,
            speed: 800,
            autoplay: { delay: 4000, disableOnInteraction: false },
            autoHeight: false, 
            watchSlidesProgress: true,
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 }
            },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
        });
    }

    // ==========================================
    // 4.2 KHỞI TẠO SWIPER (DỊCH VỤ - 3 CỘT)
    // ==========================================
    if (typeof Swiper !== 'undefined' && document.querySelector('.service-swiper')) {
        new Swiper('.service-swiper', {
            speed: 800,
            autoHeight: false,
            watchSlidesProgress: true,
            slidesPerView: 1,
            spaceBetween: 20,
            breakpoints: {
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { 
                    slidesPerView: 3, 
                    spaceBetween: 30,
                    allowTouchMove: false // Tắt vuốt trên desktop vì đã hiện đủ 3 cột
                }
            },
            pagination: { el: '.service-pagination', clickable: true },
        });
    }


    // ==========================================
    // 5. HỆ THỐNG LAZY LOAD & SCROLL REVEAL
    // ==========================================
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                const lazyImages = entry.target.querySelectorAll('img[loading="lazy"]');
                lazyImages.forEach(img => { img.style.opacity = '1'; });
                revealObserver.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    // Cập nhật danh sách phần tử cần Reveal (Thêm .service-card)
    const elementsToReveal = document.querySelectorAll(
        '.reveal-element, section, .problem-card, .feature-item, .app-card, .video-container, .service-card'
    );
    
    elementsToReveal.forEach(el => {
        if (!el.classList.contains('reveal-element')) {
            el.classList.add('reveal-element');
        }
        revealObserver.observe(el);
    });

     // ==========================================
    // 7. XỬ LÝ GOOGLE FORM & CHIA SẺ (CODE MỚI ĐÂY)
    // ==========================================
    const googleForm = document.getElementById('google-form');
    const currentUrl = window.location.href;

    // Phone validation helpers
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');

    function normalizePhoneDigits(input) {
        if (!input) return '';
        let digits = input.replace(/\D/g, '');
        if (digits.startsWith('84')) digits = '0' + digits.slice(2);
        return digits;
    }

    function isValidVNPhone(input) {
        const digits = normalizePhoneDigits(input);
        return /^0(3|5|7|8|9)\d{8}$/.test(digits);
    }

    if (googleForm) {
        // Tự động điền URL và tạo QR Code
        const siteUrlInput = document.getElementById('site-url');
        const qrContainer = document.getElementById('qrcode');
        
        if (siteUrlInput) siteUrlInput.value = currentUrl;
        if (qrContainer) {
            const qrImg = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;
            qrContainer.innerHTML = `<img src="${qrImg}" alt="QR Code">`;
        }

        // Xử lý gửi Form sang Google Backend
        if (phoneInput) {
            phoneInput.addEventListener('input', function () {
                if (isValidVNPhone(this.value)) {
                    phoneError.style.display = 'none';
                    this.style.borderColor = '';
                } else {
                    phoneError.style.display = 'none';
                }
            });
        }

        googleForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = document.getElementById('submit-btn');
            const msg = document.getElementById('form-msg');

            // Validate phone before sending
            if (phoneInput) {
                const phoneVal = phoneInput.value || '';
                if (!isValidVNPhone(phoneVal)) {
                    if (phoneError) {
                        phoneError.style.display = 'block';
                        phoneError.innerText = 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số (ví dụ: 09xxxxxxxx).';
                    }
                    phoneInput.style.borderColor = '#dc2626';
                    phoneInput.focus();
                    return;
                } else {
                    if (phoneError) {
                        phoneError.style.display = 'none';
                        phoneError.innerText = '';
                    }
                    phoneInput.style.borderColor = '';
                }
            }

            btn.innerText = "ĐANG GỬI...";
            btn.disabled = true;

            // --- THAY LINK formResponse CỦA BẠN VÀO ĐÂY ---
            const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSf84czfooXPkCSekSY6PIG9FuQ_4BVelys5qBbIWiTudID28Q/formResponse";
            
            const formData = new FormData();
            // --- THAY CÁC entry.XXXXXX BẰNG ID THỰC TẾ CỦA FORM BẠN ---
            formData.append('entry.983497313', document.getElementById('nhucau').value);
            formData.append('entry.1062507316', document.getElementById('name').value);
            formData.append('entry.1438312212', document.getElementById('phone').value);
            formData.append('entry.1827864515', document.getElementById('source').value);
            formData.append('entry.1525628736', document.getElementById('note').value);

            fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            }).then(() => {
                msg.style.display = "block";
                googleForm.reset();
                btn.innerText = "GỬI THÀNH CÔNG!";
                btn.style.background = "#059669";
            }).catch(error => {
                alert("Có lỗi kỹ thuật, vui lòng thử lại sau!");
                btn.disabled = false;
                btn.innerText = "GỬI LẠI";
            });
        });
    }

    // Hàm Copy Link (Gắn vào cửa sổ window để HTML onclick gọi được)
    window.copySiteLink = function() {
        const copyText = document.getElementById("site-url");
        if (copyText) {
            copyText.select();
            copyText.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(copyText.value);
            alert("Đã copy link Landing Page Geotek!");
        }
    };
});



// ==========================================
// 6. LOGIC YOUTUBE API
// ==========================================
var player;
function onYouTubeIframeAPIReady() {
    if (document.getElementById('player')) {
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            videoId: 'BhiQhPRvkZY', 
            playerVars: {
                'autoplay': 1,
                'mute': 1,
                'controls': 0,
                'loop': 1,
                'playlist': 'BhiQhPRvkZY', 
                'rel': 0,
                'showinfo': 0,
                'modestbranding': 1,
                'disablekb': 1
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

function onPlayerReady(event) {
    const muteBtn = document.getElementById('mute-toggle');
    if (muteBtn) {
        const icon = muteBtn.querySelector('i');
        muteBtn.addEventListener('click', function() {
            if (player.isMuted()) {
                player.unMute();
                icon.classList.replace('fa-volume-xmark', 'fa-volume-high');
                muteBtn.style.background = "var(--primary)";
            } else {
                player.mute();
                icon.classList.replace('fa-volume-high', 'fa-volume-xmark');
                muteBtn.style.background = "rgba(22, 163, 74, 0.9)";
            }
        });
    }
}
