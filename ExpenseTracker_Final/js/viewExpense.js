/* ==========================================================
   viewExpense.js - View Expenses page logic
   ========================================================== */

function renderExpenseTable(expenses, tbodyId = 'expenseTableBody') {
    const tbody = document.getElementById(tbodyId);
    const wrapper = document.getElementById('tableWrapper');
    const emptyState = document.getElementById('emptyState');
    const countEl = document.getElementById('tableCount');

    if (!tbody) return;

    if (!expenses.length) {
        if (wrapper) wrapper.style.display = 'none';
        if (emptyState) emptyState.style.display = 'block';
        if (countEl) countEl.textContent = '0 records';
        return;
    }

    if (wrapper) wrapper.style.display = 'block';
    if (emptyState) emptyState.style.display = 'none';
    if (countEl) countEl.textContent = `${expenses.length} record${expenses.length !== 1 ? 's' : ''}`;

    tbody.innerHTML = expenses.map(exp => `
        <tr data-id="${exp.id}">
            <td>#${exp.id}</td>
            <td>${escapeHtml(exp.name)}</td>
            <td><span class="badge">${escapeHtml(exp.category)}</span></td>
            <td class="amount-cell">&#8377;${Number(exp.amount).toFixed(2)}</td>
            <td>${formatDisplayDate(exp.date)}</td>
            <td>${escapeHtml(exp.description || '-')}</td>
            <td>
                <div class="table-actions">
                    <a class="icon-btn edit-btn" href="update-expense.html?id=${exp.id}" title="Update">&#9998;</a>
                    <button class="icon-btn delete-btn" data-delete-id="${exp.id}" title="Delete">&#128465;</button>
                </div>
            </td>
        </tr>
    `).join('');

    tbody.querySelectorAll('[data-delete-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-delete-id'), 10);
            showConfirmModal('Delete this expense? This cannot be undone.', () => {
                const username = getCurrentUsername();
                let expenses = getExpenses(username);
                expenses = expenses.filter(e => e.id !== id);
                saveExpenses(username, expenses);
                showToast('Expense deleted.', 'success');
                renderExpenseTable(expenses);
            });
        });
    });
}

function initViewExpensesPage() {
    const username = getCurrentUsername();
    const expenses = getExpenses(username);
    renderExpenseTable(expenses);
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initLayout('view-expenses.html');
    initViewExpensesPage();
});
