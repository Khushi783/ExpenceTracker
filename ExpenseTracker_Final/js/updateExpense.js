/* ==========================================================
   updateExpense.js - Update Expense page logic
   Supports two modes:
   1. Direct link with ?id=N (from the View table's edit icon)
      -> loads that expense straight into the form.
   2. No id in URL -> shows a small "find by ID" lookup first.
   ========================================================== */

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function loadExpenseIntoForm(expense) {
    document.getElementById('updateId').value = expense.id;
    document.getElementById('expenseName').value = expense.name;
    document.getElementById('expenseCategory').value = expense.category;
    document.getElementById('expenseAmount').value = expense.amount;
    document.getElementById('expenseDate').value = expense.date;
    document.getElementById('expenseDescription').value = expense.description || '';

    document.getElementById('lookupSection').style.display = 'none';
    document.getElementById('updateFormSection').style.display = 'block';
}

function initUpdateExpensePage() {
    const username = getCurrentUsername();
    const lookupForm = document.getElementById('lookupForm');
    const updateForm = document.getElementById('updateExpenseForm');
    const cancelBtn = document.getElementById('cancelUpdateBtn');

    const idFromUrl = getQueryParam('id');
    if (idFromUrl) {
        const expenses = getExpenses(username);
        const expense = expenses.find(e => e.id === parseInt(idFromUrl, 10));
        if (expense) {
            loadExpenseIntoForm(expense);
        } else {
            showToast(`No expense found with ID ${idFromUrl}.`, 'error');
        }
    }

    if (lookupForm) {
        lookupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(document.getElementById('lookupId').value, 10);
            const expenses = getExpenses(username);
            const expense = expenses.find(e => e.id === id);
            if (!expense) {
                showToast(`No expense found with ID ${id}.`, 'error');
                return;
            }
            loadExpenseIntoForm(expense);
        });
    }

    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearFieldErrors(updateForm);

            const id = parseInt(document.getElementById('updateId').value, 10);
            const name = document.getElementById('expenseName').value.trim();
            const category = document.getElementById('expenseCategory').value;
            const amount = parseFloat(document.getElementById('expenseAmount').value);
            const date = document.getElementById('expenseDate').value;
            const description = document.getElementById('expenseDescription').value.trim();

            let valid = true;
            if (!name) { setFieldError('expenseName', 'Expense name is required.'); valid = false; }
            if (!category) { setFieldError('expenseCategory', 'Please select a category.'); valid = false; }
            if (isNaN(amount) || amount <= 0) { setFieldError('expenseAmount', 'Enter a valid amount greater than 0.'); valid = false; }
            if (!date) { setFieldError('expenseDate', 'Please select a date.'); valid = false; }

            if (!valid) {
                showToast('Please fix the highlighted errors.', 'error');
                return;
            }

            const expenses = getExpenses(username);
            const index = expenses.findIndex(e => e.id === id);
            if (index === -1) {
                showToast('This expense no longer exists.', 'error');
                return;
            }

            expenses[index] = { id, name, category, amount, date, description };
            saveExpenses(username, expenses);
            showToast('Expense updated successfully.', 'success');
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('updateFormSection').style.display = 'none';
            document.getElementById('lookupSection').style.display = 'block';
            document.getElementById('lookupForm').reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initLayout('update-expense.html');
    initUpdateExpensePage();
});
