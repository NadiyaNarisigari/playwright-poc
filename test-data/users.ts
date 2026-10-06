import { requiredEnv } from '../utils/env';

// Login for the QA test account, read from .env.
// Getters, so a value is only required by tests that actually use it.
export const users = {
  qaUser: {
    get email() {
      return requiredEnv('QA_EMAIL');
    },
    get password() {
      return requiredEnv('QA_PASSWORD');
    },
  },
};