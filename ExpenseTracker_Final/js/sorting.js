/* ==========================================================
   sorting.js - Sorting algorithms and sort.html page logic
   All five algorithms accept a field ('name','amount','date',
   'id') and sort ascending, returning { sorted, time, swaps }.
   ========================================================== */

/** Compare two expense values for a given field. */
function compareByField(a, b, field) {
    if (field === 'amount' || field === 'id') {
        return a[field] - b[field];
    }
    if (field === 'date') {
        return new Date(a.date) - new Date(b.date);
    }
    // name / category / string fields
    return String(a[field]).toLowerCase().localeCompare(String(b[field]).toLowerCase());
}

/** BUBBLE SORT - O(n^2) worst/avg, O(n) best. Space O(1). */
function bubbleSort(expenses, field) {
    const arr = expenses.slice();
    const start = performance.now();
    let swaps = 0;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            if (compareByField(arr[j], arr[j + 1], field) > 0) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                swaps++;
                swapped = true;
            }
        }
        if (!swapped) break;
    }

    return { sorted: arr, time: performance.now() - start, swaps };
}

/** SELECTION SORT - O(n^2) all cases. Space O(1). */
function selectionSort(expenses, field) {
    const arr = expenses.slice();
    const start = performance.now();
    let swaps = 0;
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if (compareByField(arr[j], arr[minIndex], field) < 0) minIndex = j;
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            swaps++;
        }
    }

    return { sorted: arr, time: performance.now() - start, swaps };
}

/** INSERTION SORT - O(n^2) worst/avg, O(n) best. Space O(1). */
function insertionSort(expenses, field) {
    const arr = expenses.slice();
    const start = performance.now();
    let shifts = 0;
    const n = arr.length;

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && compareByField(arr[j], key, field) > 0) {
            arr[j + 1] = arr[j];
            j--;
            shifts++;
        }
        arr[j + 1] = key;
    }

    return { sorted: arr, time: performance.now() - start, swaps: shifts };
}

/** MERGE SORT - O(n log n) all cases. Space O(n). */
function mergeSort(expenses, field) {
    const start = performance.now();

    function merge(left, right) {
        const result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (compareByField(left[i], right[j], field) <= 0) result.push(left[i++]);
            else result.push(right[j++]);
        }
        return result.concat(left.slice(i)).concat(right.slice(j));
    }

    function sort(arr) {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        return merge(sort(arr.slice(0, mid)), sort(arr.slice(mid)));
    }

    const sorted = sort(expenses.slice());
    return { sorted, time: performance.now() - start, swaps: null };
}

/** QUICK SORT - O(n log n) avg, O(n^2) worst. Space O(log n). */
function quickSort(expenses, field) {
    const arr = expenses.slice();
    const start = performance.now();
    let swaps = 0;

    function partition(low, high) {
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (compareByField(arr[j], pivot, field) <= 0) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                swaps++;
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        swaps++;
        return i + 1;
    }

    function sort(low, high) {
        if (low < high) {
            const p = partition(low, high);
            sort(low, p - 1);
            sort(p + 1, high);
        }
    }

    sort(0, arr.length - 1);
    return { sorted: arr, time: performance.now() - start, swaps };
}

const SORT_ALGORITHMS = {
    bubble: { fn: bubbleSort, label: 'Bubble Sort', complexity: 'O(n\u00B2)' },
    selection: { fn: selectionSort, label: 'Selection Sort', complexity: 'O(n\u00B2)' },
    insertion: { fn: insertionSort, label: 'Insertion Sort', complexity: 'O(n\u00B2)' },
    merge: { fn: mergeSort, label: 'Merge Sort', complexity: 'O(n log n)' },
    quick: { fn: quickSort, label: 'Quick Sort', complexity: 'O(n log n) avg' }
};

function initSortPage() {
    const form = document.getElementById('sortForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const algoKey = document.querySelector('input[name="sortAlgo"]:checked')?.value;
        const field = document.querySelector('input[name="sortField"]:checked')?.value;

        if (!algoKey || !field) {
            showToast('Please choose both an algorithm and a field.', 'error');
            return;
        }

        const expenses = getExpenses(getCurrentUsername());
        if (!expenses.length) {
            showToast('No expenses to sort yet. Add some first!', 'error');
            return;
        }

        const algo = SORT_ALGORITHMS[algoKey];
        const result = algo.fn(expenses, field);

        const statsEl = document.getElementById('sortStats');
        if (statsEl) {
            statsEl.innerHTML = `
                <strong>${algo.label}</strong> sorted by <strong>${field}</strong> in
                <strong>${result.time.toFixed(4)} ms</strong>
                ${result.swaps !== null ? `with <strong>${result.swaps}</strong> swap/shift operation(s)` : ''}.
                Theoretical time complexity: <strong>${algo.complexity}</strong>.
            `;
        }

        renderExpenseTable(result.sorted, 'sortResultTableBody');
        document.getElementById('sortResultsSection').style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initLayout('sort.html');
    initSortPage();
});
