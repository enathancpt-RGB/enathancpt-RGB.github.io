document.addEventListener('DOMContentLoaded', () => {

    // ──────────────────────────────
    // Accordion (Moving Guide)
    // ──────────────────────────────
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const item = trigger.closest('.accordion-item');
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // ──────────────────────────────
    // Gallery Filter Tabs
    // ──────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            galleryItems.forEach(item => {
                if (filter === 'all' || item.dataset.cat === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ──────────────────────────────
    // Gallery Lightbox
    // ──────────────────────────────
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxCap   = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img     = item.querySelector('img');
            const caption = item.querySelector('.gallery-overlay span');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxCap.textContent = caption ? caption.textContent : '';
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

    // ──────────────────────────────
    // Navbar scroll effect

    // ──────────────────────────────
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // ──────────────────────────────
    // Mobile Menu Toggle
    // ──────────────────────────────
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    let menuOpen = false;

    mobileMenuBtn.addEventListener('click', () => {
        menuOpen = !menuOpen;
        mobileMenu.classList.toggle('active', menuOpen);
        mobileMenuBtn.innerHTML = menuOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            menuOpen = false;
        });
    });

    // ──────────────────────────────
    // Scroll Reveal
    // ──────────────────────────────
    const revealObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal, .scroll-reveal-right')
        .forEach(el => revealObserver.observe(el));

    // ──────────────────────────────
    // Smooth anchor scrolling
    // ──────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // ──────────────────────────────
    // Testimonials Carousel
    // ──────────────────────────────
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');

    if (!track) return;

    const cards = track.querySelectorAll('.testimonial-card');
    const cardCount = cards.length;
    const CARD_WIDTH = 360 + 24; // min-width + gap
    const VISIBLE = Math.ceil(track.clientWidth / CARD_WIDTH) || 3;
    const totalDots = cardCount - VISIBLE + 1;

    // Build dots
    let dots = [];
    for (let i = 0; i < Math.max(1, totalDots); i++) {
        const dot = document.createElement('button');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to review ${i + 1}`);
        dot.addEventListener('click', () => scrollToIndex(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
    }

    function setActiveDot(index) {
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function scrollToIndex(index) {
        track.scrollTo({ left: index * CARD_WIDTH, behavior: 'smooth' });
        setActiveDot(index);
    }

    // Sync dots on manual scroll
    track.addEventListener('scroll', () => {
        const index = Math.round(track.scrollLeft / CARD_WIDTH);
        setActiveDot(Math.min(index, dots.length - 1));
    }, { passive: true });

    // Auto-play
    let autoPlay;
    let currentIndex = 0;

    function startAutoPlay() {
        autoPlay = setInterval(() => {
            currentIndex = (currentIndex + 1) % Math.max(1, totalDots);
            scrollToIndex(currentIndex);
        }, 4000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlay);
    }

    startAutoPlay();
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);
    track.addEventListener('touchstart', stopAutoPlay, { passive: true });

    // Drag to scroll
    let isDown = false;
    let startX, startScrollLeft;

    track.addEventListener('mousedown', e => {
        isDown = true;
        track.classList.add('grabbing');
        startX = e.pageX - track.offsetLeft;
        startScrollLeft = track.scrollLeft;
        stopAutoPlay();
    });

    track.addEventListener('mouseleave', () => {
        isDown = false;
        track.classList.remove('grabbing');
    });

    track.addEventListener('mouseup', () => {
        isDown = false;
        track.classList.remove('grabbing');
    });

    track.addEventListener('mousemove', e => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = startScrollLeft - walk;
    });
});

