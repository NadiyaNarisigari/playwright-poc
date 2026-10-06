import { test, expect } from '../../fixtures/loginFixture';
import { FleetManagementPage } from '../../pages/FleetManagementPage';
import { FACTORY_NAME_PREFIX } from '../../test-data/factories';

// Deletes one test factory (created by add-factory). Real factories are never touched.
test('Administrator can find and delete a test factory', async ({ page, loggedInPage }) => {
  const fleet = new FleetManagementPage(page);
  const testFactories = fleet.factoryOptionsStartingWith(FACTORY_NAME_PREFIX);

  await fleet.openFromSettingsMenu();
  await fleet.refreshFactoryList();

  await fleet.factoryDropdown.click();
  await expect(
    testFactories.first(),
    `No ${FACTORY_NAME_PREFIX}* factory found. Run add-factory first.`,
  ).toBeVisible();
  const countBefore = await testFactories.count();
  await testFactories.first().click();

  await fleet.deleteSelectedFactory(FACTORY_NAME_PREFIX);

  // After a reload there should be one test factory less
  await page.reload();
  await fleet.factoryDropdown.click();
  await expect(fleet.anyOption.first()).toBeVisible();
  await expect(testFactories).toHaveCount(countBefore - 1);
});