function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

// Getters, so the variables are only required by tests that actually use them.
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