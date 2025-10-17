/**
 * UI Framework Helpers
 * - Mobile navigation toggle
 * - Active nav link highlighting
 * - Optional environment label hydration
 */

(function () {
    function toggleNav() {
        const menu = document.getElementById('primary-menu') || document.querySelector('.nav-menu');
        const btn = document.querySelector('.nav-toggle');
        if (!menu || !btn) return;
        const isOpen = menu.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
    }

    function closeNav() {
        const menu = document.getElementById('primary-menu') || document.querySelector('.nav-menu');
        const btn = document.querySelector('.nav-toggle');
        if (!menu || !btn) return;
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
    }

    function setActiveNav() {
        const path = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-menu a').forEach(a => {
            const href = a.getAttribute('href');
            if (href && href.endsWith(path)) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }

    function hydrateEnvLabel() {
        const envEl = document.getElementById('env-label');
        if (!envEl) return;
        const env = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'development' : 'production';
        envEl.textContent = env;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.querySelector('.nav-toggle');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleNav();
            });
        }

        // Close menu on link click (mobile UX)
        document.querySelectorAll('.nav-menu a').forEach(a => {
            a.addEventListener('click', () => closeNav());
        });

        setActiveNav();
        hydrateEnvLabel();
    });
})();
