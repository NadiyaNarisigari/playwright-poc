import { test } from '../../fixtures/loginFixture';
import { openSettingsMenu, verifyRole, chooseFleetManagementInMenu } from '../../pages/SettingsMenu';
import { verifyFleetManagementTabs } from '../../pages/FleetManagementPage';

test.describe('Fleet Management', () => {
  // loggedInPage is a page that has already logged in (email, password, OTP)
  test('Administrator can navigate to Fleet Management', async ({ loggedInPage }) => {
    await test.step('Check the user is an Administrator', async () => {
      await openSettingsMenu(loggedInPage);
      await verifyRole(loggedInPage, 'Administrator');
    });

    await test.step('Open Fleet Management', async () => {
      await chooseFleetManagementInMenu(loggedInPage);
      await verifyFleetManagementTabs(loggedInPage);
    });
  });
});