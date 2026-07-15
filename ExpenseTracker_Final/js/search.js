/* ==========================================================
   search.js - Search algorithms and page logic
   Implements:
     - Linear Search  -> search-name.html, search-category.html
     - Binary Search   -> search-id.html (sorts by ID first)
   ========================================================== */

/**
 * LINEAR SEARCH
 * Scans every record from the start, checking each one until
 * a match is found. O(n) time, O(1) extra space.
 * Returns { matches: [...], time: <ms>, comparisons: <n> }
 */
function linearSearch(expenses, field, query) {
    const start = performance.now();
    const target = query.trim().toLowerCase();
    const matches = [];
    let comparisons = 0;

    for (let i = 0; i < expenses.length; i++) {
        comparisons++;
        const value = String(expenses[i][field]).toLowerCase();
        if (value === target || value.includes(target)) {
            matches.push(expenses[i]);
        }
    }

    const time = performance.now() - start;
    return { matches, time, comparisons };
}

/**
 * BINARY SEARCH (by ID)
 * Pre-condition: the array must be sorted by ID (done here
 * with a simple copy + sort). Repeatedly halves the search
 * interval. O(log n) time.
 * Returns { match: object|null, time: <ms>, comparisons: <n> }
 */
function binarySearchById(expenses, id) {
    const start = performance.now();
    const sorted = expenses.slice().sort((a, b) => a.id - b.id);

    let low = 0;
    let high = sorted.length - 1;
    let comparisons = 0;
    let match = null;

    while (low <= high) {
        comparisons++;
        const mid = Math.floor((low + high) / 2);
        if (sorted[mid].id === id) {
            match = sorted[mid];
            break;
        } else if (sorted[mid].id < id) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const time = performance.now() - start;
    return { match, time, comparisons };
}

/** Render a list of matching expenses into a result table. */
function renderSearchResults(matches, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!matches.length) {
        container.innerHTML = `<div class="result-box error-box">No matching expenses found.</div>`;
        return;
    }

    const rows = matches.map(exp => `
        <tr>
            <td>#${exp.id}</td>
            <td>${escapeHtml(exp.name)}</td>
            <td><span class="badge">${escapeHtml(exp.category)}</span></td>
            <td class="amount-cell">&#8377;${Number(exp.amount).toFixed(2)}</td>
            <td>${formatDisplayDate(exp.date)}</td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="table-wrapper mt-24">
            <table class="expense-table">
                <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Amount</th><th>Date</th></tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

/** Wire up search-name.html and search-category.html (Linear Search). */
function initLinearSearchPage(field, formId, inputId, containerId, statsId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = document.getElementById(inputId).value.trim();
        if (!query) {
            showToast('Please enter a search value.', 'error');
            return;
        }

        const expenses = getExpenses(getCurrentUsername());
        const result = linearSearch(expenses, field, query);

        renderSearchResults(result.matches, containerId);

        const statsEl = document.getElementById(statsId);
        if (statsEl) {
            statsEl.textContent = `Linear Search: ${result.comparisons} comparison(s), ${result.time.toFixed(4)} ms, ${result.matches.length} match(es) found.`;
        }
    });
}

/** Wire up search-id.html (Binary Search). */
function initBinarySearchPage() {
    const form = document.getElementById('searchIdForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('searchIdInput').value, 10);
        if (isNaN(id)) {
            showToast('Please enter a valid numeric ID.', 'error');
            return;
        }

        const expenses = getExpenses(getCurrentUsername());
        const result = binarySearchById(expenses, id);

        renderSearchResults(result.match ? [result.match] : [], 'searchResultsContainer');

        const statsEl = document.getElementById('searchStats');
        if (statsEl) {
            statsEl.textContent = `Binary Search: ${result.comparisons} comparison(s), ${result.time.toFixed(4)} ms.`;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();

    if (document.getElementById('searchNameForm')) {
        initLayout('search-name.html');
        initLinearSearchPage('name', 'searchNameForm', 'searchNameInput', 'searchResultsContainer', 'searchStats');
    }
    if (document.getElementById('searchCategoryForm')) {
        initLayout('search-category.html');
        initLinearSearchPage('category', 'searchCategoryForm', 'searchCategoryInput', 'searchResultsContainer', 'searchStats');
    }
    if (document.getElementById('searchIdForm')) {
        initLayout('search-id.html');
        initBinarySearchPage();
    }
});
