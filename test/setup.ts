import { vi } from 'vitest';

vi.mock('#app', () => ({
    useNuxtApp: vi.fn(() => ({
        $auth: { loggedIn: false, user: null },
    })),
}));
