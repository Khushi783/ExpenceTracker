/* ==========================================================
   storage.js
   Centralized localStorage helper functions.
   Handles reading/writing users, session, and per-user
   expense data. No frameworks, pure vanilla JS.
   ========================================================== */

const STORAGE_KEYS = {
    USERS: 'et_users',
    SESSION: 'et_session',
    EXPENSES_PREFIX: 'et_expenses_'
};

/** Return the array of all registered users. */
function getUsers() {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
}

/** Persist the full users array. */
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/** Return the current logged-in session object, or null. Checks both persistent (Remember Me) and per-tab session storage. */
function getSession() {
    const local = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(STORAGE_KEYS.SESSION);
    return session ? JSON.parse(session) : null;
}

/** Save a new session for the given username. If remember=true, persists across browser restarts. */
function setSession(username, remember) {
    const payload = JSON.stringify({
        username: username,
        loginTime: new Date().toISOString()
    });
    if (remember) {
        localStorage.setItem(STORAGE_KEYS.SESSION, payload);
    } else {
        sessionStorage.setItem(STORAGE_KEYS.SESSION, payload);
    }
}

/** Clear the active session (logout) from both storages. */
function clearSession() {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    sessionStorage.removeItem(STORAGE_KEYS.SESSION);
}

/** Get all expenses belonging to a specific user. */
function getExpenses(username) {
    const data = localStorage.getItem(STORAGE_KEYS.EXPENSES_PREFIX + username);
    return data ? JSON.parse(data) : [];
}

/** Save the full expenses array for a specific user. */
function saveExpenses(username, expenses) {
    localStorage.setItem(STORAGE_KEYS.EXPENSES_PREFIX + username, JSON.stringify(expenses));
}

/** Generate the next unique expense ID for a user's expense list. */
function generateExpenseId(expenses) {
    if (!expenses.length) return 1;
    const maxId = expenses.reduce((max, e) => (e.id > max ? e.id : max), 0);
    return maxId + 1;
}
