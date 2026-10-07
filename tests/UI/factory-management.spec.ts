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
  // loggedInPage is a page that has already logged in (email, password, OTP).
  // Creates a factory, finds it, then deletes it again so QA stays clean.
  // If the test fails before the delete step, delete the Automation_Test_Factory_... factory by hand.
  test('Administrator can add and delete a factory', async ({ loggedInPage }) => {
    const factory = newFactoryDetails();

    await test.step('Open Fleet Management', async () => {
      await openFleetManagement(loggedInPage);
    });

    await test.step('Add a factory', async () => {
      await openAddFactoryForm(loggedInPage);
      await fillFactoryForm(loggedInPage, factory);
      await saveFactory(loggedInPage);
    });

    await test.step('Find the factory', async () => {
      await selectFactory(loggedInPage, factory.name);
    });

    await test.step('Delete the factory', async () => {
      await deleteFactory(loggedInPage, factory.name, FACTORY_NAME_PREFIX);
    });

    await test.step('Check it is gone', async () => {
      await verifyFactoryDeleted(loggedInPage, factory.name);
    });
  });
});