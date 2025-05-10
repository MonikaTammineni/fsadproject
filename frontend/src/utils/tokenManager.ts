export const decodeJWT = (token: string): { exp: number } | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload;
    } catch {
        return null;
    }
};

let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const setupAutoLogout = (
    token: string,
    onExpire: () => void
) => {
    const payload = decodeJWT(token);
    if (!payload || !payload.exp) return;

    const currentTime = Math.floor(Date.now() / 1000);
    const secondsUntilExpiry = payload.exp - currentTime;

    if (secondsUntilExpiry <= 0) {
        onExpire();
        return;
    }

    console.log(`⏳ Token will expire in ${secondsUntilExpiry} seconds`);

    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(() => {
        console.warn('🔒 Token expired. Logging out.');
        onExpire();
    }, secondsUntilExpiry * 1000);
};

export const clearAutoLogout = () => {
    if (logoutTimer) {
        clearTimeout(logoutTimer);
        logoutTimer = null;
    }
};