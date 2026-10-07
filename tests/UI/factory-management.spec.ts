import { test } from '../../fixtures/loginFixture';
import {
  openFleetManagement,
  selectFactory,
  deleteFactory,
  verifyFactoryDeleted,
} from '../../pages/FleetManagementPage';
import { openAddFactoryForm, fillFactoryForm, saveFactory } from '../../pages/AddFactoryPage';
import { newFactoryDetails, FACTORY_NAME_PREFIX } from '../../test-data/factories';

test.describe('Factory management', () => {
  // Creates a factory, finds it, then deletes it again so QA stays clean.
  // If the test fails before the delete step, delete the Automation_Test_Factory_... factory by hand.
  test('Administrator can add and delete a factory', async ({ page, loggedInPage }) => {
    const factory = newFactoryDetails();

    await test.step('Open Fleet Management', async () => {
      await openFleetManagement(page);
    });

    await test.step('Add a factory', async () => {
      await openAddFactoryForm(page);
      await fillFactoryForm(page, factory);
      await saveFactory(page);
    });

    await test.step('Find the factory', async () => {
      await selectFactory(page, factory.name);
    });

    await test.step('Delete the factory', async () => {
      await deleteFactory(page, factory.name, FACTORY_NAME_PREFIX);
    });

    await test.step('Check it is gone', async () => {
      await verifyFactoryDeleted(page, factory.name);
    });
  });
});