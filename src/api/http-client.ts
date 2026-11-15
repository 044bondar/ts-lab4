const BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions extends RequestInit {
    _retry?: boolean;
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem('accessToken');

    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (
        response.status === 401 &&
        !options._retry &&
        !path.includes('/auth/login') &&
        !path.includes('/auth/refresh')
    ) {
        options._retry = true;
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
            try {
                const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken, expiresInMins: 30 }),
                });

                if (refreshRes.ok) {
                    const tokens = await refreshRes.json();
                    localStorage.setItem('accessToken', tokens.accessToken);
                    localStorage.setItem('refreshToken', tokens.refreshToken);

                    headers.set('Authorization', `Bearer ${tokens.accessToken}`);
                    const retryResponse = await fetch(`${BASE_URL}${path}`, { ...options, headers });
                    if (!retryResponse.ok) throw new Error(`HTTP ${retryResponse.status}`);
                    return retryResponse.json() as Promise<T>;
                }
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/vue-lottery-app/login';
            }
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
}