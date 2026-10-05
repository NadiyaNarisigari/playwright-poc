import { users } from './users';

// The app's password policy needs 11+ characters, an upper-case letter, a number and a
// special character. A password that breaks the policy keeps the Login button disabled,
// so the "Incorrect username or password." message would never appear.
const WRONG_PASSWORD = 'Wrong!Pass123';

export const invalidCredentials = {
  invalidEmail: {
    email: 'notarealuser12345@example.com',
    password: WRONG_PASSWORD,
  },
  invalidPassword: {
    get email() {
      return users.qaUser.email; // a real account, paired with the wrong password
    },
    password: WRONG_PASSWORD,
  },
};