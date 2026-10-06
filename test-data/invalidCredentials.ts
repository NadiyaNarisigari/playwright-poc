import { users } from './users';

// Meets the password rules (11+ chars, upper case, number, special char) but is wrong,
// so the app shows "Incorrect username or password." instead of disabling Login.
const WRONG_PASSWORD = 'Wrong!Pass123';

export const invalidCredentials = {
  invalidEmail: {
    email: 'notarealuser12345@example.com',
    password: WRONG_PASSWORD,
  },
  invalidPassword: {
    // Real account email with the wrong password
    get email() {
      return users.qaUser.email;
    },
    password: WRONG_PASSWORD,
  },
};