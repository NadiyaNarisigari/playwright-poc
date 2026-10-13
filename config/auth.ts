import path from 'path';

// Saved login session (cookies + local storage), written by tests/auth.setup.ts.
// Contains a live token: gitignored, never commit or share it.
export const AUTH_FILE = path.resolve(__dirname, '../playwright/.auth/user.json');