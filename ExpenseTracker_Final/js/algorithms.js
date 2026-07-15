/* ==========================================================
   algorithms.js - Interactive algorithm demonstration logic
   Runs each algorithm on a small user-supplied numeric array
   so students can see live output, comparisons, and timing
   for any of the seven ADA algorithms covered by this project.
   ========================================================== */

function numSortBubble(arr) {
    const a = arr.slice();
    let comparisons = 0, swaps = 0;
    const start = performance.now();
    for (let i = 0; i < a.length - 1; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            comparisons++;
            if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; swaps++; }
        }
    }
    return { result: a, time: performance.now() - start, comparisons, swaps };
}

function numSortSelection(arr) {
    const a = arr.slice();
    let comparisons = 0, swaps = 0;
    const start = performance.now();
    for (let i = 0; i < a.length - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < a.length; j++) {
            comparisons++;
            if (a[j] < a[minIdx]) minIdx = j;
        }
        if (minIdx !== i) { [a[i], a[minIdx]] = [a[minIdx], a[i]]; swaps++; }
    }
    return { result: a, time: performance.now() - start, comparisons, swaps };
}

function numSortInsertion(arr) {
    const a = arr.slice();
    let comparisons = 0, shifts = 0;
    const start = performance.now();
    for (let i = 1; i < a.length; i++) {
        const key = a[i];
        let j = i - 1;
        while (j >= 0 && a[j] > key) {
            comparisons++;
            a[j + 1] = a[j];
            j--; shifts++;
        }
        a[j + 1] = key;
    }
    return { result: a, time: performance.now() - start, comparisons, swaps: shifts };
}

function numSortMerge(arr) {
    let comparisons = 0;
    const start = performance.now();
    function merge(l, r) {
        const res = []; let i = 0, j = 0;
        while (i < l.length && j < r.length) {
            comparisons++;
            res.push(l[i] <= r[j] ? l[i++] : r[j++]);
        }
        return res.concat(l.slice(i)).concat(r.slice(j));
    }
    function sort(a) {
        if (a.length <= 1) return a;
        const mid = Math.floor(a.length / 2);
        return merge(sort(a.slice(0, mid)), sort(a.slice(mid)));
    }
    const result = sort(arr.slice());
    return { result, time: performance.now() - start, comparisons, swaps: null };
}

function numSortQuick(arr) {
    const a = arr.slice();
    let comparisons = 0, swaps = 0;
    const start = performance.now();
    function partition(low, high) {
        const pivot = a[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            comparisons++;
            if (a[j] <= pivot) { i++; [a[i], a[j]] = [a[j], a[i]]; swaps++; }
        }
        [a[i + 1], a[high]] = [a[high], a[i + 1]]; swaps++;
        return i + 1;
    }
    function sort(low, high) {
        if (low < high) { const p = partition(low, high); sort(low, p - 1); sort(p + 1, high); }
    }
    sort(0, a.length - 1);
    return { result: a, time: performance.now() - start, comparisons, swaps };
}

function numLinearSearch(arr, target) {
    let comparisons = 0;
    const start = performance.now();
    let foundIndex = -1;
    for (let i = 0; i < arr.length; i++) {
        comparisons++;
        if (arr[i] === target) { foundIndex = i; break; }
    }
    return { foundIndex, time: performance.now() - start, comparisons };
}

function numBinarySearch(arr, target) {
    const sorted = arr.slice().sort((a, b) => a - b);
    let comparisons = 0;
    const start = performance.now();
    let low = 0, high = sorted.length - 1, foundIndex = -1;
    while (low <= high) {
        comparisons++;
        const mid = Math.floor((low + high) / 2);
        if (sorted[mid] === target) { foundIndex = mid; break; }
        else if (sorted[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return { foundIndex, sortedArray: sorted, time: performance.now() - start, comparisons };
}

const DEMO_ALGORITHMS = {
    linear: { fn: (arr, target) => numLinearSearch(arr, target), type: 'search', label: 'Linear Search', complexity: 'O(n)' },
    binary: { fn: (arr, target) => numBinarySearch(arr, target), type: 'search', label: 'Binary Search', complexity: 'O(log n)' },
    bubble: { fn: numSortBubble, type: 'sort', label: 'Bubble Sort', complexity: 'O(n\u00B2)' },
    selection: { fn: numSortSelection, type: 'sort', label: 'Selection Sort', complexity: 'O(n\u00B2)' },
    insertion: { fn: numSortInsertion, type: 'sort', label: 'Insertion Sort', complexity: 'O(n\u00B2)' },
    merge: { fn: numSortMerge, type: 'sort', label: 'Merge Sort', complexity: 'O(n log n)' },
    quick: { fn: numSortQuick, type: 'sort', label: 'Quick Sort', complexity: 'O(n log n) avg' }
};

function parseNumberInput(text) {
    return text.split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(Number)
        .filter(n => !isNaN(n));
}

function initAlgorithmDemoPage() {
    const form = document.getElementById('demoForm');
    if (!form) return;

    const targetGroup = document.getElementById('demoTargetGroup');
    const algoRadios = document.querySelectorAll('input[name="demoAlgo"]');

    function toggleTargetField() {
        const selected = document.querySelector('input[name="demoAlgo"]:checked');
        const isSearch = selected && DEMO_ALGORITHMS[selected.value].type === 'search';
        targetGroup.style.display = isSearch ? 'flex' : 'none';
    }
    algoRadios.forEach(r => r.addEventListener('change', toggleTargetField));
    toggleTargetField();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const algoKey = document.querySelector('input[name="demoAlgo"]:checked')?.value;
        if (!algoKey) { showToast('Please select an algorithm.', 'error'); return; }

        const arr = parseNumberInput(document.getElementById('demoArrayInput').value);
        if (arr.length < 2) {
            showToast('Please enter at least 2 numbers, separated by commas.', 'error');
            return;
        }

        const algo = DEMO_ALGORITHMS[algoKey];
        const resultBox = document.getElementById('demoResultBox');

        if (algo.type === 'sort') {
            const res = algo.fn(arr);
            resultBox.className = 'result-box success-box';
            resultBox.innerHTML = `
                <strong>${algo.label}</strong> (${algo.complexity})<br>
                Input: [${arr.join(', ')}]<br>
                Sorted: [${res.result.join(', ')}]<br>
                Comparisons: ${res.comparisons} &nbsp;|&nbsp;
                ${res.swaps !== null ? `Swaps/Shifts: ${res.swaps} &nbsp;|&nbsp;` : ''}
                Time: ${res.time.toFixed(4)} ms
            `;
        } else {
            const target = parseFloat(document.getElementById('demoTargetInput').value);
            if (isNaN(target)) { showToast('Please enter a number to search for.', 'error'); return; }
            const res = algo.fn(arr, target);
            const foundText = res.foundIndex === -1
                ? `${target} was not found in the array.`
                : `${target} was found at index ${res.foundIndex}.`;
            resultBox.className = res.foundIndex === -1 ? 'result-box error-box' : 'result-box success-box';
            resultBox.innerHTML = `
                <strong>${algo.label}</strong> (${algo.complexity})<br>
                ${res.sortedArray ? `Sorted Array (required for Binary Search): [${res.sortedArray.join(', ')}]<br>` : ''}
                ${foundText}<br>
                Comparisons: ${res.comparisons} &nbsp;|&nbsp; Time: ${res.time.toFixed(4)} ms
            `;
        }

        resultBox.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    requireAuth();
    initLayout('algorithm-demo.html');
    initAlgorithmDemoPage();
});
