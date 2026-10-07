import { test } from '../../fixtures/loginFixture';
import { openSettingsMenu, verifyRole, chooseFleetManagementInMenu } from '../../pages/SettingsMenu';
import { verifyFleetManagementTabs } from '../../pages/FleetManagementPage';

test.describe('Fleet Management', () => {
  test('Administrator can navigate to Fleet Management', async ({ page, loggedInPage }) => {
    await test.step('Check the user is an Administrator', async () => {
      await openSettingsMenu(page);
      await verifyRole(page, 'Administrator');
    });

    await test.step('Open Fleet Management', async () => {
      await chooseFleetManagementInMenu(page);
      await verifyFleetManagementTabs(page);
    });
  });
});