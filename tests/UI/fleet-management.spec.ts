import { test, expect } from '../../fixtures/loginFixture';
import { FleetManagementPage } from '../../pages/FleetManagementPage';

test('Administrator can navigate to Fleet Management', async ({ page, loggedInPage }) => {
  const fleet = new FleetManagementPage(page);

  await fleet.settingsMenu.open();
  await expect(fleet.settingsMenu.roleLabel).toHaveText('Administrator');
  await fleet.settingsMenu.fleetManagementItem.click();

  await expect(page).toHaveURL(/\/group/);
  await expect(fleet.factoryTab).toBeVisible();
  await expect(fleet.customerTab).toBeVisible();
});