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
  // Creates a customer, finds it, then deletes it again so QA stays clean.
  // If the test fails before the delete step, delete the AutoTest-Customer-... customer by hand.
  test('Administrator can add and delete a customer', async ({ page, loggedInPage }) => {
    const customer = newTestCustomer();

    await test.step('Open the Customer tab', async () => {
      await openFleetManagement(page);
      await openCustomerTab(page);
    });

    await test.step('Add a customer', async () => {
      await openAddCustomerForm(page);
      await fillCustomerForm(page, customer);
      await saveCustomer(page, customer.name);
    });

    await test.step('Find the customer', async () => {
      await selectCustomer(page, customer.name);
    });

    await test.step('Delete the customer', async () => {
      await deleteCustomer(page, customer.name, TEST_CUSTOMER_PREFIX);
    });
  });
});