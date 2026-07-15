/* ==========================================================
   reports.js - Monthly Summary & Category Summary page logic
   ========================================================== */

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

/** Group expenses by month (from the date field) and sum amounts. */
function computeMonthlySummary(expenses) {
    const totals = {};
    expenses.forEach(exp => {
        const d = new Date(exp.date);
        const key = isNaN(d.getTime()) ? 'Unknown' : MONTH_NAMES[d.getMonth()] + ' ' + d.getFullYear();
        totals[key] = (totals[key] || 0) + Number(exp.amount);
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

/** Group expenses by category and sum amounts. */
function computeCategorySummary(expenses) {
    const totals = {};
    expenses.forEach(exp => {
        totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount);
    });
    return Object.entries(totals).sort((a, b) => b[1] - a[1]);
}

/** Render a [label, total] list as horizontal bar rows. */
function renderSummaryBars(summaryEntries, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!summaryEntries.length) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">&#128203;</div><p>No expense data available yet.</p></div>`;
        return;
    }

    const maxValue = Math.max(...summaryEntries.map(e => e[1]));

    container.innerHTML = summaryEntries.map(([label, total]) => {
        const pct = maxValue > 0 ? (total / maxValue) * 100 : 0;
        return `
            <div class="summary-bar-row">
                <div class="summary-bar-label">${escapeHtml(label)}</div>
                <div class="summary-bar-track"><div class="summary-bar-fill" style="width:${pct}%"></div></div>
                <div class="summary-bar-value">&#8377;${total.toFixed(2)}</div>
            </div>
        `;
    }).join('');
}

function initMonthlySummaryPage() {
    const expenses = getExpenses(getCurrentUsername());
    const summary = computeMonthlySummary(expenses);
    renderSummaryBars(summary, 'monthlySummaryContainer');
}

function initCategorySummaryPage() {
    const expenses = getExpenses(getCurrentUsername());
    const summary = computeCategorySummary(expenses);
    renderSummaryBars(summary, 'categorySummaryContainer');
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    if (document.getElementById('monthlySummaryContainer')) {
        initLayout('monthly-summary.html');
        initMonthlySummaryPage();
    }
    if (document.getElementById('categorySummaryContainer')) {
        initLayout('category-summary.html');
        initCategorySummaryPage();
    }
});
