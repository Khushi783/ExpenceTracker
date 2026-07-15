/* ==========================================================
   deleteExpense.js - Delete Expense page logic
   Provides a dedicated ID-based delete flow (separate from
   the quick-delete icon on the View Expenses table).
   ========================================================== */

function initDeleteExpensePage() {
    const username = getCurrentUsername();
    const form = document.getElementById('deleteLookupForm');
    const resultBox = document.getElementById('deleteResultBox');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    let pendingId = null;

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById('deleteId').value, 10);
        const expenses = getExpenses(username);
        const expense = expenses.find(exp => exp.id === id);

        if (!expense) {
            resultBox.className = 'result-box error-box';
            resultBox.innerHTML = `No expense found with ID <strong>${id}</strong>.`;
            resultBox.style.display = 'block';
            confirmBtn.style.display = 'none';
            pendingId = null;
            return;
        }

        pendingId = id;
        resultBox.className = 'result-box';
        resultBox.innerHTML = `
            <strong>Found:</strong> ${escapeHtml(expense.name)}
            (${escapeHtml(expense.category)}) &mdash; &#8377;${Number(expense.amount).toFixed(2)}
            on ${formatDisplayDate(expense.date)}
        `;
        resultBox.style.display = 'block';
        confirmBtn.style.display = 'inline-flex';
    });

    confirmBtn.addEventListener('click', () => {
        if (pendingId === null) return;
        showConfirmModal('Are you sure you want to permanently delete this expense?', () => {
            let expenses = getExpenses(username);
            expenses = expenses.filter(exp => exp.id !== pendingId);
            saveExpenses(username, expenses);

            resultBox.className = 'result-box success-box';
            resultBox.innerHTML = `Expense ID <strong>${pendingId}</strong> was deleted successfully.`;
            confirmBtn.style.display = 'none';
            showToast('Expense deleted.', 'success');
            pendingId = null;
            form.reset();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initLayout('delete-expense.html');
    initDeleteExpensePage();
});
