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
    // 2. Keyboard Mapping Logic
    // ==========================================
    const keyMap = {
        'Escape': 'ESC',
        'Backspace': 'BKSP',
        'Enter': 'ENTER',
        'CapsLock': 'CAPS',
        'Shift': 'SHIFT',
        'Control': 'CTRL',
        'Alt': 'ALT',
        'Tab': 'TAB',
        ' ': 'SPACE'
    };

    const shortcutMap = {
        '1': 'experience',
        '2': 'stack',
        '3': 'commits',
        '4': 'record',
        '5': 'contact'
    };

    // Helper: Flash and scroll
    function triggerKey(keyIdentifier, isShortcut = false) {
        // Find by data-key attribute
        const el = document.querySelector(`.key[data-key="${keyIdentifier}"]`);
        if (el) {
            el.classList.add('pressed');
            playThock();

            // If it's a shortcut key, trigger navigation
            if (isShortcut) {
                const sectionId = el.dataset.section;
                const target = document.getElementById(sectionId);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    // ==========================================
    // 3. Physical Input Listeners
    // ==========================================
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Normalize key string
        let key = keyMap[e.key] || e.key.toUpperCase();

        // Trigger visual effect
        triggerKey(key, shortcutMap.hasOwnProperty(e.key));
    });

    document.addEventListener('keyup', (e) => {
        let key = keyMap[e.key] || e.key.toUpperCase();
        const el = document.querySelector(`.key[data-key="${key}"]`);
        if (el) el.classList.remove('pressed');
    });

    // ==========================================
    // 4. Mouse Input Listeners
    // ==========================================
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('mousedown', (e) => {
            e.preventDefault();
            playThock();
            key.classList.add('pressed');

            const sectionId = key.dataset.section;
            if (sectionId) {
                const target = document.getElementById(sectionId);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }
        });

        key.addEventListener('mouseup', () => key.classList.remove('pressed'));
        key.addEventListener('mouseleave', () => key.classList.remove('pressed'));
    });

    // ==========================================
    // 5. Project Rows & Nav
    // ==========================================
    const projectRows = document.querySelectorAll('.project-row');
    projectRows.forEach(row => {
        row.addEventListener('mousedown', playThock);
    });

    const stickyNav = document.getElementById('sticky-nav');
    const hero = document.getElementById('hero');

    if (hero && stickyNav) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                entry.isIntersecting ? stickyNav.classList.remove('visible') : stickyNav.classList.add('visible');
            });
        }, { threshold: 0, rootMargin: '-100px 0px 0px 0px' });
        observer.observe(hero);
    }
});