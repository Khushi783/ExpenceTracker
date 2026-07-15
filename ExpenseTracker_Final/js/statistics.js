/* ==========================================================
   statistics.js - Core statistics computation
   Used by both index.html (dashboard cards) and
   statistics.html (full stats page).
   ========================================================== */

/** Compute total, average, max, min, and category extremes for a set of expenses. */
function computeStats(expenses) {
    if (!expenses.length) {
        return {
            total: 0, average: 0, max: 0, min: 0, count: 0,
            highestCategory: '-', lowestCategory: '-'
        };
    }

    const amounts = expenses.map(e => Number(e.amount));
    const total = amounts.reduce((sum, a) => sum + a, 0);
    const average = total / expenses.length;
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);

    const categoryTotals = computeCategorySummary(expenses);
    const highestCategory = categoryTotals.length ? categoryTotals[0][0] : '-';
    const lowestCategory = categoryTotals.length ? categoryTotals[categoryTotals.length - 1][0] : '-';

    return { total, average, max, min, count: expenses.length, highestCategory, lowestCategory };
}

/** Populate the dashboard's stat cards (index.html). */
function renderDashboardStats() {
    const expenses = getExpenses(getCurrentUsername());
    const stats = computeStats(expenses);

    setText('statTotal', `\u20B9${stats.total.toFixed(2)}`);
    setText('statAverage', `\u20B9${stats.average.toFixed(2)}`);
    setText('statMax', `\u20B9${stats.max.toFixed(2)}`);
    setText('statMin', `\u20B9${stats.min.toFixed(2)}`);
    setText('statCount', stats.count);
    setText('statHighestCategory', stats.highestCategory);
}

/** Populate the full statistics.html page. */
function renderFullStatistics() {
    const expenses = getExpenses(getCurrentUsername());
    const stats = computeStats(expenses);

    setText('fullStatTotal', `\u20B9${stats.total.toFixed(2)}`);
    setText('fullStatAverage', `\u20B9${stats.average.toFixed(2)}`);
    setText('fullStatMax', `\u20B9${stats.max.toFixed(2)}`);
    setText('fullStatMin', `\u20B9${stats.min.toFixed(2)}`);
    setText('fullStatCount', stats.count);
    setText('fullStatHighestCategory', stats.highestCategory);
    setText('fullStatLowestCategory', stats.lowestCategory);

    renderSummaryBars(computeCategorySummary(expenses), 'fullStatCategoryBreakdown');
    renderSummaryBars(computeMonthlySummary(expenses), 'fullStatMonthlyBreakdown');
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    if (document.getElementById('statTotal')) {
        initLayout('index.html');
        renderDashboardStats();
    }
    if (document.getElementById('fullStatTotal')) {
        initLayout('statistics.html');
        renderFullStatistics();
    }
});
