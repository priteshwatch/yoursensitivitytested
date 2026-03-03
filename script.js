/* ============================================
   YOUR SENSITIVITY TESTED — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // SOLD OUT — "Cry About It" button gag
    // =============================================
    const soldOutBtn = document.getElementById('soldOutBtn');
    if (soldOutBtn) {
        const cryMessages = [
            'Still Sold Out',
            'We Said No',
            'Stop It',
            'Seriously?',
            'Ask Nicely… Nah Still No',
            'You Had Your Chance',
            'Not Happening',
            'Try Craigslist',
            'Read the Room',
            'Fine, One Ticket… JK',
            'OK We Feel Bad… Not Really',
            'Beg Harder',
        ];
        let cryIndex = 0;
        soldOutBtn.addEventListener('click', () => {
            cryIndex = (cryIndex + 1) % cryMessages.length;
            soldOutBtn.textContent = cryMessages[cryIndex];
            soldOutBtn.classList.add('sold-out-shake');
            setTimeout(() => soldOutBtn.classList.remove('sold-out-shake'), 500);
        });
    }

    // --- Cursor Glow ---
    const cursorGlow = document.getElementById('cursorGlow');
    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
            cursorGlow.classList.add('active');
        });
    }

    // --- Navigation Scroll ---
    const nav = document.getElementById('nav');
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile Menu ---
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const animateElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay) || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(el => observer.observe(el));

    // --- Video Modal ---
    const videoModal = document.getElementById('videoModal');
    const videoIframe = document.getElementById('videoIframe');
    const videoModalBackdrop = document.getElementById('videoModalBackdrop');
    const videoModalClose = document.getElementById('videoModalClose');

    function openVideo(youtubeId) {
        videoIframe.src = 'https://www.youtube.com/embed/' + youtubeId + '?autoplay=1&rel=0';
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeVideo() {
        videoModal.classList.remove('active');
        document.body.style.overflow = '';
        // Clear src after transition to stop playback
        setTimeout(() => { videoIframe.src = ''; }, 300);
    }

    document.querySelectorAll('[data-youtube]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openVideo(link.dataset.youtube);
        });
    });

    videoModalBackdrop.addEventListener('click', closeVideo);
    videoModalClose.addEventListener('click', closeVideo);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideo();
        }
    });

    // --- Calendar & Email Signup Modal (Multi-step) ---
    const emailModal = document.getElementById('emailModal');
    const emailModalBackdrop = document.getElementById('emailModalBackdrop');
    const emailModalClose = document.getElementById('emailModalClose');
    const calendarBtn = document.getElementById('calendarBtn');
    const step1 = document.getElementById('modalStep1');
    const step2 = document.getElementById('modalStep2');
    const icsDownloadBtn = document.getElementById('icsDownloadBtn');
    const showFormBtn = document.getElementById('showFormBtn');
    const skipFormBtn = document.getElementById('skipFormBtn');

    function showStep(step) {
        [step1, step2].forEach(s => s.classList.add('hidden'));
        step.classList.remove('hidden');
    }

    function openEmailModal() {
        showStep(step1);
        emailModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeEmailModal() {
        emailModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Open modal on "Mark Your Calendar" click
    if (calendarBtn) {
        calendarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openEmailModal();
        });
    }

    // Step 1 → Step 2: After ICS download
    if (icsDownloadBtn) {
        icsDownloadBtn.addEventListener('click', () => {
            setTimeout(() => showStep(step2), 800);
        });
    }

    // "Keep Me Informed" opens Tally in new tab and closes modal
    if (showFormBtn) {
        showFormBtn.addEventListener('click', () => closeEmailModal());
    }

    // Skip: close modal
    if (skipFormBtn) {
        skipFormBtn.addEventListener('click', closeEmailModal);
    }

    if (emailModalBackdrop) emailModalBackdrop.addEventListener('click', closeEmailModal);
    if (emailModalClose) emailModalClose.addEventListener('click', closeEmailModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && emailModal && emailModal.classList.contains('active')) {
            closeEmailModal();
        }
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            if (anchor.dataset.youtube) return; // skip video links
            const href = anchor.getAttribute('href');
            if (href.length <= 1) return; // skip bare "#" links
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});
