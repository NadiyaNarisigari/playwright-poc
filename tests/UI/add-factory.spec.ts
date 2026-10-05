import { test, expect } from '../../fixtures/loginFixture';
import { AddFactoryPage } from '../../pages/AddFactoryPage';
import { FleetManagementPage } from '../../pages/FleetManagementPage';
import { newFactoryDetails } from '../../test-data/factories';

test('Administrator can create a new factory', async ({ page, loggedInPage }) => {
  const fleet = new FleetManagementPage(page);
  const addFactoryPage = new AddFactoryPage(page);

  await fleet.openFromSettingsMenu();
  await fleet.openAddFactoryDialog();
  await expect(addFactoryPage.modalTitle).toBeVisible();

  await addFactoryPage.fillFactoryForm(newFactoryDetails());

  await expect(addFactoryPage.addButton).toBeEnabled();
  await addFactoryPage.clickAdd();

  // The dialog closes once the factory is saved
  await expect(addFactoryPage.modalTitle).toBeHidden();
});