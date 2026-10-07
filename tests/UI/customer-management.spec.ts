import { test } from '../../fixtures/loginFixture';
import {
  openFleetManagement,
  openCustomerTab,
  selectCustomer,
  deleteCustomer,
} from '../../pages/FleetManagementPage';
import { openAddCustomerForm, fillCustomerForm, saveCustomer } from '../../pages/AddCustomerPage';
import { newTestCustomer, TEST_CUSTOMER_PREFIX } from '../../test-data/customers';

test.describe('Customer management', () => {
  // loggedInPage is a page that has already logged in (email, password, OTP).
  // Creates a customer, finds it, then deletes it again so QA stays clean.
  // If the test fails before the delete step, delete the AutoTest-Customer-... customer manually in application.
  test('Administrator can add and delete a customer', async ({ loggedInPage }) => {
    const customer = newTestCustomer();

    await test.step('Open the Customer tab', async () => {
      await openFleetManagement(loggedInPage);
      await openCustomerTab(loggedInPage);
    });

    await test.step('Add a customer', async () => {
      await openAddCustomerForm(loggedInPage);
      await fillCustomerForm(loggedInPage, customer);
      await saveCustomer(loggedInPage, customer.name);
    });

    await test.step('Find the customer', async () => {
      await selectCustomer(loggedInPage, customer.name);
    });

    await test.step('Delete the customer', async () => {
      await deleteCustomer(loggedInPage, customer.name, TEST_CUSTOMER_PREFIX);
    });
  });
});