/* ==========================================================
   common.js
   Shared UI pieces used across every page: the sticky navbar
   (with active-link highlighting and logout), the footer,
   and toast notifications (replacing alert()).
   Depends on auth.js (getCurrentUsername, logoutUser) being
   loaded first.
   ========================================================== */

const NAV_LINKS = [
    { href: 'index.html', label: 'Dashboard' },
    { href: 'add-expense.html', label: 'Add Expense' },
    { href: 'view-expenses.html', label: 'View' },
    { href: 'update-expense.html', label: 'Update' },
    { href: 'delete-expense.html', label: 'Delete' },
    { href: 'search-name.html', label: 'Search: Name' },
    { href: 'search-category.html', label: 'Search: Category' },
    { href: 'search-id.html', label: 'Search: ID' },
    { href: 'sort.html', label: 'Sort' },
    { href: 'monthly-summary.html', label: 'Monthly Summary' },
    { href: 'category-summary.html', label: 'Category Summary' },
    { href: 'statistics.html', label: 'Statistics' },
    { href: 'algorithm-demo.html', label: 'Algorithms' }
];

/** Render the sticky navigation bar into #navbar-placeholder. */
function renderNavbar(activePage) {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    const username = getCurrentUsername();

    const linksHtml = NAV_LINKS.map(link => {
        const activeClass = (link.href === activePage) ? ' class="active"' : '';
        return `<a href="${link.href}"${activeClass}>${link.label}</a>`;
    }).join('');

    const userHtml = username
        ? `<span class="welcome-text">Welcome, <strong>${username}</strong></span>
           <a href="profile.html" class="btn btn-secondary" style="padding:8px 16px;font-size:13px;">Profile</a>
           <button class="btn btn-logout" id="logoutBtn" type="button">Logout</button>`
        : `<a href="login.html" class="btn btn-login-nav">Login</a>`;

    placeholder.innerHTML = `
        <nav class="navbar">
            <div class="navbar-brand">
                <a href="index.html">&#128176; ExpenseTracker</a>
            </div>
            <button class="hamburger" id="hamburgerBtn" type="button" aria-label="Toggle menu">&#9776;</button>
            <div class="nav-links" id="navLinks">${linksHtml}</div>
            <div class="navbar-user">${userHtml}</div>
        </nav>
    `;

    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showToast('Logging out...', 'info');
            setTimeout(logoutUser, 400);
        });
    }
}

/** Render the shared footer into #footer-placeholder. */
function renderFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (!placeholder) return;
    placeholder.innerHTML = `
        <footer class="site-footer">
            <p>&copy; 2026 ExpenseTracker &mdash; Second Year Engineering ADA Mini Project</p>
            <p class="footer-sub">Built with HTML5, CSS3 &amp; Vanilla JavaScript &mdash; No frameworks, no backend.</p>
        </footer>
    `;
}

/**
 * Show a temporary toast notification instead of alert().
 * type: 'success' | 'error' | 'info'
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger the slide-in animation on the next frame
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/**
 * Show a custom confirmation modal (replaces native confirm()).
 * onConfirm is called only if the user clicks "Confirm".
 */
function showConfirmModal(message, onConfirm) {
    let overlay = document.getElementById('confirmModalOverlay');
    if (overlay) overlay.remove();

    overlay = document.createElement('div');
    overlay.id = 'confirmModalOverlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-box">
            <div class="modal-icon">&#9888;&#65039;</div>
            <p class="modal-message">${message}</p>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="modalCancelBtn" type="button">Cancel</button>
                <button class="btn btn-danger" id="modalConfirmBtn" type="button">Confirm</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    function close() {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 200);
    }

    document.getElementById('modalCancelBtn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.getElementById('modalConfirmBtn').addEventListener('click', () => {
        close();
        onConfirm();
    });
}

/** Convenience initializer called on every page's DOMContentLoaded. */
function initLayout(activePage) {
    renderNavbar(activePage);
    renderFooter();
}

/** Escape user-entered text to prevent HTML injection when rendering. */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : str;
    return div.innerHTML;
}

/** Format an ISO date string (YYYY-MM-DD) as DD Mon YYYY. */
function formatDisplayDate(isoDate) {
    if (!isoDate) return '-';
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return isoDate;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/** Display an inline error message under a given field. */
function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(fieldId + 'Error');
    if (field) field.classList.add('input-error');
    if (errorEl) errorEl.textContent = message;
}

/** Clear all inline field errors within a form. */
function clearFieldErrors(form) {
    form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    form.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}
