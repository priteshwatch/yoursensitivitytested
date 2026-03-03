/* ============================================
   YOUR SENSITIVITY TESTED — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // =============================================
    // TICKETS LEFT — Change this number to update the urgency counter
    // Set to 0 or false to hide the urgency bar entirely
    // =============================================
    const TICKETS_LEFT = 45;
    const TICKETS_UPDATED = 'Mar 2, 2026 5:30 PM EST';

    const ticketsEl = document.getElementById('ticketsLeft');
    const urgencyEl = document.getElementById('tourUrgency');
    const updatedEl = document.getElementById('ticketsUpdated');
    const urgencyText = document.getElementById('urgencyText');
    let urgencyTriggered = false;

    if (ticketsEl && urgencyEl) {
        if (!TICKETS_LEFT) {
            urgencyEl.style.display = 'none';
        } else {
            ticketsEl.textContent = TICKETS_LEFT;
            if (updatedEl) updatedEl.textContent = TICKETS_UPDATED;

            // Ticket countdown gag — drops by 1 every second when section is visible
            const DROP_COUNT = 8;
            const tourSection = document.getElementById('tour');
            const soldToast = document.getElementById('soldToast');

            const soldMessages = [
                '🔥 1 more just sold',
                '👀 another one gone',
                '💨 poof — sold',
                '🎟️ someone\'s smarter than you',
                '😬 that was close',
                '🏃 they didn\'t hesitate',
                '👋 bye bye seat',
                '🪑 and another one\'s gone',
            ];

            function showSoldToast(index) {
                if (!soldToast) return;
                soldToast.textContent = soldMessages[index % soldMessages.length];
                soldToast.classList.add('show');
                setTimeout(() => soldToast.classList.remove('show'), 700);
            }

            function startCountdownGag() {
                if (urgencyTriggered) return;
                urgencyTriggered = true;

                let current = TICKETS_LEFT;
                let dropped = 0;

                const interval = setInterval(() => {
                    current--;
                    ticketsEl.textContent = current;
                    ticketsEl.classList.add('ticket-flash');
                    showSoldToast(dropped);
                    setTimeout(() => ticketsEl.classList.remove('ticket-flash'), 400);
                    dropped++;

                    if (dropped >= DROP_COUNT) {
                        clearInterval(interval);
                        // Punchline after a beat
                        setTimeout(() => {
                            if (soldToast) soldToast.style.display = 'none';
                            urgencyText.innerHTML = '<strong>' + TICKETS_LEFT + '</strong> seats left — Just fucking with you. It\'s still ' + TICKETS_LEFT + '.';
                        }, 1500);
                    }
                }, 1000);
            }

            // Use IntersectionObserver on the tour section itself
            const tourGagObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !urgencyTriggered) {
                        tourGagObserver.disconnect();
                        // Wait 1 sec after section is visible, then start dropping
                        setTimeout(startCountdownGag, 1000);
                    }
                });
            }, { threshold: 0.2 });

            if (tourSection) tourGagObserver.observe(tourSection);
        }
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
