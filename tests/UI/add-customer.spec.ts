import { test, expect } from '../../fixtures/loginFixture';
import { FleetManagementPage } from '../../pages/FleetManagementPage';
import { AddCustomerPage } from '../../pages/AddCustomerPage';
import { newTestCustomer, TEST_CUSTOMER_PREFIX } from '../../test-data/customers';

// Creates a customer, finds it, then deletes it again so QA stays clean.
// If the test fails before the delete step, delete the AutoTest-Customer-... customer by hand.
test('Administrator can add and delete a customer', async ({ page, loggedInPage }) => {
  const fleet = new FleetManagementPage(page);
  const addCustomer = new AddCustomerPage(page);
  const customer = newTestCustomer();

  await fleet.openFromSettingsMenu();
  await fleet.customerTab.click();

  // Add
  await addCustomer.openDialogButton.click();
  await expect(addCustomer.modalTitle).toBeVisible();
  await addCustomer.fillCustomerForm(customer);
  await expect(addCustomer.addButton).toBeEnabled();
  await addCustomer.clickAdd();
  await expect(addCustomer.modalTitle).toBeHidden();
  await expect(addCustomer.createdMessage(customer.name)).toBeVisible();

  // Find
  await fleet.refreshCustomerList();
  await fleet.selectCustomer(customer.name);

  // Delete
  await fleet.deleteSelectedCustomer(customer.name, TEST_CUSTOMER_PREFIX);
});