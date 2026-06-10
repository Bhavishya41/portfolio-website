window.addEventListener('DOMContentLoaded', () => {

    const thockSound = new Audio('matcha-latte-v2.mp3');
    thockSound.volume = 0.5;

    function playThock() {
        const click = thockSound.cloneNode();
        click.play().catch(e => console.log("Audio play blocked:", e));
    }

    // Mapping physical keyboard 'code' (e.g., 'Digit1') to index.html data-key attributes
    const shortcutMap = {
        'Digit1': 'stack',
        'Digit2': 'commits',
        'Digit3': 'record',
        'Digit4': 'contact'
    };

    let ctrlLeftTimeout = null;

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.repeat) return;

        // If AltRight keydown is detected, cancel any pending ControlLeft highlight
        // (Windows simulates ControlLeft followed immediately by AltRight when pressing AltGr)
        if (e.code === 'AltRight') {
            if (ctrlLeftTimeout) {
                clearTimeout(ctrlLeftTimeout);
                ctrlLeftTimeout = null;
            }
        }

        // Match element by data-key attribute (e.g., 'KeyA', 'Minus', 'BracketLeft')
        const el = document.querySelector(`.key[data-key="${e.code}"]`);

        if (el) {
            if (e.code === 'ControlLeft') {
                // Defer highlighting ControlLeft to check if it's AltGr
                if (ctrlLeftTimeout) clearTimeout(ctrlLeftTimeout);
                ctrlLeftTimeout = setTimeout(() => {
                    playThock();
                    el.classList.add('pressed');

                    // Handle Navigation Shortcuts
                    if (shortcutMap[e.code]) {
                        const target = document.getElementById(shortcutMap[e.code]);
                        if (target) target.scrollIntoView({ behavior: 'smooth' });
                    }
                    ctrlLeftTimeout = null;
                }, 30);
            } else {
                playThock();
                el.classList.add('pressed');

                // Handle Navigation Shortcuts
                if (shortcutMap[e.code]) {
                    const target = document.getElementById(shortcutMap[e.code]);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.code === 'ControlLeft') {
            if (ctrlLeftTimeout) {
                clearTimeout(ctrlLeftTimeout);
                ctrlLeftTimeout = null;
            }
        }
        const el = document.querySelector(`.key[data-key="${e.code}"]`);
        if (el) el.classList.remove('pressed');
    });

    // Clear all pressed states when window loses focus (e.g., Win key opens start menu, Alt+Tab, etc.)
    window.addEventListener('blur', () => {
        document.querySelectorAll('.key.pressed').forEach(el => {
            el.classList.remove('pressed');
        });
        if (ctrlLeftTimeout) {
            clearTimeout(ctrlLeftTimeout);
            ctrlLeftTimeout = null;
        }
    });

    // Mouse listeners (Keep existing)
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.addEventListener('mousedown', (e) => {
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

    // ... (Keep existing IntersectionObserver and Sticky Nav logic)
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