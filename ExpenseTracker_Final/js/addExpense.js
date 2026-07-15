/* ==========================================================
   addExpense.js - Add Expense page logic
   ========================================================== */

function initAddExpensePage() {
    const form = document.getElementById('addExpenseForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearFieldErrors(form);

        const name = document.getElementById('expenseName').value.trim();
        const category = document.getElementById('expenseCategory').value;
        const amount = document.getElementById('expenseAmount').value.trim();
        const date = document.getElementById('expenseDate').value;
        const description = document.getElementById('expenseDescription').value.trim();

        let valid = true;

        if (!name) { setFieldError('expenseName', 'Expense name is required.'); valid = false; }
        if (!category) { setFieldError('expenseCategory', 'Please select a category.'); valid = false; }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum) || amountNum <= 0) {
            setFieldError('expenseAmount', 'Enter a valid amount greater than 0.');
            valid = false;
        }
        if (!date) { setFieldError('expenseDate', 'Please select a date.'); valid = false; }
        if (date && new Date(date) > new Date()) {
            setFieldError('expenseDate', 'Date cannot be in the future.');
            valid = false;
        }

        if (!valid) {
            showToast('Please fix the highlighted errors.', 'error');
            return;
        }

        const username = getCurrentUsername();
        const expenses = getExpenses(username);
        const newExpense = {
            id: generateExpenseId(expenses),
            name,
            category,
            amount: amountNum,
            date,
            description
        };
        expenses.push(newExpense);
        saveExpenses(username, expenses);

        showToast(`Expense "${name}" added successfully (ID: ${newExpense.id}).`, 'success');
        form.reset();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initLayout('add-expense.html');
    initAddExpensePage();
});
