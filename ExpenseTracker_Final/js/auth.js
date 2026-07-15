/* ==========================================================
   auth.js
   Handles user registration, login, logout, and route
   protection (requireAuth). Users are stored in localStorage
   via storage.js helpers. Depends on storage.js being loaded
   first, and common.js for showToast().
   ========================================================== */

/** Basic email format check. */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Register a new user.
 * Returns { success: boolean, message: string }
 */
function registerUser(username, email, password, confirmPassword) {
    username = username.trim();
    email = email.trim();

    if (!username || !email || !password || !confirmPassword) {
        return { success: false, message: 'All fields are required.' };
    }
    if (username.length < 3) {
        return { success: false, message: 'Username must be at least 3 characters.' };
    }
    if (!isValidEmail(email)) {
        return { success: false, message: 'Please enter a valid email address.' };
    }
    if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters.' };
    }
    if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match.' };
    }

    const users = getUsers();

    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, message: 'Username already exists.' };
    }
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, message: 'Email already registered.' };
    }

    const newUser = {
        id: users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1,
        username,
        email,
        password,
        dateJoined: new Date().toISOString(),
        profileImage: ''
    };
    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Registration successful! Please log in.' };
}

/**
 * Attempt to log a user in.
 * remember: if true, session persists across browser restarts (Remember Me).
 * Returns { success: boolean, message: string }
 */
function loginUser(username, password, remember) {
    username = username.trim();

    if (!username || !password) {
        return { success: false, message: 'Username and password are required.' };
    }

    const users = getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user || user.password !== password) {
        return { success: false, message: 'Invalid username or password.' };
    }

    setSession(user.username, !!remember);
    return { success: true, message: 'Login successful!' };
}

/** Log the current user out and redirect to the login page. */
function logoutUser() {
    clearSession();
    window.location.href = 'login.html';
}

/** Return the currently logged-in username, or null if none. */
function getCurrentUsername() {
    const session = getSession();
    return session ? session.username : null;
}

/** Return the full user object for the currently logged-in user, or null. */
function getCurrentUser() {
    const username = getCurrentUsername();
    if (!username) return null;
    const users = getUsers();
    return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

/**
 * Guard for protected pages: redirects to login.html
 * if no user is currently logged in.
 */
function requireAuth() {
    if (!getCurrentUsername()) {
        window.location.href = 'login.html';
    }
}
