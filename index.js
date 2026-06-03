window.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Audio — Matcha Latte V2 thock sound
    // ==========================================
    const thockSound = new Audio('matcha-latte-v2.mp3');
    thockSound.volume = 0.5;

    function playThock() {
        const click = thockSound.cloneNode();
        click.play().catch(e => console.log("Audio play blocked:", e));
    }

    // ==========================================
    // 2. Keyboard Panel — Click interactions
    // ==========================================
    const keys = document.querySelectorAll('.key');

    keys.forEach(key => {
        key.addEventListener('mousedown', (e) => {
            e.preventDefault();
            playThock();
            key.classList.add('pressed');
            console.log(`[SWITCH_ACTUATED] Key: ${key.dataset.key || key.textContent.trim()}`);

            // If this key has a section shortcut, scroll to it
            const sectionId = key.dataset.section;
            if (sectionId) {
                const target = document.getElementById(sectionId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        key.addEventListener('mouseup', () => {
            key.classList.remove('pressed');
        });

        key.addEventListener('mouseleave', () => {
            key.classList.remove('pressed');
        });
    });

    // ==========================================
    // 3. Physical keyboard shortcuts (1-4)
    // ==========================================
    const shortcutMap = {
        '1': 'stack',
        '2': 'commits',
        '3': 'record',
        '4': 'contact'
    };

    document.addEventListener('keydown', (e) => {
        // Don't trigger if user is typing in an input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        const sectionId = shortcutMap[e.key];
        if (sectionId) {
            e.preventDefault();
            playThock();

            // Flash the corresponding on-screen key
            const onScreenKey = document.querySelector(`.key[data-key="${e.key}"]`);
            if (onScreenKey) {
                onScreenKey.classList.add('pressed');
                setTimeout(() => onScreenKey.classList.remove('pressed'), 150);
            }

            // Scroll to section
            const target = document.getElementById(sectionId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }

            console.log(`[SHORTCUT] Key ${e.key} → #${sectionId}`);
        }
    });

    // ==========================================
    // 4. Project rows — thock on click
    // ==========================================
    const projectRows = document.querySelectorAll('.project-row');
    projectRows.forEach(row => {
        row.addEventListener('mousedown', () => {
            playThock();
            console.log('[SWITCH_ACTUATED] Matcha Latte V2 hardware input detected.');
        });
    });

    // ==========================================
    // 5. Sticky nav — IntersectionObserver
    // ==========================================
    const stickyNav = document.getElementById('sticky-nav');
    const hero = document.getElementById('hero');

    if (hero && stickyNav) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    stickyNav.classList.remove('visible');
                } else {
                    stickyNav.classList.add('visible');
                }
            });
        }, {
            threshold: 0,
            rootMargin: '-100px 0px 0px 0px'
        });

        observer.observe(hero);
    }

    // Smooth scroll for sticky nav links
    document.querySelectorAll('.sticky-links a, .exp-link').forEach(link => {
        link.addEventListener('click', (e) => {
            playThock();
        });
    });

});